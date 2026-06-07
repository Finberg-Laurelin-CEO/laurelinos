import { requireExplicitApproval } from '../runtime-core/approval.mjs';

const DEFAULT_SOURCE = {
  id: 'demo',
  name: 'Synthetic demo brain',
  kind: 'synthetic-demo',
  path: null,
  approvedForIndexing: false,
  indexingStatus: 'not_applicable',
  touchesFilesystem: false
};

const DEFAULT_PAGES = [
  {
    id: 'demo/founder-brief',
    title: 'Synthetic founder brief memory',
    body: 'Northstar requested revised pilot metrics. Atlas Manufacturing needs an onboarding-risk mitigation plan.',
    sourceId: 'demo',
    synthetic: true
  },
  {
    id: 'demo/calendar-scope',
    title: 'Synthetic calendar permission decision',
    body: 'Engineering is blocked on the smallest OAuth calendar scope needed for onboarding automation.',
    sourceId: 'demo',
    synthetic: true
  }
];

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalizeText(value) {
  return String(value || '').trim().toLowerCase();
}

function assertString(value, name) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new TypeError(`${name} must be a non-empty string`);
  }
}

export function createSyntheticBrainAdapter(options = {}) {
  const sources = new Map();
  const pages = new Map();

  for (const source of options.sources || [DEFAULT_SOURCE]) {
    sources.set(source.id, clone(source));
  }

  for (const page of options.pages || DEFAULT_PAGES) {
    pages.set(page.id, clone(page));
  }

  return {
    provider: 'synthetic-stub',

    async status() {
      return {
        provider: 'synthetic-stub',
        status: 'ready',
        connected: false,
        gbrainRequired: false,
        realGbrainInitialized: false,
        sourceCount: sources.size,
        pageCount: pages.size,
        safety: {
          syntheticOnly: true,
          touchesRealGbrain: false,
          touchesFilesystem: false,
          indexesRealFolders: false,
          externalActionsRequireApproval: true
        }
      };
    },

    async listSources() {
      return Array.from(sources.values(), clone);
    },

    async addSource(input = {}) {
      requireExplicitApproval(input, 'addSource');
      assertString(input.name, 'name');
      assertString(input.path, 'path');

      const id = input.id || input.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const source = {
        id,
        name: input.name,
        kind: input.kind || 'local-candidate',
        path: input.path,
        approvedForIndexing: false,
        indexingStatus: 'not_indexed',
        touchesFilesystem: false,
        note: 'Source candidate recorded only. No folder reads, indexing, sync, or GBrain writes were performed.'
      };
      sources.set(id, source);
      return clone(source);
    },

    async search(input = {}) {
      assertString(input.query, 'query');
      const query = normalizeText(input.query);
      const limit = Number.isInteger(input.limit) && input.limit > 0 ? input.limit : 10;

      return Array.from(pages.values())
        .filter((page) => {
          return [page.id, page.title, page.body, page.sourceId].some((field) => normalizeText(field).includes(query));
        })
        .slice(0, limit)
        .map((page) => ({
          id: page.id,
          title: page.title,
          excerpt: page.body.slice(0, 180),
          sourceId: page.sourceId,
          score: 1,
          synthetic: true
        }));
    },

    async getPage(input = {}) {
      assertString(input.id, 'id');
      return pages.has(input.id) ? clone(pages.get(input.id)) : null;
    },

    async writePage(input = {}) {
      const approval = requireExplicitApproval(input, 'writePage');
      assertString(input.id, 'id');
      assertString(input.title, 'title');
      assertString(input.body, 'body');

      return {
        status: 'proposal_recorded',
        persisted: false,
        externalWrite: false,
        gbrainWrite: false,
        approval: clone(approval),
        proposedPage: {
          id: input.id,
          title: input.title,
          body: input.body,
          sourceId: input.sourceId || 'proposal',
          synthetic: input.synthetic !== false
        },
        note: 'Synthetic stub accepted the approved proposal but did not write to GBrain, Markdown, or the filesystem.'
      };
    },

    async sync(input = {}) {
      const approval = requireExplicitApproval(input, 'sync');
      return {
        status: 'noop',
        synced: false,
        indexedSourceCount: 0,
        touchedPaths: [],
        touchedRealGbrain: false,
        approval: clone(approval),
        note: 'Synthetic stub does not sync or index real sources.'
      };
    }
  };
}

export const BrainAdapterShape = Object.freeze({
  status: '() => Promise<BrainStatus>',
  listSources: '() => Promise<BrainSource[]>',
  addSource: '(AddSourceInput & ApprovalInput) => Promise<BrainSource>',
  search: '(SearchInput) => Promise<SearchResult[]>',
  getPage: '(GetPageInput) => Promise<BrainPage | null>',
  writePage: '(WritePageInput & ApprovalInput) => Promise<BrainWriteResult>',
  sync: '(SyncInput & ApprovalInput) => Promise<SyncResult>'
});
