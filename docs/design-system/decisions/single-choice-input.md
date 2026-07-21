---
id: single-choice-input
name: "단일 선택 입력"
question: "여럿 중 하나를 고르게 해야 한다"
candidates: [radio-group, select, segmented-control, switch, combobox]
axes:
  - id: option-count
    question: "고를 수 있는 보기가 몇 개인가"
    values: ["2-4", "5-20", "20+"]
    source: "https://www.nngroup.com/articles/listbox-dropdown/"
    confidence: high
  - id: space-available
    question: "보기를 전부 펼쳐놓을 세로 공간이 있는가"
    values: ["yes", "no"]
    source: "https://www.nngroup.com/articles/checkboxes-vs-radio-buttons/"
    confidence: high
  - id: applies-immediately
    question: "고르는 즉시 화면에 반영되는가, 아니면 제출해야 적용되는가"
    values: ["immediate", "on-submit"]
    source: "https://www.nngroup.com/articles/toggle-switch-guidelines/"
    confidence: high
  - id: choice-shape
    question: "선택이 값을 고르는 일인가, 켜고 끄는 일인가"
    values: ["pick-one", "on-off"]
    source: "https://www.nngroup.com/articles/checkboxes-vs-radio-buttons/"
    confidence: high
# ⚠ 순서 = 판정. VL1 기준선의 오판(single-choice-3)은 "보기 4개 + 공간 있음 + 나란히 견줌"에
# segmented-control 이라고 답한 것이다. 공간 축이 개수 축보다 먼저 와야 radio 로 간다 —
# NN/G 가 "가능하면 드롭다운보다 라디오"라고 **공간을 조건으로** 말하기 때문이다.
rules:
  - when: { choice-shape: "on-off", applies-immediately: "immediate" }
    pick: switch
    because: "켜고 끄는 일이고 즉시 반영되면 저장 버튼 없는 스위치다"
  - when: { option-count: "20+" }
    pick: combobox
    because: "보기가 수십 개를 넘으면 훑기가 불가능해 검색으로 좁혀야 한다"
  - when: { space-available: "yes", option-count: "2-4" }
    pick: radio-group
    because: "공간이 허락하면 보기를 전부 드러내 나란히 견주게 한다 — 가능하면 드롭다운보다 라디오다"
  - when: { applies-immediately: "immediate", option-count: "2-4" }
    pick: segmented-control
    because: "고르는 즉시 표시가 바뀌는 뷰 전환은 세그먼트가 맞다 — 폼 데이터 수집이 아니다"
  - when: { option-count: "5-20" }
    pick: select
    because: "보기가 다섯을 넘으면 전부 펼치는 비용이 훑는 이득을 넘어선다"
  - when: { space-available: "no" }
    pick: select
    because: "공간이 없으면 접힌 목록으로 간다"
default: select
term_refs: [radio-group, select, segmented-control, switch, combobox]
last_verified: 2026-07-21
---

# 단일 선택 입력 — radio-group / select / segmented-control / switch / combobox

## 이 군집이 필요한 이유

VL1 기준선에서 **2/3**이었다. 틀린 것은 `single-choice-3` — "보기가 넷인데 화면에 자리가 있고, 사용자가 네 개를 나란히 견주어 보고 정하면 좋겠다"에 `segmented-control`이라고 답했다. 정답은 `radio-group`이다.

모델은 개수 임계값(5개 이상이면 드롭다운)은 안다. 모르는 것은 **공간이 개수보다 먼저 걸린다**는 것이다.

> "If possible, use radio buttons rather than drop-down menus." — NN/G, Checkboxes vs. Radio Buttons
> "it's better to use a listbox or dropdown list when there are 5 or more items from which users can choose." — NN/G, Listboxes vs. Dropdown Lists

두 문장은 충돌하지 않는다. 개수는 상한을 정하고, 공간은 그 안에서 형태를 정한다.

## 비교 매트릭스

| 기준 | radio-group | select | segmented-control | switch | combobox |
|---|---|---|---|---|---|
| 적정 보기 수 | 2–5 | 5–20 | 2–5 | 2 (켬/끔) | 20+ |
| 보기 노출 | 전부 | 접힘 | 전부 | — | 검색 후 |
| 반영 시점 | 제출 | 제출 | **즉시** | **즉시** | 제출 |
| 나란히 견주기 | **쉬움** | 어려움 | 쉬움 | — | 어려움 |
| 공간 비용 | 큼 | 작음 | 중간 | 작음 | 작음 |

## 기각 사유

- **radio-group** — 보기가 다섯을 넘으면 세로로 길어져 폼 전체의 훑기를 방해한다.
- **select** — 공간이 있는데도 보기를 접으면 사용자가 견줄 기회를 잃는다. 보기가 두셋뿐인데 접는 것은 클릭 한 번을 더 요구하는 순손해다.
- **segmented-control** — **폼 데이터 수집에 쓰지 마라.** 고르는 즉시 UI에 반영되는 뷰 전환 전용이다. 제출 후 적용되는 값이면 radio-group이나 select다.
- **switch** — 값이 둘 이상인 선택에는 쓸 수 없다. 그리고 제출 버튼이 있는 긴 폼 안에 두면 사용자가 즉시 적용 여부를 확신하지 못한다.
- **combobox** — 보기가 대여섯 개뿐이면 검색으로 좁힐 것이 없어 타이핑만 늘린다.

## 헷갈리는 지점

**segmented-control과 radio-group이 화면에서 거의 같아 보인다.** 둘 다 보기를 전부 펼쳐 나란히 놓는다. 갈림은 **반영 시점** 하나다 — 고르는 순간 화면이 바뀌면 세그먼트, 제출해야 적용되면 라디오다. 기준선이 이 자리에서 틀렸다.

**switch와 radio-group(2지선다)의 차이**도 같은 축이다. "알림 받기 켬/끔"은 즉시 반영이면 switch, 설정 폼 안에서 저장 버튼을 눌러야 하면 라디오나 체크박스다.
