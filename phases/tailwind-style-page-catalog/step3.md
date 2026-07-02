# Step 3: Catalog row results

## 읽어야 할 파일

- `examples/ui-vocabulary-site/src/App.tsx` — 왜: result grid and page mode rendering are here.
- `examples/ui-vocabulary-site/src/components/term-card.tsx` — 왜: 대체할 카드형 term result component다.
- `examples/ui-vocabulary-site/src/components/term-visual.tsx` — 왜: row thumbnail로 재사용할 visual source다.
- `examples/ui-vocabulary-site/src/lib/search.ts` — 왜: search result reason and filtering behavior must stay stable.

## 작업

Plus/Docs/Index 결과를 모두 같은 카드 그리드로 보여주는 구조를 줄인다.

Target behavior:

- Plus category pages: Tailwind catalog처럼 list/row형 result를 기본으로 한다.
- Index search: dense search results로 유지하되 카드보다 row/list에 가깝게 만든다.
- Term visual은 작은 thumbnail로 남겨 시각 학습 기능을 유지한다.
- `TermCard`는 제거하거나 `TermResultRow`로 대체한다.

## Acceptance Criteria

```powershell
cd examples/ui-vocabulary-site
npm run build
npm run lint
```

Chrome smoke:

- `?page=plus&filter=nav%3Aplus-ui-blocks-marketing`
- `?page=index&q=modal`
- term row 클릭 시 `?page=term&id=...`로 이동.

## 검증 절차

1. Build/lint 실행.
2. Plus category page와 Index search를 Chrome에서 확인한다.
3. 카드 grid가 primary shell로 남지 않았는지 확인한다.
4. step 상태를 갱신한다.

## 금지사항

- 검색 기능을 약화시키지 마라. 이유: Index는 백업 탐색 경로다.
- visual thumbnail을 완전히 제거하지 마라. 이유: 이 제품의 학습 가치가 형태 인식에 있다.
