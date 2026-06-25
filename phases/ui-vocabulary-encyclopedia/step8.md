# Step 8: batch-2-advanced-data-list-patterns

## 읽어야 할 파일

- `docs/plans/2026-06-26-ui-vocabulary-full-component-expansion.md` — 왜: step tree와 audit DoD를 확인한다.
- `docs/ui-vocabulary/terms.yml` — 왜: Batch 2 data/list terms를 추가한다.
- `examples/ui-vocabulary-site/src/components/term-visual.tsx` — 왜: Batch 2 mini visual을 구현한다.
- `phases/ui-vocabulary-encyclopedia/step7.md` — 왜: 직전 batch 구현 결과를 이어받는다.

## 작업

Batch 2 advanced data/list patterns 20개를 추가한다. 대상 예: `global-header`, `utility-bar`, `command-bar`, `status-bar`, `breadcrumb-header`, `page-title-bar`, `content-tabs`, `right-rail`, `inspector-panel`, `properties-panel`, `preview-pane`, `canvas-toolbar`, `floating-panel`, `dockable-panel`, `collapsible-sidebar`, `mini-sidebar`, `responsive-stack`, `mobile-bottom-sheet`, `page-layout`, `dashboard-grid`.

## Acceptance Criteria

```bash
cd examples/ui-vocabulary-site
npm run build
npm run lint
```

## 검증 절차

1. step 8을 `in_progress`로 바꾼다.
2. 20개 term과 visual variant를 추가한다.
3. build/lint/render smoke를 실행한다.
4. 성공하면 step 8을 `completed`로 갱신한다.

## 금지사항

- full page template을 glossary term으로 과도하게 확장하지 않는다. 작고 이름 붙일 수 있는 UI pattern만 추가한다.

