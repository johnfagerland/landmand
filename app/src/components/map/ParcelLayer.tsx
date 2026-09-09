"use client";
/** Parcel fill + outline, and dashed outlines for the other candidates while several are offered. */
import type { GeoJSONSource } from "maplibre-gl";
import { useEffect } from "react";
import type { Feature, FeatureCollection, Polygon } from "geojson";
import type { LonLat } from "@/engine/types";
import { useQuoteStore } from "@/lib/store/quoteStore";
import { useMap } from "./MapView";

const SRC_PARCEL = "parcel";
const SRC_CANDIDATES = "parcel-candidates";
const LAYERS = ["parcel-fill", "parcel-line", "candidate-fill", "candidate-line"] as const;

function ringToPolygon(ring: LonLat[], holes: LonLat[][], props: Record<string, unknown>): Feature<Polygon> | null {
  if (ring.length < 3) return null;
  const close = (r: LonLat[]) => [...r, r[0]];
  return {
    type: "Feature",
    properties: props,
    geometry: { type: "Polygon", coordinates: [close(ring), ...holes.filter((h) => h.length >= 3).map(close)] },
  };
}

function empty(): FeatureCollection {
  return { type: "FeatureCollection", features: [] };
}

export default function ParcelLayer() {
  const map = useMap();
  const parcel = useQuoteStore((s) => s.quote?.parcel ?? null);
  const candidates = useQuoteStore((s) => s.candidates);

  useEffect(() => {
    if (!map) return;
    if (!map.getSource(SRC_PARCEL)) map.addSource(SRC_PARCEL, { type: "geojson", data: empty() });
    if (!map.getSource(SRC_CANDIDATES)) map.addSource(SRC_CANDIDATES, { type: "geojson", data: empty() });
    if (!map.getLayer("candidate-fill")) {
      map.addLayer({
        id: "candidate-fill",
        type: "fill",
        source: SRC_CANDIDATES,
        paint: { "fill-color": "#38bdf8", "fill-opacity": 0.08 },
      });
    }
    if (!map.getLayer("candidate-line")) {
      map.addLayer({
        id: "candidate-line",
        type: "line",
        source: SRC_CANDIDATES,
        paint: { "line-color": "#38bdf8", "line-width": 2, "line-dasharray": [2, 2] },
      });
    }
    if (!map.getLayer("parcel-fill")) {
      map.addLayer({
        id: "parcel-fill",
        type: "fill",
        source: SRC_PARCEL,
        paint: { "fill-color": "#facc15", "fill-opacity": 0.1 },
      });
    }
    if (!map.getLayer("parcel-line")) {
      map.addLayer({
        id: "parcel-line",
        type: "line",
        source: SRC_PARCEL,
        paint: { "line-color": "#facc15", "line-width": 2.5, "line-dasharray": [3, 1.5] },
      });
    }
    return () => {
      try {
        if (!map.getStyle()) return;
        for (const id of LAYERS) if (map.getLayer(id)) map.removeLayer(id);
        if (map.getSource(SRC_PARCEL)) map.removeSource(SRC_PARCEL);
        if (map.getSource(SRC_CANDIDATES)) map.removeSource(SRC_CANDIDATES);
      } catch {
        /* map already removed */
      }
    };
  }, [map]);

  useEffect(() => {
    if (!map) return;
    const parcelSrc = map.getSource<GeoJSONSource>(SRC_PARCEL);
    const candSrc = map.getSource<GeoJSONSource>(SRC_CANDIDATES);
    if (!parcelSrc || !candSrc) return;
    const parcelFc = empty();
    if (parcel) {
      const f = ringToPolygon(parcel.ring, parcel.holes ?? [], { id: parcel.id, apn: parcel.apn ?? "" });
      if (f) parcelFc.features.push(f);
    }
    const candFc = empty();
    candidates.forEach((c, i) => {
      if (parcel && c.parcel.id === parcel.id) return;
      const f = ringToPolygon(c.parcel.ring, [], { index: i, apn: c.parcel.apn ?? "" });
      if (f) candFc.features.push(f);
    });
    void parcelSrc.setData(parcelFc);
    void candSrc.setData(candFc);
  }, [map, parcel, candidates]);

  return null;
}
