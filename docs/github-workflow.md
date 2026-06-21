# GitHub Workflow

Standardized workflow for implementing features using the GitHub CLI (`gh`),
ensuring traceable development with automatic issue-PR linking, conventional
commits, and a clean merge strategy.

---

## Prerequisites

Install GitHub CLI:

```bash
# Windows
winget install GitHub.cli

# macOS
brew install gh

# Linux
sudo apt install gh
```

Authenticate:

```bash
gh auth login
# Follow prompts: GitHub.com → HTTPS → Paste token
```

---

## Workflow Overview

```
┌─────────────────────────────────────────────────────┐
│ 1. CREATE ISSUE                                     │
│    gh issue create --title "..." --body "..."       │
│    ↓ Returns: issue #123                            │
├─────────────────────────────────────────────────────┤
│ 2. CREATE LINKED BRANCH                             │
│    gh issue develop 123                             │
│    → Branch: 123-short-slug                         │
│    → Auto-linked to issue #123                      │
├─────────────────────────────────────────────────────┤
│ 3. IMPLEMENT (commit + push)                        │
│    git add . && git commit -m "feat: ..."           │
│    git push origin 123-short-slug                   │
├─────────────────────────────────────────────────────┤
│ 4. OPEN PR (auto-references issue)                  │
│    gh pr create --fill                              │
│    → PR #456 → Issue #123                           │
├─────────────────────────────────────────────────────┤
│ 5. REVIEW & ITERATE                                 │
│    • Review changes                                 │
│    • Address feedback → new commits → push          │
├─────────────────────────────────────────────────────┤
│ 6. MERGE & CLOSE                                    │
│    gh pr merge --squash --delete-branch --auto      │
│    → Closes issue #123 automatically                │
│    → Deletes branch                                 │
└─────────────────────────────────────────────────────┘
```

---

## Step-by-Step

### 1. Create Issue

```bash
gh issue create \
  --title "feat: add dark mode toggle" \
  --body "## Description
Add a toggle to switch between light and dark modes.

## Requirements
- [ ] Toggle button visible in the header
- [ ] Preference persisted across page reloads

## Acceptance Criteria
- Toggle switches theme immediately
- Preference is saved and restored on next visit"
```

Returns: `Issue #123`

---

### 2. Create Linked Branch

```bash
gh issue develop 123
# ✓ Switched to a new branch '123-add-dark-mode-toggle'
# ✓ Branch is now tracking 'origin/123-add-dark-mode-toggle'
```

The branch is created from `main`, linked to issue #123, and named
`{number}-{slug}`.

---

### 3. Implement & Commit

```bash
# Stage changes
git add src/components/ThemeToggle.ts

# Commit
git commit -m "feat: add dark mode toggle component

- Adds ThemeToggle to header
- Persists preference in localStorage"

# Push
git push origin 123-add-dark-mode-toggle
```

**Commit message format:**

```
<type>: <description>

<body (optional)>

<footer: Closes #N>
```

**Types:** `feat`, `fix`, `refactor`, `test`, `chore`, `docs`, `style`

**Rules:**
- Description: **English**, imperative mood, max 72 chars
- Body: optional, explains *why* not *what*
- Footer: `Closes #123` to auto-close the issue on merge

**Examples:**

```
feat: add project cards to portfolio section
fix: correct routing on direct URL access
refactor: simplify article rendering logic
docs: update engineering pipeline reference
```

---

### 4. Open Pull Request

```bash
gh pr create \
  --title "feat: add dark mode toggle" \
  --body "Closes #123

## Changes
- New ThemeToggle component
- localStorage persistence

## Checklist
- [x] Build passes: \`npm run build\`
- [x] Tested locally in browser
- [x] No dead code left behind" \
  --head 123-add-dark-mode-toggle \
  --base main
```

Returns: `PR #456`

---

### 5. Review & Iterate

```bash
# Check PR status
gh pr view 456

# Address feedback — commit and push to the same branch
git add .
git commit -m "fix: address review feedback on theme persistence"
git push origin 123-add-dark-mode-toggle
```

---

### 6. Merge & Close

```bash
gh pr merge 456 --squash --delete-branch --auto
```

Result:
- PR merged to `main`
- Issue #123 closed automatically
- Branch deleted

---

## Checklist Before Merge

- [ ] `npm run build` passes
- [ ] Feature tested locally in browser
- [ ] PR description contains `Closes #ISSUE_NUMBER`
- [ ] No `TODO` or `FIXME` left in touched files
- [ ] No dead code introduced

---

## Troubleshooting

| Problem | Solution |
| ------- | -------- |
| Branch deleted accidentally | `gh issue develop -c <NUMBER>` |
| PR references wrong issue | `gh pr edit <PR> --body "Closes #CORRECT"` |
| Merge conflicts | `git pull origin main` → resolve → commit → push |

---

## Quick Reference

For the one-page cheat sheet: [`docs/github-workflow-quickref.md`](github-workflow-quickref.md)
