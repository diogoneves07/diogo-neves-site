import { expect, test } from "@playwright/test";

const targets = [
  { label: "Sobre", id: "sobre" },
  { label: "Experiência", id: "experiencia" },
  { label: "Artigos", id: "artigos" },
  { label: "Tecnologias", id: "stack" },
  { label: "Contato", id: "contato" },
];

test.describe("bottom navigation anchors", () => {
  for (const target of targets) {
    test(`"${target.label}" scrolls its section into view`, async ({ page }) => {
      await page.goto("/");
      const nav = page.getByRole("navigation", {
        name: "Navegação inferior do portfólio",
      });

      await nav.getByRole("link", { name: target.label }).click();
      await expect(page.locator(`section#${target.id}`)).toBeInViewport();
    });
  }
});
