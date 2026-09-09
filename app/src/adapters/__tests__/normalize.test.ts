import { booleanClockwise } from "@turf/turf";
import type { MultiPolygon, Polygon } from "geojson";
import { describe, expect, it } from "vitest";
import { cleanRing, esriRingsToGeoJson, normalizeParcel, pickPart } from "../parcel/normalize";
import { fixture } from "./helpers";

type Esri = { features: { attributes: Record<string, unknown>; geometry: { rings: number[][][] } }[] };
type GeoJsonFc = { features: { geometry: Polygon; properties: Record<string, unknown> }[] };

const base = { providerId: "county:37183", source: "county" as const, attribution: "Lot lines: Wake County GIS", fetchedAt: "2026-09-08T00:00:00.000Z" };

describe("normalizeParcel", () => {
  it("converts the Wake GeoJSON parcel: unclosed, CCW, sliver merged, 7 dp, area ~0.42 ac", () => {
    const fc = fixture<GeoJsonFc>("wake-address-1823-white-oak.geojson");
    const p = normalizeParcel({ ...base, geometry: fc.features[0].geometry, apn: "1704581656", siteAddress: "1823 WHITE OAK RD" });
    expect(p).not.toBeNull();
    expect(p?.id).toBe("county:37183:1704581656");
    // 12 positions closed -> 11 distinct -> the 0.8 ft sliver merged -> 10
    expect(p?.ring).toHaveLength(10);
    expect(p?.ring[0]).not.toEqual(p?.ring[p.ring.length - 1]);
    expect(booleanClockwise([...(p?.ring ?? []), p?.ring[0] ?? [0, 0]])).toBe(false);
    for (const [lon, lat] of p?.ring ?? []) {
      expect(String(lon).split(".")[1]?.length ?? 0).toBeLessThanOrEqual(7);
      expect(String(lat).split(".")[1]?.length ?? 0).toBeLessThanOrEqual(7);
    }
    expect(p?.areaSqFt).toBeGreaterThan(18_300 - 80);
    expect(p?.areaSqFt).toBeLessThan(18_300 + 80);
    expect(p?.origin[0]).toBeCloseTo(-78.6453, 3);
    expect(p?.origin[1]).toBeCloseTo(35.8065, 3);
    expect(p?.holes).toEqual([]);
    expect(p?.source).toBe("county");
    expect(p?.siteAddress).toBe("1823 WHITE OAK RD");
  });

  it("converts Esri rings (CW outer) to a CCW ring with the same vertices as the GeoJSON reply", () => {
    const esri = fixture<Esri>("wake-address-1823-white-oak.esri.json");
    const geo = fixture<GeoJsonFc>("wake-address-1823-white-oak.geojson");
    const fromEsri = normalizeParcel({ ...base, geometry: esri.features[0].geometry, apn: "1704581656" });
    const fromGeo = normalizeParcel({ ...base, geometry: geo.features[0].geometry, apn: "1704581656" });
    expect(booleanClockwise([...esri.features[0].geometry.rings[0]])).toBe(true);
    expect(fromEsri?.ring).toHaveLength(fromGeo?.ring.length ?? -1);
    const asSet = (r: number[][]) => new Set(r.map((p) => p.join(",")));
    expect(asSet(fromEsri?.ring ?? [])).toEqual(asSet(fromGeo?.ring ?? []));
    expect(fromEsri?.areaSqFt).toBeCloseTo(fromGeo?.areaSqFt ?? 0, 0);
  });

  it("forces a clockwise GeoJSON ring to CCW", () => {
    const cw: Polygon = { type: "Polygon", coordinates: [[[0, 0], [0, 1], [1, 1], [1, 0], [0, 0]]] };
    const p = normalizeParcel({ ...base, geometry: cw, apn: "x" });
    expect(p?.ring).toEqual([[0, 0], [1, 0], [1, 1], [0, 1]]);
  });

  it("groups Esri holes with their outer ring", () => {
    const rings = [
      [[0, 0], [0, 10], [10, 10], [10, 0], [0, 0]], // CW outer
      [[2, 2], [8, 2], [8, 8], [2, 8], [2, 2]], // CCW hole
    ];
    const g = esriRingsToGeoJson(rings);
    expect(g?.type).toBe("Polygon");
    expect((g as Polygon).coordinates).toHaveLength(2);
    const p = normalizeParcel({ ...base, geometry: g, apn: "h" });
    expect(p?.holes).toHaveLength(1);
    expect(p?.ring).toHaveLength(4);
  });

  it("picks the multipolygon part containing the point, else the largest", () => {
    const mp: MultiPolygon = {
      type: "MultiPolygon",
      coordinates: [
        [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]], // small, contains (0.5, 0.5)
        [[[5, 5], [9, 5], [9, 9], [5, 9], [5, 5]]], // large
      ],
    };
    expect(pickPart(mp, [0.5, 0.5])?.[0][0]).toEqual([0, 0]);
    expect(pickPart(mp, [50, 50])?.[0][0]).toEqual([5, 5]);
    expect(pickPart(mp)?.[0][0]).toEqual([5, 5]);
    const p = normalizeParcel({ ...base, geometry: mp, apn: "m", point: [0.5, 0.5] });
    expect(p?.ring).toHaveLength(4);
    expect(p?.ring.every(([lon]) => lon <= 1)).toBe(true);
  });

  it("merges consecutive points closer than 0.3 m and drops the closing duplicate", () => {
    const ring = [[0, 0], [0.000001, 0], [0.001, 0], [0.001, 0.001], [0, 0.001], [0, 0]];
    const out = cleanRing(ring);
    expect(out).toEqual([[0, 0], [0.001, 0], [0.001, 0.001], [0, 0.001]]);
  });

  it("returns null for degenerate geometry", () => {
    expect(normalizeParcel({ ...base, geometry: null })).toBeNull();
    expect(normalizeParcel({ ...base, geometry: { type: "Polygon", coordinates: [[[0, 0], [0, 0], [0, 0], [0, 0]]] } })).toBeNull();
    expect(normalizeParcel({ ...base, geometry: { rings: [] } })).toBeNull();
  });
});
