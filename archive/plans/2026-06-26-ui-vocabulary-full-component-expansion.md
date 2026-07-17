# UI Vocabulary Full Component Expansion

planning_gate:
  team_validation_mode: manual-pass
  spec_skip_reason: "Existing PRD/ARCHITECTURE already define the UI Vocabulary Encyclopedia, YAML source data, React/Tailwind/shadcn implementation, and interactive mini-mock strategy. This run expands the same contract rather than changing product identity."
  perspectives:
    product: "More terms reduce the user's naming gap, especially for advanced product UI patterns."
    architecture: "Keep `terms.yml` as source of truth and `term-visual.tsx` as renderer; generated TS stays derived."
    security: "No secrets, auth, network writes, or external credentials are involved."
    qa: "Each batch must pass data generation, `npm run build`, `npm run lint`, render smoke, and duplicate/category audit at the end."
    skeptic: "The risk is glossary bloat and duplicate concepts; final audit must merge or mark overlaps and decide whether categories need expansion."
  dod:
    - "All planned batches are represented in `docs/ui-vocabulary/terms.yml` with matching visual variants."
    - "`examples/ui-vocabulary-site/src/data/terms.generated.ts` is regenerated."
    - "`npm run build` and `npm run lint` pass in `examples/ui-vocabulary-site`."
    - "Final audit reports duplicate candidates, category distribution, and any category taxonomy change."

## Scope

Target: expand from 126 terms through the remaining existing candidates plus five implementation batches, with interactive mini visuals for every added term.

Stop conditions:
- TypeScript build fails after 3 correction attempts for a batch.
- A new category is needed before terms can be honestly classified.
- The visual renderer becomes too large to maintain without splitting components.

## Step Tree

- [ ] Step 6 — Remaining planned candidates
  - AC: add the remaining existing candidates from `component-expansion-plan.md`; build/lint/render pass.
- [ ] Step 7 — Batch 1 practical forms, filters, and detail patterns
  - AC: add 20 high-frequency form/data/detail terms; build/lint/render pass.
- [ ] Step 8 — Batch 2 advanced data and list patterns
  - AC: add 20 data-heavy terms; build/lint/render pass.
- [ ] Step 9 — Batch 3 app and dashboard layout patterns
  - AC: add 20 app-shell/dashboard layout terms; build/lint/render pass.
- [ ] Step 10 — Batch 4 feedback, permission, and system-state patterns
  - AC: add 20 feedback/system-state terms; build/lint/render pass.
- [ ] Step 11 — Batch 5 content, media, and commerce patterns
  - AC: add 20 content/media/commerce terms; build/lint/render pass.
- [ ] Step 12 — Duplicate/category audit and taxonomy adjustment
  - AC: run audit script/report, document duplicate candidates and category distribution, expand categories only if justified.

