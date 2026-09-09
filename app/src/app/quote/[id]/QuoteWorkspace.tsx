"use client";
/**
 * Two-pane quote editor: map on the left, panels on the right. The take-off panel (owned by another
 * module) mounts into <div data-testid="takeoff-slot" /> in wave 2.
 */
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect } from "react";
import GatePanel from "@/components/editor/GatePanel";
import SegmentList from "@/components/editor/SegmentList";
import SetbackControl from "@/components/editor/SetbackControl";
import Toolbar from "@/components/editor/Toolbar";
import ParcelPicker from "@/components/quote/ParcelPicker";
import ProposalButton from "@/components/quote/ProposalButton";
import QuoteSummary from "@/components/quote/QuoteSummary";
import { Button } from "@/components/ui/Button";
import { useQuoteStore } from "@/lib/store/quoteStore";

const MapPane = dynamic(() => import("@/components/map/MapPane"), {
  ssr: false,
  loading: () => <div className="flex h-full w-full items-center justify-center bg-zinc-800 text-sm text-zinc-300">Loading map…</div>,
});

function Notice() {
  const notice = useQuoteStore((s) => s.notice);
  const setNotice = useQuoteStore((s) => s.setNotice);
  if (!notice) return null;
  return (
    <div
      role={notice.kind === "error" ? "alert" : "status"}
      data-testid="notice"
      className={
        "flex items-start gap-2 rounded-md border px-2 py-1.5 text-xs " +
        (notice.kind === "error" ? "border-red-200 bg-red-50 text-red-800" : "border-sky-200 bg-sky-50 text-sky-800")
      }
    >
      <span className="flex-1">{notice.text}</span>
      <button type="button" className="text-zinc-500 hover:text-zinc-800" aria-label="Dismiss" onClick={() => setNotice(null)}>
        ×
      </button>
    </div>
  );
}

export default function QuoteWorkspace({ id }: { id: string }) {
  const loadStatus = useQuoteStore((s) => s.loadStatus);
  const loadError = useQuoteStore((s) => s.loadError);
  const loadQuote = useQuoteStore((s) => s.loadQuote);
  const quoteId = useQuoteStore((s) => s.quote?.id ?? null);

  useEffect(() => {
    void loadQuote(id);
  }, [id, loadQuote]);

  const ready = loadStatus === "ready" && quoteId === id;

  return (
    <div className="flex h-[calc(100dvh-41px)] min-h-0 w-full" data-testid="quote-workspace" data-quote-id={id}>
      <div className="relative min-w-0 flex-1">
        <MapPane />
      </div>
      <aside className="flex w-96 shrink-0 flex-col gap-5 overflow-y-auto border-l border-zinc-200 bg-zinc-50 p-3" data-testid="quote-panel">
        {loadStatus === "missing" ? (
          <div className="flex flex-col gap-2 text-sm">
            <p className="font-medium">Quote not found.</p>
            <p className="text-zinc-600">It may have been deleted or saved in another browser.</p>
            <Link href="/">
              <Button variant="primary">Start a new quote</Button>
            </Link>
          </div>
        ) : loadStatus === "error" && !ready ? (
          <div className="flex flex-col gap-2 text-sm">
            <p className="font-medium">Could not open this quote.</p>
            <p className="text-zinc-600">{loadError ?? "Storage is unavailable."}</p>
            <Link href="/">
              <Button variant="primary">Start a new quote</Button>
            </Link>
          </div>
        ) : (
          <>
            <QuoteSummary />
            <Notice />
            <ParcelPicker />
            <Toolbar />
            <SetbackControl />
            <SegmentList />
            <GatePanel />
            <div data-testid="takeoff-slot" className="flex flex-col gap-3" />
            <ProposalButton />
          </>
        )}
      </aside>
    </div>
  );
}
