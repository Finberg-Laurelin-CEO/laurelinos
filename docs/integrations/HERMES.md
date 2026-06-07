# Hermes Integration Guide

Status: v0 local stdio MCP guide

## Role split

Hermes should be an execution client. LaurelinOS should remain the memory, source-policy, approval, and audit layer.

```text
Hermes agent
  -> calls LaurelinOS over local stdio MCP
  -> receives cited founder context, daily brief, and open loops
  -> proposes work
  -> waits for LaurelinOS/user approval before external writes
```

Do not make Hermes the canonical company memory. Do not let Hermes silently index broad local paths.

## Current LaurelinOS MCP command

From this repository:

```bash
node ./bin/laurelinos.mjs mcp serve
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
```

All current tools are read-only and synthetic-data-only.

## Generic Hermes MCP config shape

Hermes documents MCP servers under an `mcp_servers` map in its config. Use the local stdio command and adapt the path to your checkout.

```json
{
  "mcp_servers": {
    "laurelinos": {
      "command": "node",
      "args": ["/absolute/path/to/laurelinos/bin/laurelinos.mjs", "mcp", "serve"]
    }
  }
}
```

Use an absolute path for the repository checkout during development so the agent does not depend on the shell's current directory.

## Agent instruction snippet

Use this instruction block with Hermes when connecting LaurelinOS:

```text
Use LaurelinOS as the source-scoped company-brain runtime.

Rules:
- Call LaurelinOS MCP tools for founder context, daily brief, and open loops.
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
  | node ./bin/laurelinos.mjs mcp serve
```

Expected result:

- initialize returns server metadata;
- tools/list includes `get_status`, `get_daily_brief`, and `get_open_loops`;
- get_open_loops returns synthetic open loops with source IDs and approval flags.

## Future tools for Hermes

Add these only after local source approval and audit flow is solid:

```text
list_sources
get_source_policy
prepare_meeting
propose_followup
request_action_approval
record_action_result
```

Do not add direct write tools first. Proposal tools come first; write tools require explicit approval gates and audit records.

## Safety boundary

For v0:

- no remote MCP;
- no public ports;
- no real source indexing from Hermes;
- no external writes;
- no raw provider credentials stored by LaurelinOS;
- no private customer data in public demos.
