# Step 1: autocomplete-and-suggestion-panel

## 읽어야 할 파일

- `docs/ui-vocabulary/search-discovery.md` — 왜: suggestion 후보와 keyboard contract를 따른다.
- `examples/ui-vocabulary-site/src/App.tsx` — 왜: 현재 search input 위치와 header layout을 확장한다.
- `examples/ui-vocabulary-site/src/components/ui/*` — 왜: shadcn component pattern을 재사용한다.
- `examples/ui-vocabulary-site/src/lib/search.ts` — 왜: suggestion API를 어디에 붙일지 판단한다.

## 작업

검색창에 자동완성/추천 패널을 추가한다.

- term name, English name, aliases, category/group label 기반 suggestion을 만든다.
- query가 비어 있을 때는 starter query와 주요 category shortcut을 보여준다.
- keyboard: ArrowUp/ArrowDown, Enter, Escape 동작을 지원한다.
- mouse/touch 선택 시 query/filter가 즉시 반영된다.
- mobile header에서 패널이 화면 밖으로 나가지 않게 한다.

## Acceptance Criteria

```bash
cd examples/ui-vocabulary-site
npm run build
npm run lint
```

## 검증 절차

1. Chrome smoke: `토` 입력 시 `토글`/`switch` 계열 suggestion이 보인다.
2. Chrome smoke: `옆에서` 입력 시 drawer/side-sheet 계열 suggestion이 보인다.
3. keyboard smoke: ArrowDown + Enter로 suggestion 선택이 된다.
4. mobile smoke: 390px viewport에서 suggestion panel이 overflow 없이 보인다.
5. phase index step 1을 완료 상태로 갱신한다.

## 금지사항

- suggestion을 hardcoded UI list로만 만들지 않는다. 이유: terms.yml이 단일 출처여야 한다.
- 검색창 layout을 export/PDF split button과 겹치게 만들지 않는다.
