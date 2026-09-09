"use client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type { GateKind } from "@/engine/types";
import { useQuoteStore } from "@/lib/store/quoteStore";
import { selectGates, selectPlacements } from "@/lib/store/selectors";

const KIND_OPTIONS = [
  { value: "single", label: "Single" },
  { value: "double", label: "Double" },
];

export default function GatePanel() {
  const gates = useQuoteStore(selectGates);
  const placements = useQuoteStore(selectPlacements);
  const updateGate = useQuoteStore((s) => s.updateGate);
  const removeGate = useQuoteStore((s) => s.removeGate);

  return (
    <section className="flex flex-col gap-2" aria-label="Gates">
      <div className="flex items-baseline justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Gates</h2>
        <span className="text-xs text-zinc-500">
          <span data-testid="gate-count">{gates.length}</span> {gates.length === 1 ? "gate" : "gates"}
        </span>
      </div>
      {gates.length === 0 ? (
        <p className="text-xs text-zinc-500">No gates. Use “Add gate” on a side, then drag the marker along the fence.</p>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {gates.map((gate, i) => {
            const placement = placements.find((p) => p.gate.id === gate.id);
            return (
              <li
                key={gate.id}
                data-testid="gate-row"
                className="flex flex-col gap-1 rounded-md border border-zinc-200 bg-white px-2 py-1.5 text-xs"
              >
                <div className="flex items-end gap-1.5">
                  <span className="w-14 pb-1.5 font-medium text-zinc-700">Gate {i + 1}</span>
                  <Input
                    label="Width (ft)"
                    type="number"
                    min={3}
                    max={16}
                    step={1}
                    inputMode="numeric"
                    value={gate.widthFt}
                    data-testid="gate-width"
                    className="w-16"
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      if (Number.isFinite(v)) updateGate(gate.id, { widthFt: v });
                    }}
                  />
                  <Select
                    label="Type"
                    value={gate.kind}
                    options={KIND_OPTIONS}
                    data-testid="gate-kind"
                    onChange={(e) => updateGate(gate.id, { kind: e.target.value as GateKind })}
                  />
                  <Button size="sm" variant="danger" data-testid="gate-remove" onClick={() => removeGate(gate.id)}>
                    Remove
                  </Button>
                </div>
                <div className="text-[11px] text-zinc-500">
                  {placement
                    ? `Side ${placement.segmentIndex + 1}, ${placement.centerStationFt.toFixed(1)} ft from its start`
                    : "Not yet placed on a side"}
                  {placement?.warnings.length ? (
                    <span className="ml-1 text-amber-700">{placement.warnings.join(" ")}</span>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
