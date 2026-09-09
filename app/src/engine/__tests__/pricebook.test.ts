import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { parsePriceBookCsv, normalizeHeader } from "../pricebook/parse";
import { dollarsToCents, parseTaxable, STYLE_ROLES } from "../pricebook/schema";
import { DEFAULT_STYLE_RULES, findRule, resolveRules, styleAvailability } from "../pricebook/styles";
import type { PriceBookItem } from "../types";

const SAMPLE = readFileSync(new URL("../../../public/sample-price-book.csv", import.meta.url), "utf8");
const OPTS = { id: "pb-test", name: "Sample", fileName: "sample-price-book.csv", now: "2026-09-08T00:00:00.000Z" };
const HEADER = "sku,description,category,unit,unit_price,taxable,roll_length_ft,style,role";

describe("sample price book", () => {
  const result = parsePriceBookCsv(SAMPLE, OPTS);

  it("parses without errors", () => {
    expect(result.errors).toEqual([]);
    expect(result.priceBook).not.toBeNull();
    expect(result.priceBook!.items.length).toBeGreaterThan(10);
    expect(result.priceBook!.sourceFileName).toBe("sample-price-book.csv");
    expect(result.priceBook!.importedAt).toBe(OPTS.now);
  });

  it("makes all four styles complete and every required role resolves to a real item", () => {
    const pb = result.priceBook!;
    const availability = styleAvailability(pb);
    expect(availability.map((a) => a.rule.id).sort()).toEqual(["aluminum-4", "chain-link-4", "vinyl-6", "wood-privacy-6"]);
    for (const { rule, missingRoles } of availability) {
      expect(missingRoles, rule.id).toEqual([]);
      for (const role of rule.requiredRoles) {
        const sku = rule.skus[role];
        expect(sku, `${rule.id}/${role}`).toBeTruthy();
        expect(pb.items.find((i) => i.sku === sku), `${rule.id}/${role} -> ${sku}`).toBeDefined();
      }
    }
    expect(result.warnings.filter((w) => w.includes("is missing"))).toEqual([]);
  });

  it("binds the expected wood-privacy skus", () => {
    const rule = findRule(result.priceBook!, "wood-privacy-6")!;
    expect(rule.sectionModel).toBe("stick");
    expect(rule.skus.linePost).toBe("WP-LP");
    expect(rule.skus.terminalPost).toBe("WP-TP");
    expect(rule.skus.rail).toBe("WP-RAIL");
    expect(rule.skus.picket).toBe("WP-PKT");
    expect(rule.skus.concrete).toBe("CONC-50");
    expect(rule.skus.laborPerFt).toBe("LAB-WOOD-FT");
    expect(rule.skus.laborPerGate).toBe("LAB-GATE");
  });

  it("merges repeated sku rows into one item with several role bindings", () => {
    const pb = result.priceBook!;
    const concrete = pb.items.filter((i) => i.sku === "CONC-50");
    expect(concrete).toHaveLength(1);
    expect(concrete[0].roles.map((r) => r.styleId).sort()).toEqual(["aluminum-4", "chain-link-4", "vinyl-6", "wood-privacy-6"]);
    expect(concrete[0].unitPriceCents).toBe(648);
    const fabric = pb.items.find((i) => i.sku === "CL-FAB")!;
    expect(fabric.unit).toBe("roll");
    expect(fabric.rollLengthFt).toBe(50);
    const labor = pb.items.find((i) => i.sku === "LAB-WOOD-FT")!;
    expect(labor.taxable).toBe(false);
    expect(labor.unitPriceCents).toBe(1200);
    const misc = pb.items.find((i) => i.sku === "SCREWS-5LB")!;
    expect(misc.roles).toEqual([]);
  });
});

