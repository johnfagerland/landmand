/**
 * Elevation chain: 3DEP -> EPQS -> { source: 'none', all nulls }.
 * A partial 3DEP result (some nulls) is kept as-is; the next provider only runs when a result has NO data at all.
 */
import type { LonLat } from "@/engine/types";
import type { ElevationProvider, ElevationResult } from "../types";
import { epqsProvider } from "./epqs";
import { threeDepProvider } from "./threedep";

export function elevationChain(providers: ElevationProvider[]): ElevationProvider {
  return {
    id: "chain",
    async sample(points: LonLat[], signal: AbortSignal): Promise<ElevationResult> {
      if (points.length === 0) return { source: "none", elevationsFt: [] };
      for (const p of providers) {
        if (signal.aborted) break;
        let r: ElevationResult;
        try {
          r = await p.sample(points, signal);
        } catch {
          continue;
        }
        if (r.source === "none" || r.elevationsFt.length !== points.length) continue;
        if (r.elevationsFt.some((v) => v !== null)) return r;
      }
      return { source: "none", elevationsFt: points.map(() => null) };
    },
  };
}

let defaultChain: ElevationProvider | undefined;

export function defaultElevationChain(): ElevationProvider {
  if (!defaultChain) defaultChain = elevationChain([threeDepProvider, epqsProvider]);
  return defaultChain;
}
