# changeset: VL3 step-1 — 용어·자산 3자 매핑

- Date: 2026-07-21
- Plan: VL3 step-1 (`plans/2026-07-21-vl3-reference-repair.md`)

## 무엇을 했나

`scripts/generate-term-asset-map.mjs` + 생성물 `docs/ui-vocabulary/term-asset-map.json`.
용어별로 "무엇으로 만들 수 있나"에 답한다 — 레시피가 있나, 코드 자산이 있나, 아무것도 없나.

**매핑은 파생물이다.** 세 원본(terms.yml · 레시피 term_refs · registry.json)이 각자 갱신되므로
손으로 관리하는 네 번째 목록을 두면 반드시 드리프트한다.

## 계수

| | |
|---|---|
| 용어 | 562 |
| 레시피가 있는 용어 | 81 (14.4%) |
| 코드 자산까지 있는 용어 | 52 |
| **아무 자산도 없는 용어** | **481** ← 폴백 규약 대상 |

## 검증

- 항목 수 = 562 정확히 일치
- **양방향 일치**: 레시피→용어 집합과 용어→레시피 집합이 완전히 같음(불일치 0)
- **failure probe**: 없는 용어를 가리키는 `term_refs`를 고의 주입 → `용어 원본에 없는 term_refs 1건` exit 1.
  조용히 빈 값으로 넘어가면 매핑이 거짓말을 하게 된다

## 판정

complete.
