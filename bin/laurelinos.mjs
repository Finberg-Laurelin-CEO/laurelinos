#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import {
  appendAuditEvent,
  ensureLocalConfig,
  getConfigDir,
  readAuditEvents,
  readSources,
  writeSources
} from '../lib/config.mjs';
import { buildDailyBrief, detectOpenLoops, loadDemoBrain } from '../lib/demo.mjs';
import { printBrief, printJson, printOpenLoops } from '../lib/format.mjs';
import { activateLocalLicense, readLicenseStatus } from '../lib/license.mjs';
import { handleMcpLine } from '../lib/mcp.mjs';
import { buildAgentSetupPlan, verifyAgenticSetup } from '../lib/setup.mjs';

const repoRoot = path.resolve(new URL(import.meta.url).pathname, '..', '..');
const args = process.argv.slice(2);

function usage(exitCode = 0) {
  console.log(`LaurelinOS local-first runtime\n\nUsage:\n  laurelinos doctor\n  laurelinos init --local\n  laurelinos sources list\n  laurelinos sources add <name> <path>\n  laurelinos sources show <name>\n  laurelinos sources approve <name>\n  laurelinos audit log\n  laurelinos audit show <id>\n  laurelinos license status\n  laurelinos license activate <token>\n  laurelinos setup agent <generic|claude|codex|cursor|hermes|openclaw> [--json]\n  laurelinos setup verify [--json]\n  laurelinos brain status\n  laurelinos brief --demo [--json]\n  laurelinos open-loops --demo [--json]\n  laurelinos mcp serve\n`);
  process.exit(exitCode);
}

function hasFlag(flag) {
  return args.includes(flag);
}

function commandExists(command, versionArgs = ['--version']) {
  const result = spawnSync(command, versionArgs, { encoding: 'utf8' });
  return {
    command,
    available: result.status === 0,
    version: result.status === 0 ? String(result.stdout || result.stderr).trim().split('\n')[0] : null
  };
}

function findSourceOrExit(data, name) {
  const source = data.sources.find((candidate) => candidate.name === name);
  if (!source) {
    console.error(`Unknown source: ${name}`);
    process.exit(1);
  }
  return source;
}

function runDoctor() {
  const configDir = getConfigDir();
  const tools = [
    commandExists('git'),
    commandExists('gh', ['--version']),
    commandExists('node', ['--version']),
    commandExists('npm', ['--version']),
    commandExists('gbrain', ['--version']),
    commandExists('claude', ['--version']),
    commandExists('codex', ['--version'])
  ];

  const report = {
    project: 'LaurelinOS',
    mode: 'local-first MVP',
    repo: 'https://github.com/Finberg-Laurelin-CEO/laurelinos',
    platform: {
      os: os.platform(),
      release: os.release(),
      arch: os.arch(),
      hostname: os.hostname(),
      node: process.version
    },
    paths: {
      cwd: process.cwd(),
      configDir,
      repoRoot
    },
    tools,
    warnings: [
      'GBrain, Claude, and Codex are optional for the synthetic demo.',
      'Do not index real folders until a source is explicitly approved.',
      'External actions must remain approval-gated.'
    ]
  };
  printJson(report);
}

function runInit() {
  if (!hasFlag('--local')) {
    console.error('Use `laurelinos init --local` for the v0 MVP.');
    process.exit(1);
  }
  const result = ensureLocalConfig();
  console.log('Initialised LaurelinOS local config.');
  console.log(`Config directory: ${result.configDir}`);
  console.log('No secrets were created or stored.');
}

