# Tailwind Plus parity expansion plan

Date: 2026-07-01
Mode: product planning
Phase candidate: `phases/tailwind-style-page-catalog`

## Context

`CLAUDE.local.md` asks the next `$harness` run to expand beyond the single
Hero Sections page into a Tailwind Plus-style catalog:

- top-level Plus lines: `UI Blocks`, `Templates`, `UI Kit`
- UI Blocks axes: `Marketing`, `Application UI`, `Ecommerce`
- page-by-page implementation from reference capture to local smoke

The current local phase has already completed the first modeled tree through
Marketing, Application UI, Ecommerce, Templates, and UI Kit. This plan defines
the next parity expansion against the broader Tailwind Plus public structure,
without copying Tailwind proprietary code or runtime assets.

Reference sources:

- Tailwind Plus UI Blocks: https://tailwindcss.com/plus/ui-blocks
- Tailwind Plus Hero Sections: https://tailwindcss.com/plus/ui-blocks/marketing/sections/heroes
- Tailwind Plus Templates: https://tailwindcss.com/plus/templates
- Tailwind Plus UI Kit: https://tailwindcss.com/plus/ui-kit
- Local analysis: `docs/research/2026-06-30-tailwind-site-structure-analysis.md`
- Local backlog: `docs/plans/2026-07-01-tailwind-parity-implementation-backlog.md`
- Live Chrome captures: `docs/research/assets/tailwind-plus-live-2026-07-01/`
- Capture ledger: `docs/research/tailwind-plus-capture-ledger.md`
- Canonical local page capture: `docs/research/assets/local-hero-sections-2026-07-01/`
- Canonical mobile pair: `docs/research/assets/hero-sections-mobile-2026-07-01/`

## Current Strategy

The current phase intentionally prioritizes close Tailwind Plus parity. The goal
is to reproduce the public structure, navigation model, page hierarchy, example
rhythm, toolbar behavior, desktop/mobile layout, and locked/public access states
as closely as possible.

Later phases can rename, restyle, simplify, or adapt the product to the user's
own visual language. Do not mix that future personalization into this phase.

Parity means:

- follow the public Tailwind page shape closely
- keep UI Dictionary-native terms, copy, route names, and preview assets
- do not copy Tailwind code, paid snippets, proprietary image assets, or paid
  template internals
- represent paid boundaries as visible lock/deferred states when they appear

## Capture-First Operating Rule

Every implementation batch must start from the live Tailwind site in Chrome.

For each target page or page family:

1. Open the real Tailwind URL in Chrome.
2. Capture desktop viewport evidence.
3. Capture a mobile viewport evidence pair for the same Tailwind URL and local
   route. Mobile is not optional for page parity.
4. Compare how the real page handles:
   - top bar and breadcrumb compression
   - side navigation hiding or replacement
   - example toolbar wrapping
   - preview frame width, clipping, horizontal overflow, and scroll behavior
   - H1/body text rhythm and first example entry point
5. Treat the local mobile route as incomplete until it has a matching screenshot
   and an explicit overflow/text-overlap check.
6. Record the visible page structure, headings, left navigation, example labels,
   toolbar controls, preview rhythm, and paywall or sign-in signals.
7. Implement only what is publicly visible without payment or login.
8. Use original UI Dictionary copy, previews, and generated assets. Tailwind
   screenshots are research evidence only, never runtime assets.
9. Run local verification on the matching UI Dictionary route.
10. Save the local route and verification result next to the capture evidence.

Public-access boundary:

- Allowed: public landing pages, category pages, visible example previews,
  visible sidebars, visible labels, visible locked states, public template
  gallery cards, Catalyst landing content.
- Not allowed: bypassing payment, extracting private code, using paid snippets,
  copying proprietary preview assets, or simulating a logged-in Plus account.
- If a page exposes `Get full access`, `Sign in`, `Get the code`, or locked code
  controls, implement the visible gallery/preview shape and mark code/detail
  access as locked or deferred.

Current live capture set:

