import { projects } from "../../src/data/profile";
import { expect, expectInView, selectTab, test } from "./fixtures";

test("hero API console calls the selected endpoint", async ({ page }) => {
  await page.goto("./");
  const hero = page.locator("#home");
  // Auto-sends ~1.5s after load, then animates the round trip and streams the JSON; allow for a busy machine.
  await expect(hero.getByText('"open_to_work"')).toBeVisible({ timeout: 15_000 });
  await hero.getByRole("tab", { name: "/now" }).click();
  await expect(hero.getByText('"day_job"')).toBeVisible({ timeout: 15_000 });
  await expect(hero.getByText("200 OK")).toBeVisible();
});

test("command palette searches and navigates", async ({ page }) => {
  await page.goto("./");
  await page.keyboard.press("Control+K");
  const dialog = page.getByRole("dialog", { name: "Command palette" });
  await expect(dialog).toBeVisible();
  await page.keyboard.type("/stack");
  await expect(dialog.getByRole("button")).toHaveCount(1);
  await page.keyboard.press("Enter");
  await expect(dialog).toBeHidden();
  await expect(page).toHaveURL(/\/stack\/$/);
  await expectInView(page, "stack");

  await page.keyboard.press("Control+K");
  await page.keyboard.type("zzz-nothing");
  await expect(dialog.getByText("404 — no matching command")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

test("experience registry switches between roles", async ({ page }) => {
  await page.goto("experience/");
  const section = page.locator("#experience");
  await expect(section.getByRole("heading", { name: "Full Stack Developer" })).toBeVisible();
  await selectTab(section.getByRole("tab", { name: /cognizant/ }));
  await expect(section.getByText("@Cognizant")).toBeVisible();
});

test("stack map highlights a traced request path", async ({ page }) => {
  await page.goto("stack/");
  const stack = page.locator("#stack");
  await selectTab(stack.getByRole("tab", { name: /Ship to production/ }));
  await expect(stack.locator("span", { hasText: /^ArgoCD/ }).first()).toHaveClass(/text-lime/);
  await expect(stack.locator("span", { hasText: /^Keycloak/ }).first()).not.toHaveClass(/text-lime/);
});

test("every side project in the data renders a card with a visual", async ({ page }) => {
  await page.goto("projects/");
  const cards = page.locator("#projects article");
  await expect(cards).toHaveCount(projects.length);
  for (const [i, project] of projects.entries()) {
    const card = cards.nth(i);
    await expect(card.getByRole("heading", { name: project.name })).toBeAttached();
    await expect(card).toContainText(`${String(i + 1).padStart(2, "0")} / ${String(projects.length).padStart(2, "0")}`);
    for (const tech of project.stack) await expect(card).toContainText(tech);
  }
});
