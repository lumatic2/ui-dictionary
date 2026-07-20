# 218 — literal-color-gate

- 날짜: 2026-07-21
- milestone: ECT3 — **독립 검증 refuted 후속**
- horizon: editor-color-and-token-editing

## 같은 실패를 네 번째로 했다

독립 검증이 refuted했다. `detach-token-binding` **하나에만** 검사를 두었더니
`update-node.patch`와 `create-node`가 `literalColors`를 검사 없이 통과시켰다.

**ECT1에서 토큰 바인딩으로 똑같이 당한 실패다.** 그때 배운 처방(길목 하나에서 델타로 검사)을
바로 옆에 두고도, **새 필드를 만들면서 적용하지 않았다.** 이 horizon에서 네 번째 반복이다:

| # | 막은 곳 | 뚫린 곳 |
|---|---|---|
| 1 | `set-node-property` | `update-node.patch.tokenBindings` |
| 2 | 위 + `update-node` | `create-node` |
| 3 | Esc·화살표·Enter | Tab-out |
| **4** | **`detach-token-binding`** | **`update-node.patch` · `create-node` (literalColors)** |

## 무엇이 저장됐었나

검증자가 실제로 통과시킨 값: `javascript:alert(1)`, `url(evil)`, `#zzz`,
`expression(alert(1))`, 10만 자 문자열.

**스크립트로 실행되지는 않는다** — React가 `el.style.background = value` (CSSOM 속성 대입)를
쓰므로 파싱 실패 값은 브라우저가 조용히 버린다. 하지만 **문서에는 저장되고 화면은 옛 색
그대로 남는다.** 문서와 화면이 어긋난 채 undo 이력에까지 들어간다 —
"그 상태가 화면에 보인다"는 ECT3 DoD가 이 값들에 대해 거짓이었다.

## 수정 — 길목 하나

`assertLiteralColorDelta`를 `assertTokenBindingDelta` **바로 옆**에 둔다. 같은 자리, 같은 이유,
같은 델타 규칙(손대지 않은 기존 값은 통과 — 옛 문서를 소급 무효화하지 않는다).

두 가지를 본다:
1. **색 형식** — `#RGB[A]`/`#RRGGBB[AA]` 또는 색 함수(rgb·hsl·oklch…)의 괄호 안이 숫자·단위·구분자뿐. 길이 상한 64자.
2. **상호배타** — 한 키에 바인딩과 리터럴이 동시에 살 수 없다(검증자 지적: 그 상태가 되면 리터럴이 화면에 안 보이는 죽은 값이 된다).

UI도 커밋 전에 막고 **사유를 `role="alert"`로 낸다** — 조용히 안 먹으면 사용자는 먹은 줄 안다.

## 변경 파일

- `packages/canvas-core/src/properties.ts` — `validateLiteralColor`
- `packages/canvas-core/src/operations.ts` — `assertLiteralColorDelta`를 길목에 배선, detach의 얇은 검사 승격
- `packages/canvas-core/src/properties.test.ts` — 경로 무관 검증 6건
- `apps/agent-design/src/PropertyInspector.tsx` — 커밋 전 검증 + 사유 표시
- `apps/agent-design/src/PropertyInspector.test.tsx` — UI 거부 1건

## Verification

| 항목 | 결과 |
|---|---|
| 검증자가 뚫은 값 6종 전부 형식 검사에서 걸림 | PASS |
| 실제 토큰 해석 형태(hex·oklch·rgb·hsl)는 통과 | PASS |
| `detach` 경로 거부 | PASS |
| **`update-node.patch` 경로 거부** | PASS |
| **`create-node` 경로 거부** (노드 생성 안 됨) | PASS |
| **바인딩·리터럴 동시 존재 거부** | PASS |
| 손대지 않은 기존 리터럴은 다른 연산을 안 막음(델타) | PASS |
| UI가 커밋 전에 막고 사유 표시, 입력은 원값 복귀 | PASS |
| **Failure probe** — 길목 2줄 제거 → 3건 실패 | PASS |
| canvas-core 105 / agent-design 197 / typecheck 0 / verify 0 | PASS |

## 남은 위험 (검증자 near-miss, 미해소)

오늘 렌더 경로는 안전하지만, 색 적용이 `<style>` 블록 문자열 보간·`cssText`·
`dangerouslySetInnerHTML`로 바뀌면 이 필드가 실제 CSS 주입 벡터가 된다.
지금은 형식 검증이 그것도 함께 막지만, 렌더 경로를 바꾸는 사람이 이 사실을 알아야 한다.
