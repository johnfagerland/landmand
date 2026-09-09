import { describe, expect, it } from "vitest";
import { placeGates, projectGateAnchor, runsOf } from "../fence/gates";
import { classifyVertexPosts, layoutPosts } from "../fence/posts";
import { segmentsOf } from "../geo/segments";
import { computeTakeOff, countPosts, summarizeFence } from "../takeoff/takeoff";
import { fence, gateAt, NOW, plane, rectXY, woodPriceBook, woodRule } from "./helpers";

describe("gates: one 4 ft single gate at station 22 on side 0 of the 100 x 50 rectangle", () => {
  const p = plane();
  const gate = gateAt(p, { x: 22, y: 0.3 }, 4, "front");
  const f = fence(p, rectXY(100, 50), { gates: [gate] });
  const rule = woodRule();
  const t = computeTakeOff({ fence: f, plane: p, profiles: {}, priceBook: woodPriceBook(), rule, taxRatePct: 0, now: NOW });

  it("projects the anchor onto segment 0 at station 22", () => {
    const segs = segmentsOf(f.vertices, true, p);
    const proj = projectGateAnchor(gate.anchor, segs, p);
    expect(proj.segmentIndex).toBe(0);
    expect(proj.stationFt).toBeCloseTo(22, 3);
    const [pl] = placeGates([gate], segs, p);
    expect(pl.startStationFt).toBeCloseTo(20, 3);
    expect(pl.endStationFt).toBeCloseTo(24, 3);
    expect(pl.warnings).toEqual([]);
  });

  it("splits side 0 into 20 / 76 ft runs with gate boundaries", () => {
    const s = summarizeFence(f, p, {});
    const side0 = s.runs.filter((r) => r.segmentIndex === 0);
    expect(side0.map((r) => Math.round(r.lengthFt * 1000) / 1000)).toEqual([20, 76]);
    expect(side0[0].endPost).toBe("gate");
    expect(side0[1].startPost).toBe("gate");
    expect(s.runs).toHaveLength(5);
    expect(s.fenceLengthFt).toBeCloseTo(296, 3);
  });

  it("counts 11 line posts on that side, 41 posts total, 296 ft of fence", () => {
    expect(t.segments[0].linePosts).toBe(11);
    expect(t.segments[0].sections).toBe(13);
    expect(t.segments[0].gateIds).toEqual(["front"]);
    expect(t.posts).toEqual({ corner: 4, end: 0, line: 35, gate: 2, total: 41 });
    expect(t.fenceLengthFt).toBeCloseTo(296, 3);
    expect(t.flatLengthFt).toBeCloseTo(300, 3);
    expect(t.sections).toBe(40);
    expect(t.gates).toBe(1);
  });

  it("adds one gateSingle, one gateHardware and per-gate labour; no warnings besides slope", () => {
    const line = (sku: string) => t.lines.find((l) => l.sku === sku);
    expect(line("GATE1")?.qty).toBe(1);
    expect(line("GATE2")).toBeUndefined();
    expect(line("HW")?.qty).toBe(1);
    expect(line("LABG")?.qty).toBe(1);
    expect(line("LAB")?.qty).toBe(296);
    expect(line("PICKET")?.qty).toBe(592);
    // Terminal posts include the two gate posts when no gatePost role is bound.
    expect(line("TP")?.qty).toBe(6);
    expect(line("CONC")?.qty).toBe(35 + 6 * 2);
    expect(t.warnings).toEqual(["Slope not applied on 4 segment(s)"]);
  });

  it("lays out gate posts at the gate edges", () => {
    const s = summarizeFence(f, p, {});
    const posts = layoutPosts(f, s.segments, s.placements, s.slopeFactorBySegment, rule, p);
    expect(countPosts(posts)).toEqual({ corner: 4, end: 0, line: 35, gate: 2, total: 41 });
    const gatePosts = posts.filter((q) => q.kind === "gate").map((q) => Math.round(q.stationFt * 1000) / 1000);
    expect(gatePosts.sort((a, b) => a - b)).toEqual([20, 24]);
  });
});

