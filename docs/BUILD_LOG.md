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

## 2026-06-07 — Proprietary licence and user-research notes

Task: replace the permissive MIT licence with a proprietary source-available evaluation licence and save notes on the referenced Cookiy user-research skill.

Files:

- `LICENSE`;
- `LICENSE-DECISION.md`;
- `package.json`;
- `docs/research/USER_RESEARCH_SKILL_NOTES.md`;
- `docs/BUILD_LOG.md`.

Commands run:

```bash
npm test
npm run check
git diff --check
```

Unresolved questions:

- Attorney review is still needed before broad external promotion or enterprise sales.

Security notes:

- No secrets, tokens, private customer data, live Stripe code, hosted onboarding, GCP/VPS resources, public ports, or remote MCP added.
- The user-research skill is documented as an external research workflow, not vendored into LaurelinOS runtime.

## 2026-06-07 — Source approval and audit log

Task: add explicit local source approval and audit-log commands before any real indexing work.

Files:

- `bin/laurelinos.mjs`;
- `lib/config.mjs`;
- `tests/cli.test.mjs`;
- `README.md`;
- `docs/LOCAL_BUILD_INSTRUCTIONS.md`;
- `docs/architecture/ARCHITECTURE.md`;
- `packages/cli/README.md`;
- `docs/BUILD_LOG.md`.

Commands run:

```bash
npm test
npm run check
git diff --check
```

Security notes:

- `sources add` records a candidate and audit event only.
- `sources approve` records explicit approval and an audit event only.
- No indexing, file-content reads, external writes, hosted services, public ports, or remote MCP added.

## 2026-06-07 — Local license status and activation

Task: add local-only license status and manual activation commands for paid pilot planning.

Files:

- `bin/laurelinos.mjs`;
- `lib/license.mjs`;
- `tests/cli.test.mjs`;
- `README.md`;
- `docs/LOCAL_BUILD_INSTRUCTIONS.md`;
- `docs/deployment/SUBSCRIPTION_AND_LICENSE_PLAN.md`;
- `packages/cli/README.md`;
- `docs/BUILD_LOG.md`.

Commands run:

```bash
npm test
npm run check
git diff --check
```

Security notes:

- `license status` works in free/demo mode without a token.
- `license activate <token>` stores only a SHA-256 token hash and writes an audit event.
- No raw activation token, Stripe secret, webhook code, hosted entitlement lookup, GCP/VPS resource, public port, or remote MCP added.

## 2026-06-07 — Hermes and OpenClaw integration guides

Task: document how Hermes and OpenClaw should consume LaurelinOS through local stdio MCP while leaving LaurelinOS as the memory, policy, approval, and audit layer.

Files:

- `docs/integrations/README.md`;
- `docs/integrations/HERMES.md`;
- `docs/integrations/OPENCLAW.md`;
- `docs/architecture/MCP_INTEGRATION.md`;
- `README.md`;
- `docs/BUILD_LOG.md`.

Commands run:

```bash
npm test
npm run check
git diff --check
```

Security notes:

- Documentation only.
- No remote MCP, public port, external write tool, real source indexing, provider credential handling, hosted service, or cloud infrastructure added.

## 2026-06-07 — Loom demo script and agentic install correction

Task: add a repeatable Loom demo smoke script, public-safe recording guide, and correct Hermes/OpenClaw strategy to agentic configuration without native downloads.

Files:

- `scripts/loom-demo-smoke.sh`;
- `docs/demo/LOOM_DEMO_SCRIPT.md`;
- `docs/integrations/AGENTIC_INSTALL.md`;
- `docs/integrations/README.md`;
- `docs/integrations/HERMES.md`;
- `docs/integrations/OPENCLAW.md`;
- `docs/LOCAL_BUILD_INSTRUCTIONS.md`;
- `README.md`;
- `package.json`;
- `docs/BUILD_LOG.md`.

Commands run:

```bash
npm test
npm run check
npm run demo:loom
git diff --check
```

Security notes:

- Do not download, install, vendor, or run Hermes/OpenClaw from LaurelinOS.
- LaurelinOS should be configured agentically as a local MCP server inside the user's existing agent environment.
- Existing agents make model calls through the user's accounts; LaurelinOS supplies state, source policy, approvals, audit, and workflows.
- No secrets, provider credentials, real source indexing, external writes, hosted services, public ports, or remote MCP added.

## 2026-06-07 — Agent substrate positioning

Task: clarify that LaurelinOS should integrate with Hermes/OpenClaw much like an agent uses GBrain: as an agent-usable company-brain substrate, not as a competing execution runtime.

Files:

- `README.md`;
- `docs/architecture/ARCHITECTURE.md`;
- `docs/integrations/README.md`;
- `docs/integrations/AGENTIC_INSTALL.md`;
- `docs/BUILD_LOG.md`.

Commands run:

```bash
npm test
npm run check
npm run demo:loom
git diff --check
```

Security notes:

- Documentation only.
- No Hermes/OpenClaw download path, native runner, provider credential handling, real source indexing, external write, hosted service, public port, or remote MCP added.

## 2026-06-07 — License hardening and stack rationale

Task: strengthen proprietary evaluation license language and document why the MVP uses plain JavaScript/Node.

Files:

- `LICENSE`;
- `NOTICE.md`;
- `LICENSE-DECISION.md`;
- `README.md`;
- `package.json`;
- `docs/architecture/STACK_RATIONALE.md`;
- `docs/BUILD_LOG.md`.

Commands run:

```bash
npm test
npm run check
npm run demo:loom
git diff --check
```

Security/legal notes:

- License text now more explicitly restricts commercial use, production use, redistribution, public forks/mirrors, hosted demos, competitive use, remote services, and AI/ML training or dataset use.
- `package.json` remains `private` and `UNLICENSED`, with a blocking `prepublishOnly` script to reduce accidental publication.
- This is protective drafting, not a substitute for attorney review.
