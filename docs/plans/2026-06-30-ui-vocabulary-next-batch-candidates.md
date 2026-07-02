# UI Vocabulary Next Batch Candidates

## Scope

Plan the next UI Vocabulary expansion batches after the frontend utility terms.
This is a produce-only harness plan: it selects candidate themes, defines the
duplicate handling rules, and sets acceptance checks before any `terms.yml`
promotion.

The next useful direction is not more base components. The dictionary already
has broad component, block, motion, and frontend utility coverage. The next
batch sequence should fill the vocabulary that users actually use when asking
for visual styling, typography, layout behavior, responsive behavior, and
accessibility implementation details.

## Planning Gate

```yaml
planning_gate:
  team_validation_mode: manual-pass
  spec_skip_reason: "No product contract change yet; this plan only stages future vocabulary batches."
  perspectives:
    product: "Helps vibe-coding users name visual and implementation intent more precisely."
    architecture: "Keep existing category set; use kind to avoid schema/category churn."
    security: "No secret, auth, or external write impact."
    qa: "Each promoted batch must pass duplicate audit, visual audit, build, lint, and Chrome smoke."
    skeptic: "Decorative style terms can become vague; require distinct visual anatomy and anti-use notes."
  dod:
    - "Each batch has 15-25 candidate terms or an explicit smaller target."
    - "High-overlap terms are marked new-term vs alias-only vs related-only before promotion."
    - "No new category is introduced unless current category/kind cannot express the term."
```

## Batch Sequence

### Batch 1: Typography Implementation Vocabulary

Goal: cover text styling and truncation terms that builders frequently request.

Candidate queue:

- `font-weight`
- `font-size`
- `line-height`
- `letter-spacing`
- `text-align`
- `text-transform`
- `text-overflow`
- `truncate`
- `line-clamp`
- `font-smoothing`
- `responsive typography`
- `fluid type scale`
- `monospace label`
- `tabular numbers`
- `leading trim`

Default classification:

- `category: structure`
- `kind: visual-treatment`

Stop rule: if a candidate is only a CSS property with no visible UI decision,
fold it into an alias or related note instead of making a term.

### Batch 2: Spacing and Layout Token Vocabulary

Goal: make spacing, sizing, and layout constraints searchable as UI intent.

Candidate queue:

- `gap`
- `padding`
- `margin`
- `inset`
- `max-width`
- `min-height`
- `aspect-ratio`
- `container query`
- `layout grid`
- `column span`
- `content density`
- `safe area`
- `layout shift`
- `intrinsic size`
- `fluid spacing`

Default classification:

- `category: structure`
- `kind: visual-treatment`

Duplicate watch:

- `container` already exists as a layout component. Use `container query` and
  `max-width` only if the meaning is implementation/layout behavior, not the
  container component itself.

### Batch 3: Accessibility State Vocabulary

Goal: cover implementation terms that affect usable states, keyboard flow, and
assistive technology behavior.

Candidate queue:

- `aria-expanded`
- `aria-selected`
- `aria-invalid`
- `aria-live`
- `aria-busy`
- `sr-only`
- `skip link`
- `tab order`
- `keyboard navigation`
- `focus trap`
- `focus restoration`
- `accessible name`
- `reduced transparency`
- `high contrast mode`
- `hit target`

Default classification:

- `category: feedback` for state/announcement terms
- `category: structure` for navigation/focus-flow terms
- `kind: visual-treatment` only when visible; otherwise `kind: component` may
  be acceptable if the visual renderer can show the behavior clearly.

Stop rule: do not add raw ARIA attributes unless the term has a clear UI effect
and a practical prompt phrase.

### Batch 4: Surface and Material Style Vocabulary

Goal: give style systems like glassmorphism a precise vocabulary without
collapsing them into single CSS properties.

This is the recommended next batch.

Candidate queue:

- `glassmorphism`
- `frosted glass surface`
- `translucent surface`
- `acrylic material`
- `material surface`
- `elevated surface`
- `flat surface`
- `scrim`
- `overlay`
- `tint overlay`
- `hairline border`
- `inner shadow`
- `highlight stroke`
- `noise texture`
- `surface blur`
- `surface tint`
- `depth layer`
- `edge highlight`
- `pressed surface`
- `disabled surface`

Default classification:

- `category: feedback`
- `kind: visual-treatment`

Specific duplicate decisions:

