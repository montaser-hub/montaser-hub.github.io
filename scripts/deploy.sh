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
BUILD_BRANCH=gh-pages-build

# The temporary branch can only be deleted once its worktree is gone, and a
# leftover from an interrupted run would make the next one fail.
cleanup() {
  git worktree remove --force "$WORKTREE" 2>/dev/null || true
  git branch -D "$BUILD_BRANCH" >/dev/null 2>&1 || true
}
trap cleanup EXIT
git branch -D "$BUILD_BRANCH" >/dev/null 2>&1 || true

git worktree add --detach "$WORKTREE" >/dev/null
(
  cd "$WORKTREE"
  git checkout --orphan "$BUILD_BRANCH" >/dev/null
  git rm -rfq . >/dev/null 2>&1 || true
  cp -a "$OLDPWD/out/." .
  git add -A
  git commit -qm "Deploy $SHA"
  git push -f origin HEAD:gh-pages
)
echo "Published $SHA to gh-pages"
