# UE1 — 탐색이 작동한다 · 증거

> milestone UE1 · goal `ui-encyclopedia` · 2026-07-27
> plan: `plans/2026-07-27-ue1-encyclopedia-navigation.md` · changeset: `changesets/20260727-ue1-encyclopedia-navigation/`

## 기계 검증 (실행 관측 — 원문)

### step-1 — 사이드바 내비 (Playwright)

```
Header Sections: url=http://localhost:5173/?page=plus&filter=nav%3Aplus-marketing-header-sections left_term_page=True label_visible=True
Footers: url=http://localhost:5173/?page=plus&filter=nav%3Aplus-marketing-footers left_term_page=True label_visible=True
FAQs: url=http://localhost:5173/?page=plus&filter=nav%3Aplus-marketing-faqs left_term_page=True label_visible=True
CONSOLE ERRORS: 0
STEP1 VERIFY: PASS
```

Failure probe (경로 일시 오염 후 클릭):

```
nav warns: ['navigation: no collection matches path "Plus / UI Blocks / Application UI / Forms" — check navigationCollections']
```

### step-2 — URL 딥링크 (Playwright)

```
1 filter deeplink: PASS  http://localhost:5173/?filter=nav%3Aplus-marketing-header-sections&page=plus
2 query deeplink: PASS  http://localhost:5173/?q=%EC%95%84%EC%BD%94%EB%94%94%EC%96%B8&filter=nav%3Aplus-all&page=plus
3 legacy term deeplink: PASS  http://localhost:5173/?page=term&id=accordion
3b invalid id fallback: PASS  http://localhost:5173/?page=term&id=no-such-term
4 list->detail->back: PASS  (뒤로가기 → q= 목록 복귀, popstate 실동작)
CONSOLE ERRORS: 0
STEP2 VERIFY: PASS
```

### step-3 — 통합 시나리오 (Playwright)

```
home: PASS  http://localhost:5173/
search results: PASS  (Ctrl+F → "아코디언" 입력 → 추천 결과)
term detail: PASS  http://localhost:5173/?page=term&id=accordion
header sections listing: PASS  http://localhost:5173/?page=plus&filter=nav%3Aplus-marketing-header-sections
deeplink share (new tab): PASS  (같은 주소 새 탭 재현)
CONSOLE ERRORS: 0
STEP3 INTEGRATED: PASS
```

경로 메모: 검색 추천 결과 클릭은 설계상 **검색 결과 페이지**로 가고, 상세는 결과 행을 한 번 더 클릭해 진입한다(2클릭 흐름).

### 회귀 게이트

- `npm run build` → `✓ built in 1.14s`, exit 0 (500kB 청크 경고는 기존 항목)
- `npm run lint` → exit 0, error 0 (fast-refresh 경고는 기존 항목)

## 사람 관측 1회차 (2026-07-27) — **미달**

과업: "아코디언 찾아서 보고, 헤더 종류 목록까지 가보세요" → **아코디언 도달 실패.** 발화 원문:

> "get started나 open docs 누른 다음 홈으로 돌아가려고 뒤로가기 버튼 눌렀는데 뒤로 안 가지네"
> "get started 눌렀을 때 나타나는 페이지도 지금 좀 많이 비어있어서 채워야 하긴 하겠네. 적어도 준비 중이라는 문구라도"
> "opendocs 누르면 Getting set up 나오는데 이게 무슨 역할인지 모르겠네? 어스큐리 디자인 소개하는 거가 되어야 하지 않으려나? 다른 페이지들 허브 역할을 하거나?"
> "검색창에 아코디언, 헤더 같은거 쳐도 아무것도 안 나오네? 영어 쳐도 안 나오고"
> "목차 있는데 마우스 스크롤 해서 내려가니까 안 따라오네? 따라와야 함"
> "좌측 네비게이션에서 스크롤 하면 네비게이션 쪽에서 스크롤되다가 끝에 다다르면 메인 페이지가 스크롤되기 시작함. 서로 별개가 되어야 함"
> "그리고 아코디언은 못 찾았다. 좌측 네비게이션도 구조가 좀 뒤죽박죽 같은걸"

**기계 통합 E2E 5항 PASS 상태에서 사람이 7건을 적발했다** — RU1·DOG7 구조의 재확인. 특히 검색 결함은 기계 시나리오(홈에서 Ctrl+F)가 지나가지 않는 표면(Docs 페이지 위 검색)에 있었다.

### 결함 분류와 조치

| # | 결함 | 분류 | 조치 |
|---|---|---|---|
| O1 | Get Started/Open Docs 후 뒤로가기 불능 | 좁은 수리 | **수리** — 페이지 이동 함수에 히스토리 push (`pushHistoryEntry`) |
| O2 | 검색이 Docs 등에서 0건 (한/영) | 좁은 수리 | **수리** — 제안이 현재 필터에 갇혀 있었다(`search-suggestions.ts` 필터 우선 2-pass 로 교정) |
| O3 | "On this page" 목차 안 따라옴 | 좁은 수리 | **수리** — TOC aside 4곳 sticky 화 |
| O4 | 좌측 내비 스크롤 체이닝 | 좁은 수리 | **수리** — `overscroll-contain` |
| O5 | Get Started 페이지 비어 있음 | 구조(콘텐츠) | finding 큐 — 노출 정책("Coming soon 금지")과의 긴장 포함해 후속 milestone 에서 |
| O6 | Docs 랜딩("Getting set up") 역할 불명 — 소개/허브여야 | 구조(IA) | finding 큐 |
| O7 | 좌측 내비 IA 뒤죽박죽 · 아코디언 도달 경로 부재 | 구조(IA) | finding 큐 — UE2/UE3 계획의 1차 입력 |

### 수리 검증 (실행 관측)

```
F1 get-started -> back: PASS  http://localhost:5173/
F1b open-docs -> back: PASS  http://localhost:5173/
F2 docs search '아코디언': PASS  F2 '헤더': PASS  F2 'accordion': PASS (제안 라벨 '아코디언/Accordion' 렌더 확인)
F3 TOC sticky after scroll: PASS  y=80
CONSOLE ERRORS: 0
```

회귀 게이트 재실행: `npm run build` exit 0 · `npm run lint` exit 0.

## 사람 관측 2회차 — 대기

O1~O4 수리 후 같은 과업 재관측으로 닫는다.
