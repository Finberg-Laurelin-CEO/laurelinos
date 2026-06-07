# Subscription and License Plan

## Decision

For the first paid version, sell a subscription, not API credits.

LaurelinOS should make money from the operating layer:

- local runtime;
- company-brain workflows;
- MCP tools;
- source-scoped setup;
- approval-gated automations;
- onboarding and support;
- later managed sync/provisioning.

Users should bring compute first through Claude/Codex subscriptions or provider API keys. Bundled compute can come later after usage is measured.

## Why not API credits first

Selling model credits first creates the wrong business and product shape:

- Laurelin becomes responsible for unpredictable inference costs before usage is understood.
- Heavy users can destroy margins on a low monthly price.
- The product becomes a metered API wrapper instead of a local-first chief-of-staff runtime.
- Customers already have Claude, Codex, or API-key access they can use locally.
- The MVP value is memory, workflow, source scoping, and approvals, not cheap tokens.

API credits can be an optional later add-on, not the v1 wedge.

## Recommended first commercial shape

```text
Public LaurelinOS repo
    -> local install works with synthetic demo
    -> FounderOS subscription unlocks guided setup, support, templates, updates, and later hosted entitlement/provisioning
    -> customer brings Claude/Codex/API-key compute
```

Customer buys:

```text
"An AI chief of staff that runs on your existing AI setup, remembers your company context, finds open loops, prepares meetings, and gates every external action behind approval."
```

## Credential model

Use a subscription license credential, not an API-credit key.

The credential should represent entitlement:

```json
{
  "licenseVersion": 1,
  "product": "FounderOS",
  "subject": "customer_or_workspace_id",
  "plan": "founderos",
  "status": "active",
  "issuedAt": "ISO timestamp",
  "expiresAt": "ISO timestamp",
  "features": ["founder-brief", "open-loops", "meeting-prep", "mcp"],
  "signature": "server-signed value later"
}
```

Local storage target later:

```text
~/.laurelinos/license.json
```

The local runtime can work in demo mode without a license. Paid features can later check license status before enabling premium workflow packs, update channels, hosted sync, or managed onboarding.

## First paid pilot: manual provisioning

Before building webhooks, use a manual path:

1. Joseph sends a Stripe Payment Link or invoice.
2. Customer pays for FounderOS pilot or Managed Founder Office.
3. Joseph sends:
   - install command;
   - onboarding checklist;
   - a license file or activation token;
   - first-run instructions.
4. Customer runs:

```bash
npm install -g laurelinos
laurelinos doctor
laurelinos init --local
laurelinos license activate <token>   # local-only manual pilot activation
laurelinos brief --demo
laurelinos mcp serve
```

For the current repo state, `license activate` writes a local license record and stores only a token hash. It does not validate against Stripe or a hosted entitlement service yet.

## Automated path later

```text
Stripe Checkout / Payment Link
    -> checkout.session.completed
    -> create customer entitlement
    -> issue activation token
    -> send onboarding email
    -> customer installs local CLI
    -> laurelinos license activate <token>
    -> local license file is written
    -> customer connects Claude/Codex/API key locally
    -> customer approves source paths
    -> first real brief runs
```

Store only Stripe customer/subscription IDs and entitlement metadata. Do not store raw credit-card data.

## Install distribution options

### Recommended v1: public install, license-gated paid value

Keep the CLI easy to install. Subscription unlocks commercial value through license/entitlement and support, not through hiding the binary.

Pros:

- lowest install friction;
- easiest public docs;
- clear source-available evaluation posture without giving away commercial rights;
- buyers can verify the local-first promise before paying.

Cons:

- paid value must live in onboarding, templates, integrations, support, hosted entitlement, or premium workflow packs;
- license enforcement is not absolute, which is acceptable for early founder pilots.

### Alternative: private package token

Give paying customers a GitHub Packages or npm token for a private FounderOS package.

Pros:

- stronger distribution control;
- clearer paid/private boundary.

Cons:

- more onboarding friction;
- more support load;
- weaker public adoption loop;
- token handling creates another secrets surface.

Recommendation: public install first, license/entitlement second. Use private packages only for later proprietary workflow packs if needed.

## Plan tiers, first pass

```text
LaurelinOS Free / Demo
- local CLI
- synthetic demo data
- local stdio MCP
- no real indexing by default

FounderOS Pilot subscription
- guided local setup
- founder brief/open-loop/meeting-prep workflows
- MCP setup with Claude/Codex/local clients
- BYO compute
- source-scoped approval checklist

Team Brain subscription
- team source policy
- shared workflow templates
- GBrain integration support
- onboarding docs and support

Managed Founder Office
- Laurelin helps configure workflows
- weekly check-in/support
- optional capped managed compute later
```

## License commands

Implemented local-only commands:

```bash
laurelinos license status
laurelinos license activate <token>
```

Commands to add later:

```bash
laurelinos license deactivate
laurelinos auth login          # later hosted account flow, not v0
laurelinos billing status      # later hosted entitlement check
```

All commands must avoid writing secrets to logs. Activation tokens should be treated as secrets. Current activation stores only a token hash.

## What not to build yet

Do not build these before the local runtime proves value:

- hosted account dashboard;
- remote MCP endpoint;
- public docs/subscription website;
- GCP/VPS-hosted runner;
- API-credit metering;
- bundled inference credits;
- automated customer source indexing;
- Stripe webhook provisioning service.

## Next implementation sequence

1. Finish barebones local runtime and push it.
2. Add source approval and audit log locally.
3. Add `license status` with a local unsigned demo license shape.
4. Add `license activate` only after deciding manual-token versus hosted entitlement.
5. Use manual paid pilots before webhook automation.
6. Build Stripe Checkout/webhooks only after at least one customer wants the workflow.
