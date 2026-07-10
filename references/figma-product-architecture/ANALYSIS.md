# Figma product architecture analysis

- Analysis date: 2026-07-10
- Source type: closed-source product reconstructed from first-party engineering publications and developer documentation
- Confidence rule: confirmed facts are limited to what Figma has published; undocumented implementation details are not inferred as facts

## 1. Summary

Figma is not a conventional DOM editor with draggable HTML boxes. Its visual editor is closer to a game/editor engine:

- The canonical design document is a **scenegraph-like tree of objects**. Each object has a stable ID and property map; pages and nested layers form the hierarchy shown by the layers panel.
- The main visual canvas is rendered by a **C++ graphics engine**. On the web it is compiled to WebAssembly; current rendering uses **WebGPU** with compatibility for the older WebGL path. Native builds share the graphics abstraction and use Dawn to reach platform GPU APIs.
- Because the canvas is not rendered as semantic HTML, Figma separately maintains an internal accessibility tree and a React **Mirror DOM** synchronized with the scenegraph.
- The desktop app is **Electron**, originally chosen to reuse the web product rather than fork a native application.
- Modern code layers are a new canvas primitive backed by **React code**. They can be nested, moved, resized, reparented, duplicated, and connected to visual property controls.
- Code editing uses **CodeMirror**. Bundling/typechecking runs mainly in a **Web Worker** with esbuild, Tailwind CSS v4, and Lightning CSS; native portions compile to WebAssembly. Packages can resolve from NPM or ESM URLs inside a sandbox.
- Realtime document sync uses WebSockets and a centralized, CRDT-inspired property model. Figma document fields use server-authoritative ordering; code text uses Eg-walker for concurrent edit merging. Performance-critical multiplayer work moved from TypeScript to Rust.

This architecture separates at least five runtimes: editor chrome, scenegraph/document state, GPU rendering, code-layer execution, and collaborative persistence. That separation is the central technical lesson for Agent Design.

### Primary sources

All sources accessed 2026-07-10.

- Figma rendering: Powered by WebGPU — https://www.figma.com/blog/figma-rendering-powered-by-webgpu/
- Figma is powered by WebAssembly — https://www.figma.com/blog/webassembly-cut-figmas-load-time-by-3x/
- Introducing BrowserView for Electron — https://www.figma.com/blog/introducing-browserview-for-electron/
- How Figma's multiplayer technology works — https://www.figma.com/blog/how-figmas-multiplayer-technology-works/
- Rust in production at Figma — https://www.figma.com/blog/rust-in-production-at-figma/
- Making multiplayer more reliable — https://www.figma.com/blog/making-multiplayer-more-reliable/
- Canvas, meet code: Building Figma's code layers — https://www.figma.com/blog/building-figmas-code-layers/
- Building accessibility into a canvas-based product — https://www.figma.com/blog/building-accessibility-into-a-canvas-based-product/
- Improving performance in the layers panel — https://www.figma.com/blog/improving-performance-in-the-layers-panel/
- How we rebuilt the foundations of component instances — https://www.figma.com/blog/how-we-rebuilt-the-foundations-of-component-instances/
- A tale of two parameter architectures — https://www.figma.com/blog/a-tale-of-two-parameter-architectures/

## 2. Architecture and subsystem map

Figma is proprietary, so there is no verifiable repository directory map. The observable subsystem map is:

```text
Electron desktop shell / browser
└── editor chrome
    ├── layers/assets/pages panel
    ├── properties/inspector panel
    ├── toolbar and commands
    └── CodeMirror IDE for code layers

canonical document runtime
├── scenegraph: object ID → property map
├── component/instance materialization
├── variables and component-property bindings
├── layout and constraint systems
├── undo/redo and selection state
└── derived-property dependency graph and caches

rendering runtime
├── C++ engine
├── web: C++ → WebAssembly → WebGPU/WebGL
├── native: C++ → Dawn → platform GPU API
└── separate React Mirror DOM for accessibility

code-layer runtime
├── React component primitive embedded in canvas
├── CodeMirror source editor
├── Web Worker development toolchain
├── esbuild + Tailwind v4 + Lightning CSS (Wasm-assisted)
├── NPM / ESM dependency resolver
└── secure execution sandbox

collaboration and storage
├── WebSocket client/server sync
├── server-authoritative property updates
├── Rust performance-critical per-document processes
├── Eg-walker merge for source-code text
├── in-memory active document state
├── binary compressed checkpoints + S3
├── incremental journal / write-ahead log
└── Postgres for comments, users, teams, and projects
```

### Current performance architecture

