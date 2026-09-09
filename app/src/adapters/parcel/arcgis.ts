/**
 * Generic ArcGIS REST parcel provider, one instance per counties.json entry.
 *
 * Strategy order (first one with features wins):
 *   1. attribute query  UPPER(<addressField>) LIKE '<NUMBER> <STREET>%'  (geocoded points sit on the street centreline)
 *   2. point intersect
 *   3. point within <nearbyMeters>
 * Point geometry is ALWAYS JSON ({x,y,spatialReference}) — the "lon,lat" shorthand returns nothing on some servers.
 * Requests are POST form-urlencoded (no URL-length limits). f=geojson first; on a server error retry f=json and convert rings.
 */
import type { MultiPolygon, Polygon } from "geojson";
import type { LonLat, Parcel } from "@/engine/types";
import type { CountyRegistryEntry, ParcelCandidate, ParcelLookupInput, ParcelLookupResult, ParcelMatch, ParcelNoneReason, ParcelProvider } from "../types";
import { FORM_HEADERS, UpstreamError, fetchJson, formBody, isUpstreamError } from "../http";
import { bboxContains } from "./registry";
import { containsPoint, distanceToPolygonFt, isEsriPolygon, normalizeParcel, toGeoJsonPolygonal, type EsriPolygon } from "./normalize";

export interface ArcGisFeature {
  geometry: Polygon | MultiPolygon | null;
  attributes: Record<string, unknown>;
}

interface ArcGisErrorBody {
  error?: { code?: number; message?: string; details?: string[] };
}

interface GeoJsonResponse extends ArcGisErrorBody {
  type?: string;
  features?: { geometry: Polygon | MultiPolygon | null; properties: Record<string, unknown> | null }[];
}

interface EsriResponse extends ArcGisErrorBody {
  features?: { attributes: Record<string, unknown>; geometry: EsriPolygon | null }[];
}