function runSources() {
  const sub = args[1];
  if (sub === 'list') {
    const data = readSources();
    if (data.sources.length === 0) {
      console.log('No sources configured. Add one with `laurelinos sources add <name> <path>`.');
      return;
    }
    printJson(data);
    return;
  }
  if (sub === 'show') {
    const name = args[2];
    if (!name) {
      console.error('Usage: laurelinos sources show <name>');
      process.exit(1);
    }
    const data = readSources();
    printJson(findSourceOrExit(data, name));
    return;
  }
  if (sub === 'add') {
    const name = args[2];
    const sourcePath = args[3];
    if (!name || !sourcePath) {
      console.error('Usage: laurelinos sources add <name> <path>');
      process.exit(1);
    }
    const resolved = path.resolve(sourcePath);
    if (!fs.existsSync(resolved)) {
      console.error(`Path does not exist: ${resolved}`);
      process.exit(1);
    }
    const data = readSources();
    const existingIndex = data.sources.findIndex((source) => source.name === name);
    const record = {
      name,
      path: resolved,
      addedAt: new Date().toISOString(),
      approvedForIndexing: false,
      approvalStatus: 'candidate',
      note: 'Added as a source candidate. Indexing is disabled until explicitly approved.'
    };
    if (existingIndex >= 0) data.sources[existingIndex] = record;
    else data.sources.push(record);
    writeSources(data);
    const event = appendAuditEvent('source_candidate_added', {
      sourceName: name,
      path: resolved,
      approvedForIndexing: false
    });
    console.log(`Added source candidate: ${name}`);
    console.log(`Path: ${resolved}`);
    console.log(`Audit event: ${event.id}`);
    console.log('Indexing remains disabled until explicitly approved.');
    return;
  }
  if (sub === 'approve') {
    const name = args[2];
    if (!name) {
      console.error('Usage: laurelinos sources approve <name>');
      process.exit(1);
    }
    const data = readSources();
    const source = findSourceOrExit(data, name);
    if (source.approvedForIndexing) {
      console.log(`Source already approved: ${name}`);
      console.log(`Approval event: ${source.approvalEventId ?? 'unknown'}`);
      return;
    }
    const event = appendAuditEvent('source_approved_for_indexing', {
      sourceName: source.name,
      path: source.path,
      previousApprovalStatus: source.approvalStatus ?? 'candidate',
      approvedForIndexing: true
    });
    source.approvedForIndexing = true;
    source.approvalStatus = 'approved';
    source.approvedAt = event.createdAt;
    source.approvedBy = event.actor;
    source.approvalEventId = event.id;
    source.note = 'Approved for future indexing by explicit local command. No indexing was performed by this command.';
    writeSources(data);
    console.log(`Approved source for future indexing: ${name}`);
    console.log(`Path: ${source.path}`);
    console.log(`Audit event: ${event.id}`);
    console.log('No indexing was performed.');
    return;
  }
  usage(1);
}

function runAudit() {
  const sub = args[1];
  if (sub === 'log') {
    printJson({ events: readAuditEvents() });
    return;
  }
  if (sub === 'show') {
    const id = args[2];
    if (!id) {
      console.error('Usage: laurelinos audit show <id>');
      process.exit(1);
    }
    const event = readAuditEvents().find((candidate) => candidate.id === id);
    if (!event) {
      console.error(`Unknown audit event: ${id}`);
      process.exit(1);
    }
    printJson(event);
    return;
  }
  usage(1);
}

