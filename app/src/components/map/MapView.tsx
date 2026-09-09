"use client";
/**
 * MapLibre map created once per mount (StrictMode-safe: the cleanup removes the map so the second
 * mount builds a fresh one), exposed to children through context once the style has loaded.
 * Load this component with next/dynamic({ ssr: false }); maplibre-gl touches window at import time.
 */
import { Map as MapLibreMap, NavigationControl, ScaleControl } from "maplibre-gl";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { BASEMAP } from "@/lib/config";
import type { LonLat } from "@/engine/types";
import { buildBasemapStyle } from "./basemap";
import { prepareMapLibreWorker } from "./workerUrl";

const MapContext = createContext<MapLibreMap | null>(null);

/** The loaded map, or null until the style has loaded / after unmount. */
export function useMap(): MapLibreMap | null {
  return useContext(MapContext);
}

export interface MapViewProps {
  center?: LonLat;
  zoom?: number;
  className?: string;
  children?: ReactNode;
}

interface CreateMapArgs {
  container: HTMLDivElement;
  center?: LonLat;
  zoom: number;
  /** Called once the style JSON is parsed (sources and layers can be added from then on). */
  onReady: (map: MapLibreMap) => void;
}

function createMap({ container, center, zoom, onReady }: CreateMapArgs): MapLibreMap {
  const m = new MapLibreMap({
    container,
    style: buildBasemapStyle(BASEMAP),
    center: center ?? [-98.5, 39.8],
    zoom: center ? zoom : 3,
    minZoom: 3,
    maxZoom: 21,
    attributionControl: { compact: false },
    dragRotate: false,
    pitchWithRotate: false,
    touchPitch: false,
  });
  m.touchZoomRotate.disableRotation();
  m.addControl(new NavigationControl({ showCompass: false }), "top-left");
  m.addControl(new ScaleControl({ unit: "imperial", maxWidth: 120 }), "bottom-left");
  m.on("error", (e) => {
    // Tile errors are expected offline; keep the console readable but visible in dev.
    if (process.env.NODE_ENV !== "production") console.warn("[map]", e.error?.message ?? e);
  });
  // Waiting for "load" would also wait for the first NAIP tiles (~0.6 s each, and hanging when offline).
  if (m.isStyleLoaded()) onReady(m);
  else m.once("style.load", () => onReady(m));
  if (process.env.NODE_ENV !== "production") (window as unknown as { __map?: MapLibreMap }).__map = m;
  return m;
}

export default function MapView({ center, zoom = 17, className = "", children }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const initialRef = useRef({ center, zoom });
  const [map, setMap] = useState<MapLibreMap | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || mapRef.current) return;
    let cancelled = false;
    let created: MapLibreMap | null = null;
    void prepareMapLibreWorker().then(() => {
      if (cancelled || mapRef.current) return;
      try {
        created = createMap({
          container,
          center: initialRef.current.center,
          zoom: initialRef.current.zoom,
          onReady: (m) => {
            if (mapRef.current === m) setMap(m);
          },
        });
        mapRef.current = created;
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      }
    });
    return () => {
      cancelled = true;
      const m = created;
      if (m && mapRef.current === m) {
        mapRef.current = null;
        setMap(null);
        try {
          m.remove();
        } catch {
          /* already gone */
        }
      }
    };
  }, []);

  return (
    <div className={`relative h-full w-full ${className}`}>
      {/* maplibre-gl.css (unlayered) sets .maplibregl-map { position: relative }, which beats Tailwind's layered
          utilities, so size the container with height/width rather than absolute positioning. */}
      <div
        ref={containerRef}
        data-testid="map-canvas"
        data-basemap={BASEMAP}
        className="h-full w-full bg-zinc-800"
        style={{ height: "100%", width: "100%" }}
      />
      {error ? (
        <div className="absolute inset-x-0 top-0 z-10 bg-red-50 px-3 py-2 text-xs text-red-800">
          Map could not start: {error}
        </div>
      ) : null}
      <MapContext.Provider value={map}>{map ? children : null}</MapContext.Provider>
    </div>
  );
}
