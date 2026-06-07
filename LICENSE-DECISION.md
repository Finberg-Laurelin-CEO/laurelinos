# Licence Decision

## Current decision

LaurelinOS is no longer MIT-licensed going forward.

The repository now uses a proprietary source-available evaluation licence in `LICENSE` and `package.json` is marked:

```json
{
  "private": true,
  "license": "UNLICENSED"
}
```

This is intended to:

- prevent third parties from freely copying, redistributing, repackaging, hosting, or selling LaurelinOS;
- preserve Laurelin's ability to sell FounderOS pilots, managed setup, workflow packs, and future hosted entitlement/provisioning;
- still allow a prospect to view and run an unmodified local copy for evaluation when appropriate.

## Important caveat

A licence change applies going forward. It does not retroactively revoke rights that may have been validly granted for earlier versions under a previous licence.

## Commercial direction

Commercial use, production use, redistribution, hosted/managed services, and paid customer deployments require a separate written agreement with Laurelin.

## Follow-up before major launch

Have an attorney review the licence before broad external promotion, npm publication, paid pilots at scale, or enterprise sales.
