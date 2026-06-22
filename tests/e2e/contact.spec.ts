import { expect, test } from "@playwright/test";

test.describe("contact section", () => {
  test("exposes every contact channel with a working href", async ({ page }) => {
    await page.goto("/");
    const contato = page.locator("#contato");

    await expect(contato.locator('a[href="mailto:07dneves@gmail.com"]')).toHaveCount(1);
    await expect(contato.locator('a[href="https://wa.me/5575998431779"]')).toHaveCount(1);
    await expect(
      contato.locator('a[href="https://www.linkedin.com/in/diogoneves07/"]')
    ).toHaveCount(1);
    await expect(contato.locator('a[href="https://github.com/diogoneves07"]')).toHaveCount(1);
    await expect(contato.locator('a[href="https://dev.to/diogoneves07"]')).toHaveCount(1);
  });

  test("opens external contact links in a new, safe tab", async ({ page }) => {
    await page.goto("/");
    const linkedin = page.locator(
      '#contato a[href="https://www.linkedin.com/in/diogoneves07/"]'
    );
    await expect(linkedin).toHaveAttribute("target", "_blank");
    await expect(linkedin).toHaveAttribute("rel", "noreferrer");
  });
});
