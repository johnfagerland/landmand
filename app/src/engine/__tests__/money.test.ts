import { describe, expect, it } from "vitest";
import { extendedCents, formatCents, roundHalfUp, taxCents, toCents } from "../takeoff/money";
import { applyTakeOff, emptyFence, newQuote, quoteSummary } from "../quote/quote";
import type { TakeOff } from "../types";

describe("money", () => {
  it("toCents rounds half-up and survives CSV decimals", () => {
    expect(toCents(0.1)).toBe(10);
    expect(toCents(1.005)).toBe(101);
    expect(toCents(12.345)).toBe(1235);
    expect(toCents(12.344)).toBe(1234);
    expect(toCents(0)).toBe(0);
    expect(toCents(1234.56)).toBe(123456);
    expect(toCents(-2.5)).toBe(-250);
  });

  it("3 x $0.10 is exactly 30 cents", () => {
    expect(extendedCents(3, toCents(0.1))).toBe(30);
    expect(extendedCents(600, 210)).toBe(126000);
  });

  it("roundHalfUp", () => {
    expect(roundHalfUp(2.5)).toBe(3);
    expect(roundHalfUp(2.4999)).toBe(2);
    expect(roundHalfUp(-2.5)).toBe(-2);
    expect(roundHalfUp(0)).toBe(0);
  });

  it("formatCents", () => {
    expect(formatCents(123456)).toBe("$1,234.56");
    expect(formatCents(5)).toBe("$0.05");
    expect(formatCents(0)).toBe("$0.00");
    expect(formatCents(100000000)).toBe("$1,000,000.00");
    expect(formatCents(-123456)).toBe("-$1,234.56");
    expect(formatCents(-5)).toBe("-$0.05");
  });

  it("taxCents", () => {
    expect(taxCents(275200, 7.25)).toBe(19952);
    expect(taxCents(10000, 7.25)).toBe(725);
    expect(taxCents(1, 50)).toBe(1);
    expect(taxCents(1000, 0)).toBe(0);
    expect(taxCents(1000, -3)).toBe(0);
  });
});

describe("quote", () => {
  const address = { line1: "1823 White Oak Rd", city: "Raleigh", state: "NC", zip: "27608", matched: "1823 WHITE OAK RD, RALEIGH, NC, 27608" };
  const q = newQuote({ id: "q1", now: "2026-09-08T00:00:00.000Z", address, geocode: [-78.6453, 35.8066] });

  it("newQuote and emptyFence defaults", () => {
    expect(q.schemaVersion).toBe(1);
    expect(q.parcelStatus).toBe("pending");
    expect(q.fence).toEqual({ vertices: [], closed: true, gates: [], styleId: "wood-privacy-6", heightFt: 6 });
    expect(q.profiles).toEqual({});
    expect(q.customer).toEqual({ name: "" });
    expect(q.notes).toBe("");
    expect(q.createdAt).toBe(q.updatedAt);
    expect(emptyFence("chain-link-4", 4)).toMatchObject({ styleId: "chain-link-4", heightFt: 4 });
  });

  it("applyTakeOff and quoteSummary", () => {
    const takeoff = { styleId: "wood-privacy-6", fenceLengthFt: 296, totalCents: 565152 } as TakeOff;
    const q2 = applyTakeOff(q, takeoff, "2026-09-09T00:00:00.000Z");
    expect(q2).not.toBe(q);
    expect(q.takeoff).toBeUndefined();
    expect(q2.updatedAt).toBe("2026-09-09T00:00:00.000Z");
    expect(quoteSummary(q2)).toEqual({
      id: "q1",
      addressLine: "1823 White Oak Rd, Raleigh, NC 27608",
      updatedAt: "2026-09-09T00:00:00.000Z",
      lengthFt: 296,
      totalCents: 565152,
      styleId: "wood-privacy-6",
    });
    expect(quoteSummary(q).lengthFt).toBeUndefined();
  });
});
