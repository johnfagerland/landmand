/**
 * Memoised derived data over the quote store. Each selector returns a stable reference while its inputs
 * are unchanged, so components can pass them to useQuoteStore(selector) without re-render loops.
 */
import type { ElevationProfile, FenceSegment, Gate, Post } from "@/engine/types";
import type { GatePlacement } from "@/engine/fence/gates";
import type { FenceSummary } from "@/engine/takeoff/takeoff";
import { useQuoteStore } from "./quoteStore";

type State = ReturnType<typeof useQuoteStore.getState>;

/** Memoise on the identity of the selected inputs. */
function memo<I extends unknown[], O>(pick: (s: State) => I, compute: (...inputs: I) => O): (s: State) => O {
  let lastInputs: I | null = null;
  let lastOut: O;
  return (s) => {
    const inputs = pick(s);
    if (lastInputs && inputs.length === lastInputs.length && inputs.every((v, i) => v === lastInputs![i])) {
      return lastOut;
    }
    lastInputs = inputs;
    lastOut = compute(...inputs);
    return lastOut;
  };
}

export interface SegmentRow {
  index: number;
  key: string;
  segment: FenceSegment;
  flatFt: number;
  correctedFt: number | null;
  slopeFactor: number | null;
  profile: ElevationProfile | null;
  /** Post kind at the segment's start vertex. */
  startPost: Post["kind"] | null;
  endPost: Post["kind"] | null;
  isCorner: boolean;
  gates: Gate[];
  warnings: string[];
}

const EMPTY_ROWS: SegmentRow[] = [];
const EMPTY_GATES: Gate[] = [];
const EMPTY_PLACEMENTS: GatePlacement[] = [];

export const selectQuote = (s: State) => s.quote;
export const selectFence = (s: State) => s.quote?.fence ?? null;
export const selectGates = (s: State) => s.quote?.fence.gates ?? EMPTY_GATES;
export const selectGateCount = (s: State) => s.quote?.fence.gates.length ?? 0;
export const selectParcel = (s: State) => s.quote?.parcel ?? null;
export const selectSummary = (s: State) => s.summary;
export const selectPlacements = (s: State) => s.summary?.placements ?? EMPTY_PLACEMENTS;
export const selectFlatLengthFt = (s: State) => s.summary?.flatLengthFt ?? null;
export const selectCorrectedLengthFt = (s: State) => s.summary?.correctedLengthFt ?? null;
export const selectFenceLengthFt = (s: State) => s.summary?.fenceLengthFt ?? null;
export const selectSlopeFactor = (s: State) => s.summary?.slopeFactor ?? null;
export const selectCanUndo = (s: State) => s.past.length > 0;
export const selectCanRedo = (s: State) => s.future.length > 0;
export const selectHasFence = (s: State) => (s.quote?.fence.vertices.length ?? 0) > 0;
export const selectStatusText = (s: State) => {
  if (s.quote?.parcel) return s.quote.parcel.attribution;
  if (s.parcelLookup === "loading") return "Looking up lot lines…";
  if (s.parcelLookup === "none" || s.quote?.parcelStatus === "manual") return "Lot lines: drawn by hand";
  if (s.parcelLookup === "error") return "Lot lines: lookup failed";
  return "Lot lines: pending";
};

export const selectSegmentRows = memo(
  (s: State) => [s.summary, s.quote?.profiles ?? null, s.quote?.fence.closed ?? true] as const,
  (summary: FenceSummary | null, profiles: Record<string, ElevationProfile> | null, closed: boolean): SegmentRow[] => {
    if (!summary) return EMPTY_ROWS;
    const n = summary.segments.length;
    const postAt = (vertexIndex: number): Post["kind"] | null => summary.vertexPosts[vertexIndex]?.kind ?? null;
    return summary.segments.map((segment, i) => {
      const profile = profiles?.[segment.key] ?? null;
      const factor = summary.slopeFactorBySegment[i];
      const startPost = postAt(i);
      // The end vertex of segment i is vertex i+1 (wrapping for closed loops).
      const endIndex = closed ? (i + 1) % Math.max(1, n) : i + 1;
      const endPost = postAt(endIndex);
      const gates = summary.placements.filter((p) => p.segmentIndex === i).map((p) => p.gate);
      const warnings = summary.placements.filter((p) => p.segmentIndex === i).flatMap((p) => p.warnings);
      return {
        index: i,
        key: segment.key,
        segment,
        flatFt: segment.lengthFt,
        correctedFt: profile ? profile.correctedLengthFt : factor ? segment.lengthFt * factor : null,
        slopeFactor: profile ? profile.slopeFactor : (factor ?? null),
        profile,
        startPost,
        endPost,
        isCorner: startPost === "corner" || endPost === "corner",
        gates,
        warnings,
      };
    });
  },
);

/** [minLon, minLat, maxLon, maxLat] of the parcel (plus candidates while picking), or null. */
export const selectFitBounds = memo(
  (s: State) => [s.quote?.parcel ?? null, s.candidates, s.quote?.geocode ?? null] as const,
  (parcel, candidates, geocode): [number, number, number, number] | null => {
    const rings: [number, number][][] = [];
    if (parcel) rings.push(parcel.ring);
    else for (const c of candidates) rings.push(c.parcel.ring);
    if (rings.length === 0) {
      if (!geocode) return null;
      const d = 0.0012;
      return [geocode[0] - d, geocode[1] - d, geocode[0] + d, geocode[1] + d];
    }
    let minLon = Infinity;
    let minLat = Infinity;
    let maxLon = -Infinity;
    let maxLat = -Infinity;
    for (const ring of rings) {
      for (const [lon, lat] of ring) {
        if (lon < minLon) minLon = lon;
        if (lat < minLat) minLat = lat;
        if (lon > maxLon) maxLon = lon;
        if (lat > maxLat) maxLat = lat;
      }
    }
    if (!Number.isFinite(minLon)) return null;
    return [minLon, minLat, maxLon, maxLat];
  },
);

export function formatFt(ft: number | null | undefined, digits = 1): string {
  if (ft === null || ft === undefined || !Number.isFinite(ft)) return "—";
  return `${ft.toFixed(digits)} ft`;
}
