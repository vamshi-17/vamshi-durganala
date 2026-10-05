import { test as base, expect, type Locator, type Page } from "@playwright/test";

export const SECTIONS = ["home", "about", "experience", "projects", "stack", "contact"] as const;
export type Section = (typeof SECTIONS)[number];

/** Domains the mocked DNS reports as unable to receive mail. */
export const DEAD_DOMAIN = "no-such-domain.test";

/**
 * Every test gets, automatically:
 * - analytics blocked (no fake traffic in GA)
 * - deterministic DNS for the contact form's MX check (no dependency on the real internet)
 * - a failure if the page throws or logs an error
 */
export const test = base.extend<{ pageErrors: string[] }>({
  pageErrors: [
    async ({ page }, use) => {
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
      page.on("console", (m) => {
        // Blocked third-party requests show up as "Failed to load resource"; that's expected here.
        if (m.type() === "error" && !m.text().startsWith("Failed to load resource")) errors.push(`console: ${m.text()}`);
      });

      await page.route(/google-analytics\.com|googletagmanager\.com|analytics\.google\.com|gc\.zgo\.at|goatcounter\.com/, (route) =>
        route.abort(),
      );
      await page.route(/cloudflare-dns\.com\/dns-query/, async (route) => {
        const name = new URL(route.request().url()).searchParams.get("name") ?? "";
        const dead = name.endsWith(DEAD_DOMAIN);
        await route.fulfill({
          contentType: "application/dns-json",
          headers: { "access-control-allow-origin": "*" },
          json: dead ? { Status: 3 } : { Status: 0, Answer: [{ type: 15, data: `10 mx.${name}.` }] },
        });
      });

      await use(errors);
      expect(errors, "the page should not throw or log errors").toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };

/** Id of the section crossing the middle of the viewport (the same rule the site's scroll-spy uses). */
export const sectionInView = (page: Page) =>
  page.evaluate(() => {
    const mid = window.innerHeight / 2;
    return [...document.querySelectorAll<HTMLElement>("main > section[id]")].find((s) => {
      const r = s.getBoundingClientRect();
      return r.top <= mid && r.bottom >= mid;
    })?.id;
  });

/** Waits until the given section is the one in view (scrolling is animated, so poll). */
export const expectInView = (page: Page, id: Section) => expect.poll(() => sectionInView(page), { timeout: 8_000 }).toBe(id);

/** Distance of a section's top from the viewport top — should equal its scroll-margin (80px) after navigation. */
export const sectionTop = (page: Page, id: Section) =>
  page.evaluate((id) => Math.round(document.getElementById(id)!.getBoundingClientRect().top), id);

/**
 * Clicks a tab and waits until it's selected, retrying if the click landed while the page was still settling.
 * Right after a direct load (/stack/ …) RouteSync re-aims the scroll for ~1s, so a button can move between Playwright
 * locating it and pressing it. (Real visitors aren't affected: their first click stops the re-aiming.)
 */
export async function selectTab(tab: Locator) {
  await expect(async () => {
    await tab.click();
    await expect(tab).toHaveAttribute("aria-selected", "true", { timeout: 1_000 });
  }).toPass({ timeout: 10_000 });
}

export const horizontalOverflow = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
