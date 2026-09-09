"use client";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useQuoteStore } from "@/lib/store/quoteStore";

function areaText(sqFt: number): string {
  if (!Number.isFinite(sqFt) || sqFt <= 0) return "";
  const acres = sqFt / 43560;
  return acres >= 0.1 ? `${acres.toFixed(2)} ac` : `${Math.round(sqFt).toLocaleString()} sq ft`;
}

export default function ParcelPicker() {
  const lookup = useQuoteStore((s) => s.parcelLookup);
  const message = useQuoteStore((s) => s.parcelMessage);
  const candidates = useQuoteStore((s) => s.candidates);
  const selected = useQuoteStore((s) => s.selectedCandidate);
  const parcel = useQuoteStore((s) => s.quote?.parcel ?? null);
  const parcelStatus = useQuoteStore((s) => s.quote?.parcelStatus ?? "pending");
  const selectCandidate = useQuoteStore((s) => s.selectCandidate);
  const retry = useQuoteStore((s) => s.lookupParcel);

  return (
    <section className="flex flex-col gap-2" aria-label="Lot lines">
      <div className="flex items-baseline justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Lot lines</h2>
        {lookup === "loading" ? <span className="text-xs text-zinc-500">Looking up…</span> : null}
      </div>

      {lookup === "loading" ? (
        <p className="text-xs text-zinc-600" data-testid="parcel-loading">
          Checking county parcel records for this address…
        </p>
      ) : null}

      {candidates.length > 0 ? (
        <ul className="flex flex-col gap-1" data-testid="parcel-candidates">
          {candidates.map((c, i) => {
            const isSelected = selected === i || (parcel !== null && parcel.id === c.parcel.id);
            return (
              <li key={c.parcel.id}>
                <button
                  type="button"
                  data-testid={`parcel-candidate-${i}`}
                  aria-pressed={isSelected}
                  onClick={() => selectCandidate(i)}
                  className={
                    "flex w-full flex-col gap-0.5 rounded-md border px-2 py-1.5 text-left text-xs transition-colors " +
                    (isSelected
                      ? "border-yellow-500 bg-yellow-50"
                      : "border-zinc-200 bg-white hover:border-sky-400 hover:bg-sky-50")
                  }
                >
                  <span className="flex items-center gap-2">
                    <span className="font-medium text-zinc-800">
                      {c.parcel.apn ? `Parcel ${c.parcel.apn}` : `Candidate ${i + 1}`}
                    </span>
                    <Badge tone={c.match === "address" ? "success" : c.match === "point" ? "info" : "neutral"}>
                      {c.match === "address" ? "address match" : c.match === "point" ? "contains point" : "nearby"}
                    </Badge>
                    {isSelected ? <Badge tone="warning">selected</Badge> : null}
                  </span>
                  <span className="text-zinc-600">
                    {[c.parcel.siteAddress, areaText(c.parcel.areaSqFt)].filter(Boolean).join(" · ")}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}

      {candidates.length > 1 && !parcel ? (
        <p className="text-xs text-zinc-600">
          {candidates.length} parcels match this address. Pick the one the fence belongs to.
        </p>
      ) : null}

      {lookup === "none" || (parcelStatus === "manual" && candidates.length === 0 && lookup !== "loading") ? (
        <div className="flex flex-col gap-2 rounded-md border border-amber-200 bg-amber-50 p-2 text-xs text-amber-900">
          <p data-testid="parcel-none">
            {message ??
              "We couldn't load lot lines here automatically — draw the fence on the imagery; the quote is just as accurate."}
          </p>
          <div>
            <Button size="sm" data-testid="parcel-retry" onClick={() => void retry()}>
              Retry lookup
            </Button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
