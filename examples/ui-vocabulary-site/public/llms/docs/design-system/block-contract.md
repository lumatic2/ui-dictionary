# Block Contract — 조합 블록(앱 골격급 자산) 계약

Date: 2026-08-04 (M18)

A **block** is a page/app-skeleton-grade code asset: multiple verified sources wired together (shell + pages + states), distributed through the same shadcn-compatible registry as component-grade code assets. Recipes tell you *how to build*; code assets are *verified pieces*; a block is the tier above pieces — **a working composition you start a product from**, so that a hackathon or new-product kickoff begins at "already well designed" instead of a blank page.

Related: [agent-asset-model.md](agent-asset-model.md) reserved this tier as `code_asset.copy_scope: page | pack`. This document is the operating contract for that tier.

## 1. Tier marker — how a block is distinguished

`registry:block` is **not** the discriminator: every published asset already uses that item type. A block is identified by all of:

1. registry item `meta.tier: "block"` (derived by `scripts/generate-registry.mjs`);
2. source directory convention `examples/ui-vocabulary-site/src/components/blocks/<name>/` (multi-file);
3. an entry in §6 of this document (the canonical block list).

Component-grade assets keep their single-file convention and carry no `meta.tier`.

## 2. Registry representation

- `files[]`: every file in the block directory, path-preserved (layout root, pages, wired states, mock data file).
- `registryDependencies`: composed component-grade assets are declared as **URL references** (`https://ui.askewly.com/r/<name>.json`) so recursive resolution installs them; shadcn primitives are declared by bare name as usual.
- `dependencies`: npm packages actually imported by block files. The purity gate derives and cross-checks both lists from source — a declaration that disagrees with source fails the build.
- Allowed import surface inside a block: the standard asset surface (`react`, `lucide-react`, `@/components/ui/*`, `@/lib/utils`) **plus** relative imports within the block directory **plus** imports of registered code assets (`@/components/<asset-name>`), plus npm packages declared in `dependencies`. Site-coupled imports (`@/data/*`, site pages) remain forbidden.

## 3. Layout contract — what the block itself owns

Each block's source owns its composition: which assets sit where, how states are wired (e.g. empty state inside the table region, toast portal at shell root). The block must not modify the component assets it composes — mismatches are absorbed by thin adapters inside the block directory. **Routing stays out**: a block exports page components and a shell; wiring them into react-router/Next/TanStack is the consumer's job. Mock data ships as a data file, clearly separable.

## 4. Restyle obligation — required CSS variables

A block declares its **required CSS variable list** in its §6 entry. Values are owned by the consuming project's token definitions (its DESIGN.md-derived tokens), never by the block files — the same rule as [component-restyle.md](component-restyle.md). Shipping a block with its default face is a style-signature failure; after transplant you must remap to the project's own tokens and run `npx @askewly/design verify` until the block directory reports zero violations.

## 5. Absorption and attribution

Blocks may absorb external open-source composition (decision path: [absorption-criteria.md](absorption-criteria.md)). Rules:

- License must permit redistribution (MIT/Apache-2.0 class). Unclear or commercial per-block terms → reject, never assume.
- Attribution is carried in **two places**: a header comment in each absorbed source file (origin, license, copyright line) and the block's §6 entry.
- Absorbed sources are then held to the same gates as native ones: purity gate, semantic-token restyle, recipe checks/anti-patterns of the composed patterns.

## 6. Canonical blocks

| block | composition | base / attribution | required CSS variables |
|---|---|---|---|
| `saas-app-shell` | Inset sidebar shell + dashboard page (stat cards, interactive visitors chart, members table with search/empty-state/undo-toast) + sectioned settings page. Composes assets: `interactive-data-table`, `recoverable-empty-state`, `actionable-toast`. | Shell/dashboard absorbed from shadcn/ui block `dashboard-01` (© 2023 shadcn, MIT — headers in each absorbed file). Members region and settings page are Askewly originals. npm dep: `recharts`. | Standard shadcn set (`--background --foreground --card --card-foreground --popover --popover-foreground --primary --primary-foreground --muted --muted-foreground --accent --accent-foreground --border --input --ring`) plus the sidebar family (`--sidebar --sidebar-foreground --sidebar-primary --sidebar-primary-foreground --sidebar-accent --sidebar-accent-foreground --sidebar-border --sidebar-ring`), defined by the consuming project's token layer. |

## 7. Consumption path (agents and humans)

1. Discover: llms.txt Blocks section, or §6 here.
2. Transplant: fetch `/r/<name>.json`, write `files[].content` preserving paths, install `dependencies`, resolve `registryDependencies` (entry-protocol A-2.5 mechanics).
3. Restyle: mandatory, per §4.
4. Verify: `npx @askewly/design verify` → 0 violations, then the screen-medium gate (states, dark mode, contrast).

## 8. Kickstart consumption — the one-command path

`npx @askewly/design init --block <name>` wraps §7 plus project brief and token generation into one command, for hackathon/new-product kickoff:

1. **Abbreviated brief** — three text questions (tone, color direction, type direction), each with options and a recommended default. All other brief domains take recommended defaults, recorded as assumptions in the generated DESIGN.md. Non-interactive mode: `--yes` accepts every default; `--tone/--color/--type` inject answers (this is the agent path — the calling agent asks the user first, then passes flags).
2. **DESIGN.md generation** — answers are written as the project's own `DESIGN.md` (flat-colors template form), which becomes the project's look ownership.
3. **Token derivation** — a CSS variable definition layer is derived from that DESIGN.md, covering the block's required-CSS-variable list (§6).
4. **Transplant** — the block is fetched and written per §7; dependencies are reported (installed with `--install`).
5. **Restyle check** — the required-variable list is machine-compared against the derived token layer; any undefined variable exits 1 with the list. The comparison guarantees *presence only* — whether the values look right is settled by the human gate.
6. **Verify** — `verify` runs automatically and reports residual violations.

Failures never fall back silently: a missing block name, unreachable registry, or missing required answer exits 1 with the cause.

Inputs and outputs above are the contract; the implementation lives in `@askewly/design` (`init --block`). Until the CLI version carrying it is published, the §7 manual path remains available.

## Changelog

- 2026-08-04: 신설 (M18 step-2) — tier marker·registry 표현·레이아웃 계약·restyle 의무·흡수/표기 규칙·소비 경로.
