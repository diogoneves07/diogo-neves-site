import { expect, test } from "@playwright/test";

test("unknown route shows the 404 page", async ({ page }) => {
  const response = await page.goto("/articles/does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Página não encontrada." })).toBeVisible();
});
