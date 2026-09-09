# Fenceline

Fence-first measurement and instant quotes for US fence contractors. Type a job address; Fenceline pulls the lot lines from the county's parcel service, lets the contractor snap the fence to the lot edge (or draw it by hand) on public-domain aerial imagery, adds gates and setbacks, corrects the run lengths for terrain with USGS elevation, prices the job from the contractor's own price book and renders a proposal PDF. Phase A is a single-browser, local-storage app with no accounts. The product research behind it is in [`../research/13-deep-dive-idea-09.md`](../research/13-deep-dive-idea-09.md); the architecture map and directory rules are in [`AGENTS.md`](AGENTS.md).

## Three hard constraints

1. **Never measure from Google Maps or Mapbox imagery.** Their terms forbid tracing. Geometry comes only from county parcel data (ArcGIS REST) or Regrid, and slope from USGS 3DEP. Basemap tiles are display-only and public domain (USGS/USDA NAIP). `scripts/check-tos.sh` fails `pnpm build` on any Google Maps / Mapbox reference in `src/`.
2. **No invented "market" pricing.** The take-off applies the contractor's own price book (CSV) with each style's spacing rules. Nothing guesses a price.
3. **Never surface a raw "missing parcel data" error.** Fall back: Regrid (if a token is set) → county ArcGIS registry → let the contractor draw the boundary by hand.

## Requirements

- Node 22
- pnpm 10 (`corepack enable` picks up the pinned version from `package.json`)

## Run it

```bash
pnpm install
cp .env.example .env.local   # every variable is optional
pnpm dev                     # http://localhost:3000
```

`.env.local`:

| Variable | Default | Purpose |
| --- | --- | --- |
| `REGRID_TOKEN` | empty | Regrid parcel API token. Blank = county ArcGIS endpoints only. |
| `NEXT_PUBLIC_BASEMAP` | `naip` | `naip` (USGS/USDA imagery, public domain) or `osm` (development only). Display only, never measured from. |
| `NEXT_PUBLIC_APP_NAME` | `Fenceline` | Product name in the UI and on proposal PDFs. |

## The flow

1. **Settings** (`/settings`): enter the firm name, tax rate and terms, then import a price book CSV. `public/sample-price-book.csv` shows the format (`sku, description, category, unit, unit_price, taxable, roll_length_ft, style, role`); its prices are placeholders. A style becomes usable once every required role is bound to a SKU. Do this first: quotes stay unpriced until a price book exists.
2. **Home** (`/`): type the job address. The Census geocoder resolves it and the app opens `/quote/<id>`.
3. **Parcel**: the county ArcGIS service is queried address-first, then by point. When more than one parcel matches (common: house lot plus a side lot), pick the right one; when none is found the editor switches to hand drawing.
4. **Fence**: "Use parcel edge" snaps the fence to the lot lines; setbacks move it in by a distance for all sides or one side; "Draw perimeter" / "Draw run" trace a closed loop or an open run; "Select / edit" drags corners and midpoints. One undo/redo history covers geometry, gates, setbacks and style.
5. **Gate**: "Add gate" on a side, then set the width and single/double and drag the marker along the fence.
6. **Take-off**: pick a style and height; the panel lists posts (corner / end / line / gate), rails or panels, pickets or fabric, concrete, gates, hardware and labor with the basis for every quantity, then subtotal, tax and total. Slope-corrected lengths come from USGS 3DEP once the profiles load.
7. **Proposal PDF**: "Download proposal PDF" renders the proposal server-side (firm header, address, figure drawn from the parcel and fence geometry, line items, terms).

Quotes, price books and firm settings are saved in this browser's localStorage (`fq.v1.*`) and listed under "Recent quotes" on the home page.

**Test address:** `1823 White Oak Rd, Raleigh, NC 27608` (Wake County). Two parcels match; PIN `1704581656` is the 0.42 ac house lot with a 718.8 ft perimeter.

## Scripts

| Script | What it does |
| --- | --- |
| `pnpm dev` | Next.js dev server on :3000 |
| `pnpm typecheck` | `tsc --noEmit` over `src/` and `e2e/` |
| `pnpm lint` | ESLint, including the purity rule that keeps `src/engine` and `src/adapters` free of React, Next, map libraries and app code |
| `pnpm test` | Vitest unit tests: engine geometry / take-off, adapters with mocked `fetch` and captured fixtures, repositories |
| `pnpm test:network` | Vitest against the real Census, Wake County, Maricopa County and USGS endpoints (`*.network.test.ts`, 30 s timeout, 1 retry) |
| `pnpm e2e` | Playwright: `e2e/quote.spec.ts` drives the whole flow against the live services; `e2e/offline.spec.ts` replays it with `/api/geocode`, `/api/parcel` and `/api/elevation` served from fixtures. Both write `e2e/artifacts/{quote.png,settings.png,proposal.pdf}` (gitignored). Chromium is preinstalled; never run `playwright install`. |
| `pnpm check:tos` | The Google Maps / Mapbox grep over `src/` |
| `pnpm build` | `check:tos` then `next build` |

