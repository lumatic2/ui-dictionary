# AUC4 Step 4 — Sandboxed Preview, OS Actions, And Diagnostics

## Outcome

- Added a separate `WebContentsView` on an ephemeral session with no preload, Node, host IPC, external network, permissions, navigation, popups, webviews, workers, or downloads.
- Added an allowlisted `preview://<project-hash>` protocol that resolves every static asset through the trusted project registry and rejects unsupported extensions/path escapes.
- Added main-issued source file IDs and guarded project/file OS actions; renderer never sends an absolute path and executable script/binary extensions are excluded from the file catalog.
- Added whitelist-built diagnostic JSON with runtime/restart/recovery/security hashes but no project IDs, paths, source bodies, tokens, usernames, or credentials.

## Evidence

- `cd apps/agent-design-desktop && npm run test:preview-sandbox` — pure policy test and real hostile Electron preview passed.
- Hostile preview evidence: Node/require/host API undefined; HTTP and `file://` fetch denied; popup, shell protocol, external navigation, and geolocation denied; session non-persistent.
- `cd apps/agent-design-desktop && npm run test:diagnostics` — 3/3 guarded file and fail-closed redaction cases passed.
- `cd apps/agent-design-desktop && npm test` — 35/35 host/contract/security/lifecycle tests passed.
- `cd apps/agent-design && npm test` — 17/17 including preview, Explorer, file ID, and diagnostics renderer actions.
- `cd apps/agent-design-desktop && npm run build && npm run verify:security && npm audit --audit-level=high` — build/security PASS; 0 vulnerabilities.
- Code commit: `4f4ee49`.

## Next

Step 5 applies Electron fuses, packages the renderer/bridge/MCP resources, builds Windows x64/Squirrel artifacts, and records hashes, sizes, SBOM, and unsigned-release boundaries.
