import type { LocalPlane, LonLat, XY } from "../types";

export class RingError extends Error {
  constructor(
    message: string,
    public readonly code: "too_few_vertices" | "degenerate",
  ) {
    super(message);
    this.name = "RingError";
  }
}

export interface NormalizeOptions {
  /** Consecutive vertices closer than this are merged. Default 1.0 ft. */
  minEdgeFt?: number;
}

export const DEFAULT_MIN_EDGE_FT = 1.0;

/** Round a coordinate to 7 dp (about 1 cm at mid latitudes), normalising -0 to 0. */
export function roundLonLat(p: LonLat): LonLat {
  return [Math.round(p[0] * 1e7) / 1e7 + 0, Math.round(p[1] * 1e7) / 1e7 + 0];
}

function dist(a: XY, b: XY): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/**
 * Drop a repeated closing vertex, merge consecutive vertices closer than minEdgeFt (the last-to-first
 * edge included), force counter-clockwise order, round to 7 dp. Throws RingError if fewer than 3 remain
 * or the ring has (near) zero area.
 *
 * Merging keeps the earlier vertex of a too-short edge and drops the later one.
 */
export function normalizeRing(ring: LonLat[], plane: LocalPlane, opts?: NormalizeOptions): LonLat[] {
  const minEdge = opts?.minEdgeFt ?? DEFAULT_MIN_EDGE_FT;
  const input = ring.slice();
  if (input.length >= 2) {
    const first = input[0];
    const last = input[input.length - 1];
    if (first[0] === last[0] && first[1] === last[1]) input.pop();
  }

  const kept: { lonLat: LonLat; xy: XY }[] = [];
  for (const p of input) {
    const xy = plane.toXY(p);
    if (!Number.isFinite(xy.x) || !Number.isFinite(xy.y)) continue;
    const prev = kept[kept.length - 1];
    if (prev && dist(prev.xy, xy) < minEdge) continue;
    kept.push({ lonLat: p, xy });
  }
  // The closing edge (last -> first) is subject to the same rule.
  while (kept.length >= 3 && dist(kept[kept.length - 1].xy, kept[0].xy) < minEdge) {
    kept.pop();
  }

  if (kept.length < 3) {
    throw new RingError(`Ring has ${kept.length} usable vertices; at least 3 are required`, "too_few_vertices");
  }
  const area = signedArea(kept.map((k) => k.xy));
  if (Math.abs(area) < 1e-6) {
    throw new RingError("Ring has zero area", "degenerate");
  }
  if (area < 0) kept.reverse();
  return kept.map((k) => roundLonLat(k.lonLat));
}

/** Shoelace area of an unclosed ring in the local plane, square feet (always positive). */
export function ringAreaSqFt(ring: LonLat[], plane: LocalPlane): number {
  return Math.abs(signedArea(ring.map((p) => plane.toXY(p))));
}

/** Signed shoelace area of planar points; negative = clockwise. */
export function signedArea(points: XY[]): number {
  const n = points.length;
  if (n < 3) return 0;
  let sum = 0;
  for (let i = 0; i < n; i++) {
    const a = points[i];
    const b = points[(i + 1) % n];
    sum += a.x * b.y - b.x * a.y;
  }
  return sum / 2;
}

export function isClockwise(points: XY[]): boolean {
  return signedArea(points) < 0;
}
