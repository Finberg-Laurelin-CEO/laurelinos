# Agent Task — Demo Workflows

Build synthetic daily brief and open-loop detection.

## Branch

```text
feat/demo-workflows
```

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

## Commands supported

```bash
laurelinos brief --demo
laurelinos open-loops --demo
```

## Synthetic data requirements

Create fake artefacts:

- investor email;
- founder meeting notes;
- customer risk note;
- GitHub issue;
- calendar item;
- internal decision note.

No real Laurelin data.

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

## Acceptance

```bash
npm test
npm run dev -- brief --demo
npm run dev -- open-loops --demo
```
