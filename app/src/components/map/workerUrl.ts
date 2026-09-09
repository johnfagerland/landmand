/**
 * MapLibre GL 6 loads its web worker from `new URL("./maplibre-gl-worker.mjs", import.meta.url)`, which
 * points at a non-existent chunk path once the library is bundled by Next, so GeoJSON layers never render.
 * We ask the bundler to emit the two dist files as static assets, rewrite the worker's relative import
 * to the emitted shared module, and hand MapLibre a Blob URL through setWorkerUrl() before the map is made.
 */
import { setWorkerUrl } from "maplibre-gl";

let prepared: Promise<boolean> | null = null;

export function prepareMapLibreWorker(): Promise<boolean> {
  if (prepared) return prepared;
  prepared = (async () => {
    if (typeof window === "undefined") return false;
    try {
      const workerAsset = new URL("../../../node_modules/maplibre-gl/dist/maplibre-gl-worker.mjs", import.meta.url);
      const sharedAsset = new URL("../../../node_modules/maplibre-gl/dist/maplibre-gl-shared.mjs", import.meta.url);
      const res = await fetch(workerAsset.href);
      if (!res.ok) throw new Error(`worker asset ${res.status}`);
      const source = await res.text();
      const patched = source.replace(
        /from\s*(["'])\.\/maplibre-gl-shared\.mjs\1/g,
        `from"${new URL(sharedAsset.href, window.location.href).href}"`,
      );
      const blob = new Blob([patched], { type: "text/javascript" });
      setWorkerUrl(URL.createObjectURL(blob));
      return true;
    } catch (err) {
      console.warn("[map] could not prepare the MapLibre worker; vector layers may not render", err);
      return false;
    }
  })();
  return prepared;
}
