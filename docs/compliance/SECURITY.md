# Security Policy

## Supported stage

LaurelinOS is currently an early local-first MVP.

## Reporting security issues

Until a formal security email is created, report security issues privately to the repository owner.

Do not open public GitHub issues containing secrets, exploit details, customer content, or private infrastructure details.

## Secrets policy

Never commit:

- API keys;
- OAuth credentials;
- Stripe secret keys;
- webhook signing secrets;
- SSH keys;
- customer exports;
- private Obsidian vault contents;
- production database credentials.

## Public repo data policy

Allowed:

- synthetic demo data;
- architecture docs;
- empty config templates;
- setup instructions.

Disallowed:

- real customer data;
- investor notes;
- bank details;
- payment data;
- private machine inventories;
- live `.env` files.

## External actions

External actions must remain approval-gated by default.

Examples:

- send email;
- schedule meeting;
- update CRM;
- create GitHub issue;
- provision hosted tenant;
- modify Stripe subscription;
- modify DNS;
- index a new source.
