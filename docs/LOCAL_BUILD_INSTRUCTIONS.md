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

## First run

```bash
npm install
npm test
npm run check
```

## Try the local MVP

```bash
npm run dev -- doctor
npm run dev -- init --local
npm run dev -- sources list
npm run dev -- brain status
npm run dev -- brief --demo
npm run dev -- open-loops --demo
```

## Add a source candidate

This does not index the folder. It only records a candidate source.

```bash
npm run dev -- sources add notes ./some-local-folder
npm run dev -- sources list
```

The source record is created with:

```text
approvedForIndexing: false
```

Indexing must be added later with an explicit approval flow.

## Install local command

```bash
npm link
laurelinos doctor
laurelinos brief --demo
```

## MCP smoke test

Start the server:

```bash
npm run dev -- mcp serve
```

Then send one JSON-RPC line over stdin:

```json
{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}
```

The server should return the synthetic read-only tools.
