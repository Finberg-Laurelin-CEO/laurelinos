# GitHub Setup for Existing Repo

Canonical repo:

```text
https://github.com/Finberg-Laurelin-CEO/laurelinos
```

The repo already exists. Do not create a second repo.

## Current pushed baseline

`main` has the local-first scaffold pushed and should remain runnable locally:

```bash
npm install
npm test
npm run check
```

Working v0 commands:

```bash
npm run dev -- doctor
npm run dev -- init --local
npm run dev -- sources list
npm run dev -- sources add demo ./examples/demo-data
npm run dev -- brain status
npm run dev -- brief --demo
npm run dev -- open-loops --demo
npm run dev -- mcp serve
```

## GitHub auth note

The repo includes `.github/workflows/ci.yml`. If pushing over HTTPS fails with a GitHub `workflow` scope error, either refresh the GitHub token with workflow scope or push over an authenticated SSH remote.

Do not work around this by deleting CI.

## Superset

Use isolated branches/workspaces for parallel agent work:

```text
feat/demo-workflows
feat/gbrain-adapter
feat/mcp-server
docs/local-build
```

Merge only after tests pass:

```bash
npm test
npm run check
```

Later commercial/docs work can use separate branches after the local MVP is solid:

```text
docs/stripe-provisioning-plan
apps/docs-site / laurelinos.dev
```

Do not deploy, create GCP/VPS resources, expose remote MCP, or add live Stripe credentials for v0.
