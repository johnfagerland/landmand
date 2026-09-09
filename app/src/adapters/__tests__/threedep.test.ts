import { afterEach, describe, expect, it, vi } from "vitest";
import { ThreeDepElevationProvider, metresToFeet, resolutionToMetres } from "../elevation/threedep";
import { fixture, jsonResponse, mockFetch, never } from "./helpers";

afterEach(() => vi.unstubAllGlobals());

type Reply = { samples: { locationId: number; value: string; resolution: number }[] };
const five: [number, number][] = [
  [-78.6455, 35.8065],
  [-78.6453, 35.8066],
  [-78.6451, 35.8067],
  [-78.6449, 35.8068],
  [-78.6447, 35.8069],
];

describe("ThreeDepElevationProvider", () => {
  it("POSTs a multipoint and converts string metres to feet, ordered by locationId", async () => {
    const reply = fixture<Reply>("threedep-multipoint-5.json");
    // shuffle the reply to prove locationId ordering
    const shuffled = { samples: [reply.samples[3], reply.samples[0], reply.samples[4], reply.samples[1], reply.samples[2]] };
    const { calls } = mockFetch(() => jsonResponse(shuffled));
    const r = await new ThreeDepElevationProvider().sample(five, never);
    expect(calls).toHaveLength(1);
    expect(calls[0].method).toBe("POST");
    expect(calls[0].url).toBe("https://elevation.nationalmap.gov/arcgis/rest/services/3DEPElevation/ImageServer/getSamples");
    const p = calls[0].params;
    expect(p.get("geometryType")).toBe("esriGeometryMultipoint");
    expect(p.get("returnFirstValueOnly")).toBe("true");
    expect(p.get("f")).toBe("json");
    expect(JSON.parse(p.get("geometry") ?? "{}")).toEqual({ points: five, spatialReference: { wkid: 4326 } });

    expect(r.source).toBe("3dep");
    expect(r.elevationsFt).toHaveLength(5);
    expect(r.elevationsFt[0]).toBeCloseTo(86.154304504 * 3.280839895, 1);
    expect(r.elevationsFt[3]).toBeCloseTo(83.705657959 * 3.280839895, 1);
    expect(r.resolutionM).toBeCloseTo(3.44, 1); // 3.086e-5 deg * 111320
  });

  it('maps "NoData" to null but keeps the rest', async () => {
    const reply = fixture<Reply>("threedep-multipoint-5.json");
    reply.samples[2].value = "NoData";
    mockFetch(() => jsonResponse(reply));
    const r = await new ThreeDepElevationProvider().sample(five, never);
    expect(r.source).toBe("3dep");
    expect(r.elevationsFt[2]).toBeNull();
    expect(r.elevationsFt[1]).not.toBeNull();
  });

  it("chunks at 150: 200 points -> 2 requests, stitched in order", async () => {
    const points: [number, number][] = Array.from({ length: 200 }, (_, i) => [-78.6 + i * 1e-4, 35.8]);
    const { calls } = mockFetch((c) => {
      const n = (JSON.parse(c.params.get("geometry") ?? "{}") as { points: number[][] }).points.length;
      const offset = calls.length === 1 ? 0 : 150;
      return jsonResponse({ samples: Array.from({ length: n }, (_, i) => ({ locationId: i, value: String(offset + i), resolution: 3.086e-5 })) });
    });
    const r = await new ThreeDepElevationProvider().sample(points, never);
    expect(calls).toHaveLength(2);
    const sizes = calls.map((c) => (JSON.parse(c.params.get("geometry") ?? "{}") as { points: number[][] }).points.length);
    expect(sizes).toEqual([150, 50]);
    expect(r.elevationsFt).toHaveLength(200);
    expect(r.elevationsFt[0]).toBe(0);
    expect(r.elevationsFt[149]).toBeCloseTo(149 * 3.280839895, 2);
    expect(r.elevationsFt[150]).toBeCloseTo(150 * 3.280839895, 2);
    expect(r.elevationsFt[199]).toBeCloseTo(199 * 3.280839895, 2);
  });

  it("never throws: transport failure -> source none, all nulls", async () => {
    mockFetch(() => new TypeError("down"));
    const r = await new ThreeDepElevationProvider().sample(five, never);
    expect(r).toEqual({ source: "none", elevationsFt: [null, null, null, null, null] });
  });

  it("ArcGIS error body -> source none", async () => {
    mockFetch(() => jsonResponse({ error: { code: 500, message: "x" } }));
    const r = await new ThreeDepElevationProvider().sample(five, never);
    expect(r.source).toBe("none");
  });

  it("unit helpers", () => {
    expect(metresToFeet("86.154304504")).toBeCloseTo(282.66, 2);
    expect(metresToFeet("NoData")).toBeNull();
    expect(metresToFeet("")).toBeNull();
    expect(metresToFeet(-9999)).toBeNull();
    expect(resolutionToMetres(3.086419871794868e-5)).toBeCloseTo(3.44, 2);
    expect(resolutionToMetres(10)).toBe(10);
    expect(resolutionToMetres("x")).toBeUndefined();
  });
});
