# Tailwind Reference IA Research and UI Vocabulary Redesign Plan

Date: 2026-06-30
Mode: harness product planning
Scope: reference-backed redesign plan for UI Vocabulary navigation, term explanation, and taxonomy

## Context

We are adopting Tailwind CSS and Tailwind Plus as the primary reference for the UI Vocabulary site's information architecture, side navigation, term explanation style, and example flow.

Reference URLs:

- https://tailwindcss.com/
- https://tailwindcss.com/docs
- https://tailwindcss.com/plus
- https://tailwindcss.com/plus/ui-blocks
- https://tailwindcss.com/plus/templates
- https://tailwindcss.com/plus/ui-kit

This plan does not implement the redesign yet. It records the research, product direction, stop points, and step tree so implementation can proceed deliberately after approval.

## Planning Gate

```yaml
planning_gate:
  team_validation_mode: manual-pass
  spec_delta: "Move UI Vocabulary from abstract internal axes toward a Tailwind-like IA: user-facing surface/context first, concrete UI block families second, CSS/design concepts as a separate learning lane."
  perspectives:
    product: "Beginners should not have to understand 'topic/kind/use case' before browsing. They should start from the kind of screen they want to build or the UI object they are trying to name."
    architecture: "This will affect sidebar state, URL filters, search metadata, category/kind/useCase semantics, generated data, schema docs, validators, and possibly term detail layout."
    security: "No auth, secret, payment, or external write surface. Risk is limited to data-model drift and confusing migrated filters."
    qa: "Each step needs schema validation, generated-data checks, lint/build, duplicate audit, visual audit, and Chrome smoke for representative navigation paths."
    skeptic: "Copying Tailwind too literally can make a vocabulary site feel like a component catalog. Keep our learning goal: terms, definitions, visual anatomy, prompt phrasing, related concepts."
  dod:
    - "The redesigned sidebar has one primary browse tree and avoids showing the same card as a first-class item in multiple top-level trees."
    - "Secondary axes become filters/chips, not competing navigation hierarchies."
    - "Term detail pages follow a stable short-definition -> why/use -> visual anatomy -> examples -> related concepts flow."
    - "Chrome smoke confirms users can reach Marketing, Application UI, Ecommerce, UI Blocks, CSS/Design Concepts, and Accessibility paths without hidden-scrollbar regressions."
```

## Tailwind Reference Map

### 1. Home Page: Product Entry Before Taxonomy

Tailwind's homepage starts with the product promise, then separates the user's next action into a small set of entry points:

- `Docs`
- `Blog`
- `Showcase`
- `Partners`
- `Plus`
- `Get started`

The important IA pattern is not the exact labels. It is that the home page does not expose every CSS property or component family at once. It tells the user what Tailwind is for, then sends them to either learning (`Docs`) or ready-made assets (`Plus`).

Implication for UI Vocabulary:

- The first screen should not make `주제별 / 형태별 / 상황별` compete as equal concepts.
- Primary browse should answer: "What are you trying to name or build?"
- Search remains prominent because many users arrive with partial words like "모달", "glass", "카드", "로그인".

### 2. Docs: Concept and Property Taxonomy

Tailwind Docs groups material by CSS/design concept families:

- Getting started
- Core concepts
- Base styles
- Layout
- Flexbox & Grid
- Spacing
- Sizing
- Typography
- Backgrounds
- Borders
- Effects
- Filters
- Tables
- Transitions & Animation
- Transforms
- Interactivity
- SVG
- Accessibility

Inside those groups, entries are named with concrete property/concept labels such as `aspect-ratio`, `display`, `overflow`, `z-index`, `gap`, `padding`, `font-weight`, `line-clamp`, `border-radius`, `box-shadow`, `opacity`, `backdrop-filter`, `animation`, `cursor`, and `forced-color-adjust`.

Implication for UI Vocabulary:

