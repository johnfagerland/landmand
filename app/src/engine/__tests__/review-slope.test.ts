/**
 * Adversarial review: elevation profiles and slope correction.
 * Hand values: 100 ft run rising 30 ft -> sqrt(100² + 30²) = 104.4031 ft (factor 1.04403).
 */
import { describe, expect, it } from "vitest";
import { buildProfile, stationPoints } from "../elevation/profile";
import { segmentsOf } from "../geo/segments";
import { computeTakeOff } from "../takeoff/takeoff";
import type { ElevationSample, FenceSegment } from "../types";
import { fence, NOW, plane, woodPriceBook, woodRule } from "./helpers";

const p = plane();
const run100 = fence(p, [{ x: 0, y: 0 }, { x: 100, y: 0 }], { closed: false });
const [seg] = segmentsOf(run100.vertices, false, p);
const HYP = Math.hypot(100, 30); // 104.4030651

function samples(s: FenceSegment, z: (stationFt: number) => number | null): ElevationSample[] {
  return stationPoints(s, p).map((st) => ({ stationFt: st.stationFt, elevFt: z(st.stationFt), lonLat: st.lonLat }));
}

describe("review: slope", () => {
  it("linear 30 % grade: the moving average is exact on a linear series, ends included -> 104.40 ± 0.01", () => {
    const pr = buildProfile(seg, samples(seg, (s) => 0.3 * s), "3dep", 1);
    expect(Math.abs(pr.correctedLengthFt - HYP)).toBeLessThan(0.01);
    expect(pr.slopeFactor).toBeCloseTo(HYP / 100, 6);
    expect(pr.riseFt).toBeCloseTo(30, 6);
    expect(pr.maxGradePct).toBeCloseTo(30, 6);
    // Falling 30 ft gives the same corrected length; rise is signed, grade is not.
    const down = buildProfile(seg, samples(seg, (s) => 120 - 0.3 * s), "3dep", 1);
    expect(Math.abs(down.correctedLengthFt - HYP)).toBeLessThan(0.01);
    expect(down.riseFt).toBeCloseTo(-30, 6);
    expect(down.maxGradePct).toBeCloseTo(30, 6);
  });

  it("linear profile with an offset base elevation (300 ft datum) is unaffected", () => {
    const pr = buildProfile(seg, samples(seg, (s) => 300 + 0.3 * s), "3dep");
    expect(Math.abs(pr.correctedLengthFt - HYP)).toBeLessThan(0.01);
  });

  it("hill up 15 / down 15 keeps the crest (adjustment > 1 ft is not smoothed) -> 104.40", () => {
    const pr = buildProfile(seg, samples(seg, (s) => (s <= 50 ? 0.3 * s : 0.3 * (100 - s))), "3dep");
    expect(Math.abs(pr.correctedLengthFt - HYP)).toBeLessThan(0.01);
    expect(pr.riseFt).toBeCloseTo(0, 6);
  });

  it("flat with ± 0.3 ft alternating noise -> factor <= 1.003 (hand: smoothed 1.00020)", () => {
    const pr = buildProfile(seg, samples(seg, (s) => (Math.round(s / 10) % 2 === 0 ? 0.3 : -0.3)), "3dep");
    // Interior samples average to ±0.1 and the ends stay ±0.3, so the smoothed series is
    // [0.3, 0.1, -0.1, 0.1, ..., 0.1, 0.3]: every step is 0.2 ft -> 10·hypot(10, 0.2) = 100.020.
    expect(pr.correctedLengthFt).toBeCloseTo(100.02, 2);
    expect(pr.slopeFactor).toBeLessThanOrEqual(1.003);
    expect(pr.slopeFactor).toBeGreaterThanOrEqual(1);
  });

  it("all-null -> source none, factor 1, corrected = flat", () => {
    const pr = buildProfile(seg, samples(seg, () => null), "epqs", 10);
    expect(pr.source).toBe("none");
    expect(pr.slopeFactor).toBe(1);
    expect(pr.correctedLengthFt).toBeCloseTo(100, 9);
    expect(pr.samples).toHaveLength(11);
    // A single valid sample is not a profile either.
    const one = buildProfile(seg, samples(seg, (s) => (s === 0 ? 5 : null)), "3dep");
    expect(one.source).toBe("none");
    expect(one.slopeFactor).toBe(1);
  });

  it("interior nulls are interpolated linearly: linear grade still gives 104.40", () => {
    const pr = buildProfile(seg, samples(seg, (s) => (s > 15 && s < 75 ? null : 0.3 * s)), "3dep");
    expect(Math.abs(pr.correctedLengthFt - HYP)).toBeLessThan(0.01);
    expect(pr.source).toBe("3dep");
  });

  it("nulls at BOTH ends do not flatten the segment: the factor comes from the covered span", () => {
    // Stations 0 and 100 are NoData, 10..90 follow 0.3·s. Copying the nearest known value into the
    // ends would give 10 + 8·10.44 + 10 = 103.52 ft (factor 1.0352); the covered 80 ft span has
    // factor 1.04403, and applied to the whole 100 ft segment that is 104.40 ft.
    const pr = buildProfile(seg, samples(seg, (s) => (s < 5 || s > 95 ? null : 0.3 * s)), "3dep");
    expect(Math.abs(pr.correctedLengthFt - HYP)).toBeLessThan(0.01);
    expect(pr.slopeFactor).toBeCloseTo(HYP / 100, 5);
    expect(pr.maxGradePct).toBeCloseTo(30, 6);
    expect(pr.riseFt).toBeCloseTo(24, 6); // over the covered span 10..90
  });

  it("maxGradePct is sign-independent and warns above 25 %", () => {
    const up = buildProfile(seg, samples(seg, (s) => 0.26 * s), "3dep");
    const down = buildProfile(seg, samples(seg, (s) => -0.26 * s), "3dep");
    expect(up.maxGradePct).toBeCloseTo(26, 6);
    expect(down.maxGradePct).toBeCloseTo(26, 6);
    const t = computeTakeOff({ fence: run100, plane: p, profiles: { [seg.key]: down }, priceBook: woodPriceBook(), rule: woodRule(), taxRatePct: 0, now: NOW });
    expect(t.warnings).toEqual(["Segment 0 grade 26% exceeds 25%; check post depth and step/rack the fence"]);
    const gentle = buildProfile(seg, samples(seg, (s) => 0.2 * s), "3dep");
    const t2 = computeTakeOff({ fence: run100, plane: p, profiles: { [seg.key]: gentle }, priceBook: woodPriceBook(), rule: woodRule(), taxRatePct: 0, now: NOW });
    expect(t2.warnings).toEqual([]);
  });

  it("posts on a sloped run use the corrected length: 100 ft at 30 ft rise, 8 ft spacing -> 14 sections, 15 posts", () => {
    const pr = buildProfile(seg, samples(seg, (s) => 0.3 * s), "3dep");
    const t = computeTakeOff({ fence: run100, plane: p, profiles: { [seg.key]: pr }, priceBook: woodPriceBook(), rule: woodRule(), taxRatePct: 0, now: NOW });
    expect(t.sections).toBe(14);
    expect(t.posts).toEqual({ corner: 0, end: 2, line: 13, gate: 0, total: 15 });
    expect(t.fenceLengthFt).toBeCloseTo(HYP, 3);
    expect(t.flatLengthFt).toBeCloseTo(100, 6);
    // Pickets and labour follow the corrected length: ceil(104.403 x 2) = 209 pickets, 105 ft labour.
    expect(t.lines.find((l) => l.sku === "PICKET")?.qty).toBe(209);
    expect(t.lines.find((l) => l.sku === "LAB")?.qty).toBe(105);
    expect(t.lines.find((l) => l.sku === "RAIL")?.qty).toBe(42);
  });

  it("a profile with a non-finite or sub-1 factor is clamped to 1 in the summary", () => {
    const bad = { ...buildProfile(seg, samples(seg, (s) => 0.3 * s), "3dep"), slopeFactor: 0.9 };
    const t = computeTakeOff({ fence: run100, plane: p, profiles: { [seg.key]: bad }, priceBook: woodPriceBook(), rule: woodRule(), taxRatePct: 0, now: NOW });
    expect(t.slopeFactor).toBe(1);
    const nan = { ...bad, slopeFactor: Number.NaN };
    const t2 = computeTakeOff({ fence: run100, plane: p, profiles: { [seg.key]: nan }, priceBook: woodPriceBook(), rule: woodRule(), taxRatePct: 0, now: NOW });
    expect(t2.slopeFactor).toBe(1);
    expect(t2.warnings).toContain("Slope not applied on 1 segment(s)");
  });
});
