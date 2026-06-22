import { expect, test } from "@playwright/test";

test.describe("home page", () => {
  test("shows the hero heading and intro", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Diogo Neves", level: 1 })
    ).toBeVisible();
    await expect(
      page.locator("#topo").getByText("especializado em performance", { exact: false })
    ).toBeVisible();
  });

  test("renders every chapter section in order", async ({ page }) => {
    await page.goto("/");
    for (const id of ["topo", "sobre", "experiencia", "artigos", "stack", "contato"]) {
      await expect(page.locator(`section#${id}`)).toHaveCount(1);
    }
  });

  test("shows the experience, article and stack cards", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#experiencia .story-card")).toHaveCount(4);
    await expect(page.locator("#artigos .article-card")).toHaveCount(4);
    await expect(page.locator("#stack .stack-card")).toHaveCount(6);
  });

  test("shows the bottom navigation as the only primary menu on desktop", async ({ page }) => {
    await page.goto("/");

    const nav = page.getByRole("navigation", { name: "Navegação inferior do portfólio" });
    await expect(nav).toBeVisible();
    await expect(page.locator(".floating-nav")).toHaveCount(0);
    for (const label of ["Sobre", "Experiência", "Artigos", "Tecnologias", "Contato"]) {
      await expect(nav.getByRole("link", { name: label })).toBeVisible();
    }
  });

  test("shows the bottom navigation on small screens too", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    const nav = page.getByRole("navigation", { name: "Navegação inferior do portfólio" });
    await expect(nav).toBeVisible();
    for (const label of ["Sobre", "Experiência", "Artigos", "Tecnologias", "Contato"]) {
      await expect(nav.getByRole("link", { name: label })).toBeVisible();
    }
  });
});
