# Hermes Integration Guide

Status: v0 local stdio MCP guide

Public reference: https://hermes-agent.nousresearch.com

## Role split

Hermes is an autonomous agent/runtime. LaurelinOS should not download, install, run, vendor, or supervise Hermes.

LaurelinOS should be installed alongside the user's existing Hermes setup as a local memory, source-policy, approval, audit, and workflow layer.

```text
Hermes
  -> supplies agent execution, model calls, browser/tools, and automations
  -> calls LaurelinOS over local stdio MCP when it needs founder/company context

LaurelinOS
  -> owns source registry, source approvals, audit log, operating briefs, open loops, and future memory adapters
  -> never becomes the model provider
  -> never stores raw provider credentials
```

This solves the model-plug-in question: Hermes uses whatever model/account/provider the user already configured. LaurelinOS gives Hermes structured, source-scoped company context and approval boundaries.

## Current LaurelinOS MCP command

From this repository:

```bash
python3 ./bin/laurelinos.py mcp serve
```

After a global/local install later:

```bash
laurelinos mcp serve
```

The server is stdio-only. It does not bind a port or expose a remote endpoint.

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
User asks Hermes or another setup agent:
"Install LaurelinOS into my agent environment. Do not install Hermes. Configure LaurelinOS as a local MCP server and verify it with the synthetic demo."

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

The exact config file and field names are host-agent-specific. The installer agent should follow Hermes' current docs and local config conventions rather than LaurelinOS hard-coding them.

## Agent instruction snippet

Use this instruction block with Hermes when connecting LaurelinOS:

```text
Use LaurelinOS as the source-scoped company-brain runtime.

Rules:
- Call LaurelinOS MCP tools for founder context, daily brief, open loops, and meeting prep.
- Treat LaurelinOS outputs as cited operating context, not as permission to act externally.
- Do not index new folders or read unrelated local paths.
- Do not send email, create calendar events, update CRMs, create GitHub issues, or mutate external systems without an explicit approval record.
- If you draft an action, label it as a proposal and cite the LaurelinOS source IDs that justified it.
```

## Smoke test

Run the server directly before wiring Hermes:

```bash
printf '%s\n' \
  '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}' \
  '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}' \
  '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"get_open_loops","arguments":{}}}' \
  | python3 ./bin/laurelinos.py mcp serve
```

Expected result:

- initialize returns server metadata;
- tools/list includes `get_status`, `get_daily_brief`, `get_open_loops`, and `prepare_meeting`;
- get_open_loops returns synthetic open loops with source IDs and approval flags.

## Future tools for Hermes

Add these only after local source approval and audit flow is solid:

```text
list_sources
get_source_policy
propose_followup
request_action_approval
record_action_result
```

Do not add direct write tools first. Proposal tools come first; write tools require explicit approval gates and audit records.

## Safety boundary

For v0:

- no Hermes download or native install by LaurelinOS;
- no remote MCP;
- no public ports;
- no real source indexing from Hermes;
- no external writes;
- no raw provider credentials stored by LaurelinOS;
- no private customer data in public demos.
