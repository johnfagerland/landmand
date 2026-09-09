/**
 * Adversarial review: money rounding, quote helpers, and optional-role paths of the take-off.
 */
import { describe, expect, it } from "vitest";
import { extendedCents, formatCents, roundHalfUp, taxCents, toCents } from "../takeoff/money";
import { computeTakeOff } from "../takeoff/takeoff";
import { applyTakeOff, newQuote, quoteSummary } from "../quote/quote";
import { dollarsToCents } from "../pricebook/schema";
import type { PriceBook, TakeOff } from "../types";
import { fence, gateAt, NOW, plane, rectXY, woodPriceBook, woodRule } from "./helpers";

describe("review: money", () => {
  it("toCents is half-up on the decimal value, immune to binary residue (1.005, 2.675, 0.285, 14.98)", () => {
    // 1.005 * 100 = 100.49999999999999, 2.675 * 100 = 267.49999999999997, 0.285 * 100 = 28.499999999999996,
    // 14.98 * 100 = 1497.9999999999998 in binary floating point.
    expect(toCents(1.005)).toBe(101);
    expect(toCents(2.675)).toBe(268);
    expect(toCents(0.285)).toBe(29);
    expect(toCents(14.98)).toBe(1498);
    expect(toCents(19.99)).toBe(1999);
    expect(toCents(4.35)).toBe(435);
    expect(toCents(1.115)).toBe(112);
    expect(toCents(Number.NaN)).toBe(0);
    expect(toCents(Number.POSITIVE_INFINITY)).toBe(0);
    // The CSV path rounds on the decimal text and agrees with toCents.
    expect(dollarsToCents("1.005")).toBe(101);
    expect(dollarsToCents("14.98")).toBe(1498);
    expect(dollarsToCents("0.10")).toBe(10);
  });

  it("extendedCents of integer inputs is exact; 3 x 10 = 30, 37 x 1999 = 73,963", () => {
    expect(extendedCents(3, 10)).toBe(30);
    expect(extendedCents(37, 1999)).toBe(73963);
    expect(extendedCents(600, 210)).toBe(126000);
    expect(extendedCents(1, 0)).toBe(0);
  });

  it("taxCents is half-up at exact halves and stable on typical rates", () => {
    expect(taxCents(50, 7)).toBe(4); // 3.5 -> 4
    expect(taxCents(4358, 7.25)).toBe(316); // 315.955
    expect(taxCents(73993, 8.875)).toBe(6567); // 6566.87875
    expect(taxCents(100, 8.875)).toBe(9); // 8.875 -> 9
    expect(taxCents(1000000, 6)).toBe(60000);
    expect(taxCents(1, 50)).toBe(1); // 0.5 -> 1
    expect(taxCents(0, 7.25)).toBe(0);
    expect(taxCents(1000, Number.NaN)).toBe(0);
  });

  it("roundHalfUp and formatCents edge values", () => {
    expect(roundHalfUp(0.5)).toBe(1);
    expect(roundHalfUp(1.4999999)).toBe(1);
    expect(roundHalfUp(-0.5)).toBe(0);
    expect(formatCents(99)).toBe("$0.99");
    expect(formatCents(100)).toBe("$1.00");
    expect(formatCents(123456789)).toBe("$1,234,567.89");
    expect(formatCents(0.4)).toBe("$0.00");
    expect(formatCents(Number.NaN)).toBe("$0.00");
  });
});

