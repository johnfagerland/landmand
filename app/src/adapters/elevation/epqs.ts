/**
 * USGS Elevation Point Query Service (EPQS), one request per point (~1 s each). Fallback only.
 * Concurrency 4, hard cap of 60 points per call (points beyond the cap come back null). Never throws.
 */
import type { LonLat } from "@/engine/types";
import type { ElevationProvider, ElevationResult } from "../types";
import { fetchJson } from "../http";

export const EPQS_URL = "https://epqs.nationalmap.gov/v1/json";
export const EPQS_MAX_POINTS = 60;
export const EPQS_CONCURRENCY = 4;
const SENTINEL_BELOW = -1000;

interface EpqsResponse {
  value?: number | string | null;
  resolution?: number | string;
}

export function epqsUrl([lon, lat]: LonLat, base = EPQS_URL): string {
  const sp = new URLSearchParams({ x: String(lon), y: String(lat), units: "Feet", wkid: "4326", includeDate: "false" });
  return `${base}?${sp}`;
}

export function parseEpqsValue(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  if (typeof value !== "number" && String(value).trim() === "") return null;
  const n = typeof value === "number" ? value : Number(String(value).trim());
  if (!Number.isFinite(n) || n < SENTINEL_BELOW) return null;
  return Number(n.toFixed(2));
}

async function mapWithConcurrency<T, R>(items: T[], limit: number, fn: (item: T, index: number) => Promise<R>): Promise<R[]> {
  const out = new Array<R>(items.length);
  let next = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const i = next++;
      out[i] = await fn(items[i], i);
    }
  });
  await Promise.all(workers);
  return out;
}

export class EpqsElevationProvider implements ElevationProvider {
  readonly id = "epqs";

  constructor(
    private readonly timeoutMs = 8000,
    private readonly url = EPQS_URL,
  ) {}

  async sample(points: LonLat[], signal: AbortSignal): Promise<ElevationResult> {
    if (points.length === 0) return { source: "epqs", elevationsFt: [] };
    const head = points.slice(0, EPQS_MAX_POINTS);
    let okCount = 0;
    let resolutionM: number | undefined;

    const values = await mapWithConcurrency(head, EPQS_CONCURRENCY, async (p) => {
      if (signal.aborted) return null;
      try {
        const res = await fetchJson<EpqsResponse>(epqsUrl(p, this.url), { signal, headers: { accept: "application/json" } }, { timeoutMs: this.timeoutMs });
        okCount++;
        const r = typeof res.resolution === "number" ? res.resolution : Number(res.resolution);
        if (resolutionM === undefined && Number.isFinite(r) && r > 0) resolutionM = Number((r < 1 ? r * 111_320 : r).toFixed(2));
        return parseEpqsValue(res.value);
      } catch {
        return null;
      }
    });

    const elevationsFt: (number | null)[] = [...values, ...points.slice(EPQS_MAX_POINTS).map(() => null)];
    if (okCount === 0) return { source: "none", elevationsFt };
    return { source: "epqs", elevationsFt, ...(resolutionM !== undefined ? { resolutionM } : {}) };
  }
}

export const epqsProvider = new EpqsElevationProvider();
