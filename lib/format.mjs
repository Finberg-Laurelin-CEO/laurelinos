export function printJson(value) {
  console.log(JSON.stringify(value, null, 2));
}

function printSourceList(sourceIds) {
  console.log(`  - Sources: ${sourceIds.join(', ')}`);
}

function formatDaysOpen(daysOpen) {
  return `${daysOpen} ${daysOpen === 1 ? 'day' : 'days'} open`;
}

export function printBrief(brief) {
  console.log(`# Daily Founder Brief — ${brief.organisation}`);
  console.log('');
  console.log(`Generated: ${brief.generatedAt}`);
  console.log(`Demo date: ${brief.demoCurrentDate}`);
  console.log('');
  console.log('## Founder operating context');
  for (const item of brief.operatingContext) {
    console.log(`- ${item.area}: ${item.status}`);
    printSourceList(item.source_ids);
  }
  console.log('');
  console.log('## Top priorities');
  for (const item of brief.topPriorities) {
    console.log(`- ${item.description}`);
    console.log(`  - Owner: ${item.owner}`);
    console.log(`  - Counterparty: ${item.counterparty} (${item.counterpartyCompany})`);
    console.log(`  - Due: ${item.dueAt}`);
    console.log(`  - Source: ${item.sourceId} — ${item.sourceTitle}`);
    console.log(`  - Recommended action: ${item.recommendedAction}`);
    console.log('  - Approval required before external action: yes');
  }
  console.log('');
  console.log('## Open commitments');
  for (const item of brief.openCommitments) {
    console.log(`- [${item.severity}] ${item.description}`);
    console.log(`  - Owner: ${item.owner}`);
    console.log(`  - Age: ${formatDaysOpen(item.daysOpen)}`);
    console.log(`  - Due: ${item.dueAt}`);
    console.log(`  - Source: ${item.sourceId}`);
  }
  console.log('');
  console.log('## Changes since last brief');
  for (const change of brief.changesSinceLastBrief) console.log(`- ${change}`);
  console.log('');
  console.log('## Upcoming meetings and prep');
  for (const meeting of brief.upcomingMeetings) {
    console.log(`- ${meeting.date}: ${meeting.title}`);
    console.log(`  - ${meeting.summary}`);
    console.log(`  - Source: ${meeting.sourceId}`);
    if (meeting.prep) {
      console.log(`  - Objective: ${meeting.prep.objective}`);
      console.log('  - Suggested agenda:');
      for (const agendaItem of meeting.prep.suggested_agenda) console.log(`    - ${agendaItem}`);
      console.log('  - Likely questions:');
      for (const question of meeting.prep.likely_questions) console.log(`    - ${question}`);
      printSourceList(meeting.prep.source_ids);
    }
  }
  console.log('');
  console.log('External actions require approval: yes');
}

export function printOpenLoops(loops) {
  console.log('# Open Loops');
  console.log('');
  for (const loop of loops) {
    console.log(`- [${loop.severity}] ${loop.commitment ?? loop.description}`);
    console.log(`  - Owner: ${loop.owner}`);
    console.log(`  - Counterparty: ${loop.counterparty} (${loop.counterpartyCompany})`);
    console.log(`  - Age: ${formatDaysOpen(loop.daysOpen)}`);
    console.log(`  - Due: ${loop.dueAt}`);
    console.log(`  - Source: ${loop.sourceId} — ${loop.sourceTitle}`);
    console.log(`  - Next-step type: ${loop.nextStepType}`);
    console.log(`  - Recommended action: ${loop.recommendedAction}`);
    console.log('  - Approval required before external action: yes');
  }
}
