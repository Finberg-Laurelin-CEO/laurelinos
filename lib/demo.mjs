import fs from 'node:fs';
import path from 'node:path';

export function loadDemoBrain(repoRoot) {
  const demoPath = path.join(repoRoot, 'examples', 'demo-data', 'demo-brain.json');
  return JSON.parse(fs.readFileSync(demoPath, 'utf8'));
}

export function buildDailyBrief(brain) {
  const openCommitments = brain.commitments.filter((item) => item.status === 'open');
  return {
    organisation: brain.organisation.name,
    generatedAt: new Date().toISOString(),
    topPriorities: openCommitments
      .filter((item) => item.severity === 'high')
      .map((item) => ({
        description: item.description,
        owner: item.owner,
        dueAt: item.due_at,
        sourceId: item.source_id,
        recommendedAction: item.recommended_action
      })),
    changesSinceLastBrief: brain.daily_changes,
    upcomingMeetings: brain.artefacts
      .filter((item) => item.type === 'calendar_event')
      .map((item) => ({
        title: item.title,
        date: item.date,
        summary: item.summary,
        sourceId: item.id
      })),
    approvalRequired: true
  };
}

export function detectOpenLoops(brain) {
  return brain.commitments
    .filter((item) => item.status === 'open')
    .map((item) => ({
      id: item.id,
      owner: item.owner,
      counterparty: item.counterparty,
      commitment: item.description,
      createdAt: item.created_at,
      dueAt: item.due_at,
      severity: item.severity,
      sourceId: item.source_id,
      recommendedAction: item.recommended_action,
      approvalRequiredBeforeExternalAction: true
    }));
}
