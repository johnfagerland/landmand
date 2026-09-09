/**
 * Regrid parcel API (https://regrid.com/api), optional, enabled only when REGRID_TOKEN is set.
 * Ships DISABLED: no token was available while building, so nothing here has been exercised against the real API.
 *
 * // VERIFY against https://support.regrid.com/api before enabling in production
 *   - endpoints:  GET /api/v2/parcels/address?query=...&token=...&return_geometry=true
 *                 GET /api/v2/parcels/point?lat=..&lon=..&token=...&return_geometry=true
 *   - response:   { parcels: { type: "FeatureCollection", features: [{ geometry, properties: { fields: { parcelnumb, address, ... } } }] } }
 *
 * Address query runs first when number + street are known (the geocoded point sits on the street centreline),
 * then the point query. The token is only ever put on the request URL, never in ids, errors or logs.
 */
import type { MultiPolygon, Polygon } from "geojson";
import type { ParcelCandidate, ParcelLookupInput, ParcelLookupResult, ParcelMatch, ParcelProvider } from "../types";
import { fetchJson, isUpstreamError } from "../http";
import { containsPoint, distanceToPolygonFt, normalizeParcel } from "./normalize";

export const REGRID_BASE = "https://app.regrid.com/api/v2";
export const REGRID_ATTRIBUTION = "Lot lines: Regrid";

interface RegridFeature {
  geometry?: Polygon | MultiPolygon | null;
  properties?: {
    fields?: { parcelnumb?: string | null; address?: string | null; [k: string]: unknown };
    [k: string]: unknown;
  };
}

interface RegridResponse {
  parcels?: { features?: RegridFeature[] };
  error?: unknown;
}

/** Rough CONUS + AK + HI box: Regrid is US-only. */
const US_BBOX: [number, number, number, number] = [-180, 17.5, -64, 72];

export class RegridParcelProvider implements ParcelProvider {
  readonly id = "regrid";

  constructor(
    private readonly tokenSource: () => string | undefined = () => process.env.REGRID_TOKEN,
    private readonly timeoutMs = 8000,
  ) {}

  enabled(): boolean {
    return !!this.tokenSource();
  }

  covers({ lonLat: [lon, lat] }: ParcelLookupInput): boolean {
    return lon >= US_BBOX[0] && lon <= US_BBOX[2] && lat >= US_BBOX[1] && lat <= US_BBOX[3];
  }

  async lookup(input: ParcelLookupInput, signal: AbortSignal): Promise<ParcelLookupResult> {
    const token = this.tokenSource();
    if (!token) return { status: "none", providerId: this.id, reason: "disabled" };
    if (!this.covers(input)) return { status: "none", providerId: this.id, reason: "no_coverage" };

    const attempts: { match: ParcelMatch; url: string }[] = [];
    const number = input.number?.trim();
    const street = input.street?.trim();
    if (number && street) {
      const sp = new URLSearchParams({ query: `${number} ${street}`, token, return_geometry: "true", limit: "5" });
      attempts.push({ match: "address", url: `${REGRID_BASE}/parcels/address?${sp}` });
    }
    const [lon, lat] = input.lonLat;
    const psp = new URLSearchParams({ lat: String(lat), lon: String(lon), token, return_geometry: "true" });
    attempts.push({ match: "point", url: `${REGRID_BASE}/parcels/point?${psp}` });

    try {
      for (const a of attempts) {
        if (signal.aborted) return { status: "none", providerId: this.id, reason: "timeout" };
        const res = await fetchJson<RegridResponse>(a.url, { signal, headers: { accept: "application/json" } }, { timeoutMs: this.timeoutMs });
        const candidates = this.toCandidates(res.parcels?.features ?? [], a.match, input);
        if (candidates.length > 0) return { status: "found", providerId: this.id, candidates };
      }
      return { status: "none", providerId: this.id, reason: "no_match" };
    } catch (err) {
      const reason = isUpstreamError(err) && err.kind === "timeout" ? "timeout" : "upstream_error";
      return { status: "none", providerId: this.id, reason };
    }
  }

  private toCandidates(features: RegridFeature[], match: ParcelMatch, input: ParcelLookupInput): ParcelCandidate[] {
    const fetchedAt = new Date().toISOString();
    const wanted = input.number && input.street ? `${input.number} ${input.street}`.toUpperCase().replace(/\s+/g, " ").trim() : "";
    const out: ParcelCandidate[] = [];
    for (const f of features) {
      const geometry = f.geometry ?? null;
      if (!geometry || (geometry.type !== "Polygon" && geometry.type !== "MultiPolygon")) continue;
      const fields = f.properties?.fields ?? {};
      const parcel = normalizeParcel({
        geometry,
        providerId: this.id,
        source: "regrid",
        attribution: REGRID_ATTRIBUTION,
        apn: fields.parcelnumb ?? undefined,
        siteAddress: fields.address ?? undefined,
        point: input.lonLat,
        fetchedAt,
      });
      if (!parcel) continue;
      const inside = containsPoint(input.lonLat, geometry);
      const distanceFt = inside ? 0 : Number(distanceToPolygonFt(input.lonLat, geometry).toFixed(1));
      const addr = String(fields.address ?? "").toUpperCase().replace(/\s+/g, " ").trim();
      const score =
        match === "address" ? (addr === wanted ? 100 : 90) : inside ? 80 : Number((70 - distanceFt / 10).toFixed(2));
      out.push({ parcel, match: match === "point" && !inside ? "nearby" : match, distanceFt, score });
    }
    return out.sort((a, b) => b.score - a.score || a.distanceFt - b.distanceFt);
  }
}
