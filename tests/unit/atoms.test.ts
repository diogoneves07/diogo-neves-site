import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";
import Tag from "../../src/components/atoms/Tag.astro";
import CtaButton from "../../src/components/atoms/CtaButton.astro";
import BackButton from "../../src/components/atoms/BackButton.astro";
import ProgressBar from "../../src/components/atoms/ProgressBar.astro";

describe("Tag", () => {
  it("defaults to the outline variant and renders its slot", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Tag, { slots: { default: "React" } });

    expect(html).toContain("React");
    expect(html).toContain("outline");
  });

  it("applies the soft variant when requested", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Tag, {
      props: { variant: "soft" },
      slots: { default: "Jogo" },
    });

    expect(html).toContain("soft");
  });
});

describe("CtaButton", () => {
  it("renders an internal link without target/rel", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(CtaButton, {
      props: { href: "#contato" },
      slots: { default: "Falar comigo" },
    });

    expect(html).toContain('href="#contato"');
    expect(html).not.toContain("target=");
    expect(html).toContain("Falar comigo");
  });

  it("opens external links safely in a new tab", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(CtaButton, {
      props: { href: "https://example.com", external: true, variant: "secondary" },
      slots: { default: "Abrir" },
    });

    expect(html).toContain('target="_blank"');
    expect(html).toContain("noopener");
    expect(html).toContain("secondary");
  });
});

describe("BackButton", () => {
  it("renders an accessible button labelled for going home", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(BackButton);

    expect(html).toContain('id="back-button"');
    expect(html).toContain('aria-label="Voltar para a página inicial"');
  });
});

describe("ProgressBar", () => {
  it("renders a persisted, decorative progress element", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(ProgressBar);

    expect(html).toContain('id="progress-bar"');
    expect(html).toContain('aria-hidden="true"');
  });
});
