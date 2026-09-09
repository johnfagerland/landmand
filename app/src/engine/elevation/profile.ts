import type { ElevationProfile, ElevationSample, ElevationSource, FenceSegment, LocalPlane, LonLat } from "../types";
import { clamp } from "../units";

export const DEFAULT_STATION_SPACING_FT = 10;
export const MAX_STATIONS_PER_SEGMENT = 61;
/**
 * The 3-point moving average is meant to remove DEM cell noise (sub-foot). An interior sample is only
 * replaced by its neighbourhood average when the adjustment is at most this large, so genuine breaks
 * in grade (a crest, a bank) are preserved.
 */
export const SMOOTHING_MAX_ADJUST_FT = 1.0;

/** Station points along a segment every `spacingFt`, n = clamp(ceil(L/spacing)+1, 2, 61), both ends included. */
export function stationPoints(
  segment: FenceSegment,
  plane: LocalPlane,
  spacingFt?: number,
): { stationFt: number; lonLat: LonLat }[] {
  const spacing = spacingFt && spacingFt > 0 ? spacingFt : DEFAULT_STATION_SPACING_FT;
  const L = segment.lengthFt;
  const n = clamp(Math.ceil(L / spacing - 1e-9) + 1, 2, MAX_STATIONS_PER_SEGMENT);
  const out: { stationFt: number; lonLat: LonLat }[] = [];
  for (let k = 0; k < n; k++) {
    const t = k / (n - 1);
    const stationFt = L * t;
    const at = { x: segment.a.x + (segment.b.x - segment.a.x) * t, y: segment.a.y + (segment.b.y - segment.a.y) * t };
    out.push({ stationFt, lonLat: plane.toLonLat(at) });
  }
  return out;
}

/** Fill null elevations by linear interpolation between neighbours; leading/trailing nulls copy the nearest value. */
function interpolateNulls(stations: number[], z: (number | null)[]): number[] | null {
  const n = z.length;
  const known: number[] = [];
  for (let i = 0; i < n; i++) if (z[i] !== null && Number.isFinite(z[i])) known.push(i);
  if (known.length === 0) return null;
  const out = new Array<number>(n);
  let k = 0;
  for (let i = 0; i < n; i++) {
    const v = z[i];
    if (v !== null && Number.isFinite(v)) {
      out[i] = v;
      continue;
    }
    while (k < known.length && known[k] < i) k++;
    const right = known[k];
    const left = known[k - 1];
    if (left === undefined) out[i] = z[right] as number;
    else if (right === undefined) out[i] = z[left] as number;
    else {
      const span = stations[right] - stations[left];
      const t = span > 0 ? (stations[i] - stations[left]) / span : 0;
      out[i] = (z[left] as number) + ((z[right] as number) - (z[left] as number)) * t;
    }
  }
  return out;
}

/**
 * Build a profile from samples: 3-point moving average on interior samples, null gaps interpolated,
 * corrected length = Σ sqrt(Δs² + Δz²), slopeFactor = corrected / flat. If every sample is null, source "none".
 */
export function buildProfile(
  segment: FenceSegment,
  samples: ElevationSample[],
  source: ElevationSource,
  resolutionM?: number,
): ElevationProfile {
  const sorted = samples.slice().sort((a, b) => a.stationFt - b.stationFt);
  const stations = sorted.map((s) => s.stationFt);
  const filled = interpolateNulls(
    stations,
    sorted.map((s) => s.elevFt),
  );
  const validCount = sorted.filter((s) => s.elevFt !== null && Number.isFinite(s.elevFt)).length;
  const coveredFlat = sorted.length >= 2 ? stations[stations.length - 1] - stations[0] : 0;
  if (!filled || validCount < 2 || coveredFlat <= 0) {
    return { ...flatProfile(segment), samples: sorted, resolutionM };
  }

  const n = filled.length;
  const z = filled.slice();
  for (let i = 1; i < n - 1; i++) {
    const avg = (filled[i - 1] + filled[i] + filled[i + 1]) / 3;
    if (Math.abs(avg - filled[i]) <= SMOOTHING_MAX_ADJUST_FT) z[i] = avg;
  }

  let corrected = 0;
  let maxGrade = 0;
  for (let i = 1; i < n; i++) {
    const ds = stations[i] - stations[i - 1];
    const dz = z[i] - z[i - 1];
    corrected += Math.hypot(ds, dz);
    if (ds > 0) maxGrade = Math.max(maxGrade, Math.abs(dz / ds) * 100);
  }
  const factor = Math.max(1, corrected / coveredFlat);
  const L = segment.lengthFt;
  return {
    segmentKey: segment.key,
    samples: sorted,
    correctedLengthFt: L * factor,
    slopeFactor: factor,
    riseFt: z[n - 1] - z[0],
    maxGradePct: maxGrade,
    source,
    resolutionM,
  };
}

/** A "flat" profile with factor 1, used when elevation is unavailable. */
export function flatProfile(segment: FenceSegment): ElevationProfile {
  return {
    segmentKey: segment.key,
    samples: [],
    correctedLengthFt: segment.lengthFt,
    slopeFactor: 1,
    riseFt: 0,
    maxGradePct: 0,
    source: "none",
  };
}
