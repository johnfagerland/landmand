import type {
  ElevationProfile,
  FenceLine,
  FenceSegment,
  LocalPlane,
  Post,
  PostCounts,
  PriceBook,
  PriceBookItem,
  SegmentTakeOff,
  StyleRole,
  StyleRule,
  TakeOff,
  TakeOffLine,
} from "../types";
import { placeGates, runsOf, type GatePlacement, type Run } from "../fence/gates";
import { ceilQty, classifyVertexPosts, sectionsFor } from "../fence/posts";
import { segmentsOf } from "../geo/segments";
import { extendedCents, taxCents } from "./money";

export const DEFAULT_CORNER_THRESHOLD_DEG = 15;
export const MAX_GRADE_WARN_PCT = 25;

/** Geometry-only summary for the UI, available before a price book is loaded. */
export interface FenceSummary {
  segments: FenceSegment[];
  placements: GatePlacement[];
  runs: Run[];
  vertexPosts: Post[];
  flatLengthFt: number;
  correctedLengthFt: number;
  /** corrected minus gate openings */
  fenceLengthFt: number;
  slopeFactor: number;
  /** Segment index -> slope factor (1 when no profile). */
  slopeFactorBySegment: Record<number, number>;
  warnings: string[];
}

export function summarizeFence(
  fence: FenceLine,
  plane: LocalPlane,
  profiles: Record<string, ElevationProfile>,
  cornerThresholdDeg?: number,
): FenceSummary {
  const threshold = cornerThresholdDeg ?? DEFAULT_CORNER_THRESHOLD_DEG;
  const segments = segmentsOf(fence.vertices, fence.closed, plane);
  const placements = placeGates(fence.gates, segments, plane);
  const runs = runsOf(segments, placements, fence.closed);
  const vertexPosts = classifyVertexPosts(fence, segments, placements, plane, threshold);
  const warnings: string[] = [];

  const slopeFactorBySegment: Record<number, number> = {};
  let missing = 0;
  let flat = 0;
  let corrected = 0;
  for (const seg of segments) {
    const profile = profiles[seg.key];
    const usable = profile && profile.source !== "none" && Number.isFinite(profile.slopeFactor);
    const factor = usable ? Math.max(1, profile.slopeFactor) : 1;
    if (!usable) missing++;
    slopeFactorBySegment[seg.index] = factor;
    flat += seg.lengthFt;
    corrected += seg.lengthFt * factor;
    if (usable && profile.maxGradePct > MAX_GRADE_WARN_PCT) {
      warnings.push(
        `Segment ${seg.index} grade ${Math.round(profile.maxGradePct)}% exceeds ${MAX_GRADE_WARN_PCT}%; check post depth and step/rack the fence`,
      );
    }
  }
  if (missing > 0 && segments.length > 0) warnings.push(`Slope not applied on ${missing} segment(s)`);
  for (const p of placements) warnings.push(...p.warnings);

  let fenceLength = 0;
  for (const run of runs) fenceLength += run.lengthFt * (slopeFactorBySegment[run.segmentIndex] ?? 1);

  return {
    segments,
    placements,
    runs,
    vertexPosts,
    flatLengthFt: flat,
    correctedLengthFt: corrected,
    fenceLengthFt: fenceLength,
    slopeFactor: flat > 0 ? corrected / flat : 1,
    slopeFactorBySegment,
    warnings,
  };
}

export interface TakeOffInput {
  fence: FenceLine;
  plane: LocalPlane;
  profiles: Record<string, ElevationProfile>;
  priceBook: PriceBook;
  rule: StyleRule;
  taxRatePct: number;
  /** ISO timestamp for computedAt (injectable for tests). */
  now: string;
}

/** Roles the take-off tolerates being unbound without a warning (unless the style lists them as required). */
const OPTIONAL_ROLES: ReadonlySet<StyleRole> = new Set<StyleRole>(["gatePost", "laborPerGate", "cap"]);

/** Categories that receive the style's waste percentage (countable materials only). */
const WASTE_CATEGORIES: ReadonlySet<PriceBookItem["category"]> = new Set(["post", "rail", "picket", "panel", "cap"]);

function fmtFt(ft: number): string {
  return (Math.round(ft * 10) / 10).toString();
}

