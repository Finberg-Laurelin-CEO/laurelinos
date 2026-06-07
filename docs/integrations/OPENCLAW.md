# OpenClaw Integration Guide

Status: v0 local stdio MCP guide

## Role split

OpenClaw should be an execution/runtime client. LaurelinOS should remain the source-scoped memory, approval, audit, and operating-rhythm layer.

```text
OpenClaw
  -> calls LaurelinOS over local stdio MCP
  -> receives cited founder context and open loops
  -> plans or executes only inside user-approved scope
  -> external actions require LaurelinOS/user approval first
```

Do not make OpenClaw the canonical state layer for LaurelinOS. Models and agent runtimes do not own durable company state.

## Current LaurelinOS MCP command

From this repository:

```bash
node ./bin/laurelinos.mjs mcp serve
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
```

All current tools are read-only and synthetic-data-only.

## Generic OpenClaw MCP config shape

OpenClaw documents MCP servers through an `mcp.servers` configuration shape and CLI registry commands. Use a local stdio server command and adapt paths to your checkout.

Example config shape:

```json
{
  "mcp": {
    "servers": {
      "laurelinos": {
        "command": "node",
        "args": ["/absolute/path/to/laurelinos/bin/laurelinos.mjs", "mcp", "serve"]
      }
    }
  }
}
```

If using the OpenClaw MCP registry CLI, register the same command/args pair as the `laurelinos` server.

Use an absolute path during development. Do not wrap the command in `npm run` for MCP clients because npm script banners can pollute stdio JSON-RPC framing.

## Agent instruction snippet

Use this instruction block with OpenClaw when connecting LaurelinOS:

```text
LaurelinOS is the memory, source-policy, approval, and audit layer.

Rules:
- Use LaurelinOS MCP tools for daily brief and open-loop context.
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
  | node ./bin/laurelinos.mjs mcp serve
```

Expected result:

- initialize returns server metadata;
- tools/list includes `get_status`, `get_daily_brief`, and `get_open_loops`;
- get_daily_brief returns synthetic founder context, open commitments, meeting prep, source IDs, and approval flags.

## Future tools for OpenClaw

Add these only after approval and audit semantics are tested locally:

```text
list_sources
get_source_policy
prepare_meeting
propose_followup
request_action_approval
record_action_result
```

Avoid direct write tools until the proposal/approval/result loop is designed.

## Safety boundary

For v0:

- no remote MCP;
- no public ports;
- no automatic broad indexing;
- no real customer data in public demos;
- no external writes from OpenClaw without approval;
- no LaurelinOS storage of raw AI-provider credentials.
