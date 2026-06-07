# packages/cli

Package boundary for the future LaurelinOS CLI package.

Current v0 code lives in:

```text
bin/laurelinos.mjs
lib/config.mjs
lib/demo.mjs
lib/format.mjs
```

Keep the zero-dependency CLI runnable while this package boundary is filled in later. Do not move code here until the package split has tests and `npm run check` still passes.

Current source-safety commands live in `bin/laurelinos.mjs`:

```text
sources add <name> <path>
sources show <name>
sources approve <name>
audit log
audit show <id>
```

`sources approve` records approval metadata and an audit event. It does not index source file contents.
