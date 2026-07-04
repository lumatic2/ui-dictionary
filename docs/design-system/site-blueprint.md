# Public Website Blueprint

Date: 2026-07-04

## Purpose

This document defines the actual public website shape for `ui.askewly.com`.

When this document says "landing page" or "homepage," it means the page a visitor sees at:

```text
https://ui.askewly.com/
```

It is the same level of page as `https://tailwindcss.com/`: the public front door of the product.

It answers:

- What does a first-time visitor see on `ui.askewly.com/`?
- What is the homepage's section order?
- What can the visitor click next?
- What are the top-level pages under the website?
- What should each child page contain?
- Which reference homepage patterns inform the structure?
- Which pages are public learning pages, which become asset pages, and which feed Codex/Claude Code?

This blueprint must exist before page-by-page implementation continues. Otherwise the project will drift into improving individual Tailwind-like pages without a coherent product.

## Product Promise

The homepage should say, implicitly and explicitly:

> Yusung has a broad, working digital product design system. You can browse it like a visual encyclopedia, inspect complete product UI examples, learn the behavior and design reasoning behind them, and eventually copy/download original implementation assets or use them through coding agents.

The site is not only:

- a UI term glossary;
- a Tailwind Plus clone;
- a component library;
- a portfolio;
- a static inspiration board.

It is a productized design system.

## Reference-Derived Lessons

| Reference | Site lesson |
|---|---|
| Tailwind homepage | Start with a clear product promise, show the product in use immediately, then prove it through modern web features, examples, ecosystem, and a path into Tailwind Plus. |
| Tailwind Plus | Surface-first IA, catalog leaf pages, docs leaf pages, preview cards, locked/free states, component docs with examples/API/on-this-page navigation. |
| Around homepage | Use the homepage as a visual catalog of what the buyer can build: landings, pages, shop, account, UI Kit, docs, customizer, and package claims. |
| Vercel / Geist | Public design system can double as brand proof; developer-facing surfaces need precise typography, docs, code, and systemized craft. |
| Stripe | High-trust flows need validation, localization, security/compliance framing, and complete transactional states. |
| Linear | Dense SaaS/application UI should be quiet, structured, and optimized for repeated use. |
| Radix | Component pages must document behavior contracts, accessibility, keyboard/focus, and states, not only visuals. |
| Apple HIG / Material 3 | Mobile pages need platform-specific navigation, modality, input, motion, and accessibility rules. |

## `ui.askewly.com/` Homepage

The homepage is the public product landing page.

It should be designed like a real product website, not like an internal documentation index. It should make the product identity clear and show visible UI examples immediately.

### Homepage job

1. Declare the system:
   - "Yusung Digital Product Design System"
   - subtitle: visual UI encyclopedia, product surface library, and agent-ready implementation system.
2. Show real UI immediately:
   - an immersive mosaic of working interface examples from Marketing, SaaS, Commerce, Mobile, Docs, and Components.
   - examples should be visible in the first viewport; no abstract hero illustration.
3. Expose the main browsing paths:
   - Product Surfaces
   - Patterns
   - Components
   - Foundations
   - Agent Recipes
   - Assets
4. Communicate the value split:
   - browse and learn publicly;
   - copy/download richer implementation packs later;
   - use compact recipes from Codex/Claude Code.
5. Establish provenance and originality:
   - "Reference-backed, adapted into original examples."
   - no implication that Tailwind/Around/Stripe/Vercel source is being resold.

### Homepage section order

```text
Landing
├── Hero / System Overview
│   ├── title
│   ├── short promise
│   ├── search / command input
│   └── live example mosaic
├── Browse By Surface
│   ├── Websites
│   ├── SaaS & Dashboards
│   ├── Commerce
│   ├── Mobile Apps
│   ├── Documentation
│   └── Internal Tools
├── Pattern Collections
│   ├── Marketing
│   ├── Application UI
│   ├── Ecommerce
│   ├── Navigation
│   ├── Overlays
│   ├── Forms
│   └── Data Display
├── Component Primitives
│   ├── Dialog
│   ├── Dropdown menu
│   ├── Popover
│   ├── Tabs
│   ├── Select
│   └── Command palette
├── Foundations
│   ├── Color
│   ├── Typography
│   ├── Spacing
│   ├── Motion
│   ├── Accessibility
│   └── Tokens
├── Agent-Ready Recipes
│   ├── what agents can read
│   ├── recipe preview
│   └── verification checklist
└── Asset Packs / Pricing Teaser
    ├── public browse
    ├── free copy snippets
    ├── paid copy/download future
    └── licensing/provenance boundary
```

