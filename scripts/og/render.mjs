// Renders scripts/og/og.html to public/og.png (1200×630).
// Usage: npm run og   — uses Playwright's Chromium (npx playwright install chromium), falling back to local Chrome/Edge.
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

async function launch() {
  for (const channel of [undefined, "chrome", "msedge"]) {
    try {
      return await chromium.launch(channel ? { channel } : {});
    } catch {
      /* try the next browser */
    }
  }
  console.error("No browser found. Run `npx playwright install chromium` or install Chrome/Edge.");
  process.exit(1);
}

const html = new URL("./og.html", import.meta.url);
const out = fileURLToPath(new URL("../../public/og.png", import.meta.url));

const browser = await launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.goto(html.href, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: out, type: "png" });
await browser.close();
console.log(`wrote ${out}`);