describe("gates: a 20 ft gate on a 10 ft side", () => {
  const p = plane();
  const pts = [
    { x: 0, y: 0 },
    { x: 100, y: 0 },
    { x: 100, y: 10 },
    { x: 0, y: 10 },
  ];
  const gate = gateAt(p, { x: 100, y: 5 }, 20, "wide");
  const f = fence(p, pts, { gates: [gate] });

  it("warns, clamps the opening to the segment and never produces negative lengths", () => {
    const t = computeTakeOff({ fence: f, plane: p, profiles: {}, priceBook: woodPriceBook(), rule: woodRule(), taxRatePct: 0, now: NOW });
    expect(t.warnings).toContain("Gate wide (20 ft) is wider than segment 1 (10 ft)");
    expect(t.segments[1].fenceFt).toBe(0);
    expect(t.fenceLengthFt).toBeCloseTo(210, 3);
    for (const s of t.segments) {
      expect(s.fenceFt).toBeGreaterThanOrEqual(0);
      expect(s.sections).toBeGreaterThanOrEqual(0);
    }
    const segs = segmentsOf(f.vertices, true, p);
    const [pl] = placeGates([gate], segs, p);
    expect(pl.startStationFt).toBe(0);
    expect(pl.endStationFt).toBeCloseTo(10, 6);
    const runs = runsOf(segs, [pl], true);
    expect(runs.every((r) => r.lengthFt > 0)).toBe(true);
    expect(runs.filter((r) => r.segmentIndex === 1)).toHaveLength(0);
  });

  it("upgrades both end vertices of that side to gate posts", () => {
    const segs = segmentsOf(f.vertices, true, p);
    const placements = placeGates([gate], segs, p);
    const posts = classifyVertexPosts(f, segs, placements, p, 15);
    expect(posts.map((q) => q.kind)).toEqual(["corner", "gate", "gate", "corner"]);
    const t = computeTakeOff({ fence: f, plane: p, profiles: {}, priceBook: woodPriceBook(), rule: woodRule(), taxRatePct: 0, now: NOW });
    // |vertices| 4 + line posts (12 + 12 + 1) + 2 gate posts - 2 upgraded = 29
    expect(t.posts).toEqual({ corner: 2, end: 0, line: 25, gate: 2, total: 29 });
  });
});

describe("gates: overlapping gates and gates near a segment end", () => {
  const p = plane();

  it("warns when two gates overlap on the same segment", () => {
    const g1 = gateAt(p, { x: 20, y: 0 }, 4, "a");
    const g2 = gateAt(p, { x: 22, y: 0 }, 4, "b");
    const segs = segmentsOf(fence(p, rectXY(100, 50)).vertices, true, p);
    const placements = placeGates([g1, g2], segs, p);
    expect(placements[0].warnings).toEqual([]);
    expect(placements[1].warnings).toEqual(["Gate b overlaps gate a on segment 0"]);
  });

  it("shifts a gate that would hang past a vertex back into the segment", () => {
    const g = gateAt(p, { x: 99, y: 0 }, 4, "edge");
    const segs = segmentsOf(fence(p, rectXY(100, 50)).vertices, true, p);
    const [pl] = placeGates([g], segs, p);
    expect(pl.startStationFt).toBeCloseTo(96, 6);
    expect(pl.endStationFt).toBeCloseTo(100, 6);
    expect(pl.warnings).toEqual([]);
    const f = fence(p, rectXY(100, 50), { gates: [g] });
    const posts = classifyVertexPosts(f, segs, [pl], p, 15);
    expect(posts.map((q) => q.kind)).toEqual(["corner", "gate", "corner", "corner"]);
  });

  it("double gates bind to gateDouble", () => {
    const g = gateAt(p, { x: 50, y: 0 }, 12, "dbl", "double");
    const f = fence(p, rectXY(100, 50), { gates: [g] });
    const t = computeTakeOff({ fence: f, plane: p, profiles: {}, priceBook: woodPriceBook(), rule: woodRule(), taxRatePct: 0, now: NOW });
    expect(t.lines.find((l) => l.sku === "GATE2")?.qty).toBe(1);
    expect(t.lines.find((l) => l.sku === "GATE1")).toBeUndefined();
    expect(t.fenceLengthFt).toBeCloseTo(288, 3);
  });
});