### First viewport requirements

The first viewport must include:

- product name;
- product promise;
- a visible search/command affordance;
- at least three real UI previews, not abstract cards;
- visible navigation to browse surfaces/patterns;
- one clear route into agent recipes or code/assets.

The first viewport must not be:

- a generic hero with only text;
- a portfolio bio;
- a clone of Tailwind's exact visual identity;
- a screenshot-only inspiration wall;
- an explanation of internal repo architecture.

### Homepage content examples

Candidate hero copy:

```text
Yusung Digital Product Design System

Browse complete product UI patterns, inspect working interactions,
and give Codex or Claude Code design recipes that produce less generic screens.
```

Candidate homepage CTAs:

- Browse surfaces
- Explore components
- Open agent recipes

Candidate first mosaic items:

- SaaS dashboard command center
- Commerce checkout flow
- Mobile settings screen
- Documentation component leaf
- Marketing pricing section
- Dropdown/command palette primitive

## Top-Level Navigation

Use a structure that can scale beyond Tailwind's current category set.

```text
Home
Surfaces
Patterns
Components
Foundations
Recipes
Assets
Docs
```

### Navigation roles

| Nav item | User question answered |
|---|---|
| Home | What is this system and why should I trust it? |
| Surfaces | What complete product UI can I browse by use case? |
| Patterns | What reusable page sections and workflows can I inspect? |
| Components | What primitives and interaction behaviors are available? |
| Foundations | What color, type, spacing, motion, accessibility, and tokens drive the system? |
| Recipes | How do Codex/Claude Code use this system to build better UI? |
| Assets | What can I copy or download? What is free vs paid? |
| Docs | How is the system structured, sourced, verified, and licensed? |

## Site Map

```text
/
├── /surfaces
│   ├── /surfaces/websites
│   ├── /surfaces/saas-dashboards
│   ├── /surfaces/commerce
│   ├── /surfaces/mobile-apps
│   ├── /surfaces/documentation
│   └── /surfaces/internal-tools
├── /patterns
│   ├── /patterns/marketing
│   ├── /patterns/application-ui
│   ├── /patterns/ecommerce
│   ├── /patterns/navigation
│   ├── /patterns/overlays
│   ├── /patterns/forms
│   ├── /patterns/data-display
│   ├── /patterns/feedback
│   └── /patterns/layout
├── /components
│   ├── /components/dialog
│   ├── /components/dropdown-menu
│   ├── /components/popover
│   ├── /components/disclosure
│   ├── /components/tabs
│   ├── /components/select
│   ├── /components/autocomplete
│   ├── /components/command-palette
│   └── /components/copy-button
├── /foundations
│   ├── /foundations/color
│   ├── /foundations/typography
│   ├── /foundations/spacing-layout
│   ├── /foundations/motion
│   ├── /foundations/accessibility
│   ├── /foundations/dark-mode
│   └── /foundations/tokens
├── /recipes
│   ├── /recipes/agent-overview
│   ├── /recipes/saas-dashboard
│   ├── /recipes/checkout-flow
│   ├── /recipes/docs-leaf-page
│   ├── /recipes/mobile-settings
│   └── /recipes/verification-checklists
├── /assets
│   ├── /assets/free
│   ├── /assets/packs
│   ├── /assets/license
│   └── /assets/provenance
└── /docs
    ├── /docs/getting-started
    ├── /docs/source-model
    ├── /docs/reference-capture
    ├── /docs/schema
    └── /docs/contributing
```

## Page Types

### 1. Surface Index Page

Example: `/surfaces/saas-dashboards`

Purpose:

- show complete product UI families;
- organize by user job and density;
- link into patterns/components used by each example.

Required content:

- surface definition;
- when to use;
- common page families;
- live/interactive preview grid;
- reference-backed quality bar;
- light/dark examples;
- related patterns and components;
- agent recipe links.

### 2. Pattern Collection Page

Example: `/patterns/application-ui`

Purpose:

- teach reusable product compositions;
- group examples like page headings, command palettes, tables, sidebars, settings, modals.

Required content:

- collection overview;
- filter by density/platform/trust level;
- repeated preview cards;
- interaction smoke for each card where relevant;
- "copy prompt" public snippet;
- locked/full implementation state where applicable.

### 3. Component Leaf Page