| Slug | URL | Evidence |
| --- | --- | --- |
| `ui-blocks` | `https://tailwindcss.com/plus/ui-blocks` | `docs/research/assets/tailwind-plus-live-2026-07-01/ui-blocks-viewport.png` |
| `marketing` | `https://tailwindcss.com/plus/ui-blocks/marketing` | `docs/research/assets/tailwind-plus-live-2026-07-01/marketing-viewport.png` |
| `application-ui` | `https://tailwindcss.com/plus/ui-blocks/application-ui` | `docs/research/assets/tailwind-plus-live-2026-07-01/application-ui-viewport.png` |
| `ecommerce` | `https://tailwindcss.com/plus/ui-blocks/ecommerce` | `docs/research/assets/tailwind-plus-live-2026-07-01/ecommerce-viewport.png` |
| `templates` | `https://tailwindcss.com/plus/templates` | `docs/research/assets/tailwind-plus-live-2026-07-01/templates-viewport.png` |
| `ui-kit` | `https://tailwindcss.com/plus/ui-kit` | `docs/research/assets/tailwind-plus-live-2026-07-01/ui-kit-viewport.png` |
| `hero-sections-detail` | `https://tailwindcss.com/plus/ui-blocks/marketing/sections/heroes` | `docs/research/assets/tailwind-plus-live-2026-07-01/hero-sections-detail-viewport.png` |

`summary.json` in the same folder stores the DOM heading/link/paywall signal
summary from the Chrome run.

The durable capture/status ledger is
`docs/research/tailwind-plus-capture-ledger.md`. Update that file before and
after each leaf implementation. Do not create ad hoc per-session status formats
unless the ledger itself is extended.

Canonical implemented reference:

| Local page | Evidence | Notes |
| --- | --- | --- |
| `?filter=nav%3Aplus-marketing-hero-sections` desktop | `docs/research/assets/local-hero-sections-2026-07-01/hero-sections-local-desktop-viewport.png` | Verified as the current best implemented page. It has Tailwind-like left navigation, breadcrumb, 12 stacked examples, `Preview`/`Code`/`Get the code` controls, and no desktop horizontal overflow in the Chrome check. |
| Tailwind Hero Sections mobile | `docs/research/assets/hero-sections-mobile-2026-07-01/tailwind-hero-sections-mobile-390.png` | Mobile reference for how Tailwind compresses header, breadcrumb, toolbar, and preview frame. |
| Local Hero Sections mobile | `docs/research/assets/hero-sections-mobile-2026-07-01/local-hero-sections-mobile-390.png` | Local mobile baseline to compare before implementing sibling leaf pages. |

## Scope Boundary

This is an expansion plan, not a deployment plan.

In scope:

- fill Tailwind Plus category gaps that are not yet modeled locally
- keep the Tailwind-like page shell and static sidebar model
- add original UI Dictionary previews for each new page
- connect every page to representative local terms
- run local build, validator, lint, visual audit, and Chrome smoke per batch

Out of scope:

- production deploy
- copying Tailwind Plus code, templates, or proprietary preview assets
- adding auth, billing, user accounts, or external services
- copying Tailwind template product internals. The public gallery structure can
  be mirrored closely, but runtime template names, assets, and page examples
  should be original UI Dictionary analogs.

## Autonomy Rules

The plan should not stop for issues the agent can resolve locally.

Default resolutions:

- Capture ledger format: use `docs/research/tailwind-plus-capture-ledger.md`.
- Capture location: use `docs/research/assets/tailwind-plus-live-<date>/` for
  Tailwind captures and a matching local folder when needed.
- Missing local representative term: add a small representative term or mark the
  ledger row `needs-term`; continue implementing the public page shell.
- Zero-count local category: still implement the page shell if Tailwind has a
  public page; use placeholder vocabulary links only when needed and record the
  gap.
- Tailwind detail/code locked by payment: implement the visible page shell,
  visible previews, visible toolbar, and lock/deferred state; do not ask the
  user unless the whole public page is unusable.
- Mobile mismatch: fix layout locally until the route has no incoherent text
  overlap, no unintended horizontal page overflow, and reachable toolbar
  controls.
- Long page screenshot timeout: capture viewport slices instead of stopping.
- Exact Tailwind category names vs local naming: use Tailwind names during this
  parity phase; user-specific renaming is a later phase.
- Existing dirty worktree: preserve unrelated changes; append/update ledger and
  scoped implementation files only.

Only stop for:

- production deploy approval
- destructive git/file operations
- a source page that is fully inaccessible without login/payment and has no
  useful public shell
- repeated local verification failure after reasonable fixes

## No-Stop Execution Contract

