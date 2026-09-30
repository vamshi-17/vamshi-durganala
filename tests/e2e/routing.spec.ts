import { expect, expectInView, sectionTop, test } from "./fixtures";

const url = (path: string) => new RegExp(`/vamshi-portfolio/${path}$`);

test.describe("section URLs", () => {
  test("a direct link opens its section", async ({ page }) => {
    await page.goto("about/");
    await expectInView(page, "about");
    await expect(page).toHaveURL(url("about/"));
    await expect(page).toHaveTitle(/^About — /);
  });

  test("nav clicks scroll in place and push a history entry", async ({ page }) => {
    await page.goto("./");
    const before = await page.evaluate(() => history.length);
    await page.locator("header nav").getByRole("link", { name: "/projects" }).click();
    await expect(page).toHaveURL(url("projects/"));
    await expectInView(page, "projects");
    expect(await page.evaluate(() => history.length)).toBe(before + 1);
    await expect.poll(() => sectionTop(page, "projects")).toBe(80); // lands just under the 64px nav
  });

  test("scrolling updates the URL and title without new history entries", async ({ page }) => {
    await page.goto("./");
    const before = await page.evaluate(() => history.length);
    await page.evaluate(() => window.scrollTo(0, document.getElementById("contact")!.offsetTop));
    await expect(page).toHaveURL(url("contact/"));
    await expect(page).toHaveTitle(/^Contact — /);
    expect(await page.evaluate(() => history.length)).toBe(before);
  });

  test("back and forward move between sections", async ({ page }) => {
    await page.goto("about/");
    await expectInView(page, "about");
    await page.locator("header nav").getByRole("link", { name: "/contact" }).click();
    await expectInView(page, "contact");

    await page.goBack();
    await expect(page).toHaveURL(url("about/"));
    await expectInView(page, "about");

    await page.goForward();
    await expect(page).toHaveURL(url("contact/"));
    await expectInView(page, "contact");
  });

  test("refreshing keeps you on the section, even below the pinned project cards", async ({ page }) => {
    await page.goto("contact/");
    await expectInView(page, "contact");
    await page.reload();
    await expectInView(page, "contact");
    await expect(page).toHaveURL(url("contact/"));
  });

  test("legacy #fragment links still work and are tidied to clean URLs", async ({ page }) => {
    await page.goto("./#stack");
    await expectInView(page, "stack");
    await expect(page).toHaveURL(url("stack/"));
    await expect(page).toHaveTitle(/^Stack — /);
  });

  test("a URL without the trailing slash redirects", async ({ page }) => {
    await page.goto("experience");
    await expect(page).toHaveURL(url("experience/"));
    await expectInView(page, "experience");
  });

  test("the logo returns home", async ({ page }) => {
    await page.goto("stack/");
    await expectInView(page, "stack");
    await page.getByRole("link", { name: "Back to top" }).first().click();
    await expect(page).toHaveURL(url(""));
    await expectInView(page, "home");
  });

  test.describe("with reduced motion", () => {
    test.use({ reducedMotion: "reduce" });

    test("navigation jumps instantly to the right place", async ({ page }) => {
      await page.goto("./");
      await page.locator("header nav").getByRole("link", { name: "/projects" }).click();
      await expect(page).toHaveURL(url("projects/"));
      expect(await sectionTop(page, "projects")).toBe(80); // no animation, so no polling needed
    });
  });
});

test.describe("mobile menu", { tag: "@mobile-only" }, () => {
  test("navigates, closes, and lands under the nav", async ({ page }) => {
    await page.goto("./");
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.locator("div.fixed.inset-0").getByRole("link", { name: /\/contact/ }).click();
    await expect(page).toHaveURL(url("contact/"));
    await expect(page.getByRole("button", { name: "Open menu" })).toBeVisible();
    await expect.poll(() => sectionTop(page, "contact"), { timeout: 8_000 }).toBe(80);
  });
});
