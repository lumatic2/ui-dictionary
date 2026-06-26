# UI Vocabulary Search And Discovery Quality Plan

## planning_gate

```yaml
planning_gate:
  team_validation_mode: manual-pass
  spec_delta: "UI Vocabulary Encyclopedia의 다음 horizon을 검색/탐색 품질로 잡는다. 사용자가 정확한 컴포넌트 이름을 몰라도 생김새, 목적, 상황, 한국어/영어 단서로 원하는 용어에 도달할 수 있게 한다."
  perspectives:
    product: "초급 사용자와 바이브코딩 사용자는 정확한 UI 명칭보다 '옆에서 나오는 창', '켜고 끄는 버튼', '표 필터' 같은 표현으로 찾는다. 검색은 이름 매칭이 아니라 발견 보조여야 한다."
    architecture: "terms.yml -> generated data -> search.ts 흐름은 유지한다. 검색 인덱스와 suggestion 로직은 lib로 분리하고 UI는 shadcn 기반 combobox/command pattern으로 구현한다."
    security: "정적 사이트 안에서만 동작한다. 검색 로그, 서버 저장, 외부 analytics, embedding API는 이번 horizon에서 쓰지 않는다."
    qa: "검색 품질은 스냅샷과 대표 쿼리 세트로 검증한다. 자동완성, 랭킹, no-result recovery, keyboard/mobile 동작을 브라우저 smoke로 확인한다."
    skeptic: "자동완성만 붙이면 검색 품질이 좋아진 것처럼 보이지만, 사용자의 모호한 표현을 term aliases/visual anatomy/prompt phrases와 연결하지 않으면 실패한다."
  dod:
    - "검색창에 자동완성/추천 결과가 붙고 키보드로 선택 가능하다."
    - "검색 결과가 exact name, alias, description, anatomy, prompt phrase 매칭에 따라 더 유용한 순서로 나온다."
    - "검색 결과 상단에 현재 query가 어떤 필드와 맞았는지 사용자가 이해할 수 있는 단서가 보인다."
    - "검색 실패 시 관련 카테고리/인기 후보/유사 쿼리로 회복할 수 있다."
    - "대표 쿼리 세트와 브라우저 smoke가 문서화된다."
```

## Product Question

이 horizon의 핵심 질문은 "검색창에 뭘 넣어야 할지 모르는 사람을 어떻게 도울 것인가"다.

사용자는 세 부류로 나뉜다.

- 이름을 아는 사람: `modal`, `토글`, `breadcrumb`처럼 바로 찾는다.
- 목적을 아는 사람: "여러 개 중 하나 고르기", "상태 보여주기", "표에서 필터하기"처럼 기능으로 찾는다.
- 생김새만 아는 사람: "옆에서 나오는 패널", "위에 뜨는 작은 말풍선", "카드 넘기는 UI"처럼 형태로 찾는다.

현재 검색은 첫 번째 사용자에게 치우쳐 있다. 새 milestone은 두 번째와 세 번째 사용자를 끌어올리는 것이다.

## Scope

In scope:

- 검색 자동완성: term, alias, category/group, prompt phrase 기반.
- 검색 랭킹: exact/prefix/alias/category/anatomy/description/prompt match 가중치.
- 결과 이해 보조: match reason, highlighted field, selected filter summary.
- no-result recovery: 추천 카테고리, 가까운 alias, popular starter queries.
- URL query state: 검색/필터 상태 공유와 새로고침 유지.
- keyboard/mobile 탐색 품질.

Out of scope:

- 서버 검색, 로그인 기반 개인화, 검색 로그 저장.
- embedding/vector search API.
- 퀴즈나 학습 플로우.
- cookbook deep integration.

## Milestone Tree

- [ ] Step 0 — search quality contract and query fixture
  - AC: 대표 query fixture와 expected top results가 문서화되고, 검색 품질 DoD가 phase index에 기록된다.
- [ ] Step 1 — autocomplete and suggestion panel
  - AC: 검색창에서 term/alias/category/group 추천이 뜨고 keyboard로 이동/선택 가능하다.
- [ ] Step 2 — ranked search and match reasons
  - AC: `includes()` 검색을 scoring 기반으로 교체하고, 결과에 match reason을 노출한다.
- [ ] Step 3 — discovery helpers and no-result recovery
  - AC: 빈 결과/모호한 쿼리에서 추천 카테고리, starter query, 가까운 후보로 회복할 수 있다.
- [ ] Step 4 — URL state, QA, and documentation
  - AC: query/filter state가 URL에 반영되고, desktop/mobile/keyboard smoke와 query fixture 결과가 문서화된다.

## Technical Direction

- `src/lib/search.ts`를 바로 비대하게 만들지 않는다.
  - `search.ts`: public API and filter matching.
  - `search-index.ts`: normalized searchable fields, weighted tokens, suggestion candidates.
  - `search-quality.ts` or test fixture: representative queries and expected ids.
- 자동완성 UI는 shadcn pattern에 맞춰 `Command` 또는 lightweight popover/listbox로 구현한다.
- 검색 결과 정렬은 deterministic score를 쓴다.
  - highest: exact Korean/English name, term id.
  - high: prefix name/alias.
  - medium: category/group label, one_liner, prompt phrase.
  - low: description, visual anatomy, anti-use.
- 사용자가 왜 이 결과가 나왔는지 알 수 있게 `이름 일치`, `alias 일치`, `생김새 단서`, `AI 요청 문장` 같은 reason label을 제공한다.
- 성능은 257 terms 기준 client-side search로 충분하다. 데이터가 1,000개 이상으로 커질 때만 indexing 최적화를 검토한다.

## Representative Query Fixture

초기 fixture는 정확한 이름보다 모호한 표현을 포함한다.

- `토글` -> `switch`, `toggle-button`, `toggle-group`
- `켜고 끄는` -> `switch`, `toggle-button`
- `옆에서 나오는 창` -> `drawer`, `side-sheet`, `navigation-drawer`
- `위에 뜨는 창` -> `dialog`, `popover`, `tooltip`
- `표 필터` -> `filter-bar`, `filter-panel`, `faceted-filter`, `data-table-toolbar`
- `검색창` -> `search-field`, `search-view`, `autocomplete`
- `빈 화면` -> `empty-state`, `empty-search-result`, `empty-table`
- `카드 넘기기` -> `carousel`, `image-gallery`
- `결제 카드` -> `payment-method-card`, `price-card`, `plan-card`
- `진행 상태` -> `progress-bar`, `stepper`, `setup-progress`

## Stop Point

이 plan은 implementation 전 설계 산출물이다. 다음 작업은 Step 0부터 phase 파일에 따라 진행한다.