function runLicense() {
  const sub = args[1];
  if (sub === 'status') {
    printJson(readLicenseStatus());
    return;
  }
  if (sub === 'activate') {
    const token = args[2];
    if (!token) {
      console.error('Usage: laurelinos license activate <token>');
      process.exit(1);
    }
    try {
      const result = activateLocalLicense(token);
      console.log('Activated local FounderOS license record.');
      console.log(`License path: ${result.licensePath}`);
      console.log(`Audit event: ${result.auditEvent.id}`);
      console.log('Raw activation token was not stored.');
      console.log('No Stripe or hosted entitlement service was contacted.');
    } catch (error) {
      console.error(error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
    return;
  }
  usage(1);
}

function printSetupPlan(plan) {
  console.log(`# LaurelinOS agentic setup plan: ${plan.targetLabel}`);
  console.log('');
  console.log(plan.purpose);
  console.log('');
  console.log('## MCP server');
  console.log(`- Name: ${plan.mcpServer.name}`);
  console.log(`- Transport: ${plan.mcpServer.transport}`);
  console.log(`- Command: ${plan.mcpServer.command}`);
  console.log(`- Args: ${plan.mcpServer.args.join(' ')}`);
  console.log('');
  console.log('## Agent prompt');
  console.log(plan.agentPrompt);
  console.log('');
  console.log('## Safety constraints');
  for (const constraint of plan.safetyConstraints) console.log(`- ${constraint}`);
  console.log('');
  console.log('## Smoke test');
  console.log(plan.smokeTest.command);
}

function runSetup() {
  const sub = args[1];
  if (sub === 'agent') {
    const target = args[2] ?? 'generic';
    try {
      const plan = buildAgentSetupPlan(target, repoRoot);
      if (hasFlag('--json')) printJson(plan);
      else printSetupPlan(plan);
    } catch (error) {
      console.error(error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
    return;
  }
  if (sub === 'verify') {
    const result = verifyAgenticSetup(repoRoot);
    if (hasFlag('--json')) printJson(result);
    else {
      console.log('# LaurelinOS agentic setup verification');
      console.log(`Ready: ${result.ready ? 'yes' : 'no'}`);
      console.log(`CLI path: ${result.cliPath}`);
      console.log(`Node: ${result.nodeVersion}`);
      for (const check of result.checks) console.log(`- ${check.name}: ${check.ok ? 'ok' : 'failed'} (${check.detail})`);
      console.log(result.reminder);
    }
    return;
  }
  usage(1);
}

function runBrain() {
  const sub = args[1];
  if (sub !== 'status') usage(1);
  const config = ensureLocalConfig();
  const sources = readSources();
  const gbrain = commandExists('gbrain', ['--version']);
  const demoPath = path.join(repoRoot, 'examples', 'demo-data', 'demo-brain.json');
  printJson({
    status: 'local runtime ready',
    configDir: config.configDir,
    sourceCount: sources.sources.length,
    approvedSourceCount: sources.sources.filter((source) => source.approvedForIndexing).length,
    auditLogAvailable: fs.existsSync(config.auditPath),
    gbrain,
    demoDataAvailable: fs.existsSync(demoPath),
    externalActionsRequireApproval: true,
    notes: [
      'This command does not initialise or mutate GBrain.',
      'Use synthetic demo workflows until real sources are explicitly approved.'
    ]
  });
}

function runBrief() {
  if (!hasFlag('--demo')) {
    console.error('The v0 brief command only supports `--demo`.');
    process.exit(1);
  }
  const brain = loadDemoBrain(repoRoot);
  const brief = buildDailyBrief(brain);
  if (hasFlag('--json')) printJson(brief);
  else printBrief(brief);
}

function runOpenLoops() {
  if (!hasFlag('--demo')) {
    console.error('The v0 open-loops command only supports `--demo`.');
    process.exit(1);
  }
  const brain = loadDemoBrain(repoRoot);
  const loops = detectOpenLoops(brain);
  if (hasFlag('--json')) printJson({ openLoops: loops });
  else printOpenLoops(loops);
}

function runMcp() {
  const sub = args[1];
  if (sub !== 'serve') usage(1);
  console.error('LaurelinOS MCP stdio server started. Synthetic read-only tools only.');
  process.stdin.setEncoding('utf8');
  let buffer = '';
  process.stdin.on('data', (chunk) => {
    buffer += chunk;
    let index;
    while ((index = buffer.indexOf('\n')) >= 0) {
      const line = buffer.slice(0, index).trim();
      buffer = buffer.slice(index + 1);
      if (!line) continue;
      const response = handleMcpLine(line, { repoRoot });
      if (response) process.stdout.write(JSON.stringify(response) + '\n');
    }
  });
}

const command = args[0];
if (!command || command === '--help' || command === '-h') usage(0);

switch (command) {
  case 'doctor':
    runDoctor();
    break;
  case 'init':
    runInit();
    break;
  case 'sources':
    runSources();
    break;
  case 'audit':
    runAudit();
    break;
  case 'license':
    runLicense();
    break;
  case 'setup':
    runSetup();
    break;
  case 'brain':
    runBrain();
    break;
  case 'brief':
    runBrief();
    break;
  case 'open-loops':
    runOpenLoops();
    break;
  case 'mcp':
    runMcp();
    break;
  default:
    usage(1);
}
