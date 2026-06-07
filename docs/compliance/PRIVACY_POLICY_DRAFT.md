# Privacy Policy Draft

Status: draft for future website. Requires legal review before publication.

## Scope

This draft is intended for the future `laurelinos.dev` website and subscription onboarding flow.

## Plain-English position

LaurelinOS is designed to be local-first. Wherever possible, customer content, source indexing, and AI processing should run on the customer's machine, customer-controlled infrastructure, or customer-authorised model accounts.

LaurelinOS should not require customers to give Laurelin raw access to every file, email, or model-provider account.

## Data categories

### Account data

Examples:

- name;
- email address;
- organisation name;
- billing status;
- plan tier.

### Billing metadata

Examples:

- Stripe customer ID;
- Stripe subscription ID;
- subscription status;
- invoice status.

LaurelinOS must not store raw credit-card numbers.

### Customer content

Examples:

- notes;
- documents;
- emails;
- calendar metadata;
- GitHub issues;
- meeting transcripts;
- source registry records;
- generated briefs.

For the MVP, Customer Content should remain local unless the customer explicitly enables hosted or managed features.

### Usage and diagnostic data

Examples:

- CLI command used;
- error logs;
- version number;
- integration health;
- sync status;
- feature usage counts.

Do not collect content payloads by default.

## AI processing

Customer-selected models may process Customer Content when the customer configures Claude, Codex, OpenAI, Anthropic, Gemini, local models, or other providers.

The future website should explain that third-party model providers have their own terms and privacy policies.

## Retention

Local data remains on the customer's machine unless hosted/managed mode is enabled.

Hosted account and billing metadata should be retained only as long as necessary for account, billing, legal, tax, and security purposes.

## Deletion

Customers should be able to request deletion of hosted account data.

Local data can be deleted by removing the local `.laurelinos/` directory and any configured brain/database files.

## Security

LaurelinOS should use:

- least-privilege OAuth scopes;
- encrypted secrets storage where possible;
- approval gates for external actions;
- audit logs for hosted/managed workflows;
- no secrets in logs or Markdown.

## Publication note

Before publishing, adapt this into a formal privacy policy and include:

- company legal name;
- contact email;
- effective date;
- jurisdiction-specific rights language where needed;
- subprocessors;
- cookie/analytics details;
- data processing addendum path for business customers.
