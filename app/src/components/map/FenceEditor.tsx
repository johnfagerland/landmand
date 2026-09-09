"use client";
/**
 * terra-draw fence editor: polygon mode (closed perimeter), linestring mode (open run) and a select
 * mode with draggable vertices, midpoints and deletable coordinates. Cursor snapping (`toCustom`)
 * targets the parcel ring only, via the engine's snap functions in the local plane.
 *
 * Sync contract with the store:
 *   terra-draw change  -> getSnapshot() -> store.setFence(source: "editor")   (debounced 50 ms)
 *   store geometryVersion bump          -> updateFeatureGeometry / addFeatures (origin "api" events are ignored)
 */
import { useEffect, useRef } from "react";
import type { LineString, Polygon, Position } from "geojson";
import {
  TerraDraw,
  TerraDrawLineStringMode,
  TerraDrawPolygonMode,
  TerraDrawSelectMode,
  type GeoJSONStoreFeatures,
  type SnapToCustom,
  type TerraDrawEventListeners,
} from "terra-draw";
import { TerraDrawMapLibreGLAdapter } from "terra-draw-maplibre-gl-adapter";
import { nearestPointOnRing, nearestVertex } from "@/engine";
import type { LonLat } from "@/engine/types";
import { newId } from "@/lib/store/ids";
import { tryEngine, useQuoteStore } from "@/lib/store/quoteStore";
import { useMap } from "./MapView";

type Snapping = NonNullable<NonNullable<ConstructorParameters<typeof TerraDrawPolygonMode>[0]>["snapping"]>;

const VERTEX_SNAP_PX = 12;
const EDGE_SNAP_PX = 8;
const CHANGE_DEBOUNCE_MS = 50;
const FENCE_MODES = new Set(["polygon", "linestring"]);
const FENCE_COLOR = "#10b981";

const snapToParcel: SnapToCustom = (event, context) => {
  const { quote, plane } = useQuoteStore.getState();
  const ring = quote?.parcel?.ring;
  if (!ring || !plane || ring.length < 3) return undefined;
  const p: LonLat = [event.lng, event.lat];
  // Feet per screen pixel at the cursor: unproject a point 10 px to the right and measure in the plane.
  const px = context.project(event.lng, event.lat);
  const q = context.unproject(px.x + 10, px.y);
  let ftPerPx = 0;
  try {
    const a = plane.toXY(p);
    const b = plane.toXY([q.lng, q.lat]);
    ftPerPx = Math.hypot(b.x - a.x, b.y - a.y) / 10;
  } catch {
    return undefined;
  }
  if (!(ftPerPx > 0)) return undefined;
  const v = tryEngine(() => nearestVertex(p, ring, plane), null);
  if (v && v.distanceFt <= VERTEX_SNAP_PX * ftPerPx) return v.lonLat as Position;
  const e = tryEngine(() => nearestPointOnRing(p, ring, true, plane), null);
  if (e && e.distanceFt <= EDGE_SNAP_PX * ftPerPx) return e.lonLat as Position;
  return undefined;
};

function isFenceFeature(f: GeoJSONStoreFeatures): f is GeoJSONStoreFeatures<Polygon | LineString> {
  const mode = f.properties?.mode;
  if (typeof mode !== "string" || !FENCE_MODES.has(mode)) return false;
  if (f.properties?.currentlyDrawing) return false;
  return f.geometry.type === "Polygon" || f.geometry.type === "LineString";
}

function featureVertices(f: GeoJSONStoreFeatures<Polygon | LineString>): { vertices: LonLat[]; closed: boolean } {
  if (f.geometry.type === "Polygon") {
    const ring = f.geometry.coordinates[0] ?? [];
    const open = ring.length > 1 && samePos(ring[0], ring[ring.length - 1]) ? ring.slice(0, -1) : ring;
    return { vertices: open.map(toLonLat), closed: true };
  }
  return { vertices: f.geometry.coordinates.map(toLonLat), closed: false };
}

