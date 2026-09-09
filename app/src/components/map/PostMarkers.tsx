"use client";
/**
 * Post dots along the fence. Uses engine layoutPosts when the fence style has a built-in rule
 * (DEFAULT_STYLE_RULES); otherwise falls back to the summary's vertex posts. Skips quietly when the
 * engine is unavailable.
 */
import type { GeoJSONSource } from "maplibre-gl";
import { useEffect, useMemo } from "react";
import type { FeatureCollection, Point } from "geojson";
import { DEFAULT_STYLE_RULES, layoutPosts } from "@/engine";
import type { Post } from "@/engine/types";
import { tryEngine, useQuoteStore } from "@/lib/store/quoteStore";
import { useMap } from "./MapView";

const SRC = "fence-posts";
const LAYER = "fence-posts";

export default function PostMarkers() {
  const map = useMap();
  const fence = useQuoteStore((s) => s.quote?.fence ?? null);
  const summary = useQuoteStore((s) => s.summary);
  const plane = useQuoteStore((s) => s.plane);

  const posts: Post[] = useMemo(() => {
    if (!fence || !summary || !plane) return [];
    const rule = DEFAULT_STYLE_RULES.find((r) => r.id === fence.styleId);
    if (rule) {
      const laid = tryEngine(
        () => layoutPosts(fence, summary.segments, summary.placements, summary.slopeFactorBySegment, rule, plane),
        null,
      );
      if (laid) return laid;
    }
    return summary.vertexPosts ?? [];
  }, [fence, summary, plane]);

  useEffect(() => {
    if (!map) return;
    if (!map.getSource(SRC)) {
      map.addSource(SRC, { type: "geojson", data: { type: "FeatureCollection", features: [] } });
    }
    if (!map.getLayer(LAYER)) {
      map.addLayer({
        id: LAYER,
        type: "circle",
        source: SRC,
        paint: {
          "circle-radius": ["match", ["get", "kind"], "line", 2.5, 4],
          "circle-color": [
            "match",
            ["get", "kind"],
            "corner",
            "#f59e0b",
            "end",
            "#f59e0b",
            "gate",
            "#f97316",
            "#ffffff",
          ],
          "circle-opacity": 0.9,
          "circle-stroke-color": "#065f46",
          "circle-stroke-width": 1,
        },
      });
    }
    return () => {
      try {
        if (!map.getStyle()) return;
        if (map.getLayer(LAYER)) map.removeLayer(LAYER);
        if (map.getSource(SRC)) map.removeSource(SRC);
      } catch {
        /* map already removed */
      }
    };
  }, [map]);

  useEffect(() => {
    if (!map) return;
    const src = map.getSource<GeoJSONSource>(SRC);
    if (!src) return;
    const fc: FeatureCollection<Point> = {
      type: "FeatureCollection",
      features: posts.map((p) => ({
        type: "Feature",
        properties: { kind: p.kind, segment: p.segmentIndex, station: p.stationFt },
        geometry: { type: "Point", coordinates: p.lonLat },
      })),
    };
    void src.setData(fc);
  }, [map, posts]);

  return null;
}
