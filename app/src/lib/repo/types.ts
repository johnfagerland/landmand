/**
 * Persistence seam. Phase A implements these on localStorage; Phase B swaps in Supabase
 * behind getRepositories() without touching any component.
 */
import type { FirmSettings, PriceBook, Quote } from "@/engine/types";
import type { QuoteSummary } from "@/engine/quote/quote";

export interface QuoteRepository {
  list(): Promise<QuoteSummary[]>;
  get(id: string): Promise<Quote | null>;
  save(quote: Quote): Promise<void>;
  remove(id: string): Promise<void>;
}

export interface PriceBookRepository {
  list(): Promise<{ id: string; name: string; importedAt: string; itemCount: number }[]>;
  get(id: string): Promise<PriceBook | null>;
  save(priceBook: PriceBook): Promise<void>;
  remove(id: string): Promise<void>;
}

export interface FirmSettingsRepository {
  get(): Promise<FirmSettings>;
  save(settings: FirmSettings): Promise<void>;
}

export interface Repositories {
  quotes: QuoteRepository;
  priceBooks: PriceBookRepository;
  firm: FirmSettingsRepository;
}

export const DEFAULT_FIRM_SETTINGS: FirmSettings = {
  name: "",
  addressLines: [],
  phone: "",
  email: "",
  taxRatePct: 0,
  defaultSetbackFt: 0,
  terms:
    "This proposal is valid for 30 days. Measurements are derived from county lot lines and the contractor's on-map adjustments; final layout is confirmed on site. Price excludes permits and utility locates unless listed.",
};