## Adding a county

Parcel lookups run through the registry in `src/adapters/parcel/registry/counties.json`; one ArcGIS provider is created per entry, and the entry whose `bbox` contains the geocoded point (or whose `fips` matches the Census county) is used. To add a county:

1. Find the county's public parcel layer (an ArcGIS REST URL ending in `/MapServer/<n>` or `/FeatureServer/<n>`) and confirm its terms allow this use; note the attribution they ask for.
2. Add an entry with these fields (validated by `src/adapters/parcel/registry.ts` on load):

   | Field | Meaning |
   | --- | --- |
   | `fips` | 5-digit county FIPS |
   | `name`, `state` | Display name and 2-letter state |
   | `provider` | `"arcgis"` |
   | `url` | Layer URL |
   | `idField` | Parcel id attribute (PIN / APN) |
   | `addressField` | Site address attribute used for the address-first `LIKE` query |
   | `outFields` | Attributes to request (`idField`, `addressField`, optionally an area field) |
   | `bbox` | `[minLon, minLat, maxLon, maxLat]` coverage |
   | `nearbyMeters` | Buffer for the last-resort "nearby" query (40 is typical) |
   | `attribution` | Shown on the map and the PDF, e.g. `"Lot lines: Wake County GIS"` |
   | `verifiedOn` | Date you last confirmed the layer answers |
   | `notes` | Quirks: native spatial reference, whether point geometry must be sent as JSON, a known test address |

3. Add a case to `src/adapters/__tests__/live.network.test.ts` with a real address or point in that county and the parcel id you expect back, and run `pnpm test:network`.
4. If the server returns Esri JSON rather than GeoJSON, or multipolygons, nothing else changes: `src/adapters/parcel/normalize.ts` rewinds rings, picks the part containing the point, merges slivers and converts to the engine's `Parcel`.

## Data sources and licences

| Source | Used for | Terms |
| --- | --- | --- |
| US Census Bureau Geocoder (`geocoding.geo.census.gov`) | Address → lon/lat, components, county FIPS | US government work, public domain; no key; the point lies on the street centreline, so parcel lookup is address-first |
| County ArcGIS parcel services (Wake County GIS, Maricopa County Assessor; registry above) | Lot lines, parcel id, site address | Each county's open-data terms; attribution string per entry is shown in the UI and PDF |
| USGS 3DEP (`elevation.nationalmap.gov`) with USGS EPQS as fallback | Elevation profiles along each fence run for slope-corrected lengths | Public domain; no SLA, so failures degrade to "slope unavailable" |
| USGS/USDA NAIP imagery (`imagery.nationalmap.gov` `exportImage`) | Basemap for orientation only | Public domain; never used for measurement |
| Regrid parcel API (optional, `REGRID_TOKEN`) | Nationwide parcel fallback ahead of the county registry | Commercial; disabled without a token, and the adapter is marked to verify against Regrid's current API before enabling |

The browser never calls these services directly; `src/app/api/{geocode,parcel,elevation}` proxy and cache them, and `src/app/api/proposal` renders the PDF.

## Not in Phase A, and where it plugs in

Deliberately absent: accounts and multi-user sync, billing, e-signature, a roofing module, CRM exports, per-jurisdiction tax, parcel holes or multipart editing (display only), stepped-vs-racked panel logic (warning only), i18n, touch tuning.

The seams that receive them:

- `src/lib/repo` — `getRepositories()` returns the `QuoteRepository`, `PriceBookRepository` and `FirmSettingsRepository` (`src/lib/repo/types.ts`). Phase A binds localStorage implementations; a hosted backend (Supabase auth + Postgres with per-firm policies) swaps in here without touching components.
- `src/lib/export` — reserved for Jobber / Housecall Pro CSV export of a quote's take-off; the `Quote` and `TakeOff` types in `src/engine/types.ts` are the input.
- `src/adapters/parcel/chain.ts` — the provider order (Regrid → county registry); new parcel sources implement `ParcelProvider`.
- `src/lib/pdf` — the proposal document; a map-canvas capture can replace the SVG figure later (NAIP is CORS-enabled, so the canvas is not tainted).
- Billing, e-signature and roofing are Phase C and have no code yet; roofing would use a solar/roof API only, never imagery tracing.
