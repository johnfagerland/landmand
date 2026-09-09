import { z } from "zod";

/** Zod schemas for price-book data. The exported names are the contract (wave 1D owns the bodies). */

export const ITEM_CATEGORIES = [
  "post", "rail", "picket", "panel", "fabric", "concrete", "gate", "hardware", "cap", "labor", "other",
] as const;
export const UNITS = ["each", "ft", "bag", "roll", "hour"] as const;
export const STYLE_ROLES = [
  "linePost", "terminalPost", "gatePost", "rail", "picket", "panel", "fabric", "topRail", "cap",
  "concrete", "laborPerFt", "gateSingle", "gateDouble", "gateHardware", "laborPerGate",
] as const;

/** Accepted spellings of a boolean CSV cell (case-insensitive). */
const TRUE_WORDS = new Set(["yes", "y", "true", "t", "1", "taxable"]);
const FALSE_WORDS = new Set(["no", "n", "false", "f", "0", "exempt", "non-taxable", "nontaxable"]);

/** yes/no/true/false/1/0/y/n -> boolean; empty/undefined -> `fallback` (default true); anything else -> null. */
export function parseTaxable(raw: string | undefined, fallback = true): boolean | null {
  const s = (raw ?? "").trim().toLowerCase();
  if (s === "") return fallback;
  if (TRUE_WORDS.has(s)) return true;
  if (FALSE_WORDS.has(s)) return false;
  return null;
}

/**
 * Dollars text -> integer cents, half-up, computed on the decimal string so 0.10 x 3 is exactly 30
 * and 1.005 rounds to 101 (no binary float drift). Accepts "$1,234.5", "12", ".5", "(3.00)" is NOT
 * accepted (no negatives). Returns null when the text is not a money amount.
 */
export function dollarsToCents(raw: string | number): number | null {
  const text = typeof raw === "number" ? raw.toString() : raw;
  const s = text.trim().replace(/^\$/, "").replace(/,/g, "").replace(/^\$/, "").trim();
  const m = /^(\d*)(?:\.(\d*))?$/.exec(s);
  if (!m || s === "" || s === ".") return null;
  const whole = m[1] === "" ? 0 : Number.parseInt(m[1], 10);
  const frac = (m[2] ?? "").padEnd(3, "0");
  let cents = whole * 100 + Number.parseInt(frac.slice(0, 2), 10);
  if (Number.parseInt(frac[2] ?? "0", 10) >= 5) cents += 1;
  return Number.isSafeInteger(cents) ? cents : null;
}

const list = (values: readonly string[]) => values.join(", ");

/** "" -> undefined so optional columns left blank validate as absent. */
const blankToUndefined = (v: unknown) => (typeof v === "string" && v.trim() === "" ? undefined : typeof v === "string" ? v.trim() : v);

const lowerTrim = (v: unknown) => (typeof v === "string" ? v.trim().toLowerCase() : v);

/**
 * One CSV row. Columns (header names, case-insensitive; `unit price` / `price` and
 * `roll length ft` are accepted aliases):
 *   sku, description, category, unit, unit_price (dollars), taxable (yes/no/true/false/1/0, default yes),
 *   roll_length_ft (optional, required when unit is "roll"), style (optional StyleRule id), role (optional StyleRole)
 *
 * After parsing: `unit_price` is INTEGER CENTS, `taxable` is a boolean, `roll_length_ft` a number or undefined.
 */
export const csvRowSchema = z.object({
  sku: z.preprocess(blankToUndefined, z.string({ error: "sku is required" }).min(1, "sku is required")),
  description: z.preprocess(
    blankToUndefined,
    z.string({ error: "description is required" }).min(1, "description is required"),
  ),
  category: z.preprocess(
    lowerTrim,
    z.enum(ITEM_CATEGORIES, { error: () => `category must be one of: ${list(ITEM_CATEGORIES)}` }),
  ),
  unit: z.preprocess(lowerTrim, z.enum(UNITS, { error: () => `unit must be one of: ${list(UNITS)}` })),
  unit_price: z.preprocess(
    blankToUndefined,
    z
      .string({ error: "unit_price is required (dollars, e.g. 12.50)" })
      .transform((s, ctx) => {
        const cents = dollarsToCents(s);
        if (cents === null) {
          ctx.addIssue({ code: "custom", message: `unit_price must be a dollar amount like 12.50 (got "${s}")` });
          return z.NEVER;
        }
        return cents;
      }),
  ),
  taxable: z.preprocess(blankToUndefined, z.string().optional()).transform((s, ctx) => {
    const v = parseTaxable(s);
    if (v === null) {
      ctx.addIssue({ code: "custom", message: `taxable must be yes/no/true/false/1/0 (got "${s}")` });
      return z.NEVER;
    }
    return v;
  }),
  roll_length_ft: z.preprocess(
    blankToUndefined,
    z
      .string()
      .optional()
      .transform((s, ctx) => {
        if (s === undefined) return undefined;
        const n = Number(s);
        if (!Number.isFinite(n) || n <= 0) {
          ctx.addIssue({ code: "custom", message: `roll_length_ft must be a positive number of feet (got "${s}")` });
          return z.NEVER;
        }
        return n;
      }),
  ),
  style: z.preprocess(blankToUndefined, z.string().optional()),
  role: z.preprocess(
    blankToUndefined,
    z.enum(STYLE_ROLES, { error: () => `role must be one of: ${list(STYLE_ROLES)}` }).optional(),
  ),
});
export type CsvRow = z.infer<typeof csvRowSchema>;

export const priceBookItemSchema = z.object({
  sku: z.string().min(1),
  description: z.string(),
  category: z.enum(ITEM_CATEGORIES),
  unit: z.enum(UNITS),
  unitPriceCents: z.number().int().nonnegative(),
  rollLengthFt: z.number().positive().optional(),
  taxable: z.boolean(),
  roles: z.array(z.object({ styleId: z.string(), role: z.enum(STYLE_ROLES) })),
});

export const styleRuleSchema = z.object({
  id: z.string(),
  name: z.string(),
  sectionModel: z.enum(["stick", "panel", "roll"]),
  heightFt: z.number().positive(),
  postSpacingFt: z.number().positive(),
  cornerThresholdDeg: z.number().min(0).max(90),
  railsPerSection: z.number().int().positive().optional(),
  picketWidthIn: z.number().positive().optional(),
  picketGapIn: z.number().nonnegative().optional(),
  panelWidthFt: z.number().positive().optional(),
  concreteBagsPerLinePost: z.number().nonnegative(),
  concreteBagsPerTerminalPost: z.number().nonnegative(),
  wastePct: z.number().min(0).max(100),
  requiredRoles: z.array(z.enum(STYLE_ROLES)),
  // zod 4: z.record with an enum key is exhaustive; partialRecord allows any subset of roles.
  skus: z.partialRecord(z.enum(STYLE_ROLES), z.string()),
});

export const priceBookSchema = z.object({
  id: z.string(),
  name: z.string(),
  items: z.array(priceBookItemSchema),
  rules: z.array(styleRuleSchema),
  importedAt: z.string(),
  sourceFileName: z.string().optional(),
});
