// Screenshots one project card at desktop (1440×900) and mobile (Pixel-7-ish 412×915) width.
//
// Usage (from the repo root, after `npm test` has built the site into .next-test/):
//   node .claude/skills/add-project/scripts/snap-project.mjs <project-id> [out-dir]
//
// Serves the existing test build with scripts/serve-out.mjs on a spare port, so it never rebuilds and never
// touches a running `npm run dev`. Prints the PNG paths and whether the card's content fits (desktop cards have a
// fixed height, so overflowing copy gets clipped).
import { spawn } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { chromium } from "@playwright/test";

const [id, outArg] = process.argv.slice(2);
if (!id) {
  console.error("usage: snap-project.mjs <project-id> [out-dir]");
  process.exit(2);
}
const DIST = ".next-test";
if (!existsSync(join(DIST, "index.html"))) {
  console.error(`No test build in ${DIST}/. Run \`npm test\` (or \`npm run test:e2e\`) first.`);
  process.exit(1);
}

const PORT = 4190;
const out = resolve(outArg ?? join("test-results", "project-snaps"));
mkdirSync(out, { recursive: true });

const server = spawn(process.execPath, ["scripts/serve-out.mjs"], {
  env: { ...process.env, NEXT_DIST_DIR: DIST, PORT: String(PORT), NEXT_PUBLIC_BASE_PATH: "/vamshi-portfolio" },
  stdio: "ignore",
});
const url = `http://localhost:${PORT}/vamshi-portfolio/projects/`;
for (let i = 0; i < 50; i++) {
  try {
    if ((await fetch(url)).ok) break;
  } catch {}
  await new Promise((r) => setTimeout(r, 100));
}

const browser = await chromium.launch();
let failed = false;
try {
  for (const [name, viewport] of [["desktop", { width: 1440, height: 900 }], ["mobile", { width: 412, height: 915 }]]) {
    const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
    await page.route(/google-analytics|googletagmanager/, (r) => r.abort());
    await page.goto(url);
    // Hide the site's fixed chrome (nav bar, section rail) so it isn't captured on top of the card.
    await page.addStyleTag({ content: "header, aside[aria-label='Page sections'] { visibility: hidden !important; }" });
    const cards = page.locator("#projects article");
    const index = await cards.evaluateAll((els, id) => els.findIndex((el) => el.dataset.projectId === id), id);
    if (index < 0) {
      console.error(`No card with data-project-id="${id}". Is it in the projects array in src/data/profile.ts?`);
      failed = true;
      break;
    }
    const card = cards.nth(index);
    // Scroll the card's pinned wrapper into place and let its mock animate in.
    await card.evaluate((el) => el.parentElement?.parentElement?.scrollIntoView({ block: "start" }));
    await page.waitForTimeout(2500);
    const file = join(out, `${id}-${name}.png`);
    await card.screenshot({ path: file });
    // The text column is the card's first child; on desktop the card has a fixed height, so if the column is taller,
    // the stack chips / links at its bottom are cut off. (Decorative glows in the visual panel are ignored.)
    const clipped = await card.evaluate((el) => (el.firstElementChild?.scrollHeight ?? 0) > el.clientHeight + 2);
    const overflowX = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    console.log(`${name}: ${file}${clipped ? "  ⚠ content may be clipped" : ""}${overflowX > 0 ? `  ⚠ page overflows by ${overflowX}px` : ""}`);
    await page.close();
  }
} finally {
  await browser.close();
  server.kill();
}
process.exit(failed ? 1 : 0);
