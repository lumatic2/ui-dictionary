---
id: disclosure-family
name: "펼침류"
question: "정보가 많은데 펼치고 접혔으면 좋겠다"
candidates: [accordion, tabs, disclosure, disclosure-card, stepper, drawer]
axes:
  - id: section-count
    question: "접었다 펼 덩어리가 몇 개인가"
    values: ["1", "2-7", "8+"]
    source: "https://www.nngroup.com/videos/tabs-vs-accordions/"
    confidence: high
  - id: section-length
    question: "각 덩어리의 분량이 긴가 짧은가"
    values: ["short", "long"]
    source: "https://www.nngroup.com/videos/tabs-vs-accordions/"
    confidence: high
  - id: simultaneous-access
    question: "두 덩어리를 동시에 열어두고 봐야 하는가"
    values: ["needed", "not-needed"]
    source: "https://www.nngroup.com/articles/accordions-on-desktop/"
    confidence: high
  - id: sequence
    question: "순서를 지켜 진행해야 하는가"
    values: ["ordered", "free"]
    source: "https://www.nngroup.com/articles/accordions-on-desktop/"
    confidence: high
  - id: context-retention
    question: "펼친 내용을 보는 동안 원래 화면(목록 등)이 계속 보여야 하는가"
    values: ["required", "not-required"]
    source: "https://uxpatterns.dev/pattern-guide/modal-vs-drawer"
    confidence: high
  - id: summary-visible
    question: "접힌 상태에서도 항목마다 요약 정보가 보여야 하는가"
    values: ["required", "not-required"]
    source: "https://www.nngroup.com/articles/accordions-on-desktop/"
    confidence: medium
# 규칙은 위에서 아래로 평가하며 첫 일치가 이긴다.
# ⚠ 순서 자체가 판정이다: 개수·분량 축보다 **표면을 정하는 축**(맥락 유지·순서 강제)이 먼저 와야 한다.
# 처음엔 section-count 를 맨 위에 뒀다가 "목록 유지한 채 상세 편집"(덩어리 1개 + 맥락 유지)이
# drawer 가 아니라 disclosure 로 가는 것을 분리력 검증에서 잡았다 (VL4 step-3).
rules:
  - when: { context-retention: "required" }
    pick: drawer
    because: "원래 화면을 유지한 채 옆에서 여는 것은 접기·펼치기가 아니라 보조 패널의 일이다 — 덩어리 수와 무관하게 표면이 먼저 정해진다"
  - when: { sequence: "ordered" }
    pick: stepper
    because: "순서가 강제되면 여닫기가 아니라 진행 상태를 보여줘야 한다"
  - when: { section-count: "1" }
    pick: disclosure
    because: "덩어리가 하나면 목록 구조 자체가 필요 없다 — 여닫는 버튼 하나로 끝난다"
  - when: { summary-visible: "required" }
    pick: disclosure-card
    because: "접힌 상태에서도 요약이 보여야 하면 각 항목이 독립된 카드 경계를 가져야 한다"
  - when: { simultaneous-access: "needed" }
    pick: tabs
    because: "동시에 못 본다는 점이 탭의 비용이지만, 여러 개를 펼쳐 스크롤이 길어지는 것보다 전환이 낫다"
  - when: { section-count: "2-7", section-length: "long" }
    pick: tabs
    because: "적은 수의 긴 구획은 탭 전환이 스크롤보다 읽기 쉽다"
  - when: { section-count: "8+", section-length: "short" }
    pick: accordion
    because: "많고 짧은 구획은 접어두고 필요한 것만 펼치는 편이 훑기 쉽다"
default: accordion
term_refs: [accordion, tabs, disclosure, disclosure-card, stepper, drawer]
last_verified: 2026-07-21
---

# 펼침류 — accordion / tabs / disclosure / disclosure-card / stepper / drawer

사용자가 "정보가 많은데 펼치고 접혔으면 좋겠다"고 말할 때 후보가 되는 여섯 요소.

## 비교 매트릭스

| 기준 | accordion | tabs | disclosure | disclosure-card | stepper | drawer |
|---|---|---|---|---|---|---|
| 덩어리 수 | 많음(8+) | 적음(2–7) | 1 | 여럿 | 여럿 | 1 |
| 덩어리 분량 | 짧음 | 긺 | 짧음 | 중간 | 중간 | 자유 |
| 동시 열람 | 가능(multiple 허용 시) | 불가 | — | 가능 | 불가 | 불가 |
| 접힌 상태의 요약 | 제목만 | 탭 라벨 | 버튼 라벨 | **요약 노출** | 단계명 | — |
| 순서 강제 | 없음 | 없음 | 없음 | 없음 | **있음** | 없음 |
| 원래 화면 유지 | 유지 | 유지 | 유지 | 유지 | 유지 | **유지(옆에 뜸)** |

## 기각 사유 — 언제 이게 답이 아닌가

- **accordion** — 사용자가 페이지 내용 **대부분을 봐야** 하면 접지 마라. 접었다 펴는 조작이 순수 비용이 된다. 계층이 여러 겹이면 아코디언 안의 아코디언이 되어 판독이 무너진다.
- **tabs** — 두 구획을 **나란히 대조**해야 하면 안 된다. 탭은 한 번에 하나만 보이므로 비교를 사용자의 단기기억에 떠넘긴다. 탭이 8개를 넘어가면 넘침 처리가 필요해지고 발견성이 떨어진다.
- **disclosure** — 여닫을 것이 **여러 개**면 각각 독립 버튼이 흩어져 구조가 안 읽힌다. 그때는 accordion이다.
- **disclosure-card** — 항목이 단순 텍스트 목록이면 카드 경계가 과하다. 접힌 상태에 보여줄 요약이 없으면 일반 accordion과 같아진다.
- **stepper** — 단일 화면 작업에 쓰면 과하다. 사용자가 자유롭게 오갈 수 있는 탐색이면 순서를 강제하지 마라.
- **drawer** — **즉각 확인이 필요한 경고**에는 안 된다. 그건 사용자를 세워야 하므로 modal이다. 전체 작업 흐름이면 별도 페이지가 낫다.

## 헷갈리는 지점

**accordion과 tabs의 진짜 갈림은 개수가 아니라 개수 × 분량이다.** "적고 긴 것은 탭, 많고 짧은 것은 아코디언"(NN/G)이 한 줄 요약이지만, 실제로는 동시 열람 필요성이 먼저 걸린다 — 두 구획을 나란히 봐야 하면 둘 다 답이 아니고 애초에 접지 말아야 한다.

**drawer가 이 군집에 있는 이유**는 사용자가 "펼친다"고 말할 때 옆에서 밀려 나오는 패널을 뜻하는 경우가 있기 때문이다. 판별 축은 `context-retention` 하나다 — 원래 목록을 계속 보면서 상세를 손봐야 하면 drawer이고, 그 자리에서 아래로 펼치면 되는 일이면 아코디언 계열이다.

**기준선 측정 결과**: 이 군집은 VL1 기준선에서 3/3 만점이었다(`evidence/vocabulary-in-use/vl1-baseline.md`). 즉 판별 축 없이도 모델이 맞힌다. 이 파일은 **판별 데이터 형식이 실제로 답을 가르는지 증명하는 자리**이지, 오판을 고치는 자리가 아니다 — 오판이 실제로 난 군집은 VL5가 다룬다.
