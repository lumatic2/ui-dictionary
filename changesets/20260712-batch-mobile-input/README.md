
# Batch mobile-input — MS Step 3 (second mobile proof batch)

Target: milestone MS (`docs/plans/2026-07-12-ms-mobile-surface-batch.md`, Step 3), procedure `docs/research/reference-loop.md`.

## Scope

Second of two mobile-surface RL batches (collect → dedup → adapt → verify → absorb) on a `mobile-apps` surface, `input`/feedback-leaning theme (action sheet destructive confirmation, swipe action row, FAB menu variants, mobile form field stack, snackbar with action, mobile date/time picker sheet, touch quantity stepper, long-press vs pull-down menu, onboarding permission prompt sequencing). 10 candidates were collected upstream; this changeset covers stages 1 (staged into canonical `docs/research/loop/inbox.yml` with orchestrator adjudications and one id rename folded in), 2 (pre-adapt dedup audit), 3 (adapt: 2 recipes + 1 term + 4 aliases + 3 related-only updates), 4 (full verification chain), and 5 (ledger row + inbox cleared).

## Contract

- 2 candidates promoted as **recipes**, both rendered inside the `DeviceFrame` component via a colocated demo:
  - `action-sheet-destructive-confirmation` (`recipes/overlays/action-sheet-destructive-confirmation.md`) — an `action-sheet` variant that visually separates a destructive action (text-color only) from neutral rows and separates Cancel into its own gapped card. `term_refs: [action-sheet]`. `code_asset`: `examples/ui-vocabulary-site/src/components/action-sheet-destructive-confirmation.tsx`.
  - `swipe-action-row-pattern` (`recipes/data-display/swipe-action-row-pattern.md`) — candidate id renamed from `swipe-action-row-recipe` at staging time per fixed adjudication (the raw id collided too closely with the existing `swipe-action-row` term). One row component implementing both leading (non-destructive, accent tone) and trailing (destructive tone) reveal directions, with tap-only reveal icons as a non-swipe alternative for both sides. `term_refs: [swipe-action-row, swipe-to-delete, swipe-action]`. `code_asset`: `examples/ui-vocabulary-site/src/components/swipe-action-row-pattern.tsx`.
  - Both recipes use semantic tokens only (`color.semantic.*`, `dimension.*` where applicable), no hex literals, no primitive token refs — confirmed by `validate-recipes.py`.
- `mobile-form-field-stack` promoted as a new **term** (`docs/ui-vocabulary/terms.yml`, `input` category, `input-text` group) per fixed adjudication confirming a gap vs the existing `field-group` term: `field-group` is a general-purpose (mostly desktop/web) label-input-helper unit, while `mobile-form-field-stack` adds the mobile-specific 48x48 minimum touch-target constraint and next-field keyboard-action flow. Added a symmetric `related` (`compare`) entry between the two.
- 4 candidates resolved as **alias-only** additions (no new term):
  - `fab-menu-expressive` → alias on `speed-dial` (EN "FAB menu" / "Expanding action menu", KO "FAB 메뉴" / "확장 액션 메뉴") — `speed-dial`'s existing description already describes exactly this toggle-FAB-expands-multiple-labeled-actions concept.
  - `extended-fab` → alias on `floating-action-button` (EN "Extended FAB", KO "라벨 FAB"); extended the term's `description`/`visual_anatomy` to cover the icon+label pill variant and collapse-to-icon-on-scroll behavior. A distinct KO alias wording was needed because `speed-dial` already carries the KO alias "확장 FAB" — reusing it on `floating-action-button` would have created a cross-term alias collision.
  - `snackbar-with-action` → alias on `mobile-snackbar` (EN "Snackbar with action", KO "액션 스낵바") — chosen over the more generic `snackbar`/`toast` terms since `mobile-snackbar` already combines mobile placement + a single action + undo, the closest existing match.
  - `quantity-stepper-touch` → alias on `quantity-stepper` (EN "Touch quantity stepper", KO "터치 수량 스테퍼").
- 3 candidates resolved as **related-only** additions (no new term, no alias):
  - `mobile-date-time-picker-sheet` → symmetric `related` (`compare`) between `mobile-date-picker` and `time-picker`, noting the combined date+time bottom-sheet gap: no dedicated term yet exists for sequencing both pickers inside one sheet.
  - `long-press-vs-pulldown-menu` → symmetric `related` (`compare`) between `context-menu` and `long-press-menu`, capturing the touch-discoverability distinction (long-press = accidental/touch-hold discovery; context-menu, which also covers the pull-down-from-toolbar-button trigger, = explicit discovery). No separate pull-down term exists, so the pull-down half of the comparison folds into `context-menu`.
  - `onboarding-permission-prompt-sequence` → symmetric `related` (`use-with`) between `permission-prompt` and `permission-education-screen`, capturing the soft-ask-screen-then-system-prompt sequencing per feature, rather than batching all permission requests upfront.
