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

## 사람 관측 (DoD 최종 항목)

- 과업: 사전 설명 없이 "아코디언 찾아서 보고, 헤더 종류 목록까지 가보세요"
- **상태: 대기** — 관측 후 성공/실패·막힌 지점·발화 인용을 여기에 기록한다. 기계 PASS 만으로 닫지 않는다(RU1·DOG7 교훈).
