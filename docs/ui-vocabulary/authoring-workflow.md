# UI Vocabulary Authoring Workflow

This workflow is for adding UI terms to the public dictionary without letting
duplicates creep in. It is not a long human review queue. The main idea is:
filter duplicates early, add clean terms locally, verify, then stop at the
deployment decision.

## Principle

```text
choose topic
-> collect around 20 candidates
-> compare against existing terms
-> exclude duplicates
-> add clean terms to terms.yml
-> add/reuse visuals
-> validate/build/lint/smoke
-> ask before deploy
-> deploy only after approval
```

## Files

- `docs/ui-vocabulary/terms.yml`: canonical editable dataset used by the site.
- `docs/ui-vocabulary/inbox.yml`: short-lived buffer for the current collection batch.
- `docs/ui-vocabulary/inbox-review.md`: generated review report, useful for a quick visual/readability pass.
- `docs/ui-vocabulary/sources.md`: allowed source ids and trust rules.
- `docs/ui-vocabulary/schema.md`: canonical field definitions.
- `scripts/audit-ui-vocabulary-candidates.mjs`: schema/source/duplicate-risk audit.
- `scripts/audit-ui-vocabulary-visuals.mjs`: visual fallback/generic renderer audit.
- `scripts/generate-ui-vocabulary-inbox-review.mjs`: readable batch report.
- `scripts/validate-ui-vocabulary.py`: canonical dataset validation after promotion.
- `examples/ui-vocabulary-site/src/components/term-visual.tsx`: visual renderer mappings.
- `docs/ui-vocabulary/visual-quality-workflow.md`: visual quality review loop.
- `docs/ui-vocabulary/deployment.md`: Cloudflare Pages deployment notes.

## 1. Choose One Topic

Pick one narrow theme and collect around 20 candidates. 15-25 is fine if the
theme is coherent.

Good batch themes:

- account activation and access recovery
- mobile commerce checkout states
- dashboard table operations
- onboarding and setup blockers
- editor and canvas controls

Do not mix unrelated categories in one batch. It makes duplicate filtering weak.

## 2. Collect Candidates Into Inbox

Use `docs/ui-vocabulary/inbox.yml` as a temporary staging file. Candidates
should already be plausible new terms, not every raw thing found during research.

Use source tiers from `sources.md`:

- Tier A/B for canonical naming and behavior.
- Tier C/D for discovery and real-world variants.
- Tier E only for aliases and beginner wording.

Each candidate must include:

- stable `id`
- Korean and English names/aliases
- one-line explanation
- when to use / anti-use
- visual anatomy
- asset variant plan
- at least one source id
- collector note when overlap is possible

## 3. Prefilter Duplicates

Run the normal audit first:

```bash
node scripts/audit-ui-vocabulary-candidates.mjs
```

Then run strict duplicate mode:

```bash
node scripts/audit-ui-vocabulary-candidates.mjs --strict-duplicates
```

Strict mode should pass before promotion. If it reports duplicate risk, resolve
the candidate before touching `terms.yml`.

Resolution rules:

- Same concept: do not add a new term. Add useful wording to the existing term's aliases.
- Same base component but different state only: do not add a new term unless the state has a widely recognized name and distinct UI shape.
- Similar but behavior differs: keep the candidate and add `related` comparison notes.
- Weak or unclear distinction: leave it out of this batch.

## 4. Optional Readable Report

Generate a report when you want to inspect the batch quickly:

```bash
node scripts/generate-ui-vocabulary-inbox-review.mjs
```

Open `docs/ui-vocabulary/inbox-review.md`. It shows:

- what each candidate is
- what it should look like
- duplicate-risk matches
- a decision column for quick notes

This report is a helper, not an approval gate.

## 5. Promote Clean Terms

Only candidates that passed duplicate filtering should move from `inbox.yml` to
`terms.yml`.

During promotion:

- Change `status` from `candidate` to `draft` or `reviewed`.
- Keep at least one valid `sources` item.
- Add `related` comparisons when nearby terms may confuse users.
- Keep `prompt_phrases` practical and Korean-first.
- Remove promoted candidates from `inbox.yml`.

If a candidate became only an alias or related note, remove it from `inbox.yml`
after updating the existing term.

## 6. Check Visual Coverage

Every promoted term needs a recognizable visual.

Preferred options:

- Reuse an existing `asset.variant` only when the visual is intentionally the same.
- Add a new variant in `term-visual.tsx` when the shape is distinct.
- Use `asset.props` for state differences instead of creating unnecessary variants.

Do not ship a term that falls back to a generic visual.

Run the visual audit:

```bash
cd examples/ui-vocabulary-site
npm run audit:visuals
```

Use [visual-quality-workflow.md](visual-quality-workflow.md) when the audit reports fallback or generic renderer variants. New promoted terms should not add new fallback variants, and intentional shared variants should be checked manually.

## 7. Verify Locally

Run the full validation path:

```bash
python scripts/validate-ui-vocabulary.py
cd examples/ui-vocabulary-site
npm run build
npm run lint
npm run audit:visuals
```

Expected lint note:

- Existing shadcn `react-refresh/only-export-components` warnings may remain.
- New errors should block promotion.

Smoke test the site before asking for deploy:

- Search for each promoted term.
- Open the detail drawer.
- Check source links, prompt copy, related notes, and mini visual.

## 8. Stop Before Deploy

Deployment is the manual approval point.

After local validation and smoke pass, report:

- promoted term ids
- alias-only changes
- related-only changes
- validation/build/lint/smoke result
- remaining duplicate-risk, if any

Then ask whether to deploy.

## 9. Deploy After Approval

Production target:

```text
https://ui.askewly.com/
```

The production site is connected to the `ui-dictionary` remote through
Cloudflare Pages Git integration.

Approved deploy:

```bash
git push ui-dictionary main
```

Cloudflare builds the site from `examples/ui-vocabulary-site`.

## Changelog

- 2026-06-27: Simplified workflow around early duplicate filtering and final deployment approval.
- 2026-06-28: Added visual quality audit loop for fallback/generic renderer review.
