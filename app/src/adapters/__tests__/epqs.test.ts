import { afterEach, describe, expect, it, vi } from "vitest";
import { EpqsElevationProvider, parseEpqsValue } from "../elevation/epqs";
import { fixture, jsonResponse, mockFetch, never } from "./helpers";

afterEach(() => vi.unstubAllGlobals());

describe("EpqsElevationProvider", () => {
  it("GETs one request per point with units=Feet and maps the value", async () => {
    const { calls } = mockFetch(() => jsonResponse(fixture("epqs-point.json")));
    const r = await new EpqsElevationProvider().sample([[-78.6455, 35.8065]], never);
    expect(calls).toHaveLength(1);
    const u = new URL(calls[0].url);
    expect(u.host).toBe("epqs.nationalmap.gov");
    expect(u.pathname).toBe("/v1/json");
    expect(u.searchParams.get("x")).toBe("-78.6455");
    expect(u.searchParams.get("y")).toBe("35.8065");
    expect(u.searchParams.get("units")).toBe("Feet");
    expect(u.searchParams.get("wkid")).toBe("4326");
    expect(r.source).toBe("epqs");
    expect(r.elevationsFt[0]).toBeCloseTo(282.66, 1);
    expect(r.resolutionM).toBeCloseTo(3.44, 1);
  });

  it("caps at 60 points: only 60 requests, nulls beyond", async () => {
    let inFlight = 0;
    let maxInFlight = 0;
    const { calls } = mockFetch(async () => {
      inFlight++;
      maxInFlight = Math.max(maxInFlight, inFlight);
      await new Promise((r) => setTimeout(r, 2));
      inFlight--;
      return jsonResponse({ value: 100 });
    });
    const points: [number, number][] = Array.from({ length: 70 }, (_, i) => [-78 + i * 0.001, 35]);
    const r = await new EpqsElevationProvider().sample(points, never);
    expect(calls).toHaveLength(60);
    expect(maxInFlight).toBeLessThanOrEqual(4);
    expect(r.elevationsFt).toHaveLength(70);
    expect(r.elevationsFt.slice(0, 60).every((v) => v === 100)).toBe(true);
    expect(r.elevationsFt.slice(60).every((v) => v === null)).toBe(true);
  });

  it("sentinels below -1000 and failed requests become null; all failures -> none", async () => {
    mockFetch((c) => (c.url.includes("x=-1") ? jsonResponse({ value: -1000000 }) : new TypeError("down")));
    const r = await new EpqsElevationProvider().sample([[-1, 1], [-2, 2]], never);
    expect(r).toMatchObject({ source: "epqs", elevationsFt: [null, null] });
    mockFetch(() => new TypeError("down"));
    const none = await new EpqsElevationProvider().sample([[-1, 1]], never);
    expect(none).toEqual({ source: "none", elevationsFt: [null] });
  });

  it("parseEpqsValue", () => {
    expect(parseEpqsValue(282.6584883889033)).toBe(282.66);
    expect(parseEpqsValue("-1000000")).toBeNull();
    expect(parseEpqsValue("abc")).toBeNull();
    expect(parseEpqsValue(null)).toBeNull();
  });
});