function toLonLat(p: Position): LonLat {
  return [p[0], p[1]];
}
function samePos(a: Position, b: Position): boolean {
  return a[0] === b[0] && a[1] === b[1];
}
function sameVertices(a: LonLat[], b: LonLat[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (Math.abs(a[i][0] - b[i][0]) > 1e-7 || Math.abs(a[i][1] - b[i][1]) > 1e-7) return false;
  }
  return true;
}

function fenceGeometry(vertices: LonLat[], closed: boolean): Polygon | LineString {
  return closed
    ? { type: "Polygon", coordinates: [[...vertices, vertices[0]]] }
    : { type: "LineString", coordinates: vertices };
}

export default function FenceEditor() {
  const map = useMap();
  const drawRef = useRef<TerraDraw | null>(null);
  const fenceIdRef = useRef<string | number | null>(null);
  const geometryVersion = useQuoteStore((s) => s.geometryVersion);
  const editorMode = useQuoteStore((s) => s.editorMode);

  useEffect(() => {
    if (!map) return;
    const snapping: Snapping = { toCustom: snapToParcel };
    const coordinateFlags = {
      feature: {
        draggable: false,
        rotateable: false,
        scaleable: false,
        selfIntersectable: false,
        coordinates: { snappable: snapping, midpoints: true, draggable: true, deletable: true },
      },
    };
    let draw: TerraDraw;
    try {
      const adapter = new TerraDrawMapLibreGLAdapter({ map, coordinatePrecision: 7 });
      draw = new TerraDraw({
        adapter,
        modes: [
          new TerraDrawPolygonMode({
            snapping,
            pointerDistance: 20,
            styles: {
              fillColor: FENCE_COLOR,
              fillOpacity: 0.08,
              outlineColor: FENCE_COLOR,
              outlineWidth: 3,
              closingPointColor: "#ffffff",
              closingPointOutlineColor: FENCE_COLOR,
              closingPointWidth: 6,
            },
          }),
          new TerraDrawLineStringMode({
            snapping,
            pointerDistance: 20,
            styles: {
              lineStringColor: FENCE_COLOR,
              lineStringWidth: 3,
              closingPointColor: "#ffffff",
              closingPointOutlineColor: FENCE_COLOR,
              closingPointWidth: 6,
            },
          }),
          new TerraDrawSelectMode({
            pointerDistance: 24,
            flags: { polygon: coordinateFlags, linestring: coordinateFlags },
            styles: {
              selectedPolygonColor: FENCE_COLOR,
              selectedPolygonFillOpacity: 0.08,
              selectedPolygonOutlineColor: FENCE_COLOR,
              selectedPolygonOutlineWidth: 3,
              selectedLineStringColor: FENCE_COLOR,
              selectedLineStringWidth: 3,
              selectionPointColor: "#ffffff",
              selectionPointOutlineColor: FENCE_COLOR,
              selectionPointOutlineWidth: 2,
              selectionPointWidth: 6,
              midPointColor: "#ffffff",
              midPointOutlineColor: "#059669",
              midPointOutlineWidth: 1,
              midPointWidth: 4,
            },
          }),
        ],
      });
      draw.start();
    } catch (err) {
      console.error("[fence-editor] terra-draw failed to start", err);
      return;
    }
    drawRef.current = draw;
    if (process.env.NODE_ENV !== "production") (window as unknown as { __draw?: TerraDraw }).__draw = draw;

    let timer: ReturnType<typeof setTimeout> | null = null;

    const commitSnapshot = () => {
      const state = useQuoteStore.getState();
      const fence = state.quote?.fence;
      if (!fence) return;
      const feats = draw.getSnapshot().filter(isFenceFeature);
      if (feats.length === 0) {
        if (fenceIdRef.current !== null && fence.vertices.length > 0) {
          fenceIdRef.current = null;
          state.setFence({ ...fence, vertices: [], gates: [] }, { source: "editor", coalesceMs: 0 });
        }
        return;
      }
      const picked = feats.find((f) => f.id === fenceIdRef.current) ?? feats[feats.length - 1];
      fenceIdRef.current = picked.id ?? null;
      const extras = feats.filter((f) => f !== picked && f.id !== undefined).map((f) => f.id as string | number);
      if (extras.length) draw.removeFeatures(extras);
      const { vertices, closed } = featureVertices(picked);
      if (closed === fence.closed && sameVertices(vertices, fence.vertices)) return;
      state.setFence({ ...fence, vertices, closed }, { source: "editor" });
    };

    const onChange: TerraDrawEventListeners["change"] = (_ids, type, context) => {
      if (type === "styling") return;
      if (context && "origin" in context && context.origin === "api") return;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        commitSnapshot();
      }, CHANGE_DEBOUNCE_MS);
    };

    const onFinish: TerraDrawEventListeners["finish"] = (id, context) => {
      if (context.action === "draw" && FENCE_MODES.has(context.mode)) {
        if (timer) clearTimeout(timer);
        timer = null;
        fenceIdRef.current = id;
        commitSnapshot();
        useQuoteStore.getState().setEditorMode("select");
        // Select the finished feature once select mode is active so its handles appear immediately.
        setTimeout(() => {
          try {
            if (draw.getMode() === "select" && draw.hasFeature(id)) draw.selectFeature(id);
          } catch {
            /* mode changed meanwhile */
          }
        }, 0);
      }
    };

    draw.on("change", onChange);
    draw.on("finish", onFinish);

    return () => {
      if (timer) clearTimeout(timer);
      try {
        draw.off("change", onChange);
        draw.off("finish", onFinish);
        draw.stop();
      } catch {
        /* map already removed */
      }
      drawRef.current = null;
      fenceIdRef.current = null;
    };
  }, [map]);

  // Store -> terra-draw: push geometry produced by the store (use parcel edge, setback, undo/redo, clear).
  useEffect(() => {
    const draw = drawRef.current;
    if (!draw || !map) return;
    const state = useQuoteStore.getState();
    const fence = state.quote?.fence;
    let existing: GeoJSONStoreFeatures<Polygon | LineString>[] = [];
    try {
      existing = draw.getSnapshot().filter(isFenceFeature);
    } catch {
      return;
    }
    const ids = existing.map((f) => f.id).filter((id): id is string | number => id !== undefined);
    const enough = fence && (fence.closed ? fence.vertices.length >= 3 : fence.vertices.length >= 2);
    if (!fence || !enough) {
      if (ids.length) draw.removeFeatures(ids);
      fenceIdRef.current = null;
      return;
    }
    const geometry = fenceGeometry(fence.vertices, fence.closed);
    const current = existing.find((f) => f.id === fenceIdRef.current) ?? existing[0];
    if (current && current.id !== undefined && current.geometry.type === geometry.type) {
      const have = featureVertices(current);
      const others = ids.filter((id) => id !== current.id);
      if (others.length) draw.removeFeatures(others);
      fenceIdRef.current = current.id;
      if (have.closed === fence.closed && sameVertices(have.vertices, fence.vertices)) return;
      try {
        draw.deselectFeature(current.id);
      } catch {
        /* not selected */
      }
      draw.updateFeatureGeometry(current.id, geometry);
      if (draw.getMode() === "select") {
        try {
          draw.selectFeature(current.id);
        } catch {
          /* ignore */
        }
      }
      return;
    }
    if (ids.length) draw.removeFeatures(ids);
    const id = newId();
    const result = draw.addFeatures([
      { type: "Feature", id, geometry, properties: { mode: fence.closed ? "polygon" : "linestring" } },
    ]);
    if (result[0] && result[0].valid === false) {
      console.warn("[fence-editor] feature rejected", result[0]);
      fenceIdRef.current = null;
      return;
    }
    fenceIdRef.current = id;
    if (draw.getMode() === "select") {
      try {
        draw.selectFeature(id);
      } catch {
        /* ignore */
      }
    }
  }, [map, geometryVersion]);

  // Store editor mode -> terra-draw mode.
  useEffect(() => {
    const draw = drawRef.current;
    if (!draw || !map) return;
    try {
      if (draw.getMode() !== editorMode) draw.setMode(editorMode);
    } catch (err) {
      console.warn("[fence-editor] setMode failed", err);
    }
  }, [map, editorMode]);

  return null;
}
