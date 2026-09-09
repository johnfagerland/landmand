/**
 * US Census Bureau geocoder (no key). One call returns lon/lat, the address components and the county FIPS.
 * Note: the returned point lies on the TIGER street centreline, so parcel lookup must be address-first.
 */
import type { LonLat } from "@/engine/types";
import type { GeocodeResult, Geocoder } from "../types";
import { fetchJson } from "../http";

const CENSUS_URL = "https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress";

interface CensusAddressMatch {
  matchedAddress?: string;
  coordinates?: { x?: number; y?: number };
  addressComponents?: {
    fromAddress?: string;
    toAddress?: string;
    preQualifier?: string;
    preDirection?: string;
    preType?: string;
    streetName?: string;
    suffixType?: string;
    suffixDirection?: string;
    suffixQualifier?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  geographies?: { Counties?: { GEOID?: string }[] };
}

interface CensusResponse {
  result?: { addressMatches?: CensusAddressMatch[] };
}

function collapse(parts: (string | undefined)[]): string {
  return parts
    .map((p) => (p ?? "").trim())
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .toUpperCase();
}

/**
 * The house number: the leading digits of matchedAddress. `fromAddress` is the START of the TIGER
 * address range (e.g. 1801 for 1823 White Oak Rd), so it is only a last-resort fallback.
 */
function houseNumber(m: CensusAddressMatch): string {
  const lead = /^\s*(\d+[A-Z]?)\b/i.exec(m.matchedAddress ?? "");
  if (lead) return lead[1].toUpperCase();
  return (m.addressComponents?.fromAddress ?? "").trim();
}

export function mapCensusMatch(m: CensusAddressMatch): GeocodeResult | null {
  const x = m.coordinates?.x;
  const y = m.coordinates?.y;
  if (typeof x !== "number" || typeof y !== "number" || !Number.isFinite(x) || !Number.isFinite(y)) return null;
  const c = m.addressComponents ?? {};
  const lonLat: LonLat = [Number(x.toFixed(7)), Number(y.toFixed(7))];
  const geoid = m.geographies?.Counties?.[0]?.GEOID;
  const countyFips = typeof geoid === "string" && /^\d{5}$/.test(geoid) ? geoid : undefined;
  return {
    lonLat,
    matched: (m.matchedAddress ?? "").trim(),
    number: houseNumber(m),
    street: collapse([c.preDirection, c.preType, c.streetName, c.suffixType, c.suffixDirection]),
    city: (c.city ?? "").trim(),
    state: (c.state ?? "").trim().toUpperCase(),
    zip: (c.zip ?? "").trim(),
    ...(countyFips ? { countyFips } : {}),
  };
}

export function censusUrl(query: string): string {
  const sp = new URLSearchParams({
    address: query,
    benchmark: "Public_AR_Current",
    vintage: "Current_Current",
    layers: "Counties",
    format: "json",
  });
  return `${CENSUS_URL}?${sp.toString()}`;
}

export class CensusGeocoder implements Geocoder {
  readonly id = "census";

  constructor(private readonly timeoutMs = 8000) {}

  /** null when the geocoder has no match; throws UpstreamError on transport failure. */
  async geocode(query: string, signal: AbortSignal): Promise<GeocodeResult | null> {
    const json = await fetchJson<CensusResponse>(
      censusUrl(query.trim()),
      { signal, headers: { accept: "application/json" } },
      { timeoutMs: this.timeoutMs },
    );
    const matches = json.result?.addressMatches ?? [];
    for (const m of matches) {
      const mapped = mapCensusMatch(m);
      if (mapped) return mapped;
    }
    return null;
  }
}

export const censusGeocoder = new CensusGeocoder();
