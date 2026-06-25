# Step 7: batch-1-practical-forms-filters-details

## 읽어야 할 파일

- `docs/plans/2026-06-26-ui-vocabulary-full-component-expansion.md` — 왜: 이번 run의 배치 범위와 DoD가 정의되어 있다.
- `docs/ui-vocabulary/terms.yml` — 왜: Batch 1 용어를 canonical dataset에 추가한다.
- `examples/ui-vocabulary-site/src/components/term-visual.tsx` — 왜: Batch 1 visual variant를 구현한다.
- `phases/ui-vocabulary-encyclopedia/step6.md` — 왜: 남은 기존 후보 구현 방식과 검증 결과를 이어받는다.

## 작업

Batch 1 practical forms, filters, and detail patterns 20개를 추가한다. 대상 예: `empty-table`, `table-density-control`, `column-visibility-menu`, `saved-view-tabs`, `filter-panel`, `advanced-filter-builder`, `query-builder`, `grouped-list`, `nested-list`, `draggable-list`, `reorder-handle`, `selection-summary`, `comparison-table`, `pivot-table`, `tree-table`, `expandable-row`, `detail-row`, `audit-log`, `workspace-switcher`, `account-switcher`.

## Acceptance Criteria

```bash
cd examples/ui-vocabulary-site
npm run build
npm run lint
```

## 검증 절차

1. step 7을 `in_progress`로 바꾼다.
2. 20개 term과 visual variant를 추가한다.
3. build/lint/render smoke를 실행한다.
4. 성공하면 step 7을 `completed`로 갱신한다.

## 금지사항

- 같은 개념을 이름만 바꿔 중복 추가하지 않는다.
- Batch 1에서 category taxonomy를 바꾸지 않는다. 필요성은 step 12에서 판단한다.

