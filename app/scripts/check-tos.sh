#!/usr/bin/env bash
# Fails the build if any Google Maps or Mapbox reference appears in src/.
# Both vendors' terms forbid tracing measurements from their imagery; this app measures only from
# county parcel data and USGS 3DEP, and displays only public-domain (USGS/USDA NAIP) or OSM tiles.
set -uo pipefail
cd "$(dirname "$0")/.."
hits=$(grep -rniE 'mapbox|googleapis\.com|google\.com/maps|maps\.google|maps\.googleapis' src \
  --include='*.ts' --include='*.tsx' --include='*.css' --include='*.json' --include='*.mjs' 2>/dev/null \
  | grep -v 'check-tos: allow' || true)
if [ -n "$hits" ]; then
  echo "ToS check FAILED: Google Maps / Mapbox references found in src/:" >&2
  echo "$hits" >&2
  exit 1
fi
echo "ToS check passed: no Google Maps or Mapbox references in src/"
