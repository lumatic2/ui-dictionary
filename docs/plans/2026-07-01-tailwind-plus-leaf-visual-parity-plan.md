# Tailwind Plus leaf visual parity plan

Date: 2026-07-01
Mode: product / harness

## Why this plan exists

The previous Tailwind Plus parity pass closed public IA, route, capture, and smoke
coverage. It did not close leaf-by-leaf visual parity.

The canonical baseline is Marketing / Page Sections / Hero Sections:

- Tailwind reference: `https://tailwindcss.com/plus/ui-blocks/marketing/sections/heroes`
- Local route: `/?filter=nav%3Aplus-marketing-hero-sections`
- Evidence: desktop and mobile captures exist on both sides.
- Current quality bar: close page shell, sidebar, heading rhythm, toolbar, preview
  density, responsive behavior, and visible example count.

Feature Sections and most other leaves are not at this bar yet. They currently
have route/capture parity and usually three local examples, while the Tailwind
page may expose a larger visible set and richer preview variety.

## Current inventory

Source of truth for the current public inventory is:

- `docs/research/tailwind-plus-capture-ledger.md`
- `phases/tailwind-style-page-catalog/index.json`
- `docs/research/assets/*-2026-07-01/`

Captured public rows currently in the ledger:

| Surface | Rows including landing/docs | Leaf visual target |
| --- | ---: | ---: |
| Marketing | 24 | 23 |
| Application UI | 50 | 49 |
| Ecommerce | 22 | 21 |
| Documentation | 4 | 4 public docs surfaces |
| Templates | 15 | 15 public gallery/product surfaces |
| UI Kit | 5 | 5 public Catalyst/docs surfaces |
| UI Blocks landing | 1 | 1 public landing surface |

Primary visual-parity target: 93 UI Blocks leaf pages.

Secondary visual-parity target: the 25 public Documentation / Templates / UI Kit
surfaces that are visible without payment or sign-in.

Cross-surface route smoke already checked 189 local `plus-*` routes with zero
failures, but that smoke is only a render/overflow gate.

## Marketing leaf list

Marketing is first because Hero Sections already gives a working fidelity
baseline.

| Group | Leaves |
| --- | --- |
| Page Sections | Hero Sections, Feature Sections, CTA Sections, Bento Grids, Pricing Sections, Header Sections, Newsletter Sections, Stats, Testimonials, Blog Sections, Contact Sections, Team Sections, Content Sections, Logo Clouds, FAQs, Footers |
| Elements | Headers, Flyout Menus, Banners |
| Feedback | 404 Pages |
| Page Examples | Landing Pages, Pricing Pages, About Pages |

Known depth gap: Hero Sections has 12 local examples and is the baseline. Most
other Marketing leaves currently have three local examples. The first visual
parity pass must re-open the live Tailwind page and record the visible Tailwind
example count before editing the local page.

## Application UI leaf list

| Group | Leaves |
| --- | --- |
| Application Shells | Stacked Layouts, Sidebar Layouts, Multi-Column Layouts |
| Headings | Page Headings, Card Headings, Section Headings |
| Data Display | Description Lists, Stats, Calendars |
| Lists | Stacked Lists, Tables, Grid Lists, Feeds |
| Forms | Form Layouts, Input Groups, Select Menus, Sign-in and Registration, Textareas, Radio Groups, Checkboxes, Toggles, Action Panels, Comboboxes |
| Navigation | Navbars, Pagination, Tabs, Vertical Navigation, Sidebar Navigation, Breadcrumbs, Progress Bars, Command Palettes |
| Overlays | Modal Dialogs, Drawers, Notifications |
| Feedback | Alerts, Empty States |
| Elements | Avatars, Badges, Dropdowns, Buttons, Button Groups |
| Layout | Containers, Cards, List containers, Media Objects, Dividers |
| Page Examples | Home Screens, Detail Screens, Settings Screens |

Application UI should follow Marketing only after the Marketing loop is proven
on at least Feature Sections and one non-section leaf.

## Ecommerce leaf list

