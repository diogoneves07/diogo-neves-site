import { expect, test } from "@playwright/test";

test.describe("article sheet open/close", () => {
  test("closes back to the home with the X button", async ({ page }) => {
    await page.goto("/");
    const sheet = page.locator("[data-article-sheet]");

    await page.locator('#artigos a[href="#leitura-blowupx"]').click();
    await expect(sheet).toBeVisible();
    await expect(page).toHaveURL(/#leitura-blowupx$/);

    await sheet.locator(".article-sheet__close").click();
    await expect(sheet).toBeHidden();
    await expect(page).not.toHaveURL(/#leitura-/);
  });

  test("closes with the Início button", async ({ page }) => {
    await page.goto("/#leitura-bemtvjs");
    const sheet = page.locator("[data-article-sheet]");
    await expect(sheet).toBeVisible();

    await sheet.locator(".article-sheet__home").click();
    await expect(sheet).toBeHidden();
  });

  test("closes when pressing Escape", async ({ page }) => {
    await page.goto("/#leitura-bemtvjs");
    const sheet = page.locator("[data-article-sheet]");
    await expect(sheet).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(sheet).toBeHidden();
  });
});