- `glassmorphism`: add as a separate term. It is a visual style package:
  translucent surface, backdrop blur, subtle border, elevation, and background
  contrast.
- `backdrop-blur`: keep as the CSS/visual treatment primitive. Add related
  comparison from `glassmorphism` to `backdrop-blur`.
- `frosted glass surface`: likely alias or related note under
  `glassmorphism`, unless the batch needs a distinct material surface term.
- `surface blur`: likely alias or related note under `backdrop-blur`.
- `overlay`: add only if distinct from existing `modal backdrop` semantics.
- `scrim`: add as a separate term if it explains the dimming layer behind a
  dialog, drawer, or sheet.
- `hairline border`, `inner shadow`, `highlight stroke`, `noise texture`: add
  only if mini visuals make them visually distinct and practical.

Expected related links:

- `glassmorphism` -> `backdrop-blur`, `opacity`, `shadow-elevation`,
  `color-contrast`, `border-radius`
- `scrim` -> `modal`, `drawer`, `popover`
- `overlay` -> `scrim`, `modal`, `dialog`
- `hairline border` -> `border radius`, `color contrast`

### Batch 5: Responsive and Viewport Vocabulary

Goal: cover words users use when asking for mobile/desktop adaptation.

Candidate queue:

- `mobile-first`
- `desktop-first`
- `adaptive layout`
- `fluid layout`
- `responsive grid`
- `viewport height`
- `dynamic viewport unit`
- `safe-area inset`
- `sticky header`
- `fixed positioning`
- `scroll container`
- `overscroll`
- `scroll snap`
- `responsive stack`
- `density breakpoint`

Default classification:

- `category: structure`
- `kind: visual-treatment`

Duplicate watch:

- `breakpoint`, `responsive-layout`, and `sticky-position` already exist. New
  terms must either become aliases/related notes or cover a distinct behavior.

### Batch 6: Microinteraction Vocabulary

Goal: name subtle interaction feedback patterns that are not full motion-effect
showpieces.

Candidate queue:

- `tap feedback`
- `pressed state`
- `hover reveal`
- `loading affordance`
- `optimistic update`
- `pending state`
- `success feedback`
- `error recovery action`
- `skeleton transition`
- `staggered animation`
- `spring animation`
- `gesture hint`
- `drag handle affordance`
- `drop feedback`
- `undo affordance`

Default classification:

- `category: feedback`
- `kind: motion-pattern` or `visual-effect`

Duplicate watch:

- `hover-state`, `active-state`, `drag-state`, `drop-target`, `loading-state`,
  and `undo-toast` already exist. Prefer alias/related updates unless the new
  term describes a broader interaction pattern.

### Batch 7: Visual Styling Primitive Vocabulary

Goal: fill the gap between CSS primitives and design-language prompts.

Candidate queue:

- `border width`
- `border style`
- `outline`
- `ring`
- `box shadow`
- `drop shadow`
- `blur`
- `filter`
- `blend mode`
- `mask`
- `clip path`
- `object fit`
- `background image`
- `background pattern`
- `color token`
- `semantic color`
- `state color`
- `alpha color`
- `contrast pair`
- `theme token`

Default classification:

- `category: feedback` for visual states and color treatments
- `category: structure` for clipping, masking, and object fitting
- `kind: visual-treatment`

Duplicate watch:

- Existing `shadow-elevation`, `focus-ring`, `clipping-mask`,
  `grid-pattern-background`, `dot-pattern-background`, and `gradient-fill`
  overlap heavily. Treat this batch as a later cleanup/alias pass unless clear
  gaps remain after Batch 4.

## Recommended Execution Order

1. Batch 4: Surface and Material Style Vocabulary
2. Batch 1: Typography Implementation Vocabulary
3. Batch 2: Spacing and Layout Token Vocabulary
4. Batch 3: Accessibility State Vocabulary
5. Batch 5: Responsive and Viewport Vocabulary
6. Batch 6: Microinteraction Vocabulary
7. Batch 7: Visual Styling Primitive Vocabulary

Reason: Batch 4 has the clearest user-facing naming gap now that
`backdrop-blur`, `opacity`, `shadow-elevation`, and related primitives already
exist. It can also establish the rule for when a style package deserves its own
term instead of becoming an alias.

## Step Tree For Recommended Next Batch

- [ ] Step 0: Surface/material duplicate map
  - Verify: `rg -n "glass|blur|overlay|scrim|surface|shadow|border|noise" docs/ui-vocabulary/terms.yml`
  - Output: candidate table marking new-term, alias-only, related-only, reject.