- `docs/research/loop/inbox.yml` restored to the empty template after promotion; `docs/research/loop/ledger.md` gained the `20260712-mobile-input` batch row.

## Verification checklist

- [x] `node scripts/audit-recipe-candidates.mjs` pre-adapt (run once against the staged `docs/research/loop/inbox.yml`, adjudications and the `swipe-action-row-pattern` id rename folded in at staging, before any Adapt edits) → exit 0, 10 candidates checked, 15 non-fatal near-match/substring/token-similarity duplicate-risk warnings — every candidate's stated `dedup_hints` neighbor triggers one, none fatal.
- [x] `python scripts/validate-recipes.py` → exit 0, `recipes ok: 23`.
- [x] `python scripts/validate-ui-vocabulary.py` → exit 0, `terms ok: 552`, `groups ok: 57 (57 in use)`.
- [x] `node scripts/generate-llms-txt.mjs` → exit 0; both new recipes appear under the generated `## Recipes` section (auto-discovered via `recipes/**/*.md` glob), confirmed present in `examples/ui-vocabulary-site/public/llms.txt`.
- [x] `cd examples/ui-vocabulary-site && npm run build` → exit 0, `terms.generated.ts` regenerated (552 terms), `tsc -b && vite build` clean, no new TypeScript errors from the 2 new components.
- [x] `cd examples/ui-vocabulary-site && npm run lint` → exit 0, only the pre-existing shadcn `react-refresh/only-export-components` warnings (6, unchanged set/count from before this batch: `button.tsx`, `tabs.tsx`, `badge.tsx`, `home-page.tsx` ×3).
- [x] CLI data: `cd packages/cli && npm run build:data` → exit 0, `data bundled: terms=552 recipes=23`; confirmed `action-sheet-destructive-confirmation`/`swipe-action-row-pattern` present in `packages/cli/data/recipes.json` and `mobile-form-field-stack` present in `packages/cli/data/terms.json`.

## Amendments

No new procedural amendments surfaced this batch. The prior batches' amendments held and were followed without incident:

1. `generate-llms-txt.mjs`'s `## Recipes` section auto-discovers `recipes/**/*.md` via glob — no `FIXED_ASSETS` edit needed or possible for recipes.
2. Pre-adapt dedup was captured once, before starting any Adapt edits.
3. No embedded double-quote marks were used inside unquoted YAML flow-sequence scalars in any new alias/related list.

One task-specific note for future mobile-surface collectors: while adding the `extended-fab` alias to `floating-action-button`, the natural KO wording "확장 FAB" was already an existing alias on the neighboring `speed-dial` term (pre-dating this batch, unrelated to this batch's own `fab-menu-expressive` → `speed-dial` alias addition). Reusing that wording on a second term would have created a cross-term alias collision invisible to `audit-recipe-candidates.mjs` (which checks candidates against existing terms, not existing terms' aliases against each other). A distinct KO alias ("라벨 FAB") was used instead. When a batch touches multiple terms in the same family (here: FAB variants split across `floating-action-button` and `speed-dial`), check sibling terms' existing alias lists — not just the target term's own list — before picking alias wording.

## Result

All Stage 4 verification commands passed with the results listed above. Promoted: 2 recipes (`action-sheet-destructive-confirmation`, `swipe-action-row-pattern`), 1 new term (`mobile-form-field-stack`, `related` compare ↔ `field-group`). Duplicates filtered (no new artifact): 7 out of 10 collected — `fab-menu-expressive` (alias on `speed-dial`), `extended-fab` (alias on `floating-action-button`), `snackbar-with-action` (alias on `mobile-snackbar`), `quantity-stepper-touch` (alias on `quantity-stepper`), `mobile-date-time-picker-sheet` (related-only between `mobile-date-picker`/`time-picker`), `long-press-vs-pulldown-menu` (related-only between `context-menu`/`long-press-menu`), `onboarding-permission-prompt-sequence` (related-only between `permission-prompt`/`permission-education-screen`). `docs/research/loop/inbox.yml` cleared back to the empty template; `docs/research/loop/ledger.md` gained the `20260712-mobile-input` row. No `git commit`/`push` performed.
