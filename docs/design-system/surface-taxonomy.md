# Surface Taxonomy

Date: 2026-07-04

> 분류 용어·축 목록의 정본은 [pattern-taxonomy.md](pattern-taxonomy.md) (2026-07-07). 이 문서는 surface 7종의 *내용*(하위 유형·전형 요소·agent cue) 출처로 유지된다. 본문 IA 권고안의 pattern 카테고리 8종은 pattern-taxonomy §3의 10종으로 대체됐다.

## Purpose

This taxonomy defines how the design system organizes digital product UI. It expands the current Tailwind Plus-inspired web catalog into a cross-surface system for websites, mobile apps, SaaS products, commerce, dashboards, documentation, marketing, internal tools, and reusable primitives.

The taxonomy should serve three consumers:

- humans browsing the website;
- data/schema authors adding examples and patterns;
- Codex/Claude Code selecting the right design guidance for a task.

## Top-Level Surfaces

### 1. Websites

Public web experiences whose primary job is communication, conversion, or publishing.

Includes:

- landing pages;
- marketing sites;
- portfolio/personal sites;
- blogs/editorial sites;
- campaign pages;
- product showcase pages.

Typical patterns:

- hero sections;
- feature sections;
- pricing sections;
- testimonials/reviews;
- logo clouds;
- FAQ sections;
- CTAs;
- footers;
- navigation bars.

Agent cue examples:

- "Build a high-conversion SaaS landing page."
- "Create a portfolio homepage with editorial hierarchy."
- "Make a pricing page with plan comparison and FAQ."

### 2. Mobile Apps

Native or mobile-first product experiences where device constraints, touch interaction, and platform conventions matter.

Includes:

- iOS app screens;
- Android app screens;
- cross-platform mobile apps;
- onboarding flows;
- tab-based apps;
- mobile commerce;
- mobile settings/account flows.

Typical patterns:

- bottom tabs;
- stack navigation;
- sheet/drawer interactions;
- list/detail flows;
- form inputs optimized for touch;
- mobile cards;
- empty states;
- permission prompts.

Agent cue examples:

- "Design a mobile onboarding flow."
- "Create an iOS-style settings screen."
- "Make a commerce product detail screen for mobile."

### 3. SaaS And Dashboards

Dense product interfaces for repeated work, scanning, comparison, and operational decisions.

Includes:

- analytics dashboards;
- CRM/work management tools;
- admin consoles;
- project management;
- finance/ops dashboards;
- AI product workspaces.

Typical patterns:

- application shells;
- sidebars;
- page headings;
- data tables;
- charts;
- filters;
- command palettes;
- notifications;
- drawers;
- detail panels;
- settings screens.

Agent cue examples:

- "Build a dense SaaS dashboard."
- "Create an admin users table with filters and bulk actions."
- "Design a project management issue detail screen."

### 4. Commerce

Shopping, checkout, subscription, and order-management experiences.

Includes:

- storefronts;
- category pages;
- product pages;
- carts;
- checkout;
- order history;
- account/subscription management;
- reviews and ratings.

Typical patterns:

- product cards;
- product grids;
- filters/facets;
- product media galleries;
- cart summaries;
- checkout forms;
- payment method blocks;
- incentives;
- review lists.

Agent cue examples:

- "Build a checkout page with order summary."
- "Create a product category grid with filters."
- "Design a subscription management screen."

### 5. Documentation And Learning

Reference, docs, tutorial, and technical learning surfaces.

Includes:

- API docs;
- component docs;
- design-system docs;
- tutorials;
- changelogs;
- implementation guides;
- knowledge bases.

Typical patterns:

- persistent side navigation;
- table of contents;
- code/example pairing;
- component API tables;
- copy buttons;
- callouts;
- version switchers;
- search;
- docs leaf pages.

Agent cue examples:

- "Build docs for a UI component library."
- "Create an API reference page with examples."
- "Make a learning page with code blocks and callouts."

### 6. Internal Tools

Operational interfaces for people inside an organization.

Includes:

- support consoles;
- moderation queues;
- back-office tools;
- scheduling tools;
- review/approval tools;
- data correction tools.

Typical patterns:

- queue lists;
- split panes;
- audit logs;
- status chips;
- batch actions;
- editable tables;
- timeline/activity feeds;
- role/permission surfaces.

Agent cue examples:

- "Build a support moderation queue."
- "Create a back-office order correction tool."
- "Design an approval workflow screen."

### 7. Components And Primitives

Reusable units that appear across surfaces.

Includes:

- buttons;
- inputs;
- selects;
- tabs;
- dropdown menus;
- popovers;
- dialogs;
- disclosure/accordion;
- command palettes;
- badges;
- avatars;
- cards;
- tables.

Typical pattern detail:

- anatomy;
- states;
- keyboard interaction;
- accessibility;
- responsive behavior;
- animation/motion;
- anti-patterns;
- implementation recipe.

Agent cue examples:

- "Use tabs to switch between preview and code."
- "Add a command palette with keyboard navigation."
- "Make a dropdown menu with animated open/close state."

## Cross-Cutting Axes

Each surface can be filtered or annotated by:

- platform: web, iOS, Android, cross-platform, desktop web;
- intent: browse, compare, configure, purchase, learn, operate, analyze, create;
- density: spacious, balanced, dense, data-heavy;
- interaction: static, hover, keyboard, drag/drop, modal, realtime, progressive disclosure;
- trust level: low-risk, account, payment, admin, destructive, regulated;
- asset type: screenshot, live component, code example, token recipe, prompt recipe, downloadable pack;
- access level: public browse, free copy, paid copy/download, internal-only.

## Information Architecture Recommendation

The public site should not expose every axis as a top-level nav item. Use this hierarchy:

1. Product Surfaces
   - Websites
   - Mobile Apps
   - SaaS & Dashboards
   - Commerce
   - Documentation
   - Internal Tools
2. Patterns
   - Marketing
   - Application UI
   - Data Display
   - Forms
   - Navigation
   - Overlays
   - Feedback
   - Layout
3. Components
   - Elements and primitives
4. Foundations
   - Color
   - Typography
   - Spacing
   - Motion
   - Accessibility
   - Tokens
5. Agent Recipes
   - Prompt patterns
   - Implementation recipes
   - Anti-patterns
   - Verification checklists

Tailwind Plus categories should remain as useful pattern groups under `Patterns`, not as the whole system.

## Data Model Implication

Every future example should be able to declare:

```yaml
surface: "saas-dashboard"
pattern_group: "application-ui"
component_refs: ["tabs", "dropdown-menu", "data-table"]
platforms: ["web"]
intent: ["analyze", "operate"]
density: "dense"
trust_level: "admin"
asset_type: ["live-component", "code-example", "agent-recipe"]
access_level: "public-browse"
source_refs:
  - "docs/research/design-system-reference-strategy.md"
```

## Migration Notes

- Existing Tailwind Plus `Marketing`, `Application UI`, and `Ecommerce` pages map mostly to `Patterns`.
- Existing Documentation pages map to `Documentation And Learning`.
- Existing Elements pages map to `Components And Primitives`.
- Future mobile work should not be squeezed into Tailwind Plus categories; it belongs under `Mobile Apps`.
- Future SaaS dashboards should emphasize density, repeated action, keyboard flow, and data clarity.

## DSF3 Completion Check

DSF3 is complete when this document defines:

- top-level surfaces;
- typical patterns per surface;
- agent cue examples;
- cross-cutting axes;
- recommended public-site IA;
- data model implications.
