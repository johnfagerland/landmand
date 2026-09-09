/**
 * POST /api/elevation  { points: [lon, lat][] }  (<= 400 points)
 *   200 { source: "3dep" | "epqs" | "none", elevationsFt: (number | null)[], resolutionM? }
 *   400 { ok: false, error: "bad_request", issues }
 * Per-point module LRU (5,000 entries keyed on 6-dp coords); only unknown points go upstream. No HTTP caching.
 */
import { z } from "zod";
import { defaultElevationChain } from "@/adapters/elevation/chain";
import { makeLru } from "@/adapters/http";
import type { ElevationSourceId } from "@/adapters/types";
import type { LonLat } from "@/engine/types";

export const runtime = "nodejs";

const MAX_POINTS = 400;
const cache = makeLru<{ elevFt: number | null; source: ElevationSourceId; resolutionM?: number }>(5000);

const bodySchema = z.object({
  points: z.array(z.tuple([z.number().min(-180).max(180), z.number().min(-90).max(90)])).max(MAX_POINTS),
});

function keyOf([lon, lat]: LonLat): string {
  return `${lon.toFixed(6)},${lat.toFixed(6)}`;
}

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "bad_request", issues: { errors: ["body must be JSON"] } }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ ok: false, error: "bad_request", issues: z.treeifyError(parsed.error) }, { status: 400 });
  }
  const points = parsed.data.points as LonLat[];
  const elevationsFt: (number | null)[] = points.map(() => null);
  const sources = new Set<ElevationSourceId>();
  let resolutionM: number | undefined;

  // Resolve from cache; collect unknown points (deduplicated by key).
  const missingKeys: string[] = [];
  const missingByKey = new Map<string, LonLat>();
  points.forEach((p, i) => {
    const k = keyOf(p);
    const hit = cache.get(k);
    if (hit) {
      elevationsFt[i] = hit.elevFt;
      sources.add(hit.source);
      if (resolutionM === undefined && hit.resolutionM !== undefined) resolutionM = hit.resolutionM;
    } else if (!missingByKey.has(k)) {
      missingByKey.set(k, p);
      missingKeys.push(k);
    }
  });

  let upstreamSource: ElevationSourceId | undefined;
  if (missingKeys.length > 0) {
    const upstream = await defaultElevationChain().sample(
      missingKeys.map((k) => missingByKey.get(k) as LonLat),
      AbortSignal.timeout(20000),
    );
    upstreamSource = upstream.source;
    if (upstream.resolutionM !== undefined) resolutionM = upstream.resolutionM;
    const byKey = new Map<string, number | null>();
    missingKeys.forEach((k, i) => {
      const v = upstream.elevationsFt[i] ?? null;
      byKey.set(k, v);
      // Only real answers are cached: a failed lookup ('none') must stay retryable.
      if (upstream.source !== "none") cache.set(k, { elevFt: v, source: upstream.source, ...(upstream.resolutionM !== undefined ? { resolutionM: upstream.resolutionM } : {}) });
    });
    points.forEach((p, i) => {
      const k = keyOf(p);
      if (byKey.has(k)) elevationsFt[i] = byKey.get(k) ?? null;
    });
  }

  let source: ElevationSourceId;
  if (upstreamSource !== undefined) source = upstreamSource;
  else if (sources.has("3dep")) source = "3dep";
  else if (sources.has("epqs")) source = "epqs";
  else source = "none";
  if (source === "none" && elevationsFt.some((v) => v !== null)) source = sources.has("3dep") ? "3dep" : "epqs";

  return Response.json(
    { source, elevationsFt, ...(resolutionM !== undefined ? { resolutionM } : {}) },
    { headers: { "cache-control": "no-store" } },
  );
}
