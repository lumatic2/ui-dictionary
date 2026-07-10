# ADR 0007 — Terminal Agent Live Canvas Bridge

Date: 2026-07-10
Status: accepted

## Context

The first AUC3 plan interpreted agent integration as an in-canvas proposal dock with a deterministic adapter and deferred live Codex/Claude connectivity. The intended product flow is different: the user keeps Codex CLI and Claude CLI open in terminal windows, gives design instructions there, and watches a separate Agent Design canvas redraw immediately. Requiring another canvas approval click would break that loop, while letting independent agents write without revision and project boundaries would create silent conflicts and unsafe filesystem authority.

## Decision

1. The user launches and owns Codex CLI and Claude CLI. Agent Design does not spawn them in AUC3.
2. One project-scoped Node bridge is the live authority for canonical revision, transaction log, exact diff, verification result, and canvas events.
3. Codex and Claude connect through stdio MCP adapters that forward to the same loopback bridge protocol.
4. A valid mutation from a scoped trusted terminal session auto-applies atomically. Exact diff is audit/history evidence, not an approval gate.
5. The bridge binds only to `127.0.0.1`, requires an ephemeral project/session token, restricts files to the trusted project root and source mappings, and rejects stale revisions or before-hash mismatches.
6. Canvas clients subscribe over WebSocket and redraw accepted transactions immediately. Target bridge-ack-to-visible p95 is ≤100ms; direct-file-edit-to-visible p95 is ≤300ms on the representative fixture.
7. A file watcher provides the reverse path for direct CLI edits. Transaction IDs and content hashes suppress feedback loops.
8. AUC3 runs daemon/adapters as local development processes. AUC4 packages and supervises them in the Windows desktop host.

## Consequences

- The main user loop stays in familiar terminal agents while the canvas acts as a live visual surface.
- Both CLIs share one protocol and do not duplicate canvas business logic.
- Multi-client concurrency, reconnect replay, atomic rollback, and file-watcher loop suppression become AUC3 quality gates.
- Live model quality is not the primary AUC3 test; actual Codex/Claude connection and tool discovery are smoke gates, while deterministic protocol clients provide repeatable mutation/failure evidence.
- Global CLI configuration is not modified automatically. Development smoke uses explicit repo-local/session-scoped connection instructions.
