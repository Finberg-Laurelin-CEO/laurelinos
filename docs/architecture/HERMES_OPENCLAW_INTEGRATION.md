# Hermes and OpenClaw Integration

## Principle

Hermes and OpenClaw should be clients or execution runtimes.

They should not own canonical company memory.

```text
Hermes / OpenClaw / Claude / Codex
        ↓
LaurelinOS MCP tools
        ↓
LaurelinOS runtime + company brain
```

## Hermes role

Hermes is suitable for:

- scheduled jobs;
- daily digests;
- background checks;
- safe automation;
- self-improving skill loops later.

## OpenClaw role

OpenClaw is suitable for:

- user-facing chat channels;
- personal assistant interface;
- WhatsApp/Telegram/Slack-style interaction;
- asking LaurelinOS what needs attention.

## First integration

Do not build bespoke Hermes/OpenClaw integration first.

Build MCP first. Then let Hermes/OpenClaw call the MCP tools.
