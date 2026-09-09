import { describe, expect, it } from "vitest";
import { length as turfLength } from "@turf/turf";
import { readFileSync } from "node:fs";
import { centroidOf, createLocalPlane } from "../geo/localPlane";
import { normalizeRing } from "../geo/ring";
import { segmentKey, segmentsOf, totalLengthFt } from "../geo/segments";
import { nearestPointOnRing, nearestVertex, projectPointToSegment } from "../geo/snap";
import { FT_PER_M } from "../units";
import type { LonLat } from "../types";

const raw = (
  JSON.parse(readFileSync(new URL("./fixtures/wake-1823-white-oak.geojson", import.meta.url), "utf8")) as {
    geometry: { coordinates: LonLat[][] };
  }
).geometry.coordinates[0];

describe("localPlane", () => {
  const origin = centroidOf(raw);
  const plane = createLocalPlane(origin);

  it("uses ellipsoidal metres per degree at 35.8 N", () => {
    // ~110,955 m/deg lat and ~90,383 m/deg lon at this latitude.
    expect(Math.abs(plane.ftPerDegLat / FT_PER_M - 110955)).toBeLessThan(5);
    expect(Math.abs(plane.ftPerDegLon / FT_PER_M - 90383)).toBeLessThan(5);
    expect(plane.origin).toEqual(origin);
    expect(plane.toXY(origin)).toEqual({ x: 0, y: 0 });
  });

  it("round trips within 0.01 ft", () => {
    for (const v of raw) {
      const back = plane.toLonLat(plane.toXY(v));
      const d = plane.toXY(back);
      const o = plane.toXY(v);
      expect(Math.hypot(d.x - o.x, d.y - o.y)).toBeLessThan(0.01);
    }
    const far = plane.toXY([origin[0] + 0.01, origin[1] - 0.01]);
    const back = plane.toLonLat(far);
    expect(back[0]).toBeCloseTo(origin[0] + 0.01, 9);
    expect(back[1]).toBeCloseTo(origin[1] - 0.01, 9);
  });

  it("segment lengths agree with turf.length within 0.3 %", () => {
    const ring = normalizeRing(raw, plane);
    const planar = totalLengthFt(segmentsOf(ring, true, plane));
    const geodesic =
      turfLength({ type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: [...ring, ring[0]] } }, { units: "kilometers" }) *
      1000 *
      FT_PER_M;
    expect(Math.abs(planar - geodesic) / geodesic).toBeLessThan(0.003);
  });

  it("x grows east and y grows north", () => {
    const e = plane.toXY([origin[0] + 0.001, origin[1]]);
    const n = plane.toXY([origin[0], origin[1] + 0.001]);
    expect(e.x).toBeGreaterThan(0);
    expect(Math.abs(e.y)).toBeLessThan(1e-9);
    expect(n.y).toBeGreaterThan(0);
    expect(Math.abs(n.x)).toBeLessThan(1e-9);
  });

  it("centroidOf averages points", () => {
    expect(centroidOf([[0, 0], [2, 4]])).toEqual([1, 2]);
    expect(centroidOf([])).toEqual([0, 0]);
  });
});

describe("segmentKey", () => {
  it("is direction-independent, rounded to 6 dp", () => {
    const a: LonLat = [-78.6453259, 35.8066908];
    const b: LonLat = [-78.6456147, 35.8067325];
    expect(segmentKey(a, b)).toBe(segmentKey(b, a));
    expect(segmentKey(a, b)).toBe("-78.645326,35.806691|-78.645615,35.806733");
    expect(segmentKey([a[0] + 3e-7, a[1]], b)).toBe(segmentKey(a, b));
    expect(segmentKey([a[0] + 6e-7, a[1]], b)).not.toBe(segmentKey(a, b));
    expect(segmentKey([-0.0000001, 0], [1, 1])).toBe("0.000000,0.000000|1.000000,1.000000");
  });
});

describe("snap", () => {
  const plane = createLocalPlane([-78.6453, 35.8066]);
  const square: LonLat[] = [
    { x: 0, y: 0 },
    { x: 100, y: 0 },
    { x: 100, y: 100 },
    { x: 0, y: 100 },
  ].map((q) => plane.toLonLat(q));

  it("projectPointToSegment clamps t", () => {
    const a = { x: 0, y: 0 };
    const b = { x: 10, y: 0 };
    expect(projectPointToSegment({ x: 5, y: 3 }, a, b)).toEqual({ point: { x: 5, y: 0 }, t: 0.5, distance: 3 });
    expect(projectPointToSegment({ x: -5, y: 0 }, a, b).t).toBe(0);
    expect(projectPointToSegment({ x: 50, y: 4 }, a, b)).toEqual({ point: { x: 10, y: 0 }, t: 1, distance: Math.hypot(40, 4) });
    expect(projectPointToSegment({ x: 3, y: 4 }, a, a)).toEqual({ point: a, t: 0, distance: 5 });
  });

  it("nearestVertex and nearestPointOnRing", () => {
    const probe = plane.toLonLat({ x: 98, y: 40 });
    const v = nearestVertex(probe, square, plane);
    expect(v?.kind).toBe("vertex");
    expect(v?.index).toBe(1);
    expect(v?.distanceFt).toBeCloseTo(Math.hypot(2, 40), 6);

    const e = nearestPointOnRing(probe, square, true, plane);
    expect(e?.kind).toBe("edge");
    expect(e?.index).toBe(1);
    expect(e?.t).toBeCloseTo(0.4, 6);
    expect(e?.distanceFt).toBeCloseTo(2, 6);
    expect(plane.toXY(e!.lonLat).x).toBeCloseTo(100, 6);

    // Open line: the closing edge is not a candidate.
    const near3 = plane.toLonLat({ x: 2, y: 50 });
    expect(nearestPointOnRing(near3, square, true, plane)?.index).toBe(3);
    const open = nearestPointOnRing(near3, square, false, plane);
    expect(open?.index).not.toBe(3);

    expect(nearestVertex(probe, [], plane)).toBeNull();
    expect(nearestPointOnRing(probe, [square[0]], true, plane)).toBeNull();
  });
});
