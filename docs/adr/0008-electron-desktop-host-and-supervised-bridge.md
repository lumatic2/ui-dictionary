# ADR 0008 — Electron Hosts Agent Design And Supervises The Bridge

Date: 2026-07-10
Status: accepted — AUC4 execution approved 2026-07-11

## Context

AUC3 proved the canvas, Node bridge, source watcher, and stdio MCP adapter as development processes. AUC4 must turn them into a Windows desktop product without giving the renderer filesystem/process authority or introducing a second canvas/runtime implementation. The principal host candidates are Electron and Tauri.

Tauri has a strong capability/permission model and smaller host footprint, but the existing Node bridge would become an external binary boundary. Its official sidecar flow requires target-specific executable names and packaging/signing per architecture. That would add a Node-to-binary build pipeline and Rust command layer before the current bridge can be supervised.

Electron ships the Chromium/Node environment already used by the validated renderer and bridge. Its `utilityProcess.fork` API runs a Node-enabled service process, supports message ports, and exposes spawn/error/exit lifecycle events. Electron's official security guidance also defines the renderer constraints required here: Node integration off, context isolation and sandbox on, restrictive CSP, permission/navigation/window denial, IPC sender validation, custom protocol, and fuses.

## Proposed Decision

1. Create `apps/agent-design-desktop` as an Electron main/preload host around the existing `apps/agent-design` renderer.
2. Run `apps/agent-design-bridge` as an Electron `utilityProcess`, not inside the renderer and not as duplicate Electron-main business logic.
3. Use a sandboxed, context-isolated main renderer with `nodeIntegration: false`. Expose a narrow versioned preload API carrying project/session IDs rather than arbitrary paths or commands.
4. Render project preview in a separate sandboxed `WebContentsView` session with no Node, denied permissions/network/navigation/window creation, and an allowlisted custom protocol.
5. Build the existing Vite renderer separately. Use Electron Forge for packaging, fuses, security inspection, and Windows Squirrel maker; do not adopt Forge's experimental Vite plugin.
6. Store atomic session snapshots, audit log, crash metadata, and diagnostics under Electron `userData`, keyed by a hash of the canonical trusted root. Project source remains in the selected folder.
7. The app automatically starts the bridge but does not spawn Codex or Claude. It presents session-scoped copyable connection commands and never edits global CLI configuration.
8. Produce a local unsigned development installer and block public distribution unless a valid Windows code-signing identity is supplied. Auto-update stays disabled until signed release infrastructure exists.

## Consequences

- Existing TypeScript bridge and Chromium renderer remain the production implementation rather than being ported.
- Bundle/install size is higher than Tauri and must be recorded, but it is not traded against a second runtime or weaker recovery evidence.
- Electron main/preload become security-critical and require automated preference, IPC, fuse, navigation, permission, and packaged artifact checks.
- Durable supervisor bootstrap and installer lifecycle close the AUC3 restart boundary; arbitrary React execution remains isolated from host authority.

## Evidence

- Electron security checklist: <https://www.electronjs.org/docs/latest/tutorial/security>
- Electron utility process lifecycle: <https://www.electronjs.org/docs/latest/api/utility-process>
- Electron Forge configuration and Squirrel maker: <https://www.electronforge.io/config/configuration>, <https://www.electronforge.io/config/makers/squirrel.windows>
- Tauri sidecar/capability comparison: <https://v2.tauri.app/develop/sidecar/>, <https://v2.tauri.app/security/capabilities/>
- Local reference: `references/nexu-io-open-design/ANALYSIS.md`
