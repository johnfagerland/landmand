import { describe, expect, it } from "vitest";
import { kinks } from "@turf/turf";
import { offsetEdges, offsetRing } from "../geo/offset";
import { isClockwise, ringAreaSqFt } from "../geo/ring";
import { fromXY, plane, rectXY } from "./helpers";
import type { LonLat, XY } from "../types";

const p = plane();

function xy(ring: LonLat[]): XY[] {
  return ring.map((v) => p.toXY(v));
}
function round1(v: number) {
  return Math.round(v * 10) / 10;
}
function closedPolygon(ring: LonLat[]) {
  return { type: "Polygon" as const, coordinates: [[...ring, ring[0]]] };
}

describe("offsetRing", () => {
  it("100 x 50 inward 5 -> 90 x 40 with 4 vertices", () => {
    const r = offsetRing(fromXY(p, rectXY(100, 50)), 5, p);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.ring).toHaveLength(4);
    const pts = xy(r.ring).map((q) => ({ x: round1(q.x), y: round1(q.y) }));
    expect(pts).toEqual([
      { x: 5, y: 5 },
      { x: 95, y: 5 },
      { x: 95, y: 45 },
      { x: 5, y: 45 },
    ]);
    // Output is rounded to 7 dp (~0.03 ft), so allow a few square feet.
    expect(Math.abs(ringAreaSqFt(r.ring, p) - 3600)).toBeLessThan(5);
    expect(isClockwise(xy(r.ring))).toBe(false);
  });

  it("concave L inward 3 -> no kinks, same vertex count", () => {
    const L: XY[] = [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 40 },
      { x: 60, y: 40 },
      { x: 60, y: 80 },
      { x: 0, y: 80 },
    ];
    const r = offsetRing(fromXY(p, L), 3, p);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.ring).toHaveLength(6);
    expect(kinks(closedPolygon(r.ring)).features).toHaveLength(0);
    const pts = xy(r.ring).map((q) => ({ x: round1(q.x), y: round1(q.y) }));
    expect(pts[3]).toEqual({ x: 57, y: 37 }); // the reflex corner moves inward on both axes
    expect(pts[0]).toEqual({ x: 3, y: 3 });
    expect(isClockwise(xy(r.ring))).toBe(false);
  });

  it("30 ft on the 50 ft side -> buffer fallback returns a valid ring or a typed error", () => {
    const r = offsetRing(fromXY(p, rectXY(100, 50)), 30, p);
    if (r.ok) {
      expect(r.ring.length).toBeGreaterThanOrEqual(3);
      expect(isClockwise(xy(r.ring))).toBe(false);
      expect(kinks(closedPolygon(r.ring)).features).toHaveLength(0);
    } else {
      expect(["kinks", "collapsed", "invalid"]).toContain(r.reason);
    }
    // 25 ft exactly halves the 50 ft side: also collapsed.
    const c = offsetRing(fromXY(p, rectXY(100, 50)), 25, p);
    expect(c.ok).toBe(false);
  });

  it("uses the buffer fallback when the miter result self-intersects and stays within the parcel", () => {
    // A thin notch: mitering 4 ft inward reverses the 6 ft wide neck.
    const notched: XY[] = [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 60 },
      { x: 53, y: 60 },
      { x: 53, y: 20 },
      { x: 47, y: 20 },
      { x: 47, y: 60 },
      { x: 0, y: 60 },
    ];
    const r = offsetRing(fromXY(p, notched), 4, p);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(kinks(closedPolygon(r.ring)).features).toHaveLength(0);
    expect(isClockwise(xy(r.ring))).toBe(false);
    const area = ringAreaSqFt(r.ring, p);
    expect(area).toBeGreaterThan(0);
    expect(area).toBeLessThan(100 * 60);
  });

  it("zero offset returns the ring unchanged and a CW input is normalised", () => {
    const cw = fromXY(p, rectXY(100, 50).reverse());
    const r = offsetRing(cw, 0, p);
    expect(r.ok).toBe(true);
    if (r.ok) expect(isClockwise(xy(r.ring))).toBe(false);
    expect(offsetRing(cw.slice(0, 2), 5, p)).toEqual({ ok: false, reason: "invalid" });
  });
});

describe("offsetEdges", () => {
  it("moves only the listed edges", () => {
    const r = offsetEdges(fromXY(p, rectXY(100, 50)), { 0: 10, 2: 5 }, p);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const pts = xy(r.ring).map((q) => ({ x: round1(q.x), y: round1(q.y) }));
    expect(pts).toEqual([
      { x: 0, y: 10 },
      { x: 100, y: 10 },
      { x: 100, y: 45 },
      { x: 0, y: 45 },
    ]);
  });

  it("reports kinks when an edge offset collapses the ring", () => {
    const r = offsetEdges(fromXY(p, rectXY(100, 50)), { 0: 60 }, p);
    expect(r).toEqual({ ok: false, reason: "kinks" });
  });
});
