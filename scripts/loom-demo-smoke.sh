#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CLI="$ROOT/bin/laurelinos.py"
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
python3 "$CLI" doctor

echo
echo "## license status"
python3 "$CLI" license status

echo
echo "## agentic setup plan"
python3 "$CLI" setup agent openclaw --json
python3 "$CLI" setup verify --json

echo
echo "## init --local and source approval audit"
(
  cd "$DEMO_WORKSPACE"
  python3 "$CLI" init --local
  python3 "$CLI" sources add demo "$ROOT/examples/demo-data"
  python3 "$CLI" sources show demo
  python3 "$CLI" sources approve demo
  python3 "$CLI" sources scan demo --json
  python3 "$CLI" sources index demo --json
  python3 "$CLI" brain search Northstar --json
  python3 "$CLI" audit log
)

echo
echo "## brief --demo"
python3 "$CLI" brief --demo

echo
echo "## open-loops --demo"
python3 "$CLI" open-loops --demo

echo
echo "## prepare-meeting --demo"
python3 "$CLI" prepare-meeting --demo

echo
echo "## mcp stdio smoke"
printf '%s\n' \
  '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}' \
  '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}' \
  '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"search_memory","arguments":{"query":"Northstar"}}}' \
  | python3 "$CLI" mcp serve
