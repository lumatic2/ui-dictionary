# Tailwind Reference Model

Date: 2026-07-04

## Purpose

This model consolidates the existing Tailwind CSS / Tailwind Plus capture and parity work into a reusable design-system reference model for `ui-dictionary`.

It is not a clone brief. It separates:

- information architecture;
- page and preview patterns;
- documentation patterns;
- interaction behavior;
- verification evidence;
- transferable principles;
- non-transferable Tailwind identity.

## Source Scope

### Official Reference Surfaces

- Tailwind CSS site and docs: `https://tailwindcss.com/`
- Tailwind Plus: `https://tailwindcss.com/plus`
- Tailwind Plus UI blocks documentation: `https://tailwindcss.com/plus/ui-blocks/documentation`
- Tailwind Labs GitHub org and repo: `https://github.com/tailwindlabs`, `https://github.com/tailwindlabs/tailwindcss`

### Local Evidence

- Capture ledger: `docs/research/tailwind-plus-capture-ledger.md`
- Visual parity ledger: `docs/research/tailwind-plus-visual-parity-ledger.md`
- Catalog interactivity ledger: `docs/research/tailwind-plus-catalog-interactivity-ledger.md`
- Documentation depth ledger: `docs/research/tailwind-plus-documentation-depth-ledger.md`
- Documentation capture ledger: `docs/research/tailwind-documentation-capture-ledger.md`
- Documentation Plus capture ledger: `docs/research/tailwind-plus-documentation-capture-ledger.md`
- Catalog phase: `phases/tailwind-plus-catalog-interactivity/index.json`
- Documentation phase: `phases/tailwind-plus-documentation-depth/index.json`
- Screenshot roots:
  - `docs/research/assets/tailwind-plus-live-2026-07-01/`
  - `docs/research/assets/tailwind-plus-page-parity-2026-07-03/`
  - `docs/research/assets/tailwind-plus-catalog-interactivity-2026-07-03/`
  - `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/`
  - `docs/research/assets/tailwind-documentation-2026-07-03/`

## Evidence Summary

| Evidence area | Local result | Meaning for this model |
| --- | --- | --- |
| Catalog parity | `tailwind-plus-catalog-interactivity` has 160 completed steps | Tailwind Plus page and component surfaces were converted into local interactive previews with smoke evidence. |
| Documentation depth | `tailwind-plus-documentation-depth` has 12 completed steps | Tailwind Plus docs leaves were captured, implemented, corrected, made interactive, animated, and audited. |
| Reference screenshots | Desktop and mobile reference captures exist across docs, catalog, visual parity, and page parity folders | Future model work can compare against screenshots rather than vague memory. |
| Verification gates | Build, lint, visual audit, vocabulary validation, JSON validation, desktop/mobile smoke were repeatedly used | Tailwind reference work established the minimum verification loop for future reference intake. |
| Known browser issue | Earlier `iab` packaged browser docs issue led to Chrome extension or Playwright fallback use | Reference capture should record browser backend and fallback path. |

## Information Architecture Model

Tailwind Plus teaches through a product-surface hierarchy:

```text
Tailwind Plus
├── Marketing
│   ├── Page Sections
│   ├── Elements
│   ├── Feedback
│   └── Page Examples
├── Application UI
│   ├── Application Shells
│   ├── Headings
│   ├── Data Display
│   ├── Lists
│   ├── Forms
│   ├── Feedback
│   ├── Navigation
│   ├── Overlays
│   ├── Elements
│   ├── Layout
│   └── Page Examples
├── Ecommerce
│   ├── Components
│   └── Page Examples
└── Documentation
    ├── Getting Started
    └── Elements
```

### Transferable IA Principles

- Start with user intent and surface, not raw component names.
- Use broad product surfaces first: marketing, application UI, ecommerce, documentation.
- Nest by reusable page section, element, feedback, layout, and page-example groups.
- Keep leaf pages focused: one pattern family per page.
- Pair navigation with visible counts, preview evidence, and stable filters.
- Make documentation a first-class surface, not a secondary help page.

### Adaptation For Yusung System

Tailwind Plus categories become pattern groups under the broader taxonomy:

- `Marketing` -> `Websites / Patterns / Marketing`
- `Application UI` -> `SaaS And Dashboards / Patterns / Application UI`
- `Ecommerce` -> `Commerce / Patterns`
- `Documentation` -> `Documentation And Learning`
- `Elements` -> `Components And Primitives`

The future system should add missing top-level surfaces:

- `Mobile Apps`
- `Internal Tools`
- `Foundations`
- `Agent Recipes`

## Catalog Leaf Page Model

Tailwind Plus catalog leaves follow a repeatable page pattern:

1. Page title and category context.
2. Example count and preview/code affordance.
3. Repeated preview cards.
4. Example-specific visual rhythm.
5. Light/dark or theme controls where applicable.
6. Locked/free access state.
7. Responsive desktop/mobile behavior.

### Local Implementation Model

Local parity work improved the model by adding:

- route-level filters such as `?filter=nav%3Aplus-marketing-hero-sections`;
- accessible preview controls;
- `aria-pressed`, `aria-expanded`, and stable labels for smoke testing;
- interactive feedback for buttons, cards, rows, menus, toggles, FAQ items, plan selectors, and table cells;
- light/dark root markers such as `data-landing-page-theme`, `data-pricing-page-theme`, and element-specific markers;
- desktop and 390px mobile smoke checks;
- evidence screenshots before and after implementation.

### Transferable Catalog Principles

- A preview should behave like a miniature product surface, not a static card.
- Page examples need variant-specific structure and copy; repeated placeholders weaken the design system.
- Every interaction visible to a user should leave observable state for tests and accessibility.
- Theme controls should affect every preview root consistently.
- Mobile parity is part of completion, not a later polish pass.
- If assets are generated, each asset needs provenance and visual inspection.

