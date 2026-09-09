/**
 * Adversarial review: gates, post counts, sections and the priced take-off.
 * Every expected number below is derived by hand in the comments (spec: plan section "Take-off algorithm").
 */
import { describe, expect, it } from "vitest";
import { placeGates, projectGateAnchor, runsOf } from "../fence/gates";
import { classifyVertexPosts, layoutPosts, sectionsFor } from "../fence/posts";
import { segmentsOf } from "../geo/segments";
import { computeTakeOff, countPosts, summarizeFence } from "../takeoff/takeoff";
import type { PriceBook, PriceBookItem, StyleRule } from "../types";
import { fence, gateAt, NOW, plane, rectXY, woodPriceBook, woodRule } from "./helpers";

const p = plane();
const rect = rectXY(100, 50);

function takeoff(f: ReturnType<typeof fence>, rule: StyleRule = woodRule(), book: PriceBook = woodPriceBook(), taxRatePct = 0) {
  return computeTakeOff({ fence: f, plane: p, profiles: {}, priceBook: book, rule, taxRatePct, now: NOW });
}
const qtyOf = (t: ReturnType<typeof computeTakeOff>, sku: string) => t.lines.find((l) => l.sku === sku)?.qty;

describe("review: gate projection and clamping", () => {
  const segs = segmentsOf(fence(p, rect).vertices, true, p);

  it("projects the anchor onto the NEAREST segment, not segment 0", () => {
    // (99, 30) is 1 ft from side 1 (x = 100) and 30 ft from side 0.
    const g = gateAt(p, { x: 99, y: 30 }, 4, "east");
    const proj = projectGateAnchor(g.anchor, segs, p);
    expect(proj.segmentIndex).toBe(1);
    expect(proj.stationFt).toBeCloseTo(30, 3);
    expect(p.toXY(proj.lonLat).x).toBeCloseTo(100, 6);
    // (40, 49) -> side 2 (y = 50, runs west from (100,50)), station 60.
    const proj2 = projectGateAnchor(gateAt(p, { x: 40, y: 49 }, 4).anchor, segs, p);
    expect(proj2.segmentIndex).toBe(2);
    expect(proj2.stationFt).toBeCloseTo(60, 3);
    // Beyond a corner: (-3, -3) projects to a vertex (station 0 of side 0 or station 50 of side 3).
    const proj3 = projectGateAnchor(gateAt(p, { x: -3, y: -3 }, 4).anchor, segs, p);
    const xy = p.toXY(proj3.lonLat);
    expect(xy.x).toBeCloseTo(0, 6);
    expect(xy.y).toBeCloseTo(0, 6);
  });

  it("clamps a gate that would extend past the start of a segment: centre 1, width 4 -> [0, 4]", () => {
    const [pl] = placeGates([gateAt(p, { x: 1, y: 0 }, 4)], segs, p);
    expect(pl.startStationFt).toBe(0);
    expect(pl.endStationFt).toBeCloseTo(4, 6);
    expect(pl.centerStationFt).toBeCloseTo(1, 6);
    expect(pl.warnings).toEqual([]);
  });

  it("a gate wider than its segment warns and never yields negative run lengths", () => {
    const short = fence(p, [
      { x: 0, y: 0 },
      { x: 30, y: 0 },
      { x: 30, y: 6 },
      { x: 0, y: 6 },
    ]);
    const g = gateAt(p, { x: 30, y: 3 }, 16, "wide");
    const s = segmentsOf(short.vertices, true, p);
    const [pl] = placeGates([g], s, p);
    expect(pl.startStationFt).toBe(0);
    expect(pl.endStationFt).toBeCloseTo(6, 6);
    expect(pl.warnings).toEqual(["Gate wide (16 ft) is wider than segment 1 (6 ft)"]);
    const runs = runsOf(s, [pl], true);
    expect(runs.every((r) => r.lengthFt > 0 && r.endStationFt >= r.startStationFt)).toBe(true);
    expect(runs.filter((r) => r.segmentIndex === 1)).toHaveLength(0);
    const t = takeoff({ ...short, gates: [g] });
    // fence = 30 + 30 + 6 = 66; segment 1 contributes 0 ft, 0 sections, 0 line posts.
    expect(t.fenceLengthFt).toBeCloseTo(66, 6);
    expect(t.segments[1]).toMatchObject({ fenceFt: 0, sections: 0, linePosts: 0 });
    expect(t.segments.every((s2) => s2.fenceFt >= 0 && s2.sections >= 0 && s2.linePosts >= 0)).toBe(true);
    expect(t.lines.every((l) => l.qty > 0)).toBe(true);
  });
});

