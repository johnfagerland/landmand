import { buffer, kinks, simplify } from "@turf/turf";
import type { Feature, MultiPolygon, Polygon, Position } from "geojson";
import type { LocalPlane, LonLat, XY } from "../types";
import { normalizeRing, RingError, roundLonLat, signedArea } from "./ring";

export type OffsetResult =
  | { ok: true; ring: LonLat[] }
  | { ok: false; reason: "kinks" | "collapsed" | "invalid" };

const PARALLEL_EPS = 1e-9;
/** An offset edge shorter than this (feet) counts as collapsed. */
const MIN_EDGE_FT = 0.01;
/** An offset ring with less area than this (sq ft) counts as collapsed. */
const MIN_AREA_SQFT = 0.01;

/**
 * Miter-offset every edge of a CCW planar ring: edge i is shifted by `offsets[i]` feet to the LEFT of
 * its direction of travel (= inward for a CCW ring), and vertex i is recomputed as the intersection of
 * the shifted edges i-1 and i. Vertex count is preserved. Returns null on a zero-length edge.
 */
function miterOffset(pts: XY[], offsets: number[]): XY[] | null {
  const n = pts.length;
  const lines: { p: XY; u: XY; nrm: XY }[] = [];
  for (let i = 0; i < n; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % n];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy);
    if (len === 0) return null;
    const u = { x: dx / len, y: dy / len };
    const nrm = { x: -u.y, y: u.x }; // left normal
    const off = offsets[i] ?? 0;
    lines.push({ p: { x: a.x + nrm.x * off, y: a.y + nrm.y * off }, u, nrm });
  }
  const out: XY[] = [];
  for (let i = 0; i < n; i++) {
    const prev = lines[(i - 1 + n) % n];
    const cur = lines[i];
    const cross = prev.u.x * cur.u.y - prev.u.y * cur.u.x;
    if (Math.abs(cross) < PARALLEL_EPS) {
      // Collinear neighbours: just slide the vertex along the current edge's normal.
      const off = offsets[i] ?? 0;
      out.push({ x: pts[i].x + cur.nrm.x * off, y: pts[i].y + cur.nrm.y * off });
      continue;
    }
    const qx = cur.p.x - prev.p.x;
    const qy = cur.p.y - prev.p.y;
    const t = (qx * cur.u.y - qy * cur.u.x) / cross;
    out.push({ x: prev.p.x + prev.u.x * t, y: prev.p.y + prev.u.y * t });
  }
  return out;
}

/** Self-intersection, edge reversal or orientation flip: the miter result is not a valid inward offset. */
function isValidOffset(original: XY[], offset: XY[]): boolean {
  const n = original.length;
  if (signedArea(offset) <= MIN_AREA_SQFT) return false;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    const ox = original[j].x - original[i].x;
    const oy = original[j].y - original[i].y;
    const nx = offset[j].x - offset[i].x;
    const ny = offset[j].y - offset[i].y;
    const oLen = Math.hypot(ox, oy);
    // Projection of the new edge onto the old direction: collapsed or reversed edges fail.
    if (oLen === 0 || (ox * nx + oy * ny) / oLen <= MIN_EDGE_FT) return false;
  }
  const coords: Position[] = offset.map((p) => [p.x, p.y]);
  coords.push(coords[0]);
  const poly: Polygon = { type: "Polygon", coordinates: [coords] };
  return kinks(poly).features.length === 0;
}

/** Planar points forced CCW; `reversed` says whether the input order was flipped. */
function toPlanarCCW(ring: LonLat[], plane: LocalPlane): { pts: XY[]; reversed: boolean } | null {
  if (ring.length < 3) return null;
  const pts = ring.map((p) => plane.toXY(p));
  const area = signedArea(pts);
  if (Math.abs(area) < 1e-6) return null;
  const reversed = area < 0;
  if (reversed) pts.reverse();
  return { pts, reversed };
}

function largestRing(feature: Feature<Polygon | MultiPolygon>): Position[] | null {
  const g = feature.geometry;
  if (!g) return null;
  const polys: Position[][][] = g.type === "Polygon" ? [g.coordinates] : g.coordinates;
  let best: Position[] | null = null;
  let bestArea = 0;
  for (const poly of polys) {
    const outer = poly[0];
    if (!outer || outer.length < 4) continue;
    const a = Math.abs(signedArea(outer.map((c) => ({ x: c[0], y: c[1] }))));
    if (a > bestArea) {
      bestArea = a;
      best = outer;
    }
  }
  return best;
}

