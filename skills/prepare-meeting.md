---
skill_id: prepare-meeting
name: Prepare Meeting
version: 0.1.0
status: draft
owner: Laurelin Technologies
allowed_sources:
  - demo
  - approved-local
approval_required_for_external_actions: true
---

# Prepare Meeting

## Goal

Prepare a sourced briefing for an upcoming meeting.

## Steps

1. Identify meeting participants.
2. Retrieve prior interactions.
3. Retrieve open commitments.
4. Retrieve relevant projects or decisions.
5. List likely questions or risks.
6. Suggest agenda.
7. Suggest follow-up actions.

## Demo data contract

The v0 synthetic demo stores meeting prep records in `examples/demo-data/demo-brain.json` under `meeting_preps`.

Each record should include:

- `meeting_id` matching a calendar artefact;
- `participants`;
- `objective`;
- `suggested_agenda`;
- `likely_questions`;
- `source_ids` for every important claim.

## Output

- meeting summary;
- participant context;
- open loops;
- suggested agenda;
- questions to ask;
- source citations.

## Safety

Do not read real calendars or notes for v0. Use synthetic demo data unless an approved local source and explicit indexing policy exist. Do not send messages, schedule meetings, or write to external tools without approval.