describe("review: two gates on one segment, gate at a vertex", () => {
  it("two 4 ft gates centred at 30 and 70 on side 0 -> three runs 28 / 36 / 28", () => {
    const g1 = gateAt(p, { x: 30, y: 0 }, 4, "a");
    const g2 = gateAt(p, { x: 70, y: 0 }, 4, "b");
    const f = fence(p, rect, { gates: [g1, g2] });
    const s = summarizeFence(f, p, {});
    const side0 = s.runs.filter((r) => r.segmentIndex === 0);
    expect(side0.map((r) => Math.round(r.lengthFt * 1e6) / 1e6)).toEqual([28, 36, 28]);
    expect(side0.map((r) => [r.startPost, r.endPost])).toEqual([
      ["line", "gate"],
      ["gate", "gate"],
      ["gate", "line"],
    ]);
    expect(s.runs).toHaveLength(6);
    expect(s.warnings).toEqual(["Slope not applied on 4 segment(s)"]);

    const t = takeoff(f);
    // Sections: 28 -> 4, 36 -> 5, 28 -> 4 (13 on side 0); 50 -> 7, 100 -> 13, 50 -> 7 -> 40 total.
    // Line posts: 3 + 4 + 3 = 10 on side 0; 6 + 12 + 6 = 24 elsewhere -> 34.
    // Posts: 4 corners + 34 line + 4 gate = 42 = |V| 4 + 34 + 2 x 2 gates - 0 upgraded.
    expect(t.segments[0]).toMatchObject({ sections: 13, linePosts: 10, gateIds: ["a", "b"] });
    expect(t.sections).toBe(40);
    expect(t.posts).toEqual({ corner: 4, end: 0, line: 34, gate: 4, total: 42 });
    expect(t.fenceLengthFt).toBeCloseTo(292, 6);
    expect(t.gates).toBe(2);
    expect(qtyOf(t, "GATE1")).toBe(2);
    expect(qtyOf(t, "HW")).toBe(2);
    expect(qtyOf(t, "LABG")).toBe(2);
    // pickets = ceil(292 x 12 / 6) = 584; rails = 40 x 3 = 120; labour = 292 ft.
    expect(qtyOf(t, "PICKET")).toBe(584);
    expect(qtyOf(t, "RAIL")).toBe(120);
    expect(qtyOf(t, "LAB")).toBe(292);
    // Concrete: 34 line x 1 + (4 corner + 4 gate) x 2 = 50.
    expect(qtyOf(t, "CONC")).toBe(50);
    expect(qtyOf(t, "TP")).toBe(8);
    // layoutPosts agrees: 4 gate posts at 28, 32, 68, 72 on side 0.
    const posts = layoutPosts(f, s.segments, s.placements, s.slopeFactorBySegment, woodRule(), p);
    expect(countPosts(posts)).toEqual(t.posts);
    const gatePosts = posts
      .filter((q) => q.kind === "gate")
      .map((q) => Math.round(q.stationFt * 1e6) / 1e6)
      .sort((a, b) => a - b);
    expect(gatePosts).toEqual([28, 32, 68, 72]);
  });

  it("a gate whose edge sits exactly on vertex 0 upgrades that post; the total is not double-counted", () => {
    // Anchor at the vertex, width 4 -> opening [0, 4] on side 0.
    const g = gateAt(p, { x: 0, y: 0 }, 4, "corner-gate");
    const f = fence(p, rect, { gates: [g] });
    const s = segmentsOf(f.vertices, true, p);
    const placements = placeGates([g], s, p);
    expect(placements[0]).toMatchObject({ segmentIndex: 0, startStationFt: 0 });
    expect(placements[0].endStationFt).toBeCloseTo(4, 6);
    expect(classifyVertexPosts(f, s, placements, p, 15).map((q) => q.kind)).toEqual(["gate", "corner", "corner", "corner"]);

    const t = takeoff(f);
    // Runs: side 0 [4,100] = 96 -> 12 sections / 11 line; sides 1..3 -> 7/13/7 sections, 6/12/6 line.
    // Posts: 3 corners + 35 line + 2 gate (one is the upgraded vertex) = 40 = |V| 4 + 35 + 2 - 1.
    expect(t.posts).toEqual({ corner: 3, end: 0, line: 35, gate: 2, total: 40 });
    expect(t.sections).toBe(39);
    expect(t.fenceLengthFt).toBeCloseTo(296, 6);
    const posts = layoutPosts(f, s, placements, { 0: 1, 1: 1, 2: 1, 3: 1 }, woodRule(), p);
    expect(countPosts(posts)).toEqual(t.posts);
    // Exactly one post at the vertex (kind gate) and one gate post at station 4.
    const atOrigin = posts.filter((q) => Math.hypot(q.at.x, q.at.y) < 1e-6);
    expect(atOrigin).toHaveLength(1);
    expect(atOrigin[0].kind).toBe("gate");
    expect(posts.filter((q) => q.kind === "gate").map((q) => Math.round(q.stationFt * 1e6) / 1e6).sort()).toEqual([0, 4]);
  });

  it("a gate on the END vertex of an open run upgrades the end post", () => {
    const f = fence(p, [{ x: 0, y: 0 }, { x: 100, y: 0 }], { closed: false, gates: [gateAt(p, { x: 100, y: 0 }, 4, "end-gate")] });
    const s = segmentsOf(f.vertices, false, p);
    const placements = placeGates(f.gates, s, p);
    expect(placements[0].startStationFt).toBeCloseTo(96, 6);
    expect(placements[0].endStationFt).toBeCloseTo(100, 6);
    expect(classifyVertexPosts(f, s, placements, p, 15).map((q) => q.kind)).toEqual(["end", "gate"]);
    const t = takeoff(f);
    // Run [0, 96] -> 12 sections, 11 line posts; posts = 1 end + 11 line + 2 gate = 14.
    expect(t.posts).toEqual({ corner: 0, end: 1, line: 11, gate: 2, total: 14 });
    expect(t.sections).toBe(12);
    expect(t.fenceLengthFt).toBeCloseTo(96, 6);
  });

  it("a gate edge 0.4 ft from a vertex: vertex upgraded, stub run dropped, no phantom section or post", () => {
    // Gate [0.4, 4.4]: vertex 0 is upgraded (edge within 0.5 ft), no gate post is laid at 0.4, and the
    // 0.4 ft stub is not a run, so classify / runsOf / layoutPosts / computeTakeOff must all agree.
    const g = gateAt(p, { x: 2.4, y: 0 }, 4, "stub");
    const f = fence(p, rect, { gates: [g] });
    const s = segmentsOf(f.vertices, true, p);
    const placements = placeGates([g], s, p);
    expect(placements[0].startStationFt).toBeCloseTo(0.4, 6);
    expect(classifyVertexPosts(f, s, placements, p, 15)[0].kind).toBe("gate");
    const runs = runsOf(s, placements, true).filter((r) => r.segmentIndex === 0);
    expect(runs).toHaveLength(1);
    expect(runs[0].startStationFt).toBeCloseTo(4.4, 6);
    const posts = layoutPosts(f, s, placements, {}, woodRule(), p);
    expect(posts.filter((q) => q.kind === "gate").map((q) => Math.round(q.stationFt * 1000) / 1000).sort()).toEqual([0, 4.4]);
    const t = takeoff(f);
    // Side 0: [4.4, 100] = 95.6 -> 12 sections; total 12 + 7 + 13 + 7 = 39; posts 3 + 35 + 2 = 40.
    expect(t.sections).toBe(39);
    expect(t.posts).toEqual({ corner: 3, end: 0, line: 35, gate: 2, total: 40 });
    expect(countPosts(posts)).toEqual(t.posts);
    expect(t.fenceLengthFt).toBeCloseTo(295.6, 6);
  });
});

