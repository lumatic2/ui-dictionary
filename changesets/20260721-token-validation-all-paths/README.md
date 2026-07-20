# 209 — token-validation-all-paths

- 날짜: 2026-07-21
- milestone: ECT1 — **독립 검증 refuted 후속 수정**
- horizon: editor-color-and-token-editing

## 왜 이게 생겼나

ECT1 완료 주장에 대해 독립 검증자가 **refuted**를 냈다. 주장은
"실재하지 않는 토큰은 저장되지 않는다"였는데, 실제로는 **한 경로만** 막혀 있었다.

- 막힌 경로: `set-node-property`(scope `token`) — 인스펙터가 쓰는 길
- **뚫린 경로**: `update-node`의 `patch.tokenBindings` — `Object.assign`으로 검사 0 통과

검증자는 이걸 말로 지적하지 않고 **재현 테스트를 써서 실제로 뚫었다.**
`applyOperation(doc, { type: 'update-node', patch: { tokenBindings: { background: 'totally.fake.token' } } })`가
성공했고 가짜 토큰이 문서에 박혔다.

**그리고 하필 그쪽이 라이브 브리지로 에이전트가 문서를 고치는 표면이다**(`liveBridge.ts`) —
ECT1이 닫겠다고 선언한 바로 그 위협 모델이다. "오늘 UI가 그 경로를 안 쓴다"는 변명이 되지 않는다.

## 무엇을 고쳤나

규칙을 `validateTokenBinding(tokenSetId, value)` **하나로 모으고** 두 경로가 그걸 쓴다.
경로마다 규칙을 따로 두면 한 경로만 막힌다 — 방금 그게 실제로 일어났다.

ECT4의 "허용 키 정본은 하나"와 같은 병리이고, 같은 처방이다.

## 변경 파일

- `packages/canvas-core/src/properties.ts` — `validateTokenBinding` 추출, `validateNodePropertyEdit`이 그걸 호출
- `packages/canvas-core/src/operations.ts` — `update-node` 케이스가 `patch.tokenBindings`를 같은 규칙으로 검사
- `packages/canvas-core/src/properties.test.ts` — 경로 무관 검증 5건

## Verification

| 항목 | 결과 |
|---|---|
| `update-node` patch로 없는 토큰 → 거부, 문서 미변경 | PASS |
| `update-node` patch로 모양 틀린 값 → 거부 | PASS |
| 실재하는 토큰은 `update-node`로도 저장됨 | PASS |
| 토큰 없는 patch(이름·bounds)는 영향 없음 | PASS |
| 두 경로가 **같은 사유 문자열** 반환 (규칙이 하나라는 증거) | PASS |
| **Failure probe** — 새 검사 제거 → 테스트 3건 실패, 원복 시 16건 통과 | PASS |
| canvas-core `vitest run` | 85 passed / 10 files (기존 80 + 5) |
| `npm test` (apps/agent-design) | 152 passed |
| `npm run typecheck` / `npm run verify` | exit 0 / exit 0 |

## 남은 위험 (검증자 near-miss, 미해소)

`registerTokenVocabulary` 미등록 시 모양 검사로 조용히 강등된다. `App.tsx`의 최상위 등록이
제거·조건부화되면 canvas-core 테스트는 전부 초록인 채 실제 앱만 뚫린다 —
`documentTokens.test.ts`의 배선 테스트 하나만이 그걸 잡는다. **단일 방어선이다.**
지금은 그 테스트로 버티되, 등록을 강제하는 구조(미등록 시 명시적 실패 등)는 결정 사안으로 남긴다.
