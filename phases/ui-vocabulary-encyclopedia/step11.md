# Step 11: batch-5-content-media-commerce-patterns

## 읽어야 할 파일

- `docs/plans/2026-06-26-ui-vocabulary-full-component-expansion.md` — 왜: Batch 5와 final audit의 경계를 확인한다.
- `docs/ui-vocabulary/terms.yml` — 왜: content/media/commerce terms를 추가한다.
- `examples/ui-vocabulary-site/src/components/term-visual.tsx` — 왜: visual variants를 구현한다.
- `phases/ui-vocabulary-encyclopedia/step10.md` — 왜: 직전 batch 결과를 이어받는다.

## 작업

Batch 5 content, media, and commerce patterns 20개를 추가한다. 이번 step은 Batch 1~4에서 누락된 content/media/commerce terms를 마무리하고, `component-expansion-plan.md`의 Deferred 항목 중 glossary에 적합한 것만 추가한다.

## Acceptance Criteria

```bash
cd examples/ui-vocabulary-site
npm run build
npm run lint
```

## 검증 절차

1. step 11을 `in_progress`로 바꾼다.
2. 20개 term과 visual variant를 추가한다.
3. build/lint/render smoke를 실행한다.
4. 성공하면 step 11을 `completed`로 갱신한다.

## 금지사항

- 애니메이션 자체나 제스처만으로 정의되는 패턴은 미니 카드에서 설명 가능할 때만 추가한다.

