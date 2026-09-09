/**
 * localStorage-backed repositories (Phase A). Keys are versioned; every read is zod-validated and
 * invalid entries are dropped rather than thrown. Safe to construct on the server: without a
 * `window` every read returns empty/defaults and writes are no-ops.
 */
import type { FirmSettings, PriceBook, Quote } from "@/engine/types";
import type { QuoteSummary } from "@/engine/quote/quote";
import { quoteSummary as engineQuoteSummary } from "@/engine/quote/quote";
import { DEFAULT_FIRM_SETTINGS } from "./types";
import type { FirmSettingsRepository, PriceBookRepository, QuoteRepository } from "./types";
import { firmSettingsSchema, LOGO_MAX_BYTES, priceBookSchema, quoteSchema } from "./schemas";

export const STORAGE_KEYS = {
  quotes: "fq.v1.quotes",
  priceBooks: "fq.v1.pricebooks",
  firm: "fq.v1.firm",
} as const;

function storage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage ?? null;
  } catch {
    return null;
  }
}

function readJson(key: string): unknown {
  const s = storage();
  if (!s) return null;
  try {
    const raw = s.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown): void {
  const s = storage();
  if (!s) return;
  try {
    s.setItem(key, JSON.stringify(value));
  } catch (err) {
    const name = err instanceof Error ? err.name : "";
    if (name === "QuotaExceededError" || name === "NS_ERROR_DOM_QUOTA_REACHED") {
      throw new Error("Browser storage is full. Delete old quotes or shrink the logo, then try again.");
    }
    throw err;
  }
}

/** Validate each entry of a stored array, silently dropping the ones that no longer parse. */
function readValidArray<T>(key: string, parse: (v: unknown) => T | null): T[] {
  const raw = readJson(key);
  if (!Array.isArray(raw)) return [];
  const out: T[] = [];
  for (const entry of raw) {
    const v = parse(entry);
    if (v !== null) out.push(v);
  }
  return out;
}

const parseQuote = (v: unknown): Quote | null => {
  const r = quoteSchema.safeParse(v);
  return r.success ? r.data : null;
};
const parsePriceBook = (v: unknown): PriceBook | null => {
  const r = priceBookSchema.safeParse(v);
  return r.success ? r.data : null;
};

/** Summary without the engine (fallback while engine/quote is unimplemented or for odd quotes). */
function localSummary(quote: Quote): QuoteSummary {
  const a = quote.address;
  const addressLine = [a.line1, [a.city, [a.state, a.zip].filter(Boolean).join(" ")].filter(Boolean).join(", ")]
    .filter(Boolean)
    .join(", ");
  return {
    id: quote.id,
    addressLine: addressLine || a.matched || quote.id,
    updatedAt: quote.updatedAt,
    lengthFt: quote.takeoff?.correctedLengthFt,
    totalCents: quote.takeoff?.totalCents,
    styleId: quote.fence.styleId,
  };
}

function summarize(quote: Quote): QuoteSummary {
  try {
    return engineQuoteSummary(quote);
  } catch {
    return localSummary(quote);
  }
}

export class LocalStorageQuoteRepository implements QuoteRepository {
  private readAll(): Quote[] {
    return readValidArray(STORAGE_KEYS.quotes, parseQuote);
  }

  async list(): Promise<QuoteSummary[]> {
    return this.readAll()
      .map(summarize)
      .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : a.updatedAt > b.updatedAt ? -1 : 0));
  }

  async get(id: string): Promise<Quote | null> {
    return this.readAll().find((q) => q.id === id) ?? null;
  }

  async save(quote: Quote): Promise<void> {
    const all = this.readAll().filter((q) => q.id !== quote.id);
    all.push(quote);
    writeJson(STORAGE_KEYS.quotes, all);
  }

  async remove(id: string): Promise<void> {
    writeJson(
      STORAGE_KEYS.quotes,
      this.readAll().filter((q) => q.id !== id),
    );
  }
}

export class LocalStoragePriceBookRepository implements PriceBookRepository {
  private readAll(): PriceBook[] {
    return readValidArray(STORAGE_KEYS.priceBooks, parsePriceBook);
  }

  async list(): Promise<{ id: string; name: string; importedAt: string; itemCount: number }[]> {
    return this.readAll()
      .map((pb) => ({ id: pb.id, name: pb.name, importedAt: pb.importedAt, itemCount: pb.items.length }))
      .sort((a, b) => (a.importedAt < b.importedAt ? 1 : a.importedAt > b.importedAt ? -1 : 0));
  }

  async get(id: string): Promise<PriceBook | null> {
    return this.readAll().find((pb) => pb.id === id) ?? null;
  }

  async save(priceBook: PriceBook): Promise<void> {
    const all = this.readAll().filter((pb) => pb.id !== priceBook.id);
    all.push(priceBook);
    writeJson(STORAGE_KEYS.priceBooks, all);
  }

  async remove(id: string): Promise<void> {
    writeJson(
      STORAGE_KEYS.priceBooks,
      this.readAll().filter((pb) => pb.id !== id),
    );
  }
}

export class LocalStorageFirmSettingsRepository implements FirmSettingsRepository {
  async get(): Promise<FirmSettings> {
    const raw = readJson(STORAGE_KEYS.firm);
    if (!raw || typeof raw !== "object") return { ...DEFAULT_FIRM_SETTINGS };
    const r = firmSettingsSchema.safeParse(raw);
    if (r.success) return { ...DEFAULT_FIRM_SETTINGS, ...r.data };
    // Most likely an oversized or malformed logo: keep the rest of the settings.
    const withoutLogo = firmSettingsSchema.safeParse({ ...(raw as Record<string, unknown>), logoDataUrl: undefined });
    return withoutLogo.success ? { ...DEFAULT_FIRM_SETTINGS, ...withoutLogo.data } : { ...DEFAULT_FIRM_SETTINGS };
  }

  async save(settings: FirmSettings): Promise<void> {
    if (settings.logoDataUrl && settings.logoDataUrl.length > LOGO_MAX_BYTES) {
      throw new Error(`Logo must be under ${LOGO_MAX_BYTES / 1024} KB; choose a smaller image.`);
    }
    const parsed = firmSettingsSchema.parse(settings);
    writeJson(STORAGE_KEYS.firm, parsed);
  }
}