| Group | Leaves |
| --- | --- |
| Components | Product Overviews, Product Lists, Category Previews, Shopping Carts, Category Filters, Product Quickviews, Product Features, Store Navigation, Promo Sections, Checkout Forms, Reviews, Order Summaries, Order History, Incentives |
| Page Examples | Storefront Pages, Product Pages, Category Pages, Shopping Cart Pages, Checkout Pages, Order Detail Pages, Order History Pages |

Ecommerce depends on image/product-preview rhythm. It should not be treated as
generic cards or placeholder text; each leaf needs reference-backed previews.

## Visual parity definition

A leaf is `visual-parity-verified` only when all of these are true:

- The Tailwind page was opened in Chrome immediately before implementation.
- Fresh Tailwind desktop and mobile screenshots were saved for the leaf.
- The local page was implemented from those screenshots, not from text inventory
  alone.
- The local page matches the Tailwind page shell: sidebar category position,
  breadcrumb/heading spacing, description width, example stack rhythm, toolbar
  controls, locked code/get-code affordance, and footer/empty space behavior.
- The local visible example count matches Tailwind, or the ledger records a
  specific reason for a smaller local count.
- Each local example approximates the reference layout class and responsive
  behavior. Placeholder text-only previews do not count.
- Image-backed previews do not reuse a generic asset. When a reference preview
  visibly depends on a photo, product shot, app screenshot, background image, or
  illustration, generate a fresh purpose-fit imagegen asset for that individual
  preview. Do not share generated imagery across different previews just because
  the leaf or subject is similar. Record each generated asset path in the
  evidence document or ledger.
- Desktop and mobile local captures are saved after implementation.
- Desktop horizontal overflow is false; mobile layout has no incoherent overlap.
- `npm run build`, `npm run lint`, `python scripts/validate-ui-vocabulary.py`,
  and `npm run audit:visuals` pass or the exact pre-existing warning is recorded.

This is visual/structural parity, not Tailwind source-code parity. Do not bypass
paid access, copy proprietary component code, or reuse Tailwind-owned assets.

## New visual ledger

Create and maintain:

`docs/research/tailwind-plus-visual-parity-ledger.md`

Required columns:

| Column | Meaning |
| --- | --- |
| Tailwind URL | Live reference page used for the pass |
| Axis | Marketing / Application UI / Ecommerce / Documentation / Templates / UI Kit |
| Group | Sidebar group |
| Leaf | Leaf page name |
| Tailwind visible examples | Count observed from the live Tailwind page |
| Local examples before | Count before the visual pass |
| Target depth | `match-count`, `match-shell`, or `public-shell-only` |
| Tailwind desktop | Fresh screenshot path |
| Tailwind mobile | Fresh screenshot path |
| Local route | Local URL |
| Local desktop after | Post-implementation screenshot path |
| Local mobile after | Post-implementation screenshot path |
| Status | `planned`, `captured`, `implemented`, `visual-parity-verified`, `deferred` |
| Notes | What was matched, compressed, or intentionally left out |

The existing capture ledger remains the route/capture coverage ledger. This new
ledger is the visual-fidelity ledger.

## Per-leaf loop

1. Open the Tailwind leaf URL in Chrome.
2. Capture desktop viewport and mobile viewport.
3. Record sidebar position, title block, toolbar state, visible example names,
   visible example count, paid/locked boundary, and first/last example layout
   classes in the visual ledger.
4. Open the local route and capture the current before state if not already
   present.
5. Implement the local page from the screenshots.
   - For image-backed previews, create a purpose-fit imagegen asset per preview
     instead of reusing prior generated images from another preview or leaf.
   - For control-only references such as plain forms, tables, tabs, and text
     layouts, document that no imagegen asset was needed rather than adding
     decorative imagery that the reference does not have.
6. Capture local desktop and mobile after states.
7. Run build/lint/validator/visual audit plus a Chrome route smoke for that leaf.
8. Update the visual ledger and phase step status.

## Execution batches

### Step 0: visual inventory and ledger bootstrap

