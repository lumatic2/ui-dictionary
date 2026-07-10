# Plan — AUC4 Desktop Productization And Quality Gate

Date: 2026-07-10
Milestone: AUC4 (`ROADMAP.md`, active planning gate)
Status: approved 2026-07-11 — Steps 1-2 complete; Step 3 in progress

## Hierarchy

- Objective: `docs/OBJECTIVE.md` — terminal agents and a code-native canvas become a trustworthy installed Windows product.
- Horizon: `docs/horizons/2026-07-agent-native-ui-canvas.md`.
- Predecessor: AUC3 loopback bridge/MCP/live canvas is complete and ledger-confirmed.
- Outcome: install Agent Design, trust a React folder, recover the supervised bridge/session, connect user-owned terminals, and retain packaged quality/security evidence.

## Technology decision

- Host: Electron current supported stable at implementation time.
- Process topology: sandboxed Electron renderer → typed preload → main authority → Electron `utilityProcess` bridge.
- Packaging: Electron Forge packager/fuses/security tooling + Squirrel.Windows maker. Existing Vite renderer builds independently; experimental Forge Vite plugin is excluded.
- Preview: separate sandboxed `WebContentsView` partition/custom protocol; no Node, arbitrary network, permissions, navigation, or popups.
- Persistence: atomic versioned snapshot/audit/recovery data under Electron `userData`, keyed by trusted-root hash.
- Distribution boundary: unsigned local development installer is testable; public release/signing/update remains blocked without a signing identity and release channel.

## Step tree

- [x] Step 1 — Secure Electron host and typed authority contract
  - Create the main/preload shell, custom app protocol, strict BrowserWindow preferences, versioned IPC schemas, sender validation, and default-deny navigation/window/permission policy.
  - Verify: main/preload unit tests, renderer has no Node globals, CSP/security-warning/electronegativity gate.

- [x] Step 2 — Supervised bridge lifecycle and terminal bootstrap
  - Fork the bridge as a utility process, exchange an in-memory session token/port through a message channel, publish health state, and enforce bounded restart/backoff.
  - Verify: spawn/ready/exit/crash/three-strike/restart tests and copyable Codex/Claude commands without global config mutation.

- [~] Step 3 — Trusted project import and durable recovery
  - Use the native folder picker, canonical realpath trust record, per-access containment checks, recent projects, atomic snapshot/audit persistence, autosave, corrupt-file quarantine, and startup recovery.
  - Verify: traversal/junction/root-change rejection, temp+fsync+rename failure injection, crash restore and read-only recovery state.

- [ ] Step 4 — Sandboxed preview, OS actions, and redacted diagnostics
  - Add isolated project preview, allowlisted resource protocol, default-deny network/permissions/navigation, guarded Explorer/editor actions, and a redacted diagnostic bundle.
  - Verify: hostile preview fixture cannot reach Node, host IPC, external network, arbitrary paths, popups, or shell protocols; diagnostics contain no token/source content.

- [ ] Step 5 — Windows packaging, fuses, installer, and release boundary
  - Package x64 Windows artifacts, apply production Electron fuses, generate icon/metadata, build Squirrel installer, record sizes/hashes/SBOM, and keep update/public release disabled unless signing inputs exist.
  - Verify: packaged artifact inspection, fuse/security scan, checksum/SBOM, installer creation, no embedded secrets/dev URLs/source maps.

- [ ] Step 6 — Packaged E2E and representative quality proof
  - Run installed/unpacked app: trust fresh React project → canvas/manual edit → dual terminal adapter → source watcher → crash/autosave recovery → browser verification → uninstall cleanup.
  - Verify: AUC0 5k p95 ≤16ms, bridge ack→visible ≤100ms, file edit→visible ≤300ms, WebGPU fallback, keyboard/a11y, actual Microsoft IME, process leak, installer/install/uninstall, screenshot/drift/security evidence.

## Security and recovery invariants

- Renderer and preview never receive Node/Electron modules, raw session token, unrestricted path, command, or shell API.
- Every filesystem/OS action resolves a main-owned project/session ID to a canonical allowlisted path and rechecks containment after symlink/junction resolution.
- The bridge is the only transaction authority and remains loopback/token scoped; Electron main supervises lifecycle but does not duplicate operations.
- Preview uses an ephemeral isolated partition and default-deny permission/network/navigation/window handlers.
- Snapshot/audit writes are atomic and versioned. Corruption never overwrites the last known-good snapshot.
- Restart loops stop after three failures in 60 seconds and surface a recoverable diagnostic state instead of respawning forever.
- Secrets, source bodies, tokens, usernames, and absolute paths are redacted from default diagnostic exports.

## Quality gates and stop rules

- AUC4 cannot complete on dev-server evidence alone; packaged executable evidence is mandatory.
- Installer generation is not installer validation. A clean Windows Sandbox/clean-user install and uninstall must run, or the installer gate remains open.
- Actual Microsoft IME composition is required in the packaged app unless the user explicitly waives it again; synthetic events are regression evidence only.
- Missing code-signing identity permits an `unsigned-development` artifact only. Do not call it release-ready or enable public update/publish.
- If Electron renderer gains Node authority, project preview can access external network/host IPC, or bridge restart loses the last committed revision, return to the responsible step.
- Tauri is reconsidered only if Electron packaged memory/startup/install-size evidence fails an explicit product budget and the Node sidecar binary boundary is proven cheaper.

## Planning gate

```yaml
planning_gate:
  artifact_contract: product
  output: "Electron host + supervised bridge + trusted persistence + sandboxed preview + Windows artifacts/evidence"
  hierarchy_scale: "milestone; six observable step leaves across host, authority, recovery, preview, installer, and packaged E2E"
  security_lane: "default-deny renderer/preview/IPC/path/fuse/install gates"
  qa_lane: "unit + failure injection + packaged system Chrome + clean Windows install/uninstall"
  skeptic_lane: "do not equate package creation with secure install/recovery or unsigned build with release readiness"
  delegation: "skip; current runtime forbids subagents without explicit user request"
  predecessor_gate: "AUC3 complete and ledger-confirmed"
  run_boundary: "Approved by the user on 2026-07-11; execute the six step leaves in order."
```
