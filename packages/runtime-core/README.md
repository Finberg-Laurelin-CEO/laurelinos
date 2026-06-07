# packages/runtime-core

Runtime-core boundary for shared local-first policy helpers.

The first module here is `approval.mjs`, which centralises explicit approval checks for write-like operations. Adapter and workflow packages should use it before any future external write, sync, indexing, or Markdown mutation path.

The v0 CLI still lives in `bin/` and `lib/` so the tool stays runnable without a build step.
