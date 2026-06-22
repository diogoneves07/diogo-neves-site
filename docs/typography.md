# Typography

Base importada do `projects/naqui/docs/typography`.

## Regras

1. A interface usa uma fonte principal única: `Plus Jakarta Sans`.
2. Corpo de texto nunca abaixo de `16px`.
3. Inputs sempre em `16px`.
4. Pesos abaixo de `400` não são usados em texto funcional.
5. Hierarquia vem de tamanho, peso e opacidade, não de misturar múltiplas fontes.
6. Títulos longos não usam uppercase.
7. `line-height` mínimo para texto funcional: `1.375`.

## Escala

- `--text-xs`: 12px
- `--text-sm`: 14px
- `--text-base`: 16px
- `--text-lg`: 18px
- `--text-xl`: 20px
- `--text-2xl`: 24px
- `--text-3xl`: 30px
- `--text-4xl`: 36px
- `--text-5xl`: 48px
- `--text-6xl`: 60px
- `--text-7xl`: 72px

## Tokens semânticos

- `--typography-display`
- `--typography-hero`
- `--typography-heading-1`
- `--typography-heading-2`
- `--typography-heading-3`
- `--typography-heading-4`
- `--typography-section-title`
- `--typography-body-large`
- `--typography-body`
- `--typography-body-small`
- `--typography-label`
- `--typography-caption`
- `--typography-button`
- `--typography-nav`

## Aplicação neste projeto

- `src/styles/global.css` é a fonte de verdade.
- `BaseLayout.astro` carrega `Plus Jakarta Sans` no Google Fonts.
- Home, header, footer e páginas de artigo devem herdar a mesma família tipográfica.
