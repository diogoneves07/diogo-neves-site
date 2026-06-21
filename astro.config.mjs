// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import vercel from "@astrojs/vercel";

// Static output: the site is a mostly-static portfolio, no SSR needed.
export default defineConfig({
  site: "https://diogo-neves-site.vercel.app",
  output: "static",
  adapter: vercel(),
  integrations: [mdx()],
});
