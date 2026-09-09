"use client";
/** Address input -> /api/geocode -> engine newQuote -> repository save -> /quote/<id>. */
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { GeocodeResult } from "@/adapters/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { newQuote } from "@/engine";
import type { Address, Quote } from "@/engine/types";
import { ApiError, geocode } from "@/lib/api/client";
import { newId } from "@/lib/store/ids";
import { emptyFenceSafe, tryEngine, useQuoteStore } from "@/lib/store/quoteStore";

function titleCase(s: string): string {
  return s.toLowerCase().replace(/\b[a-z]/g, (c) => c.toUpperCase());
}

export function quoteFromGeocode(result: GeocodeResult): Quote {
  const now = new Date().toISOString();
  const id = newId();
  const line1 = [result.number, titleCase(result.street)].filter(Boolean).join(" ").trim() || result.matched;
  const address: Address = {
    line1,
    city: titleCase(result.city ?? ""),
    state: result.state ?? "",
    zip: result.zip ?? "",
    matched: result.matched,
    countyFips: result.countyFips,
  };
  return tryEngine(
    () => newQuote({ id, now, address, geocode: result.lonLat }),
    {
      schemaVersion: 1,
      id,
      createdAt: now,
      updatedAt: now,
      address,
      geocode: result.lonLat,
      parcelStatus: "pending",
      fence: emptyFenceSafe(),
      profiles: {},
      customer: { name: "" },
      notes: "",
    },
  );
}

export default function AddressSearch({ autoFocus = true }: { autoFocus?: boolean }) {
  const router = useRouter();
  const beginQuote = useQuoteStore((s) => s.beginQuote);
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const q = value.trim();
    if (q.length < 5) {
      setError("Enter a street address, city and state.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const result = await geocode(q);
      if (!result) {
        setError("No match for that address. Try adding the city, state or ZIP.");
        return;
      }
      const quote = quoteFromGeocode(result);
      beginQuote(quote);
      router.push(`/quote/${quote.id}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't reach the address service, try again");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2" data-testid="address-form">
      <div className="flex gap-2">
        <Input
          data-testid="address-input"
          name="address"
          placeholder="1823 White Oak Rd, Raleigh, NC 27608"
          autoComplete="street-address"
          autoFocus={autoFocus}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={busy}
          aria-label="Job address"
        />
        <Button type="submit" variant="primary" data-testid="address-submit" disabled={busy}>
          {busy ? "Finding…" : "Start quote"}
        </Button>
      </div>
      {error ? (
        <p className="text-sm text-red-700" role="alert" data-testid="address-error">
          {error}
        </p>
      ) : null}
    </form>
  );
}
