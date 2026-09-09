/**
 * GeoJSON / Esri polygon -> engine Parcel.
 *  - Esri rings (outer CW, holes CCW) are regrouped into GeoJSON polygons.
 *  - MultiPolygon: the part containing the lookup point wins, else the largest.
 *  - Exterior ring: closing duplicate dropped, consecutive points closer than MERGE_METERS merged,
 *    forced counter-clockwise, rounded to 7 dp.
 *  - Area via geodesic turf.area (m^2 -> sq ft); origin = centroid.
 */
import {
  area as turfArea,
  booleanClockwise,
  booleanPointInPolygon,
  centroid as turfCentroid,
  distance as turfDistance,
  pointToPolygonDistance,
  polygon as turfPolygon,
} from "@turf/turf";
import type { MultiPolygon, Polygon, Position } from "geojson";
import type { LonLat, Parcel, ParcelSource } from "@/engine/types";

export const MERGE_METERS = 0.3;
const SQ_FT_PER_SQ_M = 10.763910417;

export interface EsriPolygon {
  rings: Position[][];
}

export interface NormalizeInput {
  geometry: Polygon | MultiPolygon | EsriPolygon | null | undefined;
  providerId: string;
  source: ParcelSource;
  attribution: string;
  apn?: string;
  siteAddress?: string;
  /** Lookup point: picks the multipolygon part that contains it. */
  point?: LonLat;
  fetchedAt?: string;
}

function round7(n: number): number {
  return Number(n.toFixed(7));
}

function samePosition(a: Position, b: Position): boolean {
  return a[0] === b[0] && a[1] === b[1];
}

function isFinitePosition(p: unknown): p is Position {
  return Array.isArray(p) && p.length >= 2 && Number.isFinite(p[0]) && Number.isFinite(p[1]);
}

function closeRing(ring: Position[]): Position[] {
  if (ring.length === 0) return ring;
  return samePosition(ring[0], ring[ring.length - 1]) ? ring : [...ring, ring[0]];
}

export function isEsriPolygon(g: unknown): g is EsriPolygon {
  return !!g && typeof g === "object" && Array.isArray((g as EsriPolygon).rings);
}

/** Esri JSON polygon (outer rings CW, holes CCW) -> GeoJSON Polygon/MultiPolygon. */
export function esriRingsToGeoJson(rings: Position[][]): Polygon | MultiPolygon | null {
  const outers: Position[][] = [];
  const holes: Position[][] = [];
  for (const raw of rings) {
    const ring = closeRing(raw.filter(isFinitePosition).map((p) => [p[0], p[1]]));
    if (ring.length < 4) continue;
    (booleanClockwise(ring) ? outers : holes).push(ring);
  }
  // Some servers emit CCW exteriors; without any CW ring treat everything as an outer.
  if (outers.length === 0) {
    outers.push(...holes);
    holes.length = 0;
  }
  if (outers.length === 0) return null;

  const polys: Position[][][] = outers.map((o) => [o]);
  for (const hole of holes) {
    const idx = polys.findIndex((p) => booleanPointInPolygon(hole[0], turfPolygon([p[0]])));
    if (idx >= 0) polys[idx].push(hole);
    else polys.push([hole]); // orphan ring: keep it as its own part rather than lose geometry
  }
  return polys.length === 1 ? { type: "Polygon", coordinates: polys[0] } : { type: "MultiPolygon", coordinates: polys };
}

export function toGeoJsonPolygonal(geometry: NormalizeInput["geometry"]): Polygon | MultiPolygon | null {
  if (!geometry) return null;
  if (isEsriPolygon(geometry)) return esriRingsToGeoJson(geometry.rings);
  if (geometry.type === "Polygon" || geometry.type === "MultiPolygon") return geometry;
  return null;
}

function partArea(coords: Position[][]): number {
  try {
    return turfArea(turfPolygon(coords));
  } catch {
    return 0;
  }
}