- Our `style`, `layout-rendering`, `motion-pattern`, and `accessibility` vocabulary should be a dedicated learning lane, not forced into the same browsing surface as UI blocks.
- Terms like `glassmorphism`, `backdrop blur`, `shadow elevation`, `aspect ratio`, `z-index`, `container query`, `reduced motion`, and `ARIA` belong under a "CSS/Design Concepts" or "Design System Concepts" lane.
- This lane can still share cards with the full index, but it should not be the same hierarchy as screen blocks like `Hero Section` or `Settings Screen`.

### 3. Tailwind Plus: Asset Type First

Tailwind Plus separates ready-made resources into:

- `UI Blocks`
- `Templates`
- `UI Kit`

Each product page has a specific user promise:

- UI Blocks: beautiful UI components for real-world projects.
- Templates: modern website templates ready for launch.
- UI Kit: Catalyst, a React application UI kit for building component systems.

Implication for UI Vocabulary:

- We need separate user-facing lanes for:
  - `UI Blocks`: reusable screen sections and application blocks.
  - `Screen Examples`: full-screen/page patterns.
  - `Components`: smaller controls and UI objects.
  - `Concepts`: styling, layout, accessibility, motion, token vocabulary.
- A single term can appear in multiple contexts through related links or filters, but it should have one canonical home.

### 4. UI Blocks: Surface Context First, Block Family Second

Tailwind Plus UI Blocks uses large surface contexts:

- `Marketing`
- `Application UI`
- `Ecommerce`

Then it subdivides each by concrete block family.

Marketing includes:

- Page Sections: Hero Sections, Feature Sections, CTA Sections, Bento Grids, Pricing Sections, Header Sections, Newsletter Sections, Stats, Testimonials, Blog Sections, Contact Sections, Team Sections, Content Sections, Logo Clouds, FAQs, Footers
- Elements: Headers, Flyout Menus, Banners
- Feedback: 404 Pages
- Page Examples: Landing Pages, Pricing Pages, About Pages

Application UI includes:

- Application Shells: Stacked Layouts, Sidebar Layouts, Multi-Column Layouts
- Headings: Page Headings, Card Headings, Section Headings
- Data Display: Description Lists, Stats, Calendars
- Lists: Stacked Lists, Tables, Grid Lists, Feeds
- Forms: Form Layouts, Input Groups, Select Menus, Sign-in and Registration, Textareas, Radio Groups, Checkboxes, Toggles, Action Panels, Comboboxes
- Feedback: Alerts, Empty States
- Navigation: Navbars, Pagination, Tabs, Vertical Navigation, Sidebar Navigation, Breadcrumbs, Progress Bars, Command Palettes
- Overlays: Modal Dialogs, Drawers, Notifications
- Elements: Avatars, Badges, Dropdowns, Buttons, Button Groups
- Layout: Containers, Cards, List Containers, Media Objects, Dividers
- Page Examples: Home Screens, Detail Screens, Settings Screens

Ecommerce includes:

- Components: Product Overviews, Product Lists, Category Previews, Shopping Carts, Category Filters, Product Quickviews, Product Features, Store Navigation, Promo Sections, Checkout Forms, Reviews, Order Summaries, Order History, Incentives
- Page Examples: Storefront Pages, Product Pages, Category Pages, Shopping Cart Pages, Checkout Pages, Order Detail Pages, Order History Pages

Implication for UI Vocabulary:

- `Marketing`, `Application UI`, and `Ecommerce` are clearer than "주제별" because they describe the screen world where a term appears.
- Block family labels like `Forms`, `Navigation`, `Overlays`, `Data Display`, `Lists`, `Feedback`, `Layout`, and `Elements` are clearer than a parallel "형태별" tree because they map to real UI objects.
- We should not put the same full card under many first-class sidebar branches. Use one canonical browse path plus facets.

### 5. Explanation Style

Tailwind Docs pages generally follow a practical sequence:

- A short concept statement.
- Concrete class/API examples.
- Variants and state examples.
- Responsive or theme-related variations.
- Related concepts via sidebar placement rather than long prose.

Tailwind Plus pages generally follow a visual catalog sequence:

- Surface/context heading.
- Block family grouping.
- Named examples with counts.
- Preview-oriented browsing.
- Documentation link for usage details.

Implication for UI Vocabulary term details:

- Definition should be short and stable.
- Then explain why/when to use it.
- Then show visual anatomy.
- Then show prompt-ready wording.
- Then show related concepts and common confusions.
- For concept terms, include implementation language such as CSS property, Tailwind-style utility idea, responsive/state/accessibility notes when relevant.

## Proposed New IA

Recommended user-facing sidebar model:

1. `Browse by Screen`
   - Marketing
   - Application UI
   - Ecommerce
   - Mobile App
   - Auth & Account
   - Dashboards & Analytics
   - Docs & Content

2. `UI Blocks`
   - Forms
   - Navigation
   - Overlays
   - Feedback
   - Data Display
   - Lists
   - Layout
   - Elements
   - Page Sections
   - Page Examples

3. `Components`
   - Inputs
   - Selection Controls
   - Buttons & Actions
   - Menus & Popovers
   - Cards & Containers
   - Media & Icons
   - Tables & Lists

4. `Design Concepts`
   - Layout & Rendering
   - Spacing & Sizing
   - Typography
   - Color & Theme
   - Surfaces & Materials
   - Effects & Filters
   - Motion & Animation
   - Responsive Design
   - Accessibility

5. `Full Index`
   - All terms
   - Recently added
   - Needs visual improvement

This replaces the visible labels `주제별 / 형태별 / 상황별`. Internally, we can keep `category`, `kind`, and `useCases`, but the sidebar should not expose those raw data axes as equal hierarchy.

## Canonical Home Rule

Each term should have exactly one canonical browse home:

- UI object terms: canonical home is a UI block/component family.
- Full screen terms: canonical home is screen/page examples.
- Style/layout/accessibility terms: canonical home is design concepts.
- Domain-specific terms like checkout, order summary, product card: canonical home is the surface context plus block family, with one selected as canonical.

Secondary appearances should be:

- Filter chips.
- Related term links.
- "Also appears in" metadata.
- Search results.

This addresses the current issue where the same card can feel like it belongs to several top-level nav sections.

## Data Model Direction

Current fields can be preserved short-term:

- `category`
- `kind`
- `useCases`
- `categoryGroups`

Add or derive these fields for the Tailwind-like IA:

- `surface`: screen context such as `marketing`, `application-ui`, `ecommerce`, `mobile`, `auth`, `dashboard`, `docs-content`.
- `family`: concrete UI family such as `forms`, `navigation`, `overlays`, `feedback`, `data-display`, `lists`, `layout`, `elements`, `page-sections`, `page-examples`.
- `conceptArea`: CSS/design concept area such as `typography`, `effects`, `accessibility`, `responsive`, `motion`, `layout-rendering`.
- `canonicalPath`: one sidebar path used for primary browse.
- `alsoAppearsIn`: secondary contexts, displayed as related chips only.

Migration should begin with derived metadata in `search.ts` or a mapper, then only promote to YAML schema if the model proves stable.

## Term Explanation Template

Recommended detail order:

1. `한 줄 정의`
   - What it is, in beginner language.
2. `왜 쓰는가`
   - User benefit and typical screen context.
3. `어떻게 생겼나`
   - Visual anatomy, naming visible parts.
4. `언제 쓰나`
   - Real UI examples and screen patterns.
5. `AI에게 이렇게 말하기`
   - Prompt-ready Korean phrase.
6. `헷갈리는 용어`
   - Related terms and distinctions.
7. `구현/상태 메모`
   - Optional CSS, responsive, accessibility, state, or motion notes.

This keeps Tailwind's practical style while preserving the vocabulary site's learning purpose.

## Step Tree

- [ ] Step 1: Freeze IA decision and naming
  - Work: choose final visible sidebar labels and decide whether to replace or keep `주제별 / 형태별 / 상황별` as hidden internal concepts.
  - Files likely touched: `docs/ui-vocabulary/schema.md`, `examples/ui-vocabulary-site/src/lib/search.ts`, `examples/ui-vocabulary-site/src/App.tsx`.
  - Verify: a static nav map document shows each visible label, purpose, source field, and sample terms.
  - Stop if: user wants the sidebar to remain Korean-only labels without English reference labels.