describe("parse errors carry CSV line numbers (header = line 1)", () => {
  it("reports a malformed row on the right line", () => {
    const csv = [
      HEADER,
      "A,Post,post,each,10.00,yes,,,",
      "B,Rail,rail,each,not-a-price,yes,,,",
      "C,Picket,picket,each,2.00,yes,,,",
      "D,Bad category,widget,each,2.00,yes,,,",
    ].join("\n");
    const r = parsePriceBookCsv(csv, OPTS);
    expect(r.priceBook).toBeNull();
    expect(r.errors.map((e) => e.line)).toEqual([3, 5]);
    expect(r.errors[0].message).toMatch(/unit_price/);
    expect(r.errors[1].message).toMatch(/category must be one of/);
  });

  it("counts blank lines and CRLF line endings correctly", () => {
    const csv = [HEADER, "A,Post,post,each,10.00,yes,,,", "", "   ", "B,Rail,rail,each,x,yes,,,"].join("\r\n");
    const r = parsePriceBookCsv(csv, OPTS);
    expect(r.errors).toHaveLength(1);
    expect(r.errors[0].line).toBe(5);
  });

  it("counts newlines inside quoted cells as part of the row", () => {
    const csv = [HEADER, 'A,"Post\nwith two lines",post,each,10.00,yes,,,', "B,Rail,rail,each,x,yes,,,"].join("\n");
    const r = parsePriceBookCsv(csv, OPTS);
    expect(r.errors.map((e) => e.line)).toEqual([4]);
  });

  it("rejects a role binding on an unknown style and lists the valid ids", () => {
    const csv = [HEADER, "A,Post,post,each,10.00,yes,,picket-fence-3,linePost"].join("\n");
    const r = parsePriceBookCsv(csv, OPTS);
    expect(r.priceBook).toBeNull();
    expect(r.errors).toHaveLength(1);
    expect(r.errors[0].line).toBe(2);
    expect(r.errors[0].message).toContain('Unknown style "picket-fence-3"');
    for (const id of DEFAULT_STYLE_RULES.map((x) => x.id)) expect(r.errors[0].message).toContain(id);
  });

  it("rejects an unknown role and style-without-role / role-without-style", () => {
    const csv = [
      HEADER,
      "A,Post,post,each,10.00,yes,,wood-privacy-6,mainPost",
      "B,Post,post,each,10.00,yes,,wood-privacy-6,",
      "C,Post,post,each,10.00,yes,,,linePost",
    ].join("\n");
    const r = parsePriceBookCsv(csv, OPTS);
    expect(r.errors.map((e) => e.line)).toEqual([2, 3, 4]);
    expect(r.errors[0].message).toMatch(/role must be one of/);
    expect(r.errors[1].message).toMatch(/without a role/);
    expect(r.errors[2].message).toMatch(/without a style/);
  });

  it("rejects a duplicate sku that differs, and a duplicate without a new binding", () => {
    const csv = [
      HEADER,
      "A,Post,post,each,10.00,yes,,,",
      "A,Post,post,each,11.00,yes,,,",
      "B,Rail,rail,each,5.00,yes,,,",
      "B,Rail,rail,each,5.00,yes,,,",
    ].join("\n");
    const r = parsePriceBookCsv(csv, OPTS);
    expect(r.errors.map((e) => e.line)).toEqual([3, 5]);
    expect(r.errors[0].message).toMatch(/Duplicate sku "A" differs from line 2/);
  });

  it("requires roll_length_ft for roll units", () => {
    const csv = [HEADER, "F,Fabric,fabric,roll,99.00,yes,,,"].join("\n");
    const r = parsePriceBookCsv(csv, OPTS);
    expect(r.errors).toEqual([{ line: 2, message: expect.stringMatching(/roll_length_ft/) }]);
  });

  it("fails on a missing required column", () => {
    const r = parsePriceBookCsv("sku,description,unit,unit_price\nA,Post,each,1.00", OPTS);
    expect(r.priceBook).toBeNull();
    expect(r.errors[0].line).toBe(1);
    expect(r.errors[0].message).toMatch(/Missing required column: category/);
  });

  it("fails on an empty file", () => {
    expect(parsePriceBookCsv("   \n", OPTS).errors[0].message).toMatch(/empty/);
    expect(parsePriceBookCsv(HEADER + "\n", OPTS).errors[0].message).toMatch(/No item rows/);
  });
});

describe("money and booleans", () => {
  it("three $0.10 items sum to exactly 30 cents", () => {
    const csv = [HEADER, "A,Ten cents,other,each,0.10,yes,,,", "B,Ten cents,other,each,0.1,yes,,,", "C,Ten cents,other,each,$0.10,yes,,,"].join("\n");
    const r = parsePriceBookCsv(csv, OPTS);
    expect(r.errors).toEqual([]);
    const total = r.priceBook!.items.reduce((s, i) => s + i.unitPriceCents, 0);
    expect(total).toBe(30);
    expect(Number.isInteger(total)).toBe(true);
  });

  it("converts dollars to integer cents half-up on the decimal text", () => {
    expect(dollarsToCents("1.005")).toBe(101);
    expect(dollarsToCents("1.004")).toBe(100);
    expect(dollarsToCents("$1,234.5")).toBe(123450);
    expect(dollarsToCents("12")).toBe(1200);
    expect(dollarsToCents(".5")).toBe(50);
    expect(dollarsToCents("0")).toBe(0);
    expect(dollarsToCents("abc")).toBeNull();
    expect(dollarsToCents("-1")).toBeNull();
    expect(dollarsToCents("")).toBeNull();
  });

  it("parses taxable spellings and defaults to true", () => {
    for (const t of ["yes", "Y", "true", "TRUE", "1", "t"]) expect(parseTaxable(t), t).toBe(true);
    for (const f of ["no", "n", "false", "False", "0", "f"]) expect(parseTaxable(f), f).toBe(false);
    expect(parseTaxable(undefined)).toBe(true);
    expect(parseTaxable("")).toBe(true);
    expect(parseTaxable("maybe")).toBeNull();
    const csv = [HEADER, "A,x,other,each,1,No,,,", "B,x,other,each,1,,,,", "C,x,other,each,1,maybe,,,"].join("\n");
    const r = parsePriceBookCsv(csv, OPTS);
    expect(r.errors).toEqual([{ line: 4, message: expect.stringMatching(/taxable/) }]);
    const ok = parsePriceBookCsv(csv.split("\n").slice(0, 3).join("\n"), OPTS).priceBook!;
    expect(ok.items.map((i) => i.taxable)).toEqual([false, true]);
  });
});

