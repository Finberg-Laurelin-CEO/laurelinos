# Sanitised Original Architecture Summary

This public repo is based on an earlier internal LaurelinOS / RuntimeOS architecture specification.

The internal spec established these principles:

- LaurelinOS is an AI-native operating system for organisations.
- It is not merely a chatbot, note-taking layer, vector database, or company wiki.
- The runtime should own durable organisational memory, cross-device context, user/device identity, project state, skills, permissions, model selection, workflow history, tool routing, commercial packaging, and demos.
- GBrain should be the memory/retrieval subsystem.
- Hermes should be an always-on agent runtime.
- Obsidian should remain a human-readable knowledge base for internal development.
- The initial commercial target is recurring revenue from a small number of paid pilots.

Public repo adjustments:

- no private Obsidian paths;
- no private infrastructure details;
- no customer/investor data;
- no secrets;
- synthetic demo data only;
- local CLI/runtime before website;
- `laurelinos.dev` docs site later.
