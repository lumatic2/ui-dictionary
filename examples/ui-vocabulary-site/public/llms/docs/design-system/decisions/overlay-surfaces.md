---
id: overlay-surfaces
name: "오버레이 표면"
question: "이 작업을 지금 화면 위에 띄워야 하는데 어떤 방식이 맞나"
candidates: [dialog, drawer, side-sheet, modal-bottom-sheet, full-screen-dialog]
axes:
  - id: must-resolve-first
    question: "사용자가 다른 일을 계속하기 전에 이 판단을 반드시 매듭지어야 하는가"
    values: ["required", "not-required"]
    source: "https://uxpatterns.dev/pattern-guide/modal-vs-drawer"
    confidence: high
  - id: context-visible
    question: "작업하는 동안 뒤 화면(목록·문서)이 계속 보여야 하는가"
    values: ["required", "not-required"]
    source: "https://uxpatterns.dev/pattern-guide/modal-vs-drawer"
    confidence: high
  - id: content-overflow
    question: "편집할 내용이 화면 높이를 넘어 스크롤이 필요한가"
    values: ["scrolls", "fits"]
    source: "https://carbondesignsystem.com/components/modal/usage/"
    confidence: high
  - id: blocking
    question: "뒤 화면 조작을 막아야 하는가"
    values: ["blocks", "non-blocking"]
    source: "https://learn.microsoft.com/en-us/windows/apps/develop/ui/controls/dialogs-and-flyouts/"
    confidence: high
  - id: viewport
    question: "주 사용 환경이 모바일인가"
    values: ["mobile", "desktop"]
    source: "https://developer.apple.com/design/human-interface-guidelines/sheets"
    confidence: medium
# ⚠ 순서 = 판정 (VL4 에서 배운 것): 표면을 정하는 축이 크기 축보다 먼저 온다.
# 단 content-overflow 는 예외적으로 modal 판정보다 앞선다 — Carbon 이 "스크롤이 필요하면
# modal 이 아니다"라고 **명시**하기 때문이다. 이 순서가 VL1 기준선의 오판(overlay-3)을 고친다.
rules:
  - when: { content-overflow: "scrolls" }
    pick: drawer
    because: "필드가 많아 스크롤이 필요하면 modal 이 아니라 사이드 패널·전체 페이지로 올려야 한다 (Carbon 명시)"
  - when: { must-resolve-first: "required" }
    pick: dialog
    because: "계속하기 전에 반드시 해결해야 하는 판단은 사용자를 세운다 — 파괴적 확인이 전형"
  - when: { context-visible: "required" }
    pick: drawer
    because: "뒤 목록을 보면서 손봐야 하면 화면을 가리는 표면은 쓸 수 없다"
  - when: { blocking: "non-blocking" }
    pick: drawer
    because: "뒤 화면 조작을 막지 않아도 되면 세우는 표면을 쓸 이유가 없다"
  - when: { viewport: "mobile", context-visible: "not-required" }
    pick: modal-bottom-sheet
    because: "모바일에서 아래에서 올라오는 시트가 엄지 도달 범위에 맞는다"
default: drawer
term_refs: [dialog, drawer, side-sheet, modal-bottom-sheet, full-screen-dialog, confirmation-dialog]
last_verified: 2026-07-21
---

# 오버레이 표면 — modal / drawer / bottom-sheet / dialog

## 이 군집이 필요한 이유

VL1 기준선에서 **2/3**이었다. 틀린 것은 `overlay-3` — "편집할 항목이 많아 내용이 화면 높이를 넘어 스크롤해야 한다"에 `modal`이라고 답했다. 정답은 사이드 패널 계열이다.

모델은 "맥락 유지면 drawer, 매듭지어야 하면 modal"이라는 일반론은 안다. 모르는 것은 **분량이 표면을 바꾼다**는 임계값이다.

> "If enough fields are editable to require scrolling, use a side-panel or full-page edit dialog instead." — IBM Carbon, Modal usage

## 비교 매트릭스

| 기준 | dialog | drawer | side-sheet | modal-bottom-sheet |
|---|---|---|---|---|
| 뒤 화면 보임 | 가림 | **보임** | **보임** | 부분 |
| 뒤 화면 조작 | 막음 | 가능 | 가능 | 막음 |
| 스크롤 긴 내용 | **부적합** | 적합 | 적합 | 부분 적합 |
| 파괴적 확인 | **적합** | 부적합 | 부적합 | 부적합 |
| 주 환경 | 양쪽 | 데스크톱 | 데스크톱 | **모바일** |

사전의 정본 id 는 `dialog` 다(`modal` 이라는 id 는 없다). 실무에서 "모달"이라 부르는 것이 여기서는 `dialog` 이며, 채점기의 표기 동의어 표가 둘을 같은 답으로 취급한다.

## 기각 사유

- **dialog** — 스크롤이 필요할 만큼 내용이 길면 안 된다. 뒤 맥락을 보면서 해야 하는 작업도 안 된다.
- **drawer** — 즉각 확인이 필요한 경고에는 안 된다. 사용자를 세워야 하는 일이므로 modal이다.
- **modal-bottom-sheet** — 데스크톱에서 화면 아래에 붙는 시트는 도달성이 나쁘다.
- **side-sheet** — 뒤 화면을 완전히 가려야 하는 집중 작업에는 부적합하다. 그때는 dialog 나 full-screen-dialog 다.
- **full-screen-dialog** — 짧은 확인 하나에 화면을 통째로 쓰면 과하다.

## 헷갈리는 지점

**"매듭지어야 하는가"와 "내용이 긴가"가 충돌할 때 무엇이 이기는가.** 예: 긴 폼을 반드시 제출해야 하는 상황. 규칙 순서상 `content-overflow`가 먼저 이겨 drawer 로 간다. 근거는 Carbon이 스크롤을 표면 승급의 조건으로 **명시**했기 때문이다 — 매듭 강제는 표면이 아니라 닫기 제한(dismiss 차단)으로 구현할 수 있지만, 스크롤은 표면을 바꾸지 않으면 해결되지 않는다.
