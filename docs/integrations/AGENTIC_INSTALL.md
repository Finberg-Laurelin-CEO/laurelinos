# Agentic Install Plan

Status: design target for FounderOS pilot onboarding

## Goal

Make LaurelinOS installable by an agent into the user's existing environment.

The user should not need to understand MCP, model credentials, Hermes config, OpenClaw config, Claude config, or package internals to try the product.

The install agent should configure LaurelinOS as the local memory/policy layer for whichever agent runtime the user already uses.

## Core decision

Do not install or run Hermes/OpenClaw natively from LaurelinOS.

LaurelinOS integrates with existing agent systems:

```text
Existing agent runtime: Claude / Codex / Hermes / OpenClaw / Cursor / other MCP-aware client
  -> owns model calls and tool execution through the user's existing account/subscription/API keys
  -> calls LaurelinOS locally over stdio MCP

LaurelinOS
  -> owns state, source registry, approvals, audit log, workflows, and memory adapters
  -> does not own model credentials
  -> does not sell API credits first
```

This is the model-plug-in answer: LaurelinOS does not need to plug into every model provider directly for v1. It plugs into agents that already know how to call models.

The mental model is GBrain-like for profit and workflow packaging: agents use LaurelinOS as the company-brain substrate they can query and update through safe tools, while FounderOS monetizes setup, workflows, support, entitlement, and managed operating rhythm.

## Working setup-plan commands

LaurelinOS now emits machine-readable setup plans for installer agents:

```bash
python3 ./bin/laurelinos.py setup agent generic --json
python3 ./bin/laurelinos.py setup agent claude --json
python3 ./bin/laurelinos.py setup agent codex --json
python3 ./bin/laurelinos.py setup agent cursor --json
python3 ./bin/laurelinos.py setup agent hermes --json
python3 ./bin/laurelinos.py setup agent openclaw --json
python3 ./bin/laurelinos.py setup verify --json
```

These commands generate the local MCP server spec, setup commands, smoke test, agent prompt, and safety constraints without mutating host-agent config files.

## Desired user command

The best user experience is a prompt to their current agent:

```text
Install LaurelinOS for me.

Constraints:
- Do not install Hermes or OpenClaw.
- Do not send secrets to Laurelin.
- Configure LaurelinOS as a local stdio MCP server for this agent environment.
- Run the synthetic demo only.
- Do not index my real folders until I explicitly approve sources.
- Report exactly what files you changed.
```

## Installer responsibilities

The install agent should:

1. Detect platform and required tools:
   - Python 3;
   - git;
   - Node.js/npm only for current compatibility tests or npm-based local linking;
   - current agent runtime if discoverable.
2. Install or locate LaurelinOS:
   - clone private/source-available repo for pilots; or
   - use a packaged tarball/private package later.
3. Run local checks:

```bash
python3 ./bin/laurelinos.py doctor
python3 ./bin/laurelinos.py init --local
python3 ./bin/laurelinos.py license status
python3 ./bin/laurelinos.py brief --demo
python3 ./bin/laurelinos.py open-loops --demo
python3 ./bin/laurelinos.py prepare-meeting --demo
```

4. Configure MCP using the host agent's documented config format:

```json
{
  "name": "laurelinos",
  "command": "python3",
  "args": ["/absolute/path/to/laurelinos/bin/laurelinos.py", "mcp", "serve"]
}
```

5. Smoke test stdio MCP:

```bash
printf '%s\n' \
  '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}' \
  '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}' \
  | python3 ./bin/laurelinos.py mcp serve
```

6. Report:
   - LaurelinOS path;
   - config files changed;
   - MCP server command;
   - demo command output summary;
   - whether license is demo or activated;
   - source approval status.

## What the installer must not do

The install agent must not:

- install Hermes or OpenClaw;
- create cloud resources;
- open public ports;
- expose remote MCP;
- read unrelated local folders;
- index real sources before `sources approve`;
- store raw Claude/Codex/OpenAI/Anthropic/Hermes/OpenClaw credentials in LaurelinOS;
- send private source contents to Laurelin;
- create Stripe/customer/billing records from the local installer;
- mutate email, calendar, CRM, GitHub, DNS, cloud, or customer systems.

## Host-specific adapters later

Future installer helpers can target host-specific setup patterns:

```text
laurelinos setup claude
laurelinos setup codex
laurelinos setup cursor
laurelinos setup hermes
laurelinos setup openclaw
```

These commands should generate or validate configuration snippets. They should not install third-party agents or scrape their web UIs.

## Pilot onboarding script

For first paid pilots, Joseph can ask the customer's agent to run this checklist while screen-sharing:

```text
1. Verify Node/npm/git.
2. Verify LaurelinOS checkout or package location.
3. Run doctor/init/license status.
4. Run brief/open-loops demo.
5. Configure LaurelinOS MCP in the existing agent runtime.
6. Run tools/list smoke test.
7. Add one source candidate only if the customer explicitly chooses a path.
8. Do not approve or index real data in the first setup unless the customer understands the boundary.
```

## Success criteria

A setup is successful when:

- the user's chosen agent can list LaurelinOS MCP tools;
- the agent can call `list_sources`, `search_memory`, `get_source`, `get_daily_brief`, `get_open_loops`, or `prepare_meeting`;
- no third-party agent was installed by LaurelinOS;
- no raw model credentials were handled by LaurelinOS;
- no real source contents were read or indexed;
- the customer understands how source approval works.
