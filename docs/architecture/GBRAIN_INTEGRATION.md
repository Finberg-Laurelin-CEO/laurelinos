# GBrain Integration

## Positioning

GBrain is the memory kernel, not the whole product.

LaurelinOS should use GBrain where it is strongest:

- Markdown-backed memory;
- entity pages;
- graph traversal;
- source scoping;
- retrieval;
- MCP integration;
- skills and dream-cycle patterns.

LaurelinOS adds:

- product packaging;
- CLI/runtime layer;
- approval-gated workflows;
- subscription-friendly compute strategy;
- Hermes/OpenClaw/Claude/Codex integration surface;
- Stripe/provisioning later;
- `laurelinos.dev` docs and commercial onboarding later.

## Adapter boundary

Create an adapter interface before binding to a specific GBrain install. The v0 boundary lives in `packages/gbrain-adapter/index.mjs` and is intentionally zero-dependency.

```ts
interface BrainAdapter {
  status(): Promise<BrainStatus>;
  listSources(): Promise<BrainSource[]>;
  addSource(input: AddSourceInput & ApprovalInput): Promise<BrainSource>;
  search(input: SearchInput): Promise<SearchResult[]>;
  getPage(input: GetPageInput): Promise<BrainPage | null>;
  writePage(input: WritePageInput & ApprovalInput): Promise<BrainWriteResult>;
  sync(input: SyncInput & ApprovalInput): Promise<SyncResult>;
}
```

Read operations are safe by default. Write-like operations carry an explicit approval object:

```ts
type ApprovalInput = {
  approval: {
    approved: true;
    approvedBy: string;
    reason: string;
  };
};
```

The approval check is centralised in `packages/runtime-core/approval.mjs` so future adapters and workflow packages share one gate.

## Synthetic stub behaviour

`createSyntheticBrainAdapter()` provides a local in-memory adapter for tests and early integration work.

It does:

- report status without requiring GBrain;
- list synthetic sources;
- search synthetic in-memory pages;
- return synthetic pages by ID;
- record approved source candidates without reading their paths;
- accept approved write proposals without persisting them;
- return a no-op sync result.

It does not:

- initialise a real GBrain database;
- spawn a `gbrain` process;
- read or index local folders;
- write Markdown files;
- expose remote MCP;
- perform external writes.

## Safety requirements

- Do not initialise a real GBrain database automatically.
- Do not index real folders until explicit approval is recorded.
- Do not write secrets into Markdown or GBrain.
- Do not use real private Laurelin data in examples.
- Do not expose remote MCP without authentication.
- Keep source records auditable: `approvedForIndexing` must default to `false` for local source candidates.

## First implementation

1. Stub adapter in `packages/gbrain-adapter/index.mjs`.
2. Approval helper in `packages/runtime-core/approval.mjs`.
3. Adapter tests covering synthetic-safe reads and approval-gated writes.
4. CLI can keep using its current `brain status`; wiring the adapter into CLI status can happen after the MCP branch hardens tool handlers.
5. Add explicit import/sync commands later, after source approval records and audit logs exist.
