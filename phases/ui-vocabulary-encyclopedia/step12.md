# Step 12: duplicate-category-audit

## 읽어야 할 파일

- `docs/ui-vocabulary/terms.yml` — 왜: 전체 dataset의 id, 이름, aliases, category를 감사한다.
- `docs/ui-vocabulary/schema.md` — 왜: required fields와 category contract를 확인한다.
- `docs/ui-vocabulary/component-expansion-plan.md` — 왜: 승격된 batch와 남은 후보를 정리한다.
- `examples/ui-vocabulary-site/src/lib/search.ts` — 왜: category label 확장 여부를 반영해야 한다.
- `examples/ui-vocabulary-site/src/data/terms.generated.ts` — 왜: generated count와 category union을 확인한다.

## 작업

모든 batch 구현 후 중복 후보, category 분포, 모호한 분류, category 확장 필요성을 감사한다. 필요하면 `docs/ui-vocabulary/category-audit-2026-06-26.md`를 작성하고, category가 실제로 필요하다고 판단될 때만 `terms.yml`, `search.ts`, schema 문서를 갱신한다.

## Acceptance Criteria

```bash
cd examples/ui-vocabulary-site
npm run build
npm run lint
```

## 검증 절차

1. step 12를 `in_progress`로 바꾼다.
2. duplicate/category audit를 수행하고 결과 문서를 남긴다.
3. 필요 시 category taxonomy를 조정한다.
4. build/lint/render smoke를 실행한다.
5. 성공하면 step 12를 `completed`로 갱신하고 phase summary를 갱신한다.

## 금지사항

- 단순 수량 균형을 위해 category를 바꾸지 않는다. 사용자가 찾는 mental model 기준으로만 조정한다.
- 중복을 발견해도 데이터 삭제는 조심한다. 먼저 related/alias/anti-use로 해소 가능한지 판단한다.

