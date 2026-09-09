import { describe, expect, it } from "vitest";
import { elevationChain } from "../elevation/chain";
import type { ElevationProvider, ElevationResult } from "../types";
import { never } from "./helpers";

function fake(id: ElevationProvider["id"], reply: (n: number) => ElevationResult | Error): ElevationProvider & { calls: number } {
  const p = {
    id,
    calls: 0,
    async sample(points: [number, number][]) {
      p.calls++;
      const r = reply(points.length);
      if (r instanceof Error) throw r;
      return r;
    },
  };
  return p;
}

const pts: [number, number][] = [[-78.6455, 35.8065], [-78.6453, 35.8066], [-78.6451, 35.8067]];

describe("elevationChain", () => {
  it("returns 3DEP when it has data and does not call EPQS", async () => {
    const a = fake("3dep", (n) => ({ source: "3dep", elevationsFt: Array(n).fill(100), resolutionM: 3 }));
    const b = fake("epqs", (n) => ({ source: "epqs", elevationsFt: Array(n).fill(200) }));
    const r = await elevationChain([a, b]).sample(pts, never);
    expect(r).toEqual({ source: "3dep", elevationsFt: [100, 100, 100], resolutionM: 3 });
    expect(b.calls).toBe(0);
  });

  it("keeps a partial 3DEP result (some nulls) without falling back", async () => {
    const a = fake("3dep", () => ({ source: "3dep", elevationsFt: [100, null, 102] }));
    const b = fake("epqs", (n) => ({ source: "epqs", elevationsFt: Array(n).fill(200) }));
    const r = await elevationChain([a, b]).sample(pts, never);
    expect(r.elevationsFt).toEqual([100, null, 102]);
    expect(b.calls).toBe(0);
  });

  it("falls back to EPQS when 3DEP is all null or none, then to none", async () => {
    const a = fake("3dep", (n) => ({ source: "3dep", elevationsFt: Array(n).fill(null) }));
    const b = fake("epqs", (n) => ({ source: "epqs", elevationsFt: Array(n).fill(200) }));
    expect((await elevationChain([a, b]).sample(pts, never)).source).toBe("epqs");

    const none1 = fake("3dep", (n) => ({ source: "none", elevationsFt: Array(n).fill(null) }));
    const none2 = fake("epqs", () => new Error("boom"));
    expect(await elevationChain([none1, none2]).sample(pts, never)).toEqual({ source: "none", elevationsFt: [null, null, null] });
  });

  it("discards a result of the wrong length", async () => {
    const bad = fake("3dep", () => ({ source: "3dep", elevationsFt: [1] }));
    const b = fake("epqs", (n) => ({ source: "epqs", elevationsFt: Array(n).fill(200) }));
    expect((await elevationChain([bad, b]).sample(pts, never)).source).toBe("epqs");
  });

  it("empty input -> none with []", async () => {
    expect(await elevationChain([]).sample([], never)).toEqual({ source: "none", elevationsFt: [] });
  });
});
