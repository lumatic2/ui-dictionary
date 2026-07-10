# nexu-io/open-design architecture analysis

- Analysis date: 2026-07-10
- Repository: https://github.com/nexu-io/open-design
- Local source reviewed: toolshelf clone at commit `bc89144` (`main`), package version `0.10.0`
- License: Apache-2.0
- Boundary: source was inspected read-only; the full app was not launched because architecture and package evidence were sufficient for this comparison

## 1. Summary

OpenDesign is a local-first agent design workspace built as a set of cooperating web and desktop processes:

- **Web UI:** Next.js 16, React 18, Tailwind CSS 4, TypeScript, Motion, Lexical, xterm.js.
- **Desktop shell:** Electron 41.3 with sandboxed, context-isolated BrowserWindows and a narrow preload/IPC surface.
- **Local daemon:** Node 24 + TypeScript + Express 5. It owns projects, files, conversations, agent sessions, artifact operations, plugins, and streaming APIs.
- **Persistence:** current source uses better-sqlite3 for projects, conversations, messages, tabs, comments, routines, plugin state, and other metadata. Generated artifacts are still real files on disk with `.artifact.json` or `artifact.json` metadata.
- **Live updates:** chokidar watches project directories; REST endpoints mutate state and Server-Sent Events stream agent output.
- **Agent runtime:** adapters detect and spawn Claude Code, Codex, and other CLIs with bounded CWD/context. ACP support uses line-delimited JSON-RPC. `node-pty` supports terminal processes.
- **Preview/editing:** HTML/JSX artifacts render in sandboxed iframes. A script bridge marks elements with `data-od-id` or source-path metadata, reports hover/selection through `postMessage`, applies temporary styles, and converts accepted visual changes into source patches.
- **Plugin system:** manifests, runtime resolution, snapshots, registry protocol, official plugin packs, design systems, skills, and templates are modular packages rather than hard-coded UI modes.

OpenDesign is therefore not a Figma-class scenegraph canvas. It is a **file/artifact workspace with an interactive browser preview and editor overlay**. That distinction is critical: its architecture is highly relevant to Agent Design's local runtime and agent integration, but its preview model is not sufficient as the canonical canvas document model.

### Primary source references

All sources accessed 2026-07-10.

- Repository root and package metadata — https://github.com/nexu-io/open-design
- Architecture document — https://github.com/nexu-io/open-design/blob/main/docs/architecture.md
- Web package — https://github.com/nexu-io/open-design/blob/main/apps/web/package.json
- Daemon package — https://github.com/nexu-io/open-design/blob/main/apps/daemon/package.json
- Desktop package — https://github.com/nexu-io/open-design/blob/main/apps/desktop/package.json
- Electron runtime — https://github.com/nexu-io/open-design/blob/main/apps/desktop/src/main/runtime.ts
- Preview/edit bridge — https://github.com/nexu-io/open-design/blob/main/apps/web/src/edit-mode/bridge.ts
- Source patching — https://github.com/nexu-io/open-design/blob/main/apps/web/src/edit-mode/source-patches.ts
- Main file viewer/preview surface — https://github.com/nexu-io/open-design/blob/main/apps/web/src/components/FileViewer.tsx
- Daemon database schema — https://github.com/nexu-io/open-design/blob/main/apps/daemon/src/db.ts
- Agent runtime registry — https://github.com/nexu-io/open-design/blob/main/apps/daemon/src/runtimes/registry.ts
- ACP transport — https://github.com/nexu-io/open-design/blob/main/apps/daemon/src/acp.ts

## 2. Directory and runtime map

```text
open-design/
├── apps/
│   ├── web/          Next.js/React product UI
│   ├── daemon/       Node/Express local service, DB, files, agents, plugins
│   ├── desktop/      Electron main/preload and privileged OS actions
│   └── packaged/     sidecar orchestration and distributable entrypoints
├── packages/
│   ├── contracts/    shared API and IPC types
│   ├── host/         host capability abstraction
│   ├── sidecar/      daemon/web child-process lifecycle
│   ├── sidecar-proto/sidecar protocol contracts
│   ├── plugin-runtime/plugin manifest resolution and adapters
│   ├── registry-protocol/plugin registry contracts
│   ├── platform/     OS/platform boundaries
│   └── components/   shared UI primitives
├── plugins/_official/ packaged scenarios and artifact templates
├── skills/           agent-operable design workflows
├── design-systems/   DESIGN.md-style systems
├── design-templates/ artifact templates
└── prompt-templates/ generation presets
```

### Process topology

```text
Electron main
├── sandboxed BrowserWindow → local Next.js web sidecar
├── preload → narrow typed IPC
├── folder picker / open path / save / update / capture APIs
└── launches and supervises sidecars

Next.js web UI
├── project/file browser
├── chat and agent controls
├── artifact/file viewer
├── iframe preview
├── selection/tweak/comment overlays
└── REST + SSE client

Node daemon
├── Express REST/SSE server on localhost
├── SQLite metadata/session store
├── filesystem artifact/project store
├── chokidar watchers
├── agent adapter registry + ACP/CLI processes
├── plugin/skill/design-system registries
└── export and media pipelines
```

### Preview and editing path

1. The selected file is loaded as a URL or `srcDoc` inside a sandboxed iframe, generally with `allow-scripts` and without `allow-same-origin`.
2. Preview HTML contains or receives the OpenDesign edit/inspect bridge.
3. Elements are addressable through `data-od-id`, `data-od-edit`, labels, runtime IDs, or source-path metadata.
4. Hover/selection events are posted to the host; the host draws UI and populates property/tweak panels.
5. Preview styles can be applied without reload through `postMessage`.
6. Accepted edits are reconciled against source HTML and emitted as source patches; watchers refresh the preview when files change.

