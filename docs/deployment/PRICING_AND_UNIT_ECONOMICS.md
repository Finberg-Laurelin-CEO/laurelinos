# Pricing and Unit Economics

## Principle

Do not sell unlimited AI compute until usage is measured.

The safest v1 pricing structure is subscription + entitlement, not API credits:

```text
Customer pays LaurelinOS for memory, workflows, onboarding, support, and operating layer.
Customer supplies Claude/Codex subscription or API keys for model compute.
Laurelin issues a license/activation credential for paid FounderOS packaging later.
```

See `SUBSCRIPTION_AND_LICENSE_PLAN.md` for the credential/provisioning plan.

## Initial plans

### Personal Brain — $19/month

For solo users testing local company-brain workflows.

Includes:

- local CLI;
- synthetic demo workflows;
- local source registry;
- daily brief/open-loop workflows;
- BYO compute.

### FounderOS — $49/month

For founders using it as an AI chief of staff.

Includes:

- founder brief;
- open-loop detection;
- meeting prep workflow later;
- MCP tools;
- Claude/Codex subscription-friendly local setup;
- BYO compute.

### Team Brain — $199/month

For small teams.

Includes:

- shared source policy;
- team workflow templates;
- GBrain integration support;
- Hermes/OpenClaw integration support later;
- BYO compute.

### Managed Founder Office — $999/month+

For customers who want Laurelin to set it up and maintain workflows.

Includes:

- onboarding assistance;
- workflow tuning;
- managed checks;
- optional capped compute allowance;
- weekly support.

## Bundled compute idea

Bundled compute can be added later, but only with strict limits.

Possible future plan:

```text
FounderOS Plus — $99/month
Includes a fixed monthly compute allowance.
After allowance: user adds API key, buys credits, or pauses heavy automation.
```

## Margin guardrails

Before bundling compute, track:

- tokens per daily brief;
- tokens per open-loop scan;
- tokens per meeting prep;
- actions approved per user;
- cost per active user per week;
- gross margin after payment fees and support time.

## MRR goal

First target:

```text
$1,000/month MRR
```

Possible paths:

```text
20 users at $49/month
5 teams at $199/month
1 managed customer at $999/month
```

The fastest validation path is probably one managed customer plus a few founder users.
