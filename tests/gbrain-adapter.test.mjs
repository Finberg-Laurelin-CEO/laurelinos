import test from 'node:test';
import assert from 'node:assert/strict';
import { createSyntheticBrainAdapter, BrainAdapterShape } from '../packages/gbrain-adapter/index.mjs';
import { EXPLICIT_APPROVAL_REQUIRED } from '../packages/runtime-core/approval.mjs';

const approval = {
  approved: true,
  approvedBy: 'test-agent',
  reason: 'synthetic adapter test approval'
};

async function assertApprovalRequired(operation) {
  await assert.rejects(operation, (error) => {
    assert.equal(error.code, EXPLICIT_APPROVAL_REQUIRED);
    return true;
  });
}

test('adapter exposes the provider-neutral boundary shape', () => {
  assert.deepEqual(Object.keys(BrainAdapterShape), [
    'status',
    'listSources',
    'addSource',
    'search',
    'getPage',
    'writePage',
    'sync'
  ]);
});

test('synthetic adapter status is local-only and does not require real GBrain', async () => {
  const adapter = createSyntheticBrainAdapter();
  const status = await adapter.status();

  assert.equal(status.provider, 'synthetic-stub');
  assert.equal(status.connected, false);
  assert.equal(status.gbrainRequired, false);
  assert.equal(status.realGbrainInitialized, false);
  assert.equal(status.safety.syntheticOnly, true);
  assert.equal(status.safety.touchesRealGbrain, false);
  assert.equal(status.safety.touchesFilesystem, false);
  assert.equal(status.safety.indexesRealFolders, false);
  assert.equal(status.safety.externalActionsRequireApproval, true);
});

test('search and getPage use synthetic in-memory pages only', async () => {
  const adapter = createSyntheticBrainAdapter();
  const results = await adapter.search({ query: 'Northstar' });

  assert.equal(results.length, 1);
  assert.equal(results[0].id, 'demo/founder-brief');
  assert.equal(results[0].synthetic, true);

  const page = await adapter.getPage({ id: 'demo/founder-brief' });
  assert.equal(page.sourceId, 'demo');
  assert.equal(page.synthetic, true);

  const missing = await adapter.getPage({ id: 'missing' });
  assert.equal(missing, null);
});

test('addSource records a candidate only after explicit approval', async () => {
  const adapter = createSyntheticBrainAdapter();

  await assertApprovalRequired(() => adapter.addSource({ name: 'Notes', path: './notes' }));

  const source = await adapter.addSource({ name: 'Notes', path: './notes', approval });
  assert.equal(source.id, 'notes');
  assert.equal(source.approvedForIndexing, false);
  assert.equal(source.indexingStatus, 'not_indexed');
  assert.equal(source.touchesFilesystem, false);
  assert.match(source.note, /No folder reads/);

  const sources = await adapter.listSources();
  assert.equal(sources.some((item) => item.id === 'notes'), true);
});

test('writePage requires approval and never persists to real GBrain or filesystem', async () => {
  const adapter = createSyntheticBrainAdapter();

  await assertApprovalRequired(() => adapter.writePage({
    id: 'proposal/test',
    title: 'Approved write proposal',
    body: 'Synthetic proposal body.'
  }));

  const result = await adapter.writePage({
    id: 'proposal/test',
    title: 'Approved write proposal',
    body: 'Synthetic proposal body.',
    approval
  });

  assert.equal(result.status, 'proposal_recorded');
  assert.equal(result.persisted, false);
  assert.equal(result.externalWrite, false);
  assert.equal(result.gbrainWrite, false);
  assert.equal(result.proposedPage.id, 'proposal/test');
  assert.match(result.note, /did not write to GBrain/);

  const page = await adapter.getPage({ id: 'proposal/test' });
  assert.equal(page, null);
});

test('sync requires approval and remains a no-op', async () => {
  const adapter = createSyntheticBrainAdapter();

  await assertApprovalRequired(() => adapter.sync({}));

  const result = await adapter.sync({ approval });
  assert.equal(result.status, 'noop');
  assert.equal(result.synced, false);
  assert.equal(result.indexedSourceCount, 0);
  assert.deepEqual(result.touchedPaths, []);
  assert.equal(result.touchedRealGbrain, false);
});
