/**
 * Light zod schemas for persisted/transported domain objects (Quote, FirmSettings, TakeOff).
 * Used to validate localStorage reads (invalid entries are dropped) and the /api/proposal body.
 * Deliberately lenient on optional detail so older saved quotes keep loading.
 */
import { z } from "zod";
import type { FirmSettings, Quote, TakeOff } from "@/engine/types";
import { ITEM_CATEGORIES, priceBookSchema, UNITS } from "@/engine/pricebook/schema";

export const LOGO_MAX_BYTES = 200 * 1024;

export const lonLatSchema = z.tuple([z.number(), z.number()]);

export const gateSchema = z.object({
  id: z.string(),
  anchor: lonLatSchema,
  widthFt: z.number().positive(),
  kind: z.enum(["single", "double"]),
});

export const fenceLineSchema = z.object({
  vertices: z.array(lonLatSchema),
  closed: z.boolean(),
  gates: z.array(gateSchema).default([]),
  styleId: z.string(),
  heightFt: z.number().positive(),
});

export const parcelSchema = z.object({
  id: z.string(),
  source: z.enum(["regrid", "county", "manual"]),
  providerId: z.string(),
  attribution: z.string(),
  apn: z.string().optional(),
  siteAddress: z.string().optional(),
  ring: z.array(lonLatSchema),
  holes: z.array(z.array(lonLatSchema)).default([]),
  areaSqFt: z.number(),
  origin: lonLatSchema,
  fetchedAt: z.string(),
});

export const elevationProfileSchema = z.object({
  segmentKey: z.string(),
  samples: z.array(z.object({ stationFt: z.number(), elevFt: z.number().nullable(), lonLat: lonLatSchema })),
  correctedLengthFt: z.number(),
  slopeFactor: z.number(),
  riseFt: z.number(),
  maxGradePct: z.number(),
  source: z.enum(["3dep", "epqs", "none"]),
  resolutionM: z.number().optional(),
});

export const takeOffLineSchema = z.object({
  sku: z.string(),
  description: z.string(),
  category: z.enum(ITEM_CATEGORIES),
  unit: z.enum(UNITS),
  qty: z.number(),
  unitPriceCents: z.number().int(),
  extendedCents: z.number().int(),
  basis: z.string().default(""),
  taxable: z.boolean().default(true),
});

export const takeOffSchema = z.object({
  styleId: z.string(),
  heightFt: z.number(),
  flatLengthFt: z.number(),
  correctedLengthFt: z.number(),
  fenceLengthFt: z.number(),
  slopeFactor: z.number(),
  posts: z.object({
    corner: z.number(),
    end: z.number(),
    line: z.number(),
    gate: z.number(),
    total: z.number(),
  }),
  sections: z.number(),
  gates: z.number(),
  segments: z
    .array(
      z.object({
        segmentIndex: z.number(),
        flatFt: z.number(),
        correctedFt: z.number(),
        fenceFt: z.number(),
        slopeFactor: z.number(),
        linePosts: z.number(),
        sections: z.number(),
        gateIds: z.array(z.string()).default([]),
      }),
    )
    .default([]),
  lines: z.array(takeOffLineSchema),
  subtotalCents: z.number().int(),
  taxCents: z.number().int(),
  totalCents: z.number().int(),
  warnings: z.array(z.string()).default([]),
  computedAt: z.string(),
});

export const addressSchema = z.object({
  line1: z.string(),
  city: z.string(),
  state: z.string(),
  zip: z.string(),
  matched: z.string().default(""),
  countyFips: z.string().optional(),
});

export const customerSchema = z.object({
  name: z.string().default(""),
  email: z.string().optional(),
  phone: z.string().optional(),
});

export const quoteSchema = z.object({
  schemaVersion: z.literal(1),
  id: z.string().min(1),
  createdAt: z.string(),
  updatedAt: z.string(),
  address: addressSchema,
  geocode: lonLatSchema,
  parcel: parcelSchema.optional(),
  parcelStatus: z.enum(["found", "manual", "pending"]),
  fence: fenceLineSchema,
  profiles: z.record(z.string(), elevationProfileSchema).default({}),
  priceBookId: z.string().optional(),
  takeoff: takeOffSchema.optional(),
  customer: customerSchema.default({ name: "" }),
  notes: z.string().default(""),
});

export const firmSettingsSchema = z.object({
  name: z.string().default(""),
  logoDataUrl: z
    .string()
    .startsWith("data:image/")
    .max(LOGO_MAX_BYTES, `Logo must be under ${LOGO_MAX_BYTES / 1024} KB`)
    .optional(),
  addressLines: z.array(z.string()).default([]),
  phone: z.string().default(""),
  email: z.string().default(""),
  licenseNo: z.string().optional(),
  taxRatePct: z.number().min(0).max(100).default(0),
  defaultSetbackFt: z.number().min(0).default(0),
  terms: z.string().default(""),
});

/** Body of POST /api/proposal. */
export const proposalRequestSchema = z.object({
  quote: quoteSchema,
  takeoff: takeOffSchema,
  firm: firmSettingsSchema,
});

export { priceBookSchema };

// Compile-time guards: the parsed shapes must be assignable to the engine contracts.
type _QuoteCheck = z.infer<typeof quoteSchema> extends Quote ? true : never;
type _FirmCheck = z.infer<typeof firmSettingsSchema> extends FirmSettings ? true : never;
type _TakeOffCheck = z.infer<typeof takeOffSchema> extends TakeOff ? true : never;
export const _schemaChecks: [_QuoteCheck, _FirmCheck, _TakeOffCheck] = [true, true, true];
