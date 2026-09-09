/**
 * Offline end-to-end: the same flow as quote.spec.ts with /api/geocode, /api/parcel and /api/elevation
 * fulfilled from fixtures, so it runs with no access to Census, Wake County or USGS.
 * /api/proposal renders server-side without any upstream call and runs for real. NAIP basemap tiles
 * are not mocked (the map may stay grey; nothing is asserted on it).
 */
import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import type { FeatureCollection, Polygon } from "geojson";
import type { GeocodeResult, ParcelCandidate } from "../src/adapters/types";
import { distanceToPolygonFt, normalizeParcel } from "../src/adapters/parcel/normalize";
import type { LonLat } from "../src/engine/types";
import {
  addGateOnFirstSide,
  APP_DIR,
  artifact,
  downloadProposal,
  EXPECTED_PIN,
  importPriceBook,
  priceTakeOff,
  selectParcel,
  startQuote,
  summary,
  useParcelEdge,
  waitForSaved,
  waitForSlope,
} from "./helpers";

const FIXTURE_DIR = path.join(APP_DIR, "src", "adapters", "__tests__", "fixtures");
const WAKE_FIXTURE = path.join(FIXTURE_DIR, "wake-address-1823-white-oak.geojson");
const PROVIDER_ID = "county:37183";
const ATTRIBUTION = "Lot lines: Wake County GIS";
const FLAT_ELEVATION_FT = 300;

/** What /api/geocode returns for the test address (from census-geographies-1823-white-oak.json). */
const GEOCODE: GeocodeResult = {
  lonLat: [-78.64499470005, 35.806148477923],
  matched: "1823 WHITE OAK RD, RALEIGH, NC, 27608",
  number: "1823",
  street: "WHITE OAK RD",
  city: "RALEIGH",
  state: "NC",
  zip: "27608",
  countyFips: "37183",
};

interface WakeProps {
  PIN_NUM: string;
  SITE_ADDRESS: string;
  CALC_AREA: number;
}

/** Run the captured Wake GeoJSON through the app's own normaliser: same candidates the live route would return. */
function parcelCandidates(point: LonLat): ParcelCandidate[] {
  const fc = JSON.parse(fs.readFileSync(WAKE_FIXTURE, "utf8")) as FeatureCollection<Polygon, WakeProps>;
  const out: ParcelCandidate[] = [];
  for (const f of fc.features) {
    const parcel = normalizeParcel({
      geometry: f.geometry,
      providerId: PROVIDER_ID,
      source: "county",
      attribution: ATTRIBUTION,
      apn: f.properties.PIN_NUM,
      siteAddress: f.properties.SITE_ADDRESS,
      point,
      fetchedAt: "2026-09-08T00:00:00.000Z",
    });
    if (!parcel) throw new Error(`fixture feature ${f.properties.PIN_NUM} did not normalise`);
    const distanceFt = Number(distanceToPolygonFt(point, f.geometry).toFixed(1));
    out.push({ parcel, match: "address", distanceFt, score: 100 });
  }
  return out.sort((a, b) => b.score - a.score || a.distanceFt - b.distanceFt);
}

interface FixtureHits {
  geocode: number;
  parcel: number;
  elevation: number;
  /** Query the app sent to /api/parcel (asserted in the parcel step, outside the route handler). */
  parcelQuery: Record<string, string> | null;
  /** Point counts of each /api/elevation request. */
  elevationBatches: number[];
}

