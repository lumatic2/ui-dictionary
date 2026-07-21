# Tailwind-style UI Vocabulary Redesign Harness Plan

> Date: 2026-06-30  
> Mode: product / planning produce  
> Reference: [Tailwind CSS / Tailwind Plus 사이트 구조 분석](../research/2026-06-30-tailwind-site-structure-analysis.md)  
> Product spec: [PRD](../PRD.md), [Architecture](../ARCHITECTURE.md)  
> Scope: UI Vocabulary site IA, data navigation model, URL/page architecture, sidebar, Docs/Plus/Templates/UI Kit page shells, item detail pages, search/filter behavior, and browser verification.

## Why This Exists

Tailwind separates `Docs` and `Plus` by user intent:

- `Docs`: concepts, implementation vocabulary, properties, learning/reference.
- `Plus`: practical UI examples, blocks, templates, and component-system entry points.

Our site has already started exposing `Docs / Plus / Index`, but the implementation is still halfway between old category browsing and the new Tailwind-style model. The plan below turns the split into a real information architecture instead of another filter layer.

## Current State

- `docs/ui-vocabulary/schema.md` already defines `navigation.canonical_path` and `navigation.also_appears_in`.
- `docs/ui-vocabulary/terms.yml` is still the editable source of truth.
- `examples/ui-vocabulary-site/src/data/terms.generated.ts` does **not** expose `navigation` yet.
- `examples/ui-vocabulary-site/src/lib/navigation-model.ts` currently hardcodes Tailwind-like collections with `termIds`, `groupIds`, `categories`, and `kinds`.
- `examples/ui-vocabulary-site/src/App.tsx` renders separate `docsNav`, `plusNav`, and `indexNav`, but still mixes old category/group filters with new navigation intent.
- Term detail currently behaves like an in-page detail/drawer workflow. The redesign should replace that with one URL-addressable page per term/category item, closer to Tailwind's catalog/document pages.
- `Index` remains useful as a full fallback, but should stop being the mental model for the whole app.

## Planning Gate

```yaml
planning_gate:
  team_validation_mode: manual-pass
  spec_delta: "Turn navigation.canonical_path / also_appears_in into the primary browse contract for Docs and Plus, while keeping category/kind/group as internal facets and Index fallback."
  perspectives:
    product: "Users should choose between learning a concept (Docs), finding a practical screen/block/template/UI kit item (Plus), or searching everything (Index)."
    architecture: "Move primary placement out of hardcoded nav collections and into generated term data, then derive sidebar counts, list pages, and item routes from navigation paths."
    security: "No auth, secrets, or external write operations. Tailwind references are public research only."
    qa: "Data validation, generated types, build, lint, visual audit, and Chrome smoke for page=docs/page=plus/page=index."
    skeptic: "If all terms are not migrated to navigation paths, pages may look sparse or inconsistent. The plan therefore allows staged fallback from old categories while migration proceeds."
  dod:
    - "python scripts/validate-ui-vocabulary.py"
    - "node scripts/build-ui-vocabulary-data.mjs"
    - "cd examples/ui-vocabulary-site && npm run build"
    - "cd examples/ui-vocabulary-site && npm run lint"
    - "cd examples/ui-vocabulary-site && npm run audit:visuals"
    - "Chrome smoke: ?page=docs, ?page=plus, ?page=index and representative item pages render without console errors and without duplicate primary cards."
```

## Required Decisions Before Run

### Decision 1 — Plus Depth

Decision: **FULL Plus. Model `UI Blocks`, `Templates`, and `UI Kit` deeply.**

Rationale: Tailwind Plus treats these as first-class product surfaces. Our site should not make `Templates` and `UI Kit` feel like placeholders if the goal is to grow into a Tailwind-like reference.

Implication:

- `UI Blocks`: context/category catalog for reusable screen sections and patterns.
- `Templates`: complete page/screen examples and flow-level starting points.
- `UI Kit`: component-system pieces, controls, composition primitives, and implementation-facing component references.
- Each surface gets its own list page, category pages, and item/detail pages.

### Decision 2 — Primary Placement Rule

Decision: **Every term has one primary `navigation.canonical_path`; duplicates appear only as related chips/secondary links.**

Rationale: This prevents the same card from appearing as a first-class item in multiple sidebar categories.

