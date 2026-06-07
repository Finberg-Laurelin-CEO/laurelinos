# Local Build Instructions

## Prerequisites

Required:

- Git
- Node.js 20+
- npm

Optional:

- GitHub CLI (`gh`)
- GBrain
- Claude Code / Claude local tooling
- Codex CLI
- Superset

Optional tools are detected by `doctor`. The synthetic local MVP does not require GBrain, Claude, Codex, GCP, a VPS, Stripe, or hosted infrastructure.

## First run

```bash
npm install
npm test
npm run check
```

`npm run check` runs the unit tests plus local demo smoke commands for `doctor`, `brief --demo`, and `open-loops --demo`.

## Try the local MVP

```bash
npm run dev -- doctor
npm run dev -- init --local
npm run dev -- sources list
npm run dev -- sources add demo ./examples/demo-data
npm run dev -- sources list
npm run dev -- brain status
npm run dev -- brief --demo
npm run dev -- open-loops --demo
```

All demo output is synthetic. Do not replace `examples/demo-data/` with real Laurelin, customer, investor, or private Obsidian data in the public repo.

## Add a source candidate

This does not index the folder. It only records a candidate source in `.laurelinos/sources.json`.

```bash
npm run dev -- sources add notes ./some-local-folder
npm run dev -- sources list
```

The source record is created with:

```text
approvedForIndexing: false
```

Indexing must be added later with an explicit approval flow. Do not point this at private folders for demos unless the user has explicitly approved the source and the data will not be committed.

## Install local command

```bash
npm link
laurelinos doctor
laurelinos brief --demo
```

## MCP smoke test

The v0 MCP server is local stdio only. It exposes synthetic read-only tools and should not be run as a public network service.

List tools:

```bash
printf '%s\n' \
  '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}' \
  '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}' \
  | node ./bin/laurelinos.mjs mcp serve
```

Call a synthetic tool:

```bash
printf '%s\n' \
  '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}' \
  '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"get_daily_brief","arguments":{}}}' \
  | node ./bin/laurelinos.mjs mcp serve
```

Expected tools:

```text
get_status
get_daily_brief
get_open_loops
```

## What not to do for v0

- Do not deploy.
- Do not create GCP, VPS, or other cost-incurring cloud resources.
- Do not expose remote MCP endpoints or open public ports.
- Do not add live Stripe checkout or webhook secrets.
- Do not build `laurelinos.dev` before the local runtime is useful.
