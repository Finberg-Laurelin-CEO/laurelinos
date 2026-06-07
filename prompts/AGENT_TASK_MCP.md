# Agent Task — MCP Server

Build the first LaurelinOS MCP server.

## Branch

```text
feat/mcp-server
```

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
```

## Tools

Expose:

```text
get_status
get_daily_brief
get_open_loops
```

## Requirements

- Use synthetic data by default.
- No external writes.
- No secrets.
- All tool outputs should be structured and include source IDs where available.
- Include local usage docs.

## Acceptance

MCP server starts locally and a test client can call the three tools, or package-level tests validate the tool handlers.

Run:

```bash
npm test
npm run check
```
