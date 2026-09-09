/**
 * Tiny formatters used by the take-off panel and the proposal PDF. Framework-free and independent
 * of the engine's money helpers so the PDF renders even while the engine is being built.
 */

/** Integer cents -> "$1,234.56" (negative -> "-$1,234.56"). */
export function formatCents(cents: number): string {
  const n = Number.isFinite(cents) ? Math.round(cents) : 0;
  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(n);
  const dollars = Math.floor(abs / 100);
  const rem = abs % 100;
  return `${sign}$${dollars.toLocaleString("en-US")}.${rem.toString().padStart(2, "0")}`;
}

/** Feet with one decimal, e.g. "718.8 ft". */
export function formatFt(ft: number, decimals = 1): string {
  if (!Number.isFinite(ft)) return "–";
  return `${ft.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })} ft`;
}

/** Quantity: integers as-is, fractions with up to 2 decimals. */
export function formatQty(qty: number): string {
  if (!Number.isFinite(qty)) return "–";
  return Number.isInteger(qty) ? qty.toLocaleString("en-US") : qty.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

/** "+1.9 %" style slope percentage from a slope factor (>= 1). */
export function formatSlopePct(slopeFactor: number): string {
  const pct = (slopeFactor - 1) * 100;
  return `${pct >= 0 ? "+" : ""}${pct.toFixed(1)} %`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}
