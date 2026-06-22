import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { loadRenderers } from "astro:container";
import { getContainerRenderer as mdxRenderer } from "@astrojs/mdx";
import { beforeAll, describe, expect, it } from "vitest";
import PortfolioHome from "../../src/components/organisms/PortfolioHome.astro";
import {
  about,
  experiences,
  profile,
  stackGroups,
  track,
} from "../../src/data/resume";

// PortfolioHome renders the MDX article bodies inline (reading bottom-sheet),
// so the container needs the MDX renderer registered.
let html: string;

beforeAll(async () => {
  const renderers = await loadRenderers([mdxRenderer()]);
  const container = await AstroContainer.create({ renderers });
  html = await container.renderToString(PortfolioHome);
});

describe("PortfolioHome — hero & navigation", () => {
  it("renders the hero with the profile description", () => {
    expect(html).toContain(profile.name);
    expect(html).toContain(profile.description);
  });

  it("renders every primary section anchor", () => {
    for (const id of ["topo", "sobre", "experiencia", "artigos", "stack", "contato"]) {
      expect(html).toContain(`id="${id}"`);
    }
  });
});

describe("PortfolioHome — about section", () => {
  it("renders the about lead and every domain chip", () => {
    expect(html).toContain(about.lead);
    for (const domain of about.domains) {
      expect(html).toContain(domain.label);
    }
  });

  it("renders the track countries and flagship projects", () => {
    for (const country of track.countries) {
      expect(html).toContain(country.name);
    }
    for (const flagship of track.flagships) {
      expect(html).toContain(flagship.name);
    }
  });
});

describe("PortfolioHome — experience section", () => {
  it("renders one story card per experience with role and company", () => {
    for (const item of experiences) {
      expect(html).toContain(item.role);
      expect(html).toContain(item.company);
    }
  });

  it("flags the current role with the Atual badge", () => {
    expect(html).toContain("Atual");
  });
});

describe("PortfolioHome — stack section", () => {
  it("renders every stack group category", () => {
    for (const group of stackGroups) {
      expect(html).toContain(group.category);
    }
  });
});

describe("PortfolioHome — contact section", () => {
  it("links the key contact channels", () => {
    expect(html).toContain('href="mailto:07dneves@gmail.com"');
    expect(html).toContain('href="https://wa.me/5575998431779"');
    expect(html).toContain('href="https://www.linkedin.com/in/diogoneves07/"');
    expect(html).toContain('href="https://github.com/diogoneves07"');
  });

  it("opens external contact links in a new, safe tab", () => {
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noreferrer"');
  });
});

describe("PortfolioHome — article reading sheet", () => {
  it("renders the hidden article sheet shell", () => {
    expect(html).toContain("data-article-sheet");
    expect(html).toContain('aria-label="Leitura de artigo"');
  });
});
