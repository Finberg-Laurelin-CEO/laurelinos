# AGENTS.md — LaurelinOS Agent Operating Instructions

This file is the canonical instruction set for coding agents working in this repository.

## Repository

```text
https://github.com/Finberg-Laurelin-CEO/laurelinos
```

## Mission

Build the first usable LaurelinOS MVP: a local-first AI chief of staff / company-brain runtime that can be used from the terminal and by MCP-aware agents.

The first MVP is a tool, not a website.

The website and documentation site will be built later at `laurelinos.dev`, after the local runtime demonstrates value.

## Product line

- **LaurelinOS** is the public OS layer.
- **FounderOS** may become the commercial packaging for founders and small teams.
- **GBrain** is the memory kernel/subsystem, not the whole product.
- **Hermes**, **OpenClaw**, **Claude**, **Codex**, **Cursor**, and other tools are clients or execution runtimes, not the canonical state layer.

## Non-negotiable architecture principles

1. Runtime owns state. Models do not own state.
2. Memory must be source-scoped and auditable.
3. User compute and user AI subscriptions/API keys are supported first.
4. No raw credit-card data is stored by LaurelinOS.
5. External actions require approval gates by default.
6. The MVP should work locally before hosted onboarding exists.
7. Secrets never go into Markdown, GitHub, Obsidian, logs, demo data, or generated reports.
8. Build small, testable commands before broad automation.
9. Synthetic demo data is allowed. Real private Laurelin/customer data is not allowed in this public repo.
10. Public documentation must be useful without exposing internal infrastructure details.

## Banned first-version work

Do not build a full Linux distribution.
Do not require a local model.
Do not build a public website as the MVP.
Do not turn this into a generic chatbot.
Do not build a clone of GBrain.
Do not silently index the user's whole computer.
Do not scrape model-provider web UIs.
Do not use unsupported provider subscription flows.
Do not commit `.env`, tokens, OAuth secrets, API keys, Stripe secrets, private vault contents, customer exports, or real investor/customer data.
Do not claim SOC 2 compliance before an audit.

## First MVP commands

Keep these commands working before adding anything else:

```bash
laurelinos doctor
laurelinos init --local
laurelinos sources list
laurelinos sources add <name> <path>
laurelinos brain status
laurelinos brief --demo
laurelinos open-loops --demo
laurelinos prepare-meeting --demo
laurelinos mcp serve
```

`--demo` must use synthetic local data only.

## Safety posture

Default posture: private, local-first, explicit, logged, scoped.

Any command that mutates external systems must support dry-run mode and require confirmation unless explicitly configured otherwise.

Examples of external mutations:

- sending email;
- creating calendar events;
- creating GitHub issues;
- updating CRM records;
- changing Stripe subscriptions;
- provisioning hosted deployments;
- adding DNS records;
- modifying OAuth clients;
- indexing newly discovered paths.

## Branching and Superset

When using Superset or parallel coding agents:

```text
one bounded agent task
    -> one Git branch
    -> one isolated Superset workspace / Git worktree
    -> review
    -> merge into main
```

Recommended first branches:

```text
feat/cli-doctor-init
feat/demo-workflows
feat/gbrain-adapter
feat/mcp-server
feat/pricing-stripe-plan
docs/laurelinos-dev
```

Do not allow multiple agents to rewrite the same package at the same time.

## Commit discipline

Every agent should leave a short build note in `docs/BUILD_LOG.md` with:

- task;
- files changed;
- commands run;
- tests run;
- unresolved questions;
- any security-sensitive assumptions.

## Acceptance before merge

Before merging any branch into `main`, run:

```bash
npm test
npm run check
```

If these commands fail, the agent must either fix the branch or document exactly why it is not mergeable.
