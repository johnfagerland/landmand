/**
 * Shared steps for the end-to-end specs. Both quote.spec.ts (live Census / Wake ArcGIS / USGS 3DEP)
 * and offline.spec.ts (route fixtures) drive the same UI flow; only the network differs.
 *
 * Assertions are on panels and their data-testids, never on map pixels: WebGL runs on SwiftShader
 * in headless Chromium and a failed map init must not mask a working measurement pipeline.
 */
import { expect, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

export const TEST_ADDRESS = "1823 White Oak Rd, Raleigh, NC 27608";
export const EXPECTED_PIN = "1704581656";
export const FIRM_NAME = "Oak City Fence Co.";

export const APP_DIR = path.resolve(__dirname, "..");
export const SAMPLE_CSV = path.join(APP_DIR, "public", "sample-price-book.csv");
export const ARTIFACTS_DIR = path.join(__dirname, "artifacts");

export function artifact(name: string): string {
  fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
  return path.join(ARTIFACTS_DIR, name);
}

/** Run a step and print how long it took (the network steps are the interesting ones). */
export async function timed<T>(label: string, fn: () => Promise<T>): Promise<T> {
  const t0 = Date.now();
  try {
    return await fn();
  } finally {
    console.log(`[e2e] ${label}: ${((Date.now() - t0) / 1000).toFixed(1)} s`);
  }
}

/** "718.8 ft" -> 718.8 */
export function parseFt(text: string): number {
  const m = /(-?[\d,]+(?:\.\d+)?)\s*ft/.exec(text);
  if (!m) throw new Error(`Expected a length in feet, got "${text}"`);
  return Number(m[1].replace(/,/g, ""));
}

/** "$12,345.67" -> 12345.67 */
export function parseDollars(text: string): number {
  const m = /\$([\d,]+\.\d{2})/.exec(text);
  if (!m) throw new Error(`Expected a dollar amount, got "${text}"`);
  return Number(m[1].replace(/,/g, ""));
}

/**
 * Locators for elements whose data-testid is used in more than one component
 * (the summary card and the take-off panel both show gate count and slope status).
 */
export function summary(page: Page) {
  const card = page.getByTestId("quote-panel").locator("dl").first();
  return {
    perimeter: page.getByTestId("parcel-perimeter"),
    flat: page.getByTestId("fence-length-flat"),
    corrected: page.getByTestId("fence-length-corrected"),
    gateCount: card.locator('[data-testid="gate-count"]'),
    slope: card.locator('[data-testid="slope-status"]'),
  };
}

/** Settings: firm name + sample price book. The price book must exist before the quote is priced. */
export async function importPriceBook(page: Page): Promise<void> {
  await page.goto("/settings");
  await page.getByTestId("firm-name").fill(FIRM_NAME);
  await page.getByTestId("pricebook-file").setInputFiles(SAMPLE_CSV);
  await expect(page.getByTestId("pricebook-imported")).toBeVisible();
  await expect(page.getByTestId("pricebook-error")).toHaveCount(0);
  const rows = page.getByTestId("pricebook-row");
  await expect.poll(() => rows.count()).toBeGreaterThan(10);
  await expect(page.getByTestId("style-wood-privacy-6")).toBeVisible();
  await page.getByTestId("firm-save").click();
  await expect(page.getByTestId("firm-saved")).toBeVisible();
  await expect(page.getByTestId("firm-error")).toHaveCount(0);
}

/** Home: submit the address and land on /quote/<uuid>. */
export async function startQuote(page: Page, address = TEST_ADDRESS): Promise<string> {
  await page.goto("/");
  await page.getByTestId("address-input").fill(address);
  await page.getByTestId("address-submit").click();
  await expect(page).toHaveURL(/\/quote\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/, { timeout: 30_000 });
  await expect(page.getByTestId("address-error")).toHaveCount(0);
  return page.url();
}

/** Wait for the county lookup, pick the first (largest, address-matched) candidate, check the perimeter. */
export async function selectParcel(page: Page, lookupTimeoutMs: number): Promise<number> {
  await expect(page.getByTestId("parcel-none")).toHaveCount(0);
  await expect(page.getByTestId("parcel-candidates")).toBeVisible({ timeout: lookupTimeoutMs });
  const first = page.getByTestId("parcel-candidate-0");
  await expect(first).toContainText(EXPECTED_PIN);
  await expect(first).toContainText("0.42 ac");
  await first.click();
  await expect(first).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByTestId("parcel-status")).toContainText("Wake County");
  const s = summary(page);
  await expect(s.perimeter).toHaveText(/7\d\d\.\d ft/);
  await expect(page.getByTestId("map-canvas")).toBeVisible();
  return parseFt(await s.perimeter.innerText());
}

