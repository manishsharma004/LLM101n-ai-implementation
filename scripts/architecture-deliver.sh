#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SKILL="${ARCHIFY_SKILL_DIR:-$ROOT/.cursor/skills/archify}/bin/archify.mjs"
JSON="$ROOT/docs/architecture/llm101n-runtime.architecture.json"
HTML="$ROOT/public/architecture/llm101n-runtime.architecture.html"
if [[ ! -f "$SKILL" ]]; then
  echo "Archify not found. Run: bash scripts/install-archify-skill.sh" >&2
  exit 1
fi
mkdir -p "$(dirname "$HTML")"
REV="$(git -C "$ROOT" rev-parse HEAD)"
node "$SKILL" deliver architecture "$JSON" "$HTML" --quality standard --repo-root "$ROOT" --json
echo "Wrote $HTML (revision $REV)"
