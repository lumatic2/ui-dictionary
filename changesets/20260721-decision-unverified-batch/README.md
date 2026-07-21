# changeset: VL5 step-2 — 미확인 배치 (원문 확보된 것만)

- Date: 2026-07-21 · Plan: VL5 step-2

미확인 3군집을 다시 조사해 **긍정 라벨을 확보한 것만** 만들었다.

## 만든 것 2개

- `navigation-scope.md` — breadcrumb/sidebar-nav/navigation-drawer/tabs/anchor-nav (축 4·규칙 5)
  > "For sites that are more than a few levels deep, breadcrumbs ... can help users orient themselves and understand the site structure." — NN/G, Flat vs. Deep Hierarchy
  > "Use a navigation drawer for 5 or more primary destinations, or more than 1 level of navigation hierarchy" — Material Design 3
- `card-vs-list-expand.md` — disclosure-card/accordion/card/expandable-row (축 3·규칙 4)
  > "Cards work best for collections of heterogeneous items" — NN/G, Cards: UI-Component Definition

## 흡수 1개

**많은 선택지** 군집은 별도로 만들지 않고 `single-choice-input`에 흡수했다. Carbon 원문을 확보해 `option-set-known` 축을 신설했다.
> "Use a combo box when the user needs to select one option, but the list of options may be very long or not predefined." — IBM Carbon

## 만들지 않은 것 1개 — 확인 실패

**"더보기" 절단 펼침.** "이 상황이면 절단 후 더보기를 쓰라"는 조건부 긍정 서술을 못 찾았다.
NN/G의 관련 문서 둘은 각각 링크 라벨 비판과 고급 옵션 숨김이라 판정 조건이 아니다.
**검색 엔진 AI 요약이 NN/G 발로 제시한 문장은 실제 페이지에서 확인되지 않아 인용하지 않았다.**
3자 정리에 서술이 있으나 confidence: low라 축의 근거로 쓰지 않았다.

또한 breadcrumb의 긍정 라벨을 찾기 전까지 **부정문에서 긍정 답을 추론하지 않았다** — 그렇게 하면 정답의 출처가 외부가 아니라 우리 해석이 된다.

## 검증

- `python scripts/validate-decisions.py` → PASS, 6 clusters / 축 26 / 규칙 32
- 축 추가 후 **회귀 없음**: single-choice-3 → radio-group 유지
- 신규 군집 분리력: 내비게이션 5케이스 → 5가지 답, 카드형 4케이스 → 4가지 답
