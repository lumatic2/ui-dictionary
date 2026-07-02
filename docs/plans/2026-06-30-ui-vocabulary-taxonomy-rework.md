# UI Vocabulary Taxonomy Rework Plan

Date: 2026-06-30
Mode: harness product planning
Scope: sidebar information architecture and term category cleanup

## Context

The current navigation uses three axes:

- `kind`: component, block, form-pattern, visual-effect, motion-pattern, visual-treatment
- `category`: input, selection, action, structure, feedback, data-display
- `categoryGroups`: sidebar subgroups under category

The recent term expansion added implementation, styling, accessibility, motion, and material-style vocabulary. The old six categories now force unrelated concepts into `structure` and `feedback`, producing confusing paths such as:

- `비주얼 처리 > 구조·레이아웃 > 레이아웃 렌더링`
- `비주얼 처리 > 상태·표현 > 비주얼 스타일`
- `컴포넌트 > 구조·레이아웃 > 접근성·렌더링`
- `컴포넌트 > 상태·표현 > 접근성·동기화 상태`

## Planning Gate

```yaml
planning_gate:
  team_validation_mode: manual-pass
  spec_delta: "Expand the UI Vocabulary category taxonomy beyond the original six categories and realign sidebar category groups so implementation/style/accessibility terms have first-class homes."
  perspectives:
    product: "Users should find terms by the mental model they have: input, navigation, action, structure, content, state, style, layout, accessibility."
    architecture: "Changing top-level categories touches generated TermCategory, search filters, sidebar labels, icons, validator expectations, term data, and visual/search smoke tests."
    security: "No auth, secrets, or external write surface. Risk is data/schema drift and broken generated types."
    qa: "Validate YAML, generated data, strict duplicate audit, visual audit, lint/build, group integrity script, and Chrome sidebar smoke."
    skeptic: "Too many top-level categories could make navigation noisier. Preserve kind as object-form axis and category as user intent/domain axis."
  dod:
    - "All terms belong to exactly one category and exactly one sidebar group."
    - "No categoryGroup contains terms whose term.category differs from the group.category."
    - "No unknown or duplicate group IDs."
    - "Chrome smoke confirms representative new paths are visible from sidebar and URL filters."
```

## Proposed Top-Level Categories

Replace the current six with nine:

- `input` -> `입력`
- `selection` -> `선택·탐색`
- `action` -> `행동`
- `structure` -> `구조`
- `data-display` -> `데이터·콘텐츠`
- `feedback` -> `상태·피드백`
- `style` -> `스타일·재질`
- `layout-rendering` -> `레이아웃·렌더링`
- `accessibility` -> `접근성`

Rationale:

- `style` absorbs glassmorphism, blur, shadow, border, color, texture, typography treatment, and material/surface terms.
- `layout-rendering` absorbs gap, padding, aspect ratio, container query, viewport, overflow, z-index, stacking, object-fit, scroll snap, responsive layout.
- `accessibility` absorbs aria, sr-only, focus-trap, reduced motion, color contrast, screen-reader and focus semantics.
- `structure` becomes actual screen/page/component structure only, not every implementation detail.
- `feedback` becomes status, alerts, loading, empty/error, permission, notifications, and progress.

## Step Tree

- [ ] Step 1: Freeze taxonomy contract
  - Edit: `examples/ui-vocabulary-site/src/lib/search.ts`, validator/schema docs as needed
  - Work: define nine category labels, ids, icon mapping requirements, and migration rules
  - Verify: TypeScript compile reaches category label/icon exhaustiveness
  - Stop if: user rejects adding 3 new top-level categories

- [ ] Step 2: Reclassify style/layout/accessibility terms
  - Edit: `docs/ui-vocabulary/terms.yml`
  - Work: move terms from `structure`/`feedback` into `style`, `layout-rendering`, `accessibility`
  - Verify: Python integrity script prints category counts and no invalid category values
  - Stop if: any term has ambiguous category where product decision is needed

