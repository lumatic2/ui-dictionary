# Step 0: search-quality-contract-and-query-fixture

## 읽어야 할 파일

- `docs/plans/2026-06-26-ui-vocabulary-search-discovery-quality.md` — 왜: 이번 horizon의 product question과 DoD를 따른다.
- `docs/ui-vocabulary/terms.yml` — 왜: aliases, anatomy, prompt phrase coverage를 확인한다.
- `examples/ui-vocabulary-site/src/lib/search.ts` — 왜: 현재 검색 API와 filter matching을 유지해야 한다.
- `examples/ui-vocabulary-site/src/App.tsx` — 왜: 검색창, filter state, result count wiring을 확인한다.

## 작업

검색 품질 계약과 대표 query fixture를 먼저 만든다.

- `docs/ui-vocabulary/search-discovery.md`를 추가한다.
- 검색 사용자 유형: exact-name, purpose-based, appearance-based를 정의한다.
- 대표 query fixture와 expected top ids를 기록한다.
- 현재 `searchTerms()`의 한계와 새 scoring API 형태를 정한다.
- Step 1~4에서 검증할 smoke checklist를 기록한다.

## Acceptance Criteria

```bash
cd examples/ui-vocabulary-site
npm run build
npm run lint
```

## 검증 절차

1. `docs/ui-vocabulary/search-discovery.md`가 user model, query fixture, expected ids, scoring fields를 포함하는지 확인한다.
2. fixture query가 실제 `terms.yml` id와 맞는지 확인한다.
3. `phases/ui-vocabulary-search-discovery/index.json` step 0을 완료 상태로 갱신한다.

## 금지사항

- Step 0에서 UI를 구현하지 않는다. 이유: 검색 품질 기준 없이 자동완성 UI부터 붙이면 품질 회귀를 측정할 수 없다.
- 외부 검색/embedding API를 도입하지 않는다. 이유: 이번 horizon은 정적 사이트 client-side search 품질 개선이다.
