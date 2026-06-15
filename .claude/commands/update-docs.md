---
description: Audit docs against the actual code and update anything out of sync
argument-hint: "[number of recent commits to review, default 5]"
allowed-tools: Read, Grep, Glob, Edit, Bash(git diff:*), Bash(git log:*), Bash(git show:*)
---

You are doing a **documentation freshness pass**. Base everything on the actual
code, not assumptions.

## Scope

Review the changes in the last **${1:-5}** commits:

!`git log --oneline -n ${1:-5}`

## Steps

1. Read `CLAUDE.md`, `README.md`, and everything under `docs/`.
2. Compare each documented claim against the real code:
   - Tech stack & framework (e.g. is it really Express, or Next.js?)
   - Commands in `package.json` `scripts`
   - API routes that actually exist under `src/app/api/`
   - Env vars actually read in code vs. `.env.example`
   - Model names / external services referenced
3. Produce a short **audit table** first: `Area | Status | Issue | Priority`.
4. Then update the stale docs. Fix HIGH priority items (wrong framework,
   wrong commands, missing/incorrect API routes) before LOW priority polish.
5. Keep `CLAUDE.md` pointer-style and under ~200 lines. Do **not** invent
   business rationale — document what the code does, flag anything whose
   *why* is unclear.

Show me the audit table and the proposed diffs before writing.
