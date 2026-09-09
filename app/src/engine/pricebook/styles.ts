import type { PriceBook, StyleRole, StyleRule } from "../types";

/**
 * Built-in fence styles. Ids are stable and referenced by the sample CSV's `style` column:
 *   wood-privacy-6 (stick, 8 ft spacing, 3 rails, 5.5 in pickets + 0.5 in gap)
 *   chain-link-4   (roll, 10 ft spacing, 50 ft rolls, top rail)
 *   vinyl-6        (panel, 8 ft panels, caps)
 *   aluminum-4     (panel, 6 ft panels, caps)
 * Each has `skus: {}` until bound by a price book (see resolveRules).
 *
 * These are spacing/assembly rules only. Every price comes from the contractor's price book;
 * nothing here invents market pricing.
 */
const GATE_ROLES: StyleRole[] = ["gateSingle", "gateDouble", "gateHardware"];

export const DEFAULT_STYLE_RULES: StyleRule[] = [
  {
    id: "wood-privacy-6",
    name: "Wood privacy, 6 ft",
    sectionModel: "stick",
    heightFt: 6,
    postSpacingFt: 8,
    cornerThresholdDeg: 15,
    railsPerSection: 3,
    picketWidthIn: 5.5,
    picketGapIn: 0.5,
    concreteBagsPerLinePost: 1,
    concreteBagsPerTerminalPost: 2,
    wastePct: 5,
    requiredRoles: ["linePost", "terminalPost", "rail", "picket", "concrete", "laborPerFt", ...GATE_ROLES],
    skus: {},
  },
  {
    id: "chain-link-4",
    name: "Chain link, 4 ft",
    sectionModel: "roll",
    heightFt: 4,
    postSpacingFt: 10,
    cornerThresholdDeg: 15,
    concreteBagsPerLinePost: 1,
    concreteBagsPerTerminalPost: 2,
    wastePct: 5,
    requiredRoles: ["linePost", "terminalPost", "fabric", "topRail", "concrete", "laborPerFt", ...GATE_ROLES],
    skus: {},
  },
  {
    id: "vinyl-6",
    name: "Vinyl privacy, 6 ft",
    sectionModel: "panel",
    heightFt: 6,
    postSpacingFt: 8,
    cornerThresholdDeg: 15,
    panelWidthFt: 8,
    concreteBagsPerLinePost: 1,
    concreteBagsPerTerminalPost: 2,
    wastePct: 5,
    requiredRoles: ["linePost", "terminalPost", "panel", "cap", "concrete", "laborPerFt", ...GATE_ROLES],
    skus: {},
  },
  {
    id: "aluminum-4",
    name: "Aluminum, 4 ft",
    sectionModel: "panel",
    heightFt: 4,
    postSpacingFt: 6,
    cornerThresholdDeg: 15,
    panelWidthFt: 6,
    concreteBagsPerLinePost: 1,
    concreteBagsPerTerminalPost: 2,
    wastePct: 5,
    requiredRoles: ["linePost", "terminalPost", "panel", "cap", "concrete", "laborPerFt", ...GATE_ROLES],
    skus: {},
  },
];

export const DEFAULT_STYLE_IDS: string[] = DEFAULT_STYLE_RULES.map((r) => r.id);

/**
 * Resolve rules for a price book: `base` (default DEFAULT_STYLE_RULES) with `skus` filled from
 * item role bindings. Bindings are applied in item order; when two items bind the same
 * style/role the last one wins. Bindings to unknown style ids are ignored here (the parser
 * reports them as errors). Returns fresh objects; never mutates `base`.
 */
export function resolveRules(items: PriceBook["items"], base: StyleRule[] = DEFAULT_STYLE_RULES): StyleRule[] {
  const byStyle = new Map<string, Partial<Record<StyleRole, string>>>();
  for (const rule of base) byStyle.set(rule.id, {});
  for (const item of items) {
    for (const binding of item.roles) {
      const skus = byStyle.get(binding.styleId);
      if (!skus) continue;
      skus[binding.role] = item.sku;
    }
  }
  return base.map((rule) => ({
    ...rule,
    requiredRoles: [...rule.requiredRoles],
    skus: { ...byStyle.get(rule.id) },
  }));
}

/** Required roles of a rule that have no sku bound, in the rule's required-role order. */
export function missingRoles(rule: StyleRule): StyleRole[] {
  return rule.requiredRoles.filter((role) => !rule.skus[role]);
}

/** Which styles are usable with this price book, and what each is missing (empty = complete). */
export function styleAvailability(priceBook: PriceBook): { rule: StyleRule; missingRoles: StyleRule["requiredRoles"] }[] {
  return priceBook.rules.map((rule) => ({ rule, missingRoles: missingRoles(rule) }));
}

export function findRule(priceBook: PriceBook, styleId: string): StyleRule | undefined {
  return priceBook.rules.find((rule) => rule.id === styleId);
}

/** True when every required role of the style is bound in this price book. */
export function isStyleComplete(priceBook: PriceBook, styleId: string): boolean {
  const rule = findRule(priceBook, styleId);
  return rule !== undefined && missingRoles(rule).length === 0;
}
