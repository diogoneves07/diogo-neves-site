# 🎉 diogoneves07 - Website 🎉

❤️ This repository contains my personal portfolio and blog. ❤️

Built with [Astro](https://astro.build/) + MDX, deployed on Vercel.

## Development

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check (astro check) + production build
npm run preview  # preview the production build locally
npm run test     # unit tests (Vitest + Astro Container API)
npm run test:e2e # end-to-end tests (Playwright)
```

> Playwright needs its browser once: `npx playwright install chromium`.

## Structure

- `src/content/articles/` — articles as MDX (Content Collection).
- `src/components/` — UI in Atomic Design layers (atoms / molecules / organisms / templates).
- `src/pages/` — route entry points.
- `src/styles/global.css` — palette, theme variables, shared prose styles.
