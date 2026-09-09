import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { centroidOf, createLocalPlane } from "../geo/localPlane";
import { isClockwise, normalizeRing, ringAreaSqFt, RingError } from "../geo/ring";
import { segmentsOf, totalLengthFt } from "../geo/segments";
import type { LonLat } from "../types";

const feature = JSON.parse(
  readFileSync(new URL("./fixtures/wake-1823-white-oak.geojson", import.meta.url), "utf8"),
) as { geometry: { coordinates: LonLat[][] }; properties: { CALC_AREA: number } };
const raw = feature.geometry.coordinates[0];

describe("Wake County fixture: 1823 White Oak Rd", () => {
  const plane = createLocalPlane(centroidOf(raw));
  const ring = normalizeRing(raw, plane);

  it("drops the closing duplicate and the 0.8 ft sliver", () => {
    expect(raw).toHaveLength(12);
    // 12 coords = 11 distinct + closing duplicate; the last-to-first edge is the ~0.8 ft sliver.
    expect(ring).toHaveLength(10);
    const segs = segmentsOf(ring, true, plane);
    expect(segs).toHaveLength(10);
    expect(Math.min(...segs.map((s) => s.lengthFt))).toBeGreaterThanOrEqual(1);
    for (const v of ring) {
      expect(v[0]).toBe(Math.round(v[0] * 1e7) / 1e7);
      expect(v[1]).toBe(Math.round(v[1] * 1e7) / 1e7);
    }
  });

  it("perimeter 718.8 +/- 0.2 ft and area 18,300 +/- 30 sq ft, CCW", () => {
    const segs = segmentsOf(ring, true, plane);
    expect(Math.abs(totalLengthFt(segs) - 718.8)).toBeLessThan(0.2);
    const area = ringAreaSqFt(ring, plane);
    expect(Math.abs(area - 18300)).toBeLessThan(30);
    expect(isClockwise(ring.map((v) => plane.toXY(v)))).toBe(false);
    // Reproduces the county's CALC_AREA (acres) to within 0.1 %.
    expect(area / 43560).toBeCloseTo(feature.properties.CALC_AREA, 3);
  });

  it("is idempotent and keeps a CW input's orientation CCW", () => {
    expect(normalizeRing(ring, plane)).toEqual(ring);
    const cw = raw.slice().reverse();
    const again = normalizeRing(cw, plane);
    expect(isClockwise(again.map((v) => plane.toXY(v)))).toBe(false);
    expect(again).toHaveLength(10);
  });

  it("rejects rings with fewer than 3 usable vertices", () => {
    expect(() => normalizeRing(raw.slice(0, 2), plane)).toThrow(RingError);
    try {
      normalizeRing([raw[0], raw[0], raw[0], raw[1]], plane);
    } catch (e) {
      expect(e).toBeInstanceOf(RingError);
      expect((e as RingError).code).toBe("too_few_vertices");
    }
  });
});
