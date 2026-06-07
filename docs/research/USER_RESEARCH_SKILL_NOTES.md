# User Research Skill Notes

Source reviewed: https://github.com/cookiy-ai/user-research-skill
Reviewed on: 2026-06-07

## What it is

Cookiy's `user-research-skill` is an AI-agent skill for user research workflows.

Repository metadata observed on 2026-06-07:

- Repo: `cookiy-ai/user-research-skill`
- Default branch: `main`
- License: MIT
- Description: Cookiy AI Skill for AI agents including Claude, Codex, Cursor, and OpenClaw.

## Capabilities relevant to LaurelinOS

The skill supports:

- research planning;
- screening questionnaires;
- discussion/interview guides;
- transcript and note synthesis;
- qualitative interview studies;
- quantitative surveys;
- participant recruitment;
- AI-moderated interviews;
- real or synthetic participants through Cookiy AI.

## Install/use notes from the repo

The README lists install paths for:

- Claude Cowork / Code Desktop plugin marketplace;
- Claude Chat Desktop skill zip;
- Claude Code terminal plugin commands;
- Codex / Cursor / OpenClaw / other agents via `npx cookiy-ai` or manual skill installation.

The skill name in `SKILL.md` is:

```text
user-research-cookiy
```

## How LaurelinOS should use it

Use this skill for customer discovery and pilot validation, not as part of the LaurelinOS runtime.

Recommended first research question:

```text
Do founders with active investor/customer workflows feel enough pain from dropped follow-ups and meeting prep to pay $199/mo plus setup for a local-first AI chief of staff?
```

Recommended target participants:

```text
8 to 12 founders/operators
pre-seed to Series A
5+ external meetings per week
already using Claude, Codex, Cursor, OpenClaw, Hermes, or similar tools
has customer/investor follow-up pressure
```

Suggested interview prompts:

1. Tell me about the last time you dropped or nearly dropped an important follow-up.
2. What system were you using when that happened?
3. What did it cost you?
4. How do you prepare for investor/customer meetings now?
5. What would you trust an AI agent to read? What would you not trust it to read?
6. If this produced a cited daily brief and open-loop list locally, what would make it worth paying for?
7. Would you pay $500 setup + $199/month for a pilot if it worked on one real workflow?
8. Who else on your team would need to approve this?

Pass/fail signal:

```text
Pass if 3+ people ask to try it with their own workflow or agree to a paid/manual pilot.
Fail if they only say it is interesting but will not schedule setup, provide sample data, or pay.
```

## Boundary

Do not copy the Cookiy skill into LaurelinOS without reviewing its license and integration implications. Link to it and use it as an external research workflow.