This is a clever HTML editor loop, but it does not maintain a standalone scenegraph that can deterministically generate multiple framework outputs.

## 3. Component mapping to Agent Design

| OpenDesign subsystem | Agent Design equivalent | Adoption stance |
|---|---|---|
| Electron desktop | desktop host and OS integration | strong candidate |
| Next.js web UI | React renderer/editor chrome | Vite may be enough; SSR not required |
| Node daemon | design engine, project/file service, agent runtime | useful boundary; size carefully |
| shared contracts/host/sidecar packages | typed renderer↔host↔engine protocol | adopt |
| SQLite metadata | recent projects, sessions, undo/checkpoints, agent history | adopt minimally |
| filesystem artifacts | actual code project and generated files | adopt |
| chokidar | project refresh and external-edit detection | adopt |
| sandboxed iframe preview | execute untrusted/project UI separately from editor chrome | adopt |
| `data-od-id` edit bridge | DOM hit testing and source location bridge | adopt as one adapter |
| source-patches | visual edits translated back to source | study, but not sole document model |
| CLI/ACP agent adapters | selection-bound canvas agent runtime | adopt after permissions design |
| plugin runtime | future extension model | defer beyond canvas core |
| broad artifact templates | slides/video/image generation | reject for v1 |

OpenDesign contributes the **local application topology**, while Figma contributes the **canonical document and editor-engine model**. Agent Design needs both: a real canvas document above an OpenDesign-like local runtime.

## 4. Impressive patterns and cautions

### Patterns worth retaining

1. **Thin, hardened desktop host.** Electron main owns privileged operations; renderer has `contextIsolation: true`, `nodeIntegration: false`, `sandbox: true`, and only approved preload methods.
2. **Explicit sidecar contracts.** Web, daemon, and desktop are separately packageable and communicate through shared typed protocols.
3. **Hybrid persistence.** User-facing artifacts remain normal files while SQLite stores application metadata and session state.
4. **Selection bridge to source.** Stable runtime/source IDs let a user click rendered UI and give the agent a precise target instead of a screenshot description.
5. **Preview isolation.** Untrusted generated code runs in sandboxed iframes without host cookies or same-origin access.
6. **Trusted folder import.** The current desktop flow couples the native picker with short-lived single-use HMAC authorization, canonicalizes paths, rejects symlink escapes, and marks trusted imports before permitting `openPath`.
7. **Adapter-based agents.** Agent differences live behind capability definitions and transport adapters rather than infecting product UI code.

### Cautions

1. **The architecture document is partially historical.** It claims `history.jsonl` instead of SQLite, while current `db.ts` and package dependencies show extensive better-sqlite3 use. Current source outranks the prose document.
2. **Preview is not a canonical canvas.** `FileViewer.tsx`, iframe state, bridge metadata, and source patches form an editor over rendered output. Complex reparenting, variants, responsive layout, and framework-independent structure would be fragile without a separate document model.
3. **Large surface area.** The project combines chat, terminal, agents, plugins, media, automation, critique, exports, remote modes, and desktop pets. Copying the topology wholesale would overbuild Agent Design.
4. **Renderer complexity is concentrated.** `FileViewer.tsx` contains many preview transports, board/comment/edit/inspect modes, snapshot paths, and postMessage protocols. Agent Design should split canvas runtime, overlay, source adapter, and inspector earlier.
5. **Agent permission inheritance is not enough by itself.** OpenDesign mostly relies on each coding agent's permission model. Agent Design also needs product-level diff confirmation and write scopes because canvas edits are expected to mutate user projects.

## 5. Impact on Agent Design definition

### Adopt now as architectural constraints

1. Use a **three-boundary model** even if initially packaged together:
   - desktop host for privileged OS actions;
   - editor renderer for canvas and panels;
   - local engine for project analysis, code transforms, verification, and agents.
2. Define shared typed contracts before UI implementation so the CLI/core, app, and future headless paths consume the same operations.
3. Run project output in a sandboxed iframe or isolated origin; never give project code access to Electron/host APIs.
4. Give rendered nodes stable IDs/source locations so selection can map to canonical canvas nodes and source files.
5. Store application metadata separately from user code; user project files remain the durable implementation artifact.
6. Watch external file changes and reconcile them explicitly instead of silently overwriting canvas state.

### Do not adopt as the canvas foundation

- iframe DOM plus source patches as the only source of truth;
- a chat-first project model;
- broad plugin/media/automation scope before direct manipulation works;
- a large Next.js server path when the desktop renderer does not need SSR;
- automatic agent writes without an exact diff and verification gate.

### Decision implication

OpenDesign supports Electron and a local engine process as credible choices, but its current breadth warns against copying a permanent daemon before the minimal operations are known. The next Agent Design planning step should compare two concrete architectures:

1. **Electron main + React/Vite renderer + shared TypeScript core in-process**, extracting a daemon only when agent/task lifetime requires it.
2. **Electron main + React/Vite renderer + local Node engine sidecar from day one**, closer to OpenDesign and better for long-running agents, watchers, and crash isolation.

Figma and OpenDesign together rule out two earlier shortcuts: a renderer-only React app would lack a canonical document/runtime boundary, while an OpenDesign-style iframe editor alone would not be a true code-native UI canvas.
