# LaurelinOS Roadmap

## Phase 0 — Public repo and local demo

Goal: make the empty GitHub repo useful and runnable locally.

Deliverables:

- README, AGENTS, MVP spec, roadmap;
- zero-dependency CLI;
- synthetic daily brief;
- synthetic open-loop detection;
- local config initialisation;
- tests;
- Superset instructions.

Success:

```bash
npm run check
```

passes on a fresh clone.

## Phase 1 — Runtime package split

Goal: move from the simple v0 CLI into stable package boundaries.

Deliverables:

- `packages/cli` owns CLI command routing;
- `packages/runtime-core` owns config, session, source, and approval types;
- `packages/workflows` owns brief/open-loop/meeting-prep workflows;
- tests for all packages.

## Phase 2 — GBrain adapter

Goal: use GBrain as memory kernel without becoming merely a GBrain wrapper.

Deliverables:

- adapter interface;
- stub implementation;
- local process implementation;
- source-scoped sync plan;
- no automatic broad indexing.

## Phase 3 — MCP server

Goal: make LaurelinOS usable by Claude, Codex, Hermes, OpenClaw, and future agents.

Deliverables:

- MCP server exposing status, daily brief, and open loops;
- synthetic data default;
- approval-gated write tools later;
- documented local setup.

## Phase 4 — Subscription-friendly compute

Goal: let users bring their own AI subscriptions or API keys.

Deliverables:

- Claude/Codex local-client setup docs;
- BYOK provider configuration;
- no scraping of provider UIs;
- no backend inference dependency for the local MVP.

## Phase 5 — Stripe provisioning and paid pilots

Goal: convert local utility into MRR.

Deliverables:

- Stripe Checkout/Payment Link plan;
- webhook provisioning service later;
- customer onboarding checklist;
- plan limits;
- compute-cost guardrails;
- managed founder office offer.

## Phase 6 — `laurelinos.dev` docs site

Goal: public installation instructions and subscription conversion.

Deliverables:

- Vercel docs site;
- CLI-style aesthetic if desired;
- installation guide;
- pricing;
- privacy policy;
- security page;
- SOC 2 readiness statement;
- Stripe checkout links.

Do not build this before the local MVP is useful.
