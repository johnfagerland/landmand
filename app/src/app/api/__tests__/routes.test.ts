/** Route handlers over the adapters, with mocked fetch (fixtures captured from the real services). */
import { afterEach, describe, expect, it, vi } from "vitest";
import { GET as geocodeGet } from "@/app/api/geocode/route";
import { GET as parcelGet } from "@/app/api/parcel/route";
import { POST as elevationPost } from "@/app/api/elevation/route";
import { fixture, jsonResponse, mockFetch } from "@/adapters/__tests__/helpers";

afterEach(() => vi.unstubAllGlobals());

describe("GET /api/geocode", () => {
  it("400 on a short query", async () => {
    const res = await geocodeGet(new Request("http://localhost/api/geocode?q=ab"));
    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({ ok: false, error: "bad_request" });
  });

  it("200 with the mapped result, cached on the normalised query", async () => {
    const { calls } = mockFetch(() => jsonResponse(fixture("census-geographies-1823-white-oak.json")));
    const res = await geocodeGet(new Request("http://localhost/api/geocode?q=" + encodeURIComponent("1823 White Oak Rd, Raleigh, NC 27608")));
    expect(res.status).toBe(200);
    expect(res.headers.get("cache-control")).toBe("public, s-maxage=86400, stale-while-revalidate=604800");
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.result.countyFips).toBe("37183");
    const again = await geocodeGet(new Request("http://localhost/api/geocode?q=" + encodeURIComponent("  1823  white oak rd, raleigh, nc 27608 ")));
    expect(again.headers.get("x-cache")).toBe("hit");
    expect(calls).toHaveLength(1);
  });

  it("502 on transport failure", async () => {
    mockFetch(() => new TypeError("down"));
    const res = await geocodeGet(new Request("http://localhost/api/geocode?q=" + encodeURIComponent("999 Nowhere Ln, Nowhere, ZZ")));
    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({ ok: false, error: "upstream" });
  });
});

describe("GET /api/parcel", () => {
  it("400 on bad coordinates", async () => {
    const res = await parcelGet(new Request("http://localhost/api/parcel?lon=abc&lat=35"));
    expect(res.status).toBe(400);
  });

  it("200 found with candidates, cached", async () => {
    const { calls } = mockFetch(() => jsonResponse(fixture("wake-address-1823-white-oak.geojson")));
    const url = "http://localhost/api/parcel?lon=-78.6449947&lat=35.8061485&county=37183&number=1823&street=" + encodeURIComponent("WHITE OAK RD");
    const res = await parcelGet(new Request(url));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe("found");
    expect(body.providerId).toBe("county:37183");
    expect(body.candidates).toHaveLength(2);
    expect(res.headers.get("cache-control")).toContain("s-maxage=86400");
    const again = await parcelGet(new Request(url));
    expect(again.headers.get("x-cache")).toBe("hit");
    expect(calls).toHaveLength(1);
  });

  it("200 none with tried[] when upstream is down (never a 5xx)", async () => {
    mockFetch(() => new TypeError("down"));
    const res = await parcelGet(new Request("http://localhost/api/parcel?lon=-78.6449947&lat=35.80615&county=37183"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe("none");
    expect(body.reason).toBe("upstream_error");
    expect(body.tried).toEqual([
      { providerId: "regrid", reason: "disabled" },
      { providerId: "county:37183", reason: "upstream_error" },
      { providerId: "county:04013", reason: "no_coverage" },
    ]);
  });
});

describe("POST /api/elevation", () => {
  it("400 on > 400 points or malformed body", async () => {
    const res = await elevationPost(new Request("http://localhost/api/elevation", { method: "POST", body: JSON.stringify({ points: Array(401).fill([0, 0]) }) }));
    expect(res.status).toBe(400);
    const bad = await elevationPost(new Request("http://localhost/api/elevation", { method: "POST", body: "nope" }));
    expect(bad.status).toBe(400);
  });

  it("only unknown points go upstream; cached points are merged back in order", async () => {
    const { calls } = mockFetch((c) => {
      const n = (JSON.parse(c.params.get("geometry") ?? "{}") as { points: number[][] }).points.length;
      return jsonResponse({ samples: Array.from({ length: n }, (_, i) => ({ locationId: i, value: String(10 + i), resolution: 3.086e-5 })) });
    });
    const post = (points: number[][]) => elevationPost(new Request("http://localhost/api/elevation", { method: "POST", body: JSON.stringify({ points }) }));
    const a = await (await post([[-78.1, 35.1], [-78.2, 35.2]])).json();
    expect(a.source).toBe("3dep");
    expect(a.elevationsFt.map((v: number) => Math.round(v))).toEqual([33, 36]);
    expect(a.resolutionM).toBeCloseTo(3.44, 1);
    expect(calls).toHaveLength(1);

    const b = await (await post([[-78.3, 35.3], [-78.1, 35.1]])).json();
    expect(calls).toHaveLength(2);
    expect((JSON.parse(calls[1].params.get("geometry") ?? "{}") as { points: number[][] }).points).toEqual([[-78.3, 35.3]]);
    expect(b.elevationsFt.map((v: number) => Math.round(v))).toEqual([33, 33]);

    const c = await post([[-78.1, 35.1]]);
    expect(calls).toHaveLength(2);
    expect(c.headers.get("cache-control")).toBe("no-store");
    expect((await c.json()).source).toBe("3dep");
  });
});
