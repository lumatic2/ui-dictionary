# VL1 — 흐름 실사 장부

> 2026-07-21 · milestone VL1 step-1 · plan `plans/2026-07-21-vl1-flow-audit.md`
> **기준: 배포본(`ui.askewly.com`).** 로컬 파일이 있다는 이유로 해소된 것으로 치지 않는다 — 에이전트가 실제로 겪는 것은 배포본이다.

## 0. 계측 방법

`askewly-design` 스킬이 지시하는 경로를 그대로 따라가며 실제로 fetch하고, 각 단계에서 다음 fetch 대상과 "여기서 용어 사전이 등장하는가"를 기록했다. 추정으로 메운 단계는 없다 — 확인 못 한 것은 **미확인**으로 표기한다.

재현 커맨드: 아래 §1의 URL을 순서대로 fetch. 계수는 `node scripts/audit-vocabulary-reach.mjs`(step-2 산출).

## 1. fetch 체인 (실제 응답 확인)

| # | 단계 | 대상 | 응답 확인 | 다음 지시 | 용어 사전 등장? |
|---|---|---|---|---|---|
| 1 | 스킬 진입 | `~/projects/custom-skills/promoted/askewly-design/SKILL.md` (로컬) | `# /askewly-design — 디자인 작업 진입 라우터` | llms.txt → entry-protocol | **아니오** |
| 2 | 인덱스 | `https://ui.askewly.com/llms.txt` | `# Askewly Design` | entry-protocol이 첫 항목 | **아니오** (§2 참조) |
| 3 | 프로토콜 | `https://ui.askewly.com/llms/docs/design-system/entry-protocol.md` | `# Agent Entry Protocol` | Always 0~5 + 태스크 분기 A/B/C | **아니오** (§3 참조) |
| 4a | 태스크 A(새 화면) | `pattern-taxonomy.md` → 레시피 | 프로토콜 A-1: "locate the surface" | 레시피 fetch | **아니오** |
| 4b | 태스크 B(개선) | `anti-patterns.md` → 레시피 | 프로토콜 B-1 | 레시피 diff | **아니오** |
| 4c | 태스크 C(단일 컴포넌트) | "Fetch the matching recipe if one exists" | 프로토콜 C-1 | 레시피 or 즉흥 | **아니오** |
| 5 | 레시피 | 예: `llms/recipes/commerce/cart-drawer.md` | `term_refs: [cart-summary, cart-summary-bar, quantity-stepper]` | — | **이름만 등장, 해소 불가** (§4) |

**결론: 호출부터 구현까지 5단계 어디에서도 용어 사전 본문에 도달하지 못한다.**

## 2. llms.txt — 배포된 섹션 전수

배포본에서 확인한 섹션 8개: `Entry Protocol` · `Principles` · `Tokens` · `Taxonomy` · `Contracts` · `Knowledge` · `Recipes` · `Code Assets`.

용어 데이터를 담은 섹션은 **없다**. `Taxonomy` 섹션에 실린 유일한 용어 관련 자산은 그룹 축이다:

```
[docs/ui-vocabulary/groups.yml](https://ui.askewly.com/llms/docs/ui-vocabulary/groups.yml): Group axis data (57 groups) referenced by every vocabulary term
```

설명문이 "referenced by every vocabulary term"이라고 말하는데, **참조하는 쪽인 term 자체가 배포되어 있지 않다.** 그룹 이름 57개만 있고 그 그룹에 무엇이 들어있는지 알 방법이 없다.

원본 파일 직접 접근도 불가 — `https://ui.askewly.com/llms/docs/ui-vocabulary/terms.yml` → **HTTP 404**.

## 3. entry-protocol — 용어 언급 0회

배포본 전문에서 `term` / `vocabulary` / `dictionary` 검색 결과 **일치 0건**.

프로토콜의 Always 단계는 0(URL 규율) · 0.5(브리프) · 1(토큰) · 1.5(코드 자산) · 2(안티패턴) · 3(자가 판정) · 4(검증) · 5(사람 확인)이고, 태스크 분기는 A(분류→레시피) · B(안티패턴→레시피) · C(레시피 있으면 fetch)다. **어휘를 조회하는 단계도, 요소를 결정하는 단계도 없다.**

특히 C의 첫 줄이 `Fetch the matching recipe if one exists` — "없으면 어떻게 하는가"가 프로토콜에 없다. 레시피 45개 밖의 요소는 경로가 끊긴다.

## 4. 끊긴 참조 — 배포된 계약 안의 죽은 이름

배포본 레시피에서 확인:

```
term_refs: [cart-summary, cart-summary-bar, quantity-stepper]
```

같은 문서 어디에도 이 이름들을 정의로 연결하는 URL·경로가 **없다**. 에이전트는 세 이름을 읽고 그게 무엇인지 알 방법 없이 지나간다. 배포된 계약 안에 해소 불가능한 이름이 들어 있는 상태다.

## 5. 컨텍스트 비용

| 자산 | 크기 |
|---|---|
| `terms.yml`(미배포 원본) | 680,558 B |
| 배포된 `llms.txt` | 약 20 KB (링크 인덱스) |

용어 사전을 배포한다면 **통짜로 걸 수 없다.** 680KB를 fetch하면 컨텍스트의 상당량을 사전으로 채우고 정작 구현할 여력을 잃는다 — VL2의 샤딩 설계가 여기서 나온다.

## 6. 판정

| 항목 | 관측 |
|---|---|
| 호출 경로에 용어 사전이 등장하는 단계 | **0 / 5** |
| llms.txt의 용어 데이터 섹션 | **없음** (그룹 축만) |
| entry-protocol의 용어 언급 | **0회** |
| 배포본에서 `terms.yml` 접근 | **404** |
| 레시피 `term_refs` 해소 경로 | **없음** |
| 요소가 미정일 때의 결정 단계 | **없음** |
| 레시피가 없을 때의 폴백 경로 | **없음** (C-1이 "있으면"에서 끝남) |

**미확인 항목**: 없음 — 5단계 전부 실제 응답으로 확인했다.

## 7. 후속 milestone으로 흘리는 것

- VL2 ← §2(섹션 부재), §5(통짜 배포 불가)
- VL3 ← §4(끊긴 참조), §3(레시피 없을 때 경로 없음)
- VL6 ← §3(용어 조회·요소 결정 단계 부재, C-1의 열린 끝)
