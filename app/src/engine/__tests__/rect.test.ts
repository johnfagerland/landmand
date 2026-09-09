import { describe, expect, it } from "vitest";
import { computeTakeOff, summarizeFence } from "../takeoff/takeoff";
import { layoutPosts } from "../fence/posts";
import { countPosts } from "../takeoff/takeoff";
import { fence, NOW, plane, rectXY, woodPriceBook, woodRule } from "./helpers";

describe("take-off: 100 x 50 rectangle, wood privacy at 8 ft, no gates", () => {
  const p = plane();
  const f = fence(p, rectXY(100, 50));
  const rule = woodRule();
  const book = woodPriceBook();
  const t = computeTakeOff({ fence: f, plane: p, profiles: {}, priceBook: book, rule, taxRatePct: 7.25, now: NOW });

  it("measures the perimeter", () => {
    expect(t.flatLengthFt).toBeCloseTo(300, 3);
    expect(t.correctedLengthFt).toBeCloseTo(300, 3);
    expect(t.fenceLengthFt).toBeCloseTo(300, 3);
    expect(t.slopeFactor).toBe(1);
    expect(t.segments).toHaveLength(4);
    expect(t.segments.map((s) => Math.round(s.flatFt))).toEqual([100, 50, 100, 50]);
  });

  it("counts posts and sections", () => {
    expect(t.posts).toEqual({ corner: 4, end: 0, line: 36, gate: 0, total: 40 });
    expect(t.sections).toBe(40);
    expect(t.segments.map((s) => s.linePosts)).toEqual([12, 6, 12, 6]);
    expect(t.gates).toBe(0);
  });

  it("derives material quantities", () => {
    const qty = (sku: string) => t.lines.find((l) => l.sku === sku)?.qty;
    expect(qty("LP")).toBe(36);
    expect(qty("TP")).toBe(4);
    expect(qty("RAIL")).toBe(120);
    expect(qty("PICKET")).toBe(600);
    expect(qty("CONC")).toBe(44);
    expect(qty("LAB")).toBe(300);
    expect(t.lines.find((l) => l.sku === "GATE1")).toBeUndefined();
    expect(t.lines.find((l) => l.sku === "HW")).toBeUndefined();
    expect(t.lines.every((l) => l.basis.length > 0)).toBe(true);
  });

  it("prices to a hand-computed cents figure", () => {
    // LP 36 x 1250 = 45,000; TP 4 x 1800 = 7,200; RAIL 120 x 625 = 75,000; PICKET 600 x 210 = 126,000;
    // CONC 44 x 500 = 22,000; LAB 300 x 900 = 270,000 (not taxable).
    // subtotal = 545,200; taxable = 275,200; tax @ 7.25 % = 19,952; total = 565,152 ($5,651.52).
    expect(t.subtotalCents).toBe(545200);
    expect(t.taxCents).toBe(19952);
    expect(t.totalCents).toBe(565152);
    expect(t.warnings).toEqual(["Slope not applied on 4 segment(s)"]);
    expect(t.computedAt).toBe(NOW);
    expect(t.styleId).toBe("wood-privacy-6");
    expect(t.heightFt).toBe(6);
  });

  it("applies waste to countable materials only", () => {
    const w = computeTakeOff({
      fence: f,
      plane: p,
      profiles: {},
      priceBook: book,
      rule: woodRule({ wastePct: 5 }),
      taxRatePct: 0,
      now: NOW,
    });
    const qty = (sku: string) => w.lines.find((l) => l.sku === sku)?.qty;
    expect(qty("RAIL")).toBe(126);
    expect(qty("PICKET")).toBe(630);
    expect(qty("LP")).toBe(38);
    expect(qty("CONC")).toBe(44);
    expect(qty("LAB")).toBe(300);
    expect(w.taxCents).toBe(0);
  });

  it("warns and skips a line when a needed role is unbound, never throws", () => {
    const rule2 = woodRule({ skus: { ...woodRule().skus, picket: undefined } });
    const w = computeTakeOff({ fence: f, plane: p, profiles: {}, priceBook: book, rule: rule2, taxRatePct: 0, now: NOW });
    expect(w.lines.find((l) => l.sku === "PICKET")).toBeUndefined();
    expect(w.warnings).toContain("No price-book item bound to role picket for style wood-privacy-6");
    expect(w.subtotalCents).toBe(545200 - 126000);
  });

  it("summarizeFence and layoutPosts agree with the take-off", () => {
    const s = summarizeFence(f, p, {});
    expect(s.runs).toHaveLength(4);
    expect(countPosts(s.vertexPosts)).toEqual({ corner: 4, end: 0, line: 0, gate: 0, total: 4 });
    const posts = layoutPosts(f, s.segments, s.placements, s.slopeFactorBySegment, rule, p);
    expect(countPosts(posts)).toEqual({ corner: 4, end: 0, line: 36, gate: 0, total: 40 });
    // Line posts on side 0 sit at 100/13 ft intervals.
    const side0 = posts.filter((q) => q.kind === "line" && q.segmentIndex === 0).map((q) => q.stationFt);
    expect(side0).toHaveLength(12);
    expect(side0[0]).toBeCloseTo(100 / 13, 6);
    expect(side0[11]).toBeCloseTo(1200 / 13, 6);
  });
});
