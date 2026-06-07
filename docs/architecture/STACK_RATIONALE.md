# Stack Rationale

## Why the MVP is JavaScript

The current MVP is written in plain JavaScript because the first product is a local CLI and MCP stdio runtime, not a large backend service.

JavaScript/Node is a good fit for the current stage because:

- Node is already common on developer machines and agent workstations.
- The CLI can run with zero runtime dependencies.
- MCP uses JSON-RPC over stdio, which maps cleanly to Node streams and JSON handling.
- npm packaging makes local `npm link`, private packages, and agentic install flows simple.
- Claude/Codex/Cursor/Hermes/OpenClaw-style agent environments usually already understand Node-based tools.
- Tests run with Node's built-in test runner, so there is no framework setup cost.
- Fast iteration matters more than perfect long-term language choice while finding the first paid wedge.

## Why not a bigger stack yet

Do not introduce a heavy framework before the local runtime proves value.

Avoid for v0:

- web app framework;
- hosted API server;
- database server;
- Kubernetes/GCP/VPS deployment;
- local model requirement;
- bundled inference;
- broad indexing daemon;
- complex package split.

The MVP needs trustworthy commands first:

```bash
laurelinos doctor
laurelinos init --local
laurelinos sources list
laurelinos sources add <name> <path>
laurelinos sources approve <name>
laurelinos audit log
laurelinos license status
laurelinos brief --demo
laurelinos open-loops --demo
laurelinos mcp serve
```

## Future direction

The current plain JavaScript can evolve without changing the product thesis:

1. Keep `bin/laurelinos.mjs` small and stable.
2. Move runtime logic into package boundaries once behavior is proven.
3. Add TypeScript when module boundaries and interfaces settle.
4. Add native/Rust/Go components only if performance, binary distribution, or local indexing require them.
5. Keep MCP and CLI behavior compatible through migrations.

## Decision rule

Use the smallest stack that lets a founder install LaurelinOS locally, connect an agent, approve sources, and get a useful brief/open-loop report.

If JavaScript slows that down later, replace pieces deliberately. Do not rewrite before users prove the workflow is worth paying for.
