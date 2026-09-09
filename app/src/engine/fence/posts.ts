import type { FenceLine, FenceSegment, LocalPlane, Post, StyleRule } from "../types";
import { deflectionDeg } from "../geo/segments";
import { GATE_POST_MERGE_FT, runsOf, type GatePlacement } from "./gates";

/**
 * Tolerance for rounding quantities up: lengths carry ~1e-8 ft of floating error from the lon/lat round
 * trip, and 300.00000001 ft must still be 300 ft, not 301.
 */
export const CEIL_EPS = 1e-6;

/** ceil() that ignores floating residue below CEIL_EPS. */
export function ceilQty(x: number): number {
  return Math.ceil(x - CEIL_EPS);
}

/** Number of sections a run of slope-corrected length needs at the given post spacing (0 for an empty run). */
export function sectionsFor(correctedLengthFt: number, spacingFt: number): number {
  if (correctedLengthFt <= 0) return 0;
  if (!(spacingFt > 0)) return 1;
  return Math.max(1, ceilQty(correctedLengthFt / spacingFt));
}

/**
 * One post per vertex: "corner" if deflection > cornerThresholdDeg, else "line";
 * the two ends of an open line are "end"; a vertex within 0.5 ft of a gate edge is "gate".
 * Posts are returned in vertex order; the last vertex of an open line sits at the end of the last segment.
 */
export function classifyVertexPosts(
  fence: FenceLine,
  segments: FenceSegment[],
  placements: GatePlacement[],
  plane: LocalPlane,
  cornerThresholdDeg: number,
): Post[] {
  const n = fence.vertices.length;
  if (n === 0 || segments.length === 0) return [];
  const closed = fence.closed;
  const byIndex = new Map(segments.map((s) => [s.index, s]));
  const posts: Post[] = [];
  for (let i = 0; i < n; i++) {
    const v = fence.vertices[i];
    const isOpenEnd = !closed && (i === 0 || i === n - 1);
    // Segment leaving this vertex, and segment arriving at it.
    const outSeg = closed ? byIndex.get(i) : i < n - 1 ? byIndex.get(i) : undefined;
    const inSeg = closed ? byIndex.get((i - 1 + n) % n) : i > 0 ? byIndex.get(i - 1) : undefined;

    let kind: Post["kind"];
    if (isOpenEnd) kind = "end";
    else if (inSeg && outSeg) kind = deflectionDeg(inSeg.bearingDeg, outSeg.bearingDeg) > cornerThresholdDeg ? "corner" : "line";
    else kind = "end";

    // Gate edge within 0.5 ft of the vertex: the vertex post becomes a gate post.
    for (const p of placements) {
      if (outSeg && p.segmentIndex === outSeg.index) {
        if (p.startStationFt <= GATE_POST_MERGE_FT || p.endStationFt <= GATE_POST_MERGE_FT) kind = "gate";
      }
      if (inSeg && p.segmentIndex === inSeg.index) {
        const L = inSeg.lengthFt;
        if (L - p.endStationFt <= GATE_POST_MERGE_FT || L - p.startStationFt <= GATE_POST_MERGE_FT) kind = "gate";
      }
    }

    const seg = outSeg ?? inSeg;
    if (!seg) continue;
    posts.push({
      kind,
      at: plane.toXY(v),
      lonLat: v,
      segmentIndex: seg.index,
      stationFt: outSeg ? 0 : seg.lengthFt,
    });
  }
  return posts;
}

/**
 * All posts including line posts laid out along each run at the rule's spacing (slope-corrected),
 * and gate posts at gate edges. Used by the map's PostMarkers layer.
 *
 * Line posts: sections = ceil(L_corr / spacing), linePosts = sections - 1, spaced evenly by flat station.
 * Gate posts are added at each gate edge unless the edge coincides with a vertex post (within 0.5 ft).
 */
export function layoutPosts(
  fence: FenceLine,
  segments: FenceSegment[],
  placements: GatePlacement[],
  slopeFactorBySegment: Record<number, number>,
  rule: StyleRule,
  plane: LocalPlane,
): Post[] {
  const posts = classifyVertexPosts(fence, segments, placements, plane, rule.cornerThresholdDeg);
  if (segments.length === 0) return posts;
  const byIndex = new Map(segments.map((s) => [s.index, s]));
  const runs = runsOf(segments, placements, fence.closed);
  const spacing = rule.postSpacingFt;

  for (const run of runs) {
    const seg = byIndex.get(run.segmentIndex);
    if (!seg) continue;
    const factor = slopeFactorBySegment[run.segmentIndex] ?? 1;
    const sections = sectionsFor(run.lengthFt * factor, spacing);
    for (let k = 1; k < sections; k++) {
      const station = run.startStationFt + (run.lengthFt * k) / sections;
      posts.push(postAt(seg, station, "line", plane));
    }
  }

  for (const p of placements) {
    const seg = byIndex.get(p.segmentIndex);
    if (!seg) continue;
    for (const station of [p.startStationFt, p.endStationFt]) {
      if (station <= GATE_POST_MERGE_FT || station >= seg.lengthFt - GATE_POST_MERGE_FT) continue; // shares a vertex post
      posts.push(postAt(seg, station, "gate", plane));
    }
  }
  return posts;
}

function postAt(seg: FenceSegment, stationFt: number, kind: Post["kind"], plane: LocalPlane): Post {
  const t = seg.lengthFt > 0 ? stationFt / seg.lengthFt : 0;
  const at = { x: seg.a.x + (seg.b.x - seg.a.x) * t, y: seg.a.y + (seg.b.y - seg.a.y) * t };
  return { kind, at, lonLat: plane.toLonLat(at), segmentIndex: seg.index, stationFt };
}
