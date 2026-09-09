/**
 * GET /api/geocode?q=<address>
 *   200 { ok: true, result: GeocodeResult | null }   (null = no match)
 *   400 { ok: false, error: "bad_request", issues }
 *   502 { ok: false, error: "upstream" }
 * Cached in a module LRU (500 x 24 h, keyed on the normalised query) and via Cache-Control.
 */
import { z } from "zod";
import { censusGeocoder } from "@/adapters/geocoder/census";
import { makeLru } from "@/adapters/http";
import type { GeocodeResult } from "@/adapters/types";

export const runtime = "nodejs";

const DAY_MS = 24 * 60 * 60 * 1000;
const CACHE_CONTROL = "public, s-maxage=86400, stale-while-revalidate=604800";
const cache = makeLru<{ result: GeocodeResult | null }>(500, DAY_MS);

const querySchema = z.object({ q: z.string().trim().min(5).max(200) });

function normalise(q: string): string {
  return q.toLowerCase().replace(/\s+/g, " ").trim();
}

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const parsed = querySchema.safeParse({ q: url.searchParams.get("q") ?? "" });
  if (!parsed.success) {
    return Response.json({ ok: false, error: "bad_request", issues: z.treeifyError(parsed.error) }, { status: 400 });
  }
  const key = normalise(parsed.data.q);
  const hit = cache.get(key);
  if (hit) {
    return Response.json({ ok: true, result: hit.result }, { headers: { "cache-control": CACHE_CONTROL, "x-cache": "hit" } });
  }
  try {
    const result = await censusGeocoder.geocode(parsed.data.q, AbortSignal.timeout(8000));
    cache.set(key, { result });
    return Response.json({ ok: true, result }, { headers: { "cache-control": CACHE_CONTROL, "x-cache": "miss" } });
  } catch {
    return Response.json({ ok: false, error: "upstream" }, { status: 502, headers: { "cache-control": "no-store" } });
  }
}
