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

## First branches

```text
feat/cli-doctor-init
feat/demo-workflows
feat/gbrain-adapter
feat/mcp-server
docs/laurelinos-dev
docs/pricing-stripe
```

## Main branch rule

`main` should always be installable and demoable:

```bash
npm test
npm run check
```

## Agent task boundaries

### CLI agent

Allowed files:

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
docs/architecture/**
docs/BUILD_LOG.md
```

### MCP agent

Allowed files:

```text
packages/mcp-server/**
lib/**
tests/**
docs/BUILD_LOG.md
```

### Docs/site agent

Allowed files:

```text
apps/docs-site/**
docs/deployment/**
docs/compliance/**
README.md
```

The docs/site agent must not build the product before the CLI is usable.
