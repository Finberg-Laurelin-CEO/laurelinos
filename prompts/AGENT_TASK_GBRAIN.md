# Agent Task — GBrain Adapter

Build the GBrain adapter boundary.

## Branch

```text
feat/gbrain-adapter
```

## Current status on main

`brain status` detects whether `gbrain` is installed, but LaurelinOS does not initialise a real GBrain database and does not index real folders. Keep that safety posture.

## Scope

Allowed files:

```text
packages/gbrain-adapter/**
packages/runtime-core/**
docs/architecture/GBRAIN_INTEGRATION.md
docs/BUILD_LOG.md
tests/**
```

## Requirements

Create an adapter interface and a stub implementation.

Do not index real folders.
Do not initialise a real GBrain database automatically.
Do not require GBrain for demo commands.
Do not upload private data or connect to hosted infrastructure.

## Interface

Support:

```text
status
listSources
addSource
search
getPage
writePage
sync
```

`writePage` must require explicit approval in its input type.

## Acceptance

```bash
npm test
npm run check
```
