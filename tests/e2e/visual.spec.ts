import { expect, test } from "@playwright/test";

// Visual-regression baseline for the home page. The decorative WebGL scene is
// already skipped under navigator.webdriver, so the only non-determinism left
// is the scroll-reveal animation — we force every [data-reveal] block visible
// and disable transitions/animations so the snapshot is stable.
//
// These snapshots are the safety net for CSS refactors: the DOM-level specs
// prove structure, these prove the rendered result did not drift.
async function freezeForSnapshot(page: import("@playwright/test").Page) {
  await page.addStyleTag({
    content: `*, *::before, *::after {
      transition: none !important;
      animation: none !important;
    }`,
  });
  await page.evaluate(() => {
    document
      .querySelectorAll<HTMLElement>("[data-reveal]")
      .forEach((node) => (node.dataset.revealed = "true"));
  });
  await page.evaluate(() => document.fonts.ready);
}

test.describe("home page visual baseline", () => {
  test("full page on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");
    await freezeForSnapshot(page);
    await expect(page).toHaveScreenshot("home-desktop.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    });
  });

  test("full page on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await freezeForSnapshot(page);
    await expect(page).toHaveScreenshot("home-mobile.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    });
  });

  test("article reading sheet open", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/#leitura-bemtvjs");
    const sheet = page.locator("[data-article-sheet]");
    await expect(sheet).toBeVisible();
    await freezeForSnapshot(page);
    await expect(sheet).toHaveScreenshot("article-sheet.png", {
      maxDiffPixelRatio: 0.01,
    });
  });
});
