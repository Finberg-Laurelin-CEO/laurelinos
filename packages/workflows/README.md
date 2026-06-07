# packages/workflows

Package boundary for LaurelinOS founder workflows.

The zero-dependency v0 implementation currently lives in `lib/demo.mjs` and `lib/format.mjs` so the CLI is runnable without a build step. When the TypeScript package split happens, move these workflow contracts here first:

- `buildDailyBrief(brain)` — turns approved/synthetic artefacts into founder operating context, top priorities, open commitments, changes, and meeting prep.
- `detectOpenLoops(brain)` — returns unresolved commitments with owner, counterparty, age, due date, source title, recommended action, and approval requirement.
- `prepareMeeting(brain, meetingId)` later — should use the existing synthetic `meeting_preps` records before reading real approved sources.

Safety rules:

- demo workflows use synthetic local data only;
- source IDs must remain visible in outputs;
- suggested external actions remain approval-gated;
- real user folders must not be indexed by these workflows without explicit source approval.
