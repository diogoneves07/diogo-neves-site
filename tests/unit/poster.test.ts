import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";
import Poster from "../../src/components/molecules/Poster.astro";

describe("Poster", () => {
  it("renders one link per article in cardOrder", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Poster);

    const hrefs = [...html.matchAll(/href="(\/articles\/[a-z-]+)"/g)].map(
      (m) => m[1]
    );

    expect(hrefs).toEqual([
      "/articles/bemtvjs",
      "/articles/bom-linguagem-favorita",
      "/articles/blowupx",
      "/articles/super-ia-vs-devs",
    ]);
  });

  it("shows each article's card title", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Poster);

    expect(html).toContain("BemtvJS - A minha biblioteca");
    expect(html).toContain("Super IA vs Devs");
  });
});
