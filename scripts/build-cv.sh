#!/usr/bin/env bash
# Writes both CV files the site links to, from lib/data.ts: the PDF (the /cv
# page, printed) and the Word version. Needs Google Chrome or Chromium.
# Usage: npm run cv   (run it after changing CV-related data, then deploy)
set -euo pipefail

PORT=4587
CHROME=$(command -v google-chrome || command -v chromium || command -v chromium-browser)
FILE=$(node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON -e 'import("./lib/data.ts").then((data) => console.log(data.cv.file))')

npx next build >/dev/null
python3 -m http.server "$PORT" --directory out >/dev/null 2>&1 &
SERVER=$!
trap 'kill "$SERVER" 2>/dev/null || true' EXIT
sleep 1

"$CHROME" --headless --no-sandbox --disable-gpu --no-pdf-header-footer \
  --print-to-pdf="public$FILE" "http://localhost:$PORT/cv.html" 2>/dev/null
echo "Wrote public$FILE"
node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/build-cv-docx.ts
