import { expect, test } from "@playwright/test";

test.describe("article sheet open/close", () => {
  test("closes back to the home with the X button", async ({ page }) => {
    await page.goto("/");
    const sheet = page.locator("[data-article-sheet]");

    await page.locator('#artigos a[href="#leitura-blowupx"]').click();
    // Wait for the open transition to settle (data-open is set one frame
    // after the sheet becomes visible) before interacting with it.
    await expect(sheet).toHaveAttribute("data-open", "true");
    await expect(page).toHaveURL(/#leitura-blowupx$/);

    await sheet.locator(".article-sheet__close").click();
    await expect(sheet).toBeHidden();
    await expect(page).not.toHaveURL(/#leitura-/);
  });

  test("closes with the Início button", async ({ page }) => {
    await page.goto("/#leitura-bemtvjs");
    const sheet = page.locator("[data-article-sheet]");
    await expect(sheet).toHaveAttribute("data-open", "true");

    await sheet.locator(".article-sheet__home").click();
    await expect(sheet).toBeHidden();
  });

  test("closes when pressing Escape", async ({ page }) => {
    await page.goto("/#leitura-bemtvjs");
    const sheet = page.locator("[data-article-sheet]");
    await expect(sheet).toHaveAttribute("data-open", "true");

    await page.keyboard.press("Escape");
    await expect(sheet).toBeHidden();
  });
});
