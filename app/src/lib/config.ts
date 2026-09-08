/** Product name shown in the UI and on proposals; rename in .env (NEXT_PUBLIC_APP_NAME). */
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Fenceline";

/** Basemap: "naip" (USGS/USDA NAIP imagery, public domain) or "osm" (development only). Display only, never measured from. */
export const BASEMAP = (process.env.NEXT_PUBLIC_BASEMAP === "osm" ? "osm" : "naip") as "naip" | "osm";
