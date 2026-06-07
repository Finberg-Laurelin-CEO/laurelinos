# Integrations

LaurelinOS should integrate with agent runtimes as a local memory, source-policy, approval, and audit layer.

Current v0 integration target:

```bash
node ./bin/laurelinos.mjs mcp serve
```

Guides:

- [Agentic install plan](AGENTIC_INSTALL.md)
- [Hermes](HERMES.md)
- [OpenClaw](OPENCLAW.md)

## Boundary

Clients execute. LaurelinOS owns state.

```text
Claude / Codex / Hermes / OpenClaw / Cursor
  -> model calls and agent execution through user's existing setup
  -> local stdio MCP
  -> LaurelinOS runtime
  -> source-scoped memory, approval gates, and audit log
```

## What LaurelinOS must not do

- Do not download, install, or run Hermes/OpenClaw natively.
- Do not ask for raw model-provider credentials.
- Do not sell API credits as the first business model.
- Do not expose remote MCP or public ports for v0.
- Do not silently index real folders.

The product should be installed agentically into the user's current agent environment, then act as the state and policy layer those agents call.
