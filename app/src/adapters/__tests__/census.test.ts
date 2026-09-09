import { afterEach, describe, expect, it, vi } from "vitest";
import { CensusGeocoder, mapCensusMatch } from "../geocoder/census";
import { UpstreamError } from "../http";
import { fixture, jsonResponse, mockFetch, never } from "./helpers";

afterEach(() => vi.unstubAllGlobals());

describe("CensusGeocoder", () => {
  it("maps the fixture to a GeocodeResult with county FIPS, house number and street", async () => {
    const { calls } = mockFetch(() => jsonResponse(fixture("census-geographies-1823-white-oak.json")));
    const r = await new CensusGeocoder().geocode("1823 White Oak Rd, Raleigh, NC 27608", never);
    expect(r).not.toBeNull();
    expect(r?.countyFips).toBe("37183");
    expect(r?.number).toBe("1823");
    expect(r?.street).toBe("WHITE OAK RD");
    expect(r?.city).toBe("RALEIGH");
    expect(r?.state).toBe("NC");
    expect(r?.zip).toBe("27608");
    expect(r?.matched).toBe("1823 WHITE OAK RD, RALEIGH, NC, 27608");
    expect(r?.lonLat[0]).toBeCloseTo(-78.644995, 5);
    expect(r?.lonLat[1]).toBeCloseTo(35.806148, 5);

    const u = new URL(calls[0].url);
    expect(u.host).toBe("geocoding.geo.census.gov");
    expect(u.pathname).toBe("/geocoder/geographies/onelineaddress");
    expect(u.searchParams.get("benchmark")).toBe("Public_AR_Current");
    expect(u.searchParams.get("vintage")).toBe("Current_Current");
    expect(u.searchParams.get("layers")).toBe("Counties");
    expect(u.searchParams.get("format")).toBe("json");
    expect(u.searchParams.get("address")).toBe("1823 White Oak Rd, Raleigh, NC 27608");
  });

  it("returns null when there are no matches", async () => {
    mockFetch(() => jsonResponse({ result: { addressMatches: [] } }));
    await expect(new CensusGeocoder().geocode("nowhere at all", never)).resolves.toBeNull();
  });

  it("throws UpstreamError on transport failure", async () => {
    mockFetch(() => new TypeError("boom"));
    await expect(new CensusGeocoder().geocode("1823 White Oak Rd", never)).rejects.toBeInstanceOf(UpstreamError);
  });

  it("collapses pre/suffix direction and pre-type into the street", () => {
    const r = mapCensusMatch({
      matchedAddress: "2 N CENTRAL AVE, PHOENIX, AZ, 85004",
      coordinates: { x: -112.074, y: 33.4484 },
      addressComponents: { preDirection: "N", streetName: "Central", suffixType: "Ave", suffixDirection: "", city: "Phoenix", state: "az", zip: "85004", fromAddress: "0" },
    });
    expect(r?.street).toBe("N CENTRAL AVE");
    expect(r?.number).toBe("2");
    expect(r?.state).toBe("AZ");
    expect(r?.countyFips).toBeUndefined();
  });
});
