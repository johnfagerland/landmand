import type { FenceSegment, LocalPlane, LonLat } from "../types";
import { toDegrees, wrap180 } from "../units";

/** Segments between consecutive vertices; when closed, the last segment returns to vertex 0. */
export function segmentsOf(vertices: LonLat[], closed: boolean, plane: LocalPlane): FenceSegment[] {
  const n = vertices.length;
  if (n < 2) return [];
  const count = closed ? n : n - 1;
  const xys = vertices.map((v) => plane.toXY(v));
  const segments: FenceSegment[] = [];
  for (let i = 0; i < count; i++) {
    const j = (i + 1) % n;
    const a = xys[i];
    const b = xys[j];
    segments.push({
      index: i,
      key: segmentKey(vertices[i], vertices[j]),
      a,
      b,
      aLonLat: vertices[i],
      bLonLat: vertices[j],
      lengthFt: Math.hypot(b.x - a.x, b.y - a.y),
      bearingDeg: bearingDeg(a, b),
    });
  }
  return segments;
}

function fixed6(v: number): string {
  // Round first so that values like -0.0000001 do not print as "-0.000000".
  const r = Math.round(v * 1e6) / 1e6 + 0;
  return r.toFixed(6);
}

/**
 * Stable key from endpoints rounded to 6 dp, direction-independent.
 * Format: "lon,lat|lon,lat" with the two endpoints in lexical order, e.g.
 * "-78.645326,35.806691|-78.645615,35.806732".
 */
export function segmentKey(a: LonLat, b: LonLat): string {
  const ka = `${fixed6(a[0])},${fixed6(a[1])}`;
  const kb = `${fixed6(b[0])},${fixed6(b[1])}`;
  return ka <= kb ? `${ka}|${kb}` : `${kb}|${ka}`;
}

/** Bearing in degrees clockwise from north, 0..360, in the local plane. */
export function bearingDeg(a: { x: number; y: number }, b: { x: number; y: number }): number {
  const deg = toDegrees(Math.atan2(b.x - a.x, b.y - a.y));
  const norm = ((deg % 360) + 360) % 360;
  return norm === 360 ? 0 : norm;
}

/** Absolute deflection between incoming and outgoing bearings, 0..180. */
export function deflectionDeg(bearingIn: number, bearingOut: number): number {
  return Math.abs(wrap180(bearingOut - bearingIn));
}

export function totalLengthFt(segments: FenceSegment[]): number {
  let sum = 0;
  for (const s of segments) sum += s.lengthFt;
  return sum;
}
