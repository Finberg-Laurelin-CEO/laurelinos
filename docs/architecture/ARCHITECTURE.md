# LaurelinOS Architecture

## Core thesis

LaurelinOS is an AI-native operating layer for organisations.

It is not:

- a Linux distribution;
- a website demo;
- a generic chatbot;
- a Claude wrapper;
- a GBrain fork.

It is the runtime layer that coordinates memory, context, workflows, permissions, model selection, and agent clients.

For Hermes/OpenClaw-style agents, LaurelinOS should feel GBrain-like: an agent-usable company-brain substrate that can be installed/configured by agents and called over local MCP, while the external agent runtime continues to handle model calls and action execution.

## System model

```text
Users / Agents / CLI / MCP clients
        ↓
LaurelinOS Runtime
        ↓
Context service + workflow engine + approval gates
        ↓
GBrain adapter + local source adapters
        ↓
Approved company artefacts
```

## Component boundaries

### Runtime core

Owns:

- local configuration;
- source registry;
- approval-gate policy;
- provider-neutral session state later;
- workflow orchestration;
- local audit records for source registration and approval;
- tool-call audit records later.

### Workflows

Own:

- daily founder brief;
- open-loop detection;
- meeting prep;
- follow-up drafting later.

### GBrain adapter

Owns the boundary to GBrain.

It should provide:

```text
status
listSources
addSource
search
getPage
writePage
sync
```

The adapter should not silently index real folders. Local source registration starts as a candidate; `sources approve <name>` records explicit approval and writes an audit event before any future indexing path can use it.

### MCP server

Exposes LaurelinOS to agents.

First tools:

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

Later tools:

```text
draft_followup
write_memory
create_task
```

`record_feedback` is the first local mutation and requires explicit approval. External write tools require stronger approval gates.

## Runtime state rule

The runtime owns state. Models do not own state.

This means:

- a Claude session is not the canonical memory;
- a Codex session is not the canonical memory;
- a chat transcript is not the canonical memory;
- the company brain and runtime store durable facts, sessions, skills, sources, and approvals.

## Compute strategy

Default:

```text
User brings Claude/Codex subscription or API key.
```

Later:

```text
Optional managed compute with strict quotas.
```

Do not promise unlimited AI usage unless unit economics are proven.
