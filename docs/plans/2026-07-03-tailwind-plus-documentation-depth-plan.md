# Tailwind Plus documentation depth plan

Date: 2026-07-03
Mode: product / harness
Phase: `tailwind-plus-documentation-depth`

## Why this plan exists

The current Documentation navigation now resembles Tailwind Plus, but many leaf
pages are still shallow. The next pass must treat Documentation as a first-class
docs product: open every Tailwind Plus documentation leaf, capture the reference,
record the page structure, then write local UI Dictionary documentation with
comparable depth and rhythm.

Reference root:

- `https://tailwindcss.com/plus/ui-blocks/documentation`

This is not a copy pass. Tailwind Plus structure, density, and information
architecture are the reference. Local page content must be rewritten for UI
Dictionary and Askewly's vocabulary product.

## planning_gate

```yaml
team_validation_mode: manual-pass
spec_delta: "Add a Documentation-depth product phase that covers every Tailwind Plus docs leaf with fresh reference captures, local content depth, and Chrome smoke evidence."
perspectives:
  product: "Users should be able to read each docs page as a useful implementation guide, not just land on a routed placeholder."
  architecture: "Move dense page data and the article renderer out of App.tsx if the content set becomes too large for a maintainable single file."
  security: "Use only public Tailwind Plus pages. Do not bypass paid/code gates, copy proprietary component source, or reuse Tailwind-owned assets."
  qa: "Every leaf needs reference screenshot evidence, local desktop/mobile smoke, build, lint, validator, and documentation ledger updates."
  skeptic: "The main failure mode is matching the side nav while leaving generic prose behind; each page must have sections, examples, tables, related terms, and page-specific guidance."
dod:
  - "All 15 Documentation leaf pages have fresh Tailwind desktop and mobile screenshots or an explicit capture blocker."
  - "All 15 local Documentation pages render article content with no raw search fallback."
  - "Chrome desktop and 390px mobile smoke passes every docs route with no console errors or horizontal overflow."
  - "npm run build, npm run lint, python scripts/validate-ui-vocabulary.py, and npm run audit:visuals pass or record only pre-existing warnings."
```

## Scope

In scope:

- Tailwind Plus Documentation side-nav groups:
  - Getting started: Getting set up, Using HTML, Using React, Using Vue, Assets
  - Elements: Introduction, Autocomplete, Command palette, Copy button, Dialog,
    Disclosure, Dropdown menu, Popover, Select, Tabs
- Fresh desktop and mobile screenshots for each Tailwind reference leaf.
- A capture ledger dedicated to Documentation content depth.
- Local UI Dictionary pages with comparable information density:
  overview, when to use, implementation shape, interaction behavior,
  accessibility notes, composition checklist, examples, pitfalls, related terms,
  and where useful API/property tables.
- Search/navigation smoke for all new docs routes.

Out of scope:

- Paid source code extraction.
- Tailwind-owned text/assets copied verbatim.
- Reworking the 93 UI Blocks example-page visual parity phase.
- Changing unrelated term data unless a docs page needs a related-term link that
  already exists in the vocabulary.

## Reference leaf inventory

| Group | Leaf | Tailwind URL | Local nav id |
| --- | --- | --- | --- |
| Getting started | Getting set up | `/plus/ui-blocks/documentation` | `docs-getting-started-setup` |
| Getting started | Using HTML | `/plus/ui-blocks/documentation/using-html` | `docs-getting-started-html` |
| Getting started | Using React | `/plus/ui-blocks/documentation/using-react` | `docs-getting-started-react` |
| Getting started | Using Vue | `/plus/ui-blocks/documentation/using-vue` | `docs-getting-started-vue` |
| Getting started | Assets | `/plus/ui-blocks/documentation/assets` | `docs-getting-started-assets` |
| Elements | Introduction | `/plus/ui-blocks/documentation/elements` | `docs-elements-introduction` |
| Elements | Autocomplete | `/plus/ui-blocks/documentation/autocomplete` | `docs-elements-autocomplete` |
| Elements | Command palette | `/plus/ui-blocks/documentation/command-palette` | `docs-elements-command-palette` |
| Elements | Copy button | `/plus/ui-blocks/documentation/copy-button` | `docs-elements-copy-button` |
| Elements | Dialog | `/plus/ui-blocks/documentation/dialog` | `docs-elements-dialog` |
| Elements | Disclosure | `/plus/ui-blocks/documentation/disclosure` | `docs-elements-disclosure` |
| Elements | Dropdown menu | `/plus/ui-blocks/documentation/dropdown-menu` | `docs-elements-dropdown-menu` |
| Elements | Popover | `/plus/ui-blocks/documentation/popover` | `docs-elements-popover` |
| Elements | Select | `/plus/ui-blocks/documentation/select` | `docs-elements-select` |
| Elements | Tabs | `/plus/ui-blocks/documentation/tabs` | `docs-elements-tabs` |

## Step tree

- [x] Step 0: reference capture matrix and content ledger
  - Verify: all 15 rows have Tailwind desktop/mobile screenshot paths or a
    documented blocker.
- [x] Step 1: docs data model and article renderer extraction
  - Verify: article data is maintainable outside the large route shell, local
    docs nav still renders, and build passes.
- [x] Step 2: Getting started pages
  - Verify: five setup pages have page-specific depth and local desktop/mobile
    smoke evidence.
- [x] Step 3: Elements batch A
  - Scope: Introduction, Autocomplete, Command palette, Copy button, Dialog.
  - Verify: five element pages have page-specific guidance, examples, tables
    where useful, and local smoke evidence.
- [x] Step 4: Elements batch B
  - Scope: Disclosure, Dropdown menu, Popover, Select, Tabs.
  - Verify: five element pages have page-specific guidance, examples, tables
    where useful, and local smoke evidence.
- [x] Step 5: cross-page docs QA
  - Verify: all docs routes pass build/lint/validator/audit, Chrome desktop and
    mobile smoke, console check, no-overflow check, and ledger completeness.

## Decision log

- Reference scope: Tailwind Plus Documentation only. The older Tailwind CSS docs
  capture is superseded for this task.
- Content ownership: match page depth and structure, but write original UI
  Dictionary content.
- Implementation structure: prefer extracting documentation page data and the
  article renderer if the current `App.tsx` content block becomes unwieldy.
- Current shell work: keep the side-nav scaffold, but replace shallow template
  pages with real page-specific content.
- User-owned decisions remaining before run: none expected. Stop only if the
  public Tailwind page becomes inaccessible, capture tooling breaks, or a page
  requires paid-only details.

## Evidence outputs

- `docs/research/tailwind-plus-documentation-depth-ledger.md`
- `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/`
- `phases/tailwind-plus-documentation-depth/index.json`
- `phases/tailwind-plus-documentation-depth/step0.md` through `step5.md`

## Stop points

Stop and ask only if:

- Chrome cannot capture the public Tailwind reference pages.
- A Tailwind page shows only paid/private content and no useful public shell.
- The local route architecture needs a broader route/data-model decision than
  this phase covers.
- Build/lint/validator failures appear unrelated to this phase and cannot be
  safely fixed in the same scope.
