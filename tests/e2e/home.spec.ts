import { expect, test } from "@playwright/test";

test.describe("home page", () => {
  test("shows the redesigned hero heading and intro", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /Diogo Neves/i, level: 1 })).toBeVisible();
    await expect(page.getByText("Performance, arquitetura e interfaces", { exact: false })).toBeVisible();
    await expect(page.getByRole("link", { name: "Explorar trajetória" })).toBeVisible();
  });

  test("shows the featured project cards and writing section", async ({ page }) => {
    await page.goto("/");
    const cards = page.locator("#projetos .project-card");
    await expect(cards).toHaveCount(4);
    await expect(page.locator("#artigos .article-card")).toHaveCount(4);
  });

  test("shows the bottom navigation as the only primary menu on desktop", async ({ page }) => {
    await page.goto("/");

    const nav = page.getByRole("navigation", { name: "Navegação inferior do portfólio" });
    await expect(nav).toBeVisible();
    await expect(page.locator(".floating-nav")).toHaveCount(0);
    await expect(nav.getByRole("link", { name: "Sobre" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Experiência" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Projetos" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Artigos" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Contato" })).toBeVisible();
  });

  test("shows the bottom navigation on small screens too", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    const nav = page.getByRole("navigation", { name: "Navegação inferior do portfólio" });
    await expect(nav).toBeVisible();
    await expect(nav.getByRole("link", { name: "Sobre" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Experiência" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Projetos" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Artigos" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Contato" })).toBeVisible();
  });
});
