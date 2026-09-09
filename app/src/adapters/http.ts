/**
 * Shared HTTP plumbing for the server-only adapters: JSON fetch with a hard timeout,
 * one retry on network errors / 5xx, typed failures, and a small LRU factory.
 *
 * Error messages never include the full URL (query strings can carry API tokens); only the host.
 */
import { LRUCache } from "lru-cache";

export type UpstreamErrorKind = "timeout" | "upstream";

export class UpstreamError extends Error {
  readonly kind: UpstreamErrorKind;
  readonly status?: number;

  constructor(kind: UpstreamErrorKind, message: string, status?: number) {
    super(message);
    this.name = "UpstreamError";
    this.kind = kind;
    this.status = status;
  }
}

export function isUpstreamError(err: unknown): err is UpstreamError {
  return err instanceof UpstreamError;
}

export interface FetchJsonOptions {
  /** Hard deadline for the whole call including the retry. Default 8000. */
  timeoutMs?: number;
  /** Extra attempts after a network error or 5xx. Default 1. */
  retries?: number;
}

function hostOf(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return "upstream";
  }
}

function isAbortLike(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const name = (err as { name?: unknown }).name;
  return name === "AbortError" || name === "TimeoutError";
}

function combineSignals(timeoutMs: number, caller?: AbortSignal | null): AbortSignal {
  const signals = [AbortSignal.timeout(timeoutMs)];
  if (caller) signals.push(caller);
  return AbortSignal.any(signals);
}

/**
 * fetch + JSON parse with AbortSignal.timeout combined with the caller's signal.
 * Retries once on a network error or a 5xx response; never on 4xx, abort or bad JSON.
 * Throws UpstreamError only.
 */
export async function fetchJson<T = unknown>(
  url: string,
  init: RequestInit = {},
  { timeoutMs = 8000, retries = 1 }: FetchJsonOptions = {},
): Promise<T> {
  const host = hostOf(url);
  const signal = combineSignals(timeoutMs, init.signal);
  let lastError: UpstreamError | undefined;

  for (let attempt = 0; attempt <= retries; attempt++) {
    if (signal.aborted) throw new UpstreamError("timeout", `Timed out after ${timeoutMs} ms talking to ${host}`);

    let res: Response;
    try {
      res = await fetch(url, { ...init, signal });
    } catch (err) {
      if (signal.aborted || isAbortLike(err)) {
        throw new UpstreamError("timeout", `Timed out after ${timeoutMs} ms talking to ${host}`);
      }
      const detail = err instanceof Error ? err.message : String(err);
      lastError = new UpstreamError("upstream", `Network error talking to ${host}: ${detail}`);
      continue;
    }

    if (res.status >= 500) {
      lastError = new UpstreamError("upstream", `HTTP ${res.status} from ${host}`, res.status);
      continue;
    }
    if (!res.ok) {
      throw new UpstreamError("upstream", `HTTP ${res.status} from ${host}`, res.status);
    }

    try {
      return (await res.json()) as T;
    } catch (err) {
      if (signal.aborted || isAbortLike(err)) {
        throw new UpstreamError("timeout", `Timed out after ${timeoutMs} ms reading from ${host}`);
      }
      throw new UpstreamError("upstream", `Invalid JSON from ${host}`, res.status);
    }
  }

  throw lastError ?? new UpstreamError("upstream", `Request to ${host} failed`);
}

/** String-keyed LRU with an optional TTL. Values must be non-nullish (wrap nulls). */
export function makeLru<V extends object | string | number | boolean>(max: number, ttlMs?: number): LRUCache<string, V> {
  return new LRUCache<string, V>({ max, ...(ttlMs ? { ttl: ttlMs } : {}) });
}

/** Encode a params object as application/x-www-form-urlencoded (for POSTs to ArcGIS servers). */
export function formBody(params: Record<string, string | number | boolean | undefined>): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined) continue;
    sp.set(k, String(v));
  }
  return sp.toString();
}

export const FORM_HEADERS = { "content-type": "application/x-www-form-urlencoded", accept: "application/json" } as const;