Example: `/components/dropdown-menu`

Purpose:

- teach behavior and implementation contract.

Required content:

- title, definition, lead;
- interactive preview near top;
- anatomy;
- states;
- keyboard/focus behavior;
- accessibility contract;
- API or props/state table;
- examples;
- anti-patterns;
- related components;
- source/provenance note;
- copy/download affordance.

Reference basis:

- Tailwind docs leaf structure;
- Radix behavior guarantees.

### 4. Foundation Page

Example: `/foundations/typography`

Purpose:

- explain system-wide visual rules.

Required content:

- tokens;
- usage examples;
- good/bad comparisons;
- light/dark behavior;
- platform variants where relevant;
- implementation notes;
- agent constraints.

Reference basis:

- Geist typography/system craft;
- Around customizer;
- design-manual DESIGN.md families.

### 5. Agent Recipe Page

Example: `/recipes/checkout-flow`

Purpose:

- give Codex/Claude Code a compact implementation brief.

Required content:

- goal;
- use when / avoid when;
- structure;
- components;
- tokens;
- copy guidance;
- accessibility;
- responsive behavior;
- anti-patterns;
- verification checklist;
- linked examples and code assets.

### 6. Asset Pack Page

Example: `/assets/packs/saas-dashboard-command-center`

Purpose:

- package a reusable implementation, eventually with paid access.

Required content:

- live preview;
- included files;
- framework/dependencies;
- light/dark/responsive variants;
- interaction states;
- verification commands;
- license and usage boundary;
- provenance statement;
- copy/download CTA.

## Content Ownership

| Content type | Canonical location |
|---|---|
| Objective, PRD, roadmap | `docs/OBJECTIVE.md`, `docs/PRD.md`, `ROADMAP.md` |
| Site IA and page contract | `docs/design-system/site-blueprint.md` |
| Surface taxonomy | `docs/design-system/surface-taxonomy.md` |
| Agent asset schema | `docs/design-system/agent-asset-model.md` |
| Reference research | `docs/research/*.md` |
| Evidence screenshots | `docs/research/assets/**` |
| Site implementation | `examples/ui-vocabulary-site/` |
| External token/toolchain source | `C:\Users\yusun\projects\design-manual` |
| Executable design skills | `C:\Users\yusun\projects\custom-skills\design-*` |

## What To Keep On The Website

Keep these as public-facing site content:

- original UI examples;
- visual previews;
- interactions;
- page families;
- component behavior docs;
- foundations;
- source/provenance summaries;
- prompt snippets;
- agent recipe summaries;
- asset pack pages.

Keep these internal or linked, not primary site content:

- raw screenshots unless curated;
- copied reference page text;
- paid/commercial template source;
- local experiment dumps;
- custom skill implementation internals;
- unverified generated assets;
- one-off smoke JSON unless summarized.

## Implementation Order

Do not resume random leaf-page polishing yet. Use this order:

1. **Homepage implementation**
   - replace the current `ui.askewly.com/` first page with the homepage defined above.
   - verify desktop/mobile first viewport.
2. **Blueprint-to-app navigation**
   - align current app navigation to Home / Surfaces / Patterns / Components / Foundations / Recipes / Assets / Docs.
3. **One complete vertical slice**
   - pick one surface, one pattern collection, one component leaf, one recipe, and one asset page.
   - recommended first slice: SaaS dashboard -> Application UI -> Command palette or Dropdown menu -> SaaS dashboard recipe -> dashboard asset pack.
4. **Reference-backed page iteration**
   - only after the site shell exists, return to page-by-page implementation.
5. **Paid/access model**
   - add gated copy/download affordances after asset provenance is coherent.

## First Vertical Slice Recommendation

Choose:

```text
Surface: SaaS & Dashboards
Pattern collection: Application UI
Component leaf: Command palette
Recipe: SaaS dashboard command center
Asset pack: React/Tailwind dashboard command center
```

Reason:

- Tailwind work already has application UI and command palette evidence.
- Linear provides a dense SaaS quality bar.
- Radix provides behavior/accessibility guidance.
- Vercel/Geist provides developer-facing craft and code surface guidance.
- This slice exercises human browsing, component docs, interaction, and agent assets together.

## Completion Criteria For The Blueprint

This blueprint is ready when:

- the landing page job is defined;
- top-level navigation is defined;
- site map is defined;
- page types are defined;
- public/internal content boundaries are defined;
- implementation order is defined;
- a first vertical slice is selected.