### Decision 3 — Docs Labels

Decision: **Use English product-style labels with short Korean helper copy.**

Example: `Layout`, `Styling`, `Interaction`, `Accessibility`, `Motion & Effects`.

Rationale: Tailwind uses stable English category labels; our Korean users still benefit from English UI vocabulary because those are the words they will prompt with.

### Decision 4 — Default Landing Page

Decision: **Default to `Plus`, not `Docs`, with a Tailwind Plus-like practical catalog first.**

Rationale: The product goal is helping vibe-coding users ask for concrete UI. Practical examples should be the first screen; Docs remains one click away.

### Decision 5 — Migration Strictness

Decision: **Staged migration with fallback counts.**

Rationale: There are many existing terms. Requiring every term to have navigation paths before UI changes would block visible progress.

### Decision 6 — Detail Interaction Model

Decision: **Remove drawer-style detail interaction and move to one URL-addressable page per item.**

Rationale: Tailwind's UI Blocks/Templates/UI Kit surfaces let users land on stable pages, copy/share URLs, and browse by page hierarchy. A drawer is useful for quick preview, but it fights the reference-site model.

Implication:

- Category/list pages can still show compact rows or preview tiles, but they are navigation entries, not the primary explanation surface.
- Clicking a term/block/template navigates to a dedicated page.
- Browser back/forward, direct URL entry, and reload must preserve the selected item page.
- Detail content moves out of transient state and into page-rendered content.

### Decision 7 — Card Presentation Model

Decision: **Drop the current card-as-introduction model.**

Rationale: The current cards make the site feel like a visual gallery. The Tailwind reference pattern is closer to a structured catalog/document system: category pages list examples, and the explanation lives on stable detail pages.

Implication:

- Existing `TermCard` may be replaced or reduced to a compact list/preview row.
- Plus category pages can use preview thumbnails where useful, but not as the main explanatory container.
- Docs pages should read more like documentation/reference pages than card grids.

## Stop Points

Resolved decisions:

- Plus depth: FULL, including `UI Blocks`, `Templates`, and `UI Kit`.
- Primary placement: one canonical path, secondary appearances only as chips/links.
- Docs labels: English labels plus Korean helper copy.
- Default landing: `Plus`.
- Migration strictness: staged migration with fallback counts.
- Detail model: dedicated pages, no drawer.
- Presentation model: no current card-as-introduction model.

Stop during implementation if:

- Generated term data cannot safely include `navigation` without breaking current build.
- More than 20% of visible Plus entries fall back to old category/group placement after the first migration pass.
- Chrome smoke shows sidebar/page mismatch, duplicate primary cards, or empty main states for `Docs` or `Plus`.
- URL-addressable item pages cannot be implemented without introducing a routing approach that conflicts with Vite/static deployment.

## Step Tree

### Step 1 — Navigation Data Contract

Goal: Make `navigation.canonical_path` and `also_appears_in` a real generated data contract.

Work:

- Update `scripts/build-ui-vocabulary-data.mjs` to emit optional `navigation`.
- Add generated TypeScript types for `canonical_path` and `also_appears_in`.
- Validate path shape enough to catch malformed values without blocking unmapped legacy terms.
- Keep `category`, `kind`, and `categoryGroups` as internal facets.

Acceptance:

```powershell
node scripts/build-ui-vocabulary-data.mjs
python scripts/validate-ui-vocabulary.py
cd examples/ui-vocabulary-site; npm run build
```

### Step 2 — Canonical Navigation Model

Goal: Replace hardcoded collection intent with a Tailwind-style navigation tree.

Work:

- Define canonical nav tree:
  - `Docs`
    - `Layout`
    - `Styling`
    - `Interaction`
    - `Accessibility`
    - `Motion & Effects`
  - `Plus`
    - `UI Blocks`
      - `Marketing`
        - `Page Sections`
        - `Elements`
        - `Feedback`
        - `Page Examples`
      - `Application UI`
        - `Application Shells`
        - `Headings`
        - `Data Display`
        - `Lists`
        - `Forms`
        - `Feedback`
        - `Navigation`
        - `Overlays`
        - `Elements`
        - `Layout`
        - `Page Examples`
      - `Ecommerce`
        - `Components`
        - `Page Examples`
    - `Templates`
      - `Marketing Pages`
      - `Dashboard Screens`
      - `Auth Screens`
      - `Ecommerce Screens`
      - `Onboarding Screens`
    - `UI Kit`
      - `Controls`
      - `Forms`
      - `Navigation`
      - `Overlays`
      - `Data Display`
      - `Layout`
      - `Feedback`
      - `Visual Treatments`
      - `Motion Patterns`
  - `Index`
