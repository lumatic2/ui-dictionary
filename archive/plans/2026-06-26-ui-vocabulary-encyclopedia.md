# Plan — UI Vocabulary Encyclopedia

## Scope Boundary

This plan advances the UI Vocabulary Encyclopedia from concept to an implementable MVP. The first run should create the product spec, data contract, initial dataset, and React site foundation. PNG export and cookbook integration stay out of scope until the website can render useful cards.

## Step Tree

- [ ] Step 0 — product spec and phase scaffolding
  - AC: `docs/PRD.md`, `docs/ARCHITECTURE.md`, ADR, and phase files exist.
- [ ] Step 1 — vocabulary dataset foundation
  - AC: `docs/ui-vocabulary/terms.yml` has 60 schema-following terms and a data validation/build script exists.
- [ ] Step 2 — React/shadcn site scaffold
  - AC: `examples/ui-vocabulary-site` builds with Vite, React, Tailwind, shadcn/ui, and generated data.
- [ ] Step 3 — glossary browsing experience
  - AC: search, category filters, term cards, and detail panel work on desktop and mobile.
- [ ] Step 4 — poster-style summary view
  - AC: 6 category blocks render like the seed image using the same term data and visual components.

## Planning Gate

```yaml
planning_gate:
  team_validation_mode: manual-pass
  spec_delta: "Add product PRD, architecture, ADR, data schema/source rules, and product phase steps for the UI Vocabulary Encyclopedia."
  perspectives:
    product: "The site directly solves the naming problem by pairing terms with visible UI components and prompt phrases."
    architecture: "Static YAML-to-React data flow avoids backend complexity while preserving a path to generated posters."
    security: "No auth, backend, or secrets in MVP. Source links and generated data are local files."
    qa: "Validate data generation, Vite build, and browser smoke for desktop/mobile layouts."
    skeptic: "The dataset can become shallow if terms are copied without anatomy and anti-use notes; schema validation should require renderable anatomy."
  dod:
    - "Data build passes."
    - "Vite build passes."
    - "Desktop and mobile browser smoke show non-overlapping cards with visible mini UI components."
```

## Stop Point

Stop after Step 4 unless the user explicitly asks to continue into PNG download/export implementation.