describe("review: posts and sections on the canonical fences", () => {
  it("100 ft open run at 8 ft -> 14 posts (2 end + 12 line), 13 sections", () => {
    const t = takeoff(fence(p, [{ x: 0, y: 0 }, { x: 100, y: 0 }], { closed: false }));
    expect(t.posts).toEqual({ corner: 0, end: 2, line: 12, gate: 0, total: 14 });
    expect(t.sections).toBe(13);
    expect(qtyOf(t, "CONC")).toBe(12 + 2 * 2);
  });

  it("closed 100 x 50 at 8 ft -> 40 posts, 40 sections; with a 4 ft gate at station 22 on side 0 -> 41 posts", () => {
    const base = takeoff(fence(p, rect));
    expect(base.posts.total).toBe(40);
    expect(base.sections).toBe(40);
    expect(qtyOf(base, "PICKET")).toBe(600);
    expect(qtyOf(base, "RAIL")).toBe(120);
    expect(qtyOf(base, "CONC")).toBe(36 + 4 * 2);

    const g = takeoff(fence(p, rect, { gates: [gateAt(p, { x: 22, y: 0 }, 4)] }));
    // Runs 20 / 76 -> 3 + 10 = 13 sections, 2 + 9 = 11 line posts on side 0; 7 + 13 + 7 = 27 elsewhere -> 40.
    expect(g.segments[0]).toMatchObject({ sections: 13, linePosts: 11 });
    expect(g.sections).toBe(40);
    expect(g.posts).toEqual({ corner: 4, end: 0, line: 35, gate: 2, total: 41 });
    expect(qtyOf(g, "PICKET")).toBe(592);
    expect(qtyOf(g, "RAIL")).toBe(120);
    expect(qtyOf(g, "CONC")).toBe(35 + (4 + 2) * 2);
  });

  it("sectionsFor: ceil with a floating-residue guard, never 0 for a positive run", () => {
    expect(sectionsFor(100, 8)).toBe(13);
    expect(sectionsFor(96, 8)).toBe(12);
    expect(sectionsFor(96.0000000001, 8)).toBe(12);
    expect(sectionsFor(96.001, 8)).toBe(13);
    expect(sectionsFor(0.6, 8)).toBe(1);
    expect(sectionsFor(0, 8)).toBe(0);
  });
});

