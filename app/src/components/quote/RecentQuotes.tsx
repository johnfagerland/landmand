"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import type { QuoteSummary } from "@/engine/quote/quote";
import { getRepositories } from "@/lib/repo";

function fmtDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

interface Listing {
  quotes: QuoteSummary[];
  unavailable: boolean;
}

/** Reads the quote list; a not-yet-wired repository becomes an empty, "unavailable" listing. */
async function fetchListing(): Promise<Listing> {
  try {
    const list = await getRepositories().quotes.list();
    return { quotes: [...list].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1)), unavailable: false };
  } catch {
    return { quotes: [], unavailable: true };
  }
}

export default function RecentQuotes() {
  const [listing, setListing] = useState<Listing | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchListing().then((l) => {
      if (!cancelled) setListing(l);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  async function remove(id: string) {
    try {
      await getRepositories().quotes.remove(id);
    } catch {
      /* ignore */
    }
    setListing(await fetchListing());
  }

  const quotes = listing?.quotes ?? null;
  const unavailable = listing?.unavailable ?? false;

  return (
    <section className="flex flex-col gap-2" aria-label="Recent quotes">
      <h2 className="text-sm font-semibold text-zinc-700">Recent quotes</h2>
      {quotes === null ? (
        <p className="text-sm text-zinc-500">Loading…</p>
      ) : quotes.length === 0 ? (
        <p className="text-sm text-zinc-500" data-testid="recent-empty">
          {unavailable ? "Saved quotes are not available in this browser yet." : "No quotes yet. Start one above."}
        </p>
      ) : (
        <ul className="divide-y divide-zinc-200 rounded-md border border-zinc-200 bg-white" data-testid="recent-quotes">
          {quotes.map((q) => (
            <li key={q.id} className="flex items-center gap-3 px-3 py-2 text-sm" data-testid="recent-quote">
              <Link href={`/quote/${q.id}`} className="flex-1 truncate font-medium text-zinc-800 hover:underline">
                {q.addressLine || q.id}
              </Link>
              <span className="tabular-nums text-zinc-500">{q.lengthFt !== undefined ? `${q.lengthFt.toFixed(0)} ft` : ""}</span>
              <span className="text-zinc-400">{fmtDate(q.updatedAt)}</span>
              <Button size="sm" variant="ghost" onClick={() => void remove(q.id)} aria-label={`Delete quote ${q.addressLine}`}>
                ×
              </Button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
