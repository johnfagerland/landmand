"use client";
/**
 * POSTs { quote, takeoff, firm } to /api/proposal and saves the returned PDF.
 * The route handler and the take-off itself come from other modules; this button only wires them.
 */
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import type { FirmSettings, TakeOff } from "@/engine/types";
import { ApiError, requestProposal } from "@/lib/api/client";
import { getRepositories } from "@/lib/repo";
import { DEFAULT_FIRM_SETTINGS } from "@/lib/repo/types";
import { useQuoteStore } from "@/lib/store/quoteStore";

export interface ProposalButtonProps {
  /** Defaults to the take-off stored on the quote (store.setTakeoff). */
  takeoff?: TakeOff;
  /** Defaults to getRepositories().firm.get(), falling back to DEFAULT_FIRM_SETTINGS. */
  firm?: FirmSettings;
  className?: string;
}

export default function ProposalButton({ takeoff, firm, className = "" }: ProposalButtonProps) {
  const quote = useQuoteStore((s) => s.quote);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadedFirm, setLoadedFirm] = useState<FirmSettings | null>(null);

  useEffect(() => {
    if (firm) return;
    let cancelled = false;
    (async () => {
      try {
        const f = await getRepositories().firm.get();
        if (!cancelled) setLoadedFirm(f);
      } catch {
        if (!cancelled) setLoadedFirm(DEFAULT_FIRM_SETTINGS);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [firm]);

  const effectiveTakeoff = takeoff ?? quote?.takeoff;
  const effectiveFirm = firm ?? loadedFirm ?? DEFAULT_FIRM_SETTINGS;
  const ready = !!quote && !!effectiveTakeoff;

  async function onClick() {
    if (!quote || !effectiveTakeoff) return;
    setBusy(true);
    setError(null);
    try {
      const blob = await requestProposal({ quote, takeoff: effectiveTakeoff, firm: effectiveFirm });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `proposal-${quote.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't build the proposal PDF. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <Button
        variant="primary"
        data-testid="download-proposal"
        disabled={!ready || busy}
        title={ready ? "Download the proposal PDF" : "Pick a fence style with a complete price book first"}
        onClick={onClick}
      >
        {busy ? "Building PDF…" : "Download proposal PDF"}
      </Button>
      {error ? (
        <p className="text-xs text-red-700" role="alert" data-testid="proposal-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