async function installFixtures(page: Page): Promise<FixtureHits> {
  const hits: FixtureHits = { geocode: 0, parcel: 0, elevation: 0, parcelQuery: null, elevationBatches: [] };
  const candidates = parcelCandidates(GEOCODE.lonLat);
  expect(candidates.map((c) => c.parcel.apn)).toContain(EXPECTED_PIN);

  await page.route("**/api/geocode**", async (route) => {
    hits.geocode++;
    const q = new URL(route.request().url()).searchParams.get("q") ?? "";
    const result = /1823\s+white\s+oak/i.test(q) ? GEOCODE : null;
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true, result }) });
  });

  await page.route("**/api/parcel**", async (route) => {
    hits.parcel++;
    hits.parcelQuery = Object.fromEntries(new URL(route.request().url()).searchParams);
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ status: "found", providerId: PROVIDER_ID, candidates }),
    });
  });

  await page.route("**/api/elevation**", async (route) => {
    hits.elevation++;
    const body = route.request().postDataJSON() as { points?: unknown[] } | null;
    const n = Array.isArray(body?.points) ? body.points.length : 0;
    hits.elevationBatches.push(n);
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ source: "3dep", elevationsFt: Array.from({ length: n }, () => FLAT_ELEVATION_FT), resolutionM: 1 }),
    });
  });

  return hits;
}

test.describe.configure({ mode: "serial" });

test("quote flow with geocode, parcel and elevation fixtures", async ({ page }) => {
  test.setTimeout(180_000);
  const hits = await installFixtures(page);

  await test.step("settings: firm name + sample price book", async () => {
    await importPriceBook(page);
    await page.screenshot({ path: artifact("offline-settings.png"), fullPage: true });
  });

  await test.step("home: address -> /quote/<uuid>", async () => {
    await startQuote(page);
    expect(hits.geocode).toBe(1);
  });

  let perimeterFt = 0;
  await test.step("parcel: fixture candidates, pick the 0.42 ac lot", async () => {
    perimeterFt = await selectParcel(page, 15_000);
    expect(hits.parcel).toBe(1);
    expect(hits.parcelQuery).toMatchObject({ county: "37183", number: "1823", street: "WHITE OAK RD" });
    // The Wake ring for PIN 1704581656 measures 718.8 ft in the engine's local plane.
    expect(perimeterFt).toBeGreaterThan(717);
    expect(perimeterFt).toBeLessThan(721);
  });

  let flatFt = 0;
  await test.step("fence: use parcel edge", async () => {
    flatFt = await useParcelEdge(page, perimeterFt);
  });

  await test.step("gate: 4 ft on side 1", async () => {
    await addGateOnFirstSide(page, flatFt);
  });

  await test.step("slope: synthetic flat 3DEP reply", async () => {
    const status = await waitForSlope(page, 20_000);
    // Every segment got a 3DEP profile, so the summary reports "applied" even though the ground is level.
    expect(status).toBe("applied");
    expect(hits.elevation).toBeGreaterThanOrEqual(1);
    for (const n of hits.elevationBatches) {
      expect(n).toBeGreaterThan(0);
      expect(n).toBeLessThanOrEqual(400);
    }
    const s = summary(page);
    await expect(s.corrected).toHaveText(await s.flat.innerText());
    await expect(page.getByTestId("takeoff-panel").getByTestId("slope-status")).toHaveAttribute("data-status", "flat");
  });

  await test.step("take-off: wood privacy 6 ft", async () => {
    await priceTakeOff(page);
  });

  await test.step("proposal PDF (real server render)", async () => {
    await downloadProposal(page, "offline-proposal.pdf");
  });

  await test.step("screenshot", async () => {
    // Show the summary, parcel picker and fence tools rather than wherever the last click scrolled to.
    await page.getByTestId("quote-panel").evaluate((el) => el.scrollTo({ top: 0 }));
    await page.screenshot({ path: artifact("offline-quote.png"), fullPage: false });
  });

  await test.step("persistence: reload + recent quotes", async () => {
    await waitForSaved(page);
    const s = summary(page);
    const flatText = await s.flat.innerText();
    await page.reload();
    await expect(s.flat).toHaveText(flatText);
    await expect(s.gateCount).toHaveText("1");
    await expect(s.slope).toHaveText("applied");
    await page.goto("/");
    await expect.poll(() => page.getByTestId("recent-quote").count()).toBeGreaterThanOrEqual(1);
  });

  console.log(`[e2e] fixture hits: ${JSON.stringify(hits)}`);
});
