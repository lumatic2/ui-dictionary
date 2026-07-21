# 208 — token-existence-validation

- 날짜: 2026-07-21
- milestone: ECT1 (`plans/2026-07-21-ect1-token-lookup-and-validation.md`) step-3
- horizon: editor-color-and-token-editing

## 무엇을 왜

EU5 evidence는 "오타는 조용히 거부된다"고 적었다. **반대였다.**
`validateNodePropertyEdit`의 token 분기는 `x.y` 모양만 봤고 없는 토큰도 저장됐다.
결함은 렌더 시점 `data-token-unresolved`로만 남고 화면은 아무 말도 하지 않았다.

이제 저장 시점에 거부하고, 사유가 `role="alert"`로 사용자에게 그대로 나간다.

## 계층 결정 — canvas-core는 어휘를 모른다

`canvas-core`는 런타임 의존이 0이고 어휘(편집기/템플릿)를 알아선 안 된다.
그래서 어휘를 아는 앱이 조회 함수를 등록한다(`registerTokenVocabulary`).

등록 전에는 모양 검사만 한다 — 이건 "통과"가 아니라 **"이 계층은 답할 수 없다"**이고,
등록하는 쪽이 그 구멍을 닫는다.

## 등록 자체를 테스트로 고정했다

canvas-core 테스트는 가짜 어휘를 손으로 등록해 통과한다. 그건 검증 로직이 도는지만 보고
**앱이 진짜 어휘를 실제로 건네는지**는 못 본다. 등록을 빠뜨리면 canvas-core 테스트가 전부
초록인 채 편집기에만 구멍이 남는다 — EU5가 정확히 그런 종류의 결함이었다.
`App` 모듈을 들이면 검증이 켜지는 것을 앱 쪽 테스트가 관측한다.

## 변경 파일

- `packages/canvas-core/src/properties.ts` — `TokenVocabularyLookup`·`registerTokenVocabulary`, token 분기에 실재검사
- `packages/canvas-core/src/properties.test.ts` — 실재 검증 7건(등록 전/후·저장 경로·소급 무효화 금지·모르는 세트)
- `apps/agent-design/src/documentTokens.ts` — `documentTokenExists`
- `apps/agent-design/src/App.tsx` — 모듈 최상위 등록
- `apps/agent-design/src/documentTokens.test.ts` — 배선 테스트 2건
- `plans/horizons/2026-07-editor-color-and-token-editing.md` — 닫는 기준 3 관측 방법 정정
- `evidence/editor-color-and-token-editing/ect1-lookup.md` — ECT1 증거

## Verification

| 항목 | 결과 |
|---|---|
| 등록 전 = 모양 검사만 (답할 수 없음) | PASS |
| 등록 후 없는 토큰 거부 + 사용자 언어 사유 | PASS |
| 실재하는 토큰은 그대로 저장 | PASS |
| `applyOperation` 저장 경로도 차단, 문서 미변경 | PASS |
| 모양 틀린 값은 어휘와 무관하게 거부 | PASS |
| 미해결 바인딩이 든 기존 문서는 그대로 열림 (소급 무효화 없음) | PASS |
| 모르는 세트에서는 아무 토큰도 실재하지 않음 | PASS |
| 배선 — `App` 들이면 검증이 켜짐 | PASS |
| **Failure probe** — 등록 한 줄 주석 처리 → 배선 테스트 실패 | PASS |
| canvas-core `vitest run` | 80 passed / 10 files |
| `npm test` (apps/agent-design) | 152 passed / 14 files |
| `npm run typecheck` / `npm run verify` | exit 0 / exit 0 |

## finding

- 어휘 등록은 앱 경로에만 걸려 있다 — `App`을 안 들이는 경로(에이전트/브리지)는 여전히 모양 검사만 한다.
- 검증 사유 문자열이 이 함수에서만 한국어다(주변은 영어). 사용자용·개발자용 문자열이 한 함수에서 섞여 나온다 — ECT2의 사용자 언어 라벨 작업과 함께 볼 것.