- Let filters match `navigation.canonical_path` first.
- Let `also_appears_in` support secondary chips and search hints, not duplicate primary cards.
- Keep old category/group mappings as temporary fallback for unmapped terms.

Acceptance:

```powershell
cd examples/ui-vocabulary-site; npm run build
```

Manual check:

- A term with `canonical_path: [Docs, Styling]` appears as primary under Docs Styling.
- The same term with `also_appears_in: [Plus, UI Kit, Components]` does not duplicate as a primary card there.

### Step 3 — Terms Migration Pass 1

Goal: Map enough high-value terms to make the full Plus and Docs IA real.

Work:

- Add canonical navigation paths to a first curated slice:
  - Docs concepts: layout/rendering/style/accessibility/motion terms.
  - Plus Marketing: hero, CTA, pricing, testimonial, bento, newsletter, feature grid.
  - Plus Application UI: forms, navigation, overlays, data display, shells.
  - Plus Ecommerce: product card, cart, checkout, payment, order status.
  - Plus Templates: dashboard pages, auth pages, onboarding flows, ecommerce flows, marketing pages.
  - Plus UI Kit: primitive controls, form controls, navigation controls, overlay components, data display components.
- Add `also_appears_in` only when it helps explain cross-context use.
- Avoid using `also_appears_in` as a dumping ground.

Acceptance:

```powershell
python scripts/validate-ui-vocabulary.py
node scripts/build-ui-vocabulary-data.mjs
```

Manual check:

- Plus page is not sparse.
- Templates and UI Kit have meaningful first-class entries, not placeholder buckets.
- Docs page is not polluted with page-template terms.

### Step 4 — Route and Page Architecture

Goal: Replace transient drawer/detail state with URL-addressable pages.

Work:

- Decide and implement the static-friendly route shape.
- Recommended route shape:
  - `/?page=plus` for Plus landing.
  - `/?page=plus&path=ui-blocks/application-ui/forms` for category/list pages.
  - `/?page=term&id=command-palette` or `/term/command-palette` if deployment fallback supports it.
  - `/?page=docs&path=styling/surfaces` for Docs category pages.
- Move selected item state from drawer state to URL parsing.
- Replace drawer open/close logic with page navigation and back/forward behavior.
- Keep no-server static deployment constraints in mind.

Acceptance:

```powershell
cd examples/ui-vocabulary-site; npm run build
```

Chrome smoke:

- Direct URL to a representative term page survives reload.
- Browser back returns to the previous category/list page.
- No drawer UI is required to read a term.

### Step 5 — Sidebar and Page Shell Rebuild

Goal: Make the UI feel like separate Docs and Plus products, not one sidebar wearing different labels.

Work:

- Split page header copy by mode:
  - Docs: learning/reference language.
  - Plus: practical catalog language.
  - Index: full fallback/search language.
- Rebuild side nav from the canonical navigation tree.
- Keep side nav wider and scrollbar-hidden as requested.
- Make accordion state page-scoped so opening one category does not open another category with the same value.
- Default collapsed/expanded state:
  - Docs: main concept sections visible.
  - Plus: `UI Blocks`, `Templates`, and `UI Kit` all present as first-class sections; active branch opens based on URL.
- Replace card-grid-first content with page/list layouts:
  - Docs: reference article/list layout.
  - Plus UI Blocks: category catalog layout.
  - Plus Templates: template catalog layout.
  - Plus UI Kit: component reference catalog layout.

Acceptance:

```powershell
cd examples/ui-vocabulary-site; npm run build
cd examples/ui-vocabulary-site; npm run lint
```

Chrome smoke:

- `?page=docs`: Docs side nav only, Docs copy, non-empty grid.
- `?page=plus`: Plus side nav only, full Plus sections visible, non-empty catalog/list surface.
- `?page=index`: Index side nav only, full fallback list.

### Step 6 — Item Pages and Context Breadcrumbs

Goal: Give every term/block/template/UI kit item a stable page and show why it belongs where it appears.

