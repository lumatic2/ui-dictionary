# Agent Design desktop app reverse engineering

- Date: 2026-07-10
- Purpose: decision material for the next Askewly Design horizon
- Scope: Figma, Open Design, and toolshelf references relevant to an agent-native desktop UI canvas
- Boundary: this document extracts product and architecture principles. It does not authorize cloning another product's identity or starting implementation.

## 1. Working question

How should Agent Design turn the existing Askewly system and `askewly-design` CLI into an agent-native, code-native UI canvas?

User decision (2026-07-10): Agent Design is a **code-native UI canvas**. Its primary loop is:

1. create or attach a real code project;
2. compose frames and real UI components on a visual canvas;
3. select, move, resize, restyle, and change component states directly;
4. ask a canvas-docked agent to create or revise UI using Askewly tokens and recipes;
5. preview the resulting code diff, apply through the shared CLI/core, and verify the live result.

The canvas is the product identity. Local filesystem access, change watching, diffing, and verification are supporting infrastructure. V1 is not a general illustration/vector tool: it is a UI composition surface whose elements remain renderable, inspectable code.

## 2. Figma: product model to extract

### Observed system

- Figma separates the **file browser** from the **file workspace**. Files live inside projects/teams, while drafts provide a private experimentation state before promotion.
- The design workspace has four stable regions: canvas, left navigation/layers/assets, right context-sensitive properties, and a compact bottom toolbar.
- Selection is the primary context boundary. The right panel changes with selected object, access level, and mode; the desktop MCP server also uses the current selection as agent context.
- Reuse is governed through libraries. Components, styles, and variables have an explicit publish → review → accept-update lifecycle instead of silently mutating every consumer.
- Variables support collections, aliases, and modes. The same semantic value can resolve differently for light/dark, device, or locale contexts.
- Dev Mode turns the same design source into an implementation surface rather than creating a disconnected developer product.
- Figma's desktop-specific advantages are narrow: local fonts, desktop selection context, dedicated windowing, and limited offline continuation. Figma explicitly does not offer a fully featured offline mode.

### Principles for Agent Design

1. **Project first, tool second.** Start from a local project browser/recent list, then enter one bounded workspace.
2. **Selection drives detail.** Selecting a token, issue, recipe, or changed file should determine the inspector content.
3. **One source, multiple modes.** Browse, inspect, preview, and verify should be modes over the same project state, not separate products.
4. **Updates are reviewable.** Recipe/token application must produce a reviewable proposal and require an explicit apply action.
5. **Context is visible.** The user must always see which project, file, token set, recipe, and change set the app is operating on.

### What not to copy

- Freeform vector illustration, pen/path tooling, multiplayer editing, and Figma's cloud document hierarchy are outside the first horizon.
- The central canvas must render real UI and editable component structure. A screenshot pasted into a Figma-like shell does not qualify.

## 3. Open Design: product and architecture to extract

### Verified source state

- Local toolshelf clone: `nexu-io/open-design`, commit `bc89144`, package version `0.10.0`, Apache-2.0.
- Product shape: Next.js web UI + long-running local Node daemon + Electron desktop/packaging surfaces.
- The desktop app is a host around a reusable engine. The daemon owns project sessions, filesystem artifacts, agent adapters, skills, design systems, and export/preview pipelines.
- It supports local folder import, project-scoped context, linked code folders, live artifact refresh, element-level preview comments/tweaks, and multiple coding-agent adapters.
- Generated HTML/JSX is shown inside a sandboxed iframe. Durable artifacts are files on disk; session state is separate.
- Security-sensitive desktop powers are explicit: localhost binding, sandboxed previews, trusted folder-picker flow, short-lived single-use HMAC tokens, and guarded `openPath` IPC.

### Principles for Agent Design

1. **Keep the engine headless.** The CLI/core remains independently usable; the desktop app is another client.
2. **Desktop authority stays behind a narrow bridge.** Folder selection, file reads/writes, open-in-editor, and watch events should not leak into the renderer.
3. **Preview untrusted output in isolation.** Rendered code previews need a sandbox and a clear project boundary.
4. **Durable artifacts beat hidden app state.** Scan reports, proposed diffs, and verify results should be inspectable files or deterministic engine output.
5. **Do not inherit Open Design's breadth.** Agent spawning, general slides/video/image generation, large template catalogs, and cloud topologies are not required for v1.

