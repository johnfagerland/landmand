"use client";
/** Draggable gate symbols at each gate anchor; a drop re-projects the anchor onto the nearest segment. */
import { Marker } from "maplibre-gl";
import { useEffect, useRef } from "react";
import { useQuoteStore } from "@/lib/store/quoteStore";
import { selectGates } from "@/lib/store/selectors";
import { useMap } from "./MapView";

function makeElement(): HTMLDivElement {
  const el = document.createElement("div");
  el.className =
    "cursor-grab select-none rounded-full border-2 border-white bg-orange-500 px-1.5 py-0.5 text-[10px] font-semibold " +
    "leading-none text-white shadow active:cursor-grabbing";
  el.setAttribute("data-testid", "gate-marker");
  return el;
}

export default function GateMarkers() {
  const map = useMap();
  const gates = useQuoteStore(selectGates);
  const markersRef = useRef<globalThis.Map<string, Marker>>(new globalThis.Map());

  useEffect(() => {
    if (!map) return;
    const markers = markersRef.current;
    const seen = new Set<string>();
    for (const gate of gates) {
      seen.add(gate.id);
      const existing = markers.get(gate.id);
      let marker: Marker;
      if (!existing) {
        const el = makeElement();
        const created = new Marker({ element: el, draggable: true, anchor: "center" })
          .setLngLat(gate.anchor)
          .addTo(map);
        const id = gate.id;
        created.on("dragend", () => {
          const ll = created.getLngLat();
          useQuoteStore.getState().moveGate(id, [ll.lng, ll.lat]);
        });
        markers.set(gate.id, created);
        marker = created;
      } else {
        marker = existing;
        const ll = marker.getLngLat();
        if (ll.lng !== gate.anchor[0] || ll.lat !== gate.anchor[1]) marker.setLngLat(gate.anchor);
      }
      const el = marker.getElement();
      const label = `${gate.kind === "double" ? "DG" : "G"} ${gate.widthFt} ft`;
      if (el.textContent !== label) el.textContent = label;
      el.title = `${gate.kind} gate, ${gate.widthFt} ft — drag to move`;
    }
    for (const [id, marker] of markers) {
      if (!seen.has(id)) {
        marker.remove();
        markers.delete(id);
      }
    }
  }, [map, gates]);

  useEffect(() => {
    const markers = markersRef.current;
    return () => {
      for (const marker of markers.values()) {
        try {
          marker.remove();
        } catch {
          /* map gone */
        }
      }
      markers.clear();
    };
  }, [map]);

  return null;
}