The working assumption is: keep moving until the public Tailwind Plus parity
surface is closed. Do not pause for naming, styling, exact copy, or local
taxonomy decisions during this phase.

Use these default decisions unless the user explicitly changes direction:

| Situation | Default action |
| --- | --- |
| Tailwind page exists but code is locked | Capture the public page and implement the visible preview/shell with a locked/deferred code state. |
| Tailwind page has no local route yet | Add the official Tailwind-like route id and sidebar entry; keep older local extras hidden or secondary. |
| Tailwind leaf has no perfect term match | Use the closest existing representative terms; add `needs-term` only if the page would otherwise be empty. |
| Tailwind category conflicts with current local grouping | Match Tailwind for Plus parity; keep local-only pages as extras after the official set. |
| Template name is Tailwind-owned | Record the Tailwind name in research only; runtime uses original UI Dictionary names/assets. |
| Mobile layout differs | Fix local layout before moving on; mobile parity is part of the batch, not a later cleanup. |
| Screenshot capture times out | Capture smaller viewport slices or retry once with headless Chrome; do not abandon the leaf. |
| A batch is too large | Split by Tailwind group, not by arbitrary file count, then continue with the next group. |

Each batch closes only when all four evidence types exist for each accessible
leaf: Tailwind desktop, Tailwind mobile, local desktop, and local mobile. The
minimum local verification bundle is:

1. `python scripts/validate-ui-vocabulary.py`
2. `cd examples/ui-vocabulary-site && npm run build`
3. `cd examples/ui-vocabulary-site && npm run lint`
4. `cd examples/ui-vocabulary-site && npm run audit:visuals`
5. Chrome smoke for all batch routes:
   - route renders a non-empty page
   - example count is non-zero, unless the ledger says `locked-preview` or
     `needs-term`
   - `Preview` controls are visible where the Tailwind page has examples
   - desktop horizontal overflow is false
   - mobile screenshot shows no incoherent overlap and reachable toolbar controls

If one route fails smoke, fix that route inside the batch and rerun the batch
smoke. Only mark the phase `blocked` if the same failure remains after local
code fixes and the failure depends on inaccessible external state.

## Confirmed Implementation Scale

This is not a single-page parity task. Treat it as a long product phase.

Public Tailwind UI Blocks structure visible in Chrome:

- `UI Blocks` landing
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
- `Templates` landing
  - public gallery cards include visible names such as `Oatmeal`, `Spotlight`,
    `Radiant`, `Compass`, `Salient`, `Studio`, `Primer`, `Protocol`, `Commit`,
    `Transmit`, `Pocket`, `Syntax`, and `Keynote`
- `UI Kit` landing
  - public Catalyst story sections include design intent, included components,
    technology, starter-kit positioning, pricing, testimonials, and FAQ
- `Documentation` / docs-like links
  - Tailwind Plus detail pages expose a `Documentation` item in the side
    navigation area. Treat it as a public reference/navigation surface to
    inspect and mirror where visible, not as paid code documentation to clone.

Implementation implication:

- Marketing is only the first axis, not the main project.
- Application UI is the largest axis and should be split into at least three
  batches: structure/data/lists, forms/navigation/overlays, elements/layout/page
  examples.
- Ecommerce is smaller but still needs both component pages and page-example
  pages.
- Templates should be implemented as a public gallery/landing and original local
  template analogs, not as Tailwind template clones.
- UI Kit should be a Catalyst-style public landing plus local component-system
  pages, not a paid code documentation clone.
- Documentation should be checked wherever Tailwind exposes it in the same
  public navigation frame. If it is only a public docs link, implement our
  equivalent as `Docs`/reference navigation. If it crosses into paid/code-only
  content, record the boundary and stop there.

## Leaf-Page Iteration Model

The unit of implementation is usually a Tailwind leaf page, not a whole axis.

Example:

`UI Blocks -> Marketing -> Page Sections -> Hero Sections`

This one leaf means:

1. Open `https://tailwindcss.com/plus/ui-blocks/marketing/sections/heroes`.
2. Capture the Tailwind page at desktop and mobile sizes.
3. Record:
   - left side navigation headings
   - active parent group and active leaf
   - page breadcrumb/title/description
   - visible example names
   - per-example toolbar controls such as `Preview`, `Code`, viewport/theme
     buttons, `Get the code`, or lock/full-access prompts
   - public vs paid access boundary
