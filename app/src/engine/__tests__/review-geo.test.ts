/**
 * Adversarial review: local plane, ring normalisation, segments, offset, snap.
 * Expected values are hand-computed (see the comments), not copied from the implementation.
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { booleanPointInPolygon, distance as turfDistance, kinks } from "@turf/turf";
import { centroidOf, createLocalPlane } from "../geo/localPlane";
import { offsetEdges, offsetRing } from "../geo/offset";
import { isClockwise, normalizeRing, RingError, roundLonLat, signedArea } from "../geo/ring";
import { bearingDeg, deflectionDeg, segmentKey, segmentsOf, totalLengthFt } from "../geo/segments";
import { nearestPointOnRing, projectPointToSegment } from "../geo/snap";
import { FT_PER_M } from "../units";
import type { LonLat, XY } from "../types";
import { fromXY, plane, rectXY } from "./helpers";

function closedPolygon(ring: LonLat[]) {
  return { type: "Polygon" as const, coordinates: [[...ring, ring[0]]] };
}

describe("review: localPlane", () => {
  it("uses the ORIGIN latitude for ftPerDegLon (Anchorage 61.2181 N)", () => {
    // Hand: mPerDegLon(61.2181) = 111412.84 cos φ − 93.5 cos 3φ + 0.118 cos 5φ = 53,736.6 m → 176,299 ft.
    // mPerDegLat = 111,432.4 m → 365,593 ft. At the equator ftPerDegLon would be 365,221 ft.
    const p = createLocalPlane([-149.9003, 61.2181]);
    expect(Math.abs(p.ftPerDegLon - 176299.5)).toBeLessThan(2);
    expect(Math.abs(p.ftPerDegLat - 365592.8)).toBeLessThan(2);
    expect(p.ftPerDegLon / p.ftPerDegLat).toBeCloseTo(Math.cos((61.2181 * Math.PI) / 180), 2);
  });

  it("round-trips a 300 ft lot at 61 N and near (0, 0) to floating precision", () => {
    for (const origin of [[-149.9003, 61.2181], [0.0001, 0.0001], [-78.6453, 35.8066]] as LonLat[]) {
      const p = createLocalPlane(origin);
      for (const q of [
        { x: 300, y: -150 },
        { x: -0.01, y: 0.01 },
        { x: 1234.5, y: 987.6 },
      ]) {
        const back = p.toXY(p.toLonLat(q));
        expect(Math.hypot(back.x - q.x, back.y - q.y)).toBeLessThan(1e-7);
      }
    }
  });

  it("matches exact WGS84 metres-per-degree to 1e-5 at 0, 35.8, 61.2 and 70 N", () => {
    // Exact ellipsoid: M = a(1−e²)/(1−e² sin²φ)^1.5, N = a/sqrt(1−e² sin²φ); m/deg = M·π/180, N cos φ·π/180.
    const a = 6378137;
    const f = 1 / 298.257223563;
    const e2 = f * (2 - f);
    for (const lat of [0, 35.8066, 61.2181, 70]) {
      const phi = (lat * Math.PI) / 180;
      const s2 = Math.sin(phi) ** 2;
      const M = (a * (1 - e2)) / Math.pow(1 - e2 * s2, 1.5);
      const N = a / Math.sqrt(1 - e2 * s2);
      const p = createLocalPlane([-100, lat]);
      expect(Math.abs(p.ftPerDegLat / FT_PER_M - (M * Math.PI) / 180) / ((M * Math.PI) / 180)).toBeLessThan(1e-5);
      expect(Math.abs(p.ftPerDegLon / FT_PER_M - (N * Math.cos(phi) * Math.PI) / 180) / ((N * Math.cos(phi) * Math.PI) / 180)).toBeLessThan(1e-5);
    }
    // turf.distance is spherical (R = 6371 km) and differs from the ellipsoid by up to ~0.4 % at 61 N,
    // so it is only a coarse cross-check here.
    const origin: LonLat = [-149.9003, 61.2181];
    const p = createLocalPlane(origin);
    const geodesicFt = turfDistance(origin, p.toLonLat({ x: 60, y: 80 }), { units: "meters" }) * FT_PER_M;
    expect(Math.abs(geodesicFt - 100) / 100).toBeLessThan(0.005);
  });

  it("centroidOf a ring with a repeated closing vertex still lands inside the ring", () => {
    const p = plane();
    const ring = fromXY(p, rectXY(100, 50));
    const c = centroidOf([...ring, ring[0]]);
    const cxy = p.toXY(c);
    expect(cxy.x).toBeGreaterThan(0);
    expect(cxy.x).toBeLessThan(100);
    expect(cxy.y).toBeGreaterThan(0);
    expect(cxy.y).toBeLessThan(50);
    // Without the duplicate the centroid is the exact centre.
    const exact = p.toXY(centroidOf(ring));
    expect(exact.x).toBeCloseTo(50, 6);
    expect(exact.y).toBeCloseTo(25, 6);
  });
});

describe("review: normalizeRing", () => {
  const p = plane();

  it("removes the closing duplicate and a last-to-first sliver, and rejects 2 usable vertices", () => {
    const tri: XY[] = [
      { x: 0, y: 0 },
      { x: 60, y: 0 },
      { x: 30, y: 40 },
    ];
    const withSliver = fromXY(p, [...tri, { x: 0.5, y: 0.3 }]); // 0.58 ft from vertex 0 via the closing edge
    const closed = [...withSliver, withSliver[0]];
    const out = normalizeRing(closed, p);
    expect(out).toHaveLength(3);
    expect(out.map((v) => p.toXY(v)).map((q) => Math.round(q.x))).toEqual([0, 60, 30]);

    // Three vertices where two are 0.4 ft apart -> 2 usable -> rejected.
    expect(() => normalizeRing(fromXY(p, [{ x: 0, y: 0 }, { x: 0.4, y: 0 }, { x: 30, y: 40 }]), p)).toThrow(RingError);
    // Exactly 3 usable vertices are accepted.
    expect(normalizeRing(fromXY(p, tri), p)).toHaveLength(3);
  });

  it("collinear and duplicate vertices: duplicates merge, collinear vertices (> 1 ft apart) are kept", () => {
    const pts: XY[] = [
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { x: 50, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 50 },
      { x: 0, y: 50 },
    ];
    const out = normalizeRing(fromXY(p, pts), p);
    expect(out).toHaveLength(5);
    // A fully collinear ring has zero area -> degenerate.
    expect(() => normalizeRing(fromXY(p, [{ x: 0, y: 0 }, { x: 50, y: 0 }, { x: 100, y: 0 }]), p)).toThrow(RingError);
  });

  it("forces CW input to CCW and is idempotent", () => {
    const cw = fromXY(p, rectXY(100, 50).reverse());
    const out = normalizeRing(cw, p);
    expect(isClockwise(out.map((v) => p.toXY(v)))).toBe(false);
    expect(normalizeRing(out, p)).toEqual(out);
  });

  it("7-dp rounding cannot reintroduce a sliver: the output re-normalises to itself", () => {
    // Two vertices 1.004 ft apart along x. 1e-7 deg lon is 0.0297 ft here, so rounding can move each
    // endpoint by up to 0.0148 ft; unrounded they pass the 1 ft rule, rounded they may not.
    const ftPerDegLon = p.ftPerDegLon;
    let found: LonLat[] | null = null;
    for (let k = 0; k < 400 && !found; k++) {
      const x0 = 3.1 + k * 0.0037;
      const a = p.toLonLat({ x: x0, y: 0 });
      const b = p.toLonLat({ x: x0 + 1.004, y: 0 });
      const ra = roundLonLat(a);
      const rb = roundLonLat(b);
      if (Math.abs(rb[0] - ra[0]) * ftPerDegLon < 0.999) {
        found = [a, b, p.toLonLat({ x: 100, y: 0 }), p.toLonLat({ x: 100, y: 50 }), p.toLonLat({ x: 0, y: 50 })];
      }
    }
    expect(found).not.toBeNull();
    const once = normalizeRing(found!, p);
    const twice = normalizeRing(once, p);
    expect(twice).toEqual(once);
    // Every output edge honours the 1 ft rule.
    const segs = segmentsOf(once, true, p);
    expect(Math.min(...segs.map((s) => s.lengthFt))).toBeGreaterThanOrEqual(1);
  });
});

describe("review: segments", () => {
  const p = plane();

  it("closed vs open counts; bearings north = 0, east = 90", () => {
    const v = fromXY(p, rectXY(100, 50));
    expect(segmentsOf(v, true, p)).toHaveLength(4);
    expect(segmentsOf(v, false, p)).toHaveLength(3);
    expect(segmentsOf(v.slice(0, 1), true, p)).toHaveLength(0);
    const segs = segmentsOf(v, true, p);
    expect(segs.map((s) => Math.round(s.bearingDeg))).toEqual([90, 0, 270, 180]);
    expect(bearingDeg({ x: 0, y: 0 }, { x: 1, y: 1 })).toBeCloseTo(45, 9);
    expect(bearingDeg({ x: 0, y: 0 }, { x: -1, y: 1 })).toBeCloseTo(315, 9);
  });

  it("deflection is symmetric and within 0..180", () => {
    for (const [a, b] of [
      [0, 0],
      [10, 350],
      [359, 1],
      [90, 270],
      [270, 90],
      [0, 180],
      [45, 225.5],
      [720, -10],
    ]) {
      const d = deflectionDeg(a, b);
      expect(d).toBe(deflectionDeg(b, a));
      expect(d).toBeGreaterThanOrEqual(0);
      expect(d).toBeLessThanOrEqual(180);
    }
    expect(deflectionDeg(359, 1)).toBeCloseTo(2, 9);
    expect(deflectionDeg(45, 225.5)).toBeCloseTo(179.5, 9);
  });

  it("segmentKey is the same for reversed endpoints and for sub-1e-7 jitter on stored (7-dp) vertices", () => {
    // Stored 7-dp vertices whose 7th digit is not a 5 (a 6-dp rounding boundary would be ambiguous).
    const a: LonLat = [-78.6452581, 35.8067861];
    const b: LonLat = [-78.6454873, 35.8066093];
    expect(segmentKey(a, b)).toBe(segmentKey(b, a));
    // Floating jitter far below 7 dp (e.g. from a lon/lat -> XY -> lon/lat round trip) keys identically.
    const jitter = (v: LonLat): LonLat => [v[0] + 3e-12, v[1] - 3e-12];
    expect(segmentKey(jitter(a), jitter(b))).toBe(segmentKey(a, b));
    expect(segmentKey(roundLonLat(jitter(b)), roundLonLat(jitter(a)))).toBe(segmentKey(a, b));
    const [seg] = segmentsOf([a, b], false, p);
    expect(seg.key).toBe(segmentKey(b, a));
    // Note: a coordinate sitting exactly on a 6-dp rounding boundary can key differently before and
    // after 7-dp rounding (double rounding); the engine only ever keys stored 7-dp vertices, so the
    // profile cache and summarizeFence always agree.
  });
});

describe("review: offset", () => {
  const p = plane();
  const xy = (ring: LonLat[]) => ring.map((v) => p.toXY(v));
  const r1 = (v: number) => Math.round(v * 10) / 10;

  it("a CW-ordered 100 x 50 offset inward 5 also gives 90 x 40 (inward, never outward)", () => {
    const cw = fromXY(p, rectXY(100, 50).reverse());
    const r = offsetRing(cw, 5, p);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const pts = xy(r.ring).map((q) => ({ x: r1(q.x), y: r1(q.y) }));
    const xs = pts.map((q) => q.x).sort((a, b) => a - b);
    const ys = pts.map((q) => q.y).sort((a, b) => a - b);
    expect(xs).toEqual([5, 5, 95, 95]);
    expect(ys).toEqual([5, 5, 45, 45]);
    expect(signedArea(xy(r.ring))).toBeGreaterThan(0);
  });

  it("too-large offsets never return a self-intersecting ring", () => {
    for (const ft of [24.99, 25, 26, 30, 49, 60, 1000]) {
      const r = offsetRing(fromXY(p, rectXY(100, 50)), ft, p);
      if (r.ok) {
        expect(r.ring.length).toBeGreaterThanOrEqual(3);
        expect(kinks(closedPolygon(r.ring)).features).toHaveLength(0);
        expect(signedArea(xy(r.ring))).toBeGreaterThan(0);
        // Must lie strictly inside the original rectangle.
        for (const q of xy(r.ring)) {
          expect(q.x).toBeGreaterThan(0);
          expect(q.x).toBeLessThan(100);
          expect(q.y).toBeGreaterThan(0);
          expect(q.y).toBeLessThan(50);
        }
      }
    }
  });

  it("a collinear vertex (parallel neighbours) is slid along the normal, not dropped or spiked", () => {
    const withMid: XY[] = [
      { x: 0, y: 0 },
      { x: 50, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 50 },
      { x: 0, y: 50 },
    ];
    const r = offsetRing(fromXY(p, withMid), 5, p);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.ring).toHaveLength(5);
    const pts = xy(r.ring).map((q) => ({ x: r1(q.x), y: r1(q.y) }));
    expect(pts).toEqual([
      { x: 5, y: 5 },
      { x: 50, y: 5 },
      { x: 95, y: 5 },
      { x: 95, y: 45 },
      { x: 5, y: 45 },
    ]);
  });

  it("the real Wake ring offset 5 ft keeps 10 vertices, no kinks, and lies inside the parcel", () => {
    const raw = (
      JSON.parse(readFileSync(new URL("./fixtures/wake-1823-white-oak.geojson", import.meta.url), "utf8")) as {
        geometry: { coordinates: LonLat[][] };
      }
    ).geometry.coordinates[0];
    const wp = createLocalPlane(centroidOf(raw));
    const ring = normalizeRing(raw, wp);
    const r = offsetRing(ring, 5, wp);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.ring).toHaveLength(ring.length);
    expect(kinks(closedPolygon(r.ring)).features).toHaveLength(0);
    expect(isClockwise(r.ring.map((v) => wp.toXY(v)))).toBe(false);
    const inside = r.ring.every((v) => booleanPointInPolygon(v, closedPolygon(ring)));
    expect(inside).toBe(true);
    // Perimeter shrinks by roughly 2π·5 ≈ 31 ft for a convex-ish lot (718.8 -> ~688).
    const before = totalLengthFt(segmentsOf(ring, true, wp));
    const after = totalLengthFt(segmentsOf(r.ring, true, wp));
    expect(before - after).toBeGreaterThan(20);
    expect(before - after).toBeLessThan(45);
  });

  it("offsetEdges moves only the listed edge; every other vertex is unchanged to 1e-6 ft (7-dp input)", () => {
    // Store-shaped input: already rounded to 7 dp, like a Parcel.ring.
    const L: XY[] = [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 40 },
      { x: 60, y: 40 },
      { x: 60, y: 80 },
      { x: 0, y: 80 },
    ];
    const ring = fromXY(p, L).map(roundLonLat);
    const before = xy(ring);
    // Edge 2 runs west along y = 40 from (100,40) to (60,40); the notch (x 60..100, y 40..80) is OUTSIDE,
    // so the interior is below the edge and inward is -y: the edge lands on y = 36.
    const r = offsetEdges(ring, { 2: 4 }, p);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const after = xy(r.ring);
    expect(after).toHaveLength(6);
    // The moved vertices are re-rounded to 7 dp (about 0.03 ft here), so allow 0.05 ft on them.
    expect(Math.abs(after[2].x - 100)).toBeLessThan(0.05);
    expect(Math.abs(after[2].y - 36)).toBeLessThan(0.05);
    expect(Math.abs(after[3].x - 60)).toBeLessThan(0.05);
    expect(Math.abs(after[3].y - 36)).toBeLessThan(0.05);
    for (const i of [0, 1, 4, 5]) {
      expect(Math.hypot(after[i].x - before[i].x, after[i].y - before[i].y)).toBeLessThan(1e-6);
      expect(r.ring[i]).toEqual(ring[i]);
    }
  });

  it("offsetEdges on a CW-ordered ring moves the edge the caller named", () => {
    // CW rectangle: v0 (0,0), v1 (0,50), v2 (100,50), v3 (100,0). Edge 0 is the WEST side (x = 0).
    const cw = fromXY(p, [
      { x: 0, y: 0 },
      { x: 0, y: 50 },
      { x: 100, y: 50 },
      { x: 100, y: 0 },
    ]);
    const r = offsetEdges(cw, { 0: 10 }, p);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const pts = xy(r.ring).map((q) => ({ x: r1(q.x), y: r1(q.y) }));
    const xs = pts.map((q) => q.x).sort((a, b) => a - b);
    const ys = pts.map((q) => q.y).sort((a, b) => a - b);
    // West side moved 10 ft inward (east): x in {10, 100}; y untouched {0, 50}.
    expect(xs).toEqual([10, 10, 100, 100]);
    expect(ys).toEqual([0, 0, 50, 50]);
  });
});

describe("review: snap", () => {
  const p = plane();
  const square = fromXY(p, rectXY(100, 100));

  it("nearestPointOnRing uses the closing edge only for closed rings", () => {
    const probe = p.toLonLat({ x: 1, y: 50 }); // 1 ft from the closing edge x = 0
    const closed = nearestPointOnRing(probe, square, true, p)!;
    expect(closed.index).toBe(3);
    expect(closed.distanceFt).toBeCloseTo(1, 6);
    expect(closed.t).toBeCloseTo(0.5, 6);
    const open = nearestPointOnRing(probe, square, false, p)!;
    // Open polyline: edges 0..2 only; the nearest is edge 0 (y = 0) or edge 2 (y = 100), both 50 ft away.
    expect(open.index).not.toBe(3);
    expect(open.distanceFt).toBeCloseTo(50, 6);
  });

  it("projectPointToSegment clamps t at both ends and handles a zero-length segment", () => {
    const a = { x: 10, y: 10 };
    const b = { x: 20, y: 10 };
    expect(projectPointToSegment({ x: 0, y: 10 }, a, b)).toEqual({ point: a, t: 0, distance: 10 });
    expect(projectPointToSegment({ x: 25, y: 10 }, a, b)).toEqual({ point: b, t: 1, distance: 5 });
    expect(projectPointToSegment({ x: 13, y: 14 }, a, a)).toEqual({ point: a, t: 0, distance: 5 });
  });
});