Scope: create the visual parity ledger and populate all 93 UI Blocks leaves from
the current capture ledger. For Marketing, start by adding the known baseline
notes: Hero Sections is parity baseline; Feature Sections and most other leaves
are route-parity only.

Verify: ledger has 93 UI Blocks leaf rows and no blank local route cells.

### Step 1: Hero Sections baseline contract

Scope: freeze what "good" means by documenting Hero Sections screenshots,
example count, toolbar, mobile behavior, and local implementation notes.

Verify: local Hero Sections still passes desktop/mobile smoke and remains the
comparison baseline for later leaves.

### Step 2: Marketing Page Sections, priority 1

Scope: Feature Sections, CTA Sections, Pricing Sections, Bento Grids.

Why first: Feature Sections is the visible gap the user called out; CTA/Pricing/
Bento cover different preview shapes and quickly test whether the loop scales.

Verify: each page has fresh Tailwind/local desktop+mobile captures and
`visual-parity-verified` ledger rows.

### Step 3: Marketing Page Sections, priority 2

Scope: Header Sections, Newsletter Sections, Stats, Testimonials, Blog Sections,
Contact Sections, Team Sections, Content Sections, Logo Clouds, FAQs, Footers.

Verify: same leaf gate as Step 2, plus no regression in Marketing sidebar order.

### Step 4: Marketing Elements, Feedback, Page Examples

Scope: Headers, Flyout Menus, Banners, 404 Pages, Landing Pages, Pricing Pages,
About Pages.

Verify: same leaf gate as Step 2, with extra attention to full-page example
previews on Page Examples.

### Step 5: Application UI shells, headings, data display, lists

Scope: Application Shells, Headings, Data Display, Lists.

Verify: each page matches Tailwind preview density for desktop and mobile; table
and list examples do not overflow on mobile.

### Step 6: Application UI forms and navigation

Scope: Forms and Navigation groups.

Verify: inputs, menus, segmented controls, navbars, sidebars, tabs, pagination,
breadcrumbs, progress bars, and command palettes have reference-backed states.

### Step 7: Application UI overlays, feedback, elements, layout, page examples

Scope: Overlays, Feedback, Elements, Layout, Page Examples.

Verify: overlays and notifications are represented as static previews without
breaking page scroll; page examples use screen-level compositions, not small
cards.

### Step 8: Ecommerce components

Scope: all 14 Ecommerce Components leaves.

Verify: product imagery, price/info density, cart/order summary rhythm, filters,
reviews, and incentives are close to the captured Tailwind reference.

### Step 9: Ecommerce page examples

Scope: all 7 Ecommerce Page Examples leaves.

Verify: page-level previews are screen-like and responsive, not generic example
tiles.

### Step 10: Documentation, Templates, UI Kit public surfaces

Scope: the public docs/gallery/product surfaces visible without payment or
sign-in.

Verify: match public shell, lock/access affordances, gallery/product detail
rhythm, and Catalyst docs structure where publicly visible. Do not invent paid
details.

### Step 11: cross-surface visual QA

Scope: run a final pass across the visual ledger, not just all routes.

Verify:

- all `visual-parity-verified` rows have four screenshots
- no row claims parity without a fresh Tailwind capture
- all local routes render
- desktop overflow false
- mobile overlap check passes
- build/lint/validator/visual audit pass

## Stop points and blockers

Expected stop points are limited to:

- Tailwind public page shape changes and the current ledger needs re-inventory.
- Chrome capture cannot access the public page at all.
- A page is genuinely paid-only beyond a public shell.
- Local implementation hits a failing build/lint/validator/audit that cannot be
  fixed in the current leaf.
- A user-owned decision is needed about copying versus intentionally compressing
  a public pattern.

Everything else should continue page-by-page. Do not stop merely because the
leaf count is large.

## First next action

Start with Step 0, then Step 2 / Feature Sections.

Feature Sections is the right first implementation target because it is adjacent
to the Hero Sections baseline, visibly under-depth today, and will validate the
new visual ledger before applying the process to the other 92 UI Blocks leaves.
