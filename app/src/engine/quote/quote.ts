import type { Address, FenceLine, LonLat, Quote, TakeOff } from "../types";

export const DEFAULT_STYLE_ID = "wood-privacy-6";
export const DEFAULT_HEIGHT_FT = 6;

export function emptyFence(styleId?: string, heightFt?: number): FenceLine {
  return {
    vertices: [],
    closed: true,
    gates: [],
    styleId: styleId ?? DEFAULT_STYLE_ID,
    heightFt: heightFt ?? DEFAULT_HEIGHT_FT,
  };
}

export function newQuote(args: { id: string; now: string; address: Address; geocode: LonLat }): Quote {
  return {
    schemaVersion: 1,
    id: args.id,
    createdAt: args.now,
    updatedAt: args.now,
    address: { ...args.address },
    geocode: [args.geocode[0], args.geocode[1]],
    parcelStatus: "pending",
    fence: emptyFence(),
    profiles: {},
    customer: { name: "" },
    notes: "",
  };
}

/** Returns a new quote carrying the take-off; the input is not mutated. */
export function applyTakeOff(quote: Quote, takeoff: TakeOff, now: string): Quote {
  return { ...quote, takeoff, updatedAt: now };
}

export interface QuoteSummary {
  id: string;
  addressLine: string;
  updatedAt: string;
  lengthFt?: number;
  totalCents?: number;
  styleId: string;
}

export function quoteSummary(quote: Quote): QuoteSummary {
  const a = quote.address;
  const cityStateZip = [a.city, [a.state, a.zip].filter(Boolean).join(" ")].filter(Boolean).join(", ");
  const addressLine = [a.line1, cityStateZip].filter(Boolean).join(", ") || a.matched;
  return {
    id: quote.id,
    addressLine,
    updatedAt: quote.updatedAt,
    lengthFt: quote.takeoff?.fenceLengthFt,
    totalCents: quote.takeoff?.totalCents,
    styleId: quote.fence.styleId,
  };
}
