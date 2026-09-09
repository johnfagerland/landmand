"use client";

import { useEffect, useState } from "react";
import type { FirmSettings, PriceBook } from "@/engine/types";
import { getRepositories } from "@/lib/repo";
import { DEFAULT_FIRM_SETTINGS } from "@/lib/repo/types";
import { LOGO_MAX_BYTES } from "@/lib/repo/schemas";
import { PriceBookImport } from "@/components/pricebook/PriceBookImport";
import { PriceBookTable } from "@/components/pricebook/PriceBookTable";

type PriceBookSummary = { id: string; name: string; importedAt: string; itemCount: number };

const inputClass = "w-full rounded border border-zinc-300 bg-white px-2 py-1.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-400";

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error("Could not read the file."));
    reader.readAsDataURL(file);
  });
}

export function SettingsClient() {
  const [firm, setFirm] = useState<FirmSettings>(DEFAULT_FIRM_SETTINGS);
  const [addressText, setAddressText] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [saved, setSaved] = useState<string>("");
  const [firmError, setFirmError] = useState<string>("");
  const [books, setBooks] = useState<PriceBookSummary[]>([]);
  const [active, setActive] = useState<PriceBook | null>(null);

  async function refreshBooks(preferId?: string) {
    const repo = getRepositories().priceBooks;
    const list = await repo.list();
    setBooks(list);
    const id = preferId ?? list[0]?.id;
    setActive(id ? await repo.get(id) : null);
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const f = await getRepositories().firm.get();
      if (cancelled) return;
      setFirm(f);
      setAddressText(f.addressLines.join("\n"));
      await refreshBooks();
      if (!cancelled) setLoaded(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const update = <K extends keyof FirmSettings>(key: K, value: FirmSettings[K]) => {
    setSaved("");
    setFirm((f) => ({ ...f, [key]: value }));
  };

  async function onLogo(file: File | undefined) {
    setFirmError("");
    if (!file) return;
    if (!/^image\/(png|jpeg)$/.test(file.type)) {
      setFirmError("Logo must be a PNG or JPEG (the proposal PDF cannot embed SVG).");
      return;
    }
    const dataUrl = await readAsDataUrl(file);
    if (dataUrl.length > LOGO_MAX_BYTES) {
      setFirmError(`Logo is ${(dataUrl.length / 1024).toFixed(0)} KB as a data URL; keep it under ${LOGO_MAX_BYTES / 1024} KB.`);
      return;
    }
    update("logoDataUrl", dataUrl);
  }

  async function save() {
    setFirmError("");
    const next: FirmSettings = {
      ...firm,
      name: firm.name.trim(),
      addressLines: addressText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      phone: firm.phone.trim(),
      email: firm.email.trim(),
      licenseNo: firm.licenseNo?.trim() || undefined,
      taxRatePct: Number.isFinite(firm.taxRatePct) ? firm.taxRatePct : 0,
      defaultSetbackFt: Number.isFinite(firm.defaultSetbackFt) ? firm.defaultSetbackFt : 0,
    };
    try {
      await getRepositories().firm.save(next);
      setFirm(next);
      setSaved("Saved.");
    } catch (err) {
      setFirmError(err instanceof Error ? err.message : "Could not save.");
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-4 py-8">
      <section className="flex flex-col gap-4" aria-labelledby="firm-heading">
        <div>
          <h1 id="firm-heading" className="text-xl font-semibold">
            Firm settings
          </h1>
          <p className="text-sm text-zinc-600">Shown in the header of every proposal PDF. Saved in this browser.</p>
        </div>
        <form
          className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            void save();
          }}
        >
          <label className="flex flex-col gap-1 text-sm sm:col-span-2">
            <span className="font-medium">Company name</span>
            <input data-testid="firm-name" className={inputClass} value={firm.name} onChange={(e) => update("name", e.target.value)} placeholder="Oak City Fence Co." />
          </label>
          <label className="flex flex-col gap-1 text-sm sm:col-span-2">
            <span className="font-medium">Address (one line per row)</span>
            <textarea
              data-testid="firm-address"
              className={`${inputClass} min-h-16`}
              value={addressText}
              onChange={(e) => {
                setSaved("");
                setAddressText(e.target.value);
              }}
              placeholder={"4120 Atlantic Ave, Suite 110\nRaleigh, NC 27604"}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">Phone</span>
            <input data-testid="firm-phone" className={inputClass} value={firm.phone} onChange={(e) => update("phone", e.target.value)} placeholder="(919) 555-0100" />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">Email</span>
            <input data-testid="firm-email" className={inputClass} type="email" value={firm.email} onChange={(e) => update("email", e.target.value)} placeholder="quotes@example.com" />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">License no. (optional)</span>
            <input data-testid="firm-license" className={inputClass} value={firm.licenseNo ?? ""} onChange={(e) => update("licenseNo", e.target.value)} />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">Sales tax rate (%)</span>
            <input
              data-testid="firm-tax-rate"
              className={inputClass}
              type="number"
              min={0}
              max={100}
              step={0.01}
              value={firm.taxRatePct}
              onChange={(e) => update("taxRatePct", e.target.value === "" ? 0 : Number(e.target.value))}
            />
            <span className="text-xs text-zinc-500">Applied to taxable items only (labor rows marked taxable=no are exempt).</span>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">Default setback from lot line (ft)</span>
            <input
              data-testid="firm-setback"
              className={inputClass}
              type="number"
              min={0}
              step={0.5}
              value={firm.defaultSetbackFt}
              onChange={(e) => update("defaultSetbackFt", e.target.value === "" ? 0 : Number(e.target.value))}
            />
          </label>
          <div className="flex flex-col gap-1 text-sm">
            <span className="font-medium">Logo (PNG or JPEG, under {LOGO_MAX_BYTES / 1024} KB)</span>
            <input data-testid="firm-logo" type="file" accept="image/png,image/jpeg" onChange={(e) => void onLogo(e.target.files?.[0])} className="text-sm" />
            {firm.logoDataUrl ? (
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element -- data URL preview */}
                <img src={firm.logoDataUrl} alt="Logo preview" className="h-12 max-w-40 rounded border border-zinc-200 bg-white object-contain p-1" />
                <button type="button" className="text-xs text-zinc-600 underline" onClick={() => update("logoDataUrl", undefined)}>
                  Remove logo
                </button>
              </div>
            ) : (
              <span className="text-xs text-zinc-500">No logo yet; the proposal shows your company name only.</span>
            )}
          </div>
          <label className="flex flex-col gap-1 text-sm sm:col-span-2">
            <span className="font-medium">Proposal terms</span>
            <textarea data-testid="firm-terms" className={`${inputClass} min-h-24`} value={firm.terms} onChange={(e) => update("terms", e.target.value)} />
          </label>
          <div className="flex items-center gap-3 sm:col-span-2">
            <button
              type="submit"
              data-testid="firm-save"
              disabled={!loaded}
              className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
            >
              Save firm settings
            </button>
            {saved ? (
              <span className="text-sm text-emerald-700" data-testid="firm-saved">
                {saved}
              </span>
            ) : null}
            {firmError ? (
              <span className="text-sm text-red-700" data-testid="firm-error" role="alert">
                {firmError}
              </span>
            ) : null}
          </div>
        </form>
      </section>

      <section className="flex flex-col gap-4" aria-labelledby="pricebook-heading">
        <div>
          <h2 id="pricebook-heading" className="text-xl font-semibold">
            Price book
          </h2>
          <p className="text-sm text-zinc-600">
            Every quote is priced from your own list; nothing here guesses market prices. Need a template?{" "}
            <a href="/sample-price-book.csv" download className="font-medium text-blue-700 underline" data-testid="pricebook-sample-link">
              Download the sample CSV
            </a>
            . Its prices are placeholders to show the format; replace them with what you actually pay and charge.
          </p>
        </div>
        <PriceBookImport onImported={(pb) => void refreshBooks(pb.id)} />

        {books.length > 1 ? (
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-zinc-600">Imported books:</span>
            {books.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => void refreshBooks(b.id)}
                className={`rounded-full px-2.5 py-0.5 text-xs ring-1 ring-inset ${
                  active?.id === b.id ? "bg-zinc-900 text-white ring-zinc-900" : "bg-white text-zinc-700 ring-zinc-300"
                }`}
              >
                {b.name} · {b.itemCount}
              </button>
            ))}
          </div>
        ) : null}

        {active ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h3 className="font-medium" data-testid="pricebook-name">
                {active.name}
                {books[0]?.id === active.id ? <span className="ml-2 rounded bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-600">current</span> : null}
              </h3>
              <button
                type="button"
                data-testid="pricebook-remove"
                className="text-xs text-red-700 underline"
                onClick={async () => {
                  if (!window.confirm(`Remove price book "${active.name}"?`)) return;
                  await getRepositories().priceBooks.remove(active.id);
                  await refreshBooks();
                }}
              >
                Remove
              </button>
            </div>
            <PriceBookTable priceBook={active} />
          </div>
        ) : loaded ? (
          <p className="rounded border border-dashed border-zinc-300 p-4 text-sm text-zinc-600" data-testid="pricebook-empty">
            No price book imported yet. Quotes stay unpriced until you import one.
          </p>
        ) : null}
      </section>
    </main>
  );
}
