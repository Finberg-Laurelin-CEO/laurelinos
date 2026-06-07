# LaurelinOS Build Orchestration Plan

## Repository Diagnosis

The repository is an initial scaffold only.

Inspected state:

- Remote: `https://github.com/Finberg-Laurelin-CEO/laurelinos`
- Base commit: `077e2dd Initial commit`
- Existing files:
  - `README.md`
  - `LICENSE`

No Node package, CLI entrypoint, tests, runtime modules, demo data, MCP server, or local build docs exist yet.

## Current Implementation State

Missing commands:

```text
laurelinos doctor
laurelinos init --local
laurelinos sources list
laurelinos sources add <name> <path>
laurelinos brain status
laurelinos brief --demo
laurelinos open-loops --demo
laurelinos mcp serve
```

Missing project support:

```text
npm test
npm run check
package.json
bin/laurelinos.mjs
lib/
tests/
examples/demo-data/
```

## Missing Components

The local MVP needs:

1. Node package scaffold.
2. CLI binary at `bin/laurelinos.mjs`.
3. Local config layer.
4. Local source registry commands.
5. Synthetic brain state/status.
6. Deterministic demo workflow output.
7. Provider-neutral brain abstraction.
8. Local stdio MCP server.
9. Tests and syntax/check script.
10. Local-first README and security notes.

## Recommended Build Order

1. `plan/build-orchestration` — planning only.
2. `feat/cli-core` — package scaffold, CLI base, config, sources, brain status.
3. `feat/demo-workflows` — deterministic synthetic brief and open loops.
4. `feat/gbrain-adapter` — provider-neutral memory abstraction.
5. `feat/mcp-server` — local stdio MCP server.
6. `docs/local-build` — docs finalized after commands exist.

Feature branches were created from `main` as siblings. After `feat/cli-core` lands, other implementation branches should update from `main` before coding.

## Branch and Workspace Plan

```text
main
├── plan/build-orchestration
├── feat/cli-core
├── feat/demo-workflows
├── feat/gbrain-adapter
├── feat/mcp-server
└── docs/local-build
```

Workspaces:

```text
plan/build-orchestration -> /Users/Joe/.superset/worktrees/13c8153b-177a-49d1-a67c-fdd0e809ba73/plan-build-orchestration
feat/cli-core          -> /Users/Joe/.superset/worktrees/13c8153b-177a-49d1-a67c-fdd0e809ba73/feat-cli-core
feat/demo-workflows    -> /Users/Joe/.superset/worktrees/13c8153b-177a-49d1-a67c-fdd0e809ba73/feat-demo-workflows
feat/gbrain-adapter    -> /Users/Joe/.superset/worktrees/13c8153b-177a-49d1-a67c-fdd0e809ba73/feat-gbrain-adapter
feat/mcp-server        -> /Users/Joe/.superset/worktrees/13c8153b-177a-49d1-a67c-fdd0e809ba73/feat-mcp-server
docs/local-build       -> /Users/Joe/.superset/worktrees/13c8153b-177a-49d1-a67c-fdd0e809ba73/docs-local-build
```

## Model Assignment Plan

```text
plan/build-orchestration: Claude Code
feat/cli-core: Codex
feat/demo-workflows: Codex
feat/gbrain-adapter: Claude Code
feat/mcp-server: Claude Code first, Codex for test hardening if needed
docs/local-build: Claude Code
```

## Implementation Agent Prompts

### feat/cli-core

Role: CLI Engineer.

Goal: create the local LaurelinOS CLI foundation in `/Users/Joe/.superset/worktrees/13c8153b-177a-49d1-a67c-fdd0e809ba73/feat-cli-core`.

Implement:

- `node ./bin/laurelinos.mjs doctor`
- `node ./bin/laurelinos.mjs init --local`
- `node ./bin/laurelinos.mjs sources list`
- `node ./bin/laurelinos.mjs sources add <name> <path>`
- `node ./bin/laurelinos.mjs brain status`

Scope: local only, synthetic/local state only, no cloud, no website, no Stripe, no OAuth, no real GBrain, no real Obsidian indexing, no external API calls.

Prefer Node built-ins and minimal dependencies. Use tests that spawn the CLI in temporary directories.

Acceptance:

```bash
npm test
npm run check
node ./bin/laurelinos.mjs doctor
node ./bin/laurelinos.mjs init --local
node ./bin/laurelinos.mjs sources list
node ./bin/laurelinos.mjs sources add demo ./examples/demo-data
node ./bin/laurelinos.mjs brain status
```

### feat/demo-workflows

Role: Workflow Engineer.

Goal: implement deterministic synthetic demo workflows after `feat/cli-core` lands.

