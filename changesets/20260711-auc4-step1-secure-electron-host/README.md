# AUC4 Step 1 — Secure Electron Host And Typed Authority

## Outcome

- Added an Electron 43.1.0 desktop package that serves the existing Vite canvas through a contained `app://renderer` protocol.
- Locked the main renderer to sandboxed/context-isolated/no-Node preferences with a default-deny CSP, permissions, external network, navigation, windows, and webviews.
- Added a versioned preload/IPC contract that exposes only `apiVersion` and `getHostInfo`; unsupported authority fields such as raw paths and commands fail before IPC.
- Added canonical asset containment, trusted main-frame sender validation, Electron runtime security smoke, Electronegativity scanning, and a zero-vulnerability dependency audit.

## Evidence

- `cd apps/agent-design-desktop && npm test` — 18/18 contract, security, URL, CSP, and asset containment tests passed.
- `cd apps/agent-design-desktop && npm run build` — canvas/core/Vite build, desktop TypeScript build, and bundled sandbox preload passed.
- `cd apps/agent-design-desktop && npm run verify:security` — actual `app://renderer` runtime reported Node globals undefined, trusted IPC accepted, raw-path authority rejected, permission/network/popup denied, no Electron security warning, and no Electronegativity high finding.
- `cd apps/agent-design-desktop && npm audit --audit-level=high` — 0 vulnerabilities. The legacy scanner's vulnerable `tar` transitive dependency is overridden to patched `7.5.19`.
- Electronegativity 1.10.3 does not recognize Electron 43.1.x in its stale release table; current version pin, explicit config checks, and live Electron 43 runtime assertions are the controlling evidence.
- Code commit: `27d5fe8`.

## Security Review

- No production shell/process spawn, arbitrary path API, token persistence, credential handling, or renderer Node authority was introduced.
- The only `child_process` use is the verification harness launching the pinned Electron binary and legacy static scanner.
- A second-agent review was not run because the active runtime forbids subagents without explicit user request; runtime and static adversarial checks are recorded above.

## Next

Step 2 supervises the existing bridge as an Electron utility process with a bounded restart circuit and session-scoped terminal bootstrap.
