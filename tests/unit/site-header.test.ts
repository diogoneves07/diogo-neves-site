import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";
import SiteHeader from "../../src/components/organisms/SiteHeader.astro";

describe("SiteHeader", () => {
  it("renders the brand banner text", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(SiteHeader);

    expect(html).toContain("diogoneves07");
    expect(html).toContain("strange-shape");
  });
});