Work:

- Build a dedicated item page layout for each term.
- Add `canonical_path` breadcrumb at the top of the item page.
- Add `also_appears_in` links/chips as secondary navigation.
- In search results, show whether the hit is from Docs, Plus, or Index.
- Move full explanation, anatomy, when-to-use, anti-use, prompt phrases, related terms, sources, and visual preview into the page layout.
- Remove drawer-based detail as the primary reading path.

Acceptance:

```powershell
cd examples/ui-vocabulary-site; npm run build
```

Manual check:

- Cross-listed terms explain their secondary contexts without appearing as duplicate primary cards.
- Each representative item can be opened, reloaded, and shared by URL.

### Step 7 — Full Plus Surfaces

Goal: Make `Plus` behave like Tailwind Plus: UI Blocks, Templates, and UI Kit are all deep catalog surfaces.

Work:

- Add Plus landing sections for `UI Blocks`, `Templates`, and `UI Kit`.
- `UI Blocks`: show `Marketing`, `Application UI`, `Ecommerce`, then their nested groups.
- `Templates`: show complete page/screen/flow families, not just component terms.
- `UI Kit`: show component-system categories and implementation-facing controls.
- Each surface links into category/list pages and item pages.
- Use preview thumbnails/compact rows as entry affordances, not as the main explanation container.
- Avoid a marketing hero page; this is a tool surface, not a landing page.

Acceptance:

```powershell
cd examples/ui-vocabulary-site; npm run build
cd examples/ui-vocabulary-site; npm run audit:visuals
```

Chrome smoke:

- Desktop and mobile render without overlapping text.
- The first viewport communicates all three Plus products: UI Blocks, Templates, UI Kit.
- Representative category pages under all three products are non-empty.

### Step 8 — Verification and Documentation Sync

Goal: Close the redesign with evidence and update docs so future term batches follow the new IA.

Work:

- Update `docs/ui-vocabulary/schema.md` only if implementation changes the current contract.
- Update `CLAUDE.md` UI Vocabulary IA notes if final labels differ from this plan.
- Run full verification:
  - data build
  - validator
  - Vite build
  - lint
  - visual audit
  - Chrome smoke for `docs`, `plus`, `index`
  - Chrome smoke for representative item pages and representative Plus category pages
- Capture screenshots after the redesign.

Acceptance:

```powershell
node scripts/build-ui-vocabulary-data.mjs
python scripts/validate-ui-vocabulary.py
cd examples/ui-vocabulary-site; npm run build
cd examples/ui-vocabulary-site; npm run lint
cd examples/ui-vocabulary-site; npm run audit:visuals
```

Evidence:

- Updated screenshots under `docs/research/assets/` or a new dated evidence folder.
- Final summary with remaining unmapped navigation terms count.
- Final route inventory showing representative Docs, UI Blocks, Templates, UI Kit, and term item URLs.

## Files Expected To Change During Run

- `scripts/build-ui-vocabulary-data.mjs`
- `docs/ui-vocabulary/terms.yml`
- `docs/ui-vocabulary/schema.md`
- `examples/ui-vocabulary-site/src/data/terms.generated.ts`
- `examples/ui-vocabulary-site/src/lib/navigation-model.ts`
- `examples/ui-vocabulary-site/src/lib/search.ts`
- `examples/ui-vocabulary-site/src/App.tsx`
- `examples/ui-vocabulary-site/src/components/term-card.tsx`
- `examples/ui-vocabulary-site/src/components/term-detail.tsx`
- `examples/ui-vocabulary-site/src/components/*page*.tsx` or equivalent new page components
- `examples/ui-vocabulary-site/src/index.css` if layout spacing/sidebar width needs adjustment
- `CLAUDE.md` only if final IA wording changes

## Non-Goals

- No login, payment, auth, or server state.
- No Tailwind Plus source code copying.
- No complete remapping of every term before visible UI progress.
- No drawer as the primary detail interaction.
- No current card-as-introduction model as the primary page structure.
- No deployment push without explicit approval.

## Next Run Entry

Decisions are now resolved. Start with Step 1. Do not begin with App UI edits; the UI should depend on generated navigation data, not another hardcoded sidebar pass. The first implementation run should stop after Step 1 if generated data cannot safely carry navigation paths.
