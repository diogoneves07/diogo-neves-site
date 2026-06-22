import { z } from "astro/zod";

// Shared with the article Content Collection (see config.ts) and the schema
// unit test. `cardOrder` orders the blog list; `excerpt`/`tags` drive the
// blog row; `pageTitle` is the article <title>; `updated` is the published /
// "última atualização" date shown in the list.
export const articleSchema = z.object({
  title: z.string(),
  pageTitle: z.string(),
  cardOrder: z.number(),
  excerpt: z.string(),
  tags: z.array(z.string()),
  updated: z.string(),
});
