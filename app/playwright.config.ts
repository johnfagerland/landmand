import { defineConfig, devices } from "@playwright/test";

/**
 * Chromium is preinstalled at /opt/pw-browsers (PLAYWRIGHT_BROWSERS_PATH); never run `playwright install`.
 * SwiftShader flags give MapLibre a WebGL context in headless mode.
 */
export default defineConfig({
  testDir: "e2e",
  outputDir: "e2e/artifacts/test-results",
  timeout: 120_000,
  expect: { timeout: 20_000 },
  retries: 0,
  workers: 1,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:3000",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    launchOptions: {
      args: ["--use-gl=angle", "--use-angle=swiftshader", "--ignore-gpu-blocklist", "--enable-unsafe-swiftshader"],
    },
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 180_000,
  },
});
