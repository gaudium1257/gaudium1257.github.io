#!/usr/bin/env bash
# Make a fresh checkout (e.g. a cloud session) ready to run checks immediately.
set -euo pipefail
cd "${CLAUDE_PROJECT_DIR:-$(dirname "$0")/../..}"
if [ ! -d node_modules ] || [ package-lock.json -nt node_modules/.package-lock.json ]; then
  npm ci --no-audit --no-fund >/dev/null 2>&1 || npm install --no-audit --no-fund >/dev/null 2>&1
  echo "dependencies installed"
fi
branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "?")
echo "branch: $branch (work on dev/<description> branches; see CLAUDE.md)"
