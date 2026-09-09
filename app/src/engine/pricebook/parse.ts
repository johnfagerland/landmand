import Papa from "papaparse";
import type { PriceBook, PriceBookItem, StyleRole, StyleRule } from "../types";
import { csvRowSchema, type CsvRow } from "./schema";
import { DEFAULT_STYLE_RULES, missingRoles, resolveRules } from "./styles";

export interface ParseError {
  /** 1-based CSV line number (header is line 1). */
  line: number;
  message: string;
}

export interface ParsePriceBookResult {
  /** null when there are blocking errors. */
  priceBook: PriceBook | null;
  errors: ParseError[];
  warnings: string[];
}

/** Canonical column names. */
const REQUIRED_COLUMNS = ["sku", "description", "category", "unit", "unit_price"] as const;
const OPTIONAL_COLUMNS = ["taxable", "roll_length_ft", "style", "role"] as const;
const KNOWN_COLUMNS = new Set<string>([...REQUIRED_COLUMNS, ...OPTIONAL_COLUMNS]);

/** Header aliases (after normalisation: trim, lowercase, spaces/hyphens/dots -> underscore). */
const HEADER_ALIASES: Record<string, string> = {
  item: "sku",
  item_no: "sku",
  item_number: "sku",
  part: "sku",
  part_no: "sku",
  part_number: "sku",
  code: "sku",
  desc: "description",
  name: "description",
  item_description: "description",
  cat: "category",
  type: "category",
  uom: "unit",
  unit_of_measure: "unit",
  price: "unit_price",
  unitprice: "unit_price",
  unit_price_usd: "unit_price",
  unit_cost: "unit_price",
  cost: "unit_price",
  price_usd: "unit_price",
  tax: "taxable",
  is_taxable: "taxable",
  roll_length: "roll_length_ft",
  roll_length_feet: "roll_length_ft",
  roll_ft: "roll_length_ft",
  style_id: "style",
  fence_style: "style",
  style_role: "role",
  binding: "role",
};

export function normalizeHeader(header: string): string {
  const base = header
    .replace(/^﻿/, "")
    .trim()
    .toLowerCase()
    .replace(/[\s\-.]+/g, "_")
    .replace(/[^a-z0-9_]/g, "")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
  return HEADER_ALIASES[base] ?? base;
}

interface RawRow {
  line: number;
  data: Record<string, string>;
}

function countNewlines(text: string, from: number, to: number): number {
  let n = 0;
  for (let i = from; i < to; i++) if (text.charCodeAt(i) === 10) n++;
  return n;
}

/**
 * Parse CSV text into a PriceBook with rules resolved from DEFAULT_STYLE_RULES + role bindings.
 *
 * Rules:
 * - Header names are case-insensitive; `unit price` / `price` and `roll length ft` are accepted aliases.
 * - `unit_price` is dollars and becomes integer cents (half-up on the decimal text, so 3 x $0.10 = 30).
 * - `taxable` accepts yes/no/true/false/1/0/y/n and defaults to yes.
 * - A row with `style` needs `role` and vice versa; `style` must be one of the built-in style ids.
 * - A sku may appear on several rows ONLY to bind it to several style roles (e.g. one concrete bag
 *   bound to `concrete` for all four styles); those rows must agree on description, category, unit,
 *   price, taxable and roll length. Any other repeated sku is an error.
 * - Unit `roll` requires `roll_length_ft`.
 * Errors carry 1-based CSV line numbers (the header is line 1). Framework-free.
 */
