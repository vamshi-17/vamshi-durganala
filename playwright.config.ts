import { defineConfig, devices } from "@playwright/test";

const PORT = 4173;
const BASE_PATH = "/vamshi-durganala";
const CI = !!process.env.CI;
// Unit tests don't need a browser or a built site.
const unitOnly = process.argv.some((a) => a === "--project=unit" || a === "unit");

export default defineConfig({
  testDir: "tests",
  fullyParallel: true,
  forbidOnly: CI,
  retries: CI ? 1 : 0,
  // The site is animation-heavy; too many parallel browsers starve the CPU and make timing-based UI flaky.
  workers: CI ? 2 : 3,
  reporter: CI ? [["github"], ["html", { open: "never" }]] : [["list"], ["html", { open: "never" }]],
  use: {
    // Relative gotos ("about/") resolve under the Pages base path; never start them with "/".
    baseURL: `http://localhost:${PORT}${BASE_PATH}/`,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "unit", testDir: "tests/unit" },
    {
      name: "desktop",
      testDir: "tests/e2e",
      grepInvert: /@mobile-only/,
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
    {
      // Runs tests tagged @mobile (shared) or @mobile-only.
      name: "mobile",
      testDir: "tests/e2e",
      grep: /@mobile/,
      use: { ...devices["Pixel 7"] },
    },
  ],
  webServer: unitOnly
    ? undefined
    : {
        // Build exactly like production (base path) with a dummy form key; the Web3Forms API is mocked in tests.
        command: "npm run build && node scripts/serve-out.mjs",
        url: `http://localhost:${PORT}${BASE_PATH}/`,
        reuseExistingServer: !CI,
        timeout: 360_000,
        stdout: "ignore",
        env: {
          NEXT_PUBLIC_BASE_PATH: BASE_PATH,
          NEXT_PUBLIC_WEB3FORMS_KEY: "test-key",
          NEXT_DIST_DIR: ".next-test",
          PORT: String(PORT),
        },
      },
});
