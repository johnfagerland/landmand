/**
 * Server-only data-provider interfaces. Node fetch only: no React, Next, DOM or map imports under src/adapters.
 * FROZEN during wave 1.
 */
import type { LonLat, Parcel } from "@/engine/types";

export interface GeocodeResult {
  lonLat: LonLat;
  /** Full matched address string from the geocoder. */
  matched: string;
  /** House number, e.g. "1823" */
  number: string;
  /** Street name with suffix, uppercase, e.g. "WHITE OAK RD" */
  street: string;
  city: string;
  state: string;
  zip: string;
  /** 5-digit county FIPS when the geocoder returns it. */
  countyFips?: string;
}

export interface Geocoder {
  id: string;
  /** Returns null when no match; throws only on transport failure (callers map to 'upstream'). */
  geocode(query: string, signal: AbortSignal): Promise<GeocodeResult | null>;
}

export interface ParcelLookupInput {
  lonLat: LonLat;
  number?: string;
  street?: string;
  countyFips?: string;
}

export type ParcelMatch = "address" | "point" | "nearby";

export interface ParcelCandidate {
  parcel: Parcel;
  match: ParcelMatch;
  /** Distance from the lookup point to the parcel (0 when it contains the point). */
  distanceFt: number;
  /** address exact 100, address prefix 90, contains point 80, nearby 70 - distanceFt/10 */
  score: number;
}

export type ParcelNoneReason = "disabled" | "no_coverage" | "no_match" | "timeout" | "upstream_error";

export type ParcelLookupResult =
  | { status: "found"; providerId: string; candidates: ParcelCandidate[] }
  | { status: "none"; providerId: string; reason: ParcelNoneReason };

export interface ParcelProvider {
  id: string;
  enabled(): boolean;
  covers(input: ParcelLookupInput): boolean;
  /** Never throws: transport failures become { status: 'none', reason: 'upstream_error' | 'timeout' }. */
  lookup(input: ParcelLookupInput, signal: AbortSignal): Promise<ParcelLookupResult>;
}

export type ElevationSourceId = "3dep" | "epqs" | "none";

export interface ElevationResult {
  source: ElevationSourceId;
  /** Same length and order as the input points; null where no data. */
  elevationsFt: (number | null)[];
  resolutionM?: number;
}

export interface ElevationProvider {
  id: string;
  /** Never throws; returns source 'none' with all nulls on failure. */
  sample(points: LonLat[], signal: AbortSignal): Promise<ElevationResult>;
}

/** One entry of parcel/registry/counties.json */
export interface CountyRegistryEntry {
  /** 5-digit FIPS */
  fips: string;
  name: string;
  state: string;
  provider: "arcgis";
  /** ArcGIS REST layer URL ending in /MapServer/<n> or /FeatureServer/<n> */
  url: string;
  idField: string;
  addressField: string;
  outFields: string[];
  /** [minLon, minLat, maxLon, maxLat] */
  bbox: [number, number, number, number];
  nearbyMeters: number;
  attribution: string;
  verifiedOn: string;
  notes?: string;
}

export interface CountyRegistry {
  version: 1;
  counties: CountyRegistryEntry[];
}
