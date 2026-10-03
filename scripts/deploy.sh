#!/usr/bin/env bash
# Builds the static site and publishes it to the `gh-pages` branch, which
# GitHub Pages serves. The project list is read from GitHub at build time, so
# run this again after publishing or renaming a repo. Usage: npm run deploy
set -euo pipefail

npm run images
rm -rf .next/cache/fetch-cache   # always list the current repos
npx next build
touch out/.nojekyll              # keep the _next/ folder

SHA=$(git rev-parse --short HEAD)
WORKTREE=$(mktemp -d)
trap 'git worktree remove --force "$WORKTREE" 2>/dev/null || true' EXIT

git worktree add --detach "$WORKTREE" >/dev/null
(
  cd "$WORKTREE"
  git checkout --orphan gh-pages-build >/dev/null 2>&1
  git rm -rfq . >/dev/null 2>&1 || true
  cp -a "$OLDPWD/out/." .
  git add -A
  git commit -qm "Deploy $SHA"
  git push -f origin HEAD:gh-pages
)
git branch -D gh-pages-build >/dev/null 2>&1 || true
echo "Published $SHA to gh-pages"