/** The polygon part that contains the point, else the largest part. */
export function pickPart(geometry: Polygon | MultiPolygon, point?: LonLat): Position[][] | null {
  const parts = geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;
  const valid = parts.filter((p) => p.length > 0 && p[0].length >= 4);
  if (valid.length === 0) return null;
  if (valid.length === 1) return valid[0];
  if (point) {
    for (const p of valid) {
      try {
        if (booleanPointInPolygon(point, turfPolygon(p))) return p;
      } catch {
        /* skip malformed part */
      }
    }
  }
  return valid.reduce((best, p) => (partArea(p) > partArea(best) ? p : best), valid[0]);
}

/** Drop the closing duplicate and merge consecutive points closer than `mergeMeters` (wrapping around the end). */
export function cleanRing(ring: Position[], mergeMeters = MERGE_METERS): Position[] {
  const pts = ring.filter(isFinitePosition).map((p): Position => [p[0], p[1]]);
  if (pts.length > 1 && samePosition(pts[0], pts[pts.length - 1])) pts.pop();
  const out: Position[] = [];
  for (const p of pts) {
    const prev = out[out.length - 1];
    if (prev && turfDistance(prev, p, { units: "meters" }) < mergeMeters) continue;
    out.push(p);
  }
  while (out.length > 1 && turfDistance(out[out.length - 1], out[0], { units: "meters" }) < mergeMeters) out.pop();
  return out;
}

/** Ring in the requested orientation (unclosed in, unclosed out); the first vertex stays first. */
export function orient(ring: Position[], clockwise: boolean): Position[] {
  if (ring.length < 3) return ring;
  const isCw = booleanClockwise(closeRing(ring));
  return isCw === clockwise ? ring : [ring[0], ...ring.slice(1).reverse()];
}

function toLonLat(p: Position): LonLat {
  return [round7(p[0]), round7(p[1])];
}

/** Distance in feet from a point to a polygon's boundary; 0 when the point is inside. */
export function distanceToPolygonFt(point: LonLat, geometry: Polygon | MultiPolygon): number {
  try {
    const d = pointToPolygonDistance(point, geometry, { units: "feet" });
    return Number.isFinite(d) ? Math.max(0, d) : Number.POSITIVE_INFINITY;
  } catch {
    return Number.POSITIVE_INFINITY;
  }
}

export function containsPoint(point: LonLat, geometry: Polygon | MultiPolygon): boolean {
  try {
    return booleanPointInPolygon(point, geometry);
  } catch {
    return false;
  }
}

/** Returns null when the geometry has no usable exterior ring (fewer than 3 distinct vertices). */
export function normalizeParcel(input: NormalizeInput): Parcel | null {
  const geometry = toGeoJsonPolygonal(input.geometry);
  if (!geometry) return null;
  const part = pickPart(geometry, input.point);
  if (!part) return null;

  const exterior = orient(cleanRing(part[0]), false);
  if (exterior.length < 3) return null;
  const holes = part
    .slice(1)
    .map((h) => orient(cleanRing(h), true))
    .filter((h) => h.length >= 3);

  const ring = exterior.map(toLonLat);
  const closedRing = closeRing(ring);
  const closedHoles = holes.map((h) => closeRing(h.map(toLonLat)));

  let areaSqFt = 0;
  let origin: LonLat = ring[0];
  try {
    const poly = turfPolygon([closedRing, ...closedHoles]);
    areaSqFt = Number((turfArea(poly) * SQ_FT_PER_SQ_M).toFixed(1));
    const c = turfCentroid(poly).geometry.coordinates;
    origin = toLonLat(c);
  } catch {
    // keep the fallbacks: area 0, origin = first vertex
  }

  const apn = input.apn?.trim() || undefined;
  return {
    id: `${input.providerId}:${apn ?? "unknown"}`,
    source: input.source,
    providerId: input.providerId,
    attribution: input.attribution,
    ...(apn ? { apn } : {}),
    ...(input.siteAddress?.trim() ? { siteAddress: input.siteAddress.trim() } : {}),
    ring,
    holes: holes.map((h) => h.map(toLonLat)),
    areaSqFt,
    origin,
    fetchedAt: input.fetchedAt ?? new Date().toISOString(),
  };
}
