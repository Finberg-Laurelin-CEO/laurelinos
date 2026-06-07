# packages/gbrain-adapter

Package boundary for the future provider-neutral brain adapter.

Current v0 behavior only detects whether `gbrain` is installed and reports synthetic-safe runtime status. The next branch should add an adapter interface and stub implementation without initialising a real GBrain database or indexing real folders.

Safety baseline:

- no automatic broad indexing;
- no private Laurelin/customer data;
- no secrets in Markdown or logs;
- no remote MCP or hosted dependency for the local demo.
