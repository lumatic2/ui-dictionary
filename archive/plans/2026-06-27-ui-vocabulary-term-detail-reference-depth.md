# UI Vocabulary Term Detail & Reference Depth Plan

Milestone: `ui-vocab-term-detail-reference-depth`

Goal: turn term detail from a definition drawer into a learning surface that
shows source links, related comparisons, anti-use guidance, and copyable AI
prompt phrases.

## Planning Gate

```yaml
planning_gate:
  team_validation_mode: manual-pass
  spec_delta: "ROADMAP active milestone is already defined; this plan expands it into product phase steps."
  perspectives:
    product: "Users need help choosing between similar UI words, not just browsing 328 cards."
    architecture: "Keep YAML as source of truth, generate typed data for React, and keep term-detail UI data-driven."
    security: "No new secrets or external runtime calls. Source URLs are static reference metadata."
    qa: "Validate source ids, build generated data, run lint/build, then Chrome smoke local and deployed site."
    skeptic: "If source metadata is parsed ad hoc from Markdown at runtime, it can become brittle; generate a typed registry instead."
  dod:
    - "python scripts/validate-ui-vocabulary.py"
    - "npm run build"
    - "npm run lint"
    - "Chrome smoke: open a detail sheet, verify source links, related comparison cards, prompt copy, and no console errors."
```

## Scope

In scope:

- Data pipeline support for a typed source registry.
- Detail drawer UI for source links, source notes, related comparisons, anti-use guidance, and prompt phrase copy.
- Focused data enrichment for confusing core pairs.
- Local and deployed verification.

Out of scope for this milestone:

- New large component batches.
- Separate comparison pages.
- Account/favorite/personalization features.
- UX Dictionary or Development Dictionary split.

## Step Tree

- [x] Step 0: Source registry and generated types.
  - AC: source metadata is generated from `docs/ui-vocabulary/sources.md` or an explicit data file, and unknown source ids still fail validation.
- [x] Step 1: Detail reference and prompt copy UI.
  - AC: detail drawer shows real source labels/URLs, source notes, copyable prompt phrases, and clearer "use / avoid" sections.
- [x] Step 2: Confusing term data depth.
  - AC: at least five confusing groups have explicit `related` or relation data: select/combobox/dropdown, modal/dialog/drawer, toast/snackbar/banner, tab/segmented control, checkbox/switch.
- [x] Step 3: Smoke and deployment verification.
  - AC: validation/build/lint pass, Chrome smoke passes locally, push to `ui-dictionary` triggers Cloudflare success, and `ui.askewly.com` still renders 328 cards.

## Implementation Notes

- Keep the public UI quiet and reference-like; no tutorial wall of text.
- Prefer shadcn primitives and existing styling in `term-detail.tsx`.
- Source links should be visible in the detail drawer but excluded from exported visual noise only if they degrade poster output.
- Prompt copy should work without requiring a new dependency.
- Keep all URL/reference metadata static; do not fetch external sites from the browser.

## Evidence Targets

- `docs/ui-vocabulary/sources.md`
- `docs/ui-vocabulary/terms.yml`
- `scripts/build-ui-vocabulary-data.mjs`
- `scripts/validate-ui-vocabulary.py`
- `examples/ui-vocabulary-site/src/components/term-detail.tsx`
- `examples/ui-vocabulary-site/src/lib/term-ux.ts`
- `examples/ui-vocabulary-site/src/data/terms.generated.ts`
- `phases/ui-vocabulary-term-detail-reference-depth/index.json`
