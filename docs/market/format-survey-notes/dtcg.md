# 조사 노트 — W3C DTCG 토큰 포맷

> SMC0 시장 포맷 조사. 수집: 2026-07-07, sonnet 리서치 에이전트. 원문 그대로 보존 (게이트 검증 완료).

## 0. 버전 확인 필요 사항 (중요)

- **안정 버전(Stable)**: `Design Tokens Format Module` **2025.10** — 2025년 10월 28일 공식 발표. "years of collaborative development" 이후 첫 stable 릴리스.
- **현재 draft(진행 중)**: `https://www.designtokens.org/tr/drafts/format/` — 2026년 6월 17일 자 preview draft. 문서 자체가 "Do not attempt to implement this version" 명시.

아래 상세 구조는 주로 draft 문서 기반이며, stable 2025.10과 세부 항목(특히 `color` 타입의 `hex`/`colorSpace`/`components` 구조)이 동일한지는 **미확인**. 구현 전 stable 2025.10 원문 대조 필요.

## 1. 포맷 개요

- 파일 형식: JSON. MIME `application/design-tokens+json`, 확장자 `.tokens` / `.tokens.json`.
- 예약 키(`$` 접두어): `$value`(필수), `$type`, `$description`, `$extensions`(reverse domain notation), `$deprecated`.
- 토큰 이름은 `$` 시작·`{`·`}`·`.` 포함 금지.

## 2. 토큰 타입 & alias 문법

타입: color, dimension({value, unit}), fontFamily, fontWeight, duration, cubicBezier, number, strokeStyle, border(composite), transition(composite), shadow(composite), gradient(composite), typography(composite). font style/percentage/asset 타입은 "to be documented".

Alias 두 가지:
1. 중괄호 문법 `{group.token}` — `$value` 전체 참조.
2. JSON Pointer `$ref` (RFC 6901) — composite 내부 sub-property 참조.

체이닝 지원, 순환 참조는 스펙상 에러.

## 3. 계층(tier) 표현

- Group = `$value` 없는 JSON 객체. `$type` 하위 상속, `$extends`(deep-merge) 지원.
- **3-tier 전용 스키마 키는 스펙에 없음** — tier 구분은 group 네이밍 컨벤션 + alias 참조 체인으로 구현자가 설계. tier 강제 규칙(component는 semantic만 참조)은 자체 lint 필요.

## 4. 생태계 채택

- Reference implementation: Style Dictionary, Tokens Studio, Terrazzo.
- 지원/구현 중: Penpot, Figma, Sketch, Framer, Knapsack, Supernova, zeroheight 등 10+.
- 기여 조직: Adobe, Amazon, Google, Microsoft, Meta, Shopify, Disney 등 — 벤더 중립 거버넌스.
- Figma Variables의 DTCG 1:1 export 정확도는 **미확인**.

## 5. 성숙도 & 한계

- 2025.10 첫 stable, 이후 draft 계속 진행 — living standard. W3C Recommendation이 아니라 **Community Group Report**.
- 미결: JSON Schema 추가 여부, 파일 크기, font family 표현, stroke/border/transition sub-value 구조.

## 6. Askewly Design 채택 관점

장점: ① 도구 상호운용성(Figma/Tokens Studio/Style Dictionary 파이프라인) ② `$type`+alias가 3-tier 참조 체인과 구조적으로 일치 ③ 벤더 중립 거버넌스.

리스크: ① 스펙이 살아있는 draft — 세부 스키마 고정 시 재작업 위험 ② 3-tier가 1급 시민이 아님 — tier 강제는 자체 lint 구현 필요 ③ 도구별 구현 성숙도 편차(미검증).

## 7. 출처

- https://www.designtokens.org/tr/drafts/format/ (2026-06-17 draft)
- https://www.w3.org/community/design-tokens/2025/10/28/design-tokens-specification-reaches-first-stable-version/
- https://github.com/design-tokens/community-group
- https://docs.tokens.studio/manage-settings/token-format
