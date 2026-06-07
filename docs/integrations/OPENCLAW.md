# OpenClaw Integration Guide

Status: v0 local stdio MCP guide

Public reference: https://openclaw.ai

## Role split

OpenClaw is an agent/action layer. LaurelinOS should not download, install, run, vendor, or supervise OpenClaw.

LaurelinOS should be installed alongside the user's existing OpenClaw setup as a local memory, source-policy, approval, audit, and operating-rhythm layer.

```text
OpenClaw
  -> supplies agent execution, model calls, chat/action workflows, and tools
  -> calls LaurelinOS over local stdio MCP when it needs founder/company context

LaurelinOS
  -> owns source registry, source approvals, audit log, operating briefs, open loops, and future memory adapters
  -> never becomes the model provider
  -> never stores raw provider credentials
```

This solves the model-plug-in question: OpenClaw uses whatever model/account/tooling the user already configured. LaurelinOS gives OpenClaw structured, source-scoped company context and approval boundaries.

## Current LaurelinOS MCP command

From this repository:

```bash
python3 ./bin/laurelinos.py mcp serve
```

After a global/local install later:

```bash
laurelinos mcp serve
```

The server is local stdio only.

## Tools exposed today

```text
get_status
get_daily_brief
get_open_loops
prepare_meeting
```

All current tools are read-only and synthetic-data-only.

## Agentic install target

Do not ask the customer to manually understand MCP config unless needed.

The desired install path is:

```text
User asks OpenClaw or another setup agent:
"Install LaurelinOS into my agent environment. Do not install OpenClaw. Configure LaurelinOS as a local MCP server and verify it with the synthetic demo."

Agent:
  -> checks python3/git and optional node/npm compatibility tooling
  -> clones or receives LaurelinOS package
  -> runs laurelinos doctor
  -> runs laurelinos init --local
  -> runs laurelinos brief --demo
  -> runs laurelinos open-loops --demo
  -> runs laurelinos prepare-meeting --demo
  -> writes/updates the host agent's MCP config with the LaurelinOS stdio command
  -> runs a tools/list smoke test
  -> reports exactly what changed
```

Use absolute paths during development:

```json
{
  "name": "laurelinos",
  "command": "python3",
  "args": ["/absolute/path/to/laurelinos/bin/laurelinos.py", "mcp", "serve"]
}
```

The exact config file and field names are host-agent-specific. The installer agent should follow OpenClaw's current docs and local config conventions rather than LaurelinOS hard-coding them.

Do not wrap the command in `npm run` for MCP clients because npm script banners can pollute stdio JSON-RPC framing.

## Agent instruction snippet

Use this instruction block with OpenClaw when connecting LaurelinOS:

```text
LaurelinOS is the memory, source-policy, approval, and audit layer.

Rules:
- Use LaurelinOS MCP tools for daily brief, open-loop, and meeting-prep context.
- Preserve source IDs in any plan, summary, draft, or follow-up proposal.
- Treat every external mutation as blocked until the user grants explicit approval.
- Do not index or read unrelated paths.
- Do not write to email, calendar, GitHub, CRM, Stripe, DNS, cloud infrastructure, or customer systems unless an approval record exists.
- If the next step needs a new tool, propose it rather than inventing an unsafe workaround.
```

## Smoke test

Run the server directly before wiring OpenClaw:

```bash
printf '%s\n' \
  '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}' \
  '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}' \
  '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"get_daily_brief","arguments":{}}}' \
  | python3 ./bin/laurelinos.py mcp serve
```

Expected result:

- initialize returns server metadata;
- tools/list includes `get_status`, `get_daily_brief`, `get_open_loops`, and `prepare_meeting`;
- get_daily_brief returns synthetic founder context, open commitments, meeting prep, source IDs, and approval flags.

## Future tools for OpenClaw

Add these only after approval and audit semantics are tested locally:

```text
list_sources
get_source_policy
propose_followup
request_action_approval
record_action_result
```

Avoid direct write tools until the proposal/approval/result loop is designed.

## Safety boundary

For v0:

- no OpenClaw download or native install by LaurelinOS;
- no remote MCP;
- no public ports;
- no automatic broad indexing;
- no real customer data in public demos;
- no external writes from OpenClaw without approval;
- no LaurelinOS storage of raw AI-provider credentials.
