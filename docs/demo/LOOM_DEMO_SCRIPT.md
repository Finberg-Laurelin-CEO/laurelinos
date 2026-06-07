# Loom Demo Script

Status: public-safe demo script for first FounderOS pilot outreach

## Goal

Record a 90-second demo that sells the outcome, not the architecture.

Outcome:

```text
A founder can see what changed, who they owe, what meetings need prep, and which follow-ups are at risk.
```

Do not lead with tokens, agents, architecture, GBrain, Stripe, or licensing.

## Setup

Use a clean terminal with large font.

Before recording:

```bash
npm install
npm test
npm run check
```

Run the repeatable demo script once to confirm output:

```bash
npm run demo:loom
```

For recording, you can either run the script end-to-end or run the commands manually for better pacing.

## Manual command sequence

```bash
clear
python3 ./bin/laurelinos.py doctor
python3 ./bin/laurelinos.py license status
python3 ./bin/laurelinos.py setup agent openclaw --json
python3 ./bin/laurelinos.py brief --demo
python3 ./bin/laurelinos.py open-loops --demo
python3 ./bin/laurelinos.py prepare-meeting --demo
printf '%s\n' \
  '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}' \
  '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}' \
  '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"get_open_loops","arguments":{}}}' \
  | python3 ./bin/laurelinos.py mcp serve
```

Use `python3 ./bin/laurelinos.py` instead of `npm run dev --` for MCP smoke tests so npm script banners do not pollute stdio JSON-RPC output.

## 90-second script

### 0:00 to 0:10 — hook

Say:

```text
This is LaurelinOS, a local-first AI chief of staff layer for founders. It helps your existing agent setup find dropped follow-ups, prep meetings, and keep company context source-scoped.
```

Show:

```bash
python3 ./bin/laurelinos.py doctor
```

Point out:

- local runtime;
- optional agent tools;
- no cloud setup required for the synthetic demo.

### 0:10 to 0:20 — no API-credit pitch

Say:

```text
LaurelinOS is not selling model credits. It works with the model and agent system you already use, like Claude, Codex, Hermes, OpenClaw, or Cursor. LaurelinOS owns the memory and approval layer.
```

Show:

```bash
python3 ./bin/laurelinos.py license status
```

Point out:

- demo mode works without a license;
- paid pilot activation is a local entitlement record later;
- no raw model credentials are handled by LaurelinOS.

### 0:20 to 0:50 — daily brief

Show:

```bash
python3 ./bin/laurelinos.py brief --demo
```

Say:

```text
This is the daily founder brief. It shows operating context, top priorities, open commitments, and meeting prep. Every important item cites a source ID.
```

Point out:

- founder operating context;
- top priorities;
- meeting prep;
- source IDs.

### 0:50 to 1:10 — money screen

Show:

```bash
python3 ./bin/laurelinos.py open-loops --demo
```

Say:

```text
This is the money screen: open loops. Who do I owe, when is it due, what source proved it, and what action is suggested. External actions require approval.
```

Point out:

- counterparty;
- due date;
- source title;
- recommended action;
- approval required.

### 1:10 to 1:25 — agent integration

Show:

```bash
python3 ./bin/laurelinos.py setup agent openclaw --json
printf '%s\n' \
  '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}' \
  '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}' \
  | python3 ./bin/laurelinos.py mcp serve
```

Say:

```text
Any MCP-aware agent can call this locally. Hermes or OpenClaw can do the model and action work through the user's existing setup. LaurelinOS supplies the state, source policy, approvals, and audit trail.
```

### 1:25 to 1:30 — call to action

Say:

```text
I am looking for a few founders to set this up manually. If it catches real dropped follow-ups in your workflow, that is the FounderOS pilot.
```

## What not to show

Do not show:

- real private data;
- real customer names;
- real investor notes;
- private Obsidian vault contents;
- API keys or provider tokens;
- Stripe secrets;
- cloud consoles;
- hosted onboarding;
- remote MCP;
- raw license activation tokens.

Do not claim:

- production-ready real indexing;
- SOC 2 compliance;
- managed cloud deployment;
- bundled compute;
- universal Hermes/OpenClaw auto-detection already implemented.

## Recommended Loom title

```text
FounderOS demo: catch dropped founder follow-ups locally
```

## Outreach follow-up text

```text
The important part is the open-loop report: who you owe, why, due date, source citation, and suggested next action with approval required.

If you want, I can do a 20-minute setup/fit call and see whether your workflow is a good pilot candidate.
```

## Acceptance checklist before sending

- The video is under 2 minutes.
- The open-loop report appears before the 70-second mark.
- No private data is visible.
- No token or secret is visible.
- The CTA asks for a setup/fit call, not a waitlist signup.
- The demo makes clear that existing agents/models make calls and LaurelinOS supplies memory/policy.
