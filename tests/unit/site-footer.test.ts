import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";
import SiteFooter from "../../src/components/organisms/SiteFooter.astro";

describe("SiteFooter", () => {
  it("shows the current year and contact", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(SiteFooter);

    expect(html).toContain(String(new Date().getFullYear()));
    expect(html).toContain("Diogo Neves");
    expect(html).toContain("07dneves(@)gmail.com");
  });
});
