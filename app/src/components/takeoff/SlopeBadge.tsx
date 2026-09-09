import { formatSlopePct } from "@/lib/pdf/format";

export type SlopeStatus = "applied" | "flat" | "unavailable";

/**
 * Decide the badge state: no elevation on any segment -> unavailable; corrected > flat -> applied; else flat.
 * `profileCount` is the number of segments with a usable profile, `segmentCount` the total.
 */
export function slopeStatus(slopeFactor: number, profileCount: number, segmentCount: number): SlopeStatus {
  if (segmentCount === 0 || profileCount === 0) return "unavailable";
  return slopeFactor > 1.0005 ? "applied" : "flat";
}

export function SlopeBadge({ status, slopeFactor = 1, partial = false }: { status: SlopeStatus; slopeFactor?: number; partial?: boolean }) {
  const text =
    status === "applied"
      ? `slope applied (${formatSlopePct(slopeFactor)})${partial ? ", some sides flat" : ""}`
      : status === "flat"
        ? "flat"
        : "slope unavailable";
  const tone =
    status === "applied"
      ? "bg-emerald-50 text-emerald-800 ring-emerald-200"
      : status === "flat"
        ? "bg-zinc-100 text-zinc-700 ring-zinc-200"
        : "bg-amber-50 text-amber-800 ring-amber-200";
  return (
    <span
      data-testid="slope-status"
      data-status={status}
      title={
        status === "unavailable"
          ? "No USGS elevation for this fence yet; lengths are horizontal."
          : status === "applied"
            ? "Lengths corrected for terrain using USGS 3DEP elevation."
            : "Terrain is level along the fence; no correction needed."
      }
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${tone}`}
    >
      {text}
    </span>
  );
}
