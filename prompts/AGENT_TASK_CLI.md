# Agent Task — CLI Core

The initial CLI scaffold has landed on `main` from `feat/cli-core`.

Use this prompt only for future CLI hardening work. Keep the local-first commands working while other branches improve workflows, GBrain, and MCP.

## Branch

```text
feat/cli-core
```

## Current status on main

Working now:

```bash
laurelinos doctor
laurelinos init --local
laurelinos sources list
laurelinos sources add <name> <path>
laurelinos brain status
laurelinos brief --demo
laurelinos open-loops --demo
laurelinos prepare-meeting --demo
laurelinos mcp serve
```

## Scope

Allowed files for future CLI hardening:

```text
bin/**
py/laurelinos_core/**
lib/**
packages/cli/**
packages/runtime-core/**
tests/**
docs/BUILD_LOG.md
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

Source commands must record candidate paths without indexing folder contents.

Do not store secrets. Do not index private folders. Do not require GBrain, cloud infrastructure, or hosted services for local demo commands.

## Acceptance

```bash
npm test
npm run check
```
