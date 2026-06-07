# packages/gbrain-adapter

Provider-neutral brain adapter boundary for LaurelinOS.

The first implementation is a zero-dependency synthetic stub in `index.mjs`. It exists to lock the runtime contract before binding LaurelinOS to a real GBrain install.

## Boundary

The adapter exposes:

```text
status
listSources
addSource
search
getPage
writePage
sync
```

## Current v0 behavior

- The CLI can report whether `gbrain` is installed without requiring it.
- The synthetic adapter uses in-memory demo state only.
- No real GBrain database is initialised.
- No real folders are indexed.

## Safety posture

- `status`, `listSources`, `search`, and `getPage` read only in-memory synthetic data.
- `addSource`, `writePage`, and `sync` require explicit approval in their input.
- The stub never initialises GBrain, indexes folders, writes Markdown, or touches the filesystem.
- No private Laurelin/customer data, secrets, remote MCP, or hosted dependency is required for the local demo.
