# LaurelinOS MVP Specification

## Goal

Build a local-first AI-native OS layer that can be used as an AI chief of staff for founders and tiny teams.

The MVP should prove this loop:

```text
approved local sources
    -> company brain / memory kernel
    -> daily brief and open-loop detection
    -> agent-readable tools over MCP
    -> approval-gated suggested actions
    -> write-back to approved Markdown
```

## Explicit non-goals

The MVP is not:

- a full Linux distribution;
- a local-model-first product;
- a public website demo;
- a generic chat interface;
- a hosted SaaS requiring Laurelin to pay all inference costs;
- a rebrand of GBrain.

## Why local-first

Local-first is the correct MVP because:

1. Users can connect existing Claude, Codex, or API-key workflows.
2. Production inference costs stay low.
3. Sensitive company context does not have to be centralised on Laurelin servers.
4. The tool can be tested by Joseph and early design partners before building hosted onboarding.

## Commercial wedge

Sell the outcome as:

> An AI chief of staff that runs on your existing Claude/Codex/API-key setup and gives your company persistent memory, daily briefs, open-loop detection, and approval-gated follow-up workflows.

The long-term category is AI-native OS / company brain. The first paid wedge is a local-first founder chief of staff.

## Product architecture

```text
CLI / MCP clients / future desktop UI
        ↓
LaurelinOS runtime core
        ↓
Context service + workflow engine + approval gates
        ↓
GBrain adapter + local Markdown/source adapters
        ↓
Approved notes, docs, meetings, code, and synthetic demo data
```

## Initial monorepo layout

```text
bin/                         zero-dependency CLI entry point for v0
lib/                         small runtime helpers for the first local demo
packages/cli                 future package for terminal interface
packages/runtime-core        session, config, permissions, workflow orchestration
packages/gbrain-adapter      integration boundary around GBrain
packages/mcp-server          MCP tools for Claude/Codex/Hermes/OpenClaw
packages/workflows           daily brief, open-loop detection, meeting prep
apps/docs-site               future Vercel docs site, not built first
skills/                      human-readable workflow/skill specs
prompts/                     prompts for coding agents
scripts/                     repo bootstrap and local setup scripts
```

## MVP commands

### `laurelinos doctor`

Reports local environment status:

- OS;
- Node availability;
- git availability;
- GitHub CLI availability;
- GBrain availability;
- Claude/Codex command availability if installed;
- location of local LaurelinOS config;
- warnings about missing optional dependencies.

### `laurelinos init --local`

Creates a local config directory:

```text
.laurelinos/
├── config.json
├── sources.json
├── logs/
└── state/
```

It must not store secrets.

### `laurelinos sources list`

Lists configured local sources.

### `laurelinos sources add <name> <path>`

Adds an approved source path to local config, but does not index the folder yet.

### `laurelinos brain status`

Shows the current local brain/runtime status:

- config path;
- source count;
- whether GBrain is installed;
- whether demo data is available;
- whether MCP server code exists.

### `laurelinos brief --demo`

Reads synthetic demo data and produces a founder brief.

### `laurelinos open-loops --demo`

Reads synthetic demo data and identifies unresolved commitments.

### `laurelinos mcp serve`

Starts a minimal MCP-compatible stdio server exposing:

```text
get_status
get_daily_brief
get_open_loops
```

The first implementation can be minimal, but it must not perform external writes.

## Acceptance criteria

The first useful repo state is acceptable when this works:

```bash
npm install
npm test
npm run check
```

And these work manually:

```bash
npm run dev -- doctor
npm run dev -- init --local
npm run dev -- sources list
npm run dev -- brain status
npm run dev -- brief --demo
npm run dev -- open-loops --demo
```

## Data policy

Public repo data may include:

- synthetic demo people;
- synthetic demo companies;
- synthetic investor/customer scenarios;
- synthetic open loops;
- public architecture notes;
- compliance readiness drafts.

Public repo data must not include:

- real customer data;
- real investor notes;
- private Laurelin Obsidian content;
- Stripe secrets;
- API keys;
- OAuth tokens;
- bank account details;
- personally sensitive private content.
