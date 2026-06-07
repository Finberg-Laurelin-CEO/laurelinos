# Build Log

## 2026-06-07 — Demo workflow deepening

Task: deepen synthetic demo workflows for `feat/demo-workflows` without real data, cloud resources, or external writes.

Files changed:

- `examples/demo-data/demo-brain.json`
- `lib/demo.mjs`
- `lib/format.mjs`
- `packages/workflows/README.md`
- `skills/prepare-meeting.md`
- `tests/cli.test.mjs`
- `docs/BUILD_LOG.md`

Commands run:

```bash
npm test
npm run check
npm run dev -- brief --demo
npm run dev -- open-loops --demo
```

Tests run:

- `npm test`
- `npm run check`
- local CLI smoke for `brief --demo`
- local CLI smoke for `open-loops --demo`

Unresolved questions:

- Should meeting prep become its own CLI command in a later branch, or remain surfaced inside the daily brief until the workflow package split?

Security notes:

- Synthetic data only.
- No GCP, deploy, public ports, or remote MCP endpoints.
- No real Laurelin, customer, investor, Obsidian, or private source data.
- Source IDs are cited, and suggested external actions remain approval-gated.

## 2026-06-07 — Initial scaffold

Task: initialise public local-first LaurelinOS MVP scaffold for `Finberg-Laurelin-CEO/laurelinos`.

Files:

- README / AGENTS / MVP specification / roadmap;
- zero-dependency CLI;
- synthetic demo brain;
- tests;
- Superset instructions;
- pricing, Stripe, privacy, and SOC 2 readiness drafts.

Tests:

```bash
npm test
npm run check
```

Security notes:

- Synthetic data only.
- No secrets.
- No real Laurelin or customer data.
- External actions remain approval-gated.

## 2026-06-07 — GBrain adapter boundary

Task: create the provider-neutral GBrain adapter boundary and synthetic stub implementation for `feat/gbrain-adapter`.

Files:

- `packages/gbrain-adapter/index.mjs`;
- `packages/gbrain-adapter/README.md`;
- `packages/runtime-core/approval.mjs`;
- `packages/runtime-core/README.md`;
- `tests/gbrain-adapter.test.mjs`;
- `docs/architecture/GBRAIN_INTEGRATION.md`.

Commands run:

```bash
npm test
npm run check
```

Tests:

- `npm test`: 13 passing.
- `npm run check`: passing.

Unresolved questions:

- Whether CLI `brain status` should import the adapter directly or stay a lightweight local status command until the MCP branch hardens tool handlers.

Security notes:

- Synthetic stub only.
- No real GBrain process started or initialised.
- No local folders read or indexed.
- Source candidates default to `approvedForIndexing: false`.
- `addSource`, `writePage`, and `sync` require explicit approval inputs.

## 2026-06-07 — MCP server hardening

Task: harden the local stdio MCP server and add automated JSON-RPC coverage on `feat/mcp-server`.

Files:

- `bin/laurelinos.mjs` delegates MCP line handling to a local module while preserving `laurelinos mcp serve`.
- `lib/mcp.mjs` contains read-only synthetic MCP tools and JSON-RPC error handling.
- `tests/mcp.test.mjs` covers initialize, tools/list, tool calls, unknown tool/method errors, parse errors, notifications, and stdin/stdout smoke.
- `docs/architecture/MCP_INTEGRATION.md` documents the v0 stdio-only MCP contract and smoke test.

Commands run:

```bash
npm test
npm run check
printf '%s\n' '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}' '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}' '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"get_open_loops","arguments":{}}}' | node ./bin/laurelinos.mjs mcp serve
```

Tests run:

- `npm test` — 15 passing.
- `npm run check` — passing.
- Local MCP stdin/stdout smoke — initialize, tools/list, and get_open_loops returned JSON-RPC responses.

Unresolved questions:

- None for v0 stdio MCP.

Security notes:

- Stdio only; no HTTP server, public port, remote MCP endpoint, GCP, or deploy path.
- Tools remain read-only and synthetic-data-only.
- External actions remain approval-gated and are not implemented as MCP tools.

## 2026-06-07 — Local docs alignment

Task: align docs, prompts, package boundary notes, and Superset instructions with the pushed `feat/cli-core` local MVP scaffold.

Files:

- README local status and quickstart;
- local build and MCP smoke-test docs;
- Superset branch map;
- agent prompts for CLI, workflows, GBrain, MCP, and master build routing;
- package boundary README files;
- docs-site deferral note;
- open questions.

Commands run:

```bash
git status --short --branch
npm test
npm run check
rg -n <old-branch-or-docs-site-branch-patterns> README.md docs prompts .superset packages apps
rg -n <unsafe-cloud-or-deploy-claim-patterns> README.md docs prompts .superset packages apps
git diff --check
```

Tests:

```bash
npm test
npm run check
```

Unresolved questions:

- Product/commercial decisions remain in `docs/OPEN_QUESTIONS.md`.
- `AGENTS.md` branch labels can be aligned in a later agent-instructions cleanup if desired.

Security notes:

- Synthetic-data-only posture preserved.
- No GCP, VPS, hosted onboarding, public port, remote MCP, or live Stripe work added.
- No secrets or private Laurelin/customer data added.

## 2026-06-07 — Subscription and license planning

Task: document the first commercial packaging path: subscription + entitlement/license first, not API credits.

Files:

- `docs/deployment/SUBSCRIPTION_AND_LICENSE_PLAN.md`;
- `docs/deployment/STRIPE_AND_PROVISIONING.md`;
- `docs/deployment/PRICING_AND_UNIT_ECONOMICS.md`;
- `docs/OPEN_QUESTIONS.md`;
- `docs/BUILD_LOG.md`.

Commands run:

```bash
npm test
npm run check
git diff --check
```

Unresolved questions:

- Whether first paid pilots should receive a manual license file, activation token, or private package token.
- Which exact Stripe prices and first MRR milestone Joseph wants.

Security notes:

- Planning only.
- No live Stripe secrets, webhook code, hosted onboarding, GCP/VPS resources, public ports, remote MCP, API-credit metering, or bundled compute implementation added.
- Activation tokens are documented as secrets that must not be logged.
