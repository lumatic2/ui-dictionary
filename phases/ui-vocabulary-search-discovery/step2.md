# Step 2: ranked-search-and-match-reasons

## 읽어야 할 파일

- `docs/ui-vocabulary/search-discovery.md` — 왜: scoring field와 representative fixture를 따른다.
- `examples/ui-vocabulary-site/src/lib/search.ts` — 왜: existing public search API를 scoring 기반으로 바꾼다.
- `examples/ui-vocabulary-site/src/components/term-card.tsx` — 왜: match reason 표시 위치를 결정한다.
- `examples/ui-vocabulary-site/src/App.tsx` — 왜: filteredTerms consumer를 search result metadata에 맞게 조정한다.

## 작업

`includes()` 검색을 weighted ranking으로 교체한다.

- exact name/id match, prefix match, alias match, category/group match, one_liner, prompt phrase, visual anatomy에 가중치를 준다.
- search result는 term + score + match reasons를 반환한다.
- 카드나 결과 상단에 `alias 일치`, `생김새 단서`, `AI 요청 문장` 같은 reason label을 보여준다.
- query가 없을 때의 기본 ordering은 기존 term order를 유지한다.

## Acceptance Criteria

```bash
cd examples/ui-vocabulary-site
npm run build
npm run lint
```

## 검증 절차

1. 대표 query fixture의 top results가 기대 id와 맞는지 확인한다.
2. `토글`, `켜고 끄는`, `옆에서 나오는 창`, `표 필터`, `빈 화면` query를 smoke한다.
3. 이유 label이 결과 카드에 표시되는지 확인한다.
4. query가 비었을 때 기존 카테고리/filter 결과 순서가 깨지지 않는지 확인한다.
5. phase index step 2를 완료 상태로 갱신한다.

## 금지사항

- 불투명한 random/fuzzy 라이브러리로 결과를 섞지 않는다. 이유: 검색 품질 QA가 deterministic해야 한다.
- score를 UI에 숫자로 노출하지 않는다. 이유: 사용자에게 필요한 것은 점수가 아니라 왜 찾혔는지다.
