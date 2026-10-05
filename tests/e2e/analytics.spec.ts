import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures";

type Count = { path: string; referrer?: string; event?: boolean };

// Stand-in for GoatCounter's count.js: records what would be sent instead of sending it, so these tests never touch
// the real dashboard. Registered after the fixture's blanket block, so it takes precedence.
const RECORDER = "window.__counts = []; window.goatcounter = { count: function (v) { window.__counts.push(v); } };";

const counts = (page: Page) => page.evaluate(() => (window as unknown as { __counts?: Count[] }).__counts ?? []);
const pageViews = async (page: Page) => (await counts(page)).filter((c) => !c.event);

test.describe("visit counting (GoatCounter)", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("https://gc.zgo.at/count.js", (route) => route.fulfill({ contentType: "text/javascript", body: RECORDER }));
  });

  test("a tagged link counts one visit to the landing page, attributed to its ?ref", async ({ page }) => {
    await page.goto("about/?ref=LinkedIn");
    await expect.poll(() => pageViews(page)).toEqual([{ path: "/vamshi-durganala/about/", referrer: "linkedin" }]);

    // Scrolling on rewrites the URL, but must not add page views or lose the original attribution.
    await page.evaluate(() => window.scrollTo(0, document.getElementById("contact")!.offsetTop));
    await expect(page).toHaveURL(/\/contact\/$/);
    expect(await pageViews(page)).toEqual([{ path: "/vamshi-durganala/about/", referrer: "linkedin" }]);
  });

  test("an untagged visit is counted without a forced source", async ({ page }) => {
    await page.goto("./");
    await expect.poll(() => pageViews(page)).toEqual([{ path: "/vamshi-durganala/" }]);
  });

  test("résumé downloads and outbound clicks are recorded as events", async ({ page }) => {
    await page.goto("./");
    await expect.poll(() => pageViews(page)).toHaveLength(1);
    // Keep the clicks from actually opening the PDF / GitHub in new tabs (our listener runs first, in capture phase).
    await page.evaluate(() => document.addEventListener("click", (e) => e.preventDefault()));

    await page.locator("#home").getByRole("link", { name: /Résumé/ }).click();
    await page.locator("#home").getByRole("link", { name: "GitHub" }).click();

    const events = (await counts(page)).filter((c) => c.event).map((c) => c.path);
    expect(events).toEqual(["resume-download", "outbound/github.com"]);
  });
});
