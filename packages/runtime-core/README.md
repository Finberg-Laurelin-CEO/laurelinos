# packages/runtime-core

Package boundary for future runtime state, config, permissions, source registry, approval gates, and audit records.

Current v0 runtime helpers live in `lib/` so the local CLI works immediately. Future work should preserve these rules:

- runtime owns state;
- models do not own state;
- source paths are registered before indexing;
- indexing and external writes require explicit approval;
- local demo commands must not require GBrain, cloud infrastructure, or hosted services.
