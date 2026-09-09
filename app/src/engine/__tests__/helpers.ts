/** Shared fixtures for engine tests. Price books and style rules are built inline (not from src/engine/pricebook). */
import { createLocalPlane } from "../geo/localPlane";
import type { FenceLine, Gate, LocalPlane, LonLat, PriceBook, PriceBookItem, StyleRule, XY } from "../types";

/** Raleigh, NC — near the test address. */
export const ORIGIN: LonLat = [-78.6453, 35.8066];

export function plane(): LocalPlane {
  return createLocalPlane(ORIGIN);
}

/** Build lon/lat vertices from local-plane feet so tests can reason in feet. */
export function fromXY(p: LocalPlane, pts: XY[]): LonLat[] {
  return pts.map((q) => p.toLonLat(q));
}

/** CCW rectangle w x h with its lower-left corner at (0,0); side 0 runs along the bottom edge (east). */
export function rectXY(w: number, h: number): XY[] {
  return [
    { x: 0, y: 0 },
    { x: w, y: 0 },
    { x: w, y: h },
    { x: 0, y: h },
  ];
}

export function fence(
  p: LocalPlane,
  pts: XY[],
  opts: { closed?: boolean; gates?: Gate[]; styleId?: string; heightFt?: number } = {},
): FenceLine {
  return {
    vertices: fromXY(p, pts),
    closed: opts.closed ?? true,
    gates: opts.gates ?? [],
    styleId: opts.styleId ?? "wood-privacy-6",
    heightFt: opts.heightFt ?? 6,
  };
}

export function gateAt(p: LocalPlane, at: XY, widthFt: number, id = "g1", kind: Gate["kind"] = "single"): Gate {
  return { id, anchor: p.toLonLat(at), widthFt, kind };
}

function item(
  sku: string,
  category: PriceBookItem["category"],
  unit: PriceBookItem["unit"],
  unitPriceCents: number,
  extra: Partial<PriceBookItem> = {},
): PriceBookItem {
  return { sku, description: sku, category, unit, unitPriceCents, taxable: true, roles: [], ...extra };
}

/**
 * Wood privacy price book used by the take-off tests. Prices:
 *   LP line post $12.50, TP terminal post $18.00, RAIL $6.25, PICKET $2.10, CONC $5.00/bag,
 *   LAB $9.00/ft (not taxable), GATE1 $250.00, GATE2 $450.00, HW $35.00, LABG $75.00/gate (not taxable).
 */
export function woodPriceBook(): PriceBook {
  return {
    id: "pb-test",
    name: "Test book",
    importedAt: "2026-09-08T00:00:00.000Z",
    items: [
      item("LP", "post", "each", 1250),
      item("TP", "post", "each", 1800),
      item("RAIL", "rail", "each", 625),
      item("PICKET", "picket", "each", 210),
      item("CONC", "concrete", "bag", 500),
      item("LAB", "labor", "ft", 900, { taxable: false }),
      item("GATE1", "gate", "each", 25000),
      item("GATE2", "gate", "each", 45000),
      item("HW", "hardware", "each", 3500),
      item("LABG", "labor", "each", 7500, { taxable: false }),
    ],
    rules: [],
  };
}

export function woodRule(overrides: Partial<StyleRule> = {}): StyleRule {
  return {
    id: "wood-privacy-6",
    name: "Wood privacy 6 ft",
    sectionModel: "stick",
    heightFt: 6,
    postSpacingFt: 8,
    cornerThresholdDeg: 15,
    railsPerSection: 3,
    picketWidthIn: 5.5,
    picketGapIn: 0.5,
    concreteBagsPerLinePost: 1,
    concreteBagsPerTerminalPost: 2,
    wastePct: 0,
    requiredRoles: ["linePost", "terminalPost", "rail", "picket", "concrete", "laborPerFt", "gateSingle", "gateDouble", "gateHardware"],
    skus: {
      linePost: "LP",
      terminalPost: "TP",
      rail: "RAIL",
      picket: "PICKET",
      concrete: "CONC",
      laborPerFt: "LAB",
      gateSingle: "GATE1",
      gateDouble: "GATE2",
      gateHardware: "HW",
      laborPerGate: "LABG",
    },
    ...overrides,
  };
}

export const NOW = "2026-09-08T12:00:00.000Z";