/** Full material take-off and pricing. Never throws on geometry; missing skus become warnings. */
export function computeTakeOff(input: TakeOffInput): TakeOff {
  const { fence, plane, profiles, priceBook, rule, taxRatePct, now } = input;
  const summary = summarizeFence(fence, plane, profiles, rule.cornerThresholdDeg);
  const warnings = summary.warnings.slice();
  const spacing = rule.postSpacingFt;

  // Per-segment counts.
  const segTakeOffs: SegmentTakeOff[] = summary.segments.map((seg) => ({
    segmentIndex: seg.index,
    flatFt: seg.lengthFt,
    correctedFt: seg.lengthFt * (summary.slopeFactorBySegment[seg.index] ?? 1),
    fenceFt: 0,
    slopeFactor: summary.slopeFactorBySegment[seg.index] ?? 1,
    linePosts: 0,
    sections: 0,
    gateIds: summary.placements.filter((p) => p.segmentIndex === seg.index).map((p) => p.gate.id),
  }));
  const bySeg = new Map(segTakeOffs.map((s) => [s.segmentIndex, s]));
  let totalSections = 0;
  let runLinePosts = 0;
  for (const run of summary.runs) {
    const factor = summary.slopeFactorBySegment[run.segmentIndex] ?? 1;
    const sections = sectionsFor(run.lengthFt * factor, spacing);
    const linePosts = Math.max(0, sections - 1);
    totalSections += sections;
    runLinePosts += linePosts;
    const st = bySeg.get(run.segmentIndex);
    if (st) {
      st.sections += sections;
      st.linePosts += linePosts;
      st.fenceFt += run.lengthFt * factor;
    }
  }

  // Posts: one per vertex (classified), line posts along runs, two per gate less vertex posts already upgraded.
  const vertexCounts = countPosts(summary.vertexPosts);
  const gates = summary.placements.length;
  // Vertex posts that a gate edge upgraded to "gate" are already in vertexCounts.gate, so
  // total = |vertices| + Σ linePosts + 2·gates − upgradedVertexPosts.
  const posts: PostCounts = {
    corner: vertexCounts.corner,
    end: vertexCounts.end,
    line: vertexCounts.line + runLinePosts,
    gate: 2 * gates,
    total: 0,
  };
  posts.total = posts.corner + posts.end + posts.line + posts.gate;

  const fenceLengthFt = summary.fenceLengthFt;
  const terminalCount = posts.corner + posts.end;
  const singleGates = summary.placements.filter((p) => p.gate.kind === "single").length;
  const doubleGates = gates - singleGates;

  // Line assembly.
  const items = new Map(priceBook.items.map((i) => [i.sku, i]));
  const lines: TakeOffLine[] = [];
  const resolve = (role: StyleRole): PriceBookItem | undefined => {
    const sku = rule.skus[role];
    if (!sku) {
      if (rule.requiredRoles.includes(role) || !OPTIONAL_ROLES.has(role)) {
        warnings.push(`No price-book item bound to role ${role} for style ${rule.id}`);
      }
      return undefined;
    }
    const item = items.get(sku);
    if (!item) {
      warnings.push(`Price-book item ${sku} bound to role ${role} for style ${rule.id} was not found`);
      return undefined;
    }
    return item;
  };
  const add = (role: StyleRole, rawQty: number, basis: string, item?: PriceBookItem) => {
    if (!(rawQty > 0)) return;
    const it = item ?? resolve(role);
    if (!it) return;
    let qty = rawQty;
    let b = basis;
    if (it.unit === "each" && WASTE_CATEGORIES.has(it.category) && rule.wastePct > 0) {
      qty = ceilQty(rawQty * (1 + rule.wastePct / 100));
      b = `${basis} + ${rule.wastePct}% waste`;
    } else if (it.unit === "ft") {
      qty = ceilQty(rawQty);
    } else if (!Number.isInteger(qty)) {
      qty = ceilQty(qty);
    }
    lines.push({
      sku: it.sku,
      description: it.description,
      category: it.category,
      unit: it.unit,
      qty,
      unitPriceCents: it.unitPriceCents,
      extendedCents: extendedCents(qty, it.unitPriceCents),
      basis: b,
      taxable: it.taxable,
    });
  };

  // Posts.
  add("linePost", posts.line, `${posts.line} line posts`);
  const gatePostItem = rule.skus.gatePost ? resolve("gatePost") : undefined;
  if (gatePostItem) {
    add("terminalPost", terminalCount, `${posts.corner} corner + ${posts.end} end posts`);
    add("gatePost", posts.gate, `${gates} gate(s) x 2 posts`, gatePostItem);
  } else {
    add(
      "terminalPost",
      terminalCount + posts.gate,
      `${posts.corner} corner + ${posts.end} end + ${posts.gate} gate posts`,
    );
  }

  // Section materials.
  if (rule.sectionModel === "stick") {
    const rails = rule.railsPerSection ?? 0;
    if (rails > 0) add("rail", totalSections * rails, `${totalSections} sections x ${rails} rails`);
    else warnings.push(`Style ${rule.id} has no railsPerSection; rails not counted`);
    const pitch = (rule.picketWidthIn ?? 0) + (rule.picketGapIn ?? 0);
    if (pitch > 0) {
      const pickets = ceilQty((fenceLengthFt * 12) / pitch);
      add("picket", pickets, `ceil(${fmtFt(fenceLengthFt)} ft x 12 / ${pitch} in pitch)`);
    } else {
      warnings.push(`Style ${rule.id} has no picket width; pickets not counted`);
    }
  } else if (rule.sectionModel === "panel") {
    add("panel", totalSections, `${totalSections} sections`);
    add("cap", posts.total, `${posts.total} posts`);
  } else {
    const fabric = resolve("fabric");
    if (fabric) {
      const rollLen = fabric.rollLengthFt ?? 0;
      if (rollLen > 0) {
        const rolls = ceilQty(fenceLengthFt / rollLen);
        add("fabric", rolls, `ceil(${fmtFt(fenceLengthFt)} ft / ${rollLen} ft roll)`, fabric);
      } else {
        warnings.push(`Price-book item ${fabric.sku} (role fabric) has no roll length; fabric not counted`);
      }
    }
    add("topRail", ceilQty(fenceLengthFt), `ceil(${fmtFt(fenceLengthFt)} ft)`);
  }

  // Concrete.
  const bags =
    posts.line * rule.concreteBagsPerLinePost + (terminalCount + posts.gate) * rule.concreteBagsPerTerminalPost;
  add(
    "concrete",
    bags,
    `${posts.line} line x ${rule.concreteBagsPerLinePost} + ${terminalCount + posts.gate} terminal x ${rule.concreteBagsPerTerminalPost} bags`,
  );

  // Gates.
  if (singleGates > 0) add("gateSingle", singleGates, `${singleGates} single gate(s)`);
  if (doubleGates > 0) add("gateDouble", doubleGates, `${doubleGates} double gate(s)`);
  if (gates > 0) add("gateHardware", gates, `1 per gate x ${gates}`);

  // Labour.
  add("laborPerFt", ceilQty(fenceLengthFt), `ceil(${fmtFt(fenceLengthFt)} ft)`);
  if (gates > 0 && rule.skus.laborPerGate) add("laborPerGate", gates, `${gates} gate(s)`);

  let subtotal = 0;
  let taxable = 0;
  for (const l of lines) {
    subtotal += l.extendedCents;
    if (l.taxable) taxable += l.extendedCents;
  }
  const tax = taxCents(taxable, taxRatePct);

  return {
    styleId: rule.id,
    heightFt: fence.heightFt,
    flatLengthFt: summary.flatLengthFt,
    correctedLengthFt: summary.correctedLengthFt,
    fenceLengthFt,
    slopeFactor: summary.slopeFactor,
    posts,
    sections: totalSections,
    gates,
    segments: segTakeOffs,
    lines,
    subtotalCents: subtotal,
    taxCents: tax,
    totalCents: subtotal + tax,
    warnings,
    computedAt: now,
  };
}

export function countPosts(posts: Post[]): PostCounts {
  const counts: PostCounts = { corner: 0, end: 0, line: 0, gate: 0, total: posts.length };
  for (const p of posts) counts[p.kind]++;
  return counts;
}
