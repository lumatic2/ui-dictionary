# Step 0: Card debt audit and IA contract

## 읽어야 할 파일

- `docs/research/2026-06-30-tailwind-site-structure-analysis.md` — 왜: Tailwind Docs/Plus/UI Blocks/Templates/UI Kit의 분리 기준이 여기 정리되어 있다.
- `docs/plans/2026-07-01-tailwind-style-page-catalog.md` — 왜: 이번 phase의 scope, stop point, 카드 debt audit 기준이다.
- `examples/ui-vocabulary-site/src/App.tsx` — 왜: 현재 Docs/Plus/Index shell과 landing, result grid가 이 파일에 있다.
- `examples/ui-vocabulary-site/src/components/term-card.tsx` — 왜: 남아 있는 대표 카드형 term surface다.
- `examples/ui-vocabulary-site/src/lib/navigation-model.ts` — 왜: Tailwind식 IA와 term navigation path가 여기 연결되어 있다.

## 작업

현재 UI shell에서 카드형 구조를 전수 조사하고, 바꿀 대상과 유지할 대상을 명확히 표시한다.

유지 가능:

- term 자체가 `product-card`, `price-card`처럼 card vocabulary인 경우
- poster/export 전용 printable block
- 미니 visual 내부에서 UI 예시를 카드로 그리는 경우

변경 대상:

- Plus/Docs landing이 카탈로그가 아니라 카드 묶음처럼 보이는 구조
- term 결과가 기본적으로 repeated card grid인 구조
- empty/recovery 상태가 제품 shell 안에서 또 다른 카드처럼 떠 보이는 구조

## Acceptance Criteria

```powershell
rg -n "TermCard|bg-card|Card|grid.*TermCard|data-export-card" examples/ui-vocabulary-site/src
```

## 검증 절차

1. 검색 결과를 `docs/plans/2026-07-01-tailwind-style-page-catalog.md`의 audit 섹션과 대조한다.
2. 변경 대상과 유지 대상을 혼동하지 않는다.
3. `phases/tailwind-style-page-catalog/index.json`에서 step 상태를 갱신한다.

## 금지사항

- vocabulary term인 `*-card`를 삭제하지 마라. 이유: 사용자가 배우는 용어 자체다.
- poster/export 구조를 이 step에서 리팩터링하지 마라. 이유: 이번 phase의 핵심 IA와 별도다.