describe("review: quote helpers", () => {
  const address = { line1: "1823 White Oak Rd", city: "Raleigh", state: "NC", zip: "27608", matched: "1823 WHITE OAK RD, RALEIGH, NC, 27608" };
  const q = newQuote({ id: "q1", now: NOW, address, geocode: [-78.6453, 35.8066] });

  it("applyTakeOff keeps the same fence object and does not mutate the input", () => {
    const takeoff = { styleId: "wood-privacy-6", fenceLengthFt: 100, totalCents: 1 } as TakeOff;
    const q2 = applyTakeOff(q, takeoff, "2026-09-10T00:00:00.000Z");
    expect(q2.fence).toBe(q.fence);
    expect(q2.profiles).toBe(q.profiles);
    expect(q2.takeoff).toBe(takeoff);
    expect(q.takeoff).toBeUndefined();
    expect(q.updatedAt).toBe(NOW);
    expect(q2.createdAt).toBe(NOW);
  });

  it("quoteSummary without a take-off leaves length and total undefined and falls back to the matched address", () => {
    const s = quoteSummary(q);
    expect(s).toEqual({ id: "q1", addressLine: "1823 White Oak Rd, Raleigh, NC 27608", updatedAt: NOW, lengthFt: undefined, totalCents: undefined, styleId: "wood-privacy-6" });
    const bare = newQuote({ id: "q2", now: NOW, address: { line1: "", city: "", state: "", zip: "", matched: "MATCHED ONLY" }, geocode: [0, 0] });
    expect(quoteSummary(bare).addressLine).toBe("MATCHED ONLY");
    const partial = newQuote({ id: "q3", now: NOW, address: { line1: "1 Main St", city: "", state: "NC", zip: "", matched: "" }, geocode: [0, 0] });
    expect(quoteSummary(partial).addressLine).toBe("1 Main St, NC");
  });

  it("newQuote copies the address and geocode (no shared references)", () => {
    const geocode: [number, number] = [-78.6453, 35.8066];
    const q3 = newQuote({ id: "q3", now: NOW, address, geocode });
    expect(q3.address).toEqual(address);
    expect(q3.address).not.toBe(address);
    expect(q3.geocode).not.toBe(geocode);
  });
});

describe("review: optional role paths", () => {
  const p = plane();
  const f = fence(p, rectXY(100, 50), { gates: [gateAt(p, { x: 22, y: 0 }, 4)] });

  it("when gatePost is bound, gate posts leave the terminal-post line and get their own line", () => {
    const book: PriceBook = woodPriceBook();
    book.items.push({ sku: "GP", description: "gate post", category: "post", unit: "each", unitPriceCents: 3000, taxable: true, roles: [] });
    const rule = woodRule({ skus: { ...woodRule().skus, gatePost: "GP" } });
    const t = computeTakeOff({ fence: f, plane: p, profiles: {}, priceBook: book, rule, taxRatePct: 0, now: NOW });
    const line = (sku: string) => t.lines.find((l) => l.sku === sku);
    expect(line("TP")?.qty).toBe(4);
    expect(line("GP")?.qty).toBe(2);
    expect(line("LP")?.qty).toBe(35);
    // Concrete is unchanged: 35 x 1 + (4 + 2) x 2 = 47.
    expect(line("CONC")?.qty).toBe(47);
    expect(t.posts.total).toBe(41);
    expect(t.warnings).toEqual(["Slope not applied on 4 segment(s)"]);
  });

  it("an unbound laborPerGate is silent; an unbound gateSingle with a gate present warns", () => {
    const rule = woodRule({ skus: { ...woodRule().skus, laborPerGate: undefined } });
    const t = computeTakeOff({ fence: f, plane: p, profiles: {}, priceBook: woodPriceBook(), rule, taxRatePct: 0, now: NOW });
    expect(t.lines.find((l) => l.sku === "LABG")).toBeUndefined();
    expect(t.warnings).toEqual(["Slope not applied on 4 segment(s)"]);
    const rule2 = woodRule({ skus: { ...woodRule().skus, gateSingle: undefined } });
    const t2 = computeTakeOff({ fence: f, plane: p, profiles: {}, priceBook: woodPriceBook(), rule: rule2, taxRatePct: 0, now: NOW });
    expect(t2.lines.find((l) => l.sku === "GATE1")).toBeUndefined();
    expect(t2.warnings).toContain("No price-book item bound to role gateSingle for style wood-privacy-6");
    // The hardware line is still there, and the totals still add up.
    expect(t2.lines.find((l) => l.sku === "HW")?.qty).toBe(1);
    expect(t2.subtotalCents + t2.taxCents).toBe(t2.totalCents);
  });

  it("an empty fence yields an empty, zero take-off without throwing", () => {
    const empty = fence(p, [], { closed: true });
    const t = computeTakeOff({ fence: empty, plane: p, profiles: {}, priceBook: woodPriceBook(), rule: woodRule(), taxRatePct: 7.25, now: NOW });
    expect(t.posts).toEqual({ corner: 0, end: 0, line: 0, gate: 0, total: 0 });
    expect(t.sections).toBe(0);
    expect(t.lines).toEqual([]);
    expect(t.totalCents).toBe(0);
    expect(t.warnings).toEqual([]);
    expect(t.slopeFactor).toBe(1);
  });
});
