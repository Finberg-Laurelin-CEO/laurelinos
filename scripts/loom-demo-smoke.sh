#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CLI="$ROOT/bin/laurelinos.mjs"
DEMO_CONFIG_DIR="$(mktemp -d)"
DEMO_WORKSPACE="$(mktemp -d)"
cleanup() {
  rm -rf "$DEMO_CONFIG_DIR" "$DEMO_WORKSPACE"
}
trap cleanup EXIT

export LAURELINOS_CONFIG_DIR="$DEMO_CONFIG_DIR"

echo "# LaurelinOS Loom demo smoke"
echo

echo "## doctor"
node "$CLI" doctor

echo
echo "## license status"
node "$CLI" license status

echo
echo "## agentic setup plan"
node "$CLI" setup agent openclaw --json
node "$CLI" setup verify --json

echo
echo "## init --local and source approval audit"
(
  cd "$DEMO_WORKSPACE"
  node "$CLI" init --local
  node "$CLI" sources add demo "$ROOT/examples/demo-data"
  node "$CLI" sources show demo
  node "$CLI" sources approve demo
  node "$CLI" audit log
)

echo
echo "## brief --demo"
node "$CLI" brief --demo

echo
echo "## open-loops --demo"
node "$CLI" open-loops --demo

echo
echo "## mcp stdio smoke"
printf '%s\n' \
  '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}' \
  '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}' \
  '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"get_open_loops","arguments":{}}}' \
  | node "$CLI" mcp serve
