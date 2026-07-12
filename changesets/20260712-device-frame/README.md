# Device frame infra — MS Step 1

Target: milestone MS (`docs/plans/2026-07-12-ms-mobile-surface-batch.md`, Step 1).

## Scope

Adds the reusable device-frame component and a minimal integration point that mobile recipe batches (MS Steps 2-3) will render real patterns inside, per the plan's Step 1 line: "디바이스 프레임 컴포넌트(모바일 뷰포트 프레임 렌더)" + "모바일 예시 렌더 경로." No recipes, terms, or canvas changes in this step (both out of scope per plan and per this task's hard rules).

## Contract

- `examples/ui-vocabulary-site/src/components/device-frame.tsx`:
  - `DeviceFrame` — rounded bezel (`rounded-3xl` outer, `rounded-2xl` inner viewport) + a status-bar hint row (label or a pill placeholder) + a 390×844 `mobile` viewport (default) or 768×1024 `tablet` viewport, each with its own `overflow-y-auto` scroll context so the page itself doesn't scroll. Semantic tokens only: `bg-muted`, `bg-background`, `border` (maps to `--border`), `text-muted-foreground`, `text-foreground`, `shadow-xl` — no hex literals, no `color.primitive.*` refs. Verified dark-mode-safe: every color class resolves through `tokens.css` `:root`/`.dark` CSS vars (checked in `examples/ui-vocabulary-site/src/tokens.css`), none hardcoded.
  - `DeviceFramePlaceholderDemo` + `PlaceholderMobileScreen` — a minimal placeholder mobile screen (title + 3 rows) rendered inside `DeviceFrame`, colocated in the same file. This is the discoverable integration point noted in the task: batch workers (Steps 2-3) import `DeviceFrame` from this path and drop their real mobile pattern component in as `children` instead of `PlaceholderMobileScreen`.
  - No `mobile pattern` design invented here — the placeholder is intentionally generic (title + rows), matching the plan's scope boundary ("모바일 수집 2배치" owns real patterns).
- No page/route wiring added. Following this repo's established pattern for every prior recipe batch (`cart-drawer.tsx`, `docs-code-block.tsx`, `api-reference-layout.tsx`, `advanced-filter-builder.tsx`, `bulk-action-toolbar.tsx`, `shipping-method-selector.tsx` — confirmed via repo-wide grep: none of these are imported into `App.tsx`, `home-page.tsx`, or any docs page), component code_asset files are the render/integration point; live site rendering of recipes is explicitly deferred to a later milestone (`docs/design-system/recipe-format.md`: "사이트: 후속 milestone에서 레시피를 페이지로 렌더 (이번 범위 밖)"). The homepage's 12-card Showcase Atlas (`home-page.tsx` `atlasItems`) is a closed, curated set with its own copy contract (`CLAUDE.md`) and was not touched.

## Verification checklist

- [x] `cd examples/ui-vocabulary-site && npm run build` → exit 0. `build:data` regenerated `terms.generated.ts` (550 terms, unchanged), `tsc -b && vite build` clean, no new TypeScript errors.
- [x] `cd examples/ui-vocabulary-site && npm run lint` → exit 0, only the 6 pre-existing shadcn `react-refresh/only-export-components` warnings (`badge.tsx`, `button.tsx`, `tabs.tsx`, `home-page.tsx` ×3) — unchanged set/count, none from the new file.
- [x] Hex-literal check on the new file (`grep -E '#[0-9a-fA-F]{3,8}'` against `device-frame.tsx`) → no matches.

## Result

`device-frame.tsx` created with `DeviceFrame` (mobile 390×844 default / tablet 768×1024 variant, own scroll context, status-bar hint) and a colocated `DeviceFramePlaceholderDemo`/`PlaceholderMobileScreen` integration-point demo. Build and lint both pass with no regressions; no hex literals. No `git commit`/`push` performed.
