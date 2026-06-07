# Master Build Prompt for LaurelinOS Agents

You are an implementation agent working on LaurelinOS.

Canonical repository:

```text
https://github.com/Finberg-Laurelin-CEO/laurelinos
```

LaurelinOS is a local-first AI-native operating layer / AI chief of staff for founders and small teams. It is not a website demo, not a Linux distribution, not a generic chatbot, and not a mandatory local-model product.

Your job is to build the local tool first.

## Read first

Before coding, read:

1. `README.md`
2. `AGENTS.md`
3. `MVP_SPEC.md`
4. `docs/superset/SUPERSET_AGENT_WORKFLOW.md`
5. `docs/OPEN_QUESTIONS.md`
6. `docs/BUILD_LOG.md`

## Core thesis

The runtime owns state. Models do not own state.

The user supplies compute through Claude/Codex subscriptions, provider API keys, or later optional hosted/local models. LaurelinOS supplies memory, workflows, MCP tools, approval gates, and the OS layer.

## Existing v0 on main

The pushed `main` branch includes the first local scaffold:

```text
bin/laurelinos.mjs
lib/**
examples/demo-data/demo-brain.json
```

Keep these working commands alive:

```bash
npm test
npm run check
npm run dev -- doctor
npm run dev -- init --local
npm run dev -- sources list
npm run dev -- sources add demo ./examples/demo-data
npm run dev -- brain status
npm run dev -- brief --demo
npm run dev -- open-loops --demo
npm run dev -- mcp serve
```

## Branch state

Already landed on `main`:

```text
plan/build-orchestration
feat/cli-core
```

Use the remaining branches for focused improvements:

```text
feat/demo-workflows   deepen synthetic brief/open-loop/meeting-prep workflows
feat/gbrain-adapter   add provider-neutral adapter boundary and stub, no real indexing
feat/mcp-server       harden local stdio MCP and add automated MCP smoke tests
docs/local-build      keep docs/prompts aligned with the local scaffold
```

Later, after the local runtime is useful:

```text
docs/stripe-provisioning-plan
apps/docs-site / laurelinos.dev
hosted onboarding/provisioning experiments
```

## Build order

Build in this order:

1. Keep CLI commands working.
2. Improve synthetic demo data.
3. Improve `brief --demo`.
4. Improve `open-loops --demo`.
5. Add meeting-prep demo behavior if it stays synthetic and local.
6. Create GBrain adapter interface with stub implementation.
7. Improve MCP server exposing `get_status`, `get_daily_brief`, and `get_open_loops`.
8. Add local integration docs.
9. Only later: docs site, Stripe provisioning, hosted onboarding, and cloud infrastructure.

Do not build the website first.

## Safety rules

Never commit secrets.
Never include private Laurelin data.
Never index a real user path without explicit approval.
Never automate external writes without approval gates.
Never store raw credit-card data.
Do not scrape model-provider web UIs.
Use official local clients, MCP, SDKs, or API-key flows only.
Do not claim SOC 2 compliance before audit.
Do not create GCP, VPS, or other cost-incurring cloud resources for v0.
Do not expose remote MCP endpoints or open public ports for v0.

## Acceptance criteria for any branch

Run:

```bash
npm test
npm run check
```

Update `docs/BUILD_LOG.md` with:

- task;
- files changed;
- commands run;
- tests run;
- unresolved questions;
- security notes.
