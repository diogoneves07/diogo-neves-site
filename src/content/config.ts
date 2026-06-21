import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// `cardTitle` and `cardOrder` drive the home-page Poster; `pageTitle` is the
// <title> for the article route; `updated` is the "última atualização" date.
const articles = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/articles" }),
  schema: z.object({
    title: z.string(),
    pageTitle: z.string(),
    cardTitle: z.string(),
    cardOrder: z.number(),
    updated: z.string(),
  }),
});

export const collections = { articles };
