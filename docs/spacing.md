# Spacing

Base importada do sistema de spacing do `naqui`, adaptada para este portfólio em CSS custom properties.

## Escala base

- `--space-1`: 4px
- `--space-2`: 8px
- `--space-3`: 12px
- `--space-4`: 16px
- `--space-5`: 24px
- `--space-6`: 32px
- `--space-7`: 48px
- `--space-8`: 64px

## Regras

1. Usar `rem` em toda a escala.
2. Preferir tokens semânticos e a escala base em vez de valores avulsos.
3. `space-3` e `space-4` cobrem gaps internos pequenos.
4. `space-5` e `space-6` cobrem cards, blocos e separação entre grupos.
5. `space-7` e `space-8` ficam para respiros de seção e áreas hero.
6. Em mobile, considerar o espaço seguro da bottom nav antes de encostar conteúdo no rodapé.

## Aplicação neste projeto

- `--space-section` define o respiro principal vertical entre seções.
- `--mobile-bottom-nav-height` reserva a área da navegação inferior em telas pequenas.
- Cards, grids, stacks e ações da home usam a mesma escala para padding, gap e margem.
