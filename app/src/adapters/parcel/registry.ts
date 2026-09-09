/**
 * County ArcGIS parcel registry: loads and validates parcel/registry/counties.json.
 * Adding a county = one entry there + one case in live.network.test.ts.
 */
import { z } from "zod";
import type { LonLat } from "@/engine/types";
import type { CountyRegistry, CountyRegistryEntry } from "../types";
import countiesJson from "./registry/counties.json";

const bboxSchema = z
  .tuple([z.number(), z.number(), z.number(), z.number()])
  .refine(([minLon, minLat, maxLon, maxLat]) => minLon < maxLon && minLat < maxLat, "bbox must be [minLon, minLat, maxLon, maxLat]");

export const countyRegistryEntrySchema = z.object({
  fips: z.string().regex(/^\d{5}$/, "5-digit FIPS"),
  name: z.string().min(1),
  state: z.string().length(2),
  provider: z.literal("arcgis"),
  url: z.url().regex(/\/(MapServer|FeatureServer)\/\d+$/, "layer URL must end in /MapServer/<n> or /FeatureServer/<n>"),
  idField: z.string().min(1),
  addressField: z.string().min(1),
  outFields: z.array(z.string().min(1)).min(1),
  bbox: bboxSchema,
  nearbyMeters: z.number().positive().max(1000),
  attribution: z.string().min(1),
  verifiedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  notes: z.string().optional(),
});

export const countyRegistrySchema = z.object({
  version: z.literal(1),
  counties: z.array(countyRegistryEntrySchema).min(1),
});

let cached: CountyRegistry | undefined;

/** Parse + validate any registry document (used by tests and by loadRegistry). */
export function parseRegistry(doc: unknown): CountyRegistry {
  const parsed = countyRegistrySchema.safeParse(doc);
  if (!parsed.success) {
    throw new Error(`counties.json is invalid: ${JSON.stringify(z.treeifyError(parsed.error))}`);
  }
  const seen = new Set<string>();
  for (const c of parsed.data.counties) {
    if (seen.has(c.fips)) throw new Error(`counties.json has a duplicate FIPS ${c.fips}`);
    seen.add(c.fips);
  }
  return parsed.data as CountyRegistry;
}

export function loadRegistry(): CountyRegistry {
  if (!cached) cached = parseRegistry(countiesJson);
  return cached;
}

export function listCounties(): CountyRegistryEntry[] {
  return loadRegistry().counties;
}

export function findByFips(fips: string | undefined): CountyRegistryEntry | undefined {
  if (!fips) return undefined;
  return listCounties().find((c) => c.fips === fips);
}

export function bboxContains(bbox: [number, number, number, number], [lon, lat]: LonLat): boolean {
  return lon >= bbox[0] && lon <= bbox[2] && lat >= bbox[1] && lat <= bbox[3];
}

/** All entries whose bbox contains the point (bboxes of neighbouring counties can overlap). */
export function findAllByPoint(lonLat: LonLat): CountyRegistryEntry[] {
  return listCounties().filter((c) => bboxContains(c.bbox, lonLat));
}

/** First entry whose bbox contains the point. */
export function findByPoint(lonLat: LonLat): CountyRegistryEntry | undefined {
  return findAllByPoint(lonLat)[0];
}