/** "Use parcel edge": the fence follows the lot lines. */
export async function useParcelEdge(page: Page, perimeterFt: number): Promise<number> {
  const s = summary(page);
  await page.getByTestId("use-parcel-edge").click();
  await expect(s.flat).toHaveText(/\d+\.\d ft/);
  const flat = parseFt(await s.flat.innerText());
  expect(Math.abs(flat - perimeterFt), `fence flat ${flat} vs perimeter ${perimeterFt}`).toBeLessThanOrEqual(1);
  await expect.poll(() => page.getByTestId("segment-row").count()).toBeGreaterThanOrEqual(8);
  return flat;
}

/** Add a 4 ft gate on side 1 and check both the gate count and the "less gates" length. */
export async function addGateOnFirstSide(page: Page, flatFt: number): Promise<void> {
  const s = summary(page);
  await page.getByTestId("segment-0-add-gate").click();
  const row = page.getByTestId("gate-row");
  await expect(row).toHaveCount(1);
  const width = row.getByTestId("gate-width");
  await width.fill("4");
  await width.blur();
  await expect(width).toHaveValue("4");
  await expect(s.gateCount).toHaveText("1");
  await expect(page.getByTestId("takeoff-gates")).toHaveText("1");
  await expect(page.getByTestId("segment-row").first()).toContainText("1 gate");
  // The flat fence length is unchanged; the take-off's "fence (less gates)" drops by the gate width.
  await expect(s.flat).toHaveText(`${flatFt.toFixed(1)} ft`);
  await expect
    .poll(async () => parseFt(await page.getByTestId("takeoff-length-fence").innerText()), { message: "fence less gates" })
    .toBeCloseTo(flatFt - 4, 0);
  const lessGates = parseFt(await page.getByTestId("takeoff-length-fence").innerText());
  expect(Math.abs(flatFt - 4 - lessGates), `less-gates ${lessGates} vs flat-4 ${flatFt - 4}`).toBeLessThanOrEqual(0.15);
}

/** Wait until the slope badge settles on applied|unavailable and report which. */
export async function waitForSlope(page: Page, timeoutMs: number): Promise<string> {
  const badge = summary(page).slope;
  try {
    await expect(badge).toHaveText(/^(applied|unavailable)$/, { timeout: timeoutMs });
  } catch (err) {
    const text = await badge.innerText().catch(() => "<missing>");
    throw new Error(`slope-status stayed "${text}" for ${timeoutMs / 1000} s (expected "applied" or "unavailable"): ${String(err)}`);
  }
  const status = (await badge.innerText()).trim();
  console.log(`[e2e] slope-status: ${status}`);
  return status;
}

/** Take-off: pick the wood privacy style and read the total. */
export async function priceTakeOff(page: Page): Promise<number> {
  await expect(page.getByTestId("takeoff-panel")).toBeVisible();
  await expect(page.getByTestId("takeoff-no-pricebook")).toHaveCount(0);
  const style = page.getByTestId("style-select");
  if ((await style.inputValue()) !== "wood-privacy-6") await style.selectOption("wood-privacy-6");
  await expect(style).toHaveValue("wood-privacy-6");
  const total = page.getByTestId("takeoff-total");
  await expect(total).toHaveText(/\$[\d,]+\.\d{2}/);
  const dollars = parseDollars(await total.innerText());
  expect(dollars, `take-off total ${dollars}`).toBeGreaterThan(1000);
  await expect(page.getByTestId("takeoff-line").first()).toBeVisible();
  console.log(`[e2e] take-off total: $${dollars.toFixed(2)}`);
  return dollars;
}

/** Download the proposal and check it is a real PDF. */
export async function downloadProposal(page: Page, fileName: string): Promise<string> {
  const button = page.getByTestId("download-proposal");
  await expect(button).toBeEnabled();
  const [download] = await Promise.all([page.waitForEvent("download", { timeout: 60_000 }), button.click()]);
  const target = artifact(fileName);
  await download.saveAs(target);
  await expect(page.getByTestId("proposal-error")).toHaveCount(0);
  const stat = fs.statSync(target);
  expect(stat.size, "proposal PDF size").toBeGreaterThan(10 * 1024);
  const head = Buffer.alloc(4);
  const fd = fs.openSync(target, "r");
  fs.readSync(fd, head, 0, 4, 0);
  fs.closeSync(fd);
  expect(head.toString("latin1")).toBe("%PDF");
  console.log(`[e2e] proposal PDF: ${target} (${(stat.size / 1024).toFixed(1)} KB)`);
  return target;
}

/** Let the debounced localStorage write flush, then confirm the store reports it. */
export async function waitForSaved(page: Page): Promise<void> {
  await page.waitForTimeout(1200);
  await expect(page.getByTestId("persist-status")).toHaveText("Saved");
}
