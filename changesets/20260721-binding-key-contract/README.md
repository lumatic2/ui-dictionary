# 219 — binding-key-contract

- 날짜: 2026-07-21
- milestone: ECT4 (`plans/2026-07-21-ect4-image-node-and-contract.md`) step-1
- horizon: editor-color-and-token-editing

## 이 step이 왜 조건인가

plan은 "허용 키의 정본을 하나로 만든다. 단일 출처가 어려우면 대조 게이트를 최소한으로 둔다"였다.
**단일 출처로 갔다** — 이 horizon이 "규칙이 흩어져서 한 곳만 막힌다"에 **네 번** 당했기 때문이다:

| # | 막은 곳 | 뚫린 곳 |
|---|---|---|
| 1 | `set-node-property` | `update-node.patch.tokenBindings` |
| 2 | 위 + `update-node` | `create-node` |
| 3 | Esc·화살표·Enter | Tab-out |
| 4 | `detach-token-binding` | `update-node.patch`·`create-node` (literalColors) |

같은 키 목록이 **네 군데** 따로 살고 있었다:
`template-core`의 `EXPECTED_KIND` · `CanvasSurface.nodeStyle` 하드코딩 ·
같은 파일 미해결 검사 배열 · 인스펙터 `COLOR_BINDING_LABELS`.

## 정본을 canvas-core에 둔 이유

`tokenBindings`가 거기 정의된 개념이고, `template-core`·앱이 **모두 canvas-core에 의존한다**
(반대 방향 의존은 없다). 의존 방향이 자리를 정했다.

```
canvas-core: TOKEN_BINDING_KINDS  ←  template-core EXPECTED_KIND
                                  ←  CanvasSurface 미해결 검사
                                  ←  인스펙터 bindableColorKeys
```

## 대조 게이트 두 겹

정본만 두면 "안 따르는 곳"이 생겨도 모른다. 어긋남을 **드러내는** 장치를 함께 뒀다:

1. **계약 테스트** — 색 키가 정본에서 유도됐는지, kind가 실제로 `color`인지 대조.
2. **개발 모드 예외** — 정본에 색 키가 늘었는데 사용자 언어 라벨이 없으면 인스펙터가
   **즉시 던진다.** 라벨 없이 나가면 내부 키 이름이 화면에 뜬다 — `Token · fill`이
   EU5에서 정확히 그 형태였다.

## Verification

| 항목 | 결과 |
|---|---|
| 색 키가 정본에서 유도됨(kind=color만) | PASS |
| `fontFamily`는 색 목록에 없음 | PASS |
| 정본이 비어 있지 않음(필터가 전부 걸러내면 UI가 사라진다) | PASS |
| template-core가 자기 목록을 갖지 않음 | PASS |
| **Failure probe** — 정본에 `stroke: 'color'` 추가 → 계약 테스트 1건 실패 **+ 인스펙터가 "색 키에 사용자 언어 라벨이 없다: stroke" 예외** | PASS |
| canvas-core 108 / template-core / agent-design 197 | PASS |
| `npm run typecheck` / `npm run verify` | exit 0 / exit 0 |

## 변경 파일

- `packages/canvas-core/src/properties.ts` — `TOKEN_BINDING_KINDS`·`COLOR_BINDING_KEYS` 정본
- `packages/canvas-core/src/tokenBindingContract.test.ts` — 신설, 계약 3건
- `packages/template-core/src/tokens.ts` — `EXPECTED_KIND`가 정본을 그대로 참조
- `packages/template-core/src/tokenContract.test.ts` — 신설, 2건
- `apps/agent-design/src/CanvasSurface.tsx` — 미해결 검사가 정본에서 키를 얻음
- `apps/agent-design/src/PropertyInspector.tsx` — `bindableColorKeys`가 정본으로 필터, 라벨 누락 개발 가드
