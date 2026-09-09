/**
 * GET /api/parcel?lon=&lat=&county=<5-digit FIPS>&number=&street=
 *   200 { status: "found", providerId, candidates: ParcelCandidate[] }
 *   200 { status: "none", providerId, reason, tried: { providerId, reason }[] }
 *   400 { ok: false, error: "bad_request", issues }
 * Never 5xx for an upstream failure: the UI falls back to manual draw on status "none".
 * Found results are cached in a module LRU (500 x 24 h) keyed on county + 6-dp lon/lat + number + street.
 */
import { z } from "zod";
import { makeLru } from "@/adapters/http";
import { defaultParcelChain, type ParcelChainResult } from "@/adapters/parcel/chain";

export const runtime = "nodejs";

const DAY_MS = 24 * 60 * 60 * 1000;
const CACHE_CONTROL = "public, s-maxage=86400, stale-while-revalidate=604800";
const cache = makeLru<Extract<ParcelChainResult, { status: "found" }>>(500, DAY_MS);

const querySchema = z.object({
  lon: z.coerce.number().min(-180).max(180),
  lat: z.coerce.number().min(-90).max(90),
  county: z
    .string()
    .trim()
    .regex(/^\d{5}$/, "5-digit county FIPS")
    .optional(),
  number: z.string().trim().max(20).optional(),
  street: z.string().trim().max(120).optional(),
});

function opt(v: string | null): string | undefined {
  return v === null || v.trim() === "" ? undefined : v;
}

export async function GET(request: Request): Promise<Response> {
  const sp = new URL(request.url).searchParams;
  const parsed = querySchema.safeParse({
    lon: sp.get("lon"),
    lat: sp.get("lat"),
    county: opt(sp.get("county")),
    number: opt(sp.get("number")),
    street: opt(sp.get("street")),
  });
  if (!parsed.success) {
    return Response.json({ ok: false, error: "bad_request", issues: z.treeifyError(parsed.error) }, { status: 400 });
  }
  const { lon, lat, county, number, street } = parsed.data;
  const key = [county ?? "", lon.toFixed(6), lat.toFixed(6), (number ?? "").toUpperCase(), (street ?? "").toUpperCase()].join("|");

  const hit = cache.get(key);
  if (hit) return Response.json(hit, { headers: { "cache-control": CACHE_CONTROL, "x-cache": "hit" } });

  const result = await defaultParcelChain().lookup(
    { lonLat: [lon, lat], ...(number ? { number } : {}), ...(street ? { street } : {}), ...(county ? { countyFips: county } : {}) },
    AbortSignal.timeout(15000),
  );
  if (result.status === "found") {
    cache.set(key, result);
    return Response.json(result, { headers: { "cache-control": CACHE_CONTROL, "x-cache": "miss" } });
  }
  return Response.json(result, { headers: { "cache-control": "no-store" } });
}
