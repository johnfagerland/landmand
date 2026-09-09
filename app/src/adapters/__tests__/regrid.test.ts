import { afterEach, describe, expect, it, vi } from "vitest";
import { RegridParcelProvider } from "../parcel/regrid";
import { fixture, jsonResponse, mockFetch, never } from "./helpers";

afterEach(() => vi.unstubAllGlobals());

const input = { lonLat: [-78.6449947, 35.8061485] as [number, number], number: "1823", street: "WHITE OAK RD", countyFips: "37183" };

/** Hand-written per the Regrid v2 docs; NOT captured from the live API (no token). */
function regridReply() {
  const fc = fixture<{ features: { geometry: unknown }[] }>("wake-address-1823-white-oak.geojson");
  return {
    parcels: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: fc.features[0].geometry,
          properties: { headline: "1823 White Oak Rd", path: "/us/nc/wake/raleigh/12345", fields: { parcelnumb: "1704581656", address: "1823 WHITE OAK RD", scity: "RALEIGH" } },
        },
      ],
    },
  };
}

describe("RegridParcelProvider", () => {
  it("is disabled without REGRID_TOKEN and reports reason 'disabled'", async () => {
    const p = new RegridParcelProvider(() => undefined);
    expect(p.enabled()).toBe(false);
    await expect(p.lookup(input, never)).resolves.toEqual({ status: "none", providerId: "regrid", reason: "disabled" });
  });

  it("reads the token from process.env by default", () => {
    const before = process.env.REGRID_TOKEN;
    process.env.REGRID_TOKEN = "";
    expect(new RegridParcelProvider().enabled()).toBe(false);
    process.env.REGRID_TOKEN = "t";
    expect(new RegridParcelProvider().enabled()).toBe(true);
    if (before === undefined) delete process.env.REGRID_TOKEN;
    else process.env.REGRID_TOKEN = before;
  });

  it("queries address first, then point, with the token only on the URL and never in the result", async () => {
    const { calls } = mockFetch((c) => (c.url.includes("/parcels/address") ? jsonResponse({ parcels: { features: [] } }) : jsonResponse(regridReply())));
    const p = new RegridParcelProvider(() => "SECRET-TOKEN");
    const r = await p.lookup(input, never);
    expect(calls).toHaveLength(2);
    const u0 = new URL(calls[0].url);
    expect(u0.pathname).toBe("/api/v2/parcels/address");
    expect(u0.searchParams.get("query")).toBe("1823 WHITE OAK RD");
    expect(u0.searchParams.get("token")).toBe("SECRET-TOKEN");
    const u1 = new URL(calls[1].url);
    expect(u1.pathname).toBe("/api/v2/parcels/point");
    expect(u1.searchParams.get("lat")).toBe("35.8061485");
    expect(u1.searchParams.get("lon")).toBe("-78.6449947");
    expect(u1.searchParams.get("return_geometry")).toBe("true");

    expect(r.status).toBe("found");
    expect(JSON.stringify(r)).not.toContain("SECRET-TOKEN");
    if (r.status !== "found") return;
    const c = r.candidates[0];
    expect(c.parcel).toMatchObject({ id: "regrid:1704581656", source: "regrid", providerId: "regrid", apn: "1704581656", siteAddress: "1823 WHITE OAK RD" });
    expect(c.parcel.ring).toHaveLength(10);
    expect(c.match).toBe("nearby"); // centreline point is outside the lot
  });

  it("never throws", async () => {
    mockFetch(() => new TypeError("boom"));
    const r = await new RegridParcelProvider(() => "t").lookup(input, never);
    expect(r).toEqual({ status: "none", providerId: "regrid", reason: "upstream_error" });
  });
});
