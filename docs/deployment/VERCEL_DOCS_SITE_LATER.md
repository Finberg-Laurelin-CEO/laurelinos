# Vercel Docs Site Later

## Domain

Planned documentation/subscription domain:

```text
laurelinos.dev
```

## Do not build first

The docs site should come after the CLI/runtime MVP works locally.

## Site purpose

The site should provide:

- installation instructions;
- quickstart;
- pricing;
- subscription checkout;
- privacy policy;
- security page;
- SOC 2 readiness statement;
- MCP integration docs;
- GBrain integration docs;
- Hermes/OpenClaw integration docs;
- founder use cases.

## Aesthetic

A basic CLI/text-first aesthetic is fine. The aesthetic is secondary to making the tool work.

## Suggested routes

```text
/
/install
/quickstart
/docs
/docs/mcp
/docs/gbrain
/docs/hermes-openclaw
/pricing
/privacy
/security
/soc2-readiness
```

## Deployment

Later:

```bash
cd apps/docs-site
vercel
```

Connect the Vercel project to this GitHub repo after the docs app exists.
