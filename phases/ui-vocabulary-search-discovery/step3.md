# Step 3: discovery-helpers-and-no-result-recovery

## 읽어야 할 파일

- `docs/ui-vocabulary/search-discovery.md` — 왜: no-result recovery와 starter query contract를 따른다.
- `examples/ui-vocabulary-site/src/App.tsx` — 왜: empty state와 category navigation을 확장한다.
- `examples/ui-vocabulary-site/src/lib/search.ts` — 왜: 가까운 후보/카테고리 추천 API를 추가한다.
- `examples/ui-vocabulary-site/src/components/term-detail.tsx` — 왜: related search entrypoints를 둘지 판단한다.

## 작업

검색 실패나 모호한 query에서 사용자를 다시 탐색으로 돌려보낸다.

- no-result state에 starter query, 가까운 후보, category shortcut을 보여준다.
- 검색 결과 상단에 active query/filter summary와 clear controls를 둔다.
- 상세 패널에 같은 category/group의 nearby terms를 제공할지 검토하고, 필요 시 최소 구현한다.
- 대분류/세부 분류와 검색 query가 동시에 걸려 결과가 좁아졌음을 명확히 보여준다.

## Acceptance Criteria

```bash
cd examples/ui-vocabulary-site
npm run build
npm run lint
```

## 검증 절차

1. Chrome smoke: 오타/없는 검색어에서 추천 query와 category shortcut이 보인다.
2. Chrome smoke: filter + query 조합의 active summary가 보인다.
3. Chrome smoke: clear action이 query만 지울지 filter까지 지울지 명확히 동작한다.
4. mobile smoke: empty state controls가 겹치지 않는다.
5. phase index step 3을 완료 상태로 갱신한다.

## 금지사항

- no-result에서 단순히 "검색 결과가 없습니다"로 끝내지 않는다.
- 사용자의 filter를 암묵적으로 지우지 않는다. 지우는 행동은 명시적 control로 둔다.
