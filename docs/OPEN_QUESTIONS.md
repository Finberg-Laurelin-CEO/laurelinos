# Open Questions

## Settled for v0

1. The first MVP is local-first CLI/runtime plus local stdio MCP, not a website.
2. Synthetic demo data is the only public demo data.
3. GBrain is a memory subsystem/adapter target, not the whole product.
4. No GCP VM, VPS, hosted onboarding, public ports, remote MCP, or live Stripe integration is required for v0.
5. External actions remain suggestions until explicit approval gates exist.

## Product

1. Should the public product name remain LaurelinOS, or should FounderOS be the customer-facing package?
2. What exact outcome should the first paid customer buy: founder follow-ups, daily brief, meeting prep, or full company-brain setup?
3. Which synthetic demo scenario best proves value to early design partners?

## Technical

1. Should the package system remain zero-dependency JavaScript through v0, or move to TypeScript after the branch agents finish the first adapter/MCP hardening pass?
2. Which GBrain install path should be supported first once the adapter boundary exists?
3. Should the first MCP server remain stdio-only through v0, or should HTTP wait until authentication, scopes, and audit logs exist?
4. Which Claude/Codex subscription-compatible paths are officially supported enough for v1 documentation?

## Commercial

1. Settled for v1 planning: start with subscription + entitlement/license, not API credits.
2. Settled for v1 planning: customers bring Claude/Codex/API-key compute first; bundled compute is a later add-on only after usage is measured.
3. Which Stripe prices exist in the Laurelin Stripe account?
4. Should subscription checkout live on `laurelinos.dev`, Stripe Payment Links, or both after the local MVP is valuable?
5. Should early pilots use a manual license file, activation token, or private package token?
6. What is the first target MRR milestone after the internal demo: $1,000, $2,500, or $5,000?

## Compliance

1. Who owns privacy policy review?
2. Which data classes are allowed in public demos beyond synthetic examples?
3. When should SOC 2 readiness become a real audit project?
