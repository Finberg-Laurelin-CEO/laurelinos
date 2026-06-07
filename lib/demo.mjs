import fs from 'node:fs';
import path from 'node:path';

export function loadDemoBrain(repoRoot) {
  const demoPath = path.join(repoRoot, 'examples', 'demo-data', 'demo-brain.json');
  return JSON.parse(fs.readFileSync(demoPath, 'utf8'));
}

function sourceById(brain) {
  return new Map(brain.artefacts.map((item) => [item.id, item]));
}

function daysBetween(startDate, endDate) {
  const start = Date.parse(`${startDate}T00:00:00Z`);
  const end = Date.parse(`${endDate}T00:00:00Z`);
  return Math.max(0, Math.round((end - start) / 86_400_000));
}

function enrichCommitment(item, sources, currentDate) {
  const source = sources.get(item.source_id);
  return {
    id: item.id,
    description: item.description,
    owner: item.owner,
    counterparty: item.counterparty,
    counterpartyCompany: item.counterparty_company,
    createdAt: item.created_at,
    dueAt: item.due_at,
    daysOpen: daysBetween(item.created_at, currentDate),
    severity: item.severity,
    nextStepType: item.next_step_type,
    sourceId: item.source_id,
    sourceTitle: source?.title ?? item.source_id,
    recommendedAction: item.recommended_action,
    approvalRequiredBeforeExternalAction: true
  };
}

export function buildDailyBrief(brain) {
  const currentDate = brain.demo_current_date;
  const sources = sourceById(brain);
  const openCommitments = brain.commitments
    .filter((item) => item.status === 'open')
    .map((item) => enrichCommitment(item, sources, currentDate));

  return {
    organisation: brain.organisation.name,
    generatedAt: new Date().toISOString(),
    demoCurrentDate: currentDate,
    operatingContext: brain.operating_context,
    topPriorities: openCommitments.filter((item) => item.severity === 'high'),
    openCommitments,
    changesSinceLastBrief: brain.daily_changes,
    upcomingMeetings: brain.artefacts
      .filter((item) => item.type === 'calendar_event')
      .map((item) => ({
        title: item.title,
        date: item.date,
        summary: item.summary,
        sourceId: item.id,
        prep: brain.meeting_preps.find((prep) => prep.meeting_id === item.id) ?? null
      })),
    meetingPrep: brain.meeting_preps,
    approvalRequired: true,
    sourceIds: Array.from(new Set(openCommitments.flatMap((item) => [item.sourceId])))
  };
}

export function detectOpenLoops(brain) {
  const sources = sourceById(brain);
  const currentDate = brain.demo_current_date;
  return brain.commitments
    .filter((item) => item.status === 'open')
    .map((item) => enrichCommitment(item, sources, currentDate));
}
