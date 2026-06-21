import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";
import ProjectCard from "../../src/components/atoms/ProjectCard.astro";

describe("ProjectCard", () => {
  it("renders an anchor to the given href wrapping the title", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(ProjectCard, {
      props: { href: "/articles/bemtvjs", title: "BemtvJS" },
    });

    expect(html).toContain('href="/articles/bemtvjs"');
    expect(html).toMatch(/<strong[^>]*>BemtvJS<\/strong>/);
  });

  it("escapes the title text", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(ProjectCard, {
      props: { href: "/x", title: "A & B" },
    });

    expect(html).toContain("A &amp; B");
  });
});
