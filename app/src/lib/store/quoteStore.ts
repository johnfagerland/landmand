/**
 * Client state for the quote in progress: parcel candidates, the fence line being edited, gates,
 * one undo/redo history (geometry + gates + style), elevation profiles and derived geometry summary.
 *
 * Every engine call goes through `safeEngine` so the UI keeps rendering (with an "engine unavailable"
 * status) while engine bodies are still being written or if one throws on odd geometry.
 * Persistence goes only through getRepositories().
 */
import { create } from "zustand";
import type { ParcelCandidate } from "@/adapters/types";
import {
  buildProfile,
  createLocalPlane,
  emptyFence,
  applyTakeOff as engineApplyTakeOff,
  normalizeRing,
  offsetEdges,
  offsetRing,
  projectGateAnchor,
  segmentsOf,
  stationPoints,
  summarizeFence,
  totalLengthFt,
  type FenceSummary,
  type OffsetResult,
} from "@/engine";
import type {
  Customer,
  ElevationProfile,
  FenceLine,
  Gate,
  GateKind,
  LocalPlane,
  LonLat,
  Parcel,
  Quote,
  TakeOff,
} from "@/engine/types";
import { lookupParcel as apiLookupParcel, sampleElevation } from "@/lib/api/client";
import { getRepositories } from "@/lib/repo";
import { newId } from "./ids";

export type LoadStatus = "idle" | "loading" | "ready" | "missing" | "error";
export type ParcelLookupStatus = "idle" | "loading" | "found" | "none" | "error";
export type EngineStatus = "ok" | "unavailable" | "error";
export type SlopeStatus = "pending" | "applied" | "unavailable";
export type PersistStatus = "idle" | "saving" | "saved" | "error";
export type EditorMode = "select" | "polygon" | "linestring";
export type FenceChangeSource = "editor" | "store";

export interface Notice {
  kind: "info" | "error";
  text: string;
}

export interface SetFenceOptions {
  /** "editor" = came from terra-draw (do not push back to it); "store" = push to terra-draw. Default "store". */
  source?: FenceChangeSource;
  /** Record a history entry. Default true. */
  record?: boolean;
  /** Editor edits arriving within this window share one history entry (drags). Default 400 ms for editor edits. */
  coalesceMs?: number;
}

interface QuoteState {
  quote: Quote | null;
  loadStatus: LoadStatus;
  loadError?: string;

  parcelLookup: ParcelLookupStatus;
  parcelMessage?: string;
  candidates: ParcelCandidate[];
  selectedCandidate: number | null;

  plane: LocalPlane | null;
  engineStatus: EngineStatus;
  engineError?: string;

  summary: FenceSummary | null;
  parcelPerimeterFt: number | null;
  slopeStatus: SlopeStatus;
  elevationInflight: number;

  editorMode: EditorMode;
  /** Bumped on every store-originated geometry change; the editor pushes the fence to terra-draw when it changes. */
  geometryVersion: number;
  /** Bumped when the map should refit (parcel selected, candidates loaded). */
  fitVersion: number;

  past: FenceLine[];
  future: FenceLine[];
  lastEditorEditAt: number;

  persistStatus: PersistStatus;
  notice: Notice | null;

  // ---- actions
  loadQuote(id: string): Promise<void>;
  /** Adopt a just-created quote (AddressSearch) so the quote page needs no repository round-trip. */
  beginQuote(quote: Quote): void;
  setQuote(quote: Quote): void;
  reset(): void;

  lookupParcel(): Promise<void>;
  selectCandidate(index: number): void;
  useManualDraw(): void;

  setFence(fence: FenceLine, opts?: SetFenceOptions): void;
  setVertices(vertices: LonLat[], closed: boolean, opts?: SetFenceOptions): void;
  useParcelEdge(): void;
  clearFence(): void;
  undo(): void;
  redo(): void;
  canUndo(): boolean;
  canRedo(): boolean;

  applySetbackAll(inwardFt: number): boolean;
  applySetbackEdge(edgeIndex: number, inwardFt: number): boolean;
  openLoopAt(segmentIndex: number): void;

