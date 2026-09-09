import type { FenceSegment, Gate, LocalPlane, LonLat, PostKind } from "../types";
import { projectPointToSegment } from "../geo/snap";

/**
 * A gate edge within this distance of a vertex post shares that post (the vertex post is upgraded to
 * kind "gate"). Runs shorter than this are dropped for the same reason.
 */
export const GATE_POST_MERGE_FT = 0.5;

export interface GatePlacement {
  gate: Gate;
  segmentIndex: number;
  centerStationFt: number;
  /** Clamped into the segment. */
  startStationFt: number;
  endStationFt: number;
  warnings: string[];
}

/** A stretch of fence between two posts or gate edges; gate openings are not runs. */
export interface Run {
  segmentIndex: number;
  startStationFt: number;
  endStationFt: number;
  /** Flat length */
  lengthFt: number;
  /**
   * Kind of the post at each end. "gate" = a gate edge; "end" = the open end of a line;
   * "line" = any other vertex post (its corner/line classification lives in classifyVertexPosts).
   */
  startPost: PostKind;
  endPost: PostKind;
}

/**
 * Project a gate anchor onto the nearest segment.
 * With no segments returns segmentIndex -1, station 0 and the anchor unchanged.
 */
export function projectGateAnchor(
  anchor: LonLat,
  segments: FenceSegment[],
  plane: LocalPlane,
): { segmentIndex: number; stationFt: number; lonLat: LonLat } {
  if (segments.length === 0) return { segmentIndex: -1, stationFt: 0, lonLat: anchor };
  const p = plane.toXY(anchor);
  let bestIndex = -1;
  let bestDist = Infinity;
  let bestT = 0;
  let bestPoint = p;
  for (const s of segments) {
    const hit = projectPointToSegment(p, s.a, s.b);
    if (hit.distance < bestDist) {
      bestDist = hit.distance;
      bestIndex = s.index;
      bestT = hit.t;
      bestPoint = hit.point;
    }
  }
  const seg = segments.find((s) => s.index === bestIndex) ?? segments[0];
  return { segmentIndex: seg.index, stationFt: bestT * seg.lengthFt, lonLat: plane.toLonLat(bestPoint) };
}

function fmt(ft: number): string {
  return (Math.round(ft * 10) / 10).toString();
}

/**
 * Place every gate on its nearest segment; warn when wider than the segment or overlapping another gate.
 * The opening [center - w/2, center + w/2] is shifted to stay inside the segment; a gate wider than the
 * segment occupies the whole segment. Overlap warnings are attached to the later gate of each pair.
 */
export function placeGates(gates: Gate[], segments: FenceSegment[], plane: LocalPlane): GatePlacement[] {
  if (segments.length === 0) return [];
  const placements: GatePlacement[] = [];
  for (const gate of gates) {
    const proj = projectGateAnchor(gate.anchor, segments, plane);
    const seg = segments.find((s) => s.index === proj.segmentIndex) ?? segments[0];
    const L = seg.lengthFt;
    const w = Math.max(0, gate.widthFt);
    const warnings: string[] = [];
    let start = proj.stationFt - w / 2;
    let end = proj.stationFt + w / 2;
    if (w >= L) {
      start = 0;
      end = L;
      if (w > L) warnings.push(`Gate ${gate.id} (${fmt(w)} ft) is wider than segment ${seg.index} (${fmt(L)} ft)`);
    } else if (start < 0) {
      start = 0;
      end = w;
    } else if (end > L) {
      end = L;
      start = L - w;
    }
    placements.push({
      gate,
      segmentIndex: seg.index,
      centerStationFt: proj.stationFt,
      startStationFt: start,
      endStationFt: end,
      warnings,
    });
  }
  for (let i = 1; i < placements.length; i++) {
    const p = placements[i];
    for (let j = 0; j < i; j++) {
      const o = placements[j];
      if (o.segmentIndex !== p.segmentIndex) continue;
      if (p.startStationFt < o.endStationFt && o.startStationFt < p.endStationFt) {
        p.warnings.push(`Gate ${p.gate.id} overlaps gate ${o.gate.id} on segment ${p.segmentIndex}`);
      }
    }
  }
  return placements;
}

/**
 * Split segments into runs between vertex posts and gate edges. Gate openings are excluded and
 * runs shorter than GATE_POST_MERGE_FT are dropped (the gate shares the vertex post).
 */
export function runsOf(segments: FenceSegment[], placements: GatePlacement[], closed: boolean): Run[] {
  const runs: Run[] = [];
  const count = segments.length;
  for (const seg of segments) {
    const L = seg.lengthFt;
    const gates = placements
      .filter((p) => p.segmentIndex === seg.index)
      .sort((a, b) => a.startStationFt - b.startStationFt);
    const startVertexKind: PostKind = !closed && seg.index === 0 ? "end" : "line";
    const endVertexKind: PostKind = !closed && seg.index === count - 1 ? "end" : "line";
    let cursor = 0;
    let cursorKind: PostKind = startVertexKind;
    for (const g of gates) {
      const gs = Math.max(cursor, Math.min(g.startStationFt, L));
      const ge = Math.max(gs, Math.min(g.endStationFt, L));
      pushRun(runs, seg.index, cursor, gs, cursorKind, "gate");
      cursor = ge;
      cursorKind = "gate";
    }
    pushRun(runs, seg.index, cursor, L, cursorKind, endVertexKind);
  }
  return runs;
}

function pushRun(runs: Run[], segmentIndex: number, start: number, end: number, startPost: PostKind, endPost: PostKind) {
  const len = end - start;
  if (len < GATE_POST_MERGE_FT) return;
  runs.push({ segmentIndex, startStationFt: start, endStationFt: end, lengthFt: len, startPost, endPost });
}
