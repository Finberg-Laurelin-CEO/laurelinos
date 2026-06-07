# Build Log

## 2026-06-07 — Initial scaffold

Task: initialise public local-first LaurelinOS MVP scaffold for `Finberg-Laurelin-CEO/laurelinos`.

Files:

- README / AGENTS / MVP specification / roadmap;
- zero-dependency CLI;
- synthetic demo brain;
- tests;
- Superset instructions;
- pricing, Stripe, privacy, and SOC 2 readiness drafts.

Tests:

```bash
npm test
npm run check
```

Security notes:

- Synthetic data only.
- No secrets.
- No real Laurelin or customer data.
- External actions remain approval-gated.

## 2026-06-07 — MCP server hardening

Task: harden the local stdio MCP server and add automated JSON-RPC coverage on `feat/mcp-server`.

Files:

- `bin/laurelinos.mjs` delegates MCP line handling to a local module while preserving `laurelinos mcp serve`.
- `lib/mcp.mjs` contains read-only synthetic MCP tools and JSON-RPC error handling.
- `tests/mcp.test.mjs` covers initialize, tools/list, tool calls, unknown tool/method errors, parse errors, notifications, and stdin/stdout smoke.
- `docs/architecture/MCP_INTEGRATION.md` documents the v0 stdio-only MCP contract and smoke test.

Commands run:

```bash
npm test
npm run check
printf '%s\n' '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}' '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}' '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"get_open_loops","arguments":{}}}' | node ./bin/laurelinos.mjs mcp serve
```

Tests run:

- `npm test` — 15 passing.
- `npm run check` — passing.
- Local MCP stdin/stdout smoke — initialize, tools/list, and get_open_loops returned JSON-RPC responses.

Unresolved questions:

- None for v0 stdio MCP.

Security notes:

- Stdio only; no HTTP server, public port, remote MCP endpoint, GCP, or deploy path.
- Tools remain read-only and synthetic-data-only.
- External actions remain approval-gated and are not implemented as MCP tools.
