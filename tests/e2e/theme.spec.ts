import { expect, test } from "@playwright/test";

function themeOf(page: import("@playwright/test").Page) {
  return page.locator("html").getAttribute("data-theme");
}

test.describe("theme", () => {
  test("toggles and persists across reload", async ({ page }) => {
    await page.goto("/");
    const before = await themeOf(page);

    await page.click("#theme-toggle");
    const after = await themeOf(page);
    expect(after).not.toBe(before);

    await page.reload();
    expect(await themeOf(page)).toBe(after);
  });

  test("defaults to dark when the system prefers dark", async ({ browser }) => {
    const context = await browser.newContext({ colorScheme: "dark" });
    const page = await context.newPage();
    await page.goto("/");
    expect(await themeOf(page)).toBe("dark");
    await context.close();
  });

  test("defaults to light when the system prefers light", async ({
    browser,
  }) => {
    const context = await browser.newContext({ colorScheme: "light" });
    const page = await context.newPage();
    await page.goto("/");
    expect(await themeOf(page)).toBe("light");
    await context.close();
  });

  test("keeps the chosen theme across navigation", async ({ page }) => {
    await page.goto("/");
    await page.click("#theme-toggle");
    const chosen = await themeOf(page);

    await page.click('a[href="/articles/bemtvjs"]');
    await expect(page).toHaveURL("/articles/bemtvjs");
    expect(await themeOf(page)).toBe(chosen);
  });
});
