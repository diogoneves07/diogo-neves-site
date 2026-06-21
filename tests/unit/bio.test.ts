import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";
import Bio from "../../src/components/organisms/Bio.astro";

describe("Bio", () => {
  it("renders the name heading and bio intro", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Bio);

    expect(html).toMatch(/<h1[^>]*>Diogo Neves<\/h1>/);
    expect(html).toContain("Desenvolvedor Front-End");
  });

  it("links to the external profiles", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Bio);

    expect(html).toContain('href="https://www.linkedin.com/in/diogoneves07/"');
    expect(html).toContain('href="https://github.com/diogoneves07"');
    expect(html).toContain('href="https://dev.to/diogoneves07"');
  });

  it("embeds the project poster", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Bio);

    expect(html).toContain('href="/articles/bemtvjs"');
  });
});
