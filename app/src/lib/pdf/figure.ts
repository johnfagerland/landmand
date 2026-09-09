/**
 * Geometry for the proposal figure. Self-contained equirectangular projection in feet
 * (x = dLon * cos(lat) * 364,000 ft/deg, y = dLat * 364,000 ft/deg) so the PDF does not depend on
 * the engine. Accurate to well under 1 % over a lot; the numbers printed in the tables come from the
 * take-off, not from here.
 */
import type { Gate, LonLat, Parcel } from "@/engine/types";

export const FT_PER_DEG = 364_000;

export interface Pt {
  x: number;
  y: number;
}

export interface FigureGate {
  id: string;
  kind: Gate["kind"];
  widthFt: number;
  /** Tick end points and label position, in SVG units. */
  tick: [Pt, Pt];
  label: Pt;
}

export interface FigureSegmentLabel {
  at: Pt;
  text: string;
}

export interface FigureLayout {
  width: number;
  height: number;
  /** SVG points of the parcel ring (empty when none). */
  parcel: Pt[];
  /** SVG points of the fence vertices. */
  fence: Pt[];
  closed: boolean;
  segmentLabels: FigureSegmentLabel[];
  gates: FigureGate[];
  /** Scale bar in SVG units. */
  scaleBar: { from: Pt; to: Pt; lengthFt: number };
  /** SVG units per foot. */
  pxPerFt: number;
  /** True when there is nothing to draw. */
  empty: boolean;
}

export function projectFt(origin: LonLat, p: LonLat): Pt {
  const cos = Math.cos((origin[1] * Math.PI) / 180);
  return { x: (p[0] - origin[0]) * cos * FT_PER_DEG, y: (p[1] - origin[1]) * FT_PER_DEG };
}

function centroid(points: LonLat[]): LonLat {
  if (points.length === 0) return [0, 0];
  let lon = 0;
  let lat = 0;
  for (const p of points) {
    lon += p[0];
    lat += p[1];
  }
  return [lon / points.length, lat / points.length];
}

function niceScaleLengthFt(maxFt: number): number {
  const candidates = [5, 10, 20, 25, 50, 100, 200, 250, 500, 1000];
  let best = candidates[0];
  for (const c of candidates) if (c <= maxFt) best = c;
  return best;
}

/** Project a point onto segment ab; returns the parameter t in [0, 1] and the distance. */
function projectOnto(p: Pt, a: Pt, b: Pt): { t: number; dist: number; at: Pt } {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len2 = dx * dx + dy * dy;
  const t = len2 === 0 ? 0 : Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / len2));
  const at = { x: a.x + t * dx, y: a.y + t * dy };
  return { t, dist: Math.hypot(p.x - at.x, p.y - at.y), at };
}

export interface FigureInput {
  fenceVertices: LonLat[];
  closed: boolean;
  gates: Gate[];
  parcel?: Pick<Parcel, "ring" | "origin"> | null;
  /** Override the label lengths with the take-off's own segment lengths (same order as segments). */
  segmentLengthsFt?: number[];
  width: number;
  height: number;
  padding?: number;
}

