# LaurelinOS

LaurelinOS is a local-first AI-native operating layer for founders and small teams.

The first product is not a website and not a Linux distribution. It is a terminal/MCP runtime that turns a user's existing Claude, Codex, or API-key workflow into a persistent company brain and AI chief of staff.

Canonical repository:

```text
https://github.com/Finberg-Laurelin-CEO/laurelinos
```

## What this repo is for

This repository is the public OS layer for LaurelinOS:

- a local CLI;
- a runtime core;
- a company-brain adapter boundary;
- an MCP server boundary for agents;
- synthetic demo workflows;
- agent build instructions;
- later documentation for `laurelinos.dev`.

The commercial packaging may be called **FounderOS**. LaurelinOS is the open operating layer. FounderOS is the paid product experience around onboarding, integrations, support, billing, and managed automation.

## Product thesis

The runtime owns state. Models do not own state.

Claude, Codex, GPT, Gemini, local models, Hermes, OpenClaw, Obsidian, and GBrain are not the operating system. LaurelinOS is the coordination layer that gives them shared memory, shared workflows, source-scoped permissions, and approval-gated actions.

## MVP loop

```text
Approved local sources
    -> company brain / memory kernel
    -> daily brief and open-loop detection
    -> agent-readable MCP tools
    -> approval-gated suggested actions
    -> write-back to approved Markdown later
```

## Quick start

This scaffold has a zero-dependency Node CLI so the first demo works before the larger TypeScript monorepo is built.

```bash
git clone https://github.com/Finberg-Laurelin-CEO/laurelinos.git
cd laurelinos

# after copying this scaffold into the repo:
npm install
npm test
npm run dev -- doctor
npm run dev -- init --local
npm run dev -- brief --demo
npm run dev -- open-loops --demo
npm run dev -- brain status
```

To install the CLI globally from the local repo while developing:

```bash
npm link
laurelinos doctor
laurelinos brief --demo
```

## First commands to implement/keep working

```bash
laurelinos doctor
laurelinos init --local
laurelinos sources list
laurelinos sources add <name> <path>
laurelinos brain status
laurelinos brief --demo
laurelinos open-loops --demo
laurelinos mcp serve
```

`--demo` must use synthetic data only. Do not use real Laurelin emails, investor notes, customer notes, or private Obsidian material in the public repo.

## Repository structure

```text
bin/                         zero-dependency CLI entry point
lib/                         small runtime helpers for the first local demo
examples/demo-data/          synthetic company-brain data only
packages/                    future TypeScript package boundaries
skills/                      human-readable workflow definitions
prompts/                     prompts for Superset/Codex/Claude agents
docs/                        architecture, Superset, setup, pricing, compliance drafts
apps/docs-site/              future Vercel docs site for laurelinos.dev
.superset/                   suggested Superset task configuration
```

## Build priority

1. Make the local CLI useful.
2. Keep synthetic demo commands working.
3. Add GBrain behind an adapter, not as the whole product.
4. Expose daily brief and open-loop detection through MCP.
5. Add Claude/Codex subscription-friendly workflows through official local clients/connectors.
6. Add Stripe and hosted provisioning only after the tool is valuable locally.
7. Build the `laurelinos.dev` docs/subscription site after the MVP works.

## Safety baseline

- Do not commit secrets.
- Do not store raw credit-card data.
- Do not scrape provider web UIs.
- Do not require a local model.
- Do not silently index a user's machine.
- Do not automate external writes without approval gates.
- Do not call the project SOC 2 compliant unless and until an audit is complete.

See `AGENTS.md` for the canonical agent instructions.
