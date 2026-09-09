"use client";
import { Button } from "@/components/ui/Button";
import { useQuoteStore } from "@/lib/store/quoteStore";
import { selectCanRedo, selectCanUndo, selectHasFence } from "@/lib/store/selectors";

export default function Toolbar() {
  const hasParcel = useQuoteStore((s) => !!s.quote?.parcel);
  const hasFence = useQuoteStore(selectHasFence);
  const mode = useQuoteStore((s) => s.editorMode);
  const canUndo = useQuoteStore(selectCanUndo);
  const canRedo = useQuoteStore(selectCanRedo);
  const useParcelEdge = useQuoteStore((s) => s.useParcelEdge);
  const startDraw = useQuoteStore((s) => s.startDraw);
  const setEditorMode = useQuoteStore((s) => s.setEditorMode);
  const undo = useQuoteStore((s) => s.undo);
  const redo = useQuoteStore((s) => s.redo);
  const clearFence = useQuoteStore((s) => s.clearFence);

  return (
    <section className="flex flex-col gap-2" aria-label="Fence tools">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Fence line</h2>
      <div className="flex flex-wrap gap-1.5">
        <Button
          variant="primary"
          size="sm"
          data-testid="use-parcel-edge"
          disabled={!hasParcel}
          title={hasParcel ? "Start from the lot lines" : "Select a parcel first"}
          onClick={useParcelEdge}
        >
          Use parcel edge
        </Button>
        <Button size="sm" data-testid="draw-perimeter" active={mode === "polygon"} onClick={() => startDraw("polygon")}>
          Draw perimeter
        </Button>
        <Button size="sm" data-testid="draw-run" active={mode === "linestring"} onClick={() => startDraw("linestring")}>
          Draw run
        </Button>
        <Button size="sm" data-testid="select-edit" active={mode === "select"} onClick={() => setEditorMode("select")}>
          Select / edit
        </Button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        <Button size="sm" data-testid="undo" disabled={!canUndo} onClick={undo} title="Undo (fence, gates, setbacks)">
          Undo
        </Button>
        <Button size="sm" data-testid="redo" disabled={!canRedo} onClick={redo}>
          Redo
        </Button>
        <Button size="sm" variant="danger" data-testid="clear-fence" disabled={!hasFence} onClick={clearFence}>
          Clear
        </Button>
      </div>
    </section>
  );
}
