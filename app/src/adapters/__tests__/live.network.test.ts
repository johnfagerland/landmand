/**
 * Real endpoints. Run with `pnpm test:network`. Each case documents one verified data source (see the plan's "Verified today").
 */
import { describe, expect, it } from "vitest";
import { EpqsElevationProvider } from "../elevation/epqs";
import { ThreeDepElevationProvider } from "../elevation/threedep";
import { CensusGeocoder } from "../geocoder/census";
import { ArcGisParcelProvider } from "../parcel/arcgis";
import { findByFips } from "../parcel/registry";
import type { CountyRegistryEntry } from "../types";

const signal = () => AbortSignal.timeout(25_000);

/** Perimeter in feet using an equirectangular local plane (adapters may not import engine bodies). */
function perimeterFt(ring: [number, number][]): number {
  const lat0 = (ring.reduce((s, p) => s + p[1], 0) / ring.length) * (Math.PI / 180);
  const mLat = 111_132.92 - 559.82 * Math.cos(2 * lat0) + 1.175 * Math.cos(4 * lat0);
  const mLon = 111_412.84 * Math.cos(lat0) - 93.5 * Math.cos(3 * lat0);
  let total = 0;
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i];
    const b = ring[(i + 1) % ring.length];
    total += Math.hypot((b[0] - a[0]) * mLon, (b[1] - a[1]) * mLat);
  }
  return total * 3.280839895;
}

describe("live: Census geocoder", () => {
  it("returns county 37183 and a point near (-78.6473, 35.8067) for the test address", async () => {
    const r = await new CensusGeocoder().geocode("1823 White Oak Rd, Raleigh, NC 27608", signal());
    expect(r).not.toBeNull();
    expect(r?.countyFips).toBe("37183");
    expect(r?.number).toBe("1823");
    expect(r?.street).toBe("WHITE OAK RD");
    expect(Math.abs((r?.lonLat[0] ?? 0) - -78.645)).toBeLessThan(0.01);
    expect(Math.abs((r?.lonLat[1] ?? 0) - 35.8062)).toBeLessThan(0.01);
  });
});

describe("live: Wake County ArcGIS", () => {
  it("address query returns APN 1704581656 with perimeter 718 +/- 2 ft", async () => {
    const entry = findByFips("37183") as CountyRegistryEntry;
    const r = await new ArcGisParcelProvider(entry).lookup(
      { lonLat: [-78.6449947, 35.8061485], number: "1823", street: "WHITE OAK RD", countyFips: "37183" },
      signal(),
    );
    expect(r.status).toBe("found");
    if (r.status !== "found") return;
    const big = r.candidates.find((c) => c.parcel.apn === "1704581656");
    expect(big).toBeDefined();
    expect(big?.match).toBe("address");
    expect(big?.score).toBe(100);
    const perim = perimeterFt(big?.parcel.ring ?? []);
    expect(Math.abs(perim - 718.8)).toBeLessThan(2);
    expect(big?.parcel.areaSqFt).toBeGreaterThan(18_000);
    expect(big?.parcel.areaSqFt).toBeLessThan(18_600);
  });
});

describe("live: Maricopa County ArcGIS", () => {
  it("JSON point query at (-112.0740, 33.4484) returns APN 11221086", async () => {
    const entry = findByFips("04013") as CountyRegistryEntry;
    const r = await new ArcGisParcelProvider(entry).lookup({ lonLat: [-112.074, 33.4484], countyFips: "04013" }, signal());
    expect(r.status).toBe("found");
    if (r.status !== "found") return;
    expect(r.candidates[0].parcel.apn).toBe("11221086");
    expect(r.candidates[0].match).toBe("point");
    expect(r.candidates[0].parcel.siteAddress).toMatch(/CENTRAL AVE/);
  });
});

describe("live: USGS elevation", () => {
  const points: [number, number][] = Array.from({ length: 20 }, (_, i) => [-78.6455 + i * 0.00004, 35.8065 + i * 0.00002]);

  it("3DEP returns 20 finite values between 200 and 400 ft", async () => {
    const r = await new ThreeDepElevationProvider().sample(points, signal());
    expect(r.source).toBe("3dep");
    expect(r.elevationsFt).toHaveLength(20);
    for (const v of r.elevationsFt) {
      expect(v).not.toBeNull();
      expect(v as number).toBeGreaterThan(200);
      expect(v as number).toBeLessThan(400);
    }
    expect(r.resolutionM).toBeGreaterThan(0.5);
    expect(r.resolutionM).toBeLessThan(15);
  });

  it("EPQS returns a finite value for one point", async () => {
    // EPQS is the slow fallback (1–12 s per point in practice); the production 8 s timeout is
    // deliberate, but this test checks parsing against the live service, not its latency.
    const r = await new EpqsElevationProvider(25_000).sample([points[0]], signal());
    expect(r.source).toBe("epqs");
    expect(Number.isFinite(r.elevationsFt[0])).toBe(true);
    expect(r.elevationsFt[0] as number).toBeGreaterThan(200);
    expect(r.elevationsFt[0] as number).toBeLessThan(400);
  });
});

describe("live: USGS NAIP Plus exportImage (basemap, display only)", () => {
  it("returns image/jpeg with CORS *", async () => {
    // Web-Mercator bbox around the test lot (~150 m).
    const url =
      "https://imagery.nationalmap.gov/arcgis/rest/services/USGSNAIPPlus/ImageServer/exportImage" +
      "?bbox=-8754800,4271500,-8754650,4271650&bboxSR=3857&imageSR=3857&size=256,256&format=jpg&f=image";
    const res = await fetch(url, { signal: signal() });
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toMatch(/image\/jpeg/);
    expect(res.headers.get("access-control-allow-origin")).toBe("*");
    const bytes = new Uint8Array(await res.arrayBuffer());
    expect(bytes.length).toBeGreaterThan(1000);
    expect([bytes[0], bytes[1]]).toEqual([0xff, 0xd8]); // JPEG SOI
  });
});
