# GitHub Setup for Existing Repo

Canonical repo:

```text
https://github.com/Finberg-Laurelin-CEO/laurelinos
```

The repo already exists. Do not create a second repo.

## Local setup

```bash
git clone https://github.com/Finberg-Laurelin-CEO/laurelinos.git
cd laurelinos
```

Copy this scaffold into the cloned folder, then run:

```bash
git status
git add .
git commit -m "Initial LaurelinOS local-first MVP scaffold"
git push -u origin main
```

## Verify

```bash
npm install
npm test
npm run check
```

## Superset

After the first commit is pushed, open the local repo in Superset.

Use isolated branches/workspaces for parallel agent work:

```text
feat/cli-doctor-init
feat/demo-workflows
feat/gbrain-adapter
feat/mcp-server
docs/laurelinos-dev
docs/pricing-stripe
```

Merge only after tests pass.
