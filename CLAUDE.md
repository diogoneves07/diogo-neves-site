# diogo-neves-site — Claude Context

---

## PIPELINE OBRIGATÓRIA — NÃO PULE NENHUMA ETAPA

**Antes de gerar qualquer código**, output obrigatório:

```
## Specification   ← inclui cenários Gherkin + procedimentos de QA
## Architecture
```

**Após concluir**, output obrigatório:

```
## Cleaner Report
## Review Report
## Security Report
## QA Report       ← inclui resultado (✓/✗) de cada passo do Specifier
## Metrics Report  ← contagem de linhas por arquivo modificado; ≥ 300 linhas → ⚠️
```

Etapas em ordem: **specifier → architect → coder → cleaner → reviewer → hardener → qa → metrics**
Todas sequenciais, bloqueantes, obrigatórias. Nenhuma pode ser pulada.
Se QA não for APPROVED, volte ao início do ciclo. Metrics Report é informativo (não bloqueia).

Referência completa: [`docs/engineering-pipeline.md`](docs/engineering-pipeline.md)

---

## Agent Priority Order

1. `CLAUDE.md` (always loaded)
2. Source code (ground truth)
3. External assumptions (avoid)

## Default Operating Mode

- Minimal context loading — reason locally first.
- Never expand context to reduce effort; narrow it instead.
- **Before implementing any component**, search existing source for similar patterns first.

## Project Status — Sendo refeito do zero

Projeto pessoal em reconstrução total. Sem usuários reais, sem dados em produção.

- Sem necessidade de compatibilidade retroativa — renomear ou substituir qualquer coisa livremente.
- Deletar código morto imediatamente.
- Sem feature flags. Entregue direto.
- Em caso de dúvida: escolha o redesign limpo ao invés de um patch retrocompatível.

## Why / What / How

**Why** — Site pessoal de portfólio de Diogo Neves.

**What** — SPA com Vite + TypeScript + Bemtv (framework reativo próprio).

**How** — Sem build tool além do Vite. Sem testes automatizados atualmente.

```
npm run dev | build | preview
```

---

## Mandatory Docs — Open ONLY when relevant

| When                                  | Doc                                  |
| ------------------------------------- | ------------------------------------ |
| Pipeline details / stage contracts    | `docs/engineering-pipeline.md`       |
| Code rules, forbidden patterns, DoD   | `docs/engineering-standards.md`      |
| Feature / fix / refactor (workflow)   | `docs/github-workflow.md`            |

## Document Decision System

- Confidence ≥ 80% → do NOT open extra docs.
- Confidence 50–80% → ask the user before opening a large doc.
- Confidence < 50% → open the single smallest relevant doc only.
- Never open more than one documentation file per decision cycle.
