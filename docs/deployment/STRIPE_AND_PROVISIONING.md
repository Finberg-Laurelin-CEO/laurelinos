# Stripe and Provisioning Plan

## Current assumption

Laurelin already has a Stripe account and bank account.

LaurelinOS should not store raw credit-card data. Use Stripe-hosted checkout, Stripe Payment Links, or a hosted subscription flow. Store Stripe customer/subscription identifiers only.

The commercial model should start as subscription + entitlement/license, not API credits. See `docs/deployment/SUBSCRIPTION_AND_LICENSE_PLAN.md` for the current plan.

## MVP sequencing

Do not build Stripe before the local tool is useful.

Recommended order:

1. Local CLI works.
2. Synthetic demo workflows work.
3. MCP works locally.
4. Manual paid pilot is possible.
5. Customer receives install instructions and a license/activation credential.
6. Stripe Payment Link or Checkout link is created.
7. Webhook provisioning is added.
8. Agentic onboarding is added.

For early pilots, manual provisioning is acceptable: payment first, then Joseph sends the install instructions and activation credential. Automate only after the workflow is worth repeating.

## Subscription event loop later

```text
Customer pays through Stripe
    -> Stripe webhook fires
    -> provisioning job creates tenant record
    -> onboarding email is sent
    -> customer installs local runner
    -> customer connects Claude/Codex/API key
    -> customer authorises selected sources
    -> first brief is generated
    -> open loops are detected
    -> external actions remain approval-gated
```

## Minimum webhook events later

Handle at least:

```text
checkout.session.completed
customer.subscription.created
customer.subscription.updated
customer.subscription.deleted
invoice.paid
invoice.payment_failed
```

## Do not build yet

Do not implement live Stripe secrets in this public repo.
Do not put Stripe secret keys in `.env.example` except as empty placeholders.
Do not create customer deployments automatically without an approval/retry path.

## Agentic onboarding target

After payment, onboarding should be as automated as possible:

1. Ask customer to install local runner.
2. Verify environment with `laurelinos doctor`.
3. Guide customer through source selection.
4. Ask customer to connect Claude/Codex/API key.
5. Generate first synthetic/safe brief.
6. Ask for approval before touching real data.
7. Gradually enable real workflows.

The user should never be asked to surrender raw AI-provider credentials to Laurelin unless using an explicitly BYOK hosted mode.
