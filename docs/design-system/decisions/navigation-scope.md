---
id: navigation-scope
name: "내비게이션 범위"
question: "여기서 저기로 갈 수 있게 해야 하는데 무엇을 두나"
candidates: [breadcrumb, sidebar-nav, navigation-drawer, tabs, anchor-nav]
axes:
  - id: hierarchy-depth
    question: "사이트·앱 계층이 몇 단계인가"
    values: ["1-2", "3+"]
    source: "https://www.nngroup.com/articles/flat-vs-deep-hierarchy/"
    confidence: high
  - id: destination-count
    question: "같은 레벨의 주요 목적지가 몇 개인가"
    values: ["under-5", "5+"]
    source: "https://m3.material.io/components/navigation-drawer/guidelines"
    confidence: high
  - id: scope
    question: "이동 범위가 제품 전체인가, 지금 이 화면 안인가"
    values: ["global", "within-page"]
    source: "https://www.nngroup.com/articles/tabs-used-right/"
    confidence: medium
  - id: viewport
    question: "주 사용 환경이 좁은 화면인가"
    values: ["narrow", "wide"]
    source: "https://m3.material.io/components/navigation-drawer/guidelines"
    confidence: high
# ⚠ 순서 = 판정. 범위(scope)가 먼저다 — 화면 안 이동과 제품 전체 이동은 애초에 다른 문제이고,
# 그 다음에야 깊이·개수가 형태를 정한다.
rules:
  - when: { scope: "within-page" }
    pick: anchor-nav
    because: "같은 문서 안의 구획으로 뛰는 것은 이동이 아니라 스크롤 보조다"
  - when: { hierarchy-depth: "3+" }
    pick: breadcrumb
    because: "몇 단계보다 깊어지면 사용자가 자기 위치와 구조를 파악할 실마리가 필요하다"
  - when: { destination-count: "5+", viewport: "narrow" }
    pick: navigation-drawer
    because: "좁은 화면에서 주요 목적지가 다섯을 넘으면 상시 노출할 자리가 없어 서랍으로 접는다"
  - when: { destination-count: "5+" }
    pick: sidebar-nav
    because: "주요 목적지가 다섯 이상이거나 계층이 두 겹을 넘으면 상시 노출되는 레일이 필요하다"
  - when: { scope: "global", destination-count: "under-5" }
    pick: tabs
    because: "목적지가 서넛뿐이면 전부 늘어놓는 편이 접어두는 것보다 빠르다"
default: sidebar-nav
term_refs: [breadcrumb, sidebar-nav, navigation-drawer, tabs, anchor-nav, breadcrumb-header, navigation-rail]
last_verified: 2026-07-21
---

# 내비게이션 범위 — breadcrumb / sidebar-nav / navigation-drawer / tabs / anchor-nav

## 이 군집이 늦게 만들어진 이유

VL1 케이스 세트에서 이 군집은 **빠졌다.** breadcrumb의 *부정* 조건("계층이 1~2단계로 평평하면 불필요")만 있고 "이 상황이면 이걸 쓰라"는 긍정 라벨을 찾지 못했기 때문이다. 부정문에서 긍정 답을 추론하면 그 순간 정답의 출처가 외부가 아니라 우리 해석이 된다.

VL5에서 다시 찾아 두 개의 긍정 서술을 확보했다:

> "For sites that are more than a few levels deep, breadcrumbs (which show a link for each level of the site from the homepage to the current page) can help users orient themselves and understand the site structure." — NN/G, Flat vs. Deep Hierarchy
> "Use a navigation drawer for 5 or more primary destinations, or more than 1 level of navigation hierarchy" — Material Design 3, Navigation drawer

**기준선은 없다.** 이 군집은 VL1 측정에 포함되지 않았으므로 향상 폭을 말할 수 없다. VL7 대조에서도 제외되며, 케이스를 추가한다면 그때부터 잰다.

## 비교 매트릭스

| 기준 | breadcrumb | sidebar-nav | navigation-drawer | tabs | anchor-nav |
|---|---|---|---|---|---|
| 이동 범위 | 전체(위로) | 전체 | 전체 | 전체(형제) | **화면 안** |
| 적정 목적지 수 | — | 5+ | 5+ | 2–4 | 문서 구획 |
| 계층 깊이 | **3단계+** | 2단계+ | 2단계+ | 1단계 | — |
| 상시 노출 | 상시 | 상시 | **접힘** | 상시 | 상시 |
| 좁은 화면 | 적합 | 비좁음 | **적합** | 적합 | 적합 |

## 기각 사유

- **breadcrumb** — 계층이 1~2단계로 평평하거나 구조가 선형이면 붙일 것이 없다. 그리고 breadcrumb 단독으로는 형제 간 이동을 못 하므로 주 내비게이션을 대신할 수 없다.
- **sidebar-nav** — 목적지가 서넛뿐인데 세로 레일을 세우면 화면 폭만 잡아먹는다.
- **navigation-drawer** — 넓은 화면에서 접어두면 상시 노출할 수 있는 것을 굳이 한 번 더 열게 만든다.
- **tabs** — 서로 관련 없는 페이지 이동에 쓰지 마라. 탭은 같은 맥락의 형제 뷰라는 신호를 준다. 개수가 늘면 넘침 처리가 필요해져 발견성이 떨어진다.
- **anchor-nav** — 다른 화면으로 가는 데는 쓸 수 없다. 같은 문서 안 구획 이동 전용이다.

## 헷갈리는 지점

**breadcrumb와 sidebar-nav는 경쟁 관계가 아니다.** 하나는 "내가 어디 있는가"(위로 가는 길), 다른 하나는 "어디로 갈 수 있는가"(형제·전체 목록)를 답한다. 깊은 계층에서는 둘 다 필요한 경우가 흔하다. 이 군집의 규칙이 하나만 고르게 하는 것은 **무엇을 먼저 두느냐**의 판정이지 나머지를 금지하는 것이 아니다.

**tabs가 여기와 펼침류 양쪽에 있다.** 같은 요소지만 묻는 것이 다르다 — 펼침류에서는 "접을 것인가 전환할 것인가", 여기서는 "제품 전체를 오갈 것인가". 두 군집의 규칙이 서로 모순되지 않는지는 검증기의 교차 검사가 본다.
