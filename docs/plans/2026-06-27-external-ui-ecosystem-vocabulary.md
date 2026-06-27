# External UI Ecosystem Vocabulary Expansion

## Scope

Use the existing UI Vocabulary authoring workflow to expand beyond official shadcn coverage into adjacent UI component/block ecosystems.

The milestone sequence is:

1. Origin UI / coss ui coverage
2. Shadcn blocks ecosystem coverage
3. Motion / effect UI coverage
4. Aceternity UI coverage

## Shared Workflow

Each batch follows the established gate:

```text
source scan -> collect around 20 candidates -> duplicate prefilter
-> terms.yml promotion -> visual renderer check
-> validate/build/lint/smoke -> deploy gate
```

Candidate count is approximate. Smaller batches are acceptable when the source has fewer non-duplicate concepts.

## Milestone 1: Origin UI / coss ui Coverage

- [ ] Step 0: Source inventory and duplicate map
  - AC: Identify Origin UI/coss ui source sections to cover, map obvious duplicates to existing terms, and record the first batch queue.
- [ ] Step 1: Form, input, and field composition batch
  - AC: Promote non-duplicate form/input candidates with source notes, mini visuals, and duplicate-risk notes.
- [ ] Step 2: Navigation, command, and disclosure batch
  - AC: Promote non-duplicate navigation/menu/disclosure candidates and document related-term boundaries.
- [ ] Step 3: Data display, feedback, and layout batch
  - AC: Promote remaining high-value candidates, run full validation, production deploy smoke, and close the milestone if DoD is met.

## Milestone 2: Shadcn Blocks Ecosystem Coverage

- [ ] Step 0: blocks.so/shadcnblocks/shadcnspace source inventory
  - AC: Separate official shadcn block concepts already covered from adjacent ecosystem-only page/block patterns.
- [ ] Step 1: SaaS/admin/dashboard block batch
  - AC: Promote non-duplicate block/form-pattern candidates with visuals.
- [ ] Step 2: Auth/settings/pricing/marketing block batch
  - AC: Promote remaining page-pattern candidates and close with full validation.

## Milestone 3: Motion / Effect UI Coverage

- [ ] Step 0: Magic UI/Animate UI/SmoothUI source inventory
  - AC: Classify effects into text, loading, background, marquee/beam, and hero interaction groups.
- [ ] Step 1: Text/loading/microinteraction batch
  - AC: Promote effects that describe reusable UI states or interactions.
- [ ] Step 2: Background/hero/marquee batch
  - AC: Promote effects that users can reasonably ask for in vibe-coding prompts; reject purely decorative duplicates.

## Milestone 4: Aceternity UI Coverage

- [ ] Step 0: Aceternity source inventory
  - AC: Split landing/hero/card/grid concepts from generic component duplicates and M3 motion effects.
- [ ] Step 1: Hero/card/grid batch
  - AC: Promote landing UI vocabulary with strong anti-use and related-term notes.
- [ ] Step 2: Interaction/background section batch
  - AC: Promote remaining high-value patterns, run full validation, and close the ecosystem expansion sequence.

## Stop Points

- Stop before each production deploy unless the user explicitly approves deployment.
- Stop if a source requires login, paid access, or unclear licensing.
- Stop if duplicate risk is high and the correct action is alias/related rather than a new term.

## Integrated Verification

At each promoted batch:

```bash
python scripts/validate-ui-vocabulary.py
cd examples/ui-vocabulary-site && npm run build:data && npm run build && npm run lint
cd ../..
node scripts/audit-ui-vocabulary-candidates.mjs --strict-duplicates
```

Then run local Chrome smoke for the new terms and production smoke after approved deploy.
