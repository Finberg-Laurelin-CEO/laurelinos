# packages/mcp-server

Package boundary for the future LaurelinOS MCP server.

Current v0 server lives in `bin/laurelinos.mjs` and uses local stdio JSON-RPC. It exposes synthetic read-only tools:

```text
get_status
get_daily_brief
get_open_loops
```

The next MCP branch should add automated tests and clearer handler structure without exposing HTTP, opening public ports, or adding write tools without approval gates.