Implement:

- `node ./bin/laurelinos.mjs brief --demo`
- `node ./bin/laurelinos.mjs open-loops --demo`

The output should include founder brief items, commitments, overdue follow-ups, unresolved open loops, suggested actions, source citations, and approval gates. Synthetic data only; no model calls or external APIs.

Acceptance:

```bash
npm test
npm run check
node ./bin/laurelinos.mjs brief --demo
node ./bin/laurelinos.mjs open-loops --demo
```

### feat/gbrain-adapter

Role: Memory Architect.

Goal: create a provider-neutral brain/memory abstraction after CLI shape exists.

Design principle: the runtime owns state; models do not own state. GBrain is a possible memory subsystem/provider, not LaurelinOS itself.

Possible interface methods:

- `getStatus()`
- `search(query, options)`
- `getEntity(entityId)`
- `getProject(projectId)`
- `getOpenLoops(options)`
- `getDailyBrief(options)`
- `writeMemoryProposal(proposal)`

Implement interface, synthetic provider, tests, and `docs/architecture/GBRAIN_INTEGRATION.md`. No real indexing, database, Obsidian, or GBrain install.

Acceptance:

```bash
npm test
npm run check
node ./bin/laurelinos.mjs brain status
```

### feat/mcp-server

Role: MCP Architect.

Goal: expose LaurelinOS as a local MCP stdio server after CLI, demo workflows, and brain provider exist.

Implement:

- `node ./bin/laurelinos.mjs mcp serve`

Expose tools:

- `get_status`
- `get_daily_brief`
- `get_open_loops`

Stdio only, local only. No public HTTP, OAuth, real integrations, write actions, or remote endpoints.

Acceptance:

```bash
npm test
npm run check
node ./bin/laurelinos.mjs mcp serve
```

### docs/local-build

Role: Documentation Lead.

Goal: make the repo locally usable by Joseph, agents, and future contributors.

Document local install, first run, Superset workflow, Claude Code/Codex workflow, branch strategy, testing, security notes, current MVP status, and future docs-site plan.

State clearly: local-first CLI/runtime first; website later; GBrain is a memory subsystem; AI models are compute/client layers; synthetic data only for MVP.

Do not claim SOC 2 compliance, production security, Stripe/customer onboarding, or real integrations.

## Acceptance Criteria

Final MVP:

```bash
npm test
npm run check
node ./bin/laurelinos.mjs doctor
node ./bin/laurelinos.mjs init --local
node ./bin/laurelinos.mjs sources list
node ./bin/laurelinos.mjs sources add demo ./examples/demo-data
node ./bin/laurelinos.mjs brain status
node ./bin/laurelinos.mjs brief --demo
node ./bin/laurelinos.mjs open-loops --demo
node ./bin/laurelinos.mjs mcp serve
```

No acceptance test may require live Stripe, Claude, OpenAI, Anthropic, GBrain, Gmail, Calendar, GitHub write access, Obsidian vaults, or real customer data.

## Test Plan

Use:

```bash
npm test
npm run check
```

Suggested test strategy:

- Node ESM.
- Node built-in `node:test`.
- CLI integration tests by spawning `node ./bin/laurelinos.mjs`.
- Temporary directories for config-writing tests.

## Merge Order

1. `plan/build-orchestration`
2. `feat/cli-core`
3. `feat/demo-workflows`
4. `feat/gbrain-adapter`
5. `feat/mcp-server`
6. `docs/local-build`

Do not merge implementation branches unless `npm test` and `npm run check` pass.

## Security and Privacy Concerns

Hard rules:

- Synthetic data only.
- No real Laurelin notes or customer data.
- No private Obsidian vaults.
- No Gmail/Calendar/Drive/Slack indexing.
- No API keys or `.env` values.
- No OAuth or Stripe.
- No public HTTP ports.
- No remote MCP endpoints.
- No unauthenticated write tools.
- No external writes without approval gates.

MCP must be local stdio only for v0.

## Founder Decisions Required

Before moving beyond local synthetic MVP, Joseph must approve:

- Adding non-minimal dependencies.
- Installing or connecting real GBrain.
- Connecting real Obsidian/Gmail/Calendar/Slack/GitHub data.
- Remote MCP endpoints.
- Stripe test mode.
- Vercel docs site.
- `laurelinos.dev` configuration.
- Real Laurelin company data.
- API-key/subscription strategy for model providers.

Current assumption: synthetic data only, local CLI first, no cloud, no website-first build.

## Immediate Next Action

Implement `feat/cli-core` first, verify it with `npm test`, `npm run check`, and the required local CLI commands, then merge/update dependent branches before continuing.
