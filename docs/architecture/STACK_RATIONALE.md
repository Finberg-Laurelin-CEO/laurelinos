# Stack Rationale

## Current decision

The active MVP runtime should move from plain JavaScript to a stdlib-only Python CLI/MCP core.

Rust remains a good future option for single-binary distribution, high-performance local indexing, or hardened native components. It is not the best next step in this environment because Rust is not currently installed here, so a Rust rewrite would be untestable during this build session.

## Why Python now

Python is a better fit than plain JavaScript for the current LaurelinOS core because:

- it is widely available on developer and agent workstations;
- it has strong local-file, data-processing, and AI tooling ecosystem fit;
- stdlib JSON, subprocess, filesystem, and unittest support are enough for the current CLI/MCP MVP;
- it avoids turning the long-term company-brain runtime into a frontend-language prototype;
- it is easier to evolve toward local indexing, source parsing, and data workflows;
- it can still be installed/configured by agents with a simple `python3 ./bin/laurelinos.py ...` command.

The earlier Node implementation is kept temporarily as a compatibility reference while behavior moves into Python.

## Why not Rust immediately

Rust is attractive later, especially for:

- a single native binary;
- fast local indexing;
- strict memory safety;
- durable file-watcher/indexer components;
- distribution without requiring Python or Node.

But for the next MVP slice, Rust would slow the build because:

- `rustc` and `cargo` are not installed in the current environment;
- the immediate need is product behavior, not performance;
- the first useful workflow is source-scoped memory and agent-readable tools;
- Python can be tested now with no dependencies.

## What must keep working

The MVP needs trustworthy commands first:

```bash
laurelinos doctor
laurelinos init --local
laurelinos sources list
laurelinos sources add <name> <path>
laurelinos sources approve <name>
laurelinos audit log
laurelinos license status
laurelinos setup agent openclaw --json
laurelinos brief --demo
laurelinos open-loops --demo
laurelinos prepare-meeting --demo
laurelinos mcp serve
```

## Migration path

1. Keep the existing CLI commands stable.
2. Make Python the primary `npm run dev`, package bin, tests, and MCP setup target.
3. Port workflow behavior from Node helpers into `py/laurelinos_core`.
4. Keep Node files temporarily until Python parity is proven.
5. Add approved-source ingestion/search in Python.
6. Revisit Rust for packaging/indexing once the workflow is worth hardening.

## Decision rule

Use the smallest runtime that lets a founder install LaurelinOS locally, connect an agent, approve sources, and get useful brief/open-loop/meeting-prep output.

Right now that runtime is Python. If Python becomes the bottleneck, move narrow components to Rust rather than rewriting the whole product prematurely.