- **Layers panel:** a first pass computes only ordered row IDs; a second computes detail only for windowed rows. Derived properties track dependencies, compute lazily, and cache at subtree granularity.
- **Components:** the older monolithic Instance Updater was replaced by Materializer, a generic reactive system for derived document subtrees. Layout, variable evaluation, and instance materialization have separate ownership and a more unidirectional update flow.
- **Parameters:** variables and component properties share value types and binding primitives. The runtime tracks usage, invalidates affected properties, resolves values, and triggers targeted renders.
- **Accessibility:** the GPU scenegraph remains visual authority; React Mirror DOM mirrors only the semantic state needed by assistive technology and synchronizes focus/selection in both directions.

## 3. Component mapping to Agent Design

| Figma subsystem | Agent Design equivalent | Relevance for v1 |
|---|---|---|
| scenegraph object tree | canvas document: frames, code components, text, groups, instances | required |
| object property map | serializable props, layout, token bindings, responsive constraints | required |
| WebGPU/Wasm C++ renderer | DOM/React renderer plus editor overlay | do not copy initially |
| layers panel two-pass/windowing | hierarchical project/layer panel with virtualization | required once files grow |
| Materializer derived subtrees | component instance expansion and derived responsive states | design for, implement minimally |
| unified parameter binding | tokens, component props, modes, variants | required |
| React code layers | code-backed canvas component primitive | direct precedent |
| CodeMirror | optional source pane for selected component | later v1 milestone |
| Web Worker toolchain | background parsing, bundling, type analysis, screenshot/verify work | required for responsiveness |
| Mirror DOM | unnecessary when actual UI is DOM-rendered; accessibility comes from real elements | explicit advantage of our narrower model |
| Electron shell | reusable cross-platform desktop host | candidate, not yet selected |
| multiplayer + Eg-walker | collaborative editing | defer beyond first horizon |
| checkpoint + journal | local canvas snapshots + deterministic undo/redo log | lightweight local form required |

The critical mapping is not “copy Figma's renderer.” It is “copy Figma's separation of canonical document, derived state, renderer, editor chrome, and code runtime.” Agent Design can preserve this boundary with a much simpler DOM renderer because its canvas elements are UI components rather than arbitrary vector geometry.

## 4. Impressive patterns and cautions

### Patterns worth retaining

1. **Code is a first-class canvas primitive.** A React component is not merely an export target; it participates in move/resize/reparent/layout/duplicate operations like any other canvas layer.
2. **Visual properties map to code properties.** React props become toggles, sliders, dropdowns, and token selectors rather than opaque source edits.
3. **Canonical state is not the rendered surface.** The scenegraph/document is authoritative; GPU pixels, panels, and accessibility DOM are projections.
4. **Dependency-aware derived state.** Large trees remain interactive by invalidating only affected subtrees and computing visible panel rows lazily.
5. **Separate ownership of layout, parameters, and instances.** The Materializer rewrite shows the cost of one subsystem trying to coordinate every derived behavior.
6. **Worker-isolated code toolchain.** Bundling and type work cannot share the UI thread with pointer interaction.
7. **Side-by-side variants are cheap forks.** Canvas duplication supports exploration without requiring a Git branch per visual alternative.

### Cautions

- A GPU scenegraph canvas loses browser accessibility and requires a synthetic DOM, hit testing, text editing, layout, selection, and input system. That cost is unjustified for Agent Design's first code-native UI canvas.
- Figma's decade of accumulated component and variable complexity required major runtime rewrites. Agent Design should define one parameter/binding model before separate token, prop, and mode systems drift.
- Electron is confirmed as Figma's shell, but that does not prove Electron is automatically right for Agent Design. Figma's C++/Wasm renderer and cloud collaboration dominate constraints that Agent Design may not share.
- Figma's multiplayer and cloud file model are not MVP requirements. Copying them would obscure the local, code-native wedge.

## 5. Impact on Agent Design definition

### Adopt now as product/architecture constraints

1. Define a canonical, versioned **canvas document model** independent of React rendering.
2. Make **React/code components a layer type**, with visual controls mapped to typed props and Askewly tokens.
3. Use a real DOM/React preview for v1, wrapped by a separate editor overlay for selection, bounds, resize handles, guides, and zoom/pan.
4. Keep canvas interaction on the main thread and move parsing/bundling/type analysis to a Web Worker or separate local process.
5. Use one shared parameter-binding model for tokens, component props, modes, and variants.
6. Design undo/redo as operations over the canonical document, not ad-hoc component state.

### Explicitly defer

- C++/WebAssembly/WebGPU renderer;
- arbitrary vector paths and graphics editing;
- multiplayer/CRDT/Eg-walker collaboration;
- cloud projects/teams/permissions;
- synthetic accessibility DOM, because v1 should retain actual semantic DOM.

### Decision implication

Figma evidence supports a **hybrid DOM canvas architecture**, not a pure screenshot preview and not a full GPU/vector clone. The remaining stack decision must be made only after comparing OpenDesign's local daemon, preview bridge, desktop shell, and agent runtime.
