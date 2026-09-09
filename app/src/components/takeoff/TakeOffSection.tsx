"use client";
/**
 * Glue between the quote store and TakeOffPanel: loads the firm settings and the price book
 * (the quote's own price book if it still exists, else the most recently imported one),
 * renders the panel, and writes the computed take-off and style choice back into the store.
 */
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { FirmSettings, PriceBook, TakeOff } from "@/engine/types";
import { getRepositories } from "@/lib/repo";
import { DEFAULT_FIRM_SETTINGS } from "@/lib/repo/types";
import { useQuoteStore } from "@/lib/store/quoteStore";
import { TakeOffPanel } from "./TakeOffPanel";

type BookState = { status: "loading" } | { status: "ready"; priceBook: PriceBook | null };

export default function TakeOffSection() {
  const quote = useQuoteStore((s) => s.quote);
  const plane = useQuoteStore((s) => s.plane);
  const setTakeoff = useQuoteStore((s) => s.setTakeoff);
  const setStyle = useQuoteStore((s) => s.setStyle);
  const preferredBookId = quote?.priceBookId;

  const [firm, setFirm] = useState<FirmSettings>(DEFAULT_FIRM_SETTINGS);
  const [book, setBook] = useState<BookState>({ status: "loading" });

  // Load on mount and whenever the tab regains focus, so a price book imported in Settings is picked up.
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const repos = getRepositories();
        const [firmSettings, books] = await Promise.all([repos.firm.get(), repos.priceBooks.list()]);
        const chosenId = books.some((b) => b.id === preferredBookId) ? preferredBookId : books[0]?.id;
        const priceBook = chosenId ? await repos.priceBooks.get(chosenId) : null;
        if (cancelled) return;
        setFirm(firmSettings);
        setBook({ status: "ready", priceBook });
      } catch (err) {
        console.warn("[TakeOffSection] could not load settings", err);
        if (!cancelled) setBook({ status: "ready", priceBook: null });
      }
    };
    void load();
    const onFocus = () => {
      void load();
    };
    window.addEventListener("focus", onFocus);
    return () => {
      cancelled = true;
      window.removeEventListener("focus", onFocus);
    };
  }, [preferredBookId]);

  const priceBook = book.status === "ready" ? book.priceBook : null;

  const onTakeOff = useCallback(
    (takeoff: TakeOff | null) => setTakeoff(takeoff ?? undefined, priceBook?.id),
    [setTakeoff, priceBook?.id],
  );

  if (!quote) return null;

  if (!plane) {
    return (
      <p className="text-sm text-zinc-600" data-testid="takeoff-no-plane">
        Locate the lot to price a fence.
      </p>
    );
  }

  if (book.status === "loading") {
    return (
      <p className="text-sm text-zinc-500" data-testid="takeoff-loading">
        Loading price book…
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <TakeOffPanel
        fence={quote.fence}
        plane={plane}
        profiles={quote.profiles}
        priceBook={priceBook}
        firm={firm}
        onTakeOff={onTakeOff}
        onStyleChange={setStyle}
      />
      {priceBook ? (
        <p className="text-xs text-zinc-500">
          Priced from <span className="font-medium">{priceBook.name}</span>.{" "}
          <Link href="/settings" className="underline">
            Change price book
          </Link>
        </p>
      ) : null}
    </div>
  );
}
