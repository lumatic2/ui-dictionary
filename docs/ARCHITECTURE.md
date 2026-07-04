# Architecture - Yusung Digital Product Design System

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
- How should paid code/assets be separated from public browseable examples?
- Which local design repositories should be imported, linked, or kept separate?
- Should agent-facing output be plain Markdown, JSON, generated TypeScript, DESIGN.md, or multiple synchronized artifacts?
