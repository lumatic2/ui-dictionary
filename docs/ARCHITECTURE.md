# Architecture - Askewly Design

## Current Stack

- App: Vite + React + TypeScript
- Styling: Tailwind CSS
- UI Kit: shadcn/ui
- Icons: lucide-react
- Current data source: `docs/ui-vocabulary/terms.yml`
- Current generated data: site-local TypeScript modules
- Verification: TypeScript build, lint, visual audit scripts, browser smoke checks

ADR 0001 keeps the static React site as the first delivery vehicle. ADR 0002 expands the product contract beyond the original UI vocabulary site.

## System Shape

The repository should evolve into two connected surfaces:

### Human-Facing Website

The website is the browseable front door. It shows product surfaces, examples, components, states, color systems, typography, layout, motion, and implementation notes.

Near-term surface groups:

- Web and landing pages
- Mobile apps
- SaaS and dashboards
- Commerce
- Documentation
- Marketing
- Application UI
- Internal tools
- Components and interaction primitives

### Agent-Facing Design System

Agents need stable, structured guidance instead of only screenshots or prose. The system should expose:

- design tokens: color, typography, spacing, radius, elevation, motion;
- pattern recipes: when to use a pattern, anatomy, states, responsive behavior, accessibility requirements;
- component recipes: implementation guidance and anti-patterns;
- prompt recipes: human language that maps to concrete UI decisions;
- code assets: copyable React/Tailwind examples and future downloadable packs;
- evidence links: screenshots, reference captures, parity ledgers, smoke results.

### Agent Design Desktop Canvas

The desktop app is a third connected surface, not a wrapper around the website or CLI.

- **Canonical document:** versioned JSON scenegraph/document containing frames, groups, code-backed components, text, instances, layout constraints, typed props, token bindings, modes, and variants.
- **Renderer boundary:** the canonical document is independent of DOM, WebGPU, SVG, or CanvasKit. AUC0 selects the renderer from reproducible evidence.
- **Code runtime:** real React/HTML/CSS renders in an isolated preview; selected runtime nodes map back to stable document IDs and source locations.
- **Editor overlay:** zoom/pan, selection bounds, resize handles, guides, hit testing, and manipulation state live outside project code.
- **Local engine:** shared TypeScript core owns project scanning, document/code transforms, diffing, verification, and CLI parity. It may begin in Electron main or a supervised Node sidecar; AUC0/architecture ADR decides the lifecycle boundary.
- **Desktop authority:** filesystem, process, editor/Explorer, and watcher capabilities stay behind typed host contracts. Project code receives no Electron/Node authority.
- **Quality gate:** renderer candidates must pass shared 1k/5k/10k-node, pointer latency, Korean IME, responsive, nested component, screenshot-diff, memory, recovery, accessibility, and source-round-trip fixtures.

Research basis: `references/figma-product-architecture/ANALYSIS.md` + `references/nexu-io-open-design/ANALYSIS.md`. Figma contributes the canonical scenegraph/derived-state/code-layer model; OpenDesign contributes the Electron/local-engine/sandbox/agent-adapter model.

## Project Layout Direction

```text
ui-dictionary/
├── docs/
│   ├── OBJECTIVE.md
│   ├── PRD.md
│   ├── ARCHITECTURE.md
│   ├── horizons/
│   ├── plans/
│   ├── adr/
│   ├── design-system/          # future system model, taxonomy, tokens, recipes
│   ├── research/               # reference capture ledgers and screenshots
│   └── ui-vocabulary/          # original vocabulary data, still useful
├── examples/
│   └── ui-vocabulary-site/     # current React website
├── phases/                     # harness product status machines
├── methodology/
├── templates/
└── scripts/
```

## Data Model Direction

The current `terms.yml` model remains useful for vocabulary entries, but the broader system needs additional entities:

- `surface`: product context such as mobile app, SaaS dashboard, docs site, commerce flow;
- `pattern`: reusable composition such as pricing table, command palette, onboarding stepper, settings page;
- `component`: smaller primitive such as tabs, dropdown menu, popover, dialog, select;
- `token_set`: color, type, spacing, radius, motion, and elevation decisions;
- `example`: rendered implementation with screenshots, interaction notes, source code, and provenance;
- `agent_recipe`: implementation instructions, anti-patterns, and prompt language for coding agents;
- `asset_pack`: future paid/downloadable bundle.

## Reference Intake Direction

External references should be captured with provenance:

1. Reference URL or repository.
2. Screenshot or code evidence.
3. What is being learned.
4. What is adapted into Yusung's system.
5. What is rejected to avoid copying another identity.
6. Verification evidence from the local implementation.

Tailwind CSS, Tailwind Plus, and Tailwind Labs repositories are important starting references, but the architecture must also support mobile and product-system references such as Apple HIG, Material Design, Stripe, Vercel, Linear, and local `design-manual` work.

## Verification

Source changes should continue to pass:

- `cd examples/ui-vocabulary-site && npm run build`
- `cd examples/ui-vocabulary-site && npm run lint`
- `cd examples/ui-vocabulary-site && npm run audit:visuals`
- `python scripts/validate-ui-vocabulary.py`
- browser smoke checks for key desktop and mobile pages when UI changes

Documentation-only changes should be checked with targeted file existence and text search commands, plus JSON validation if phase/status files are edited.

## Open Architecture Questions

- Which schema format should become canonical for surfaces, patterns, examples, tokens, and agent recipes?
- Which renderer wins AUC0: DOM/React overlay, DOM+WebGPU overlay, SVG+embedded DOM, or CanvasKit/custom WebGPU?
- Does the local engine start inside Electron main or as a supervised Node sidecar?
- How should paid code/assets be separated from public browseable examples?
- Which local design repositories should be imported, linked, or kept separate?
- Should agent-facing output be plain Markdown, JSON, generated TypeScript, DESIGN.md, or multiple synchronized artifacts?
