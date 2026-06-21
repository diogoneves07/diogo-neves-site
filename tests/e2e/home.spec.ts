import { expect, test } from "@playwright/test";

test.describe("home page", () => {
  test("shows the bio heading and intro", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Diogo Neves", level: 1 })
    ).toBeVisible();
    await expect(page.getByText("Desenvolvedor Front-End")).toBeVisible();
  });

  test("shows the four project cards", async ({ page }) => {
    await page.goto("/");
    const cards = page.locator('.poster a[href^="/articles/"]');
    await expect(cards).toHaveCount(4);
  });
});
