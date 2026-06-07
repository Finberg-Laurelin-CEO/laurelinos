# Agent Task — MCP Server

Harden the local LaurelinOS MCP server.

## Branch

```text
feat/mcp-server
```

## Current status on main

`laurelinos mcp serve` starts a stdio JSON-RPC server with synthetic read-only tools. Python is now the active runtime path; the older Node MCP implementation is a temporary compatibility reference. This branch should make that path more testable and better documented without exposing a remote endpoint.

## Scope

Allowed files:

```text
bin/**
lib/**
packages/mcp-server/**
packages/runtime-core/**
packages/workflows/**
docs/architecture/MCP_INTEGRATION.md
docs/BUILD_LOG.md
tests/**
```

## Tools

Expose:

```text
get_status
list_sources
search_memory
get_source
list_feedback
record_feedback
get_daily_brief
get_open_loops
prepare_meeting
```

## Requirements

- Use synthetic data by default.
- Use local stdio transport for v0.
- No remote MCP endpoint.
- No public ports.
- No external writes.
- No secrets.
- `record_feedback` may write local feedback only when the call includes explicit approval.
- All tool outputs should be structured and include source IDs where available.
- Include local usage docs.

## Acceptance

MCP server starts locally and a test client can call the three tools, or package-level tests validate the tool handlers.

Run:

```bash
npm test
npm run check
```
