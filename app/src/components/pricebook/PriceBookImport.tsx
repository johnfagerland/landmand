"use client";

import { useRef, useState } from "react";
import type { PriceBook } from "@/engine/types";
import { parsePriceBookCsv, type ParseError } from "@/engine/pricebook/parse";
import { getRepositories } from "@/lib/repo";

export interface PriceBookImportProps {
  /** Called after the parsed price book has been saved. */
  onImported?: (priceBook: PriceBook) => void;
}

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `pb-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function PriceBookImport({ onImported }: PriceBookImportProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<ParseError[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [status, setStatus] = useState<string>("");
  const [busy, setBusy] = useState(false);

  async function handleFile(file: File) {
    setBusy(true);
    setErrors([]);
    setWarnings([]);
    setStatus("");
    try {
      const text = await file.text();
      const result = parsePriceBookCsv(text, {
        id: newId(),
        name: file.name.replace(/\.csv$/i, ""),
        fileName: file.name,
        now: new Date().toISOString(),
      });
      setWarnings(result.warnings);
      if (!result.priceBook) {
        setErrors(result.errors.length ? result.errors : [{ line: 1, message: "Could not read this file as a price book." }]);
        return;
      }
      await getRepositories().priceBooks.save(result.priceBook);
      setStatus(`Imported ${result.priceBook.items.length} items from ${file.name}.`);
      onImported?.(result.priceBook);
    } catch (err) {
      setErrors([{ line: 0, message: err instanceof Error ? err.message : "Import failed." }]);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-2 text-sm">
      <label className="flex flex-col gap-1">
        <span className="font-medium">Import price book CSV</span>
        <input
          ref={inputRef}
          data-testid="pricebook-file"
          type="file"
          accept=".csv,text/csv"
          disabled={busy}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void handleFile(f);
          }}
          className="block w-full text-sm text-zinc-700 file:mr-3 file:rounded file:border-0 file:bg-zinc-900 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white hover:file:bg-zinc-700 disabled:opacity-50"
        />
      </label>
      <p className="text-xs text-zinc-500">
        Columns: <code>sku, description, category, unit, unit_price, taxable, roll_length_ft, style, role</code>. Bind an item to a
        style with the <code>style</code> + <code>role</code> columns; repeat a sku on extra rows to bind it to more than one style.
      </p>
      {status ? (
        <p className="rounded bg-emerald-50 px-2 py-1 text-emerald-800" data-testid="pricebook-imported">
          {status}
        </p>
      ) : null}
      {errors.length > 0 ? (
        <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-red-800" data-testid="pricebook-error" role="alert">
          <p className="font-medium">Nothing was imported. Fix these rows and try again:</p>
          <ul className="mt-1 list-disc space-y-0.5 pl-5">
            {errors.map((e, i) => (
              <li key={i} data-testid="pricebook-error-line">
                {e.line > 0 ? <span className="font-mono text-xs">line {e.line}: </span> : null}
                {e.message}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {warnings.length > 0 ? (
        <ul className="list-disc rounded bg-amber-50 py-1 pl-6 pr-2 text-amber-900" data-testid="pricebook-warning">
          {warnings.map((w, i) => (
            <li key={i}>{w}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