- [ ] Step 3: Rebuild sidebar groups without cross-category leakage
  - Edit: `examples/ui-vocabulary-site/src/lib/search.ts`
  - Work: rebuild `categoryGroups` so each group contains only terms from its own category
  - Verify: `ungrouped=0`, `unknown=0`, `duplicate_group_ids=0`, `category_mismatches=0`
  - Stop if: a group becomes too large and needs a new user-facing label decision

- [ ] Step 4: Align UI labels, icons, search, and generated data
  - Edit: `examples/ui-vocabulary-site/src/App.tsx`, generated data
  - Work: add icons for new categories, ensure sidebar nesting works for all kinds, regenerate `terms.generated.ts`
  - Verify: `node scripts/build-ui-vocabulary-data.mjs`, `python scripts/validate-ui-vocabulary.py`

- [ ] Step 5: Full local QA and Chrome smoke
  - Run: `node scripts/audit-ui-vocabulary-candidates.mjs --strict-duplicates`
  - Run: `cd examples/ui-vocabulary-site && npm run audit:visuals && npm run lint && npm run build`
  - Run: Chrome smoke on representative paths:
    - `스타일·재질 > 표면·재질`
    - `레이아웃·렌더링 > 반응형·뷰포트`
    - `접근성 > ARIA·스크린리더`
    - `구조 > 앱·페이지 구조`
  - Stop before: deploy or git push

## Initial Classification Rules

- If the term is an actual UI object users can point to on screen, keep it in `input`, `selection`, `action`, `structure`, `data-display`, or `feedback`.
- If the term describes visual treatment, surface, color, texture, shadow, border, typography appearance, or material language, use `style`.
- If the term describes sizing, positioning, overflow, stacking, viewport, responsive behavior, or CSS layout mechanics, use `layout-rendering`.
- If the term exists primarily to support assistive technology, focus management, reduced motion, screen-reader text, or ARIA semantics, use `accessibility`.
- `kind` remains the object-form axis. Do not use category to duplicate `component`/`block`/`visual-treatment`.

## Known Cleanup Targets

- Move from `feedback-visual-style` into `style`: `glassmorphism`, `translucent-surface`, `backdrop-blur`, `shadow-elevation`, `border-radius`, `gradient-fill`, `inner-shadow`, `noise-texture`, `highlight-stroke`, `blend-mode`, `semantic-color`, related effect terms.
- Split current `structure-layout-rendering`:
  - `layout-rendering`: `gap`, `padding`, `aspect-ratio`, `container-query`, `layout-shift`, `mobile-first`, `fluid-layout`, `dynamic-viewport-unit`, `safe-area-inset`, `overflow`, `z-index`, `stacking-context`, `object-fit`, `scroll-snap`.
  - `style`: `font-weight`, `line-height`, `letter-spacing`, `text-overflow`, `line-clamp`, pattern backgrounds if kept as style.
- Move accessibility terms:
  - `accessibility`: `aria-expanded`, `aria-invalid`, `aria-live`, `sr-only`, `focus-trap`, `reduced-motion`, `color-contrast`.
- Fix obvious temporary placements:
  - `testimonial-section` out of `커머스·청구`.
  - `orbiting-icons`, `number-ticker`, `infinite-moving-cards` out of `커머스·청구`.
  - Remove category-group mismatches such as `status-bar`, `navigation-drawer`, `empty-table`, `thumbnail`, `icon`, `tooltip` by either moving term category or moving group.

## Stop Points

Stop before implementation if:

- The user does not want new top-level categories.
- The user prefers fewer than nine categories.
- The user wants `style`, `layout-rendering`, or `accessibility` to remain as `kind`/group only, not category.

Stop during implementation if:

- Validator/schema has hard-coded six-category assumptions beyond easy local update.
- A term's category and group cannot be made consistent without changing its meaning.
- Chrome sidebar exposes too many top-level buttons and needs a UI layout decision.

Stop after local QA:

- Do not deploy or push without explicit user approval.
