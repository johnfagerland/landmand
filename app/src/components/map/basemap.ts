/**
 * Display-only basemap styles. Measurement never comes from these tiles (see AGENTS.md):
 *   naip — USGS/USDA NAIP Plus imagery via ArcGIS exportImage (public domain, 0.3 m, CORS *)
 *   osm  — OpenStreetMap raster tiles, development only (respect the OSM tile usage policy)
 */
import type { MapOptions } from "maplibre-gl";

export type BasemapId = "naip" | "osm";
export type StyleSpec = Exclude<NonNullable<MapOptions["style"]>, string>;

export const NAIP_TILE_URL =
  "https://imagery.nationalmap.gov/arcgis/rest/services/USGSNAIPPlus/ImageServer/exportImage" +
  "?bbox={bbox-epsg-3857}&bboxSR=3857&imageSR=3857&size=256,256&format=jpg&f=image";

export const OSM_TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

export const NAIP_ATTRIBUTION = "Imagery: USGS/USDA NAIP (public domain), for orientation only";
export const OSM_ATTRIBUTION = "&copy; OpenStreetMap contributors (dev only)";

export const BASEMAP_LAYER_ID = "basemap";

export function buildBasemapStyle(basemap: BasemapId): StyleSpec {
  const raster =
    basemap === "osm"
      ? { tiles: [OSM_TILE_URL], tileSize: 256, minzoom: 0, maxzoom: 19, attribution: OSM_ATTRIBUTION }
      : { tiles: [NAIP_TILE_URL], tileSize: 256, minzoom: 10, maxzoom: 20, attribution: NAIP_ATTRIBUTION };
  return {
    version: 8,
    sources: {
      basemap: { type: "raster", ...raster },
    },
    layers: [
      { id: "background", type: "background", paint: { "background-color": "#1f2937" } },
      { id: BASEMAP_LAYER_ID, type: "raster", source: "basemap", paint: { "raster-fade-duration": 0 } },
    ],
  };
}
