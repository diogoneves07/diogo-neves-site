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

test.describe("article navigation", () => {
  for (const article of articles) {
    test(`opens ${article.slug} from its card`, async ({ page }) => {
      await page.goto("/");
      await page.click(`a[href="/articles/${article.slug}"]`);

      await expect(page).toHaveURL(`/articles/${article.slug}`);
      await expect(
        page.getByRole("heading", { name: article.title, level: 1 })
      ).toBeVisible();
      await expect(page.getByText(article.text, { exact: false })).toBeVisible();
    });
  }

  test("sets a descriptive document title per article", async ({ page }) => {
    await page.goto("/articles/bemtvjs");
    await expect(page).toHaveTitle(/BemtvJS/);
  });
});