## 4. Toolshelf references

### Recommended

1. `open-design` — primary architecture and interaction reference.
   - Use: source-level teardown of host/daemon/renderer, folder import, artifact preview, and safety boundaries.
   - Constraint: large monorepo and far broader product scope; reference only.
2. `pencil-dev` — secondary reference for repo-local, agent-readable design artifacts.
   - Use: evaluate whether a future Agent Design artifact should be versionable beside code.
   - Constraint: private source, account/auth dependency, and unclear CLI licensing; do not adopt as a dependency.
3. `stitch` — future seed-screen ideation tool after the product contract is fixed.
   - Use: generate one desktop seed screen from `DESIGN.md`, then critique before expanding.
   - Constraint: web service and possible API/billing setup; not an architecture source.

### Supporting

- `shadcn-ui` — owned React primitives for the renderer; add only needed components.
- `orca-ai-agent-orchestrator` — Electron host/renderer/daemon and Windows desktop reference if Agent Design later embeds long-running agent sessions. Not needed for v1.
- `taste-skill` — optional visual audit after the workflow is real. It should not define the product structure.

### Hold

- `pencil-dev` runtime integration: revisit only if Agent Design gains a repo-local canvas artifact.
- `stitch` generation: use after horizon decisions, not to let generated screens decide the product.
- General agent orchestration: excluded from the first horizon.

## 5. Product synthesis

### Recommended identity

**Agent Design is an agent-native, code-native UI canvas.** People visually compose and edit real interface components while a docked agent consumes the same tokens, recipes, code, and verification rules.

### Primary loop

```text
Open or create project
→ place a frame or component on canvas
→ select / move / resize / configure state
→ ask the docked agent to create or revise UI
→ inspect component structure and exact code diff
→ apply through shared CLI/core
→ verify the live rendered result
```

### Initial workspace anatomy

- Left: project/pages, layers, components, tokens, and recipes.
- Center: zoomable UI canvas containing real frames and code-backed components.
- Right: selected element properties plus the docked canvas agent; diff/checks appear contextually.
- Bottom/status: breakpoint/mode, engine state, verification result, and project risk warnings.

### Explicit non-goals for the first horizon

- arbitrary vector illustration, pen/path editing, or a general graphics suite;
- multiplayer/cloud document model;
- general-purpose chat unrelated to the selected canvas/project context;
- design generation across slides/video/image formats;
- plugin marketplace;
- account, payment, or Pro asset enforcement;
- background clipboard or global color-picker monitoring.

## 6. Verified technology comparison

Detailed evidence:

- `references/figma-product-architecture/ANALYSIS.md`
- `references/nexu-io-open-design/ANALYSIS.md`

| Layer | Figma | OpenDesign |
|---|---|---|
| Desktop | Electron | Electron 41.3 |
| Product UI | proprietary web editor chrome | Next.js 16 + React 18 + Tailwind 4 |
| Canonical model | scenegraph object tree with stable IDs and property maps | user files/artifacts + SQLite app metadata; no independent canvas scenegraph |
| Visual rendering | C++ engine → Wasm/native → WebGPU, with WebGL compatibility | sandboxed HTML/JSX iframe preview |
| Code on canvas | React code layers as a native canvas primitive | rendered file preview addressed through DOM/source metadata |
| Direct editing | scenegraph operations, component/variable/property runtimes | `data-od-id`/source-path selection bridge + `postMessage` + source patches |
| Code tooling | CodeMirror; esbuild + Tailwind 4 + Lightning CSS in Web Worker/Wasm | Babel/React preview paths plus Node daemon and project toolchains |
| Local engine | C++/Wasm editor engine | Node 24 + Express 5 daemon, better-sqlite3, chokidar, node-pty |
| Agents | Figma-native AI/MCP surfaces | CLI/ACP adapter registry for Claude Code, Codex, and others |
| Collaboration | WebSocket sync, centralized CRDT-inspired fields, Rust, Eg-walker for code | local-first; no multiplayer canvas core |

