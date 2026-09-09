/**
 * Parcel provider chain: Regrid (if enabled) -> one ArcGIS provider per county registry entry.
 * Providers are filtered by enabled() && covers(); the first 'found' wins. Never throws.
 * 8 s per provider, 15 s total.
 */
import type { ParcelLookupInput, ParcelLookupResult, ParcelNoneReason, ParcelProvider } from "../types";
import { ArcGisParcelProvider } from "./arcgis";
import { listCounties } from "./registry";
import { RegridParcelProvider } from "./regrid";

export interface TriedProvider {
  providerId: string;
  reason: ParcelNoneReason;
}

/** Route/UI-facing result: the contract result plus what was tried when nothing was found. */
export type ParcelChainResult =
  | Extract<ParcelLookupResult, { status: "found" }>
  | (Extract<ParcelLookupResult, { status: "none" }> & { tried: TriedProvider[] });

export interface ParcelChain {
  providers: ParcelProvider[];
  lookup(input: ParcelLookupInput, signal?: AbortSignal): Promise<ParcelChainResult>;
}

export interface ParcelChainOptions {
  perProviderMs?: number;
  totalMs?: number;
}

export function parcelChain(providers: ParcelProvider[], { perProviderMs = 8000, totalMs = 15000 }: ParcelChainOptions = {}): ParcelChain {
  return {
    providers,
    async lookup(input, signal) {
      const total = AbortSignal.timeout(totalMs);
      const outer = signal ? AbortSignal.any([signal, total]) : total;
      const tried: TriedProvider[] = [];
      let last: ParcelNoneReason | undefined;
      let lastProviderId = "chain";

      for (const p of providers) {
        let skip: ParcelNoneReason | undefined;
        try {
          if (!p.enabled()) skip = "disabled";
          else if (!p.covers(input)) skip = "no_coverage";
        } catch {
          skip = "upstream_error";
        }
        if (skip) {
          tried.push({ providerId: p.id, reason: skip });
          continue;
        }
        if (outer.aborted) {
          tried.push({ providerId: p.id, reason: "timeout" });
          last = "timeout";
          lastProviderId = p.id;
          continue;
        }

        const perProvider = AbortSignal.any([outer, AbortSignal.timeout(perProviderMs)]);
        let result: ParcelLookupResult;
        try {
          result = await p.lookup(input, perProvider);
        } catch {
          result = { status: "none", providerId: p.id, reason: perProvider.aborted ? "timeout" : "upstream_error" };
        }
        if (result.status === "found" && result.candidates.length > 0) return result;
        const reason = result.status === "none" ? result.reason : "no_match";
        tried.push({ providerId: p.id, reason });
        last = reason;
        lastProviderId = p.id;
      }

      return { status: "none", providerId: lastProviderId, reason: last ?? "no_coverage", tried };
    },
  };
}

let defaultChain: ParcelChain | undefined;

/** [regrid, ...one ArcGIS provider per registry entry], memoised. */
export function defaultParcelChain(): ParcelChain {
  if (!defaultChain) {
    defaultChain = parcelChain([new RegridParcelProvider(), ...listCounties().map((e) => new ArcGisParcelProvider(e))]);
  }
  return defaultChain;
}