export function parsePriceBookCsv(
  text: string,
  opts: { id: string; name?: string; fileName?: string; now: string },
  base: StyleRule[] = DEFAULT_STYLE_RULES,
): ParsePriceBookResult {
  const errors: ParseError[] = [];
  const warnings: string[] = [];
  const fail = (): ParsePriceBookResult => ({ priceBook: null, errors, warnings });

  // Normalise line endings so every row break is "\n" and cursor -> line arithmetic is exact.
  const source = text.replace(/^﻿/, "").replace(/\r\n?/g, "\n");
  if (source.trim() === "") {
    errors.push({ line: 1, message: "The file is empty." });
    return fail();
  }

  const rows: RawRow[] = [];
  let fields: string[] = [];
  let newlinesBefore = 0;
  let prevCursor = 0;

  Papa.parse<Record<string, string>>(source, {
    header: true,
    skipEmptyLines: "greedy",
    transformHeader: normalizeHeader,
    step: (result) => {
      const cursor = result.meta.cursor;
      newlinesBefore += countNewlines(source, prevCursor, cursor);
      prevCursor = cursor;
      if (fields.length === 0 && result.meta.fields) fields = result.meta.fields;
      const data = result.data;
      // Newlines inside quoted cells belong to this row; the trailing newline (if any) ends it.
      let inner = 0;
      for (const v of Object.values(data)) if (typeof v === "string") inner += countNewlines(v, 0, v.length);
      const extra = (data as Record<string, unknown>)["__parsed_extra"];
      if (Array.isArray(extra)) for (const v of extra) if (typeof v === "string") inner += countNewlines(v, 0, v.length);
      const trailing = cursor > 0 && source.charCodeAt(cursor - 1) === 10 ? 1 : 0;
      const line = 1 + newlinesBefore - inner - trailing;
      for (const e of result.errors) {
        if (e.code === "TooManyFields") {
          errors.push({ line, message: `Too many columns: ${e.message}.` });
        } else if (e.code === "TooFewFields") {
          // Papaparse pads missing cells; treat as blanks (validation reports required columns).
        } else {
          errors.push({ line, message: e.message });
        }
      }
      rows.push({ line, data });
    },
  });

  // Header validation.
  if (fields.length === 0) {
    // No data rows: papaparse never called step, so read the header ourselves.
    const headerLine = source.split("\n", 1)[0] ?? "";
    fields = Papa.parse<string[]>(headerLine).data[0]?.map(normalizeHeader) ?? [];
  }
  const missingCols = REQUIRED_COLUMNS.filter((c) => !fields.includes(c));
  if (missingCols.length > 0) {
    errors.push({
      line: 1,
      message: `Missing required column${missingCols.length > 1 ? "s" : ""}: ${missingCols.join(", ")}. Expected header: sku, description, category, unit, unit_price, taxable, roll_length_ft, style, role.`,
    });
    return fail();
  }
  const unknownCols = fields.filter((c) => c !== "" && !KNOWN_COLUMNS.has(c));
  if (unknownCols.length > 0) warnings.push(`Ignored unknown column${unknownCols.length > 1 ? "s" : ""}: ${unknownCols.join(", ")}.`);
  if (rows.length === 0) {
    errors.push({ line: 1, message: "No item rows found under the header." });
    return fail();
  }

  const validStyleIds = base.map((r) => r.id);
  const styleIdSet = new Set(validStyleIds);

  interface Seen {
    line: number;
    item: PriceBookItem;
  }
  const bySku = new Map<string, Seen>();
  const order: string[] = [];

  for (const { line, data } of rows) {
    const parsed = csvRowSchema.safeParse(data);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const col = issue.path.map(String).join(".");
        errors.push({ line, message: col && !issue.message.startsWith(col) ? `${col}: ${issue.message}` : issue.message });
      }
      continue;
    }
    const row: CsvRow = parsed.data;

    let rowOk = true;
    if (row.style && !row.role) {
      errors.push({ line, message: `style "${row.style}" given without a role; add a role (or clear the style).` });
      rowOk = false;
    }
    if (row.role && !row.style) {
      errors.push({ line, message: `role "${row.role}" given without a style; valid styles: ${validStyleIds.join(", ")}.` });
      rowOk = false;
    }
    if (row.style && !styleIdSet.has(row.style)) {
      errors.push({ line, message: `Unknown style "${row.style}"; valid styles: ${validStyleIds.join(", ")}.` });
      rowOk = false;
    }
    if (row.unit === "roll" && row.roll_length_ft === undefined) {
      errors.push({ line, message: `unit "roll" requires roll_length_ft (feet per roll).` });
      rowOk = false;
    }
    if (row.unit !== "roll" && row.roll_length_ft !== undefined) {
      warnings.push(`Line ${line}: roll_length_ft is ignored for unit "${row.unit}".`);
    }
    if (!rowOk) continue;

    const item: PriceBookItem = {
      sku: row.sku,
      description: row.description,
      category: row.category,
      unit: row.unit,
      unitPriceCents: row.unit_price,
      taxable: row.taxable,
      roles: [],
    };
    if (row.unit === "roll" && row.roll_length_ft !== undefined) item.rollLengthFt = row.roll_length_ft;
    const binding = row.style && row.role ? { styleId: row.style, role: row.role as StyleRole } : null;

    const seen = bySku.get(row.sku);
    if (!seen) {
      if (binding) item.roles.push(binding);
      bySku.set(row.sku, { line, item });
      order.push(row.sku);
      continue;
    }
    // Repeated sku: allowed only as an extra role binding on an identical item.
    const same =
      seen.item.description === item.description &&
      seen.item.category === item.category &&
      seen.item.unit === item.unit &&
      seen.item.unitPriceCents === item.unitPriceCents &&
      seen.item.taxable === item.taxable &&
      seen.item.rollLengthFt === item.rollLengthFt;
    if (!same) {
      errors.push({
        line,
        message: `Duplicate sku "${row.sku}" differs from line ${seen.line}; a sku may repeat only to bind another style role with identical description, category, unit, price and taxable.`,
      });
      continue;
    }
    if (!binding) {
      errors.push({ line, message: `Duplicate sku "${row.sku}" (first seen on line ${seen.line}); repeated rows must add a style role.` });
      continue;
    }
    const dup = seen.item.roles.some((r) => r.styleId === binding.styleId && r.role === binding.role);
    if (dup) {
      warnings.push(`Line ${line}: sku "${row.sku}" is already bound to ${binding.styleId}/${binding.role}; ignored.`);
    } else {
      seen.item.roles.push(binding);
    }
  }

  const items = order.map((sku) => bySku.get(sku)!.item);

  // Two different skus bound to the same style role: last wins (resolveRules); tell the user.
  const roleOwner = new Map<string, string>();
  for (const item of items) {
    for (const b of item.roles) {
      const key = `${b.styleId}/${b.role}`;
      const prev = roleOwner.get(key);
      if (prev && prev !== item.sku) warnings.push(`${key} is bound to both "${prev}" and "${item.sku}"; using "${item.sku}".`);
      roleOwner.set(key, item.sku);
    }
  }

  if (errors.length > 0) return fail();

  const rules = resolveRules(items, base);
  for (const rule of rules) {
    const missing = missingRoles(rule);
    if (missing.length > 0) warnings.push(`Style ${rule.id} is missing: ${[...missing].sort().join(", ")}`);
  }

  const priceBook: PriceBook = {
    id: opts.id,
    name: opts.name ?? opts.fileName?.replace(/\.csv$/i, "") ?? "Price book",
    items,
    rules,
    importedAt: opts.now,
    sourceFileName: opts.fileName,
  };
  return { priceBook, errors, warnings };
}
