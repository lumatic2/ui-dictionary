# AUC3 Step 5 — Dual-CLI Fresh React Roundtrip Proof

## Outcome

- Ran Codex-labeled and Claude-labeled MCP clients against one fresh React source file and canonical document.
- Proved typed operation, stale-writer rejection, source patch reconciliation, exact Undo, bridge-down error, same-revision restart, and watcher recovery.
- Ran installed Codex and Claude read-only `get_context` smoke sessions using ephemeral/session-scoped MCP configuration.
- Kept deterministic mutation proof separate from live model connectivity evidence.

## Evidence

- `npm run roundtrip && npm run verify:roundtrip` in `packages/agent-design-mcp` — PASS at revision 4.
- Deterministic flow: Codex operation revision 1; Claude stale `REVISION_CONFLICT`; Claude source patch revision 2; Codex source Undo revision 3; restart at revision 3; watcher recovery revision 4.
- Final `src/App.tsx` hash equals context source hash and canonical component label equals `Watcher recovery`.
- Installed Codex emitted a completed `agent-design/get_context` event and returned `fresh-react-agent-design`, revision 4.
- Installed Claude ran with only `mcp__agent-design__get_context` allowed and returned the non-prompt document ID plus revision 4; its compact JSON result does not expose a separate tool event.
- Full fresh regression: canvas-core 35/35, engine 9/9, bridge 14/14, MCP 2/2, canvas app 16/16; all TypeScript/Vite builds passed.
- Fresh independent Step 4 system Chrome rerun: agent ack→visible p95 59.4ms, file edit→visible p95 144.4ms, zero watcher/console errors.
- Result: `apps/agent-design/results/dual-cli-roundtrip.json`.
- Screenshot: `apps/agent-design/results/screenshots/terminal-live-canvas.png`.
- Code commit: `7a8790d`.

## Residual boundary

- The bridge restart proof supplies the last canonical snapshot to a new process. Durable daemon supervision, snapshot persistence bootstrap, installer lifecycle, and crash recovery without a caller-held snapshot remain AUC4.
- Supported direct React reconciliation currently targets static JSX elements carrying stable `data-agent-design-id`; arbitrary React AST/runtime reconciliation remains outside this AUC3 proof.

## Size retrospective

- `roadmap_sync.py complete` reported one-changeset inflation because the milestone evidence pointer names only this final changeset. Actual execution produced five step changesets and five code commits, so AUC3 remained milestone-grade; the helper result is a known evidence-pointer counting false positive.
