<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Fenceline — architecture and rules

Fence-first measurement and instant quotes for US fence contractors. Research spec: `../research/13-deep-dive-idea-09.md`.

## Three hard constraints (never violate)
1. **Never measure from Google Maps or Mapbox imagery** — their terms forbid tracing. Measurement geometry comes only from county parcel data (ArcGIS REST) or Regrid, and slope from USGS 3DEP. Basemap tiles are display-only and public domain (USGS/USDA NAIP) or OSM. `scripts/check-tos.sh` fails the build on any Google Maps / Mapbox reference in `src/`.
2. **No invented "market" pricing.** The take-off applies the contractor's own price book (CSV) with the style's spacing rules.
3. **Never surface a raw "missing parcel data" error.** Fall back: Regrid (if token) → county ArcGIS registry → let the contractor draw the boundary by hand.

## Directory ownership
- `src/engine/**` — PURE TypeScript measurement/take-off engine. No React, Next, DOM, MapLibre, terra-draw, zustand or `@/lib`/`@/components`/`@/adapters` imports (ESLint enforces). All measurement in a local tangent plane in feet (`geo/localPlane.ts`); Turf only for rewind, kinks, buffer fallback, point-in-polygon, bbox. Money is integer cents.
- `src/adapters/**` — SERVER-ONLY providers (Census geocoder, ArcGIS parcels + `parcel/registry/counties.json`, Regrid, 3DEP/EPQS elevation). Node fetch, timeouts, never throw from `lookup`/`sample`.
- `src/app/api/**` — thin route handlers over adapters (`runtime = 'nodejs'`, zod-validated, LRU-cached). The browser never calls Census/ArcGIS/USGS directly.
- `src/components/**`, `src/lib/store/**` — client UI (MapLibre + terra-draw editor, panels). Components read/write persistence only through `getRepositories()` (`src/lib/repo`).
- `src/lib/pdf/**` + `src/app/api/proposal` — proposal PDF via `@react-pdf/renderer`, server-side.

## Conventions
- `src/engine/types.ts`, `src/adapters/types.ts`, `src/lib/repo/types.ts` are the contracts; change them only with the integrating agent.
- Tailwind v4 is CSS-first (`@import "tailwindcss"` in `globals.css`); do not add a `tailwind.config.*`.
- zod 4 (`z.treeifyError`), vitest 5 (configs are .mts), Playwright 1.56.1 pinned to the preinstalled Chromium (never `playwright install`).
- Tests: `pnpm test` (unit, mocked fetch), `pnpm test:network` (real endpoints), `pnpm e2e` (Playwright), `pnpm typecheck`, `pnpm lint`, `pnpm check:tos`.
- Test address: **1823 White Oak Rd, Raleigh, NC 27608** (Wake County, two parcels for the address, PIN 1704581656 is the 0.42 ac lot).
