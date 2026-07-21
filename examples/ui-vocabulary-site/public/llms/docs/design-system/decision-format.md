# Decision Format — 판별 데이터 계약

Date: 2026-07-21
Milestone: VL4 (plan: `plans/2026-07-21-vl4-decision-data-contract.md`)
지위: **군집 판별 파일의 정본 계약.** `recipe-format.md`와 짝이며, `entry-protocol.md`의 요소 결정 단계가 이 형식의 데이터를 읽는다.

## 무엇을 담는 데이터인가

용어 사전은 각 용어가 **자기 시점의 경계**만 갖는다 — `accordion.anti_use: 항상 비교해야 하는 정보는 접지 않는다`. 이걸 아무리 모아도 "그럼 accordion인가 tabs인가"는 답해지지 않는다. 후보들 **사이를 가르는 축**이 어디에도 없기 때문이다.

판별 파일은 그 축을 담는다. 한 파일 = 한 **군집**(헷갈리는 후보들의 묶음).

## 군집은 분류가 아니다

`pattern-taxonomy.md`의 surface(7)·pattern_group(10)·group(57)은 **분류 체계**다. 군집은 다르다 — **실제로 오판이 나는 후보들의 묶음**이다. 한 군집의 후보들이 서로 다른 category에 흩어져 있는 것이 정상이다(예: 펼침류의 `accordion`은 data-display, `tabs`는 selection, `drawer`는 structure).

그래서 군집 id는 기존 분류 어휘와 **별도 네임스페이스**를 쓴다: `docs/design-system/decisions/<cluster-id>.md`.

## 무엇을 축으로 적나 — 가장 중요한 규칙

**모델이 이미 상식으로 아는 구분은 적지 않는다.**

VL1 기준선 측정(`evidence/vocabulary-in-use/vl1-baseline.md`)에서 확인된 것: 현행 자산만 쥔 에이전트가 외부 출처 라벨 32건 중 27건(84.4%)을 맞혔고, 12군집 중 8군집이 만점이었다. 틀린 3건의 공통점은 전부 **임계값이 있는 규칙**이었다 — "스크롤이 필요할 만큼 길면 사이드 패널로", "공간이 있으면 라디오로 전부 노출", "단일 모듈이면 스켈레톤 말고 스피너".

축의 값어치는 "어떤 요소가 있는지"가 아니라 **"어디서 갈리는지"**에 있다. 일반론을 적으면 지면만 늘고 판정은 안 바뀐다.

## 파일 위치와 이름

```
docs/design-system/decisions/<cluster-id>.md
```

- `<cluster-id>`: kebab-case, 전역 유일, **파일명 = frontmatter `id`**
- 인덱스: `docs/design-system/decisions/README.md` (군집 목록 + 만들지 *않은* 군집과 그 사유)

## Frontmatter

```yaml
---
id: disclosure-family
name: "펼침류"
question: "정보가 많은데 펼치고 접혔으면 좋겠다"   # 사용자가 실제로 할 법한 말
candidates: [accordion, tabs, disclosure, disclosure-card, stepper, drawer]  # terms.yml 실존 id
axes:
  - id: section-count
    question: "접을 덩어리가 몇 개인가"
    values: ["1", "2-7", "8+"]
    source: "https://www.nngroup.com/videos/tabs-vs-accordions/"
    confidence: high        # high | medium | low
rules:
  - when: { section-count: "1" }
    pick: disclosure
    because: "덩어리가 하나면 목록 구조가 필요 없다"
default: accordion          # 축이 안 갈릴 때의 기본값
term_refs: [accordion, tabs]        # 선택 — 본문에서 언급하는 다른 용어
source_refs: [nngroup-accordions]   # 선택
last_verified: 2026-07-21
---
```

### 필수 필드

`id` · `name` · `question` · `candidates` · `axes` · `rules` · `default` · `last_verified`

### 축(axis) 레코드

| 필드 | 규칙 |
|---|---|
| `id` | kebab-case, 이 파일 안에서 유일 |
| `question` | 사람이 답할 수 있는 질문 한 줄. "밀도가 높은가" 같은 모호어 금지 |
| `values` | 그 축이 가질 수 있는 값 목록. 규칙의 `when`은 여기 있는 값만 쓸 수 있다 |
| `source` | **출처 URL 필수.** 근거 없는 축은 통념의 배포처가 된다 |
| `confidence` | `high`(원문 직접 확인) / `medium`(공식 문서의 간접 서술) / `low`(3자 정리·근거 약함) |

⚠ **숫자 임계값 주의**: "탭은 2~7개" 같은 수치는 3자 사이트에서 온 것이 많다. 원 출처를 확인하지 못했으면 `confidence: low`로 명시한다.

### 규칙(rule) 레코드

| 필드 | 규칙 |
|---|---|
| `when` | `축 id → 값` 매핑. 값은 그 축의 `values` 안에 있어야 한다 |
| `pick` | `candidates` 안의 id여야 한다 |
| `because` | 왜 그 답인지 한 줄. 출처 인용이 아니라 **판정 논리** |

규칙은 위에서 아래로 평가하며, `when`의 모든 조건이 맞는 첫 규칙이 이긴다. 아무것도 안 맞으면 `default`.

## 본문 (frontmatter 아래)

frontmatter가 기계 판정용이라면 본문은 사람이 읽는 층이다. 레시피와 같은 이중 구조다.

1. **비교 매트릭스** — 기준(행) × 후보(열). 각 칸은 짧게.
2. **기각 사유** — 각 후보에 대해 "언제 이게 답이 아닌가" 한 줄.
3. **헷갈리는 지점** — 실제로 오판이 나는 자리와 그 이유. 기준선 측정에서 틀린 케이스가 있으면 그것을 적는다.

## 보고 블록 — `요소 결정`

판별 데이터를 읽고 답을 골랐으면 **보고에 그 판정을 드러낸다.** 아무도 못 보는 결정은 아무도 반박할 수 없다. 리서치가 확인한 실패 모드가 정확히 이것이다 — 결정 트리를 만들어도 눈에 안 보이면 안 쓴다(Smashing/Friedman).

```
요소 결정: <고른 term id> (군집: <cluster id>)
- 갈린 축: <axis id>=<value> → <그래서 왜 이 답인가>
- 기각: <대안 term id> — <왜 아닌가>
- 자산: <code asset 이름 | recipe 경로 | 폴백(no-asset-fallback)>
```

- 요소가 처음부터 지정된 작업("이 버튼 색 고쳐")은 `요소 결정: 해당 없음 — 요소 지정됨` 한 줄이 **정당한 값**이다. 빈 칸으로 두는 것과 다르다.
- 축을 답할 수 없어 사용자에게 되물었으면 그 질문과 답을 `갈린 축`에 적는다.
- 어느 군집도 후보를 덮지 않아 용어 항목만으로 판정했으면 `군집: 없음 — <어떤 군집이 없었나>`로 적는다. 이 기록이 다음 군집 후보의 입력이다.

## 검증

`python scripts/validate-decisions.py`

1. frontmatter 필수 필드 존재
2. `candidates`의 모든 id가 `docs/ui-vocabulary/terms.yml`에 실존
3. 모든 축에 `source`와 `confidence` 존재
4. `rules[].pick`이 `candidates` 안에 있고, `when`의 축·값이 `axes` 정의 안에 있음
5. `default`가 `candidates` 안에 있음
6. (전 군집) 같은 용어가 두 군집에서 **모순되는** 규칙을 갖지 않음

## Changelog

- 2026-07-21: 신설 (VL4 — 후보 사이를 가르는 축을 담을 자리가 스키마에 없던 것을 메움)
