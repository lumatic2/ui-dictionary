---
id: waiting-and-absence
name: "기다림과 비어 있음"
question: "아직 보여줄 게 없다 — 무엇을 그 자리에 두나"
candidates: [skeleton, spinner, progress-bar, empty-state]
axes:
  - id: cause
    question: "내용이 없는 이유가 아직 오는 중인가, 아예 없는가"
    values: ["loading", "no-data"]
    source: "https://www.nngroup.com/articles/empty-state-interface-design/"
    confidence: high
  - id: scope
    question: "기다리는 것이 화면 전체인가, 그 안의 한 조각인가"
    values: ["full-screen", "single-module"]
    source: "https://www.nngroup.com/articles/skeleton-screens/"
    confidence: high
  - id: duration
    question: "예상 대기 시간이 얼마인가"
    values: ["under-10s", "over-10s"]
    source: "https://www.nngroup.com/articles/skeleton-screens/"
    confidence: high
# ⚠ 순서 = 판정. VL1 기준선의 오판(waiting-3)은 "대시보드 카드 하나만 로딩"에 skeleton 이라고
# 답한 것이다. scope 축이 duration 축보다 먼저 와야 spinner 로 간다.
rules:
  - when: { cause: "no-data" }
    pick: empty-state
    because: "아예 없는 것과 오는 중인 것은 다른 상태다 — 비워두면 고장인지 구분되지 않는다"
  - when: { duration: "over-10s" }
    pick: progress-bar
    because: "10초를 넘으면 '얼마나 남았나'가 필요해진다 — 무한 회전은 답이 되지 않는다"
  - when: { scope: "single-module" }
    pick: spinner
    because: "나머지 화면이 이미 떠 있는데 조각 하나에 뼈대를 그리면 오히려 어수선하다"
  - when: { scope: "full-screen" }
    pick: skeleton
    because: "화면 전체가 오는 중이면 뼈대가 무엇이 올지 미리 알려준다"
default: spinner
term_refs: [skeleton, spinner, progress-bar, empty-state]
last_verified: 2026-07-21
---

# 기다림과 비어 있음 — skeleton / spinner / progress-bar / empty-state

## 이 군집이 필요한 이유

VL1 기준선에서 **3/4**였다. 틀린 것은 `waiting-3` — "대시보드 안의 카드 하나만 자료를 불러오는 중이고 나머지 화면은 이미 다 떠 있다"에 `skeleton`이라고 답했다. 정답은 `spinner`다.

모델은 "스켈레톤이 스피너보다 낫다"는 일반 통념을 안다. 모르는 것은 **범위가 형태를 바꾼다**는 것이다.

> "Skeleton screens (with the exception of frame-display ones) are better when the full screen is loading because the wireframe gives users a sense of what the page will look like" / "Spinners are typically best used on a single module, like a video or a card which is on a dashboard." — NN/G, Skeleton Screens
> "progress bars are strongly recommended for any page that takes longer that 10 seconds to load" — 같은 문서

## 비교 매트릭스

| 기준 | skeleton | spinner | progress-bar | empty-state |
|---|---|---|---|---|
| 원인 | 로딩 | 로딩 | 로딩 | **자료 없음** |
| 범위 | **화면 전체** | **조각 하나** | 무관 | 무관 |
| 적정 대기 | 10초 미만 | 10초 미만 | **10초 이상** | — |
| 알려주는 것 | 무엇이 올지 | 도는 중임 | 얼마나 남았는지 | 왜 없는지 + 다음 행동 |

## 기각 사유

- **skeleton** — 조각 하나에 쓰면 이미 떠 있는 화면 위에 뼈대가 얹혀 어수선하다. 10초를 넘는 대기에도 부족하다 — 뼈대는 진행 상황을 말해주지 않는다.
- **spinner** — 화면 전체가 비어 있는데 가운데 동그라미만 돌면 무엇이 올지 알 수 없다. 긴 대기에도 안 된다.
- **progress-bar** — 짧은 대기에 진행률을 그리면 채워지기도 전에 끝난다. 진행률을 실제로 알 수 없으면 거짓 진행이 된다.
- **empty-state** — **처리 중일 때 쓰지 마라.** 아직 오는 중인데 "자료가 없습니다"라고 하면 거짓말이다.

## 헷갈리는 지점

**"비어 있음"과 "오는 중"을 같은 화면으로 처리하는 것이 가장 흔한 오판이다.** 사용자에게는 완전히 다른 상황이다 — 하나는 기다리면 되고 하나는 뭔가 해야 한다. 그래서 `cause` 축이 맨 앞에 온다.

**empty-state 안에서도 원인이 갈린다.** 처음 써서 비었는가, 검색 결과가 없는가, 필터가 다 걸러냈는가, 권한이 없는가, 불러오기가 실패했는가. 하나의 일러스트로 다섯 상황을 덮으면 사용자는 다음에 뭘 해야 할지 알 수 없다 — 이 세부는 `recipes/feedback/recoverable-empty-state.md`가 다룬다.
