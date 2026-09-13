#!/usr/bin/env bash
# Install Archify skill from https://github.com/tt-a1i/archify
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TARGET="${ARCHIFY_SKILL_DIR:-$ROOT/.cursor/skills/archify}"
if command -v npx >/dev/null 2>&1; then
  npx -y skills add tt-a1i/archify --skill archify --agent cursor --copy --yes
  exit 0
fi
TMP="${TMPDIR:-/tmp}/archify-clone"
rm -rf "$TMP"
git clone --depth 1 https://github.com/tt-a1i/archify.git "$TMP"
mkdir -p "$(dirname "$TARGET")"
rm -rf "$TARGET"
cp -r "$TMP/archify" "$TARGET"
node "$TARGET/bin/archify.mjs" doctor
