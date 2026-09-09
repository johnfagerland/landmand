"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useQuoteStore } from "@/lib/store/quoteStore";
import { selectSegmentRows } from "@/lib/store/selectors";

export default function SetbackControl() {
  const closed = useQuoteStore((s) => s.quote?.fence.closed ?? false);
  const vertexCount = useQuoteStore((s) => s.quote?.fence.vertices.length ?? 0);
  const rows = useQuoteStore(selectSegmentRows);
  const applySetbackAll = useQuoteStore((s) => s.applySetbackAll);
  const applySetbackEdge = useQuoteStore((s) => s.applySetbackEdge);
  const [allFt, setAllFt] = useState("2");
  const [edgeFt, setEdgeFt] = useState("2");
  const [edge, setEdge] = useState("0");

  const enabled = closed && vertexCount >= 3;
  const allValue = Number(allFt);
  const edgeValue = Number(edgeFt);

  return (
    <section className="flex flex-col gap-2" aria-label="Setbacks">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Setback</h2>
      {!enabled ? (
        <p className="text-xs text-zinc-500">Setbacks apply to a closed perimeter.</p>
      ) : null}
      <div className="flex items-end gap-1.5">
        <Input
          label="All sides (ft)"
          type="number"
          min={0.5}
          step={0.5}
          inputMode="decimal"
          value={allFt}
          onChange={(e) => setAllFt(e.target.value)}
          data-testid="setback-all-ft"
          className="w-24"
          disabled={!enabled}
        />
        <Button
          size="md"
          data-testid="setback-all"
          disabled={!enabled || !(allValue > 0)}
          onClick={() => applySetbackAll(allValue)}
        >
          Setback all sides
        </Button>
      </div>
      <div className="flex items-end gap-1.5">
        <Select
          label="Side"
          value={edge}
          onChange={(e) => setEdge(e.target.value)}
          data-testid="setback-edge-index"
          disabled={!enabled || rows.length === 0}
          options={
            rows.length > 0
              ? rows.map((r) => ({ value: String(r.index), label: `Side ${r.index + 1} (${r.flatFt.toFixed(1)} ft)` }))
              : [{ value: "0", label: "—" }]
          }
        />
        <Input
          label="Move in (ft)"
          type="number"
          min={0.5}
          step={0.5}
          inputMode="decimal"
          value={edgeFt}
          onChange={(e) => setEdgeFt(e.target.value)}
          data-testid="setback-edge-ft"
          className="w-20"
          disabled={!enabled}
        />
        <Button
          size="md"
          data-testid="setback-edge"
          disabled={!enabled || !(edgeValue > 0) || rows.length === 0}
          onClick={() => applySetbackEdge(Number(edge), edgeValue)}
        >
          Move in
        </Button>
      </div>
    </section>
  );
}
