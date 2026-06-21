# GitHub Workflow — Quick Reference

One-page cheat sheet for the mandatory GitHub CLI workflow.

---

## The 6-Step Flow

```
1. Issue  → gh issue create --title "feat: ..." --body "..."
   ↓ Returns: Issue #123

2. Branch → gh issue develop 123
   ↓ Creates & switches to: 123-slug

3. Code   → Edit files
   ↓ Commit: feat: description

4. Push   → git push origin 123-slug

5. PR     → gh pr create --fill
   ↓ Returns: PR #456 (auto-references #123)

6. Merge  → gh pr merge --squash --delete-branch --auto
   ↓ Auto-closes: Issue #123
```

---

## Command Reference

| Task              | Command                                                   |
| ----------------- | --------------------------------------------------------- |
| **New issue**     | `gh issue create --title "..." --body "..."`              |
| **Branch**        | `gh issue develop <NUMBER>`                               |
| **Commit**        | `git commit -m "feat: description"`                       |
| **Push**          | `git push origin <BRANCH>`                                |
| **Open PR**       | `gh pr create --fill`                                     |
| **Merge & close** | `gh pr merge <PR> --squash --delete-branch --auto`        |
| **View PR**       | `gh pr view <PR_NUMBER>`                                  |
| **List my PRs**   | `gh pr list --assignee @me`                               |

---

## Commit Message Format

```
<type>: <description in English, imperative, max 72 chars>

<optional body — why, not what>

Closes #123
```

**Types:** `feat`, `fix`, `refactor`, `chore`, `docs`, `style`, `test`

**Examples:**

```
feat: add contact section to homepage
fix: correct scroll position on route change
refactor: extract article renderer into its own module
docs: add github workflow quick reference
```

---

## Checklist Before Merge

- [ ] `npm run build` passes
- [ ] Feature tested locally in the browser
- [ ] PR body contains `Closes #ISSUE_NUMBER`
- [ ] No `TODO` or `FIXME` in touched files
- [ ] No dead code left behind

---

## In Case of Problems

| Problem | Solution |
| ------- | -------- |
| Branch deleted | `gh issue develop -c <NUMBER>` |
| Wrong issue linked | `gh pr edit <PR> --body "Closes #CORRECT"` |
| Merge conflicts | `git pull origin main` → resolve → commit → push |

---

Full details: [`docs/github-workflow.md`](github-workflow.md)
