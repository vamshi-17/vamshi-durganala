import { expect, test } from "./fixtures";

// The command-palette shortcut hint should match the visitor's keyboard: Ctrl on PCs, ⌘ on Macs, nothing on touch.

const shortcut = (page: import("@playwright/test").Page) => page.getByTestId("palette-shortcut");
const tip = (page: import("@playwright/test").Page) => page.getByTestId("shortcut-tip");

test.describe("shortcut hint on a Windows PC", () => {
  // The desktop project's default user agent is Chrome on Windows.
  test("shows Ctrl K, and Ctrl+K opens the palette", async ({ page }) => {
    await page.goto("./");
    await expect(shortcut(page)).toHaveText("Ctrl K");
    await expect(tip(page)).toBeVisible();
    await expect(tip(page)).toContainText("Ctrl");
    await page.keyboard.press("Control+K");
    await expect(page.getByRole("dialog", { name: "Command palette" })).toBeVisible();
  });
});

test.describe("shortcut hint on a Mac", () => {
  test.use({
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36",
  });

  test("shows ⌘ K, and ⌘+K opens the palette", async ({ page }) => {
    // Browsers report the platform separately from the user agent; make both say "Mac".
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "platform", { get: () => "MacIntel" });
      Object.defineProperty(navigator, "userAgentData", { get: () => ({ platform: "macOS" }) });
    });
    await page.goto("./");
    await expect(shortcut(page)).toHaveText("⌘ K");
    await expect(tip(page)).toContainText("⌘");
    await page.keyboard.press("Meta+K");
    await expect(page.getByRole("dialog", { name: "Command palette" })).toBeVisible();
  });
});

test.describe("shortcut hint on a touch-only tablet", () => {
  test.use({ viewport: { width: 820, height: 1180 }, isMobile: true, hasTouch: true });

  test("keeps the palette button but shows no keyboard shortcut", async ({ page }) => {
    await page.goto("./");
    const button = page.getByRole("button", { name: "Open command palette" });
    await expect(button).toBeVisible();
    await expect(page.getByTestId("shortcut-tip")).toBeHidden();
    await expect(shortcut(page)).toHaveCount(0);
    await button.tap();
    await expect(page.getByRole("dialog", { name: "Command palette" })).toBeVisible();
  });
});
