import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { FirmSettings, PriceBook, Quote } from "@/engine/types";
import { parsePriceBookCsv } from "@/engine/pricebook/parse";
import { readFileSync } from "node:fs";
import {
  LocalStorageFirmSettingsRepository,
  LocalStoragePriceBookRepository,
  LocalStorageQuoteRepository,
  STORAGE_KEYS,
} from "../localStorage";
import { DEFAULT_FIRM_SETTINGS } from "../types";
import { getRepositories } from "../index";

function memoryStorage(): Storage & { dump(): Record<string, string> } {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    clear: () => map.clear(),
    getItem: (k: string) => map.get(k) ?? null,
    key: (i: number) => [...map.keys()][i] ?? null,
    removeItem: (k: string) => void map.delete(k),
    setItem: (k: string, v: string) => void map.set(k, String(v)),
    dump: () => Object.fromEntries(map),
  };
}

const quote = (id: string, updatedAt: string): Quote => ({
  schemaVersion: 1,
  id,
  createdAt: "2026-09-08T10:00:00.000Z",
  updatedAt,
  address: { line1: "1823 White Oak Rd", city: "Raleigh", state: "NC", zip: "27608", matched: "1823 WHITE OAK RD, RALEIGH, NC, 27608", countyFips: "37183" },
  geocode: [-78.6473, 35.8067],
  parcelStatus: "pending",
  fence: { vertices: [], closed: true, gates: [], styleId: "wood-privacy-6", heightFt: 6 },
  profiles: {},
  customer: { name: "Jane Doe" },
  notes: "",
});

describe("localStorage repositories", () => {
  let store: ReturnType<typeof memoryStorage>;
  beforeEach(() => {
    store = memoryStorage();
    vi.stubGlobal("window", { localStorage: store });
  });
  afterEach(() => vi.unstubAllGlobals());

  it("saves, lists (newest first), gets and removes quotes under fq.v1.quotes", async () => {
    const repo = new LocalStorageQuoteRepository();
    await repo.save(quote("a", "2026-09-08T11:00:00.000Z"));
    await repo.save(quote("b", "2026-09-08T12:00:00.000Z"));
    await repo.save({ ...quote("a", "2026-09-08T13:00:00.000Z"), notes: "updated" });
    expect(Object.keys(store.dump())).toEqual([STORAGE_KEYS.quotes]);
    const list = await repo.list();
    expect(list.map((s) => s.id)).toEqual(["a", "b"]);
    expect(list[0].addressLine).toContain("1823 White Oak Rd");
    expect(list[0].styleId).toBe("wood-privacy-6");
    expect((await repo.get("a"))?.notes).toBe("updated");
    await repo.remove("a");
    expect(await repo.get("a")).toBeNull();
    expect((await repo.list()).map((s) => s.id)).toEqual(["b"]);
  });

  it("drops invalid stored entries instead of throwing", async () => {
    store.setItem(STORAGE_KEYS.quotes, JSON.stringify([quote("ok", "2026-09-08T11:00:00.000Z"), { id: "broken" }, 42]));
    const repo = new LocalStorageQuoteRepository();
    expect((await repo.list()).map((s) => s.id)).toEqual(["ok"]);
    store.setItem(STORAGE_KEYS.quotes, "not json");
    expect(await repo.list()).toEqual([]);
  });

  it("round-trips a parsed price book", async () => {
    const csv = readFileSync(new URL("../../../../public/sample-price-book.csv", import.meta.url), "utf8");
    const pb = parsePriceBookCsv(csv, { id: "pb1", now: "2026-09-08T00:00:00.000Z", fileName: "sample.csv" }).priceBook as PriceBook;
    const repo = new LocalStoragePriceBookRepository();
    await repo.save(pb);
    const list = await repo.list();
    expect(list).toEqual([{ id: "pb1", name: "sample", importedAt: pb.importedAt, itemCount: pb.items.length }]);
    expect(await repo.get("pb1")).toEqual(pb);
    await repo.remove("pb1");
    expect(await repo.list()).toEqual([]);
  });

  it("returns defaults for firm settings, saves them, and caps the logo at 200 KB", async () => {
    const repo = new LocalStorageFirmSettingsRepository();
    expect(await repo.get()).toEqual(DEFAULT_FIRM_SETTINGS);
    const firm: FirmSettings = {
      ...DEFAULT_FIRM_SETTINGS,
      name: "Acme Fence",
      addressLines: ["1 Main St", "Raleigh, NC 27601"],
      taxRatePct: 7.25,
      logoDataUrl: "data:image/png;base64,AAAA",
    };
    await repo.save(firm);
    expect(await repo.get()).toEqual(firm);
    await expect(repo.save({ ...firm, logoDataUrl: "data:image/png;base64," + "A".repeat(200 * 1024) })).rejects.toThrow(/200 KB/);
    // An oversized logo that somehow got stored is dropped on read, the rest survives.
    store.setItem(STORAGE_KEYS.firm, JSON.stringify({ ...firm, logoDataUrl: "data:image/png;base64," + "A".repeat(200 * 1024) }));
    expect(await repo.get()).toEqual({ ...firm, logoDataUrl: undefined });
  });

  it("getRepositories is memoised and wired to localStorage", () => {
    const a = getRepositories();
    expect(getRepositories()).toBe(a);
    expect(a.quotes).toBeInstanceOf(LocalStorageQuoteRepository);
    expect(a.priceBooks).toBeInstanceOf(LocalStoragePriceBookRepository);
    expect(a.firm).toBeInstanceOf(LocalStorageFirmSettingsRepository);
  });
});

describe("without a window (server render)", () => {
  it("reads empty/defaults and ignores writes", async () => {
    vi.unstubAllGlobals();
    expect(typeof window).toBe("undefined");
    const quotes = new LocalStorageQuoteRepository();
    await quotes.save(quote("x", "2026-09-08T11:00:00.000Z"));
    expect(await quotes.list()).toEqual([]);
    expect(await new LocalStorageFirmSettingsRepository().get()).toEqual(DEFAULT_FIRM_SETTINGS);
    expect(await new LocalStoragePriceBookRepository().list()).toEqual([]);
  });
});
