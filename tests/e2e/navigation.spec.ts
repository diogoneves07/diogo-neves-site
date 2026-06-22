import { expect, test } from "@playwright/test";

const articles = [
  { slug: "bemtvjs", title: "BemtvJS", text: "algoritmo de" },
  {
    slug: "blowupx",
    title: "BlowUpX",
    text: "primeiro jogo",
  },
  {
    slug: "bom-linguagem-favorita",
    title: "O quão bom você é na sua linguagem favorita?",
    text: "aprofundei meus conhecimentos",
  },
  {
    slug: "super-ia-vs-devs",
    title: "Super IA vs Devs",
    text: "mercado de trabalho",
  },
];

test.describe("article reading sheet", () => {
  for (const article of articles) {
    test(`opens ${article.slug} as a bottom sheet from its card`, async ({ page }) => {
      await page.goto("/");
      await page.locator(`#artigos a[href="#leitura-${article.slug}"]`).click();

      const sheet = page.locator("[data-article-sheet]");
      await expect(sheet).toBeVisible();
      await expect(page).toHaveURL(new RegExp(`#leitura-${article.slug}$`));
      await expect(
        sheet.getByRole("heading", { name: article.title, level: 1 })
      ).toBeVisible();
      await expect(sheet.getByText(article.text, { exact: false })).toBeVisible();
    });
  }

  test("deep-links straight into an article via its hash", async ({ page }) => {
    await page.goto("/#leitura-bemtvjs");

    const sheet = page.locator("[data-article-sheet]");
    await expect(sheet).toBeVisible();
    await expect(
      sheet.getByRole("heading", { name: "BemtvJS", level: 1 })
    ).toBeVisible();
  });
});
