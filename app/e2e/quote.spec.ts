/**
 * Live end-to-end: Settings (price book) -> address -> Wake County parcel -> fence -> gate -> slope ->
 * take-off -> proposal PDF -> persistence. Calls the real Census geocoder, Wake County ArcGIS and USGS
 * 3DEP through the app's own API routes, so the network steps get generous timeouts.
 */
import { expect, test } from "@playwright/test";
import {
  addGateOnFirstSide,
  artifact,
  downloadProposal,
  importPriceBook,
  priceTakeOff,
  selectParcel,
  startQuote,
  summary,
  timed,
  useParcelEdge,
  waitForSaved,
  waitForSlope,
} from "./helpers";

test.describe.configure({ mode: "serial" });

test("quote flow against live county, Census and USGS services", async ({ page }) => {
  test.setTimeout(300_000);

  await test.step("settings: firm name + sample price book", async () => {
    await importPriceBook(page);
    await page.screenshot({ path: artifact("settings.png"), fullPage: true });
  });

  await test.step("home: address -> /quote/<uuid>", async () => {
    await timed("geocode (Census)", () => startQuote(page));
  });

  let perimeterFt = 0;
  await test.step("parcel: Wake County candidates, pick the 0.42 ac lot", async () => {
    perimeterFt = await timed("parcel lookup (Wake ArcGIS)", () => selectParcel(page, 30_000));
    expect(perimeterFt).toBeGreaterThan(700);
    expect(perimeterFt).toBeLessThan(800);
  });

  let flatFt = 0;
  await test.step("fence: use parcel edge", async () => {
    flatFt = await useParcelEdge(page, perimeterFt);
  });

  await test.step("gate: 4 ft on side 1", async () => {
    await addGateOnFirstSide(page, flatFt);
  });

  await test.step("slope: USGS 3DEP", async () => {
    await timed("elevation (3DEP/EPQS)", () => waitForSlope(page, 40_000));
  });

  await test.step("take-off: wood privacy 6 ft", async () => {
    await priceTakeOff(page);
  });

  await test.step("proposal PDF", async () => {
    await timed("proposal PDF (server render)", () => downloadProposal(page, "proposal.pdf"));
  });

  await test.step("screenshot", async () => {
    // Show the summary, parcel picker and fence tools rather than wherever the last click scrolled to.
    await page.getByTestId("quote-panel").evaluate((el) => el.scrollTo({ top: 0 }));
    await page.screenshot({ path: artifact("quote.png"), fullPage: false });
  });

  await test.step("persistence: reload + recent quotes", async () => {
    await waitForSaved(page);
    const s = summary(page);
    const flatText = await s.flat.innerText();
    const url = page.url();
    await page.reload();
    await expect(page).toHaveURL(url);
    await expect(s.flat).toHaveText(flatText);
    await expect(s.gateCount).toHaveText("1");
    await expect(page.getByTestId("gate-row")).toHaveCount(1);
    await expect(page.getByTestId("parcel-status")).toContainText("Wake County");
    await expect(page.getByTestId("takeoff-total")).toHaveText(/\$[\d,]+\.\d{2}/);
    await page.goto("/");
    await expect.poll(() => page.getByTestId("recent-quote").count()).toBeGreaterThanOrEqual(1);
    await expect(page.getByTestId("recent-quote").first()).toContainText("1823 White Oak Rd");
  });
});
