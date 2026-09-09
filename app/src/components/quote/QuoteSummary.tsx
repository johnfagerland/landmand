"use client";
/** Headline numbers for the quote page: lot-line source, perimeter, fence lengths, gates, slope status. */
import { Badge } from "@/components/ui/Badge";
import { useQuoteStore } from "@/lib/store/quoteStore";
import {
  formatFt,
  selectCorrectedLengthFt,
  selectFlatLengthFt,
  selectGateCount,
  selectStatusText,
} from "@/lib/store/selectors";

export default function QuoteSummary() {
  const address = useQuoteStore((s) => s.quote?.address ?? null);
  const statusText = useQuoteStore(selectStatusText);
  const perimeter = useQuoteStore((s) => s.parcelPerimeterFt);
  const flat = useQuoteStore(selectFlatLengthFt);
  const corrected = useQuoteStore(selectCorrectedLengthFt);
  const gates = useQuoteStore(selectGateCount);
  const slope = useQuoteStore((s) => s.slopeStatus);
  const engineStatus = useQuoteStore((s) => s.engineStatus);
  const engineError = useQuoteStore((s) => s.engineError);
  const persist = useQuoteStore((s) => s.persistStatus);

  return (
    <section className="flex flex-col gap-2" aria-label="Summary">
      <div>
        <h1 className="text-base font-semibold leading-tight" data-testid="quote-address">
          {address ? address.line1 : "Loading quote…"}
        </h1>
        {address ? (
          <p className="text-xs text-zinc-500">
            {[address.city, address.state, address.zip].filter(Boolean).join(", ")}
          </p>
        ) : null}
      </div>
      <p className="text-xs text-zinc-600" data-testid="parcel-status">
        {statusText}
      </p>
      {engineStatus !== "ok" ? (
        <p
          className="rounded border border-amber-200 bg-amber-50 px-2 py-1 text-[11px] text-amber-900"
          data-testid="engine-status"
          title={engineError}
        >
          Measurement engine {engineStatus === "unavailable" ? "unavailable" : "error"} — lengths and posts will appear
          when it is ready.
        </p>
      ) : null}
      <dl className="grid grid-cols-2 gap-x-3 gap-y-1 rounded-md border border-zinc-200 bg-white p-2 text-xs">
        <dt className="text-zinc-500">Lot perimeter</dt>
        <dd className="text-right tabular-nums" data-testid="parcel-perimeter">
          {formatFt(perimeter)}
        </dd>
        <dt className="text-zinc-500">Fence, flat</dt>
        <dd className="text-right tabular-nums font-medium" data-testid="fence-length-flat">
          {formatFt(flat)}
        </dd>
        <dt className="text-zinc-500">Fence, slope-corrected</dt>
        <dd className="text-right tabular-nums" data-testid="fence-length-corrected">
          {formatFt(corrected)}
        </dd>
        <dt className="text-zinc-500">Gates</dt>
        <dd className="text-right tabular-nums" data-testid="gate-count">
          {gates}
        </dd>
        <dt className="text-zinc-500">Slope</dt>
        <dd className="text-right">
          <Badge tone={slope === "applied" ? "success" : slope === "pending" ? "neutral" : "warning"} data-testid="slope-status">
            {slope}
          </Badge>
        </dd>
      </dl>
      <p className="text-[11px] text-zinc-400" data-testid="persist-status">
        {persist === "saved" ? "Saved" : persist === "saving" ? "Saving…" : persist === "error" ? "Not saved (storage unavailable)" : ""}
      </p>
    </section>
  );
}
