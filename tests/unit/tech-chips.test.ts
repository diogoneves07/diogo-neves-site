import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";
import TechChips from "../../src/components/molecules/TechChips.astro";

describe("TechChips", () => {
  it("renders one chip per item label", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(TechChips, {
      props: { items: ["React", "TypeScript", "IA"] },
    });

    expect(html).toContain("React");
    expect(html).toContain("TypeScript");
    expect(html).toContain("IA");
  });

  it("uses an svg logo for known brands", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(TechChips, {
      props: { items: ["React"] },
    });

    expect(html).toContain('src="/icons/tech/react.svg"');
  });

  it("uses an emoji glyph for logo-less techs", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(TechChips, {
      props: { items: ["IA"] },
    });

    expect(html).toContain("chip-icon-emoji");
    expect(html).toContain("🤖");
  });

  it("renders nothing but the list shell for an empty set", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(TechChips, { props: { items: [] } });

    expect(html).toContain("chip-list");
    expect(html).not.toContain("<li>");
  });
});
