#!/usr/bin/env bash
set -euo pipefail

# Usage from inside the cloned GitHub repo:
#   bash /path/to/scripts/apply-scaffold-to-existing-repo.sh /path/to/scaffold

SCAFFOLD_DIR="${1:-}"
if [ -z "$SCAFFOLD_DIR" ]; then
  echo "Usage: $0 /path/to/laurelinos-repo-ready-v1" >&2
  exit 1
fi

if [ ! -d ".git" ]; then
  echo "Run this from inside the cloned laurelinos Git repository." >&2
  exit 1
fi

rsync -av --exclude='.git' "$SCAFFOLD_DIR"/ ./

echo "Scaffold copied. Review changes, then run:"
echo "  npm install"
echo "  npm test"
echo "  npm run check"
echo "  git add ."
echo "  git commit -m 'Initial LaurelinOS local-first MVP scaffold'"
echo "  git push -u origin main"
