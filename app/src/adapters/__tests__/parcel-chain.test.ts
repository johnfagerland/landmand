import { afterEach, describe, expect, it, vi } from "vitest";
import { ArcGisParcelProvider } from "../parcel/arcgis";
import { defaultParcelChain, parcelChain } from "../parcel/chain";
import { findByFips } from "../parcel/registry";
import type { CountyRegistryEntry, ParcelLookupResult, ParcelProvider } from "../types";
import { fixture, jsonResponse, mockFetch, never } from "./helpers";

afterEach(() => vi.unstubAllGlobals());

const input = { lonLat: [-78.6449947, 35.8061485] as [number, number], number: "1823", street: "WHITE OAK RD", countyFips: "37183" };

function fake(id: string, opts: { enabled?: boolean; covers?: boolean; result?: ParcelLookupResult; throws?: boolean; delayMs?: number }): ParcelProvider & { calls: number } {
  const p = {
    id,
    calls: 0,
    enabled: () => opts.enabled ?? true,
    covers: () => opts.covers ?? true,
    async lookup(_i: unknown, signal: AbortSignal): Promise<ParcelLookupResult> {
      p.calls++;
      if (opts.throws) throw new Error("boom");
      if (opts.delayMs) {
        await new Promise<void>((resolve) => {
          const t = setTimeout(resolve, opts.delayMs);
          signal.addEventListener("abort", () => {
            clearTimeout(t);
            resolve();
          });
        });
        if (signal.aborted) return { status: "none", providerId: id, reason: "timeout" };
      }
      return opts.result ?? { status: "none", providerId: id, reason: "no_match" };
    },
  };
  return p;
}

const found: ParcelLookupResult = {
  status: "found",
  providerId: "b",
  candidates: [{ parcel: { id: "b:1", source: "county", providerId: "b", attribution: "x", ring: [[0, 0], [1, 0], [1, 1]], holes: [], areaSqFt: 1, origin: [0, 0], fetchedAt: "" }, match: "point", distanceFt: 0, score: 80 }],
};

describe("parcelChain", () => {
  it("skips disabled / non-covering providers and returns the first found", async () => {
    const a = fake("a", { enabled: false });
    const b = fake("b", { covers: false });
    const c = fake("c", { result: { ...found, providerId: "c" } });
    const d = fake("d", { result: found });
    const r = await parcelChain([a, b, c, d]).lookup(input, never);
    expect(r.status).toBe("found");
    expect(r.providerId).toBe("c");
    expect([a.calls, b.calls, c.calls, d.calls]).toEqual([0, 0, 1, 0]);
  });

  it("reports what was tried when nothing is found, with the last provider's reason", async () => {
    const a = fake("a", { enabled: false });
    const b = fake("b", { result: { status: "none", providerId: "b", reason: "upstream_error" } });
    const c = fake("c", { result: { status: "none", providerId: "c", reason: "no_match" } });
    const r = await parcelChain([a, b, c]).lookup(input, never);
    expect(r).toEqual({
      status: "none",
      providerId: "c",
      reason: "no_match",
      tried: [
        { providerId: "a", reason: "disabled" },
        { providerId: "b", reason: "upstream_error" },
        { providerId: "c", reason: "no_match" },
      ],
    });
  });

  it("returns no_coverage when no provider applies", async () => {
    const r = await parcelChain([fake("a", { covers: false })]).lookup(input, never);
    expect(r).toMatchObject({ status: "none", providerId: "chain", reason: "no_coverage" });
  });

  it("never throws, even when a provider does", async () => {
    const r = await parcelChain([fake("a", { throws: true })]).lookup(input, never);
    expect(r).toMatchObject({ status: "none", reason: "upstream_error", tried: [{ providerId: "a", reason: "upstream_error" }] });
  });

  it("enforces the per-provider timeout and moves on", async () => {
    const slow = fake("slow", { delayMs: 500 });
    const fast = fake("fast", { result: { ...found, providerId: "fast" } });
    const r = await parcelChain([slow, fast], { perProviderMs: 30 }).lookup(input, never);
    expect(r.providerId).toBe("fast");
  });

  it("enforces the total budget: later providers are marked timeout without being called", async () => {
    const slow = fake("slow", { delayMs: 500 });
    const next = fake("next", { result: found });
    const r = await parcelChain([slow, next], { perProviderMs: 1000, totalMs: 30 }).lookup(input, never);
    expect(r).toMatchObject({ status: "none", reason: "timeout" });
    expect(next.calls).toBe(0);
  });

  it("end to end with a mocked ArcGIS reply: fetch rejecting -> reason, fixture -> found", async () => {
    const wake = findByFips("37183") as CountyRegistryEntry;
    mockFetch(() => new TypeError("down"));
    const bad = await parcelChain([new ArcGisParcelProvider(wake)]).lookup(input, never);
    expect(bad).toMatchObject({ status: "none", providerId: "county:37183", reason: "upstream_error" });

    mockFetch(() => jsonResponse(fixture("wake-address-1823-white-oak.geojson")));
    const good = await parcelChain([new ArcGisParcelProvider(wake)]).lookup(input, never);
    expect(good.status).toBe("found");
  });

  it("defaultParcelChain is [regrid, county:37183, county:04013]", () => {
    expect(defaultParcelChain().providers.map((p) => p.id)).toEqual(["regrid", "county:37183", "county:04013"]);
  });
});
