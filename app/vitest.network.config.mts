import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

/** Tests that hit the real Census / county ArcGIS / USGS endpoints. Run with `pnpm test:network`. */
export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: {
    environment: "node",
    include: ["src/**/*.network.test.ts"],
    testTimeout: 30_000,
    retry: 1,
    fileParallelism: false,
  },
});
