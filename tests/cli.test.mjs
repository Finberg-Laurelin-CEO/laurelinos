import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';

const repoRoot = path.resolve(import.meta.dirname, '..');
const cli = path.join(repoRoot, 'bin', 'laurelinos.mjs');

function run(args, options = {}) {
  return execFileSync(process.execPath, [cli, ...args], {
    encoding: 'utf8',
    cwd: repoRoot,
    ...options
  });
}

function makeTempWorkspace() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'laurelinos-test-'));
}

function secretLikePattern() {
  const prefixes = ['s' + 'k-', 'g' + 'hp_', 'w' + 'hsec_'];
  return new RegExp(prefixes.map((prefix) => `${prefix}[A-Za-z0-9]`).join('|'));
}

test('doctor returns project metadata', () => {
  const output = run(['doctor']);
  const parsed = JSON.parse(output);
  assert.equal(parsed.project, 'LaurelinOS');
  assert.equal(parsed.repo, 'https://github.com/Finberg-Laurelin-CEO/laurelinos');
});

test('brief demo includes daily founder brief', () => {
  const output = run(['brief', '--demo']);
  assert.match(output, /Daily Founder Brief/);
  assert.match(output, /Northstar/);
  assert.match(output, /Founder operating context/);
  assert.match(output, /Open commitments/);
  assert.match(output, /Upcoming meetings and prep/);
});

test('brief demo JSON includes cited operating context and meeting prep', () => {
  const output = run(['brief', '--demo', '--json']);
  const parsed = JSON.parse(output);
  assert.equal(parsed.organisation, 'ArcLight Labs');
  assert.equal(parsed.demoCurrentDate, '2026-06-07');
  assert.equal(parsed.topPriorities.length, 2);
  assert.equal(parsed.openCommitments.length, 4);
  assert.equal(parsed.operatingContext.length, 4);
  assert.equal(parsed.meetingPrep.length, 2);
  assert.equal(parsed.approvalRequired, true);
  assert.ok(parsed.sourceIds.includes('email_2026_06_03_northstar_deck'));
  assert.ok(parsed.upcomingMeetings.some((meeting) => meeting.prep?.objective.includes('source-scoped')));
  assert.ok(parsed.openCommitments.every((commitment) => commitment.sourceId && commitment.recommendedAction));
});

test('open loops demo includes approval gate', () => {
  const output = run(['open-loops', '--demo']);
  assert.match(output, /Open Loops/);
  assert.match(output, /Approval required/);
  assert.match(output, /days open/);
  assert.match(output, /Beacon Health Systems/);
});

test('open loops JSON includes source titles, age, and counterparty company', () => {
  const output = run(['open-loops', '--demo', '--json']);
  const parsed = JSON.parse(output);
  assert.equal(parsed.openLoops.length, 4);
  const atlasLoop = parsed.openLoops.find((loop) => loop.counterpartyCompany === 'Atlas Manufacturing');
  assert.equal(atlasLoop.daysOpen, 3);
  assert.equal(atlasLoop.sourceTitle, 'Atlas Manufacturing pilot call');
  assert.equal(atlasLoop.approvalRequiredBeforeExternalAction, true);
  assert.ok(parsed.openLoops.every((loop) => loop.nextStepType && loop.sourceId));
});

test('init local creates config without secrets', () => {
  const tmp = makeTempWorkspace();
  const output = run(['init', '--local'], { cwd: tmp });
  assert.match(output, /Initialised/);
  const configPath = path.join(tmp, '.laurelinos', 'config.json');
  const sourcesPath = path.join(tmp, '.laurelinos', 'sources.json');
  assert.equal(fs.existsSync(configPath), true);
  assert.equal(fs.existsSync(sourcesPath), true);
  const config = fs.readFileSync(configPath, 'utf8');
  assert.doesNotMatch(config, secretLikePattern());
});

test('sources list starts empty in a fresh local workspace', () => {
  const tmp = makeTempWorkspace();
  const output = run(['sources', 'list'], { cwd: tmp });
  assert.match(output, /No sources configured/);
  assert.equal(fs.existsSync(path.join(tmp, '.laurelinos', 'sources.json')), true);
});

test('sources add registers a local path without indexing source contents', () => {
  const tmp = makeTempWorkspace();
  const sourceDir = path.join(tmp, 'private-source');
  fs.mkdirSync(sourceDir);
  fs.writeFileSync(path.join(sourceDir, 'do-not-index.md'), 'PRIVATE_SYNTHETIC_TOKEN=not-a-secret-token\n');

  const output = run(['sources', 'add', 'demo', sourceDir], { cwd: tmp });
  assert.match(output, /Added source candidate: demo/);
  assert.match(output, /Indexing remains disabled/);

  const sourcesPath = path.join(tmp, '.laurelinos', 'sources.json');
  const sources = JSON.parse(fs.readFileSync(sourcesPath, 'utf8'));
  assert.equal(sources.sources.length, 1);
  assert.equal(sources.sources[0].name, 'demo');
  assert.equal(sources.sources[0].path, sourceDir);
  assert.equal(sources.sources[0].approvedForIndexing, false);
  assert.doesNotMatch(JSON.stringify(sources), /PRIVATE_SYNTHETIC_TOKEN|not-a-secret-token/);

  const listOutput = run(['sources', 'list'], { cwd: tmp });
  const listed = JSON.parse(listOutput);
  assert.equal(listed.sources[0].name, 'demo');
});