  addGate(segmentIndex: number, widthFt?: number, kind?: GateKind): string | null;
  updateGate(id: string, patch: Partial<Pick<Gate, "widthFt" | "kind">>): void;
  removeGate(id: string): void;
  moveGate(id: string, lonLat: LonLat): void;

  setStyle(styleId: string, heightFt?: number): void;
  setEditorMode(mode: EditorMode): void;
  startDraw(kind: "polygon" | "linestring"): void;

  fetchElevation(): Promise<void>;
  setProfiles(profiles: Record<string, ElevationProfile>): void;

  setTakeoff(takeoff: TakeOff | undefined, priceBookId?: string): void;
  setCustomer(customer: Customer): void;
  setNotes(notes: string): void;

  persist(): Promise<void>;
  setNotice(notice: Notice | null): void;
}

const HISTORY_MAX = 100;
const PERSIST_DEBOUNCE_MS = 500;
const ELEVATION_DEBOUNCE_MS = 800;
const EDITOR_COALESCE_MS = 400;
const GATE_MIN_FT = 3;
const GATE_MAX_FT = 16;

const round7 = (n: number) => Math.round(n * 1e7) / 1e7;

/** Drop a repeated closing vertex and consecutive duplicates; round to 7 dp. Orientation is left alone. */
export function tidyVertices(vertices: LonLat[], closed: boolean): LonLat[] {
  const out: LonLat[] = [];
  for (const v of vertices) {
    if (!Array.isArray(v) || !Number.isFinite(v[0]) || !Number.isFinite(v[1])) continue;
    const r: LonLat = [round7(v[0]), round7(v[1])];
    const prev = out[out.length - 1];
    if (prev && prev[0] === r[0] && prev[1] === r[1]) continue;
    out.push(r);
  }
  if (closed && out.length > 1) {
    const f = out[0];
    const l = out[out.length - 1];
    if (f[0] === l[0] && f[1] === l[1]) out.pop();
  }
  return out;
}

function fallbackFence(styleId = "wood-privacy-6", heightFt = 6): FenceLine {
  return { vertices: [], closed: true, gates: [], styleId, heightFt };
}

function isNotImplemented(err: unknown): boolean {
  return err instanceof Error && /not implemented/i.test(err.message);
}

