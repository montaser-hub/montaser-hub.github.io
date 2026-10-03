#!/usr/bin/env bash
# Regenerates my GitHub profile README from the site's data and from GitHub
# (repositories, contributions), then publishes it to the profile repository.
# Run it after changing lib/data.ts or publishing a repo. Usage: npm run profile:publish
set -euo pipefail

LOGIN=$(gh api user --jq .login)
npm run profile

CLONE=$(mktemp -d)
trap 'rm -rf "$CLONE"' EXIT
git clone -q "git@github.com:$LOGIN/$LOGIN.git" "$CLONE"

# The generated folder is the whole repository: replace everything in it.
git -C "$CLONE" rm -rq --ignore-unmatch .
cp -a profile/. "$CLONE"
git -C "$CLONE" add -A

if git -C "$CLONE" diff --cached --quiet; then
  echo "Profile is already up to date."
  exit 0
fi
git -C "$CLONE" commit -qm "Update profile from $(git rev-parse --short HEAD)"
git -C "$CLONE" push -q origin HEAD
echo "Published the profile to github.com/$LOGIN (images refresh within about five minutes)."
