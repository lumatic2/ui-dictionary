# 리서치 — "어떤 UI 요소를 써야 하는가" 판정의 선행 사례

> 2026-07-21 · 소비처: horizon `element-decision-layer` · 수집: 백그라운드 리서치 에이전트(sonnet), WebSearch/WebFetch
> 모든 인용 접근일 2026-07-21. 확인 못 한 것은 **확인 실패**로 표기했다 — 추정으로 메우지 않았다.

## 왜 조사했나

ui-dictionary는 용어 562개(각각 `when_to_use`/`anti_use`/`related`)와 레시피 60여 개를 갖고 있으나, "사용자가 원하는 것 → 어떤 요소를 쓸지" 판정하는 계층이 없다. `entry-protocol.md`는 surface/pattern_group 분류에서 곧바로 레시피로 점프한다. 이 갭을 메우기 전에 남이 어떻게 하고 있는지 확인했다.

## 1. 공식 디자인 시스템은 "개별 페이지 산문"이 주류

| 시스템 | 형식 | 크로스 컴포넌트 비교 페이지 |
|---|---|---|
| Material Design 3 | 컴포넌트별 "when to use" 산문 | 확인 실패 (검색으로 못 찾음) |
| Shopify Polaris | `Use X for / Don't use X for` 이분 리스트 | 확인 실패 |
| IBM Carbon | 이웃 컴포넌트로의 **승급 조건**을 본문에 명시 | 확인 실패 |
| Adobe Spectrum | picker 페이지 안에서 radio와 대비 | 확인 실패 |
| Microsoft Fluent 2 | **Dialog/Flyout/Panel 3종을 한 페이지에서 대조** | ✅ 드문 사례 |
| W3C ARIA APG | 접근성 구현만 — 선택 판정은 **의도적 스코프 밖** | 없음 |
| GOV.UK | 태스크→패턴 매핑 (요소 A vs B 축이 아님) | 축이 다름 |

원문 발췌:

