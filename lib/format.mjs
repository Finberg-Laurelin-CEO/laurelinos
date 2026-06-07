export function printJson(value) {
  console.log(JSON.stringify(value, null, 2));
}

export function printBrief(brief) {
  console.log(`# Daily Founder Brief — ${brief.organisation}`);
  console.log('');
  console.log(`Generated: ${brief.generatedAt}`);
  console.log('');
  console.log('## Top priorities');
  for (const item of brief.topPriorities) {
    console.log(`- ${item.description}`);
    console.log(`  - Owner: ${item.owner}`);
    console.log(`  - Due: ${item.dueAt}`);
    console.log(`  - Source: ${item.sourceId}`);
    console.log(`  - Recommended action: ${item.recommendedAction}`);
  }
  console.log('');
  console.log('## Changes since last brief');
  for (const change of brief.changesSinceLastBrief) console.log(`- ${change}`);
  console.log('');
  console.log('## Upcoming meetings');
  for (const meeting of brief.upcomingMeetings) {
    console.log(`- ${meeting.date}: ${meeting.title}`);
    console.log(`  - ${meeting.summary}`);
    console.log(`  - Source: ${meeting.sourceId}`);
  }
  console.log('');
  console.log('External actions require approval: yes');
}

export function printOpenLoops(loops) {
  console.log('# Open Loops');
  console.log('');
  for (const loop of loops) {
    console.log(`- [${loop.severity}] ${loop.commitment}`);
    console.log(`  - Owner: ${loop.owner}`);
    console.log(`  - Counterparty: ${loop.counterparty}`);
    console.log(`  - Due: ${loop.dueAt}`);
    console.log(`  - Source: ${loop.sourceId}`);
    console.log(`  - Recommended action: ${loop.recommendedAction}`);
    console.log('  - Approval required before external action: yes');
  }
}
