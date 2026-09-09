import { describe, expect, it } from "vitest";
import { buildProfile, flatProfile, stationPoints } from "../elevation/profile";
import { segmentsOf } from "../geo/segments";
import { computeTakeOff, summarizeFence } from "../takeoff/takeoff";
import type { ElevationProfile, ElevationSample, FenceSegment } from "../types";
import { fence, NOW, plane, woodPriceBook, woodRule } from "./helpers";

const p = plane();
const run100 = fence(
  p,
  [
    { x: 0, y: 0 },
    { x: 100, y: 0 },
  ],
  { closed: false },
);
const [seg] = segmentsOf(run100.vertices, false, p);

function samplesFrom(s: FenceSegment, z: (stationFt: number) => number | null): ElevationSample[] {
  return stationPoints(s, p).map((st) => ({ stationFt: st.stationFt, elevFt: z(st.stationFt), lonLat: st.lonLat }));
}

function withProfile(profile: ElevationProfile) {
  return computeTakeOff({
    fence: run100,
    plane: p,
    profiles: { [seg.key]: profile },
    priceBook: woodPriceBook(),
    rule: woodRule(),
    taxRatePct: 0,
    now: NOW,
  });
}

describe("slope: station points", () => {
  it("places stations every 10 ft including both ends", () => {
    const pts = stationPoints(seg, p);
    expect(pts).toHaveLength(11);
    expect(pts[0].stationFt).toBe(0);
    expect(pts[10].stationFt).toBeCloseTo(100, 9);
    expect(pts[3].stationFt).toBeCloseTo(30, 9);
    expect(p.toXY(pts[3].lonLat).x).toBeCloseTo(30, 6);
  });

  it("clamps to 2..61 stations", () => {
    const tiny = segmentsOf(fence(p, [{ x: 0, y: 0 }, { x: 3, y: 0 }], { closed: false }).vertices, false, p)[0];
    expect(stationPoints(tiny, p)).toHaveLength(2);
    const long = segmentsOf(fence(p, [{ x: 0, y: 0 }, { x: 2000, y: 0 }], { closed: false }).vertices, false, p)[0];
    expect(stationPoints(long, p)).toHaveLength(61);
  });
});

describe("slope: 100 ft run", () => {
  it("rising 30 ft linearly -> corrected 104.40, factor 1.0440, posts 15", () => {
    const profile = buildProfile(seg, samplesFrom(seg, (s) => 0.3 * s), "3dep", 1);
    expect(profile.correctedLengthFt).toBeCloseTo(104.4, 2);
    expect(Math.abs(profile.correctedLengthFt - 104.4031)).toBeLessThan(0.01);
    expect(profile.slopeFactor).toBeCloseTo(1.044, 4);
    expect(profile.riseFt).toBeCloseTo(30, 6);
    expect(profile.maxGradePct).toBeCloseTo(30, 6);
    expect(profile.source).toBe("3dep");
    expect(profile.resolutionM).toBe(1);

    const t = withProfile(profile);
    expect(t.posts).toEqual({ corner: 0, end: 2, line: 13, gate: 0, total: 15 });
    expect(t.sections).toBe(14);
    expect(t.correctedLengthFt).toBeCloseTo(104.4, 2);
    expect(t.fenceLengthFt).toBeCloseTo(104.4, 2);
    expect(t.slopeFactor).toBeCloseTo(1.044, 4);
    expect(t.warnings).toEqual(["Segment 0 grade 30% exceeds 25%; check post depth and step/rack the fence"]);
    expect(t.lines.find((l) => l.sku === "LAB")?.qty).toBe(105);
  });

  it("hill up 15 / down 15 -> 104.40", () => {
    const profile = buildProfile(seg, samplesFrom(seg, (s) => (s <= 50 ? 0.3 * s : 0.3 * (100 - s))), "3dep");
    expect(profile.correctedLengthFt).toBeCloseTo(104.4, 2);
    expect(profile.riseFt).toBeCloseTo(0, 6);
    expect(profile.maxGradePct).toBeCloseTo(30, 6);
  });

  it("flat with +/- 0.3 ft alternating noise -> factor <= 1.003", () => {
    const profile = buildProfile(seg, samplesFrom(seg, (s) => (Math.round(s / 10) % 2 === 0 ? 0.3 : -0.3)), "3dep");
    expect(profile.slopeFactor).toBeGreaterThanOrEqual(1);
    expect(profile.slopeFactor).toBeLessThanOrEqual(1.003);
    expect(profile.maxGradePct).toBeLessThan(25);
  });

  it("no profile -> factor 1 + warning", () => {
    const t = computeTakeOff({ fence: run100, plane: p, profiles: {}, priceBook: woodPriceBook(), rule: woodRule(), taxRatePct: 0, now: NOW });
    expect(t.slopeFactor).toBe(1);
    expect(t.correctedLengthFt).toBeCloseTo(100, 6);
    expect(t.posts.total).toBe(14);
    expect(t.warnings).toEqual(["Slope not applied on 1 segment(s)"]);
    const s = summarizeFence(run100, p, { [seg.key]: flatProfile(seg) });
    expect(s.slopeFactorBySegment[0]).toBe(1);
    expect(s.warnings).toEqual(["Slope not applied on 1 segment(s)"]);
  });

  it("all-null samples -> source none, factor 1", () => {
    const profile = buildProfile(seg, samplesFrom(seg, () => null), "3dep");
    expect(profile.source).toBe("none");
    expect(profile.slopeFactor).toBe(1);
    expect(profile.correctedLengthFt).toBeCloseTo(100, 6);
  });

  it("interpolates null gaps linearly", () => {
    const profile = buildProfile(seg, samplesFrom(seg, (s) => (s > 25 && s < 65 ? null : 0.3 * s)), "epqs");
    expect(profile.source).toBe("epqs");
    expect(profile.correctedLengthFt).toBeCloseTo(104.4, 2);
  });

  it("flatProfile is keyed by the segment", () => {
    const f = flatProfile(seg);
    expect(f.segmentKey).toBe(seg.key);
    expect(f.correctedLengthFt).toBeCloseTo(100, 6);
    expect(f.source).toBe("none");
  });
});