- [ ] Step 2: Build Tailwind-like navigation model as derived data
  - Work: add `surface`, `family`, `conceptArea`, and `canonicalPath` mapping without changing every YAML term first.
  - Files likely touched: `examples/ui-vocabulary-site/src/lib/search.ts`, optionally a new `examples/ui-vocabulary-site/src/lib/navigation-model.ts`.
  - Verify: mapping script reports every term has one canonical path and no duplicate canonical homes.
  - Stop if: derived mapping becomes too large for code and should move to YAML schema.

- [ ] Step 3: Rewrite sidebar around primary browse and secondary filters
  - Work: replace equal `주제별 / 형태별 / 상황별` sections with `Browse by Screen`, `UI Blocks`, `Components`, `Design Concepts`, `Full Index`; show secondary axes as chips or compact filters.
  - Files likely touched: `examples/ui-vocabulary-site/src/App.tsx`, `examples/ui-vocabulary-site/src/index.css`, `examples/ui-vocabulary-site/src/lib/search.ts`.
  - Verify: Chrome desktop and mobile smoke; no hidden-scrollbar regression; URL filters still restore state.
  - Stop if: sidebar becomes too tall even with hidden scroll and needs a top-tab or command-palette decision.

- [ ] Step 4: Reclassify representative terms and fix duplicated card paths
  - Work: migrate a representative set first: modal, drawer, alert, empty state, data table, hero section, glassmorphism, backdrop blur, responsive layout, aria-live, checkout form.
  - Files likely touched: `docs/ui-vocabulary/terms.yml`, generated data, validators if schema changes.
  - Verify: `python scripts/validate-ui-vocabulary.py`, strict duplicate audit, custom canonical-path audit.
  - Stop if: existing `category` cannot coexist with `surface/family/conceptArea` without confusing labels.

- [ ] Step 5: Redesign term detail explanation flow
  - Work: adjust term detail sections to the Tailwind-inspired flow: definition, why/use, visual anatomy, examples, prompt phrase, related concepts, implementation/state notes.
  - Files likely touched: term detail component(s), `docs/ui-vocabulary/schema.md`, selected YAML term records.
  - Verify: build/lint and Chrome smoke for component, block, visual-effect, accessibility concept, and ecommerce terms.
  - Stop if: current YAML fields are insufficient and require a schema migration decision.

- [ ] Step 6: Full QA and evidence capture
  - Run: `python scripts/validate-ui-vocabulary.py`
  - Run: `node scripts/audit-ui-vocabulary-candidates.mjs --strict-duplicates`
  - Run: `cd examples/ui-vocabulary-site && npm run audit:visuals && npm run lint && npm run build`
  - Run: Chrome smoke for `Marketing`, `Application UI`, `Ecommerce`, `Forms`, `Overlays`, `Design Concepts > Effects`, `Design Concepts > Accessibility`.
  - Stop before: deploy, push, or public release.

## Stop Points

Stop before implementation if:

- The user prefers to keep `주제별 / 형태별 / 상황별` as visible top-level sections.
- The user wants a strict Korean-only IA and rejects visible labels like `Application UI` or `Ecommerce`.
- The user wants `category`, `kind`, and `useCases` to remain the only source fields, with no derived navigation model.

Stop during implementation if:

- A term naturally needs multiple canonical homes and the current single-home rule feels wrong.
- URL compatibility for old filters becomes costly and needs a redirect/alias policy.
- The sidebar cannot stay readable on mobile without a larger navigation redesign.

Stop after QA:

- Do not deploy or push without explicit user approval.

## Recommended Decision

Proceed with a Tailwind-like IA, but do not copy Tailwind's structure one-to-one.

Use Tailwind Plus for browse hierarchy:

- surface context first
- concrete UI block family second
- examples and previews as the browsing unit

Use Tailwind Docs for concept learning:

- layout, spacing, sizing, typography, backgrounds, borders, effects, filters, motion, interactivity, accessibility

For our site, the best next implementation move is Step 1 plus Step 2 only: create the derived navigation model and render it in the sidebar behind the existing data. That gives us a reversible path before rewriting every term.
