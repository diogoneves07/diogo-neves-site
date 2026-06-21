/// <reference types="vitest" />
import { getViteConfig } from "astro/config";

// getViteConfig wires Astro's plugins so .astro components can be rendered via
// the Container API inside Vitest.
export default getViteConfig({
  test: {
    globals: true,
    include: ["tests/unit/**/*.test.ts"],
  },
});