test('sources approve records explicit approval and audit events without indexing contents', () => {
  const tmp = makeTempWorkspace();
  const sourceDir = path.join(tmp, 'approved-source');
  fs.mkdirSync(sourceDir);
  fs.writeFileSync(path.join(sourceDir, 'private.md'), 'PRIVATE_APPROVAL_TOKEN=never-indexed\n');

  run(['sources', 'add', 'approved', sourceDir], { cwd: tmp });
  const approveOutput = run(['sources', 'approve', 'approved'], { cwd: tmp });
  assert.match(approveOutput, /Approved source for future indexing: approved/);
  assert.match(approveOutput, /No indexing was performed/);

  const source = JSON.parse(run(['sources', 'show', 'approved'], { cwd: tmp }));
  assert.equal(source.approvedForIndexing, true);
  assert.equal(source.approvalStatus, 'approved');
  assert.equal(source.approvedBy, 'local-user');
  assert.match(source.approvalEventId, /^[0-9a-f-]{36}$/);
  assert.doesNotMatch(JSON.stringify(source), /PRIVATE_APPROVAL_TOKEN|never-indexed/);

  const audit = JSON.parse(run(['audit', 'log'], { cwd: tmp }));
  assert.equal(audit.events.length, 2);
  assert.equal(audit.events[0].type, 'source_candidate_added');
  assert.equal(audit.events[1].type, 'source_approved_for_indexing');
  assert.equal(audit.events[1].details.sourceName, 'approved');
  assert.equal(audit.events[1].details.approvedForIndexing, true);
  assert.doesNotMatch(JSON.stringify(audit), /PRIVATE_APPROVAL_TOKEN|never-indexed/);

  const shownEvent = JSON.parse(run(['audit', 'show', source.approvalEventId], { cwd: tmp }));
  assert.equal(shownEvent.id, source.approvalEventId);
});

test('license status starts in demo mode and activation stores only a token hash', () => {
  const tmp = makeTempWorkspace();
  const initialStatus = JSON.parse(run(['license', 'status'], { cwd: tmp }));
  assert.equal(initialStatus.status, 'demo');
  assert.equal(initialStatus.paidFeaturesActive, false);
  assert.equal(initialStatus.licenseRequiredForDemo, false);

  const token = 'laurelinos_local_test_token_1234567890';
  const activateOutput = run(['license', 'activate', token], { cwd: tmp });
  assert.match(activateOutput, /Activated local FounderOS license record/);
  assert.match(activateOutput, /Raw activation token was not stored/);
  assert.doesNotMatch(activateOutput, new RegExp(token));

  const licensePath = path.join(tmp, '.laurelinos', 'license.json');
  const licenseFile = fs.readFileSync(licensePath, 'utf8');
  assert.doesNotMatch(licenseFile, new RegExp(token));
  const license = JSON.parse(licenseFile);
  assert.equal(license.status, 'local-activated');
  assert.equal(license.product, 'FounderOS');
  assert.equal(license.plan, 'founderos-pilot');
  assert.match(license.tokenHash, /^[0-9a-f]{64}$/);

  const status = JSON.parse(run(['license', 'status'], { cwd: tmp }));
  assert.equal(status.status, 'local-activated');
  assert.equal(status.paidFeaturesActive, true);
  assert.ok(status.features.includes('mcp'));

  const audit = JSON.parse(run(['audit', 'log'], { cwd: tmp }));
  assert.equal(audit.events.length, 1);
  assert.equal(audit.events[0].type, 'license_activated_local');
  assert.doesNotMatch(JSON.stringify(audit), new RegExp(token));
});

test('brain status reports local runtime state through synthetic-safe status', () => {
  const tmp = makeTempWorkspace();
  const output = run(['brain', 'status'], { cwd: tmp });
  const parsed = JSON.parse(output);
  assert.equal(parsed.status, 'local runtime ready');
  assert.equal(parsed.sourceCount, 0);
  assert.equal(parsed.approvedSourceCount, 0);
  assert.equal(parsed.auditLogAvailable, true);
  assert.equal(parsed.demoDataAvailable, true);
  assert.equal(parsed.externalActionsRequireApproval, true);
  assert.match(parsed.configDir, /\.laurelinos$/);
});