4. Implement the UI Dictionary equivalent page.
5. Capture the local route at desktop and mobile sizes.
6. Verify:
   - desktop no horizontal overflow
   - mobile no incoherent text overlap
   - mobile toolbar controls remain reachable
   - preview clipping or horizontal scroll matches the Tailwind reference
   - first example appears at a comparable rhythm below the H1
7. Record evidence.

Hero Sections is the canonical example for this loop. New leaf pages should
reuse its structure unless the live Tailwind capture shows a different page
pattern:

- static left nav on desktop
- compact top breadcrumb/header on mobile
- one H1 and short intro
- vertically stacked examples
- per-example toolbar
- large preview frame first, term links second
- mobile-specific rhythm check before moving to the next leaf

Repeat the same loop for every sibling leaf under the current group before
moving to the next group, unless a capture shows the group is paid-only or
publicly empty.

Required traversal order:

1. `UI Blocks / Marketing`
   - `Page Sections` leaf pages
   - `Elements` leaf pages
   - `Feedback` leaf pages
   - `Page Examples` leaf pages
2. `UI Blocks / Application UI`
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
3. `UI Blocks / Ecommerce`
   - `Components`
   - `Page Examples`
4. `Documentation` / public docs-like surfaces visible from Tailwind Plus pages
5. `Templates`
   - public landing/gallery cards first
   - public detail pages only if accessible without payment/login
6. `UI Kit`
   - public Catalyst landing first
   - public component-system pages only if accessible without payment/login

Ledger requirement:

Each leaf page should eventually have one row in
`docs/research/tailwind-plus-capture-ledger.md` with:

| Field | Meaning |
| --- | --- |
| `tailwind_url` | Real Tailwind URL opened in Chrome |
| `axis` | `Marketing`, `Application UI`, `Ecommerce`, `Documentation`, `Templates`, or `UI Kit` |
| `group` | Parent group such as `Page Sections` or `Forms` |
| `leaf` | Leaf page such as `Hero Sections` |
| `access` | `public`, `locked-preview`, `paid-only`, or `missing` |
| `capture_desktop` | Screenshot path |
| `capture_mobile` | Screenshot path; use `n/a` only when the source page is inaccessible |
| `local_desktop_capture` | Local screenshot path |
| `local_mobile_capture` | Local mobile screenshot path |
| `local_route` | UI Dictionary route |
| `status` | `captured`, `implemented`, `verified`, `blocked`, or `deferred` |
| `verification` | Build/lint/smoke evidence, including mobile overflow/text-overlap result |

For `verified`, the row must include Tailwind desktop/mobile evidence, local
desktop/mobile evidence, and a concise verification note. For `locked-preview`,
the row must say what is publicly visible and what is paid/deferred.

## Current Parity Gap

### Marketing

Marketing public leaf parity is now verified for the 2026-07-01 live inventory:
23 public leaf pages across `Page Sections`, `Elements`, `Feedback`, and
`Page Examples`.

Evidence:

- Ledger rows:
  `docs/research/tailwind-plus-capture-ledger.md`
- Screenshots:
  `docs/research/assets/marketing-leaves-2026-07-01/`
- Batch summary:
  `docs/research/assets/marketing-leaves-2026-07-01/capture-summary.json`
- Local desktop smoke:
  `docs/research/assets/marketing-leaves-2026-07-01/local-desktop-smoke.json`

Treat Marketing as a completed baseline unless a fresh Chrome pass finds new
public leaves. If new leaves appear, append them to the ledger and process them
with the same loop instead of reopening the completed 23 leaves.

### Application UI

Local has many Application UI pages, but the official structure is wider than
the current model. Next gaps to fill:

- Headings: add `Card Headings`; keep `Table Headings` only if it remains useful
  as a UI Dictionary-native extra.
- Lists: split out a real `Lists` group with `Stacked Lists`, `Tables`,
  `Grid Lists`, and `Feeds`.
- Navigation: add `Vertical Navigation` and `Progress Bars`; keep `Sidebars`
  as a UI Dictionary-native complement if it is useful.
- Overlays: add `Notifications`.
- Feedback: narrow official parity to `Alerts` and `Empty States`; keep
  `Skeletons` and `Toasts` as UI Kit/Docs vocabulary, not required Plus parity.
