import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { loadRenderers } from "astro:container";
import { getContainerRenderer as mdxRenderer } from "@astrojs/mdx";
import { beforeAll, describe, expect, it } from "vitest";
import PortfolioHome from "../../src/components/organisms/PortfolioHome.astro";

// PortfolioHome renderiza o conteúdo MDX dos artigos inline (bottom-sheet),
// então o container precisa do renderer de MDX registrado.
let container: AstroContainer;

beforeAll(async () => {
  const renderers = await loadRenderers([mdxRenderer()]);
  container = await AstroContainer.create({ renderers });
});

describe("PortfolioHome", () => {
  it("renders the hero heading and key section ids", async () => {
    const html = await container.renderToString(PortfolioHome);

    expect(html).toContain("Diogo Neves");
    expect(html).toContain('id="sobre"');
    expect(html).toContain('id="artigos"');
    expect(html).toContain('id="contato"');
  });

  it("renders the hero and contact calls to action", async () => {
    const html = await container.renderToString(PortfolioHome);

    expect(html).toContain("Software que escala sob pressão");
    expect(html).toContain(
      "Tecnologias com as quais me sinto confortável trabalhando:"
    );
    expect(html).toContain('href="https://www.linkedin.com/in/diogoneves07/"');
    expect(html).toContain('href="mailto:07dneves@gmail.com"');
    expect(html).toContain('href="https://wa.me/5575998431779"');
  });
});
