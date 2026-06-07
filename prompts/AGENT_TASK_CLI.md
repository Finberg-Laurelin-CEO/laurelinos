# Agent Task — CLI Doctor and Init

Build and harden the initial LaurelinOS CLI.

## Branch

```text
feat/cli-doctor-init
```

## Scope

Allowed files:

```text
bin/**
lib/**
packages/cli/**
packages/runtime-core/**
tests/**
docs/BUILD_LOG.md
```

## Commands to maintain

```bash
laurelinos doctor
laurelinos init --local
laurelinos sources list
laurelinos sources add <name> <path>
laurelinos brain status
```

## Requirements

`doctor` should report:

- OS/platform;
- Node/npm availability;
- git availability;
- GitHub CLI availability;
- GBrain availability;
- Claude/Codex command availability if detectable;
- config path;
- warnings.

`init --local` should create a safe local config directory with:

```text
config.json
sources.json
logs/
state/
```

Do not store secrets.

## Acceptance

```bash
npm test
npm run check
```
