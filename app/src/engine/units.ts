export const FT_PER_M = 3.280839895;
export const M_PER_FT = 1 / FT_PER_M;
export const DEG = Math.PI / 180;

export function toRadians(deg: number): number {
  return deg * DEG;
}
export function toDegrees(rad: number): number {
  return rad / DEG;
}
/** Round to a step, e.g. roundTo(12.345, 0.1) === 12.3 */
export function roundTo(x: number, step: number): number {
  return Math.round(x / step) * step;
}
/** Wrap an angle difference into [-180, 180]. */
export function wrap180(deg: number): number {
  let d = deg % 360;
  if (d > 180) d -= 360;
  if (d < -180) d += 360;
  return d;
}
export function clamp(x: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, x));
}
