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

The adapter should not silently index real folders.

### MCP server

Exposes LaurelinOS to agents.

First tools:

```text
get_status
get_daily_brief
get_open_loops
```

Later tools:

```text
prepare_meeting
draft_followup
write_memory
create_task
```

Write tools require approval gates.

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
