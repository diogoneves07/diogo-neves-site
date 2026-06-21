import { expect, test } from "@playwright/test";

test.describe("navigation chrome", () => {
  test("shows the progress bar during navigation", async ({ page }) => {
    await page.goto("/");

    const widthDuringNav = new Promise<number>((resolve) => {
      const poll = setInterval(async () => {
        const w = await page
          .locator("#progress-bar")
          .evaluate((el) => el.getBoundingClientRect().width)
          .catch(() => 0);
        if (w > 0) {
          clearInterval(poll);
          resolve(w);
        }
      }, 30);
    });

    await page.click('a[href="/articles/bemtvjs"]');
    expect(await widthDuringNav).toBeGreaterThan(0);
  });

  test("back button returns to the previous page", async ({ page }) => {
    await page.goto("/");
    await page.click('a[href="/articles/blowupx"]');
    await expect(page).toHaveURL("/articles/blowupx");

    await page.click("#back-button");
    await expect(page).toHaveURL("/");
  });
});