describe("headers", () => {
  it("normalises header aliases", () => {
    expect(normalizeHeader(" Unit Price ")).toBe("unit_price");
    expect(normalizeHeader("Price")).toBe("unit_price");
    expect(normalizeHeader("Roll Length (ft)")).toBe("roll_length_ft");
    expect(normalizeHeader("roll length ft")).toBe("roll_length_ft");
    expect(normalizeHeader("SKU")).toBe("sku");
  });

  it("accepts aliased headers and a BOM", () => {
    const csv = "﻿SKU,Description,Category,Unit,Unit Price,Taxable,Roll Length (ft),Style,Role\nF,Fabric,fabric,roll,99.00,yes,50,chain-link-4,fabric";
    const r = parsePriceBookCsv(csv, OPTS);
    expect(r.errors).toEqual([]);
    expect(r.priceBook!.items[0]).toMatchObject({ sku: "F", unitPriceCents: 9900, rollLengthFt: 50 });
  });

  it("warns about unknown columns instead of failing", () => {
    const r = parsePriceBookCsv(`${HEADER},vendor\nA,Post,post,each,1,yes,,,,Acme`, OPTS);
    expect(r.errors).toEqual([]);
    expect(r.warnings.some((w) => w.includes("vendor"))).toBe(true);
  });
});

describe("style rules", () => {
  it("warns about styles missing required roles for a trimmed CSV", () => {
    const trimmed = SAMPLE.split("\n")
      .filter((line) => !line.startsWith("VN-CAP") && !line.startsWith("VN-PANEL"))
      .join("\n");
    const r = parsePriceBookCsv(trimmed, OPTS);
    expect(r.errors).toEqual([]);
    expect(r.warnings).toContain("Style vinyl-6 is missing: cap, panel");
    const avail = styleAvailability(r.priceBook!);
    expect(avail.find((a) => a.rule.id === "vinyl-6")!.missingRoles.sort()).toEqual(["cap", "panel"]);
    expect(avail.filter((a) => a.missingRoles.length === 0).map((a) => a.rule.id).sort()).toEqual(["aluminum-4", "chain-link-4", "wood-privacy-6"]);
  });

  it("resolveRules fills skus, last binding wins, and never mutates the defaults", () => {
    const item = (sku: string, roles: PriceBookItem["roles"]): PriceBookItem => ({
      sku, description: sku, category: "post", unit: "each", unitPriceCents: 100, taxable: true, roles,
    });
    const rules = resolveRules([
      item("P1", [{ styleId: "wood-privacy-6", role: "linePost" }]),
      item("P2", [{ styleId: "wood-privacy-6", role: "linePost" }, { styleId: "nope", role: "linePost" }]),
    ]);
    expect(rules.find((r) => r.id === "wood-privacy-6")!.skus).toEqual({ linePost: "P2" });
    expect(DEFAULT_STYLE_RULES.every((r) => Object.keys(r.skus).length === 0)).toBe(true);
    expect(rules).toHaveLength(DEFAULT_STYLE_RULES.length);
  });

  it("warns when two skus bind the same role", () => {
    const csv = [HEADER, "A,Post,post,each,1,yes,,wood-privacy-6,linePost", "B,Post,post,each,1,yes,,wood-privacy-6,linePost"].join("\n");
    const r = parsePriceBookCsv(csv, OPTS);
    expect(r.errors).toEqual([]);
    expect(r.warnings.some((w) => w.includes("wood-privacy-6/linePost") && w.includes('using "B"'))).toBe(true);
    expect(findRule(r.priceBook!, "wood-privacy-6")!.skus.linePost).toBe("B");
  });

  it("default rules match the plan's spacing decisions", () => {
    const wood = DEFAULT_STYLE_RULES.find((r) => r.id === "wood-privacy-6")!;
    expect(wood).toMatchObject({ sectionModel: "stick", postSpacingFt: 8, railsPerSection: 3, picketWidthIn: 5.5, picketGapIn: 0.5, cornerThresholdDeg: 15 });
    // 300 ft at (5.5 + 0.5) in per picket = 600 pickets before waste.
    expect(Math.ceil((300 * 12) / (wood.picketWidthIn! + wood.picketGapIn!))).toBe(600);
    const cl = DEFAULT_STYLE_RULES.find((r) => r.id === "chain-link-4")!;
    expect(cl).toMatchObject({ sectionModel: "roll", postSpacingFt: 10 });
    expect(cl.requiredRoles).toContain("fabric");
    expect(cl.requiredRoles).toContain("topRail");
    expect(DEFAULT_STYLE_RULES.find((r) => r.id === "vinyl-6")).toMatchObject({ sectionModel: "panel", panelWidthFt: 8, postSpacingFt: 8 });
    expect(DEFAULT_STYLE_RULES.find((r) => r.id === "aluminum-4")).toMatchObject({ sectionModel: "panel", panelWidthFt: 6, postSpacingFt: 6 });
    for (const r of DEFAULT_STYLE_RULES) for (const role of r.requiredRoles) expect(STYLE_ROLES).toContain(role);
  });
});
