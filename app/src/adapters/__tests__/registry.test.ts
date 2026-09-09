import { describe, expect, it } from "vitest";
import { findAllByPoint, findByFips, findByPoint, listCounties, parseRegistry } from "../parcel/registry";

describe("county registry", () => {
  it("loads and validates counties.json", () => {
    const counties = listCounties();
    expect(counties.map((c) => c.fips)).toEqual(expect.arrayContaining(["37183", "04013"]));
    for (const c of counties) expect(c.url).toMatch(/\/(MapServer|FeatureServer)\/\d+$/);
  });

  it("findByFips / findByPoint", () => {
    expect(findByFips("37183")?.name).toBe("Wake County, NC");
    expect(findByFips("00000")).toBeUndefined();
    expect(findByFips(undefined)).toBeUndefined();
    expect(findByPoint([-78.645, 35.806])?.fips).toBe("37183");
    expect(findByPoint([-112.074, 33.4484])?.fips).toBe("04013");
    expect(findAllByPoint([0, 0])).toEqual([]);
  });

  it("rejects an invalid registry", () => {
    expect(() => parseRegistry({ version: 1, counties: [{ fips: "1" }] })).toThrow(/invalid/);
    expect(() =>
      parseRegistry({
        version: 1,
        counties: [1, 2].map(() => ({ ...listCounties()[0] })),
      }),
    ).toThrow(/duplicate/);
  });
});
