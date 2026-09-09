import { describe, expect, it } from "vitest";
import { classifyVertexPosts } from "../fence/posts";
import { bearingDeg, deflectionDeg, segmentsOf } from "../geo/segments";
import { computeTakeOff, countPosts } from "../takeoff/takeoff";
import { fence, NOW, plane, woodPriceBook, woodRule } from "./helpers";
import type { XY } from "../types";

const p = plane();

function kinds(pts: XY[], closed: boolean, threshold = 15) {
  const f = fence(p, pts, { closed });
  const segs = segmentsOf(f.vertices, closed, p);
  return classifyVertexPosts(f, segs, [], p, threshold).map((q) => q.kind);
}

describe("corners", () => {
  it("L-shape 100 + 50 open run -> posts {end 2, corner 1, line 18, total 21}", () => {
    const f = fence(
      p,
      [
        { x: 0, y: 0 },
        { x: 100, y: 0 },
        { x: 100, y: 50 },
      ],
      { closed: false },
    );
    const t = computeTakeOff({ fence: f, plane: p, profiles: {}, priceBook: woodPriceBook(), rule: woodRule(), taxRatePct: 0, now: NOW });
    expect(t.posts).toEqual({ corner: 1, end: 2, line: 18, gate: 0, total: 21 });
    expect(t.sections).toBe(20);
    expect(t.flatLengthFt).toBeCloseTo(150, 3);
    expect(t.segments).toHaveLength(2);
  });

  it("5 deg deflection -> line, 16 deg -> corner", () => {
    const bend = (deg: number): XY[] => {
      const r = (deg * Math.PI) / 180;
      return [
        { x: 0, y: 0 },
        { x: 100, y: 0 },
        { x: 100 + 50 * Math.cos(r), y: 50 * Math.sin(r) },
      ];
    };
    expect(kinds(bend(5), false)).toEqual(["end", "line", "end"]);
    expect(kinds(bend(16), false)).toEqual(["end", "corner", "end"]);
    expect(kinds(bend(-16), false)).toEqual(["end", "corner", "end"]);
    // Exactly at the threshold is not a corner (strictly greater).
    expect(kinds(bend(15), false)).toEqual(["end", "line", "end"]);
  });

  it("closed triangle -> 3 corners, each counted once", () => {
    const tri: XY[] = [
      { x: 0, y: 0 },
      { x: 60, y: 0 },
      { x: 30, y: 40 },
    ];
    expect(kinds(tri, true)).toEqual(["corner", "corner", "corner"]);
    const f = fence(p, tri, { closed: true });
    const t = computeTakeOff({ fence: f, plane: p, profiles: {}, priceBook: woodPriceBook(), rule: woodRule(), taxRatePct: 0, now: NOW });
    expect(t.posts.corner).toBe(3);
    expect(t.posts.end).toBe(0);
    // 60 -> 8 sections/7 line, 50 -> 7 sections/6 line, 50 -> 6 line.
    expect(t.posts.line).toBe(19);
    expect(t.posts.total).toBe(22);
  });

  it("bearing and deflection conventions", () => {
    expect(bearingDeg({ x: 0, y: 0 }, { x: 0, y: 1 })).toBe(0);
    expect(bearingDeg({ x: 0, y: 0 }, { x: 1, y: 0 })).toBe(90);
    expect(bearingDeg({ x: 0, y: 0 }, { x: 0, y: -1 })).toBe(180);
    expect(bearingDeg({ x: 0, y: 0 }, { x: -1, y: 0 })).toBe(270);
    expect(deflectionDeg(350, 10)).toBe(20);
    expect(deflectionDeg(10, 350)).toBe(20);
    expect(deflectionDeg(90, 270)).toBe(180);
    expect(deflectionDeg(45, 45)).toBe(0);
  });

  it("countPosts tallies by kind", () => {
    const f = fence(p, [{ x: 0, y: 0 }, { x: 10, y: 0 }], { closed: false });
    const segs = segmentsOf(f.vertices, false, p);
    expect(countPosts(classifyVertexPosts(f, segs, [], p, 15))).toEqual({ corner: 0, end: 2, line: 0, gate: 0, total: 2 });
    expect(countPosts([])).toEqual({ corner: 0, end: 0, line: 0, gate: 0, total: 0 });
  });
});