### Combined implication

- Figma supplies the missing **canonical document/scenegraph, derived state, property binding, and code-layer model**.
- OpenDesign supplies the practical **Electron host, local engine, filesystem watcher, sandboxed preview, source-selection bridge, and coding-agent adapter model**.
- Agent Design cannot use only one side. A Figma-style GPU/vector engine is excessive for v1, while an OpenDesign-style iframe editor alone is not a true canvas.
- The credible v1 architecture is a hybrid: canonical canvas document + DOM/React rendering in an isolated preview + editor overlay + local TypeScript engine. The remaining decision is whether the local engine starts in Electron main or as a supervised Node sidecar.
- A renderer that reimplements CLI logic remains rejected because it would create two design engines and violate ADR 0004.

## 7. Horizon candidate

Working title: **Agent-Native UI Canvas**

Proposed milestones:

1. **AUC1 — Canvas foundation and document model**
   - Open/create a project; render frames and code-backed components on a zoomable canvas; preserve a deterministic document/code mapping.
2. **AUC2 — Direct manipulation and inspector**
   - Select, move, resize, reorder, edit properties/tokens, and switch component states with undo/redo and responsive frame awareness.
3. **AUC3 — Canvas agent and design-system context**
   - Dock an agent to the current selection/project; create or revise UI through Askewly tokens, recipes, checks, and anti-patterns.
4. **AUC4 — Code round-trip, verification, and desktop packaging**
   - Preview exact code diffs, apply through the shared engine, verify the live result, and package the representative Windows flow.

Horizon close evidence should be one real fresh-project flow: create/open → compose on canvas → directly edit → ask the canvas agent for a revision → inspect diff → apply → verify, with the app and CLI/core producing the same code result and no duplicated business logic.

## 8. User-owned decisions before authoring the horizon

1. Product identity: **code-native UI canvas** — confirmed by user, 2026-07-10.
2. Canvas model: canonical JSON document/scenegraph + sandboxed DOM/React renderer + editor overlay (research-backed recommendation).
3. Host: Electron is used by both references; Tauri would require a separate Node/Bun bridge for the current TypeScript core.
4. Engine topology: run shared TypeScript core in Electron main initially, or supervise a local Node sidecar from day one.
5. Platform: **Windows-first** installer with macOS later, or cross-platform packaging in the same horizon.
6. Apply contract: guarded in-app writes after exact diff confirmation (recommended), or read-only code export.
7. Agent scope: a selection-bound canvas agent is core; unrelated general-purpose chat remains out of v1.

## Sources

Accessed 2026-07-10.

- Figma, Explore design files: https://help.figma.com/hc/en-us/articles/15297425105303-Explore-design-files
- Figma, Guide to files and projects: https://help.figma.com/hc/en-us/articles/1500005554982-Guide-to-files-and-projects
- Figma, Guide to libraries: https://help.figma.com/hc/en-us/articles/360041051154-Guide-to-libraries-in-Figma
- Figma, Variables, collections, and modes: https://help.figma.com/hc/en-us/articles/14506821864087-Overview-of-variables-collections-and-modes
- Figma, Dev Mode: https://help.figma.com/hc/en-us/articles/15023124644247-Guide-to-Dev-Mode
- Figma, Remote and desktop MCP comparison: https://help.figma.com/hc/en-us/articles/35281385065751-Figma-MCP-collection-Compare-Figma-s-remote-and-desktop-MCP-servers
- Figma, Local fonts: https://help.figma.com/hc/en-us/articles/360039956894-Add-a-font-to-Figma
- Figma, Offline behavior: https://help.figma.com/hc/en-us/articles/360040328553-What-can-I-do-offline-in-Figma
- Open Design repository: https://github.com/nexu-io/open-design
- Open Design architecture: https://github.com/nexu-io/open-design/blob/main/docs/architecture.md
- Open Design quickstart: https://github.com/nexu-io/open-design/blob/main/QUICKSTART.md
- Tauri 2 documentation: https://v2.tauri.app/start/
