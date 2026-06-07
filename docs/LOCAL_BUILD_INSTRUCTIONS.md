# Local Build Instructions

## Prerequisites

Required:

- Git
- Python 3
- Node.js 20+ and npm for the current test/package harness while the runtime migrates to Python

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

`npm run check` runs Node compatibility tests, Python runtime tests, and Python CLI smoke commands for `doctor`, `brief --demo`, `open-loops --demo`, and `prepare-meeting --demo`.

## Try the local MVP

```bash
npm run dev -- doctor
npm run dev -- init --local
npm run dev -- sources list
npm run dev -- sources add demo ./examples/demo-data
npm run dev -- sources show demo
npm run dev -- sources approve demo
npm run dev -- audit log
npm run dev -- license status
npm run dev -- setup agent hermes --json
npm run dev -- setup verify --json
npm run dev -- sources list
npm run dev -- brain status
npm run dev -- brief --demo
npm run dev -- open-loops --demo
npm run dev -- prepare-meeting --demo
```

All demo output is synthetic. Do not replace `examples/demo-data/` with real Laurelin, customer, investor, or private Obsidian data in the public repo.

## Add and approve a source candidate

`sources add` does not index the folder. It only records a candidate source in `.laurelinos/sources.json` and writes an audit event in `.laurelinos/logs/audit.jsonl`.

```bash
npm run dev -- sources add notes ./some-local-folder
npm run dev -- sources show notes
npm run dev -- audit log
```

The source record is created with:

```text
approvedForIndexing: false
approvalStatus: candidate
```

Approve the source only after the user has explicitly agreed that this path can be used by future indexing work:

```bash
npm run dev -- sources approve notes
npm run dev -- audit log
```

Approval updates the source metadata and audit log, but still does not index or read source file contents. Do not point this at private folders for demos unless the user has explicitly approved the source and the data will not be committed.

## License status and local activation

Demo commands do not require a license:

```bash
npm run dev -- license status
```

For manual paid pilots later, a Laurelin-issued activation token can create a local license record:

```bash
npm run dev -- license activate <token>
npm run dev -- license status
```

The raw activation token is not stored or echoed. The current implementation is local-only and does not contact Stripe or a hosted entitlement service.

## Agentic setup plan

Use this to produce a machine-readable MCP setup plan for an existing agent runtime:

```bash
npm run dev -- setup agent openclaw --json
npm run dev -- setup agent hermes --json
npm run dev -- setup verify --json
```

The setup plan tells an installer agent which local stdio MCP command to configure, which demo commands to run, and which safety constraints to preserve. It does not install Hermes/OpenClaw, store model credentials, expose remote MCP, or read real source folders.

## Install local command

```bash
npm link
laurelinos doctor
laurelinos brief --demo
```

## Loom demo smoke

Use this to prepare a public-safe terminal demo:

```bash
npm run demo:loom
```

Recording guidance lives in `docs/demo/LOOM_DEMO_SCRIPT.md`.

## MCP smoke test

The v0 MCP server is local stdio only. It exposes synthetic read-only tools and should not be run as a public network service.

List tools:

```bash
printf '%s\n' \
  '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}' \
  '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}' \
  | python3 ./bin/laurelinos.py mcp serve
```

Call a synthetic tool:

```bash
printf '%s\n' \
  '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}' \
  '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"get_daily_brief","arguments":{}}}' \
  | python3 ./bin/laurelinos.py mcp serve
```

Expected tools:

```text
get_status
get_daily_brief
get_open_loops
prepare_meeting
```

## What not to do for v0

- Do not deploy.
- Do not create GCP, VPS, or other cost-incurring cloud resources.
- Do not expose remote MCP endpoints or open public ports.
- Do not add live Stripe checkout or webhook secrets.
- Do not build `laurelinos.dev` before the local runtime is useful.
