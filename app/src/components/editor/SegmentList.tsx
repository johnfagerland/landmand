"use client";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useQuoteStore } from "@/lib/store/quoteStore";
import { formatFt, selectSegmentRows } from "@/lib/store/selectors";

export default function SegmentList() {
  const rows = useQuoteStore(selectSegmentRows);
  const closed = useQuoteStore((s) => s.quote?.fence.closed ?? true);
  const hasFence = useQuoteStore((s) => (s.quote?.fence.vertices.length ?? 0) > 0);
  const engineStatus = useQuoteStore((s) => s.engineStatus);
  const addGate = useQuoteStore((s) => s.addGate);
  const openLoopAt = useQuoteStore((s) => s.openLoopAt);

  return (
    <section className="flex flex-col gap-2" aria-label="Fence sides">
      <div className="flex items-baseline justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Sides</h2>
        <span className="text-xs text-zinc-500" data-testid="segment-count">
          {rows.length} {rows.length === 1 ? "side" : "sides"}
        </span>
      </div>
      {rows.length === 0 ? (
        <p className="text-xs text-zinc-500">
          {!hasFence
            ? "No fence yet. Use the parcel edge or draw one on the map."
            : engineStatus !== "ok"
              ? "Measurement engine unavailable; lengths will appear once it is."
              : "Add at least two points."}
        </p>
      ) : (
        <ol className="divide-y divide-zinc-200 rounded-md border border-zinc-200 bg-white">
          {rows.map((row) => (
            <li
              key={`${row.index}-${row.key}`}
              data-testid="segment-row"
              data-segment-index={row.index}
              className="flex flex-col gap-1 px-2 py-1.5 text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="w-12 font-medium text-zinc-700">Side {row.index + 1}</span>
                <span className="tabular-nums text-zinc-900" data-testid="segment-flat" title="Flat length">
                  {formatFt(row.flatFt)}
                </span>
                <span className="text-zinc-400">→</span>
                <span className="tabular-nums text-zinc-700" data-testid="segment-corrected" title="Slope-corrected">
                  {row.correctedFt === null ? "—" : formatFt(row.correctedFt)}
                </span>
                {row.isCorner ? <Badge tone="warning">corner</Badge> : null}
                {row.startPost === "end" || row.endPost === "end" ? <Badge tone="neutral">end</Badge> : null}
                {row.gates.length > 0 ? <Badge tone="info">{row.gates.length} gate{row.gates.length > 1 ? "s" : ""}</Badge> : null}
                {row.slopeFactor !== null && row.slopeFactor > 1.0005 ? (
                  <Badge tone="neutral" title="Slope factor">
                    ×{row.slopeFactor.toFixed(3)}
                  </Badge>
                ) : null}
              </div>
              {row.warnings.length > 0 ? (
                <p className="text-[11px] text-amber-700">{row.warnings.join(" ")}</p>
              ) : null}
              <div className="flex gap-1.5">
                <Button size="sm" data-testid={`segment-${row.index}-add-gate`} onClick={() => addGate(row.index)}>
                  Add gate
                </Button>
                {closed ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    data-testid={`segment-${row.index}-remove`}
                    title="Open the loop here: the fence stops on either side of this run"
                    onClick={() => openLoopAt(row.index)}
                  >
                    Remove this run
                  </Button>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