describe("review: waste, units, tax and money invariants", () => {
  it("waste rounds up on countable materials only; labour, gates and hardware are untouched", () => {
    const f = fence(p, rect, { gates: [gateAt(p, { x: 22, y: 0 }, 4)] });
    const t = takeoff(f, woodRule({ wastePct: 5 }));
    // raw: LP 35 -> ceil(36.75) = 37; TP 6 -> ceil(6.3) = 7; RAIL 120 -> 126; PICKET 592 -> ceil(621.6) = 622.
    expect(qtyOf(t, "LP")).toBe(37);
    expect(qtyOf(t, "TP")).toBe(7);
    expect(qtyOf(t, "RAIL")).toBe(126);
    expect(qtyOf(t, "PICKET")).toBe(622);
    expect(qtyOf(t, "LAB")).toBe(296);
    expect(qtyOf(t, "GATE1")).toBe(1);
    expect(qtyOf(t, "HW")).toBe(1);
    expect(qtyOf(t, "LABG")).toBe(1);
    for (const l of t.lines) {
      expect(Number.isInteger(l.qty)).toBe(true);
      expect(l.extendedCents).toBe(l.qty * l.unitPriceCents);
    }
  });

  it("'ft' units round up: 104.4 ft of fence bills 105 ft of labour", () => {
    // Use a 104.4 ft flat run so no elevation profile is needed.
    const t = takeoff(fence(p, [{ x: 0, y: 0 }, { x: 104.4, y: 0 }], { closed: false }));
    expect(qtyOf(t, "LAB")).toBe(105);
    expect(t.lines.find((l) => l.sku === "LAB")?.extendedCents).toBe(105 * 900);
  });

  it("tax applies only to taxable lines, half-up, and subtotal + tax = total in integer cents", () => {
    // Book: one taxable item at $0.10 x 3 and one taxable at $19.99 x 37, one non-taxable labour line.
    const items: PriceBookItem[] = [
      { sku: "DIME", description: "dime", category: "post", unit: "each", unitPriceCents: 10, taxable: true, roles: [] },
      { sku: "P1999", description: "post", category: "post", unit: "each", unitPriceCents: 1999, taxable: true, roles: [] },
      { sku: "LAB", description: "labour", category: "labor", unit: "ft", unitPriceCents: 900, taxable: false, roles: [] },
    ];
    const book: PriceBook = { id: "b", name: "b", importedAt: NOW, items, rules: [] };
    // Open run of 3 x 8 + tiny -> exactly 3 sections? Use 24 ft: sections 3, line posts 2, end posts 2.
    // Bind linePost -> DIME (qty 2), terminalPost -> P1999 (qty 2). To get 3 x $0.10 and 37 x $19.99
    // we instead use a 37-terminal shape: simpler to check the arithmetic directly on the lines.
    const rule = woodRule({
      skus: { linePost: "DIME", terminalPost: "P1999", laborPerFt: "LAB" },
      requiredRoles: ["linePost", "terminalPost", "laborPerFt"],
      railsPerSection: undefined,
      picketWidthIn: undefined,
      picketGapIn: undefined,
      concreteBagsPerLinePost: 0,
      concreteBagsPerTerminalPost: 0,
    });
    // 296 ft open run at 8 ft: sections 37, line posts 36, end posts 2.
    const t = takeoff(fence(p, [{ x: 0, y: 0 }, { x: 296, y: 0 }], { closed: false }), rule, book, 7.25);
    expect(qtyOf(t, "DIME")).toBe(36);
    expect(qtyOf(t, "P1999")).toBe(2);
    expect(qtyOf(t, "LAB")).toBe(296);
    // taxable = 36 x 10 + 2 x 1999 = 4,358; tax = 4358 x 0.0725 = 315.955 -> 316; labour 266,400 untaxed.
    expect(t.subtotalCents).toBe(360 + 3998 + 266400);
    expect(t.taxCents).toBe(316);
    expect(t.totalCents).toBe(t.subtotalCents + 316);
    expect(Number.isInteger(t.totalCents)).toBe(true);
  });

  it("3 x $0.10 and 37 x $19.99 extend without float drift", () => {
    const items: PriceBookItem[] = [
      { sku: "DIME", description: "dime", category: "rail", unit: "each", unitPriceCents: 10, taxable: true, roles: [] },
      { sku: "P1999", description: "picket", category: "picket", unit: "each", unitPriceCents: 1999, taxable: true, roles: [] },
    ];
    const book: PriceBook = { id: "b", name: "b", importedAt: NOW, items, rules: [] };
    // 1 section (7 ft open run): rails = 1 x 3 -> bind rail -> DIME and railsPerSection 3 -> 3 x $0.10.
    // Pickets: 7 ft x 12 / pitch = 37 -> pitch = 84/37 in.
    const rule = woodRule({
      skus: { rail: "DIME", picket: "P1999" },
      requiredRoles: ["rail", "picket"],
      railsPerSection: 3,
      picketWidthIn: 84 / 37,
      picketGapIn: 0,
      concreteBagsPerLinePost: 0,
      concreteBagsPerTerminalPost: 0,
    });
    const t = takeoff(fence(p, [{ x: 0, y: 0 }, { x: 7, y: 0 }], { closed: false }), rule, book, 8.875);
    expect(qtyOf(t, "DIME")).toBe(3);
    expect(qtyOf(t, "P1999")).toBe(37);
    expect(t.lines.find((l) => l.sku === "DIME")?.extendedCents).toBe(30);
    expect(t.lines.find((l) => l.sku === "P1999")?.extendedCents).toBe(73963);
    // subtotal 73,993; tax = 73993 x 0.08875 = 6566.87875 -> 6567; total 80,560.
    expect(t.subtotalCents).toBe(73993);
    expect(t.taxCents).toBe(6567);
    expect(t.totalCents).toBe(80560);
  });
});

