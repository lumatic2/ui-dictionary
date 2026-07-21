# 206 — token-enumeration

- 날짜: 2026-07-21
- milestone: ECT1 (`plans/2026-07-21-ect1-token-lookup-and-validation.md`) step-1
- horizon: editor-color-and-token-editing

## 무엇을 왜

EU5에서 사용자가 색을 못 바꾼 이유는 **데이터가 없어서가 아니라 UI가 안 물어봐서**였다.
물어볼 API 자체가 없었다 — `documentTokens()`는 `resolve(binding)`(이름→값)뿐이고
세트 안에 어떤 이름이 있는지 열거하는 경로가 없었다.

`DocumentTokens.listTokens()`를 신설했다. 각 항목은 `{ name, kind, value }`이고,
세트 원본 객체를 그대로 읽는다 — 별도 목록을 두면 그 둘이 갈라진다.

## 실측이 계획을 반증한 것

계획은 "두 어휘의 이름 교차 0건"을 검증 조건으로 적었다. **틀렸다.**
`text.muted`·`text.secondary`가 **양쪽에 다 있고** 값만 다르다.

기존 코드 주석이 "두 어휘는 겹치지 않는다"고 단언하고 있었는데 사실이 아니었다(`documentTokens.ts:12`).
격리는 실재하지만 **이름이 아니라 출처로** 이뤄진다 — 문서는 자기 세트에서만 값을 얻는다.
주석을 사실로 고치고, 검증을 "상대 어휘 고유 이름 0건 + 겹치는 이름은 값이 갈린다"로 바꿨다.

## 편집기 토큰의 `kind`는 아직 `null`이다

편집기 어휘는 생성물이 평면 `Record<string,string>`이라 종류를 싣고 오지 않는다.
여기서 `'color'`로 단정하면 나중에 글꼴 토큰 하나가 들어오는 순간 조용히 틀린다 —
화면이 그걸 색 목록에 태연히 올린다. **모르는 건 모른다고 말한다.** step-2에서 생성기가 SSOT로부터 채운다.

## 변경 파일

- `apps/agent-design/src/documentTokens.ts` — `TokenEntry` 타입, `listTokens()` 3분기(template/editor/unknown), 사실과 다른 주석 정정
- `apps/agent-design/src/documentTokens.test.ts` — 열거 테스트 6건 추가

## Verification

| 항목 | 결과 |
|---|---|
| 템플릿 열거 = 세트 원본 객체 (이름·값·kind) | PASS |
| 편집기 열거 = 원본 맵 (이름·값) | PASS |
| 편집기 `kind`는 전부 `null` (단정 금지) | PASS |
| 상대 어휘 고유 이름 0건 — 양방향 | PASS |
| 겹치는 이름(`text.muted`·`text.secondary`)은 값이 갈린다 | PASS |
| unknown 세트는 빈 목록 | PASS |
| 열거가 하드코딩이 아님 (세트에 추가 → 목록에 반영) | PASS |
| **Failure probe** — 열거를 두 어휘 합집합으로 오염 → 테스트 2건 실패, 원복 시 16건 통과 | PASS |
| `npm test` (apps/agent-design) | 149 passed / 14 files |
| `npm run typecheck` | exit 0 |
| `npm run verify` (레포) | exit 0 |
