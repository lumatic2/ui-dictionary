# 217 — raw-color-and-rebind

- 날짜: 2026-07-21
- milestone: ECT3 step-3 — **ECT3 완료**
- horizon: editor-color-and-token-editing

## 무엇을 왜

벗어난 색을 고치고 다시 묶는다. 왕복 전체를 연산 시퀀스로 고정한다.

## step-2에서 내가 만든 문제를 고쳤다

원시값 입력이 `onChange`마다 연산을 냈다 — **글자마다 undo 항목이 생기고**
중간 상태(`#12`)가 문서에 실제로 저장된다. 다른 입력들과 같은 규약(blur·Enter 커밋)으로 바꿨다.
probe로 되돌리면 3건이 문다.

## 왕복 게이트

```
none → token:surface.muted → literal:#111111 → literal:#222222 → token:surface.base
```
지나온 상태를 배열로 쌓고 **undo로 역순 대조, redo로 정순 대조**한다. 한 단계라도 어긋나면
실패한다. 브라우저에서도 같은 왕복을 돌려 원시값이 실제로 칠해지는 것을 확인했다.

추가로 **"두 출처가 동시에 살아 있는 순간이 없다"**를 왕복 전 구간에서 확인한다.

## 변경 파일

- `apps/agent-design/src/PropertyInspector.tsx` — 원시값 draft 커밋 규약
- `packages/canvas-core/src/properties.test.ts` — 5단계 왕복·동시성·옛 문서 호환 3건
- `apps/agent-design/src/PropertyInspector.test.tsx` — 원시값 편집·재바인딩 6건
- `evidence/editor-color-and-token-editing/ect3-bind-detach.md` — ECT3 증거

## Verification

| 항목 | 결과 |
|---|---|
| 5단계 왕복 + undo 역순 + redo 정순 정확 대조 | PASS |
| 왕복 중 두 출처가 동시에 사는 순간 없음 | PASS |
| `literalColors` 없는 옛 문서가 그대로 열리고 detach됨 | PASS |
| 타이핑 중 연산 0개 | PASS |
| Enter로 커밋, 빈 값·같은 값은 커밋 안 함 | PASS |
| 견본을 눌러 재바인딩 | PASS |
| 벗어난 견본은 형태가 다름 | PASS |
| **브라우저 왕복** — `token → literal → literal(#ff8800) → token`, 원시값이 캔버스에 `rgb(255,136,0)`으로 칠해짐, 되감기 3회로 revision 0 복귀 | PASS |
| **detach 계측** — 저장 자산 내 `literalColors` **0건** (프리모템 2 감시) | PASS |
| **Failure probe** — 즉시 커밋 3건 / 두 출처 공존 2건 실패 | PASS |
| canvas-core 99 / agent-design 196 / typecheck 0 / verify 0 | PASS |
