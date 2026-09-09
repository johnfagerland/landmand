import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { FT_PER_M, wrap180 } from "../index";

describe("engine smoke", () => {
  it("loads the Wake fixture", () => {
    const f = JSON.parse(readFileSync(new URL("./fixtures/wake-1823-white-oak.geojson", import.meta.url), "utf8"));
    expect(f.properties.PIN_NUM).toBe("1704581656");
    expect(f.geometry.coordinates[0].length).toBe(12);
  });
  it("has units", () => {
    expect(FT_PER_M).toBeCloseTo(3.2808, 4);
    expect(wrap180(350)).toBe(-10);
  });
});
