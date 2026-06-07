# MCP Integration

## Purpose

MCP is the agent interface for LaurelinOS.

Claude, Codex, Hermes, OpenClaw, Cursor, and future agents should be able to call LaurelinOS tools without owning the company state.

## First tools

```text
get_status
get_daily_brief
get_open_loops
```

These are synthetic, read-only, and local by default.

## Later tools

```text
prepare_meeting
draft_followup
write_memory
create_task
update_crm
schedule_meeting
```

All write tools require approval gates.

## Transport

Start with stdio MCP because it is local and safer.

HTTP MCP comes later after authentication, scopes, and audit logs exist.

## Security

- No remote unauthenticated MCP.
- No tool that can send messages without approval.
- No source indexing over MCP until explicit local approval exists.
- No secrets in tool outputs.