/**
 * Move every edge of a CCW ring inward by `inwardFt` (miter joins, vertex count preserved).
 * If the result self-intersects, fall back to a negative buffer and simplify; if it collapses, return ok:false.
 * A CW input ring is treated as CCW (reversed) first; the result is always CCW.
 */
export function offsetRing(ring: LonLat[], inwardFt: number, plane: LocalPlane): OffsetResult {
  if (!Number.isFinite(inwardFt)) return { ok: false, reason: "invalid" };
  const planar = toPlanarCCW(ring, plane);
  if (!planar) return { ok: false, reason: "invalid" };
  const pts = planar.pts;
  if (inwardFt === 0) return { ok: true, ring: pts.map((p) => roundLonLat(plane.toLonLat(p))) };

  const offsets = pts.map(() => inwardFt);
  const mitered = miterOffset(pts, offsets);
  if (mitered && isValidOffset(pts, mitered)) {
    return { ok: true, ring: mitered.map((p) => roundLonLat(plane.toLonLat(p))) };
  }
  return bufferFallback(pts, inwardFt, plane);
}

function bufferFallback(pts: XY[], inwardFt: number, plane: LocalPlane): OffsetResult {
  const coords: Position[] = pts.map((p) => plane.toLonLat(p));
  coords.push(coords[0]);
  const polygon: Feature<Polygon> = {
    type: "Feature",
    properties: {},
    geometry: { type: "Polygon", coordinates: [coords] },
  };
  let buffered: Feature<Polygon | MultiPolygon> | undefined;
  try {
    buffered = buffer(polygon, -inwardFt, { units: "feet" });
  } catch {
    return { ok: false, reason: "collapsed" };
  }
  if (!buffered || !buffered.geometry) return { ok: false, reason: "collapsed" };
  const outer = largestRing(buffered);
  if (!outer) return { ok: false, reason: "collapsed" };
  const simplified = simplify(
    { type: "Feature", properties: {}, geometry: { type: "Polygon", coordinates: [outer] } } as Feature<Polygon>,
    { tolerance: 0.25 / plane.ftPerDegLat, highQuality: true },
  );
  const outRing = simplified.geometry.coordinates[0]?.map((c) => [c[0], c[1]] as LonLat) ?? [];
  try {
    return { ok: true, ring: normalizeRing(outRing, plane) };
  } catch (e) {
    if (e instanceof RingError) return { ok: false, reason: "collapsed" };
    throw e;
  }
}

/**
 * Move only the listed edges (by index, edge i runs from vertex i to i+1 IN THE INPUT ORDER) inward by
 * the given feet. The two vertices adjacent to each moved edge are recomputed as intersections of the
 * neighbouring edge lines. No buffer fallback: a self-intersecting or reversed result is reported as "kinks".
 * A CW input is treated as CCW (reversed) first and the result is always CCW, so vertex indices of the
 * result differ from the input's for CW rings; the edge indices are interpreted on the input as given.
 */
export function offsetEdges(ring: LonLat[], inwardFtByEdge: Record<number, number>, plane: LocalPlane): OffsetResult {
  const planar = toPlanarCCW(ring, plane);
  if (!planar) return { ok: false, reason: "invalid" };
  const { pts, reversed } = planar;
  const n = pts.length;
  const offsets = pts.map((_, i) => {
    // Reversing [v0..v(n-1)] maps input edge e (v_e -> v_e+1) to reversed edge (n - 2 - e) mod n.
    const inputEdge = reversed ? (((n - 2 - i) % n) + n) % n : i;
    const v = inwardFtByEdge[inputEdge];
    return typeof v === "number" && Number.isFinite(v) ? v : 0;
  });
  if (offsets.every((o) => o === 0)) return { ok: true, ring: pts.map((p) => roundLonLat(plane.toLonLat(p))) };
  const mitered = miterOffset(pts, offsets);
  if (!mitered) return { ok: false, reason: "invalid" };
  if (!isValidOffset(pts, mitered)) return { ok: false, reason: "kinks" };
  return { ok: true, ring: mitered.map((p) => roundLonLat(plane.toLonLat(p))) };
}
