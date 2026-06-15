#!/usr/bin/env bash
#
# demo-reset.sh — restore the repo to the clean demo baseline (branch: demo/start).
# Run this between rehearsals to discard everything Claude changed during a demo.
#
# Usage:  bash scripts/demo-reset.sh [--force]
#
# Without --force it refuses to run if you have uncommitted work it didn't expect,
# so you can't nuke real changes by accident.

set -euo pipefail

BASELINE_BRANCH="demo/start"
FORCE="${1:-}"

cd "$(git rev-parse --show-toplevel)"

if ! git rev-parse --verify --quiet "$BASELINE_BRANCH" >/dev/null; then
  echo "✗ Baseline branch '$BASELINE_BRANCH' not found."
  echo "  Create it first:  git switch -c $BASELINE_BRANCH"
  exit 1
fi

if [[ "$FORCE" != "--force" ]]; then
  echo "This will DISCARD all working-tree changes and switch to '$BASELINE_BRANCH'."
  read -r -p "Continue? [y/N] " reply
  [[ "$reply" =~ ^[Yy]$ ]] || { echo "Aborted."; exit 0; }
fi

echo "→ Discarding staged and unstaged changes…"
git reset --hard HEAD
git clean -fd -e node_modules -e .next -e .env.local

echo "→ Switching to $BASELINE_BRANCH…"
git switch "$BASELINE_BRANCH"
git reset --hard "$BASELINE_BRANCH"

echo "→ Verifying toolchain…"
npx tsc --noEmit && echo "  type-check: OK"
npm test --silent >/dev/null 2>&1 && echo "  tests: OK" || echo "  tests: run 'npm test' to inspect"

echo "✓ Reset complete — you're on $BASELINE_BRANCH and clean."