/** Uppercase, collapse whitespace, double single quotes (SQL literal), keep only safe characters. */
export function likePrefix(number: string, street: string): string {
  const raw = `${number} ${street}`
    .toUpperCase()
    .replace(/[^A-Z0-9 '\-./]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return raw.replace(/'/g, "''");
}

export function addressWhere(addressField: string, number: string, street: string): string {
  return `UPPER(${addressField}) LIKE '${likePrefix(number, street)}%'`;
}

export function pointGeometryJson([lon, lat]: LonLat): string {
  return JSON.stringify({ x: lon, y: lat, spatialReference: { wkid: 4326 } });
}

function normalizeAddress(s: unknown): string {
  return String(s ?? "")
    .toUpperCase()
    .replace(/\s+/g, " ")
    .trim();
}

function isEsriPolygonal(g: unknown): g is EsriPolygon {
  return isEsriPolygon(g);
}

export class ArcGisParcelProvider implements ParcelProvider {
  readonly id: string;

  constructor(
    readonly entry: CountyRegistryEntry,
    private readonly timeoutMs = 8000,
  ) {
    this.id = `county:${entry.fips}`;
  }

  enabled(): boolean {
    return true;
  }

  covers(input: ParcelLookupInput): boolean {
    if (input.countyFips) return input.countyFips === this.entry.fips;
    return bboxContains(this.entry.bbox, input.lonLat);
  }

  async lookup(input: ParcelLookupInput, signal: AbortSignal): Promise<ParcelLookupResult> {
    if (!this.covers(input)) return { status: "none", providerId: this.id, reason: "no_coverage" };

    const number = input.number?.trim();
    const street = input.street?.trim();
    const strategies: { match: ParcelMatch; params: Record<string, string> }[] = [];
    if (number && street) {
      strategies.push({ match: "address", params: { where: addressWhere(this.entry.addressField, number, street) } });
    }
    const pointParams = {
      geometry: pointGeometryJson(input.lonLat),
      geometryType: "esriGeometryPoint",
      inSR: "4326",
      spatialRel: "esriSpatialRelIntersects",
    };
    strategies.push({ match: "point", params: pointParams });
    strategies.push({
      match: "nearby",
      params: { ...pointParams, distance: String(this.entry.nearbyMeters), units: "esriSRUnit_Meter" },
    });

    let lastReason: ParcelNoneReason = "no_match";
    for (const s of strategies) {
      if (signal.aborted) return { status: "none", providerId: this.id, reason: "timeout" };
      try {
        const features = await this.query(s.params, signal);
        const candidates = this.toCandidates(features, s.match, input);
        if (candidates.length > 0) return { status: "found", providerId: this.id, candidates };
      } catch (err) {
        lastReason = isUpstreamError(err) && err.kind === "timeout" ? "timeout" : "upstream_error";
        if (lastReason === "timeout" || signal.aborted) return { status: "none", providerId: this.id, reason: "timeout" };
        // an upstream error on one strategy (e.g. unsupported where clause) should not stop the next one
      }
    }
    return { status: "none", providerId: this.id, reason: lastReason };
  }

  private baseParams(): Record<string, string> {
    return {
      outFields: this.entry.outFields.join(","),
      outSR: "4326",
      geometryPrecision: "8",
      returnGeometry: "true",
    };
  }

  private async post<T>(params: Record<string, string>, signal: AbortSignal): Promise<T> {
    return fetchJson<T>(
      `${this.entry.url}/query`,
      { method: "POST", headers: FORM_HEADERS, body: formBody(params), signal },
      { timeoutMs: this.timeoutMs },
    );
  }

  /** Query the layer; returns features with GeoJSON geometry. Falls back from f=geojson to f=json on a server error. */
  async query(params: Record<string, string>, signal: AbortSignal): Promise<ArcGisFeature[]> {
    const base = { ...this.baseParams(), ...params };
    let geoJsonError: UpstreamError | undefined;
    try {
      const res = await this.post<GeoJsonResponse>({ ...base, f: "geojson" }, signal);
      if (!res.error) {
        return (res.features ?? []).map((f) => ({ geometry: f.geometry ?? null, attributes: f.properties ?? {} }));
      }
      geoJsonError = new UpstreamError("upstream", `ArcGIS error ${res.error.code ?? ""}: ${res.error.message ?? "unknown"}`);
    } catch (err) {
      if (isUpstreamError(err) && err.kind === "timeout") throw err;
      geoJsonError = isUpstreamError(err) ? err : new UpstreamError("upstream", String(err));
    }

    const res = await this.post<EsriResponse>({ ...base, f: "json" }, signal);
    if (res.error) {
      throw new UpstreamError("upstream", `ArcGIS error ${res.error.code ?? ""}: ${res.error.message ?? geoJsonError.message}`);
    }
    return (res.features ?? []).map((f) => ({
      geometry: isEsriPolygonal(f.geometry) ? toGeoJsonPolygonal(f.geometry) : null,
      attributes: f.attributes ?? {},
    }));
  }

  private toCandidates(features: ArcGisFeature[], match: ParcelMatch, input: ParcelLookupInput): ParcelCandidate[] {
    const fetchedAt = new Date().toISOString();
    const wanted = input.number && input.street ? normalizeAddress(`${input.number} ${input.street}`) : "";
    const seen = new Set<string>();
    const out: ParcelCandidate[] = [];

    for (const f of features) {
      if (!f.geometry) continue;
      const apnRaw = f.attributes[this.entry.idField];
      const apn = apnRaw === undefined || apnRaw === null ? undefined : String(apnRaw).trim();
      const siteAddress = f.attributes[this.entry.addressField];
      const parcel: Parcel | null = normalizeParcel({
        geometry: f.geometry,
        providerId: this.id,
        source: "county",
        attribution: this.entry.attribution,
        apn,
        siteAddress: siteAddress === undefined || siteAddress === null ? undefined : String(siteAddress),
        point: input.lonLat,
        fetchedAt,
      });
      if (!parcel) continue;
      const key = parcel.apn ?? JSON.stringify(parcel.ring);
      if (seen.has(key)) continue;
      seen.add(key);

      const inside = containsPoint(input.lonLat, f.geometry);
      const distanceFt = inside ? 0 : Number(distanceToPolygonFt(input.lonLat, f.geometry).toFixed(1));
      let score: number;
      if (match === "address") {
        score = normalizeAddress(siteAddress) === wanted ? 100 : 90;
      } else if (match === "point") {
        score = 80;
      } else {
        score = Number((70 - (Number.isFinite(distanceFt) ? distanceFt : 1000) / 10).toFixed(2));
      }
      out.push({ parcel, match, distanceFt: Number.isFinite(distanceFt) ? distanceFt : 0, score });
    }

    return out.sort((a, b) => b.score - a.score || a.distanceFt - b.distanceFt);
  }
}
