import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { articleSchema } from "./article-schema";

const articles = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/articles" }),
  schema: articleSchema,
});

export const collections = { articles };
