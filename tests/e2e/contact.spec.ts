import type { Page, Request } from "@playwright/test";
import { DEAD_DOMAIN, expect, test } from "./fixtures";

/** Mocks Web3Forms and records what the form sent. Nothing leaves the machine. */
async function mockWeb3Forms(page: Page) {
  const sent: Request[] = [];
  await page.route("https://api.web3forms.com/submit", async (route) => {
    sent.push(route.request());
    await route.fulfill({ json: { success: true }, headers: { "access-control-allow-origin": "*" } });
  });
  return sent;
}

test.describe("contact form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("contact/");
    await expect(page.locator("#contact form")).toBeVisible();
  });

  const form = (page: Page) => page.locator("#contact form");
  const notes = (page: Page) => form(page).locator("p");
  const status = (page: Page) => form(page).getByRole("status");
  const send = (page: Page) => form(page).getByRole("button", { name: "Send request" }).click();

  test("an empty submit shows inline errors, focuses the first field and sends nothing", async ({ page }) => {
    const sent = await mockWeb3Forms(page);
    await send(page);
    await expect(status(page)).toContainText("400 Bad Request — fix 3 fields");
    await expect(notes(page)).toContainText([`"name" is required`, `"email" is required`, `"message" is required`]);
    await expect(form(page).locator('input[name="name"]')).toBeFocused();
    await expect(form(page).locator('input[name="name"]')).toHaveAttribute("aria-invalid", "true");
    expect(sent).toHaveLength(0);
  });

  test("suggests a fix for a mistyped email provider", async ({ page }) => {
    const email = form(page).locator('input[name="email"]');
    await email.fill("jane@gmial.com");
    await email.blur();
    const suggestion = form(page).getByRole("button", { name: "jane@gmail.com" });
    await expect(suggestion).toBeVisible();
    await suggestion.click();
    await expect(email).toHaveValue("jane@gmail.com");
    await expect(notes(page)).toContainText(["gmail.com accepts mail"]);
  });

  test("rejects an email whose domain can't receive mail", async ({ page }) => {
    const email = form(page).locator('input[name="email"]');
    await email.fill(`someone@${DEAD_DOMAIN}`);
    await email.blur();
    await expect(notes(page).filter({ hasText: "can't receive email" })).toBeVisible();
  });

  test("rejects disposable inboxes", async ({ page }) => {
    const email = form(page).locator('input[name="email"]');
    await email.fill("temp@mailinator.com");
    await email.blur();
    await expect(notes(page).filter({ hasText: "disposable inbox" })).toBeVisible();
  });

  test("a valid message is sent with the expected fields and the form resets", async ({ page }) => {
    const sent = await mockWeb3Forms(page);
    await form(page).locator('input[name="name"]').fill("Jane Recruiter");
    await form(page).locator('input[name="email"]').fill("jane.recruiter@gmail.com");
    await form(page).locator('textarea[name="message"]').fill("Hi Vamshi, we have a backend role that fits your background.");
    await send(page);

    await expect(status(page)).toContainText("201 Created");
    expect(sent).toHaveLength(1);
    const body = sent[0].postData() ?? "";
    for (const field of ["access_key", "name", "email", "message", "replyto", "subject"]) expect(body).toContain(`name="${field}"`);
    expect(body, "honeypot must not be sent for humans").not.toContain('name="botcheck"');
    await expect(form(page).locator('input[name="name"]')).toHaveValue("");
  });
});
