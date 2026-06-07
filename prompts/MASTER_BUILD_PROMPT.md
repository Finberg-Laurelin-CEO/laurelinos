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

## Existing v0

The repo starts with a zero-dependency Node CLI in:

```text
bin/laurelinos.mjs
lib/**
examples/demo-data/demo-brain.json
```

Keep the working commands alive:

```bash
npm test
npm run check
npm run dev -- doctor
npm run dev -- init --local
npm run dev -- brief --demo
npm run dev -- open-loops --demo
```

## Build order

Build in this order:

1. Stabilise repo/tooling scaffold.
2. Keep CLI commands working.
3. Improve `doctor` and `init`.
4. Improve synthetic demo data.
5. Improve `brief --demo`.
6. Improve `open-loops --demo`.
7. Create GBrain adapter interface with stub implementation.
8. Improve MCP server exposing `get_status`, `get_daily_brief`, and `get_open_loops`.
9. Add local integration docs.
10. Only later: docs site and Stripe provisioning.

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

## Expected first implementation tasks

Use one branch per task.

Suggested branches:

```text
feat/cli-doctor-init
feat/demo-workflows
feat/gbrain-adapter
feat/mcp-server
docs/pricing-stripe
docs/laurelinos-dev
```

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
