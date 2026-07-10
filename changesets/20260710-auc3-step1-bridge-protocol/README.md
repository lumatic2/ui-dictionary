# AUC3 Step 1 — Local Bridge And Session Protocol

## Outcome

- Added `@askewly/agent-design-engine` as the pure transaction boundary over existing `canvas-core` operations and validation.
- Added a `127.0.0.1`-only Node bridge with ephemeral session token authorization, trusted project path resolution, revision/hash guarded commits, and structured conflicts.
- Added bounded event cursors, reconnect replay, cursor-gap full snapshots, HTTP snapshot/transaction endpoints, and WebSocket transaction broadcasts.

## Evidence

- `cd packages/agent-design-engine && npm test && npm run build` — 5/5 tests and TypeScript build passed.
- `cd apps/agent-design-bridge && npm test && npm run build` — 5/5 tests and TypeScript build passed.
- Security/recovery cases cover missing token, non-loopback address, project-root escape, stale revision/hash, replay, and cursor-gap snapshot recovery.
- Code commit: `eeb427d`.

## Next

Step 2 exposes the shared bridge through one stdio MCP adapter used by repo-scoped Codex and Claude terminal sessions.
