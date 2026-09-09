/** Test helpers: a recording fetch mock and fixture loading. */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { vi } from "vitest";

export function fixture<T = unknown>(name: string): T {
  return JSON.parse(readFileSync(join(__dirname, "fixtures", name), "utf8")) as T;
}

export interface RecordedCall {
  url: string;
  method: string;
  body: string | undefined;
  params: URLSearchParams;
}

export type Responder = (call: RecordedCall, index: number) => Response | Promise<Response> | Error;

export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}

/** Installs a fetch stub; `responder` returns a Response or an Error to reject with. */
export function mockFetch(responder: Responder): { calls: RecordedCall[] } {
  const calls: RecordedCall[] = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
      const body = typeof init?.body === "string" ? init.body : undefined;
      const call: RecordedCall = { url, method: init?.method ?? "GET", body, params: new URLSearchParams(body ?? new URL(url).search) };
      calls.push(call);
      const r = await responder(call, calls.length - 1);
      if (r instanceof Error) throw r;
      return r;
    }),
  );
  return { calls };
}

export const never = new AbortController().signal;
