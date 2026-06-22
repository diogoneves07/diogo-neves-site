import { describe, expect, it } from "vitest";
import { articleSchema } from "../../src/content/article-schema";

const valid = {
  title: "BemtvJS",
  pageTitle: "Diogo Neves | BemtvJS",
  cardOrder: 1,
  excerpt: "Uma nota curta sobre a biblioteca.",
  tags: ["TypeScript", "Performance"],
  updated: "2026-06-21",
};

describe("articleSchema", () => {
  it("accepts well-formed frontmatter", () => {
    expect(articleSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects missing required fields", () => {
    const { cardOrder, ...withoutOrder } = valid;
    expect(articleSchema.safeParse(withoutOrder).success).toBe(false);
  });

  it("rejects a non-numeric cardOrder", () => {
    expect(
      articleSchema.safeParse({ ...valid, cardOrder: "1" }).success
    ).toBe(false);
  });
});
