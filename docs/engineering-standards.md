# Engineering Standards

Referenced by `CLAUDE.md` and `AGENTS.md`. Open only when you need detail on a
specific rule — do not load proactively.

---

## Code Style

- Functions: 4–20 lines. Split if longer.
- Files: under 300 lines. Split by responsibility.
- One thing per function, one responsibility per module (SRP).
- Names: specific and descriptive. Avoid `data`, `handler`, `Manager`, `utils`. Prefer names with fewer than 5 grep hits.
- Types: explicit. No `any`, no untyped functions.
- No code duplication. Extract shared logic into a dedicated function or module.
- Early returns over nested ifs. Max 2 levels of indentation.

## Comments

- Write WHY, not WHAT. Skip `// increment counter` above `i++`.
- Write a comment only when the reason for a decision would surprise a future reader.
- Reference issue numbers or commit SHAs when a line exists because of a specific bug or external constraint.

## Structure

- `src/components/` for UI components.
- `src/articles/` for article content.
- `src/state-fns/` for state logic.
- Prefer small focused modules over large files that mix concerns.

## Formatting

- No formatter is currently configured — maintain consistent style with the surrounding code.

---

## Forbidden Patterns

These are never acceptable:

- Business logic inside components (belongs in `state-fns/` or dedicated modules)
- Inline `fetch` calls inside components (use a dedicated service function)
- Shared mutable state mutated across unrelated modules
- Duplicating equivalent logic in multiple places instead of extracting a shared function
- Hardcoded magic strings or numbers without a named constant

## AI Anti-patterns

Do not do these even if they seem helpful:

- Do not create abstractions before the second real use case exists
- Do not create utility files for a single caller
- Do not move or rename code unless the task explicitly requires it
- Do not rewrite working code without an explicit reason stated by the user
- Do not introduce patterns not already present in the codebase
- Do not add error handling for scenarios that cannot actually occur
- Do not add comments that describe what the code does — only why

---

## Definition of Done

A task is only complete when all of the following are true:

- `npm run build` passes (TypeScript + Vite)
- No `TODO` or `FIXME` left in touched files
- Docs updated if behavior or public API changed
- The change is no larger than the task requires

## Decision Priority

When rules conflict, follow this order:

1. Security
2. Correctness
3. Architecture boundaries
4. Type safety
5. Simplicity
6. Performance
7. Developer convenience
