import { z } from "astro/zod";

// Shared with the article Content Collection (see config.ts) and the schema
// unit test. `cardTitle`/`cardOrder` drive the home-page Poster; `pageTitle`
// is the article <title>; `updated` is the "última atualização" date.
export const articleSchema = z.object({
  title: z.string(),
  pageTitle: z.string(),
  cardTitle: z.string(),
  cardOrder: z.number(),
  updated: z.string(),
});
