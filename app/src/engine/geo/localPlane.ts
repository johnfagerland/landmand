import type { LocalPlane, LonLat, XY } from "../types";
import { DEG, FT_PER_M } from "../units";

/**
 * Local tangent plane in feet at `origin` using ellipsoidal metres-per-degree:
 *   mPerDegLat = 111132.92 - 559.82 cos2φ + 1.175 cos4φ - 0.0023 cos6φ
 *   mPerDegLon = 111412.84 cosφ - 93.5 cos3φ + 0.118 cos5φ
 *
 * x grows east, y grows north. `toLonLat` is the exact inverse (no rounding), so a round trip
 * is accurate to floating-point precision; callers round to 7 dp when they store coordinates.
 */
export function createLocalPlane(origin: LonLat): LocalPlane {
  const lon0 = origin[0];
  const lat0 = origin[1];
  const phi = lat0 * DEG;
  const mPerDegLat =
    111132.92 - 559.82 * Math.cos(2 * phi) + 1.175 * Math.cos(4 * phi) - 0.0023 * Math.cos(6 * phi);
  const mPerDegLon = 111412.84 * Math.cos(phi) - 93.5 * Math.cos(3 * phi) + 0.118 * Math.cos(5 * phi);
  const ftPerDegLat = mPerDegLat * FT_PER_M;
  const ftPerDegLon = mPerDegLon * FT_PER_M;
  return {
    origin: [lon0, lat0],
    ftPerDegLon,
    ftPerDegLat,
    toXY(p: LonLat): XY {
      return { x: (p[0] - lon0) * ftPerDegLon, y: (p[1] - lat0) * ftPerDegLat };
    },
    toLonLat(p: XY): LonLat {
      return [lon0 + p.x / ftPerDegLon, lat0 + p.y / ftPerDegLat];
    },
  };
}

/** Arithmetic centroid of points (good enough as a plane origin). Returns [0, 0] for an empty list. */
export function centroidOf(points: LonLat[]): LonLat {
  if (points.length === 0) return [0, 0];
  let sx = 0;
  let sy = 0;
  for (const p of points) {
    sx += p[0];
    sy += p[1];
  }
  return [sx / points.length, sy / points.length];
}
