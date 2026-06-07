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

Create an adapter interface before binding to a specific GBrain install.

```ts
interface BrainAdapter {
  status(): Promise<BrainStatus>;
  listSources(): Promise<BrainSource[]>;
  addSource(input: AddSourceInput): Promise<BrainSource>;
  search(input: SearchInput): Promise<SearchResult[]>;
  getPage(input: GetPageInput): Promise<BrainPage | null>;
  writePage(input: WritePageInput): Promise<BrainWriteResult>;
  sync(input: SyncInput): Promise<SyncResult>;
}
```

## Safety requirements

- Do not initialise a real GBrain database automatically.
- Do not index real folders until explicit approval is recorded.
- Do not write secrets into Markdown or GBrain.
- Do not use real private Laurelin data in examples.
- Do not expose remote MCP without authentication.

## First implementation

1. Stub adapter.
2. CLI uses stub for `brain status`.
3. Add local GBrain command detection.
4. Add explicit import/sync command later.
5. Add HTTP/stdio MCP support only after local tests pass.
