/**
 * Typed fetchers for the app's own route handlers (src/app/api/**).
 * The browser never calls Census / ArcGIS / USGS directly; these routes proxy and cache them.
 */
import type { ElevationResult, GeocodeResult, ParcelCandidate } from "@/adapters/types";
import type { FirmSettings, LonLat, Quote, TakeOff } from "@/engine/types";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export type ParcelApiResult =
  | { status: "found"; providerId: string; candidates: ParcelCandidate[] }
  | { status: "none"; tried?: unknown[]; reason?: string; providerId?: string };

export interface ParcelLookupParams {
  lon: number;
  lat: number;
  county?: string;
  number?: string;
  street?: string;
}

const ELEVATION_CHUNK = 400;

async function readJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new ApiError(`Bad JSON from ${res.url} (${res.status})`, res.status, "bad_json");
  }
}

/** GET /api/geocode?q= → the matched address or null. Throws ApiError on transport / upstream failure. */
export async function geocode(q: string, signal?: AbortSignal): Promise<GeocodeResult | null> {
  const res = await fetch(`/api/geocode?q=${encodeURIComponent(q)}`, { signal });
  const body = await readJson<{ ok?: boolean; result?: GeocodeResult | null; error?: string }>(res);
  if (!res.ok || body.ok === false) {
    throw new ApiError(
      body.error === "upstream" || res.status >= 500
        ? "Couldn't reach the address service, try again"
        : body.error || `Address lookup failed (${res.status})`,
      res.status,
      body.error,
    );
  }
  return body.result ?? null;
}

/** GET /api/parcel → candidates or none. Always resolves; transport failures become { status: 'none' }. */
export async function lookupParcel(params: ParcelLookupParams, signal?: AbortSignal): Promise<ParcelApiResult> {
  const qs = new URLSearchParams({ lon: String(params.lon), lat: String(params.lat) });
  if (params.county) qs.set("county", params.county);
  if (params.number) qs.set("number", params.number);
  if (params.street) qs.set("street", params.street);
  try {
    const res = await fetch(`/api/parcel?${qs.toString()}`, { signal });
    if (!res.ok) return { status: "none", reason: `http_${res.status}` };
    const body = await readJson<ParcelApiResult>(res);
    if (body.status === "found" && Array.isArray(body.candidates)) return body;
    return { status: "none", tried: (body as { tried?: unknown[] }).tried, reason: (body as { reason?: string }).reason };
  } catch (err) {
    if (signal?.aborted) throw err;
    return { status: "none", reason: "transport" };
  }
}

/** POST /api/elevation in chunks of 400 points; the result keeps input order. Never throws: failures → source 'none'. */
export async function sampleElevation(points: LonLat[], signal?: AbortSignal): Promise<ElevationResult> {
  if (points.length === 0) return { source: "none", elevationsFt: [] };
  const elevationsFt: (number | null)[] = [];
  let source: ElevationResult["source"] = "none";
  let resolutionM: number | undefined;
  for (let i = 0; i < points.length; i += ELEVATION_CHUNK) {
    const chunk = points.slice(i, i + ELEVATION_CHUNK);
    try {
      const res = await fetch("/api/elevation", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ points: chunk }),
        signal,
      });
      if (!res.ok) throw new ApiError(`elevation ${res.status}`, res.status);
      const body = await readJson<ElevationResult>(res);
      const values = Array.isArray(body.elevationsFt) ? body.elevationsFt : [];
      for (let j = 0; j < chunk.length; j++) {
        const v = values[j];
        elevationsFt.push(typeof v === "number" && Number.isFinite(v) ? v : null);
      }
      if (body.source && body.source !== "none") {
        source = body.source;
        if (typeof body.resolutionM === "number") resolutionM = body.resolutionM;
      }
    } catch (err) {
      if (signal?.aborted) throw err;
      for (let j = 0; j < chunk.length; j++) elevationsFt.push(null);
    }
  }
  return resolutionM === undefined ? { source, elevationsFt } : { source, elevationsFt, resolutionM };
}

export interface ProposalRequest {
  quote: Quote;
  takeoff: TakeOff;
  firm: FirmSettings;
}

/** POST /api/proposal → PDF blob. Throws ApiError with the server's message on failure. */
export async function requestProposal(input: ProposalRequest, signal?: AbortSignal): Promise<Blob> {
  const res = await fetch("/api/proposal", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
    signal,
  });
  if (!res.ok) {
    let message = `Proposal failed (${res.status})`;
    try {
      const body = (await res.json()) as { error?: string; message?: string };
      message = body.error || body.message || message;
    } catch {
      /* not JSON */
    }
    throw new ApiError(message, res.status);
  }
  return res.blob();
}
