import { SECTIONS, expect, horizontalOverflow, test } from "./fixtures";

test.describe("smoke", { tag: "@mobile" }, () => {
  test("home page renders every section", async ({ page }) => {
    await page.goto("./");
    await expect(page).toHaveTitle("Vamshi Krishna Durganala — Full Stack Engineer");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("I build systems");
    for (const id of SECTIONS) await expect(page.locator(`section#${id}`)).toBeAttached();
  });

  test("nothing overflows horizontally, top to bottom", async ({ page }) => {
    await page.goto("./");
    for (const id of SECTIONS) {
      await page.locator(`section#${id}`).scrollIntoViewIfNeeded();
      expect(await horizontalOverflow(page), `overflow near #${id}`).toBeLessThanOrEqual(0);
    }
  });

  test("assets and metadata use the Pages base path", async ({ page, request }) => {
    await page.goto("./");
    const resume = page.getByRole("link", { name: /Résumé/ }).first();
    await expect(resume).toHaveAttribute("href", /^\/vamshi-durganala\/.+\.pdf$/);
    expect((await request.get((await resume.getAttribute("href"))!.replace("/vamshi-durganala/", ""))).status()).toBe(200);

    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", "https://vamshi-17.github.io/vamshi-durganala/og.png");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://vamshi-17.github.io/vamshi-durganala/");
    expect((await request.get("og.png")).status()).toBe(200);
  });

  test("unknown routes get the 404 page", async ({ request }) => {
    expect((await request.get("definitely-not-a-page/")).status()).toBe(404);
  });
});