## Documentation Leaf Model

Tailwind Plus documentation leaf pages provide a second model distinct from catalog pages.

Observed structure from local documentation depth work:

- persistent left navigation grouped by section;
- article header with category breadcrumb/eyebrow, large title, and lead;
- right `On this page` rail on desktop;
- component preview near the top for element leaves;
- Component API sections;
- Examples sections;
- code or API tables where appropriate;
- mobile layout with collapsed navigation and no horizontal overflow.

### Documentation Depth Requirements

Local documentation depth work established that docs pages should not be prose-only. Element pages need:

- anatomy;
- state model;
- keyboard/focus behavior;
- example usage;
- anti-patterns;
- related terms;
- API/state tables where useful;
- live preview or interactive example.

### Interaction Model From Docs Leaves

The documentation phase converted static previews into small working components:

- Autocomplete filters and selects options.
- Command palette filters and selects commands.
- Dropdown menu opens, closes, selects, and keeps trigger position stable.
- Copy button shows temporary copied feedback.
- Dialog opens, closes, cancels, confirms, and hides background controls from the accessibility tree.
- Disclosure animates expansion and manages collapsed accessibility state.
- Popover toggles panel, selects rows, and keeps trigger position stable.
- Select opens, selects, and closes options.
- Tabs switch panels with animated active state.

### Transferable Documentation Principles

- A component doc must teach behavior, not just appearance.
- API sections should connect to examples and state models.
- Animation polish matters when the preview is teaching interaction.
- Position stability is a quality requirement for menus/popovers.
- Accessibility hiding is part of the interaction contract for dialogs and collapsed panels.
- Mobile docs must be audited independently.

## Verification Model

Tailwind reference work established this completion gate:

```text
reference capture
-> local implementation
-> desktop screenshot
-> mobile screenshot
-> interaction smoke
-> theme smoke where relevant
-> build/lint/schema/visual audit
-> ledger update
```

### Reusable Verification Checks

- `npm run build`
- `npm run lint`
- `npm run audit:visuals`
- `python scripts/validate-ui-vocabulary.py`
- `python -m json.tool <phase-index>`
- desktop browser smoke
- mobile 390px browser smoke
- no severe console errors
- no positive horizontal overflow
- representative state changes checked by DOM, accessibility attributes, or screenshot

### Evidence Rules

- Every reference page should have a source URL and capture path.
- Every local adaptation should have before/after evidence if it changes UI.
- Every interaction claim should have either browser smoke JSON or screenshot evidence.
- Every phase should update its status machine.
- Browser backend should be recorded when it affects capture reliability.

## Mapping To Agent Asset Model

The Tailwind reference work maps into `docs/design-system/agent-asset-model.md` as follows:

| Agent asset entity | Tailwind-derived mapping |
| --- | --- |
| `surface` | Marketing, Application UI, Ecommerce, Documentation map to Websites, SaaS/Dashboards, Commerce, Documentation/Learning. |
| `pattern` | Hero sections, pricing, headers, flyouts, tables, checkout pages, etc. become reusable pattern records. |
| `component` | Tabs, dropdown menu, popover, dialog, disclosure, select, command palette, copy button become primitive/component records. |
| `token_set` | Tailwind visual choices inform spacing, density, radius, contrast, and motion notes, but exact Tailwind brand identity is not copied. |
| `example` | Each local preview card or docs leaf preview becomes an example candidate with screenshots and smoke evidence. |
| `source_ref` | Tailwind URL + local capture path + observation notes. |
| `code_asset` | Local original React/Tailwind implementations, not Tailwind Plus source. |
| `agent_recipe` | Implementation guidance derived from observed structure, interaction states, and verification checks. |

## Non-Transferable Identity

Do not treat these as Yusung's final design identity:

- Tailwind brand colors, gradients, and illustration style;
- Tailwind Plus paid template source;
- exact page copy, example names, or commercial packaging language;
- locked content internals;
- Tailwind-specific utility class choices as the only implementation path;
- the assumption that all surfaces should look like Tailwind marketing pages.

## Transferable Principles

These should be carried forward:

- surface-first IA;
- preview-card teaching model;
- docs leaf structure with API/examples/on-this-page;
- mobile and desktop evidence capture;
- light/dark preview controls;
- stateful interactive examples;
- explicit accessibility attributes;
- stable trigger positioning for overlays;
- component examples that are both visual and behavioral;
- capture ledger plus implementation ledger;
- code/assets separated from commercial source.

## Gaps Revealed

The Tailwind reference work is strong for:

- marketing pages;
- web application UI;
- ecommerce;
- component docs;
- interactive primitives;
- verification workflow.

It is weak or incomplete for:

- native mobile app conventions;
- internal tools beyond generic application UI;
- paid asset/download business model design;
- non-Tailwind visual identities;
- agent-facing generated recipe packages;
- repository architecture, which requires the deferred Tailwind Labs repo deep dive.

## Next Actions

1. Use this model as the template for `docs/research/around-template-system-capture.md`.
2. Convert selected Tailwind examples into first-class `surface`, `pattern`, `component`, `example`, and `agent_recipe` records after the schema is implemented.
3. Defer `tailwindlabs/tailwindcss` repo architecture research until the site/docs reference model has been applied to at least one non-Tailwind source.
4. Preserve all existing Tailwind evidence paths; do not collapse them into this summary.

## RME1 Completion Check

RME1 is complete when this document:

- inventories local Tailwind evidence;
- explains the IA model;
- explains catalog and documentation leaf models;
- separates transferable principles from non-transferable identity;
- maps Tailwind evidence into the agent asset model;
- names remaining gaps and next actions.