- [ ] Step 1: Promote high-confidence material terms
  - Verify: `node scripts/audit-ui-vocabulary-candidates.mjs --strict-duplicates`
  - Target terms: `glassmorphism`, `scrim`, `translucent surface`,
    `hairline border`, `inner shadow`, `noise texture`, `highlight stroke`.
- [ ] Step 2: Add or reuse mini visuals
  - Verify: `cd examples/ui-vocabulary-site && npm run audit:visuals`
  - Rule: no new promoted term may fall back to a generic renderer.
- [ ] Step 3: Full local validation and Chrome smoke
  - Verify: `python scripts/validate-ui-vocabulary.py`
  - Verify: `cd examples/ui-vocabulary-site && npm run build && npm run lint`
  - Smoke: search each promoted term, open detail drawer, check related/source
    notes and visual clarity.

## Stop Points

- Stop before deployment.
- Stop if `glassmorphism` strict duplicate audit says it should only be an
  alias of `backdrop-blur`.
- Stop if fewer than five surface/material terms have distinct visual anatomy.
- Stop if a term relies on trend naming without a stable, source-backed meaning.

## Integrated Verification

After any promoted batch:

```bash
node scripts/build-ui-vocabulary-data.mjs
python scripts/validate-ui-vocabulary.py
node scripts/audit-ui-vocabulary-candidates.mjs --strict-duplicates
cd examples/ui-vocabulary-site
npm run build
npm run lint
npm run audit:visuals
```

Then run local Chrome smoke on the promoted terms and ask for deploy approval
before pushing.

## Execution Note: Surface and Material Batch

2026-06-30 local run promoted 6 new terms:

- `glassmorphism`
- `translucent-surface`
- `hairline-border`
- `inner-shadow`
- `noise-texture`
- `highlight-stroke`

`scrim` was not promoted because it already exists in `terms.yml` as a
structure term with a dedicated `scrim` visual. The candidate was removed from
the inbox rather than duplicated.

Validation result:

- `node scripts/build-ui-vocabulary-data.mjs` passed with 497 terms.
- `python scripts/validate-ui-vocabulary.py` passed.
- `node scripts/audit-ui-vocabulary-candidates.mjs --strict-duplicates` passed with an empty inbox.
- `npm run build`, `npm run lint`, and `npm run audit:visuals` passed from `examples/ui-vocabulary-site`.
- Chrome smoke passed on `http://127.0.0.1:5174/?q=highlight+stroke`; `glassmorphism` detail showed prompt, related terms, MDN source, Material source, and no console errors.

## Execution Note: Remaining Batch Pass

2026-06-30 continuation promoted 30 additional terms across the remaining six
batches:

- Typography: `font-weight`, `line-height`, `letter-spacing`, `text-overflow`, `line-clamp`
- Spacing/layout: `gap`, `padding`, `aspect-ratio`, `container-query`, `layout-shift`
- Accessibility: `aria-expanded`, `aria-invalid`, `aria-live`, `sr-only`, `focus-trap`
- Responsive/viewport: `mobile-first`, `fluid-layout`, `dynamic-viewport-unit`, `safe-area-inset`, `scroll-snap`
- Microinteraction: `tap-feedback`, `optimistic-update`, `pending-state`, `hover-reveal`, `gesture-hint`
- Visual primitives: `outline`, `blend-mode`, `object-fit`, `semantic-color`, `theme-token`

Validation result:

- `node scripts/build-ui-vocabulary-data.mjs` passed with 527 terms.
- `python scripts/validate-ui-vocabulary.py` passed.
- `node scripts/audit-ui-vocabulary-candidates.mjs --strict-duplicates` passed with an empty inbox.
- `npm run build`, `npm run lint`, and `npm run audit:visuals` passed from `examples/ui-vocabulary-site`.
- Chrome smoke passed on representative terms from every batch: `font-weight`, `container-query`, `aria-live`, `mobile-first`, `optimistic-update`, `theme-token`; `theme-token` detail showed prompt, related term, source, and no console errors.

Known non-blocking notes:

- Visual audit still lists six older one-word fallback variants (`opacity`, `transition`, `duration`, `easing`, `overflow`, `breakpoint`). No new promoted term is in fallback.
- Lint still reports the existing shadcn fast-refresh warnings in `button.tsx`, `badge.tsx`, and `tabs.tsx`.
