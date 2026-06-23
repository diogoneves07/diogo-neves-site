import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";
import PortfolioBottomNav from "../../src/components/organisms/PortfolioBottomNav.astro";

const props = {
  leftItems: [
    { href: "#sobre", label: "Sobre", icon: "user" as const },
    { href: "#experiencia", label: "Experiência", icon: "briefcase" as const },
  ],
  centerItem: { href: "#contato", label: "Contato", icon: "mail" as const },
  rightItems: [
    { href: "#artigos", label: "Artigos", icon: "pen" as const },
    { href: "#stack", label: "Tecnologias", icon: "chip" as const },
  ],
};

describe("PortfolioBottomNav", () => {
  it("renders a labelled navigation landmark", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(PortfolioBottomNav, { props });

    expect(html).toContain('aria-label="Navegação inferior do portfólio"');
  });

  it("renders every item as a link to its section anchor", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(PortfolioBottomNav, { props });

    for (const item of [...props.leftItems, props.centerItem, ...props.rightItems]) {
      expect(html).toContain(`href="${item.href}"`);
      expect(html).toContain(`aria-label="${item.label}"`);
    }
  });

  it("highlights the center item as the floating action button", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(PortfolioBottomNav, { props });

    expect(html).toContain("bottom-nav-center");
    expect(html).toContain("bottom-nav-center-label");
    // The center icon gets its own brand colour.
    expect(html).toContain("--icon-color:#059669");
    expect(html).toContain(">Contato</span>");
  });
});
