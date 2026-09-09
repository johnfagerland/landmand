/** Dollars (possibly with fractional cents from a CSV) to integer cents, half-up. */
export function toCents(dollars: number): number {
  if (!Number.isFinite(dollars)) return 0;
  // toPrecision strips binary residue such as 1.005 * 100 = 100.49999999999999 before rounding.
  const scaled = Number((dollars * 100).toPrecision(12));
  return roundHalfUp(scaled);
}

/** "$1,234.56"; negative values render as "-$1,234.56". */
export function formatCents(cents: number): string {
  const rounded = roundHalfUp(Number.isFinite(cents) ? cents : 0);
  const sign = rounded < 0 ? "-" : "";
  const abs = Math.abs(rounded);
  const dollars = Math.floor(abs / 100);
  const rem = abs % 100;
  const dollarStr = dollars.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${sign}$${dollarStr}.${rem.toString().padStart(2, "0")}`;
}

/** Round half up (toward +∞ at .5), i.e. 2.5 -> 3, -2.5 -> -2. */
export function roundHalfUp(x: number): number {
  return Math.floor(x + 0.5);
}

export function extendedCents(qty: number, unitPriceCents: number): number {
  return roundHalfUp(qty * unitPriceCents);
}

/** tax on the taxable subtotal at ratePct, half-up. */
export function taxCents(taxableSubtotalCents: number, ratePct: number): number {
  if (!Number.isFinite(ratePct) || ratePct <= 0) return 0;
  return roundHalfUp(Number(((taxableSubtotalCents * ratePct) / 100).toPrecision(12)));
}
