import fs from 'node:fs';
import path from 'node:path';

export const SETUP_TARGETS = ['generic', 'claude', 'codex', 'cursor', 'hermes', 'openclaw'];

const TARGET_LABELS = {
  generic: 'Generic MCP-aware agent',
  claude: 'Claude / Claude Code',
  codex: 'Codex CLI',
  cursor: 'Cursor',
  hermes: 'Hermes Agent',
  openclaw: 'OpenClaw'
};

export function normaliseSetupTarget(target = 'generic') {
  const normalised = String(target).toLowerCase();
  if (!SETUP_TARGETS.includes(normalised)) {
    throw new Error(`Unknown setup target: ${target}. Expected one of: ${SETUP_TARGETS.join(', ')}`);
  }
  return normalised;
}

export function buildMcpServerSpec(repoRoot) {
  return {
    name: 'laurelinos',
    transport: 'stdio',
    command: 'node',
    args: [path.join(repoRoot, 'bin', 'laurelinos.mjs'), 'mcp', 'serve'],
    env: {},
    notes: [
      'Use the direct node command, not npm run, so stdout remains valid JSON-RPC.',
      'Use an absolute path during local development.',
      'The v0 server is local stdio only and must not be exposed as a public network service.'
    ]
  };
}

export function buildAgentSetupPlan(target, repoRoot) {
  const normalisedTarget = normaliseSetupTarget(target);
  const cliPath = path.join(repoRoot, 'bin', 'laurelinos.mjs');
  const mcpServer = buildMcpServerSpec(repoRoot);

  return {
    product: 'LaurelinOS',
    target: normalisedTarget,
    targetLabel: TARGET_LABELS[normalisedTarget],
    purpose: 'Configure LaurelinOS as a local company-brain substrate for an existing agent runtime.',
    modelStrategy: 'The existing agent runtime owns model calls and provider credentials. LaurelinOS owns state, source policy, approvals, audit, and workflows.',
    mcpServer,
    setupCommands: [
      `node ${JSON.stringify(cliPath)} doctor`,
      `node ${JSON.stringify(cliPath)} init --local`,
      `node ${JSON.stringify(cliPath)} license status`,
      `node ${JSON.stringify(cliPath)} brief --demo`,
      `node ${JSON.stringify(cliPath)} open-loops --demo`
    ],
    smokeTest: {
      description: 'Verify the MCP server responds over stdio with tool metadata.',
      command: `printf '%s\\n' '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}' '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}' | node ${JSON.stringify(cliPath)} mcp serve`,
      expectedTools: ['get_status', 'get_daily_brief', 'get_open_loops']
    },
    agentPrompt: buildAgentPrompt(normalisedTarget),
    safetyConstraints: [
      'Do not install, download, run, vendor, or supervise Hermes/OpenClaw from LaurelinOS.',
      'Do not ask for or store raw model-provider credentials in LaurelinOS.',
      'Do not expose LaurelinOS MCP over a public port or remote endpoint.',
      'Do not read or index real local folders until the user adds and approves a source explicitly.',
      'Do not mutate email, calendar, CRM, GitHub, Stripe, DNS, cloud, or customer systems without explicit approval.',
      'Report every host-agent config file changed during setup.'
    ],
    nextSteps: [
      'Copy the mcpServer object into the host agent MCP configuration using that host agent\'s documented format.',
      'Restart or reload the host agent if required.',
      'Run the smoke test or ask the host agent to list LaurelinOS MCP tools.',
      'Keep demo mode synthetic until a user explicitly approves real sources.'
    ]
  };
}

function buildAgentPrompt(target) {
  const targetName = TARGET_LABELS[target];
  return `Install LaurelinOS into this ${targetName} environment as a local stdio MCP server. Do not install Hermes or OpenClaw. Do not ask for model-provider credentials. Run only synthetic demo commands. Configure the LaurelinOS MCP server using the host agent's documented config format. Verify tools/list includes get_status, get_daily_brief, and get_open_loops. Do not add, approve, read, or index real source folders unless I explicitly choose a path and approve it. Report exactly what files you changed.`;
}

export function verifyAgenticSetup(repoRoot) {
  const cliPath = path.join(repoRoot, 'bin', 'laurelinos.mjs');
  return {
    product: 'LaurelinOS',
    ready: fs.existsSync(cliPath),
    cliPath,
    nodeVersion: process.version,
    mcpServer: buildMcpServerSpec(repoRoot),
    checks: [
      { name: 'cli_exists', ok: fs.existsSync(cliPath), detail: cliPath },
      { name: 'node_major_at_least_20', ok: Number(process.versions.node.split('.')[0]) >= 20, detail: process.version },
      { name: 'mcp_command_available', ok: fs.existsSync(cliPath), detail: `node ${JSON.stringify(cliPath)} mcp serve` }
    ],
    safeToProceedWithSyntheticDemo: fs.existsSync(cliPath) && Number(process.versions.node.split('.')[0]) >= 20,
    reminder: 'This verification does not install third-party agents, read real sources, expose remote MCP, or contact model providers.'
  };
}