export function layoutFigure(input: FigureInput): FigureLayout {
  const { width, height } = input;
  const padding = input.padding ?? 18;
  const origin: LonLat = input.parcel?.origin ?? centroid(input.fenceVertices.length ? input.fenceVertices : (input.parcel?.ring ?? []));
  const parcelFt = (input.parcel?.ring ?? []).map((p) => projectFt(origin, p));
  const fenceFt = input.fenceVertices.map((p) => projectFt(origin, p));
  const all = [...parcelFt, ...fenceFt];
  const emptyLayout: FigureLayout = {
    width,
    height,
    parcel: [],
    fence: [],
    closed: input.closed,
    segmentLabels: [],
    gates: [],
    scaleBar: { from: { x: padding, y: height - padding }, to: { x: padding, y: height - padding }, lengthFt: 0 },
    pxPerFt: 1,
    empty: true,
  };
  if (all.length === 0) return emptyLayout;

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const p of all) {
    minX = Math.min(minX, p.x);
    maxX = Math.max(maxX, p.x);
    minY = Math.min(minY, p.y);
    maxY = Math.max(maxY, p.y);
  }
  const spanX = Math.max(maxX - minX, 1);
  const spanY = Math.max(maxY - minY, 1);
  // Leave room at the bottom for the scale bar and at the right for the north arrow.
  const innerW = width - padding * 2 - 24;
  const innerH = height - padding * 2 - 22;
  const pxPerFt = Math.min(innerW / spanX, innerH / spanY);
  const offsetX = padding + (innerW - spanX * pxPerFt) / 2;
  const offsetY = padding + (innerH - spanY * pxPerFt) / 2;
  const toSvg = (p: Pt): Pt => ({ x: offsetX + (p.x - minX) * pxPerFt, y: offsetY + (maxY - p.y) * pxPerFt });

  const parcel = parcelFt.map(toSvg);
  const fence = fenceFt.map(toSvg);

  // Segments in feet (for gate projection) and their labels.
  const segCount = input.closed ? fenceFt.length : Math.max(fenceFt.length - 1, 0);
  const segmentLabels: FigureSegmentLabel[] = [];
  const segs: { a: Pt; b: Pt; lenFt: number }[] = [];
  for (let i = 0; i < segCount; i++) {
    const a = fenceFt[i];
    const b = fenceFt[(i + 1) % fenceFt.length];
    const lenFt = input.segmentLengthsFt?.[i] ?? Math.hypot(b.x - a.x, b.y - a.y);
    segs.push({ a, b, lenFt });
    if (lenFt < 1) continue;
    const mid = toSvg({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
    // Nudge the label off the line, to the outside (right-hand side of travel for CCW rings).
    const sa = toSvg(a);
    const sb = toSvg(b);
    const dx = sb.x - sa.x;
    const dy = sb.y - sa.y;
    const len = Math.hypot(dx, dy) || 1;
    const nx = dy / len;
    const ny = -dx / len;
    const text = `${lenFt.toFixed(1)} ft`;
    // Push the label clear of the line: half the text width along x for steep sides, half the
    // text height along y for flat ones (6.5 pt Helvetica is ~3.3 pt per character).
    const halfW = (text.length * 3.3) / 2;
    const off = 5 + Math.abs(nx) * halfW + Math.abs(ny) * 4;
    segmentLabels.push({ at: { x: mid.x + nx * off, y: mid.y + ny * off + 2.5 }, text });
  }

  const gates: FigureGate[] = [];
  for (const gate of input.gates) {
    if (segs.length === 0) break;
    const g = projectFt(origin, gate.anchor);
    let best = { i: 0, dist: Infinity, at: g };
    segs.forEach((s, i) => {
      const r = projectOnto(g, s.a, s.b);
      if (r.dist < best.dist) best = { i, dist: r.dist, at: r.at };
    });
    const s = segs[best.i];
    const dx = s.b.x - s.a.x;
    const dy = s.b.y - s.a.y;
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len;
    const uy = dy / len;
    const half = gate.widthFt / 2;
    const p1 = toSvg({ x: best.at.x - ux * half, y: best.at.y - uy * half });
    const p2 = toSvg({ x: best.at.x + ux * half, y: best.at.y + uy * half });
    // Perpendicular ticks at both ends of the opening, label inside the lot side.
    const nx = -uy;
    const ny = ux;
    const labelFt = { x: best.at.x + nx * 6, y: best.at.y + ny * 6 };
    const label = toSvg(labelFt);
    gates.push({
      id: gate.id,
      kind: gate.kind,
      widthFt: gate.widthFt,
      tick: [p1, p2],
      label: { x: label.x, y: label.y + 2.5 },
    });
  }

  const scaleLengthFt = niceScaleLengthFt((innerW * 0.3) / pxPerFt);
  const scaleFrom = { x: padding, y: height - padding + 6 };
  const scaleTo = { x: padding + scaleLengthFt * pxPerFt, y: scaleFrom.y };

  return {
    width,
    height,
    parcel,
    fence,
    closed: input.closed,
    segmentLabels,
    gates,
    scaleBar: { from: scaleFrom, to: scaleTo, lengthFt: scaleLengthFt },
    pxPerFt,
    empty: false,
  };
}

export const pointsAttr = (pts: Pt[]): string => pts.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ");
