# FW Step 3 — Insert Palette Recipe Feed

## Outcome

- `apps/agent-design/src/InsertPalette.tsx` now imports `recipeCatalog` from `@askewly/component-registry` (Step 2's build-time generated catalog, 23 entries, `collection: 'recipe'`) and merges it into the palette's registry source: `registryAll = [...catalog, ...recipeCatalog, ...projectEntries]`.
- Added a `'Recipes'` palette category (`Category` type extended: `'Primitives' | 'Components' | 'Layout' | 'Recipes' | 'Project'`) and mapped it in `categoryForCollection`: `collection === 'recipe' → 'Recipes'`. The category renders in its own labeled section (`rail-label`) between `Layout` and `Project`, following the exact same render/group logic already used for `Components`/`Layout` (no new grouping mechanism).
- Search: no changes needed. `searchRegistry` (`packages/component-registry/src/registry.ts`) already matches over `name`, `category`, `collection`, and `keywords` for any `RegistryEntry[]`, so recipe entries are searchable by name (e.g. "bottom tab bar" matches recipe `Bottom Tab Bar`) or by their `term_refs`-derived keywords the same way shadcn/layout entries are.
- Test-id collision fix: `paletteKey()` previously produced `registry-${slug}` for every non-project entry. Recipe slugs can collide with shadcn slugs (both catalogs have a `button` entry — `shadcn/button` and `recipe/button`), which caused duplicate `data-testid="insert-registry-button"` nodes and `getByTestId` "multiple elements" test failures. Fixed by giving the `'recipe'` collection its own key prefix: `paletteKey` now returns `recipe-${slug}` for `collection === 'recipe'`, `component-${slug}` for `'project'` (unchanged), and `registry-${slug}` for everything else (unchanged). Existing shadcn/layout test ids (`insert-registry-button`, `insert-registry-stack`, …) are untouched; recipe entries get `insert-recipe-<slug>` (e.g. `insert-recipe-bottom-tab-bar`).

## Insertion path

- No new insertion code path. `InsertPalette`'s `insert()` function already had three branches: `Primitives` (frame/text/group), `Project` (component instance via `createInstanceNode`), and a fallback for every other registry category (`createRegistryNode(document, entry.entry, parentId, bounds)` → `planInsert`). Recipe entries land in that same fallback branch alongside `Components`/`Layout`, producing an identical node shape: `kind: 'code-component'`, `source: { file: 'registry://<entry.id>', exportName: <PascalCase name>, startLine: 1, endLine: 1 }`. No `collection`-specific branching was needed in `insert()` — the existing generic path already treats every non-Primitive, non-Project registry entry uniformly.
- `packages/component-registry/src/registry.ts` (`createRegistryNode`, `searchRegistry`, `validateCatalog`) was **not** touched — it already operates generically on `RegistryEntry[]` regardless of `collection` value, and `RegistryCollection` already included `'recipe'` from Step 2.

## Contract

Future recipe batches reach the Insert palette by re-running `build:catalog` (`packages/component-registry`) only. `recipe-catalog.generated.ts` regenerates from `recipes/*/*.md` frontmatter; `InsertPalette` reads `recipeCatalog` as an array with no batch-specific code — no palette code changes are required for new batches, only for new *shapes* (e.g. a brand-new `RegistryCollection` value).

## Verification

- Baseline (stated in task): `cd apps/agent-design && npm test -- --run` → 70 passed / 10 files.
- After adding recipe wiring + 3 new tests (`lists recipe catalog entries under a Recipes category`, `finds a recipe entry by search`, `inserts a recipe entry through the same registry insertion path as other catalog entries`) in `InsertPalette.test.tsx`:
  - First run surfaced the slug-collision bug above (4 failing tests, `insert-registry-button` resolved to 2 elements) — fixed via the `paletteKey` prefix change, re-ran clean.
  - Final: `npm test -- --run` → **73 passed / 10 files**, 0 failures. No regressions in any other suite (`AgentPanel`, `ArrangementToolbar`, `LayersPanel`, `liveBridge`, `desktopHost`, `collaboration.e2e`, `CanvasSurface`, `App`, `styles`).
- `npm run build` → `tsc -b && vite build` → exit 0, no type errors, `dist/` emitted.

## Files changed

- `apps/agent-design/src/InsertPalette.tsx`
- `apps/agent-design/src/InsertPalette.test.tsx`

## Out of scope / not touched

- `packages/component-registry/**` — consumed as-is per task constraint.
- `examples/`, `recipes/`, `docs/` — untouched.
- Browser E2E (mobile recipe into mobile-viewport canvas) and `reference-loop.md` procedure update called for in the FW Step 3 plan item were not part of this implementation pass; this changeset covers only the palette-wiring portion of Step 3.

## Next

Browser E2E (Playwright/`browse` skill) inserting a mobile recipe (e.g. `bottom-tab-bar`) into a mobile-viewport canvas, plus the `reference-loop.md` absorption-stage update, remain open before Step 3 / the FW milestone can be marked fully closed.

## 오케스트레이터 게이트 + 실브라우저 E2E (2026-07-12)

- 독립 재실행: agent-design `npm test -- --run` 10 files / 73 tests PASS (baseline 70 + 3, 무회귀), `npm run build` exit 0.
- 실브라우저 E2E (Playwright, dev 서버 @127.0.0.1:5173): Mobile 390×844 preset 적용 → Insert 팔레트 열기 → Recipes 섹션 확인 → 'bottom tab bar' 검색 → `insert-recipe-bottom-tab-bar` 클릭 → 캔버스에 `created-0001` code-component('Bottom Tab Bar', parent=node-00000, 390×80 = 생성 카탈로그의 navigation defaultSize)가 삽입됨을 DOM 측정으로 관측. 스크린샷: `docs/research/assets/fw-step3-recipe-insert-e2e.png`.
