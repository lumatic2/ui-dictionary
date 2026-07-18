# Agent Asset Model

Date: 2026-07-04

## Purpose

This document defines how the same design-system content serves:

- people browsing the website;
- paid users copying code or downloading assets;
- Codex/Claude Code implementing product UI with less generic AI output.

The model is intentionally schema-level. It does not implement payment, licensing, or generated packages yet.

## Core Principle

Every design-system example should connect four layers:

1. **Reference evidence**: where the idea came from and what was observed.
2. **Human preview**: what a person sees on the website.
3. **Implementation asset**: code, tokens, screenshots, or downloadable files.
4. **Agent recipe**: instructions, constraints, prompt language, and anti-patterns that coding agents can use.

If an example only has a screenshot, it is inspiration. If it only has code, it is a snippet. It becomes part of the design system when all four layers are connected.

## Entity Model

### `surface`

Product context where the UI appears.

Fields:

- `id`: stable slug, e.g. `saas-dashboard`
- `name`: display name
- `description`: one paragraph
- `platforms`: `web`, `ios`, `android`, `mobile-web`, `desktop-web`
- `intents`: browse, compare, operate, analyze, purchase, learn, create, configure
- `density_default`: spacious, balanced, dense, data-heavy
- `reference_priority`: ordered source groups

### `pattern`

Reusable composition or page section.

Fields:

- `id`
- `surface_refs`
- `pattern_group`: marketing, application-ui, commerce, docs, data-display, forms, navigation, overlays, feedback, layout
- `name`
- `definition`
- `use_when`
- `avoid_when`
- `anatomy`
- `states`
- `responsive_behavior`
- `accessibility_notes`
- `motion_notes`
- `component_refs`
- `example_refs`
- `agent_recipe_ref`

### `component`

Primitive or reusable UI unit.

Fields:

- `id`
- `name`
- `role`
- `anatomy`
- `states`: default, hover, focus, active, disabled, loading, error, selected, expanded
- `keyboard_interaction`
- `aria_contract`
- `motion_contract`
- `token_refs`
- `anti_patterns`
- `example_refs`

### `token_set`

Design tokens and rules.

Fields:

- `id`
- `scope`: global, surface, pattern, component
- `color`
- `typography`
- `spacing`
- `radius`
- `border`
- `elevation`
- `motion`
- `breakpoints`
- `themes`
- `contrast_pairs`
- `source_refs`

### `example`

Rendered instance of a surface, pattern, or component.

Fields:

- `id`
- `title`
- `surface_ref`
- `pattern_refs`
- `component_refs`
- `token_set_ref`
- `source_refs`
- `preview_type`: static-image, live-component, interactive-demo, page-example
- `screenshots`
- `interaction_smoke`
- `code_asset_ref`
- `agent_recipe_ref`
- `access_level`: public-browse, free-copy, paid-copy, paid-download, internal-only
- `verification`

### `source_ref`

Reference provenance.

Fields:

- `id`
- `kind`: official-docs, official-repo, product-site, local-repo, screenshot, article, internal-note
- `url_or_path`
- `accessed_at`
- `observed_for`
- `transferable_principles`
- `non_transferable_identity`
- `evidence_paths`

### `code_asset`

Reusable implementation artifact.

> **Realized (RC2, 2026-07-19)**: the first production form of this entity is the shadcn-registry-compatible asset at `https://ui.askewly.com/r/<name>.json` (index: `/r/registry.json`, listed in llms.txt "Code Assets"). `files[].content` embeds the verified source; `registryDependencies`/`dependencies` are the declared deps; consumption contract is entry-protocol A-2.5 (fetch → transplant → mandatory restyle to project tokens per component-restyle.md). `license_level` for the first batch is `public`.

Fields:

- `id`
- `framework`: react, next, vite-react, react-native, flutter, html-css, design-md
- `files`
- `dependencies`
- `tokens_required`
- `copy_scope`: snippet, component, page, pack
- `license_level`: public, paid, internal
- `usage_notes`
- `verification_command`

### `agent_recipe`

Machine-readable and human-readable implementation guidance.

Fields:

