# MCP Integration

## Purpose

MCP is the local agent interface for LaurelinOS.

Claude, Codex, Hermes, OpenClaw, Cursor, and future agents should be able to call LaurelinOS tools without owning the company state. Client-specific setup notes live in `docs/integrations/`.

## Current v0 server

Run the local stdio server:

```bash
node ./bin/laurelinos.mjs mcp serve
```

The server reads newline-delimited JSON-RPC messages from stdin and writes JSON-RPC responses to stdout. It does not start an HTTP server, bind a port, expose a remote endpoint, or perform external writes. Use the direct `node` command for MCP smoke tests so npm script headers do not pollute stdout.

## First tools

```text
get_status
get_daily_brief
get_open_loops
```

These tools are synthetic, read-only, local by default, and backed by `examples/demo-data/demo-brain.json`.

`get_status` reports that the server is using stdio transport, read-only mode, synthetic demo data, and approval-gated external actions.

`get_daily_brief` returns the synthetic founder brief with source IDs.

`get_open_loops` returns synthetic open loops with source IDs and `approvalRequiredBeforeExternalAction: true`.

## Local smoke test

```bash
printf '%s\n' \
  '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}' \
  '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}' \
  '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"get_open_loops","arguments":{}}}' \
  | node ./bin/laurelinos.mjs mcp serve
```

Expected behavior:

- `initialize` returns LaurelinOS server metadata and tool capability.
- `tools/list` returns only `get_status`, `get_daily_brief`, and `get_open_loops`.
- `tools/call get_open_loops` returns synthetic open loops with source IDs.

## Later tools

```text
prepare_meeting
draft_followup
write_memory
create_task
update_crm
schedule_meeting
```

All write tools require approval gates before implementation.

## Transport

Start with stdio MCP because it is local and safer.

HTTP MCP comes later only after authentication, scopes, and audit logs exist.

## Security

- No remote unauthenticated MCP.
- No HTTP MCP for v0.
- No public ports.
- No tool that can send messages without approval.
- No source indexing over MCP until explicit local approval exists.
- No secrets in tool outputs.
- No real Laurelin, customer, investor, or private Obsidian data in demo outputs.
