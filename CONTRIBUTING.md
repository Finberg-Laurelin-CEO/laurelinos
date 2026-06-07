# Contributing

LaurelinOS is in early MVP development.

## Before contributing

Read:

- `README.md`
- `AGENTS.md`
- `MVP_SPEC.md`
- `docs/compliance/SECURITY.md`

## Development

```bash
npm install
npm test
npm run check
```

## Data policy

Do not contribute real customer data, real Laurelin private data, secrets, credentials, or private Obsidian vault content.

Synthetic demo data is welcome.

## Pull requests

A good PR should:

- have a bounded scope;
- keep `npm run check` passing;
- update docs if behaviour changes;
- avoid secrets;
- preserve approval gates for external actions.
