/**
 * USGS 3DEP elevation via the ImageServer getSamples endpoint (multipoint, no key).
 * Values come back as STRINGS in metres ("NoData" possible); locationId preserves order within a chunk.
 * `resolution` is in output-SR units (degrees for wkid 4326) and is converted approximately to metres.
 * Never throws: failures become nulls, and source 'none' when every chunk failed.
 */
import type { LonLat } from "@/engine/types";
import type { ElevationProvider, ElevationResult } from "../types";
import { FORM_HEADERS, fetchJson, formBody } from "../http";

export const THREEDEP_URL = "https://elevation.nationalmap.gov/arcgis/rest/services/3DEPElevation/ImageServer/getSamples";
export const FT_PER_M = 3.280839895;
export const CHUNK_SIZE = 150;
const M_PER_DEG = 111_320;

interface Sample {
  locationId?: number;
  value?: string | number;
  resolution?: number | string;
}

interface GetSamplesResponse {
  samples?: Sample[];
  error?: { code?: number; message?: string };
}

export function metresToFeet(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  const text = typeof value === "number" ? "" : String(value).trim();
  if (typeof value !== "number" && text === "") return null;
  const n = typeof value === "number" ? value : Number(text);
  if (!Number.isFinite(n)) return null; // "NoData", NaN
  if (n < -1000 || n > 10_000) return null; // sentinels / garbage (Dead Sea is -430 m, Everest 8849 m)
  return Number((n * FT_PER_M).toFixed(2));
}

/** ArcGIS reports `resolution` in the output SR's units; for 4326 that is degrees. */
export function resolutionToMetres(res: unknown): number | undefined {
  const n = typeof res === "number" ? res : Number(res);
  if (!Number.isFinite(n) || n <= 0) return undefined;
  const m = n < 1 ? n * M_PER_DEG : n; // > 1 would already be in metres (projected output)
  return Number(m.toFixed(2));
}

export function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

export class ThreeDepElevationProvider implements ElevationProvider {
  readonly id = "3dep";

  constructor(
    private readonly timeoutMs = 12000,
    private readonly url = THREEDEP_URL,
  ) {}

  async sample(points: LonLat[], signal: AbortSignal): Promise<ElevationResult> {
    if (points.length === 0) return { source: "3dep", elevationsFt: [] };
    const chunks = chunk(points, CHUNK_SIZE);
    const results = await Promise.all(chunks.map((c) => this.sampleChunk(c, signal)));

    let resolutionM: number | undefined;
    let okChunks = 0;
    // Rebuild in input order: a failed chunk contributes nulls of the right length.
    const ordered: (number | null)[] = [];
    results.forEach((r, i) => {
      if (r) {
        okChunks++;
        ordered.push(...r.elevationsFt);
        if (resolutionM === undefined && r.resolutionM !== undefined) resolutionM = r.resolutionM;
      } else {
        ordered.push(...chunks[i].map(() => null));
      }
    });
    if (okChunks === 0) return { source: "none", elevationsFt: ordered };
    return { source: "3dep", elevationsFt: ordered, ...(resolutionM !== undefined ? { resolutionM } : {}) };
  }

  private async sampleChunk(points: LonLat[], signal: AbortSignal): Promise<{ elevationsFt: (number | null)[]; resolutionM?: number } | null> {
    try {
      const body = formBody({
        geometry: JSON.stringify({ points: points.map(([lon, lat]) => [lon, lat]), spatialReference: { wkid: 4326 } }),
        geometryType: "esriGeometryMultipoint",
        returnFirstValueOnly: "true",
        f: "json",
      });
      const res = await fetchJson<GetSamplesResponse>(this.url, { method: "POST", headers: FORM_HEADERS, body, signal }, { timeoutMs: this.timeoutMs });
      if (res.error || !Array.isArray(res.samples)) return null;

      const elevationsFt: (number | null)[] = points.map(() => null);
      let resolutionM: number | undefined;
      res.samples.forEach((s, i) => {
        const idx = typeof s.locationId === "number" && s.locationId >= 0 && s.locationId < points.length ? s.locationId : i;
        if (idx < points.length && elevationsFt[idx] === null) elevationsFt[idx] = metresToFeet(s.value);
        if (resolutionM === undefined) resolutionM = resolutionToMetres(s.resolution);
      });
      return { elevationsFt, ...(resolutionM !== undefined ? { resolutionM } : {}) };
    } catch {
      return null;
    }
  }
}

export const threeDepProvider = new ThreeDepElevationProvider();