- Layout: add `Cards`, `List containers`, and `Media Objects`.
- Page Examples: align the official parity set around `Home Screens`,
  `Detail Screens`, and `Settings Screens`; keep local dashboards/auth/onboarding
  as additional examples after the official set exists.

Implementation order for Application UI:

1. Inventory and ledger rows for all public Application UI leaves.
2. Route/model alignment for missing official ids:
   - `Card Headings`
   - `Lists / Stacked Lists`
   - `Lists / Tables`
   - `Lists / Grid Lists`
   - `Lists / Feeds`
   - `Vertical Navigation`
   - `Sidebar Navigation`
   - `Progress Bars`
   - `Command Palettes`
   - `Modal Dialogs`
   - `Notifications`
   - `Cards`
   - `List containers`
   - `Media Objects`
   - `Home Screens`
   - `Detail Screens`
   - `Settings Screens`
3. Sidebar order aligned to Tailwind's public Application UI navigation.
4. Desktop/mobile Tailwind and local screenshots for every official leaf.
5. Batch build/lint/validator/audit and route smoke before marking ledger rows
   `verified`.

Keep existing local-only pages available if useful, but do not let them replace
the official Tailwind leaf names during this parity phase.

### Ecommerce

Local Ecommerce is close, but still missing public category equivalents:

- Components: add `Incentives`.
- Page Examples: add `Order History Pages`.
- Recheck `Order History` naming so component pages and page examples are not
  conflated.

### Templates

Local Templates currently use generic screen families. Tailwind Plus uses named
complete template products. Add a product-gallery layer with UI Dictionary-native
template analogs:

- Marketing/site templates inspired by the public template gallery shape.
- SaaS/product templates that show full landing, pricing, docs, or blog flows.
- App/dashboard templates that show complete shells and settings flows.
- Ecommerce templates that show storefront, product, cart, checkout, and account.

Use Tailwind template names only as reference labels in research notes. Runtime
pages should have original names, descriptions, preview assets, and vocabulary
links.

### UI Kit

Local UI Kit is useful but not yet Catalyst-like. Reframe it as a component
system entry point:

- landing page explains component families and state vocabulary
- component docs link to local term pages, not cloned Catalyst docs
- add pages for high-value component-system primitives:
  `Button`, `Input`, `Textarea`, `Checkbox`, `Radio Group`, `Switch`,
  `Combobox`, `Listbox`, `Dropdown`, `Pagination`, `Navbar`, `Sidebar`,
  `Table`, `Description List`, `Badge`, `Avatar`, `Divider`, `Heading`,
  `Text`, `Alert`, `Dialog`, `Sidebar Layout`, `Stacked Layout`, `Auth Layout`

### Documentation

Tailwind Plus detail pages can expose a `Documentation` item near the UI Blocks
navigation. Treat this as a sibling public surface to inspect:

- If it leads to public Tailwind CSS docs or public usage docs, mirror the role
  in our `Docs` surface with UI Dictionary-native concepts and links.
- If it leads to paid code docs or requires sign-in/payment, record the lock
  state and do not attempt to bypass it.
- Add capture evidence before changing our Docs navigation.

## Step Tree

- [x] Step 21: Capture ledger protocol
  - Verify: `docs/research/tailwind-plus-capture-ledger.md` is the markdown
    source of truth for Tailwind URL, access boundary, desktop/mobile reference
    captures, local route, local desktop/mobile captures, status, and
    verification notes.
- [x] Step 22: Marketing live leaf inventory
  - Verify: Chrome inventory found 23 public Marketing leaves across
    `Page Sections`, `Elements`, `Feedback`, and `Page Examples`; each has a
    matching local route.
- [x] Step 23: Marketing leaf capture evidence
  - Verify: all 23 Marketing leaves have Tailwind desktop/mobile and local
    desktop/mobile screenshots under
    `docs/research/assets/marketing-leaves-2026-07-01/`.
- [x] Step 24: Marketing leaf verification
  - Verify: all 23 local Marketing routes render examples and `Preview`
    controls with desktop overflow false; build, validator, lint, and visual
    audit passed.
- [x] Step 25: Application UI official leaf parity
  - Verify: all 49 public Application UI leaves have ledger rows, Tailwind
    desktop/mobile captures, local desktop/mobile captures, local route smoke,
    and official sidebar order. Missing official leaves listed in the
    Application UI section above must have local route ids before this step can
    close.
