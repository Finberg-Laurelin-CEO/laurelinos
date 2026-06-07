---
skill_id: open-loop-detection
name: Open Loop Detection
version: 0.1.0
status: draft
owner: Laurelin Technologies
allowed_sources:
  - demo
  - approved-local
approval_required_for_external_actions: true
---

# Open Loop Detection

## Goal

Find unresolved commitments, missing follow-ups, and stalled actions across approved company artefacts.

## Detect

- someone asked for something and no reply exists;
- meeting produced action item but no owner exists;
- investor/customer promised something but no follow-up exists;
- founder promised to send material but there is no evidence it was sent;
- project deadline was mentioned but no linked task exists.

## Output

For each open loop:

- entity/person;
- commitment;
- source;
- likely owner;
- due date or age;
- severity;
- recommended action;
- approval requirement.
