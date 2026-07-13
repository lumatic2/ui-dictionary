# UI Dictionary

UI Dictionary is a searchable vocabulary site for people who know what kind of interface they want, but do not yet know the names of the components.

It explains UI terms in Korean and English, shows compact visual examples, and gives prompt phrases that can be used when asking an AI coding agent to build a screen.

## Why

Vibe-coding requests often start as vague instructions like "make it clean" or "add a popup." This project turns that into more precise language: card, toggle, dropdown, modal, drawer, toast, data table, and so on.

## What it does

- Maintains a human-editable UI vocabulary dataset in `docs/ui-vocabulary/terms.yml`.
- Generates site-ready data for a Vite + React glossary app.
- Shows Korean names, English names, aliases, plain definitions, visual anatomy, anti-use cases, and prompt phrases.
- Renders small React/CSS visual examples that can be reused in cards, detail pages, and poster exports.
- Documents authoring, search, mobile, export, and deployment workflows under `docs/ui-vocabulary/`.

## Evidence

- Production target: `https://ui.askewly.com/`
- Dataset source: `docs/ui-vocabulary/terms.yml`
- Site app: `examples/ui-vocabulary-site/`
- Deployment notes: `docs/ui-vocabulary/deployment.md`

## AskewlyDesign Mac development

The root commands below are the supported entry point for the Electron
AskewlyDesign development surface. They keep the existing package-local npm
lockfiles and use npm only; this is not a workspace or package-manager
migration.

Requirements: macOS, Node `22.12+`, and npm `10+`.

```bash
npm run dev:mac       # install missing packages, build in dependency order, launch Electron
npm run bootstrap     # clean-install AskewlyDesign runtime packages, then build
npm run build:mac     # install if needed, then build with package lifecycle hooks
npm run test:mac      # install if needed, then run all runtime package test scripts
```

The fixed AskewlyDesign runtime order is `canvas-core`, `component-registry`,
`agent-design-engine`, the React renderer, the bridge, MCP, and finally the
desktop shell. After each package-local `npm ci --ignore-scripts`, bootstrap
explicitly runs the installed Electron preparation script at
`apps/agent-design-desktop/node_modules/electron/install.js`, then executes
the actual Electron.app runtime with `--version` and verifies/reports its
Apple Silicon arm64 runtime. A failed command names the package and phase
that failed. Rerun
`npm run bootstrap` after a lockfile change or damaged dependency tree; do not
use a root `npm install` to rewrite package-local lockfiles.

This is a macOS-only command contract and rejects non-Darwin hosts. Fresh-clone
bootstrap, launch, screenshots, and timing evidence belong to EQ0 Step 4; this
section does not claim that evidence. Security and packaging smokes remain
outside `test:mac` and belong to Step 4.

## Tech stack

- Vite + React + TypeScript
- Tailwind CSS
- shadcn/ui-style component patterns
- lucide-react
- YAML data source with a generated TypeScript data module

## Status

Active public project. The current focus is vocabulary coverage, search quality, mobile readability, and poster/export reuse. It is a static site: no login, backend, account storage, or user-generated content is part of the MVP.

## License

MIT. See [LICENSE](LICENSE).