describe("review: roll and panel styles", () => {
  function rollBook(): PriceBook {
    const item = (sku: string, category: PriceBookItem["category"], unit: PriceBookItem["unit"], cents: number, extra: Partial<PriceBookItem> = {}): PriceBookItem => ({
      sku,
      description: sku,
      category,
      unit,
      unitPriceCents: cents,
      taxable: true,
      roles: [],
      ...extra,
    });
    return {
      id: "cl",
      name: "cl",
      importedAt: NOW,
      rules: [],
      items: [
        item("CL-LP", "post", "each", 1100),
        item("CL-TP", "post", "each", 2400),
        item("CL-FAB", "fabric", "roll", 9500, { rollLengthFt: 50 }),
        item("CL-TR", "rail", "ft", 150),
        item("CONC", "concrete", "bag", 500),
        item("LAB", "labor", "ft", 700, { taxable: false }),
        item("G1", "gate", "each", 20000),
        item("G2", "gate", "each", 35000),
        item("HW", "hardware", "each", 2500),
        item("VP", "panel", "each", 8000),
        item("CAP", "cap", "each", 300),
      ],
    };
  }
  const chainLink = (over: Partial<StyleRule> = {}): StyleRule => ({
    id: "chain-link-4",
    name: "Chain link 4",
    sectionModel: "roll",
    heightFt: 4,
    postSpacingFt: 10,
    cornerThresholdDeg: 15,
    concreteBagsPerLinePost: 1,
    concreteBagsPerTerminalPost: 2,
    wastePct: 0,
    requiredRoles: ["linePost", "terminalPost", "fabric", "topRail", "concrete", "laborPerFt", "gateSingle", "gateDouble", "gateHardware"],
    skus: { linePost: "CL-LP", terminalPost: "CL-TP", fabric: "CL-FAB", topRail: "CL-TR", concrete: "CONC", laborPerFt: "LAB", gateSingle: "G1", gateDouble: "G2", gateHardware: "HW" },
    ...over,
  });

  it("chain link 100 x 50 with a 4 ft gate: rolls = ceil(296 / 50) = 6, top rail 296 ft, terminal posts = corner + gate", () => {
    const f = fence(p, rect, { gates: [gateAt(p, { x: 22, y: 0 }, 4)], styleId: "chain-link-4", heightFt: 4 });
    const t = takeoff(f, chainLink(), rollBook());
    // Runs 20 / 76 / 50 / 100 / 50 at 10 ft: sections 2 + 8 + 5 + 10 + 5 = 30; line posts 1 + 7 + 4 + 9 + 4 = 25.
    expect(t.sections).toBe(30);
    expect(t.posts).toEqual({ corner: 4, end: 0, line: 25, gate: 2, total: 31 });
    expect(qtyOf(t, "CL-FAB")).toBe(6);
    expect(qtyOf(t, "CL-TR")).toBe(296);
    expect(qtyOf(t, "CL-TP")).toBe(6);
    expect(qtyOf(t, "CL-LP")).toBe(25);
    expect(qtyOf(t, "CONC")).toBe(25 + 6 * 2);
    expect(qtyOf(t, "LAB")).toBe(296);
    expect(qtyOf(t, "G1")).toBe(1);
    expect(qtyOf(t, "HW")).toBe(1);
    expect(t.warnings).toEqual(["Slope not applied on 4 segment(s)"]);
    // 300.5 ft of fence needs 7 rolls (6.01 -> 7), computed before any waste.
    const f2 = fence(p, [{ x: 0, y: 0 }, { x: 300.5, y: 0 }], { closed: false });
    expect(qtyOf(takeoff(f2, chainLink(), rollBook()), "CL-FAB")).toBe(7);
    expect(qtyOf(takeoff(f2, chainLink(), rollBook()), "CL-TR")).toBe(301);
  });

  it("panel style: panels = sections, caps = posts.total, spacing = panel width", () => {
    const vinyl: StyleRule = {
      id: "vinyl-6",
      name: "Vinyl 6",
      sectionModel: "panel",
      heightFt: 6,
      postSpacingFt: 8,
      panelWidthFt: 8,
      cornerThresholdDeg: 15,
      concreteBagsPerLinePost: 1,
      concreteBagsPerTerminalPost: 2,
      wastePct: 0,
      requiredRoles: ["linePost", "terminalPost", "panel", "cap", "concrete", "laborPerFt", "gateSingle", "gateDouble", "gateHardware"],
      skus: { linePost: "CL-LP", terminalPost: "CL-TP", panel: "VP", cap: "CAP", concrete: "CONC", laborPerFt: "LAB", gateSingle: "G1", gateDouble: "G2", gateHardware: "HW" },
    };
    const t = takeoff(fence(p, rect, { styleId: "vinyl-6" }), vinyl, rollBook());
    expect(t.sections).toBe(40);
    expect(qtyOf(t, "VP")).toBe(40);
    expect(qtyOf(t, "CAP")).toBe(40);
    expect(t.posts.total).toBe(40);
    // With 5 % waste: panels ceil(42) = 42, caps ceil(42) = 42, posts ceil(37.8) = 38 line, ceil(4.2) = 5 terminal.
    const w = takeoff(fence(p, rect, { styleId: "vinyl-6" }), { ...vinyl, wastePct: 5 }, rollBook());
    expect(qtyOf(w, "VP")).toBe(42);
    expect(qtyOf(w, "CAP")).toBe(42);
    expect(qtyOf(w, "CL-LP")).toBe(38);
    expect(qtyOf(w, "CL-TP")).toBe(5);
    expect(qtyOf(w, "CONC")).toBe(44);
  });
});
