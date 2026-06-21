# Engineering Pipeline

This project uses a mandatory multi-agent engineering workflow for every
implementation, bug fix, feature, and refactor.

This pipeline extends the rules in `CLAUDE.md` and `AGENTS.md`. It does not
replace architecture constraints, security requirements, or quality gates
already defined there.

## Stages

1. Specifier
2. Architect
3. Coder
4. Cleaner
5. Reviewer
6. Hardener
7. QA
8. Metrics

## Execution Model

- Stages are sequential, mandatory, and blocking.
- Stages cannot be skipped.
- Failure at any blocking stage stops progression and returns to Coder.
- QA approval is required before a task is considered complete.

## Required Flow

Specifier → Architect → Coder → Cleaner → Reviewer → Hardener → QA → Metrics

## Stage Contracts

### 1. Specifier

Agent definition: `.ai/agents/specifier.md`

- Produce a **Specification Report** with two mandatory artifacts:
  1. **Gherkin scenarios** — one `Scenario` block per acceptance criterion using `Given / When / Then`.
  2. **User-oriented QA procedures** — numbered steps written in plain language as if a non-technical person were testing the feature manually (e.g. "1. Open the page. 2. Click X. 3. Verify Y appears.").
- Define requirements, acceptance criteria, edge cases, constraints, and risks.
- Must not write code.
- No code may be written before this report exists.

### 2. Architect

Agent definition: `.ai/agents/architect.md`

- Produce an **Architecture Report** defining file boundaries, interfaces, dependencies, and risks.
- Must not write production code.
- No production code may be written before this report exists.

### 3. Coder

Agent definition: `.ai/agents/coder.md`

- Implement exactly what the Specification and Architecture Reports require.
- Do not invent requirements or bypass project constraints.
- Keep changes minimal, explicit, and reviewable.

### 4. Cleaner

Agent definition: `.ai/agents/cleaner.md`

- Improve maintainability without changing approved behavior.
- Remove duplication, improve naming, reduce nesting, apply SRP.
- Produce a **Cleaner Report**.

### 5. Reviewer

Agent definition: `.ai/agents/reviewer.md`

- Perform senior engineering review for correctness, architecture compliance, and maintainability.
- Classify findings as Critical, Warning, or Suggestion.
- Critical findings block progression.
- Produce a **Review Report**.

### 6. Hardener

Agent definition: `.ai/agents/hardener.md`

- Perform security and resilience review.
- Classify findings as Critical, Warning, or Suggestion.
- Critical findings block progression.
- Produce a **Security Report**.

### 7. QA

Agent definition: `.ai/agents/qa.md`

- Execute every QA procedure written by the Specifier. Record each step as `✓ passed` or `✗ failed`. Any `✗ failed` is an automatic `REJECTED`.
- Validate acceptance criteria against the Gherkin scenarios.
- Produce a **QA Report** with `APPROVED` or `REJECTED`.

### 8. Metrics

Agent definition: `.ai/agents/metrics.md`

- Runs only after `QA Status: APPROVED`.
- List every file added or modified (`git diff --name-only HEAD`).
- Count current lines per file (`wc -l`). Flag files ≥ 300 lines with ⚠️.
- Informational only — does not block completion.
- Produce a **Metrics Report**.

## Required Reports

**Before implementation:**

```
## Specification   ← Gherkin scenarios + user-oriented QA procedures
## Architecture
```

**Before completion:**

```
## Cleaner Report
## Review Report
## Security Report
## QA Report       ← step results (✓/✗ per step) + APPROVED | REJECTED
## Metrics Report  ← line count per modified file; ≥ 300 lines → ⚠️
```

## Failure Handling

If any post-Coder stage fails, return to Coder and repeat the remediation loop:

```
Coder → Cleaner → Reviewer → Hardener → QA
```

Repeat until `QA Status: APPROVED`.

## Completion Rule

A task is complete only when `QA Status: APPROVED` and the Metrics Report has
been produced.

## Compatibility

This workflow is written in plain Markdown for compatibility with Claude Code,
Codex, Cursor, Cline, and Gemini.
