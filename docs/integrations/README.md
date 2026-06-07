# Integrations

LaurelinOS should integrate with agent runtimes as a local memory, source-policy, approval, and audit layer.

Current v0 integration target:

```bash
node ./bin/laurelinos.mjs mcp serve
```

Guides:

- [Hermes](HERMES.md)
- [OpenClaw](OPENCLAW.md)

## Boundary

Clients execute. LaurelinOS owns state.

```text
Claude / Codex / Hermes / OpenClaw / Cursor
  -> local stdio MCP
  -> LaurelinOS runtime
  -> source-scoped memory and approval gates
```

Do not expose remote MCP or public ports for v0.