- [x] Step 26: Ecommerce leaf inventory and gap pages
  - Verify: Chrome smoke routes for `Incentives` and `Order History Pages`;
    ensure component/page-example naming is distinct.
- [x] Step 27: Documentation public-surface pass
  - Verify: any visible `Documentation` entry from Tailwind Plus pages is
    captured and mapped to our `Docs` route or explicitly marked locked/deferred.
- [x] Step 28: Template public gallery
  - Verify: Templates landing shows named complete products with original
    preview assets and routes; no Tailwind-owned preview assets are used. Paid
    template detail/code access is represented only as a public lock/deferred
    state.
- [x] Step 29: Catalyst-style UI Kit entry and component docs
  - Verify: UI Kit landing and component-family routes link to local terms and
    explain states/usage without duplicating Plus UI Blocks pages.
- [x] Step 30: Cross-surface QA and IA cleanup
  - Verify: `python scripts/validate-ui-vocabulary.py`,
    `cd examples/ui-vocabulary-site && npm run build && npm run lint &&
    npm run audit:visuals`, desktop/mobile Chrome smoke, and a no-empty-page
    check for every Plus nav leaf.

## Planning Gate

```yaml
planning_gate:
  team_validation_mode: manual-pass
  spec_delta: "Tailwind parity now means broad public-structure parity, not only the currently modeled local tree. Extend Application UI, Ecommerce, Templates, and UI Kit while preserving original UI Dictionary assets and explanations."
  perspectives:
    product: "Users should browse by the same practical mental model as Tailwind Plus, then land on UI Dictionary-native explanations and prompts."
    architecture: "Keep navigation-model plus structured page data; avoid hardcoding one-off pages where a typed catalog config can cover new categories."
    security: "No secrets, auth, billing, payment bypass, or external writes. Tailwind screenshots are research evidence only, not runtime assets."
    qa: "Each batch starts with Chrome desktop and mobile capture and ends with validator/build/lint/visual audit plus desktop and mobile Chrome smoke. Include a failure-path check for empty pages, paid-only pages, missing representative terms, mobile overflow, and text overlap."
    skeptic: "A broad nav tree can become fake parity if pages repeat generic previews. Each page needs at least three distinct examples or a conscious deferred marker."
  dod:
    - "Each implemented page has a Tailwind capture evidence path and local route evidence."
    - "Each implemented page has Tailwind desktop/mobile captures and local desktop/mobile captures unless the source is inaccessible."
    - "Every public leaf page under Marketing, Application UI, Ecommerce, and Documentation has a capture ledger status."
    - "All official UI Blocks gaps listed above have local routes or explicit deferred notes."
    - "Templates has a named product-gallery layer with original preview assets."
    - "UI Kit reads as a component-system surface, not a duplicate of UI Blocks."
    - "Every Plus nav leaf either has examples and term links or is blocked with a clear reason."
    - "Local verification passes before any production deploy discussion."
```

## Stop Points

- Do not stop after inventory if the live site only adds leaves. Append rows to
  the ledger and continue.
- Do not stop for the capture format: use
  `docs/research/tailwind-plus-capture-ledger.md`.
- Do not stop for Tailwind-owned names: keep them in research notes and use
  original runtime names/assets where the surface is not a literal Plus
  navigation label.
- Do not stop for template naming during the parity phase. Mirror public gallery
  structure now; keep local runtime names/assets original and revisit naming in
  the later personalization phase.
- Do not stop whenever a page requires payment/login for code or details. Record
  the visible public shell and continue to another public page. Stop only if the
  entire page has no useful public content.
- Stop before production deploy.
- Stop on build, validator, lint, visual audit, or Chrome smoke failure only
  after attempting local fixes within the scoped batch.

## Recommended Next Move

Current parity expansion phase is complete.

Marketing, Application UI, Ecommerce, Documentation, Templates, and UI Kit now
have public parity evidence. Cross-surface QA passed with 189/189 Plus
navigation routes rendering non-empty content and no desktop horizontal overflow
failures. Remaining work belongs to a later personalization phase: renaming,
restyling, and replacing close Tailwind labels with the user's own product
language.

Continue using this loop:

`Tailwind URL -> screenshot -> visible structure summary -> access boundary ->
local route -> implementation -> local Chrome smoke -> ledger update`.

After Application UI, continue directly to Ecommerce, Documentation, Templates,
and UI Kit unless one of the explicit stop points above is hit.
