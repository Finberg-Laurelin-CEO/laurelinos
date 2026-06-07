import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { handleMcpLine, handleMcpMessage, MCP_TOOLS } from '../lib/mcp.mjs';

const repoRoot = path.resolve(import.meta.dirname, '..');
const cli = path.join(repoRoot, 'bin', 'laurelinos.mjs');

function request(method, params = {}, id = 1) {
  return handleMcpMessage({ jsonrpc: '2.0', id, method, params }, { repoRoot });
}

function parseToolText(response) {
  assert.equal(response.result.content[0].type, 'text');
  return JSON.parse(response.result.content[0].text);
}

test('mcp initialize returns server metadata and tool capability', () => {
  const response = request('initialize');
  assert.equal(response.jsonrpc, '2.0');
  assert.equal(response.id, 1);
  assert.equal(response.result.protocolVersion, '2024-11-05');
  assert.deepEqual(response.result.serverInfo, { name: 'laurelinos', version: '0.1.0-alpha.0' });
  assert.deepEqual(response.result.capabilities, { tools: {} });
});

test('mcp tools/list exposes only local read-only synthetic tools', () => {
  const response = request('tools/list');
  assert.deepEqual(response.result.tools.map((tool) => tool.name), [
    'get_status',
    'get_daily_brief',
    'get_open_loops'
  ]);
  assert.deepEqual(response.result.tools, MCP_TOOLS);
  for (const tool of response.result.tools) {
    assert.equal(tool.inputSchema.type, 'object');
    assert.equal(tool.inputSchema.additionalProperties, false);
  }
});

test('mcp get_status reports local stdio read-only synthetic mode', () => {
  const response = request('tools/call', { name: 'get_status', arguments: {} });
  const status = parseToolText(response);
  assert.equal(status.status, 'ok');
  assert.equal(status.transport, 'stdio');
  assert.equal(status.readOnly, true);
  assert.equal(status.syntheticDataOnly, true);
  assert.equal(status.externalActionsRequireApproval, true);
  assert.deepEqual(status.tools, ['get_status', 'get_daily_brief', 'get_open_loops']);
});

test('mcp get_daily_brief returns synthetic sourced brief', () => {
  const response = request('tools/call', { name: 'get_daily_brief', arguments: {} });
  const brief = parseToolText(response);
  assert.equal(brief.organisation, 'ArcLight Labs');
  assert.equal(brief.approvalRequired, true);
  assert.ok(brief.topPriorities.length >= 1);
  assert.ok(brief.topPriorities.every((item) => item.sourceId));
  assert.ok(brief.upcomingMeetings.every((item) => item.sourceId));
});

test('mcp get_open_loops returns synthetic sourced open loops', () => {
  const response = request('tools/call', { name: 'get_open_loops', arguments: {} });
  const result = parseToolText(response);
  assert.ok(result.openLoops.length >= 1);
  assert.ok(result.openLoops.every((loop) => loop.sourceId));
  assert.ok(result.openLoops.every((loop) => loop.approvalRequiredBeforeExternalAction === true));
});

test('mcp unknown tool and method return JSON-RPC errors', () => {
  const unknownTool = request('tools/call', { name: 'send_email', arguments: {} });
  assert.equal(unknownTool.error.code, -32602);
  assert.match(unknownTool.error.message, /Unknown tool: send_email/);

  const unknownMethod = request('resources/list');
  assert.equal(unknownMethod.error.code, -32601);
  assert.match(unknownMethod.error.message, /Unknown method: resources\/list/);
});

test('mcp line handler handles parse errors and initialized notifications', () => {
  const parseError = handleMcpLine('{not json', { repoRoot });
  assert.equal(parseError.error.code, -32700);
  assert.equal(parseError.id, null);

  const notification = handleMcpLine(JSON.stringify({
    jsonrpc: '2.0',
    method: 'notifications/initialized',
    params: {}
  }), { repoRoot });
  assert.equal(notification, null);
});

test('mcp serve responds over local stdin/stdout', () => {
  const input = [
    { jsonrpc: '2.0', id: 1, method: 'initialize', params: {} },
    { jsonrpc: '2.0', id: 2, method: 'tools/list', params: {} },
    { jsonrpc: '2.0', id: 3, method: 'tools/call', params: { name: 'get_open_loops', arguments: {} } }
  ].map((message) => JSON.stringify(message)).join('\n') + '\n';

  const result = spawnSync(process.execPath, [cli, 'mcp', 'serve'], {
    cwd: repoRoot,
    input,
    encoding: 'utf8'
  });

  assert.equal(result.status, 0);
  assert.match(result.stderr, /Synthetic read-only tools only/);
  const responses = result.stdout.trim().split('\n').map((line) => JSON.parse(line));
  assert.equal(responses.length, 3);
  assert.equal(responses[0].result.serverInfo.name, 'laurelinos');
  assert.deepEqual(responses[1].result.tools.map((tool) => tool.name), ['get_status', 'get_daily_brief', 'get_open_loops']);
  const loops = JSON.parse(responses[2].result.content[0].text);
  assert.ok(loops.openLoops.length >= 1);
});
