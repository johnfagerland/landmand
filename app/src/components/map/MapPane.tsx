"use client";
/**
 * The full map stack for the quote page: basemap + parcel + fence editor + gates + posts, plus a
 * fit-to-parcel effect. Imported with next/dynamic({ ssr: false }) so maplibre/terra-draw never load
 * on the server.
 */
import { useEffect } from "react";
import { useQuoteStore } from "@/lib/store/quoteStore";
import { selectFitBounds } from "@/lib/store/selectors";
import FenceEditor from "./FenceEditor";
import GateMarkers from "./GateMarkers";
import MapView, { useMap } from "./MapView";
import ParcelLayer from "./ParcelLayer";
import PostMarkers from "./PostMarkers";

function FitToParcel() {
  const map = useMap();
  const bounds = useQuoteStore(selectFitBounds);
  const fitVersion = useQuoteStore((s) => s.fitVersion);
  useEffect(() => {
    if (!map || !bounds) return;
    try {
      map.fitBounds(bounds, { padding: 60, duration: 0, maxZoom: 20 });
    } catch (err) {
      console.warn("[map] fitBounds failed", err);
    }
    // Refit only when the store asks for it (parcel picked / candidates loaded), not on every bounds tweak.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, fitVersion]);
  return null;
}

function EditorHint() {
  const mode = useQuoteStore((s) => s.editorMode);
  const hasParcel = useQuoteStore((s) => !!s.quote?.parcel);
  const text =
    mode === "polygon"
      ? "Click to place corners, click the first point to close the perimeter. Esc cancels."
      : mode === "linestring"
        ? "Click to place points, double-click (or click the last point) to finish the run. Esc cancels."
        : hasParcel
          ? "Click the fence to edit: drag corners, drag midpoints to add corners, select a corner and press Delete to remove it."
          : "Use Draw perimeter or Draw run to start.";
  return (
    <div className="pointer-events-none absolute bottom-8 left-1/2 z-10 -translate-x-1/2 rounded bg-black/60 px-3 py-1 text-xs text-white">
      {text}
    </div>
  );
}

export default function MapPane() {
  const geocode = useQuoteStore((s) => s.quote?.geocode ?? null);
  return (
    <MapView center={geocode ?? undefined} zoom={18}>
      <ParcelLayer />
      <FenceEditor />
      <PostMarkers />
      <GateMarkers />
      <FitToParcel />
      <EditorHint />
    </MapView>
  );
}
