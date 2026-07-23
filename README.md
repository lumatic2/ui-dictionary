# Askewly Design

Askewly Design is a design system that spans every form of design work — product design, slide design, and frontend design. This repository (`ui-dictionary`) is its canonical source.

It has three faces:

- **A public reference site** people browse, compare, and learn from — live at `https://ui.askewly.com/`.
- **An agent-facing design system** that Codex and Claude Code actually read while building UI, published at `https://ui.askewly.com/llms.txt`.
- **The AskewlyDesign app** (in development), a desktop editor where the canvas is code rather than a vector file, and an agent edits the same canonical document you do.

## Why

Coding agents already write senior-level code. They do not yet make senior-level design decisions. Askewly Design supplies the missing half: tokens as a single source of truth, pattern recipes, component guidance, and anti-patterns — so the output looks deliberately designed rather than generically generated.

The same gap shows up on the human side. Requests often start as "make it clean" or "add a popup." The vocabulary layer turns that into precise language: card, toggle, dropdown, modal, drawer, toast, data table.

## Scope

Websites, mobile apps, SaaS products, commerce flows, dashboards, documentation sites, marketing pages, internal tools, and application UI patterns — plus print and presentation output such as slides and PDFs, which are read rather than operated.

Different media get different gates. Screens are checked for states and dark mode; print is checked by rendering the final format itself and looking at the actual pages.

## What ships today

- A human-editable UI vocabulary dataset in `docs/ui-vocabulary/terms.yml`, with Korean and English names, aliases, plain definitions, visual anatomy, anti-use cases, and prompt phrases.
- Small React/CSS visual examples for each term, reusable in cards, detail pages, and poster exports.
- The agent-facing system under `docs/design-system/` — entry protocol, style signature, tokens, recipes, anti-patterns.
- Authoring, search, mobile, export, and deployment workflows documented under `docs/ui-vocabulary/`.

## Map

- North star: `CLAUDE.md` 「북극성」 절
- Working brief and conventions: [CLAUDE.md](CLAUDE.md)
- Milestones and status: [ROADMAP.md](ROADMAP.md)
- Production target: `https://ui.askewly.com/`
- Agent entry point: `https://ui.askewly.com/llms.txt`
- Site app: `examples/ui-vocabulary-site/`
- Deployment notes: [docs/ui-vocabulary/deployment.md](docs/ui-vocabulary/deployment.md)

## Tech stack

- Vite + React + TypeScript
- Tailwind CSS
- shadcn/ui-style component patterns
- lucide-react
- YAML data source with a generated TypeScript data module
- `DESIGN.md` (Google Stitch open format) as the design token format

## Status

Active public project. The reference site is a static site — no login, backend, account storage, or user-generated content. The desktop app is under development and not yet released.

## License

MIT. See [LICENSE](LICENSE).
