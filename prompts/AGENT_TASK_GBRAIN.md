# Agent Task — GBrain Adapter

Build the GBrain adapter boundary.

## Branch

```text
feat/gbrain-adapter
```

## Scope

Allowed files:

```text
packages/gbrain-adapter/**
packages/runtime-core/**
docs/architecture/GBRAIN_INTEGRATION.md
docs/BUILD_LOG.md
```

## Requirements

Create an adapter interface and a stub implementation.

Do not index real folders.
Do not initialise a real GBrain database automatically.
Do not require GBrain for demo commands.

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
