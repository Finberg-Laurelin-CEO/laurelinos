# LaurelinOS

LaurelinOS is a local-first AI-native operating layer for founders and small teams.

The first product is not a website and not a Linux distribution. It is a terminal/MCP runtime that turns a user's existing Claude, Codex, or API-key workflow into a persistent company brain and AI chief of staff.

Canonical repository:

```text
https://github.com/Finberg-Laurelin-CEO/laurelinos
```

## License and use restrictions

LaurelinOS is proprietary evaluation software. It is not open source, not MIT licensed, and not licensed for production, redistribution, hosting, public forks/mirrors, AI training datasets, competitive use, or commercial use without a separate written agreement with Laurelin.

See `LICENSE` and `NOTICE.md` before using or copying anything in this repository.

## What this repo is for

This repository is the public OS layer for LaurelinOS:

- a local CLI;
- a runtime core;
- a company-brain adapter boundary;
- a local stdio MCP server boundary for agents;
- synthetic demo workflows;
- agent build instructions;
- later documentation for `laurelinos.dev`.

The commercial packaging may be called **FounderOS**. LaurelinOS is now source-available/proprietary going forward; FounderOS is the paid product experience around onboarding, integrations, support, billing, and managed automation.

## Product thesis

The runtime owns state. Models do not own state.

Claude, Codex, GPT, Gemini, local models, Hermes, OpenClaw, Obsidian, and GBrain are not the operating system. LaurelinOS is the coordination layer that gives them shared memory, shared workflows, source-scoped permissions, and approval-gated actions.

The intended relationship to Hermes/OpenClaw is similar to how an agent uses GBrain: the agent keeps doing model calls and tool execution, while LaurelinOS provides the durable company-brain substrate, source policy, approvals, audit, and founder workflows.

## MVP loop

```text
Approved local sources
    -> company brain / memory kernel
    -> daily brief and open-loop detection
    -> agent-readable MCP tools
    -> approval-gated suggested actions
    -> write-back to approved Markdown later
```

## Current local MVP status

The active MVP runtime is now a stdlib-only Python CLI/MCP core, with the earlier Node implementation kept temporarily as a compatibility reference during migration. It runs locally with synthetic data only.

Working now:

```bash
npm test
npm run check
npm run demo:loom
npm run dev -- doctor
npm run dev -- init --local
npm run dev -- sources list
npm run dev -- sources add demo ./examples/demo-data
npm run dev -- sources show demo
npm run dev -- sources approve demo
npm run dev -- audit log
npm run dev -- license status
npm run dev -- setup agent openclaw --json
npm run dev -- setup verify --json
npm run dev -- brain status
npm run dev -- brief --demo
npm run dev -- open-loops --demo
npm run dev -- prepare-meeting --demo
npm run dev -- mcp serve
```

Still branch-scoped work:

- `feat/demo-workflows`: deepen synthetic brief/open-loop/meeting-prep behavior.
- `feat/gbrain-adapter`: add the provider-neutral adapter boundary without real indexing.
- `feat/mcp-server`: harden stdio MCP and add automated MCP tests.
- `docs/local-build`: keep local build docs and prompts aligned with the scaffold.

## Quick start

```bash
git clone https://github.com/Finberg-Laurelin-CEO/laurelinos.git
cd laurelinos
npm install
npm test
npm run check
```

Try the local runtime:

```bash
npm run dev -- doctor
npm run dev -- init --local
npm run dev -- sources list
npm run dev -- brain status
npm run dev -- brief --demo
npm run dev -- open-loops --demo
npm run dev -- prepare-meeting --demo
```

To install the CLI globally from the local repo while developing:

```bash
npm link
laurelinos doctor
laurelinos brief --demo
```

## First commands to keep working

```bash
laurelinos doctor
laurelinos init --local
laurelinos sources list
laurelinos sources add <name> <path>
laurelinos sources show <name>
laurelinos sources approve <name>
laurelinos audit log
laurelinos license status
laurelinos setup agent <generic|claude|codex|cursor|hermes|openclaw>
laurelinos setup verify
laurelinos brain status
laurelinos brief --demo
laurelinos open-loops --demo
laurelinos prepare-meeting --demo
laurelinos mcp serve
```

`--demo` must use synthetic data only. Do not use real Laurelin emails, investor notes, customer notes, private Obsidian material, customer exports, secrets, or private infrastructure details in this public repo.

## Repository structure

```text
bin/                         CLI entry points; Python is primary, Node is temporary compatibility
py/laurelinos_core/          stdlib-only Python runtime core
lib/                         earlier Node helpers kept temporarily during migration
examples/demo-data/          synthetic company-brain data only
packages/                    future package boundaries
skills/                      human-readable workflow definitions
prompts/                     prompts for Superset/Codex/Claude agents
docs/                        architecture, integrations, Superset, setup, pricing, compliance drafts
apps/docs-site/              future docs site for laurelinos.dev, not v0
.superset/                   suggested Superset task configuration
```

## Stack rationale

The MVP is moving to a stdlib-only Python runtime because it is better suited for a local company-brain/agent substrate than plain JavaScript, while still being easy for agents to install and run. Rust remains a later option for single-binary packaging or performance-critical indexing. See `docs/architecture/STACK_RATIONALE.md`.

## Build priority

1. Keep the local CLI useful.
2. Keep synthetic demo commands working.
3. Keep moving active runtime code from JavaScript into Python.
4. Add GBrain behind an adapter, not as the whole product.
5. Expose daily brief, open-loop detection, and meeting prep through local stdio MCP.
6. Make setup agent-readable so Claude/Codex/Hermes/OpenClaw-style environments can configure LaurelinOS without manual MCP guesswork.
7. Add Claude/Codex subscription-friendly workflows through official local clients/connectors.
8. Add Stripe and hosted provisioning only after the tool is valuable locally.
9. Build the `laurelinos.dev` docs/subscription site after the MVP works.

## Not required for v0

- No GCP VM or VPS is required.
- No hosted onboarding is required.
- No public ports should be opened.
- No remote MCP endpoint should be exposed.
- No live Stripe integration should be built.
- No public website should be built before the local runtime proves value.

## Safety baseline

- Do not commit secrets.
- Do not store raw credit-card data.
- Do not scrape provider web UIs.
- Do not require a local model.
- Do not silently index a user's machine.
- Do not automate external writes without approval gates.
- Do not call the project SOC 2 compliant unless and until an audit is complete.

See `AGENTS.md` for the canonical agent instructions.
