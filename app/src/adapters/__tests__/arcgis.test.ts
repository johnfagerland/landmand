import { afterEach, describe, expect, it, vi } from "vitest";
import { ArcGisParcelProvider, addressWhere, likePrefix } from "../parcel/arcgis";
import { findByFips } from "../parcel/registry";
import type { CountyRegistryEntry } from "../types";
import { fixture, jsonResponse, mockFetch, never } from "./helpers";

afterEach(() => vi.unstubAllGlobals());

const wake = findByFips("37183") as CountyRegistryEntry;
const maricopa = findByFips("04013") as CountyRegistryEntry;
const wakeInput = { lonLat: [-78.6449947, 35.8061485] as [number, number], number: "1823", street: "WHITE OAK RD", countyFips: "37183" };
const empty = { type: "FeatureCollection", features: [] };

describe("LIKE clause", () => {
  it("uppercases, collapses whitespace and doubles single quotes", () => {
    expect(likePrefix("12", "o'neil   st")).toBe("12 O''NEIL ST");
    expect(addressWhere("SITE_ADDRESS", "1823", "White Oak Rd")).toBe("UPPER(SITE_ADDRESS) LIKE '1823 WHITE OAK RD%'");
  });
  it("strips characters that are not safe in a LIKE literal", () => {
    expect(likePrefix("1", "MAIN; DROP TABLE")).toBe("1 MAIN DROP TABLE");
  });
});

