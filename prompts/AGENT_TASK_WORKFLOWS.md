# Agent Task — Demo Workflows

Deepen the synthetic daily brief, open-loop detection, and meeting-prep workflows.

## Branch

```text
feat/demo-workflows
```

## Current status on main

Minimal synthetic `brief --demo` and `open-loops --demo` commands already work. This branch should improve quality and coverage without adding real data, model calls, or external APIs.

## Scope

Allowed files:

```text
lib/demo.mjs
lib/format.mjs
examples/demo-data/**
packages/workflows/**
skills/**
tests/**
docs/BUILD_LOG.md
```

## Commands to maintain

```bash
laurelinos brief --demo
laurelinos open-loops --demo
```

Current local-only meeting-prep command:

```bash
laurelinos prepare-meeting --demo
```

## Synthetic data requirements

Use fake artefacts only:

- investor email;
- founder meeting notes;
- customer risk note;
- GitHub issue;
- calendar item;
- internal decision note.

No real Laurelin, customer, investor, or private Obsidian data.

## Output requirements

Daily brief should contain:

- top priorities;
- open commitments;
- changes since last brief;
- recommended actions;
- citations/source IDs.

Open-loop detector should output:

- person/company;
- commitment;
- source;
- age/due date if available;
- severity;
- recommended action;
- whether approval is required.

External actions must remain suggestions only. Do not send messages, create tasks, or write to external systems.

## Acceptance

```bash
npm test
npm run check
npm run dev -- brief --demo
npm run dev -- open-loops --demo
```
