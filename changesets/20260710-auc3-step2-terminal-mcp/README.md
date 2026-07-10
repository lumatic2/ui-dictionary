# AUC3 Step 2 — Terminal MCP Adapters

## Outcome

- Added one official MCP TypeScript SDK stdio adapter for both Codex and Claude actors.
- Registered `get_context`, `apply_operations`, `apply_source_patch`, `verify`, and `undo` with validated schemas and structured bridge errors.
- Extended the bridge with context, verification, and guarded inverse-operation Undo endpoints.
- Documented one-shot Codex and project-scoped Claude connection paths without automatic global configuration changes.

## Evidence

- `cd packages/agent-design-mcp && npm test && npm run build` — 2/2 child-process stdio contract cases and TypeScript build passed.
- Each actor passed MCP initialize, tool listing, context, apply, verify, and undo with identical tool semantics.
- `cd apps/agent-design-bridge && npm test && npm run build` — 7/7 tests and TypeScript build passed.
- Installed Codex CLI recognized the adapter through one-shot `-c` overrides.
- Installed Claude CLI added/read the adapter in a disposable project `.mcp.json` and reported it pending approval; the temp project was removed.
- No model invocation or live design quality is claimed at this step.
- Code commit: `d4d1ad6`.

## Next

Step 3 implements real source-patch transactions, exact audit diffs, atomic rollback, duplicate transaction protection, and unified Undo evidence.
