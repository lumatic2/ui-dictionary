---
id: card-vs-list-expand
name: "카드형 펼침"
question: "항목마다 요약을 보여주고 필요하면 자세히 펼치게 하고 싶다"
candidates: [disclosure-card, accordion, card, expandable-row]
axes:
  - id: item-homogeneity
    question: "항목들이 같은 종류·같은 분량의 정보인가, 제각각인가"
    values: ["homogeneous", "heterogeneous"]
    source: "https://www.nngroup.com/articles/cards-component/"
    confidence: high
  - id: summary-needed
    question: "접힌 상태에서도 항목마다 요약이 보여야 하는가"
    values: ["required", "title-only"]
    source: "https://www.nngroup.com/articles/accordions-on-desktop/"
    confidence: medium
  - id: container-shape
    question: "항목이 표의 행인가, 독립된 덩어리인가"
    values: ["table-row", "standalone"]
    source: "https://www.nngroup.com/articles/cards-component/"
    confidence: medium
rules:
  - when: { container-shape: "table-row" }
    pick: expandable-row
    because: "열 정렬이 있는 표 안에서는 카드 경계가 오히려 정렬을 깨뜨린다"
  - when: { item-homogeneity: "heterogeneous" }
    pick: card
    because: "항목마다 담기는 정보의 종류·분량이 다르면 경계와 배경으로 묶어줘야 한 덩어리로 읽힌다"
  - when: { summary-needed: "required" }
    pick: disclosure-card
    because: "접힌 상태에서도 요약이 보여야 하면 제목 줄 하나로는 부족해 카드 몸통이 필요하다"
  - when: { summary-needed: "title-only" }
    pick: accordion
    because: "제목만 보이면 되는 균질한 목록에 카드 경계를 두르는 것은 장식이다"
default: accordion
term_refs: [disclosure-card, accordion, card, expandable-row]
last_verified: 2026-07-21
---

# 카드형 펼침 — disclosure-card / accordion / card / expandable-row

## 근거

> "Cards work best for collections of heterogeneous items (i.e. not all the content is of the same basic type)." / "Cards use a border around the grouped content, and the background color within the card that differs from background color of the underlying canvas. These visual-design elements create a strong sense that the different bits of information contained within the border are grouped together." — NN/G, Cards: UI-Component Definition
> "When the information in each section is independent and users are unlikely to need simultaneous access to multiple sections, accordions can help them quickly access only the section of interest. FAQ pages and product-detail sections are good candidates for accordions." — NN/G, Accordions on Desktop

## 확인 실패로 남긴 것 — "더보기" 절단 펼침

긴 텍스트를 잘라놓고 "더보기"로 펼치는 형태는 **이 군집의 후보에서 뺐다.** "이 상황이면 절단 후 더보기를 쓰라"는 조건부 긍정 서술을 신뢰할 만한 출처에서 찾지 못했다.

- NN/G의 관련 문서 둘(`"Learn More" Links: You Can Do Better`, `Progressive Disclosure`)은 각각 제네릭 링크 라벨 비판과 고급 옵션 숨김을 다루며, 절단 판정 조건이 아니다.
- 검색 엔진의 AI 요약이 NN/G 발로 제시한 문장은 실제 NN/G 페이지에서 확인되지 않았다 — **인용하지 않았다.**
- 3자 정리(uxpatterns.dev)에 서술이 있으나 `confidence: low`라 축의 근거로 쓰지 않았다.

이 판정이 실제로 필요해지는 사례가 나오면 그때 원문을 다시 찾는다.

## 비교 매트릭스

| 기준 | disclosure-card | accordion | card | expandable-row |
|---|---|---|---|---|
| 접힌 상태의 정보 | **요약까지** | 제목만 | 요약(펼침 없음) | 행의 열 값 |
| 항목 균질성 | 중간 | 균질 | **제각각** | 균질 |
| 시각 경계 | 카드 | 구분선 | 카드 | 표 행 |
| 열 정렬 유지 | 안 됨 | 안 됨 | 안 됨 | **유지** |

## 기각 사유

- **disclosure-card** — 접힌 상태에 보여줄 요약이 없으면 일반 accordion과 같아지고 카드 테두리만 남는다.
- **accordion** — 항목마다 담기는 정보가 제각각이면 구분선 하나로는 어디까지가 한 덩어리인지 안 읽힌다.
- **card** — 펼침이 필요한데 카드만 쓰면 모든 내용이 항상 펼쳐져 있어 목록이 길어진다.
- **expandable-row** — 표 밖의 자유로운 목록에 쓰면 열 정렬이라는 이점이 사라져 그냥 아코디언이 된다.

## 헷갈리는 지점

**펼침류 군집과 겹친다.** 펼침류는 "접을 것인가 전환할 것인가"를 묻고, 여기서는 "접는 건 정했는데 어떤 그릇에 담을 것인가"를 묻는다. 펼침류의 `summary-visible` 축이 `disclosure-card`를 가리키면 이 군집으로 넘어와 그릇을 정한다.
