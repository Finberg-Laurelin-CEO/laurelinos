#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { ensureLocalConfig, getConfigDir, readSources, writeSources } from '../lib/config.mjs';
import { buildDailyBrief, detectOpenLoops, loadDemoBrain } from '../lib/demo.mjs';
import { printBrief, printJson, printOpenLoops } from '../lib/format.mjs';

const repoRoot = path.resolve(new URL(import.meta.url).pathname, '..', '..');
const args = process.argv.slice(2);

function usage(exitCode = 0) {
  console.log(`LaurelinOS local-first runtime\n\nUsage:\n  laurelinos doctor\n  laurelinos init --local\n  laurelinos sources list\n  laurelinos sources add <name> <path>\n  laurelinos brain status\n  laurelinos brief --demo [--json]\n  laurelinos open-loops --demo [--json]\n  laurelinos mcp serve\n`);
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
      note: 'Added as a source candidate. Indexing is disabled until explicitly approved.'
    };
    if (existingIndex >= 0) data.sources[existingIndex] = record;
    else data.sources.push(record);
    writeSources(data);
    console.log(`Added source candidate: ${name}`);
    console.log(`Path: ${resolved}`);
    console.log('Indexing remains disabled until explicitly approved.');
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
      handleJsonRpcLine(line);
    }
  });
}

function rpcResult(id, result) {
  process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id, result }) + '\n');
}

function rpcError(id, code, message) {
  process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id, error: { code, message } }) + '\n');
}

function handleJsonRpcLine(line) {
  let message;
  try {
    message = JSON.parse(line);
  } catch {
    rpcError(null, -32700, 'Parse error');
    return;
  }
  const { id, method, params = {} } = message;
  try {
    if (method === 'initialize') {
      rpcResult(id, {
        protocolVersion: '2024-11-05',
        serverInfo: { name: 'laurelinos', version: '0.1.0-alpha.0' },
        capabilities: { tools: {} }
      });
      return;
    }
    if (method === 'tools/list') {
      rpcResult(id, {
        tools: [
          { name: 'get_status', description: 'Return local LaurelinOS runtime status.', inputSchema: { type: 'object', properties: {} } },
          { name: 'get_daily_brief', description: 'Return a synthetic daily founder brief.', inputSchema: { type: 'object', properties: {} } },
          { name: 'get_open_loops', description: 'Return synthetic open loops.', inputSchema: { type: 'object', properties: {} } }
        ]
      });
      return;
    }
    if (method === 'tools/call') {
      const brain = loadDemoBrain(repoRoot);
      if (params.name === 'get_status') {
        rpcResult(id, { content: [{ type: 'text', text: JSON.stringify({ status: 'ok', repo: 'Finberg-Laurelin-CEO/laurelinos' }, null, 2) }] });
        return;
      }
      if (params.name === 'get_daily_brief') {
        rpcResult(id, { content: [{ type: 'text', text: JSON.stringify(buildDailyBrief(brain), null, 2) }] });
        return;
      }
      if (params.name === 'get_open_loops') {
        rpcResult(id, { content: [{ type: 'text', text: JSON.stringify({ openLoops: detectOpenLoops(brain) }, null, 2) }] });
        return;
      }
      rpcError(id, -32602, `Unknown tool: ${params.name}`);
      return;
    }
    if (method === 'notifications/initialized') return;
    rpcError(id, -32601, `Unknown method: ${method}`);
  } catch (error) {
    rpcError(id, -32000, error instanceof Error ? error.message : String(error));
  }
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