function errorText(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

function hasEnoughVertices(fence: FenceLine): boolean {
  return fence.closed ? fence.vertices.length >= 3 : fence.vertices.length >= 2;
}

/** Parse "1823 White Oak Rd" into the number + street the parcel route expects. */
export function splitAddressLine(line1: string): { number?: string; street?: string } {
  const m = /^\s*(\d+[A-Za-z]?)\s+(.+?)\s*$/.exec(line1 ?? "");
  if (!m) return {};
  // Never send unit numbers: cut at "#", "Apt", "Unit", "Suite" or a comma.
  const street = m[2].split(/,|#|\b(?:apt|unit|suite|ste)\b/i)[0].trim().toUpperCase();
  return { number: m[1], street: street || undefined };
}

let persistTimer: ReturnType<typeof setTimeout> | null = null;
let elevationTimer: ReturnType<typeof setTimeout> | null = null;
const elevationInflightKeys = new Set<string>();
/** Segment keys we have already asked the elevation service about (so "unavailable" means a real miss). */
const elevationAttemptedKeys = new Set<string>();

export const useQuoteStore = create<QuoteState>()((set, get) => {
  /** Run an engine call; on failure record the status and return the fallback instead of throwing. */
  function safeEngine<T>(label: string, fn: () => T, fallback: T): T {
    try {
      const value = fn();
      if (get().engineStatus !== "ok") set({ engineStatus: "ok", engineError: undefined });
      return value;
    } catch (err) {
      const status: EngineStatus = isNotImplemented(err) ? "unavailable" : "error";
      const text = `${label}: ${errorText(err)}`;
      if (get().engineStatus !== status || get().engineError !== text) set({ engineStatus: status, engineError: text });
      if (process.env.NODE_ENV !== "production") console.warn("[engine]", text);
      return fallback;
    }
  }

  function makePlane(origin: LonLat | undefined): LocalPlane | null {
    if (!origin) return null;
    return safeEngine("createLocalPlane", () => createLocalPlane(origin), null);
  }

  function computeSummary(quote: Quote, plane: LocalPlane | null): FenceSummary | null {
    if (!plane || !hasEnoughVertices(quote.fence)) return null;
    return safeEngine("summarizeFence", () => summarizeFence(quote.fence, plane, quote.profiles), null);
  }

  function computePerimeter(parcel: Parcel | undefined, plane: LocalPlane | null): number | null {
    if (!parcel || !plane || parcel.ring.length < 3) return null;
    return safeEngine("parcelPerimeter", () => totalLengthFt(segmentsOf(parcel.ring, true, plane)), null);
  }

  function computeSlopeStatus(quote: Quote, summary: FenceSummary | null, inflight: number): SlopeStatus {
    if (!summary || summary.segments.length === 0) return "pending";
    const missing = summary.segments.filter((s) => !quote.profiles[s.key]);
    if (missing.length > 0) {
      if (inflight > 0) return "pending";
      // Not yet asked (fetch is debounced / about to run) -> pending; asked and got nothing -> unavailable.
      return missing.every((s) => elevationAttemptedKeys.has(s.key)) ? "unavailable" : "pending";
    }
    const profiles = summary.segments.map((s) => quote.profiles[s.key]);
    return profiles.some((p) => p && p.source !== "none") ? "applied" : "unavailable";
  }

  function schedulePersist() {
    if (persistTimer) clearTimeout(persistTimer);
    persistTimer = setTimeout(() => {
      persistTimer = null;
      void get().persist();
    }, PERSIST_DEBOUNCE_MS);
  }

  function scheduleElevation() {
    if (elevationTimer) clearTimeout(elevationTimer);
    elevationTimer = setTimeout(() => {
      elevationTimer = null;
      void get().fetchElevation();
    }, ELEVATION_DEBOUNCE_MS);
  }

  /** Re-project gate anchors onto the (new) segments. Keeps the anchor when the engine is unavailable. */
  function reprojectGates(gates: Gate[], summary: FenceSummary | null, plane: LocalPlane | null): Gate[] {
    if (!summary || !plane || summary.segments.length === 0) return gates;
    return gates.map((g) => {
      const hit = safeEngine("projectGateAnchor", () => projectGateAnchor(g.anchor, summary.segments, plane), null);
      return hit ? { ...g, anchor: [round7(hit.lonLat[0]), round7(hit.lonLat[1])] } : g;
    });
  }

  /** Apply a quote change: derive everything, then schedule persistence. */
  function commitQuote(quote: Quote, extra: Partial<QuoteState> = {}) {
    const plane = get().plane;
    const summary = computeSummary(quote, plane);
    set({
      quote,
      summary,
      slopeStatus: computeSlopeStatus(quote, summary, get().elevationInflight),
      ...extra,
    });
    schedulePersist();
  }

  function applyOffset(label: string, run: (plane: LocalPlane, ring: LonLat[]) => OffsetResult): boolean {
    const { quote, plane } = get();
    if (!quote || !plane) return false;
    if (!quote.fence.closed || quote.fence.vertices.length < 3) {
      set({ notice: { kind: "error", text: "Setbacks apply to a closed perimeter. Draw or use the lot lines first." } });
      return false;
    }
    const ring = safeEngine("normalizeRing", () => normalizeRing(quote.fence.vertices, plane), quote.fence.vertices);
    const result = safeEngine(label, () => run(plane, ring), { ok: false, reason: "invalid" } as OffsetResult);
    if (!result.ok) {
      const why =
        result.reason === "kinks"
          ? "that offset would make the fence cross itself"
          : result.reason === "collapsed"
            ? "that offset is larger than the lot"
            : get().engineStatus !== "ok"
              ? "the measurement engine is unavailable"
              : "the offset could not be computed";
      set({ notice: { kind: "error", text: `Kept the previous line: ${why}.` } });
      return false;
    }
    get().setFence({ ...quote.fence, vertices: result.ring }, { source: "store" });
    set({ notice: null });
    return true;
  }

  return {
    quote: null,
    loadStatus: "idle",
    parcelLookup: "idle",
    candidates: [],
    selectedCandidate: null,
    plane: null,
    engineStatus: "ok",
    summary: null,
    parcelPerimeterFt: null,
    slopeStatus: "pending",
    elevationInflight: 0,
    editorMode: "select",
    geometryVersion: 0,
    fitVersion: 0,
    past: [],
    future: [],
    lastEditorEditAt: 0,
    persistStatus: "idle",
    notice: null,

    async loadQuote(id) {
      const current = get().quote;
      if (current && current.id === id && get().loadStatus === "ready") {
        if (!current.parcel && current.parcelStatus === "pending" && get().parcelLookup === "idle") {
          void get().lookupParcel();
        }
        return;
      }
      get().reset();
      set({ loadStatus: "loading" });
      let quote: Quote | null = null;
      try {
        quote = await getRepositories().quotes.get(id);
      } catch (err) {
        set({ loadStatus: "error", loadError: errorText(err) });
        return;
      }
      if (!quote) {
        set({ loadStatus: "missing" });
        return;
      }
      get().setQuote(quote);
      set({ loadStatus: "ready" });
      if (!quote.parcel && quote.parcelStatus === "pending") void get().lookupParcel();
      else if (quote.parcelStatus === "manual" && quote.fence.vertices.length === 0) set({ editorMode: "polygon" });
      if (quote.fence.vertices.length > 0) scheduleElevation();
    },

    beginQuote(quote) {
      get().reset();
      get().setQuote(quote);
      set({ loadStatus: "ready" });
      schedulePersist();
    },

    setQuote(quote) {
      const plane = makePlane(quote.parcel?.origin ?? quote.geocode);
      const fence = { ...quote.fence, vertices: tidyVertices(quote.fence.vertices, quote.fence.closed) };
      const q = { ...quote, fence };
      const summary = computeSummary(q, plane);
      set({
        quote: q,
        plane,
        summary,
        parcelPerimeterFt: computePerimeter(q.parcel, plane),
        slopeStatus: computeSlopeStatus(q, summary, 0),
        geometryVersion: get().geometryVersion + 1,
        fitVersion: get().fitVersion + 1,
        past: [],
        future: [],
        parcelLookup: q.parcel ? "found" : get().parcelLookup,
      });
    },

    reset() {
      if (persistTimer) clearTimeout(persistTimer);
      if (elevationTimer) clearTimeout(elevationTimer);
      persistTimer = null;
      elevationTimer = null;
      elevationInflightKeys.clear();
      elevationAttemptedKeys.clear();
      set({
        quote: null,
        loadStatus: "idle",
        loadError: undefined,
        parcelLookup: "idle",
        parcelMessage: undefined,
        candidates: [],
        selectedCandidate: null,
        plane: null,
        summary: null,
        parcelPerimeterFt: null,
        slopeStatus: "pending",
        elevationInflight: 0,
        editorMode: "select",
        past: [],
        future: [],
        persistStatus: "idle",
        notice: null,
      });
    },

    async lookupParcel() {
      const { quote } = get();
      if (!quote) return;
      set({ parcelLookup: "loading", parcelMessage: undefined, candidates: [], selectedCandidate: null });
      const { number, street } = splitAddressLine(quote.address.line1);
      const result = await apiLookupParcel({
        lon: quote.geocode[0],
        lat: quote.geocode[1],
        county: quote.address.countyFips,
        number,
        street,
      });
      if (get().quote?.id !== quote.id) return;
      if (result.status === "found" && result.candidates.length > 0) {
        // Highest score first; on a tie prefer the larger lot (the house lot over a sliver or side lot).
        const candidates = [...result.candidates].sort(
          (a, b) => b.score - a.score || b.parcel.areaSqFt - a.parcel.areaSqFt,
        );
        set({ parcelLookup: "found", candidates, fitVersion: get().fitVersion + 1 });
        if (candidates.length === 1) get().selectCandidate(0);
        return;
      }
      set({
        parcelLookup: "none",
        parcelMessage:
          "We couldn't load lot lines here automatically — draw the fence on the imagery; the quote is just as accurate.",
      });
      get().useManualDraw();
    },

    selectCandidate(index) {
      const { quote, candidates } = get();
      const candidate = candidates[index];
      if (!quote || !candidate) return;
      const parcel = candidate.parcel;
      const plane = makePlane(parcel.origin);
      set({ plane, selectedCandidate: index, parcelLookup: "found", parcelMessage: undefined });
      const q: Quote = { ...quote, parcel, parcelStatus: "found", updatedAt: new Date().toISOString() };
      commitQuote(q, {
        parcelPerimeterFt: computePerimeter(parcel, plane),
        fitVersion: get().fitVersion + 1,
        geometryVersion: get().geometryVersion + 1,
      });
    },

    useManualDraw() {
      const { quote } = get();
      if (!quote) return;
      const q: Quote = { ...quote, parcelStatus: "manual", updatedAt: new Date().toISOString() };
      commitQuote(q, { editorMode: quote.fence.vertices.length === 0 ? "polygon" : get().editorMode });
    },

    setFence(next, opts = {}) {
      const { quote, plane } = get();
      if (!quote) return;
      const source = opts.source ?? "store";
      const record = opts.record ?? true;
      const coalesceMs = opts.coalesceMs ?? (source === "editor" ? EDITOR_COALESCE_MS : 0);
      const now = Date.now();

      const tidied = tidyVertices(next.vertices, next.closed);
      // A closed perimeter is stored normalised (counter-clockwise, no slivers) so that side indices shown
      // in the panel, elevation cache keys and per-side setbacks all refer to the same ring.
      const vertices =
        next.closed && tidied.length >= 3 && plane
          ? safeEngine("normalizeRing", () => normalizeRing(tidied, plane), tidied)
          : tidied;
      let fence: FenceLine = { ...next, vertices };
      const draft: Quote = { ...quote, fence };
      const summary = computeSummary(draft, plane);
      const gates = reprojectGates(fence.gates, summary, plane);
      fence = { ...fence, gates };

      let { past, future } = get();
      if (record) {
        const coalesce = source === "editor" && now - get().lastEditorEditAt < coalesceMs;
        if (!coalesce) {
          past = [...past, quote.fence].slice(-HISTORY_MAX);
          future = [];
        }
      }
      const q: Quote = { ...quote, fence, updatedAt: new Date(now).toISOString() };
      set({
        quote: q,
        summary,
        slopeStatus: computeSlopeStatus(q, summary, get().elevationInflight),
        past,
        future,
        lastEditorEditAt: source === "editor" ? now : get().lastEditorEditAt,
        geometryVersion: source === "store" ? get().geometryVersion + 1 : get().geometryVersion,
      });
      schedulePersist();
      scheduleElevation();
    },

    setVertices(vertices, closed, opts) {
      const { quote } = get();
      if (!quote) return;
      get().setFence({ ...quote.fence, vertices, closed }, opts);
    },

    useParcelEdge() {
      const { quote } = get();
      if (!quote?.parcel) return;
      get().setFence({ ...quote.fence, vertices: quote.parcel.ring, closed: true }, { source: "store" });
      set({ editorMode: "select", notice: null });
    },

    clearFence() {
      const { quote } = get();
      if (!quote) return;
      get().setFence({ ...quote.fence, vertices: [], closed: true, gates: [] }, { source: "store" });
    },

    undo() {
      const { quote, past, future } = get();
      if (!quote || past.length === 0) return;
      const prev = past[past.length - 1];
      set({ past: past.slice(0, -1), future: [...future, quote.fence] });
      get().setFence(prev, { source: "store", record: false });
    },

    redo() {
      const { quote, past, future } = get();
      if (!quote || future.length === 0) return;
      const next = future[future.length - 1];
      set({ future: future.slice(0, -1), past: [...past, quote.fence].slice(-HISTORY_MAX) });
      get().setFence(next, { source: "store", record: false });
    },

    canUndo: () => get().past.length > 0,
    canRedo: () => get().future.length > 0,

    applySetbackAll(inwardFt) {
      if (!(inwardFt > 0)) return false;
      return applyOffset("offsetRing", (plane, ring) => offsetRing(ring, inwardFt, plane));
    },

    applySetbackEdge(edgeIndex, inwardFt) {
      if (!(inwardFt > 0)) return false;
      return applyOffset("offsetEdges", (plane, ring) => offsetEdges(ring, { [edgeIndex]: inwardFt }, plane));
    },

    openLoopAt(segmentIndex) {
      const { quote } = get();
      if (!quote || !quote.fence.closed) return;
      const v = quote.fence.vertices;
      const n = v.length;
      if (n < 3 || segmentIndex < 0 || segmentIndex >= n) return;
      // Segment i runs v[i] -> v[i+1]; removing it leaves an open run starting at v[i+1] and ending at v[i].
      const start = (segmentIndex + 1) % n;
      const vertices: LonLat[] = [];
      for (let k = 0; k < n; k++) vertices.push(v[(start + k) % n]);
      get().setFence({ ...quote.fence, vertices, closed: false }, { source: "store" });
      set({ editorMode: "select" });
    },

    addGate(segmentIndex, widthFt = 4, kind = "single") {
      const { quote, summary } = get();
      if (!quote) return null;
      const seg = summary?.segments[segmentIndex];
      if (!seg) return null;
      const anchor: LonLat = [
        round7((seg.aLonLat[0] + seg.bLonLat[0]) / 2),
        round7((seg.aLonLat[1] + seg.bLonLat[1]) / 2),
      ];
      const gate: Gate = {
        id: newId(),
        anchor,
        widthFt: Math.min(GATE_MAX_FT, Math.max(GATE_MIN_FT, widthFt)),
        kind,
      };
      get().setFence({ ...quote.fence, gates: [...quote.fence.gates, gate] }, { source: "store" });
      return gate.id;
    },

    updateGate(id, patch) {
      const { quote } = get();
      if (!quote) return;
      const gates = quote.fence.gates.map((g) =>
        g.id === id
          ? {
              ...g,
              ...patch,
              widthFt:
                patch.widthFt === undefined ? g.widthFt : Math.min(GATE_MAX_FT, Math.max(GATE_MIN_FT, patch.widthFt)),
            }
          : g,
      );
      get().setFence({ ...quote.fence, gates }, { source: "store" });
    },

    removeGate(id) {
      const { quote } = get();
      if (!quote) return;
      get().setFence({ ...quote.fence, gates: quote.fence.gates.filter((g) => g.id !== id) }, { source: "store" });
    },

    moveGate(id, lonLat) {
      const { quote } = get();
      if (!quote) return;
      const gates = quote.fence.gates.map((g) => (g.id === id ? { ...g, anchor: lonLat } : g));
      // setFence re-projects every anchor onto its nearest segment.
      get().setFence({ ...quote.fence, gates }, { source: "store" });
    },

    setStyle(styleId, heightFt) {
      const { quote } = get();
      if (!quote) return;
      get().setFence({ ...quote.fence, styleId, heightFt: heightFt ?? quote.fence.heightFt }, { source: "store" });
    },

    setEditorMode(mode) {
      set({ editorMode: mode });
    },

    startDraw(kind) {
      const { quote } = get();
      if (!quote) return;
      if (quote.fence.vertices.length > 0) {
        get().setFence({ ...quote.fence, vertices: [], closed: kind === "polygon", gates: [] }, { source: "store" });
      }
      set({ editorMode: kind, notice: null });
    },

    async fetchElevation() {
      const { quote, plane, summary } = get();
      if (!quote || !plane || !summary) return;
      const missing = summary.segments.filter((s) => !quote.profiles[s.key] && !elevationInflightKeys.has(s.key));
      if (missing.length === 0) {
        set({ slopeStatus: computeSlopeStatus(quote, summary, get().elevationInflight) });
        return;
      }
      const stations = missing.map((seg) => ({
        seg,
        pts: safeEngine("stationPoints", () => stationPoints(seg, plane), [] as { stationFt: number; lonLat: LonLat }[]),
      }));
      if (stations.every((s) => s.pts.length === 0)) {
        for (const s of stations) elevationAttemptedKeys.add(s.seg.key);
        set({ slopeStatus: "unavailable" });
        return;
      }
      for (const s of stations) {
        elevationInflightKeys.add(s.seg.key);
        elevationAttemptedKeys.add(s.seg.key);
      }
      set({ elevationInflight: get().elevationInflight + 1, slopeStatus: "pending" });
      const points: LonLat[] = stations.flatMap((s) => s.pts.map((p) => p.lonLat));
      let result: Awaited<ReturnType<typeof sampleElevation>>;
      try {
        result = await sampleElevation(points);
      } catch {
        result = { source: "none", elevationsFt: points.map(() => null) };
      }
      for (const s of stations) elevationInflightKeys.delete(s.seg.key);

      const profiles: Record<string, ElevationProfile> = {};
      let cursor = 0;
      for (const { seg, pts } of stations) {
        const samples = pts.map((p, i) => ({
          stationFt: p.stationFt,
          elevFt: result.elevationsFt[cursor + i] ?? null,
          lonLat: p.lonLat,
        }));
        cursor += pts.length;
        const profile = safeEngine(
          "buildProfile",
          () => buildProfile(seg, samples, result.source, result.resolutionM),
          null,
        );
        if (profile) profiles[seg.key] = profile;
      }
      const inflight = Math.max(0, get().elevationInflight - 1);
      set({ elevationInflight: inflight });
      const latest = get().quote;
      if (!latest || latest.id !== quote.id) return;
      get().setProfiles(profiles);
    },

    setProfiles(profiles) {
      const { quote, plane } = get();
      if (!quote) return;
      const merged = { ...quote.profiles, ...profiles };
      const q: Quote = { ...quote, profiles: merged };
      const summary = computeSummary(q, plane);
      set({ quote: q, summary, slopeStatus: computeSlopeStatus(q, summary, get().elevationInflight) });
      schedulePersist();
    },

    setTakeoff(takeoff, priceBookId) {
      const { quote } = get();
      if (!quote) return;
      const now = new Date().toISOString();
      const withBook: Quote = priceBookId === undefined ? quote : { ...quote, priceBookId };
      const q: Quote = takeoff
        ? safeEngine("applyTakeOff", () => engineApplyTakeOff(withBook, takeoff, now), {
            ...withBook,
            takeoff,
            updatedAt: now,
          })
        : { ...withBook, takeoff: undefined, updatedAt: now };
      set({ quote: q });
      schedulePersist();
    },

    setCustomer(customer) {
      const { quote } = get();
      if (!quote) return;
      set({ quote: { ...quote, customer, updatedAt: new Date().toISOString() } });
      schedulePersist();
    },

    setNotes(notes) {
      const { quote } = get();
      if (!quote) return;
      set({ quote: { ...quote, notes, updatedAt: new Date().toISOString() } });
      schedulePersist();
    },

    async persist() {
      const { quote, summary } = get();
      if (!quote) return;
      // Keep the profile cache bounded: drop profiles that no current segment uses once it grows large.
      let toSave = quote;
      const keys = Object.keys(quote.profiles);
      if (keys.length > 200 && summary) {
        const live = new Set(summary.segments.map((s) => s.key));
        const profiles: Record<string, ElevationProfile> = {};
        for (const k of keys) if (live.has(k)) profiles[k] = quote.profiles[k];
        toSave = { ...quote, profiles };
      }
      set({ persistStatus: "saving" });
      try {
        await getRepositories().quotes.save(toSave);
        if (get().quote?.id === quote.id) set({ persistStatus: "saved" });
      } catch (err) {
        set({ persistStatus: "error" });
        if (process.env.NODE_ENV !== "production") console.warn("[persist]", errorText(err));
      }
    },

    setNotice(notice) {
      set({ notice });
    },
  };
});

// Dev-only handle for browser automation and debugging (never in production bundles).
if (process.env.NODE_ENV !== "production" && typeof window !== "undefined") {
  (window as unknown as { __quoteStore?: typeof useQuoteStore }).__quoteStore = useQuoteStore;
}

/** Helper for one-off engine calls from components; mirrors the store's safeEngine without touching status. */
export function tryEngine<T>(fn: () => T, fallback: T): T {
  try {
    return fn();
  } catch {
    return fallback;
  }
}

export function emptyFenceSafe(styleId?: string, heightFt?: number): FenceLine {
  return tryEngine(() => emptyFence(styleId, heightFt), fallbackFence(styleId, heightFt));
}
