import type { LocalPlane, LonLat, XY } from "../types";

export interface SnapHit {
  kind: "vertex" | "edge";
  point: XY;
  lonLat: LonLat;
  distanceFt: number;
  /** For "vertex": the vertex index. For "edge": the segment index (edge i = vertex i -> i+1). */
  index: number;
  /** For "edge": position along the segment, 0..1. */
  t?: number;
}

/** Nearest vertex of `vertices` to p. Returns null for an empty list. */
export function nearestVertex(p: LonLat, vertices: LonLat[], plane: LocalPlane): SnapHit | null {
  if (vertices.length === 0) return null;
  const q = plane.toXY(p);
  let best: SnapHit | null = null;
  for (let i = 0; i < vertices.length; i++) {
    const v = plane.toXY(vertices[i]);
    const d = Math.hypot(v.x - q.x, v.y - q.y);
    if (!best || d < best.distanceFt) {
      best = { kind: "vertex", point: v, lonLat: vertices[i], distanceFt: d, index: i };
    }
  }
  return best;
}

/** Nearest point on any edge of the ring/line to p. Returns null for fewer than 2 vertices. */
export function nearestPointOnRing(p: LonLat, vertices: LonLat[], closed: boolean, plane: LocalPlane): SnapHit | null {
  const n = vertices.length;
  if (n < 2) return null;
  const q = plane.toXY(p);
  const xys = vertices.map((v) => plane.toXY(v));
  const edges = closed ? n : n - 1;
  let best: SnapHit | null = null;
  for (let i = 0; i < edges; i++) {
    const a = xys[i];
    const b = xys[(i + 1) % n];
    const hit = projectPointToSegment(q, a, b);
    if (!best || hit.distance < best.distanceFt) {
      best = {
        kind: "edge",
        point: hit.point,
        lonLat: plane.toLonLat(hit.point),
        distanceFt: hit.distance,
        index: i,
        t: hit.t,
      };
    }
  }
  return best;
}

/** Project p onto segment ab; t is clamped to [0, 1]. */
export function projectPointToSegment(p: XY, a: XY, b: XY): { point: XY; t: number; distance: number } {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len2 = dx * dx + dy * dy;
  let t = 0;
  if (len2 > 0) {
    t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / len2;
    t = Math.min(1, Math.max(0, t));
  }
  const point = { x: a.x + t * dx, y: a.y + t * dy };
  return { point, t, distance: Math.hypot(p.x - point.x, p.y - point.y) };
}