- `id`
- `goal`
- `surface_refs`
- `pattern_refs`
- `component_refs`
- `prompt_phrases`
- `implementation_steps`
- `constraints`
- `anti_patterns`
- `quality_checks`
- `fallbacks`
- `source_refs`

## Example Record Shape

```yaml
id: "saas-dashboard-command-center"
surface_ref: "saas-dashboard"
pattern_refs:
  - "application-shell-sidebar"
  - "data-table-filterable"
  - "command-palette"
component_refs:
  - "sidebar-navigation"
  - "tabs"
  - "dropdown-menu"
  - "popover"
token_set_ref: "yusung-product-neutral-v0"
source_refs:
  - "tailwind-plus-application-ui"
  - "linear-ui-redesign"
preview_type: "interactive-demo"
screenshots:
  desktop: "docs/research/assets/..."
  mobile: "docs/research/assets/..."
interaction_smoke:
  - "open command palette"
  - "switch table tab"
  - "open row actions menu"
code_asset_ref: "react-tailwind-saas-dashboard-v0"
agent_recipe_ref: "recipe-saas-dashboard-command-center"
access_level: "public-browse"
verification:
  build: "npm run build"
  browser: "desktop and mobile smoke"
```

## Agent Recipe Format

Agent recipes should be short enough to fit into coding-agent context, but concrete enough to prevent generic UI.

Recommended sections:

1. Goal: what this recipe produces.
2. Use when: product situations where it fits.
3. Do not use when: failure modes.
4. Structure: required regions and hierarchy.
5. Components: primitives and interaction states.
6. Tokens: color/type/spacing/motion expectations.
7. Copy guidance: tone and label density.
8. Accessibility: keyboard, focus, aria, contrast.
9. Responsive behavior: desktop/tablet/mobile.
10. Anti-patterns: common AI-looking mistakes.
11. Verification: smoke checks or lint commands.

## Website UX Implication

Each public example page should eventually expose:

- visual preview;
- surface and pattern labels;
- short explanation;
- component anatomy;
- interaction controls;
- light/dark preview when relevant;
- source/provenance notes;
- public prompt phrase;
- gated copy/download affordance when the asset is paid;
- agent recipe summary.

## Paid Asset Boundary

Do not implement payment yet, but model access early.

Recommended access levels:

- `public-browse`: visible preview and explanation.
- `free-copy`: small snippets or prompt phrases can be copied.
- `paid-copy`: full component/page source can be copied.
- `paid-download`: bundles, assets, screenshots, templates, or packs can be downloaded.
- `internal-only`: research evidence or unfinished assets not exposed publicly.

Rules:

- Public pages can show structure and learning value without exposing full paid assets.
- Provenance and non-transferable identity notes must remain visible internally.
- Paid assets should be original implementations, not copied commercial source.

## Build Path

### Phase A - Markdown Registry

Start with Markdown/YAML frontmatter files under `docs/design-system/`.

Pros:

- easy to review;
- agent-readable;
- works before schema tooling exists.

### Phase B - Generated JSON/TypeScript

Generate site data from the registry.

Outputs:

- `examples/ui-vocabulary-site/src/data/design-system.generated.ts`
- optional JSON for agent/tool use.

### Phase C - Agent Packs

Generate compact recipe bundles for Codex/Claude Code.

Outputs:

- `docs/design-system/agent-packs/*.md`
- future custom skill inputs;
- optional DESIGN.md-derived token packs.

### Phase D - Paid Asset Packs

Only after public browsing and asset provenance are stable.

Outputs:

- downloadable code packs;
- screenshots/assets;
- implementation templates.

## Verification Model

Each `example` should declare at least one verification method:

- build command;
- lint command;
- visual audit;
- browser smoke;
- accessibility check;
- schema validation;
- manual reference review.

For interactive examples, browser smoke should verify the interaction, not just render the page.

## DSF4 Completion Check

DSF4 is complete when this document defines:

- the four-layer asset principle;
- entities for surfaces, patterns, components, token sets, examples, source refs, code assets, and agent recipes;
- access levels for public/free/paid/internal use;
- a staged build path;
- a verification model.