- Carbon Modal usage — "If enough fields are editable to require scrolling, use a side-panel or full-page edit dialog instead." / "For complex flows with complex choices, consider using a full page instead of a modal." (https://carbondesignsystem.com/components/modal/usage/)
- Fluent — "Given that dialogs block interactions and flyouts do not, dialogs should be reserved for situations where you want the user to drop everything to focus on a specific bit of information." (https://learn.microsoft.com/en-us/windows/apps/develop/ui/controls/dialogs-and-flyouts/)
- Spectrum — "Radio buttons allow users to select a single option from a list of mutually exclusive options, with all possible options exposed up front for users to compare" vs "Pickers allow users to choose from a list of options in a limited space" (https://spectrum.adobe.com/page/picker/, https://spectrum.adobe.com/page/radio-button/)
- Atlassian Forge 가이드라인 — "Don't use checkboxes for long lists—reserve them for 1-3 options" / "Use radio buttons for 2-3 mutually exclusive options" (https://developer.atlassian.com/platform/forge/action-components-guidelines/). Atlassian은 `radio-select`·`checkbox-select` 하이브리드 컴포넌트를 따로 두어 **임계값을 컴포넌트 이름에 새겼다**.

## 2. 진짜 "가로지르는 비교"는 서드파티·사내 시스템에 있다

- **uxpatterns.dev Pattern Guide** (https://uxpatterns.dev/pattern-guide) — **가장 근접한 형식 모델**. `Modal vs Drawer`, `Modal vs Popover vs Tooltip`, `Table vs List vs Cards`, `Pagination vs Infinite Scroll vs Load More`, `Search Field vs Command Palette` 등 전용 페이지 운영. 4단 구조: ① 한 줄 결정 규칙 ② 기준×옵션 비교 매트릭스 ③ `Choose X when / Choose Y when` ④ **기본값 권고**.
  - 발췌: "Use Modal for interruption. Use Drawer for contextual side work." / "Default to Drawer for contextual editing, inspection, filters, and navigation. Choose Modal only when the user must stop and resolve the task before continuing."
- **Smashing Magazine, "Decision Trees For UI Components"** (Vitaly Friedman, https://www.smashingmagazine.com/2024/05/decision-trees-ui-components/) — 결정 트리를 사내 디자인 시스템의 표준 산출물로 만들라는 방법론 글. 선례로 Lyft·NewsKit·Workday Canvas·GitHub Primer 인용. Lyft 원문: "If only one option can be selected, then we use tabs for filtering, radios for shorter options, a switch for immediately applicable options." 핵심 주장 — 결정 트리는 "resolves never-ending discussions about UI decisions for good"이며 **눈에 보이게 게시**해야 효과가 있다.
- **Doctolib Oxygen — Choosing Form Components** — 결정 트리 형식으로 radio/checkbox/dropdown/toggle을 가로지름. **원문 직접 열람 실패**, 2차 출처(Smashing, fountn.design)를 통한 인용.

## 3. 기계 판독 가능한 선택 데이터 — **존재하지 않는다**

- **DTCG**(https://www.designtokens.org/) 스펙 1.0(2025-10 stable)의 스코프는 **토큰 값 교환 포맷**이다. 컴포넌트 선택 로직은 스펙 범위 밖. 관련 제안서 확인 실패.
- 범용 결정 트리 JSON 스키마는 있다 (`kemitchell/decision-tree-schema.json`) — 그러나 UI 도메인 특화 적용 사례는 발견 못 함.
- **v0 (Vercel)** — Tailwind + shadcn/ui 관용구에 파인튜닝된 모델. 선택 로직은 가중치 안에 암묵적으로만 존재하며 **문서화된 판정표는 비공개**.
- **Galileo AI** — "context-aware component selection" 마케팅 문구는 있으나 알고리즘 비공개. 오히려 *사용자가 DESIGN.md로 규칙을 주입*하는 방향.
- Figma Community "Component Decision Tree" 파일 존재 — 사람이 보는 다이어그램이지 기계 판독 데이터가 아님.

> **판정**: 토큰에는 성숙한 표준(DTCG)이 있지만 "어떤 컴포넌트를 쓸지"의 동급 표준은 없다. 이 horizon은 **선례가 비어 있는 자리**를 메운다. 참고 경로는 둘 — ① 범용 decision-tree 스키마를 UI 도메인에 특화 ② uxpatterns.dev식 기준×옵션 매트릭스를 구조화 데이터로 승격.

## 4. 판별 축 후보 (근거 있는 것만)

| 축 | 근거 | 적용 군집 |
|---|---|---|
| 항목 수 | NN/G Listbox vs Dropdown("5+"), Atlassian("체크박스 1–3, 라디오 2–3") | radio/checkbox/select, tabs/accordion, segmented(2–5) |
| 동시 열람(비교) 필요성 | NN/G Tabs("don't need to simultaneously see"), NN/G Accordion("unlikely to need simultaneous access") | tabs vs accordion, table vs list vs card, radio vs select |
| 콘텐츠 길이·균등성 | NN/G — "tabs suit a few long sections, accordions fit many short ones" | tabs vs accordion |
| 흐름 분리(맥락 유지) | uxpatterns Modal vs Drawer(page context Weak/Strong), Carbon | modal vs drawer vs sheet vs full page |
| 파괴성·되돌릴 수 있음 | uxpatterns("best for destructive confirmation: Strong(modal)") | modal vs drawer vs toast |
| 차단성(모덜리티) | Fluent("dialogs block interactions and flyouts do not") | modal vs popover vs toast |
| 입력 vs 표시 | segmented control 실무 정리("don't use segmented controls to collect data") | segmented vs tabs vs radio |
| 공간 제약 | Spectrum(picker="limited space"), NN/G Accordion("window size is small") | radio vs select, tabs vs accordion |
| 정보 밀도·구조화 | uxpatterns Table vs List vs Cards 매트릭스 | table vs list vs card |
| 단계형 프로세스 | NN/G Accordion("main task is a logical, step-by-step process") | accordion vs stepper vs wizard |
| 계층 깊이 | NN/G Accordion 회피조건("deep hierarchy with multiple sublevels") | accordion vs disclosure vs tree |
| 읽기 흐름 연속성 | NN/G Accordion 회피조건("continued flow of reading") | accordion vs 롱폼 페이지 |

### NN/G 원문 발췌 (핵심)

- Accordion 사용 조건 — "When the information in each section is independent and users are unlikely to need simultaneous access to multiple sections." / "When the content is long and the window size is small." (https://www.nngroup.com/articles/accordions-on-desktop/)
- Accordion 회피 조건 — "When your audience requires the majority or all the content on the page…" / "When users are likely to immerse in a continued flow of reading."
- Tabs — "When users don't need to simultaneously see information presented under different tabs… a tab-based design taxes users' short-term memory" / "Ensure that the content within nondefault tabs is supplemental rather than critical." (https://www.nngroup.com/articles/tabs-used-right/)
- Tabs vs Accordions 요약 — "Tabs are great for a few long sections, while accordions are ideal for many short ones." (https://www.nngroup.com/videos/tabs-vs-accordions/)
- Listbox vs Dropdown — "it's better to use a listbox or dropdown list when there are 5 or more items from which users can choose." (https://www.nngroup.com/articles/listbox-dropdown/)

> ⚠ 숫자 임계값 주의: "탭 2–7개" 류 수치는 NN/G 원문이 아니라 3자 정리(thehangline.com)에서 나왔다. **근거 강도가 낮아 초안 참고치로만 쓴다.**

## 5. 헷갈리는 군집 후보 15개

1. **펼침류** — accordion / tabs / disclosure / stepper · 축: 섹션 수·동시 열람·순차성
2. **오버레이류** — modal / drawer / bottom sheet / full-page flow · 축: 맥락 유지·파괴성·필드 수
3. **떠 있는 것** — popover / tooltip / flyout · 축: 상호작용 가능 여부·트리거
4. **단일 선택 입력** — radio / select / segmented control / toggle switch · 축: 항목 수·즉시 반영·공간
5. **온오프** — checkbox / switch / toggle chip · 축: 즉시 적용 vs 제출 후
6. **목록 표시** — table / list / card grid · 축: 열 비교 필요·밀도·이미지 비중
7. **더 불러오기** — pagination / infinite scroll / load more · 축: 재방문·북마크·탐색 vs 소비
8. **찾기** — search field / command palette / filter panel · 축: 목표 지식·키보드 우선
9. **알림류** — toast / inline banner / confirmation modal · 축: 긴급도·차단성·자동 소멸
10. **내비게이션** — breadcrumb / section tabs / sidebar nav · 축: 계층 깊이·형제 수·전역 vs 로컬
11. **긴 폼** — wizard / single long form / accordion form · 축: 단계 의존성·되돌아가기 빈도
12. **비어 있음/기다림** — empty state / skeleton / spinner · 축: 예측 가능성·"없음" vs "로딩 중"
13. **많은 선택지** — combobox / select / radio · 축: 옵션 총량(수백~수천이면 검색형)
14. **카드형 펼침** — disclosure-card / accordion / 더보기 텍스트 · 축: 항목의 시각적 독립성
15. **모바일 전환** — segmented control / tab bar / top tabs · 축: 전역 화면 전환 vs 동일 화면 뷰 전환

## 후속 조사 (미완 — 확인 실패 목록)

- Doctolib Oxygen "Choosing form components" 원문 직접 열람
- NN/G "Checkboxes vs. Radio Buttons", "Data Tables: Four Major User Tasks", "Modal & Nonmodal Dialogs" 원문 전체 발췌
- Smashing Magazine 2026-03 "Modal vs. Separate Page: UX Decision Tree" — 문제의식이 가장 가까운 최신 글, 미열람
- Material/Carbon/GOV.UK에 크로스 비교 페이지가 정말 없는지 사이트 내부 검색 재확인
- DTCG GitHub issue 레벨에 "컴포넌트 선택" 제안이 있는지

**종료 신호**: 제약 종료 — 포화 전에 닫았다. 항목 1·3은 포화(같은 결론 반복)에 도달했으나 항목 2의 NN/G 원문 발췌는 미완이다. ED2 군집 작성 시 위 미열람 소스를 군집별로 마저 확인한다.
