import { describe, expect, it } from "vitest";
import { articleSchema } from "../../src/content/article-schema";

const valid = {
  title: "BemtvJS",
  pageTitle: "Diogo Neves | BemtvJS",
  cardTitle: "BemtvJS - lib",
  cardOrder: 1,
  updated: "2022/12/27",
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