describe("ArcGisParcelProvider", () => {
  it("has id county:<fips> and covers by FIPS first, bbox otherwise", () => {
    const p = new ArcGisParcelProvider(wake);
    expect(p.id).toBe("county:37183");
    expect(p.enabled()).toBe(true);
    expect(p.covers(wakeInput)).toBe(true);
    expect(p.covers({ ...wakeInput, countyFips: "04013" })).toBe(false);
    expect(p.covers({ lonLat: wakeInput.lonLat })).toBe(true);
    expect(p.covers({ lonLat: [-112.074, 33.4484] })).toBe(false);
  });

  it("runs the address query first as a POST form body and scores both Wake parcels as exact", async () => {
    const { calls } = mockFetch(() => jsonResponse(fixture("wake-address-1823-white-oak.geojson")));
    const r = await new ArcGisParcelProvider(wake).lookup(wakeInput, never);
    expect(calls).toHaveLength(1);
    expect(calls[0].url).toBe(`${wake.url}/query`);
    expect(calls[0].method).toBe("POST");
    const p = calls[0].params;
    expect(p.get("where")).toBe("UPPER(SITE_ADDRESS) LIKE '1823 WHITE OAK RD%'");
    expect(p.get("outFields")).toBe("PIN_NUM,SITE_ADDRESS,CALC_AREA");
    expect(p.get("outSR")).toBe("4326");
    expect(p.get("geometryPrecision")).toBe("8");
    expect(p.get("returnGeometry")).toBe("true");
    expect(p.get("f")).toBe("geojson");
    expect(p.has("geometry")).toBe(false);

    expect(r.status).toBe("found");
    if (r.status !== "found") return;
    expect(r.providerId).toBe("county:37183");
    expect(r.candidates).toHaveLength(2);
    expect(r.candidates.map((c) => c.parcel.apn)).toEqual(expect.arrayContaining(["1704581656", "1704581587"]));
    for (const c of r.candidates) {
      expect(c.match).toBe("address");
      expect(c.score).toBe(100);
      expect(c.parcel.id).toBe(`county:37183:${c.parcel.apn}`);
      expect(c.parcel.source).toBe("county");
      expect(c.parcel.attribution).toBe(wake.attribution);
      expect(c.parcel.siteAddress).toBe("1823 WHITE OAK RD");
      expect(c.distanceFt).toBeGreaterThan(0); // centreline point is outside both lots
      expect(Date.parse(c.parcel.fetchedAt)).not.toBeNaN();
    }
    // sorted by score desc then distance asc
    expect(r.candidates[0].distanceFt).toBeLessThanOrEqual(r.candidates[1].distanceFt);
  });

  it("scores address prefix matches 90 and exact 100, exact first", async () => {
    const fc = fixture<{ features: { properties: Record<string, unknown> }[] }>("wake-address-1823-white-oak.geojson");
    fc.features[0].properties.SITE_ADDRESS = "1823 WHITE OAK RD UNIT B";
    mockFetch(() => jsonResponse(fc));
    const r = await new ArcGisParcelProvider(wake).lookup(wakeInput, never);
    if (r.status !== "found") throw new Error("expected found");
    expect(r.candidates.map((c) => c.score)).toEqual([100, 90]);
    expect(r.candidates[0].parcel.apn).toBe("1704581587");
  });

  it("falls back to a JSON point-geometry intersect, then a nearby query", async () => {
    const { calls } = mockFetch((_c, i) => (i < 2 ? jsonResponse(empty) : jsonResponse(fixture("maricopa-point-11221086.geojson"))));
    const r = await new ArcGisParcelProvider(maricopa).lookup({ lonLat: [-112.074, 33.4484], number: "2", street: "N CENTRAL AVE", countyFips: "04013" }, never);
    expect(calls).toHaveLength(3);
    const point = calls[1].params;
    expect(point.has("where")).toBe(false);
    expect(JSON.parse(point.get("geometry") ?? "{}")).toEqual({ x: -112.074, y: 33.4484, spatialReference: { wkid: 4326 } });
    expect(point.get("geometryType")).toBe("esriGeometryPoint");
    expect(point.get("inSR")).toBe("4326");
    expect(point.get("spatialRel")).toBe("esriSpatialRelIntersects");
    expect(point.has("distance")).toBe(false);
    const nearby = calls[2].params;
    expect(nearby.get("distance")).toBe("40");
    expect(nearby.get("units")).toBe("esriSRUnit_Meter");
    expect(JSON.parse(nearby.get("geometry") ?? "{}").spatialReference.wkid).toBe(4326);

    if (r.status !== "found") throw new Error("expected found");
    expect(r.candidates[0].match).toBe("nearby");
    expect(r.candidates[0].parcel.apn).toBe("11221086");
    expect(r.candidates[0].distanceFt).toBe(0); // the point is inside this parcel
    expect(r.candidates[0].score).toBe(70);
  });

  it("scores a point-intersect hit 80 with distance 0", async () => {
    mockFetch((_c, i) => (i === 0 ? jsonResponse(fixture("maricopa-point-11221086.geojson")) : jsonResponse(empty)));
    const r = await new ArcGisParcelProvider(maricopa).lookup({ lonLat: [-112.074, 33.4484] }, never);
    if (r.status !== "found") throw new Error("expected found");
    expect(r.candidates[0]).toMatchObject({ match: "point", score: 80, distanceFt: 0 });
  });

  it("retries with f=json and converts Esri rings when f=geojson is rejected", async () => {
    const { calls } = mockFetch((c) =>
      c.params.get("f") === "geojson"
        ? jsonResponse({ error: { code: 400, message: "Invalid format" } })
        : jsonResponse(fixture("wake-address-1823-white-oak.esri.json")),
    );
    const r = await new ArcGisParcelProvider(wake).lookup(wakeInput, never);
    expect(calls.map((c) => c.params.get("f"))).toEqual(["geojson", "json"]);
    if (r.status !== "found") throw new Error("expected found");
    expect(r.candidates).toHaveLength(2);
    const big = r.candidates.find((c) => c.parcel.apn === "1704581656");
    expect(big?.parcel.ring).toHaveLength(10);
    expect(big?.parcel.areaSqFt).toBeGreaterThan(18_000);
  });

  it("returns no_match when every strategy is empty", async () => {
    const { calls } = mockFetch(() => jsonResponse(empty));
    const r = await new ArcGisParcelProvider(wake).lookup(wakeInput, never);
    expect(r).toEqual({ status: "none", providerId: "county:37183", reason: "no_match" });
    expect(calls).toHaveLength(3);
  });

  it("skips the address strategy when number/street are missing", async () => {
    const { calls } = mockFetch(() => jsonResponse(empty));
    await new ArcGisParcelProvider(wake).lookup({ lonLat: wakeInput.lonLat, countyFips: "37183" }, never);
    expect(calls).toHaveLength(2);
    expect(calls.every((c) => !c.params.has("where"))).toBe(true);
  });

  it("never throws: fetch rejecting -> upstream_error", async () => {
    mockFetch(() => new TypeError("ECONNRESET"));
    const r = await new ArcGisParcelProvider(wake).lookup(wakeInput, never);
    expect(r).toEqual({ status: "none", providerId: "county:37183", reason: "upstream_error" });
  });

  it("never throws: timeout -> reason timeout", async () => {
    mockFetch(() => new Promise<Response>((_r, reject) => setTimeout(() => reject(new DOMException("t", "TimeoutError")), 100)));
    const r = await new ArcGisParcelProvider(wake, 30).lookup(wakeInput, never);
    expect(r).toEqual({ status: "none", providerId: "county:37183", reason: "timeout" });
  });

  it("returns no_coverage for a point/county outside the entry", async () => {
    mockFetch(() => jsonResponse(empty));
    const r = await new ArcGisParcelProvider(wake).lookup({ lonLat: [-112.074, 33.4484], countyFips: "04013" }, never);
    expect(r).toEqual({ status: "none", providerId: "county:37183", reason: "no_coverage" });
  });
});
