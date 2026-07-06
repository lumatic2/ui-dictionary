# Local Design System Integration Audit

Date: 2026-07-04

## Purpose

RME3 audits Yusung's existing local design-system work so `ui-dictionary` can grow into a public design-system site without duplicating or burying earlier work.

This audit covers:

- `C:\Users\yusun\projects\design-manual`
- `C:\Users\yusun\projects\claude-design-manual`
- `C:\Users\yusun\projects\custom-skills\design-bootstrap`
- `C:\Users\yusun\projects\custom-skills\design-bridge`
- `C:\Users\yusun\projects\custom-skills\design-harness`
- `C:\Users\yusun\projects\custom-skills\design-screen`

## Current Repo Role

`ui-dictionary` started as a searchable UI vocabulary encyclopedia. The new objective raises it into Askewly Design: a public website for people to browse UI, web, mobile, SaaS, ecommerce, interaction, color, and typography references, plus an agent-usable asset and implementation system.

That means this repo should not absorb every historical file. It should become the visible and queryable product surface, while deeper methodology and automation can remain in their source repositories until their contracts are stable.

## Source Inventory

| Source | Observed evidence | Current role | Integration decision |
|---|---|---|---|
| `design-manual` | `README.md`, `docs/PRD.md`, `docs/ARCHITECTURE.md`, `design-md/`, `cookbook/`, `schema/`, `templates/`, `scripts/`, `docs/ui-vocabulary/` | Canonical design methodology and design-md harness repo. Also contains the earlier UI Vocabulary seed. | **Link + selectively merge.** Keep as source for tokens, DESIGN.md families, cookbook techniques, lint/build scripts, and harness templates. Merge only product-facing vocabulary/schema lessons into `ui-dictionary`. |
| `claude-design-manual` | `claude-design-manual.md`, `ROADMAP.md`, `experiments/phase1/`, `exports/` | Claude Design learning manual and experiment archive. | **Link, do not merge.** Use as workflow reference for Claude Design handoff, design-system publishing, prompt patterns, and evidence format. Keep experiments out of this repo unless converted into reusable public case studies. |
| `design-bootstrap` skill | `SKILL.md` describes DESIGN.md initialization, style-family selection, lint hook, optional VRT | Greenfield project design harness installer. | **Link as agent entrypoint.** Public site should explain the concept; the executable stays in `custom-skills`. |
| `design-bridge` skill | `SKILL.md` maps DESIGN.md semantic tokens into brownfield CSS variables, especially shadcn/custom/generic profiles | Brownfield token bridge. | **Link + future adapter spec.** Useful for paid/agent layer where a user applies Yusung design tokens to an existing app. |
| `design-harness` skill | `SKILL.md` covers DesignSync, Codebase context, Claude Design HTML-to-React conversion, DESIGN.md propagation | Operating loop after bootstrap. | **Link + model into agent asset workflow.** Do not copy implementation until this repo has a stable agent asset manifest. |
| `design-screen` skill | `SKILL.md` implements one screen/section from existing DESIGN.md, with render verification | Per-screen implementation worker. | **Link + adopt quality bar.** Its scope rules are directly relevant to future one-page UI tasks in this repo. |

## What Should Move Into `ui-dictionary`

### 1. UI vocabulary product model

`design-manual/docs/ui-vocabulary/PLAN.md` already defines the original dictionary shape:

- Korean/English term names
- aliases
- plain explanation
- visual example
- AI prompt phrase
- React/CSS mini mocks
- browser capture/export later

This model belongs in `ui-dictionary`, because it is product-facing and matches the public website objective.

Action:

- Keep `ui-dictionary` as the canonical site for vocabulary browsing.
- Reconcile any remaining useful schema fields from `design-manual/docs/ui-vocabulary/` into this repo's data model.
- Do not back-port the current Tailwind Plus parity work into `design-manual`; it is now richer and belongs here.

### 2. Surface taxonomy

This repo now has `docs/design-system/surface-taxonomy.md`. That should become the canonical taxonomy for the public site:

- documentation
- component leaf pages
- marketing pages
- application UI
- ecommerce
- account/settings
- mobile
- agent assets

Action:

- Treat `design-manual` UI Vocabulary categories as a subset, not the top-level taxonomy.
- Map every reference capture, UI pattern, and future paid asset into this taxonomy.

### 3. Cookbook-to-page relationship

`design-manual/cookbook/00-INDEX.md` defines cookbook notes as technique cards, not a vocabulary. This is a useful distinction:

- UI Vocabulary: what a component/pattern is called and what it looks like.
- Cookbook: how to implement or adapt a technique in a design system.

Action:

- In `ui-dictionary`, create future links from component/pattern pages to cookbook-style implementation notes.
- Do not copy every cookbook file now. Import only when a page needs an implementation technique.

### 4. Quality bar for implementation pages

The `design-screen` skill says a screen must use actual domain text, existing design tokens, render verification, text-fit checks, and responsive smoke. This matches the user's current critique of empty shell pages.

Action:

- Add this as an implementation quality bar for future `Marketing`, `Application UI`, and `Ecommerce` page work.
- A page is not complete if it only has static prose or a non-interactive mock.

## What Should Stay External

### 1. `design-md` engine and lint scripts

`design-manual` owns:

- `design-md/<family>/DESIGN.md`
- token schema and linter
- `init-design.sh`
- `propagate.sh`
- VRT template generation

These are lower-level infrastructure. Copying them into `ui-dictionary` would create two sources of truth.

Decision: **external source, linked and consumed later.**

### 2. Claude Design manual experiments

`claude-design-manual` contains product-specific learning notes, pricing/plan notes, exported bundles, screenshots, and experiments. It is valuable but not itself the public design system.

Decision: **external archive and workflow reference.**

Candidate future extraction:

- Claude Design handoff pattern
- transcript-first implementation rule
- static drop quality-check path
- design-system publish/verify loop

### 3. Custom skill execution logic

The design skills are executable agent workflows. Their source of truth is `custom-skills`, not this repo.

Decision: **reference them in the agent asset model; do not vendor them.**

## Integration Architecture

```text
ui-dictionary
  public website
  reference captures
  pattern taxonomy
  component/page examples
  downloadable/copyable assets later
  agent asset manifest later

design-manual
  DESIGN.md families
  token/lint/build infrastructure
  cookbook techniques
  reusable templates

custom-skills
  design-bootstrap
  design-bridge
  design-harness
  design-screen

claude-design-manual
  Claude Design workflow research
  handoff experiments
  manual/PDF/archive
```

## Merge / Link / Supersede / Archive Decisions

| Artifact | Decision | Reason |
|---|---|---|
| `design-manual/docs/ui-vocabulary/PLAN.md` | **Merge conceptually** | It is the seed of this repo's original product model. |
| `design-manual/docs/ui-vocabulary/terms.yml` | **Audit before merge** | Could contain useful terms, but current repo may already have a changed schema and richer Tailwind-derived examples. |
| `design-manual/docs/ui-vocabulary/future-dictionary-sites.md` | **Merge as strategy** | It clarifies that UI, UX, and developer dictionaries can share engine patterns while remaining distinct products. |
| `design-manual/design-md/*` | **Link** | Token families are infrastructure, not public site content by default. |
| `design-manual/cookbook/*` | **Link then selectively merge per page** | Technique notes should support page implementation, not define taxonomy. |
| `design-manual/scripts/lint/*` | **Link** | Keep one canonical linter/build pipeline. |
| `claude-design-manual/claude-design-manual.md` | **Link** | Workflow reference, not public product content. |
| `claude-design-manual/experiments/*` | **Archive external** | Useful evidence but too raw for this repo unless curated into case studies. |
| `custom-skills/design-*` | **Link as executable agent layer** | They should become how Codex/Claude apply the design system, not static website content. |

## Impact On Current Objective

The objective should be understood as two coupled products:

1. **Website:** browse, compare, inspect, interact with, copy, and eventually purchase/download UI assets.
2. **Design system for agents:** structured taxonomy, implementation quality bars, reference captures, tokens, recipes, and skill entrypoints that Codex/Claude Code can use to build better UI.

`ui-dictionary` owns the website and the public knowledge graph. `design-manual` and `custom-skills` remain toolchain dependencies.

## Immediate Next Actions

1. Create a source map page in this repo that links `design-manual`, `custom-skills`, and `claude-design-manual` as external dependencies.
2. Compare this repo's current vocabulary/page data with `design-manual/docs/ui-vocabulary/terms.yml`.
3. Define an `agent asset manifest` format that can point to:
   - reference captures
   - page examples
   - token families
   - cookbook techniques
   - applicable custom skills
4. Use the `design-screen` quality bar when resuming one-page implementation work for Marketing, Application UI, and Ecommerce pages.

## RME3 Completion Check

- `design-manual` was inspected for README, PRD, architecture, design-md families, cookbook index, and UI Vocabulary planning docs.
- `claude-design-manual` was inspected for the manual and roadmap.
- `custom-skills/design-*` entrypoints were inspected.
- Each major source is classified as merge, link, supersede, or archive.
- The result defines how the local design-system history feeds the new `ui-dictionary` objective without creating duplicate sources of truth.
