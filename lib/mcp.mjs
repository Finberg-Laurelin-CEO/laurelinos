import { buildDailyBrief, detectOpenLoops, loadDemoBrain } from './demo.mjs';

export const MCP_PROTOCOL_VERSION = '2024-11-05';
export const MCP_SERVER_INFO = { name: 'laurelinos', version: '0.1.0-alpha.0' };

export const MCP_TOOLS = [
  {
    name: 'get_status',
    description: 'Return local LaurelinOS runtime status.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false }
  },
  {
    name: 'get_daily_brief',
    description: 'Return a synthetic daily founder brief.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false }
  },
  {
    name: 'get_open_loops',
    description: 'Return synthetic open loops.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false }
  }
];

function rpcResult(id, result) {
  return { jsonrpc: '2.0', id, result };
}

function rpcError(id, code, message) {
  return { jsonrpc: '2.0', id, error: { code, message } };
}

function textContent(value) {
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(value, null, 2)
      }
    ]
  };
}

export function handleMcpMessage(message, { repoRoot }) {
  const { id, method, params = {} } = message;

  if (method === 'initialize') {
    return rpcResult(id, {
      protocolVersion: MCP_PROTOCOL_VERSION,
      serverInfo: MCP_SERVER_INFO,
      capabilities: { tools: {} }
    });
  }

  if (method === 'tools/list') {
    return rpcResult(id, { tools: MCP_TOOLS });
  }

  if (method === 'tools/call') {
    const brain = loadDemoBrain(repoRoot);

    if (params.name === 'get_status') {
      return rpcResult(id, textContent({
        status: 'ok',
        mode: 'local-first MVP',
        repo: 'Finberg-Laurelin-CEO/laurelinos',
        transport: 'stdio',
        readOnly: true,
        syntheticDataOnly: true,
        externalActionsRequireApproval: true,
        tools: MCP_TOOLS.map((tool) => tool.name)
      }));
    }

    if (params.name === 'get_daily_brief') {
      return rpcResult(id, textContent(buildDailyBrief(brain)));
    }

    if (params.name === 'get_open_loops') {
      return rpcResult(id, textContent({ openLoops: detectOpenLoops(brain) }));
    }

    return rpcError(id, -32602, `Unknown tool: ${params.name}`);
  }

  if (method === 'notifications/initialized') return null;

  return rpcError(id, -32601, `Unknown method: ${method}`);
}

export function handleMcpLine(line, options) {
  let message;
  try {
    message = JSON.parse(line);
  } catch {
    return rpcError(null, -32700, 'Parse error');
  }

  try {
    return handleMcpMessage(message, options);
  } catch (error) {
    return rpcError(message.id ?? null, -32000, error instanceof Error ? error.message : String(error));
  }
}
