# Superset Agent Workflow

Use Superset only after the repo has at least one local Git commit.

## Why one workspace per branch

Parallel coding agents are unsafe if they all mutate the same working tree. Use this pattern:

```text
one bounded task
    -> one branch
    -> one Superset workspace / Git worktree
    -> review diff
    -> run tests
    -> merge into main
```

## Current branch map

Already landed on `main`:

```text
plan/build-orchestration
docs/planning/BUILD_ORCHESTRATION_PLAN.md only

feat/cli-core
local-first CLI scaffold, tests, demo data, docs, prompts, packages, MCP stub
```

Active next branches:

```text
feat/demo-workflows
feat/gbrain-adapter
feat/mcp-server
docs/local-build
```

Later branches, after the local MVP proves value:

```text
docs/stripe-provisioning-plan
apps/docs-site / laurelinos.dev
hosted onboarding/provisioning experiments
```

## Main branch rule

`main` should always be installable and demoable:

```bash
npm test
npm run check
```

No branch should require GCP, a VPS, Stripe, remote MCP, public ports, or real private data for v0 acceptance.

## Agent task boundaries

### CLI agent

The initial CLI core already landed from `feat/cli-core`. Future CLI hardening should stay within:

```text
bin/**
lib/**
packages/cli/**
packages/runtime-core/**
tests/**
docs/BUILD_LOG.md
```

### Workflow agent

Allowed files:

```text
lib/demo.mjs
lib/format.mjs
packages/workflows/**
examples/demo-data/**
skills/**
tests/**
docs/BUILD_LOG.md
```

### GBrain agent

Allowed files:

```text
packages/gbrain-adapter/**
packages/runtime-core/**
docs/architecture/GBRAIN_INTEGRATION.md
tests/**
docs/BUILD_LOG.md
```

### MCP agent

Allowed files:

```text
bin/**
lib/**
packages/mcp-server/**
packages/runtime-core/**
packages/workflows/**
docs/architecture/MCP_INTEGRATION.md
tests/**
docs/BUILD_LOG.md
```

### Local docs agent

Allowed files:

```text
README.md
docs/**
packages/**/README.md
apps/docs-site/README.md
prompts/**
.superset/**
docs/BUILD_LOG.md
```

The docs agent must not build the product, deploy, add cloud resources, or create the public website.
