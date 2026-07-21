# 221 — inspector-one-language

- 날짜: 2026-07-21
- milestone: ECT4 후속 — 이월 finding 마감
- horizon: editor-color-and-token-editing

## 무엇을 왜

ECT2에서 색 라벨만 한국어로 옮겼더니 인스펙터가 **한영 반반**이 됐다:
`Properties`·`Token mode`·`Name`·`Layout`·`Gap`·`Padding`·`Revision`·`Nodes`·`Selection`,
셀렉트 옵션 `vertical`·`fixed`·`hug`·`fill`, 불리언 `True`/`False`.

EU5가 드러낸 것과 **같은 종류**다 — 사용자가 읽어야 할 자리에 내부·영어 용어.
`Token · fill`이 정확히 그 형태였고, 색만 고치는 바람에 혼재가 더 눈에 띄었다.
세 번 보고했고 사용자 지시("남은 이슈 해결해")로 마감한다.

## 내부 값은 그대로 둔다

`vertical`·`fixed`는 **문서 모델의 값**이다. 사람이 읽는 자리만 바꾼다:

```
<option value="vertical">세로로 쌓기</option>
```

표시와 값이 갈라져 있음을 테스트가 못박는다 — 값까지 한글로 바꾸면 문서가 깨진다.

## 스크린리더 문자열도 사용자 언어다

`aria-label="Search layers"` 같은 것도 사람이 읽는 자리다. 눈으로 안 보인다고 영어로
두면 스크린리더 사용자에게만 다른 언어가 나간다.

## 게이트

다시 섞이지 않게 **금지어 목록**을 테스트로 고정했다. 라벨 하나를 영어로 되돌리는
probe에 2건이 문다.

## 함께 마감한 이월 finding

**생성기가 같은 집합을 두 방식으로 표현하던 것**(ECT1 finding 1):
`SEMANTIC_COLOR_MAPPINGS` 19줄 손 나열 + `walkLeaves` 순회. SSOT에 토큰이 늘면
한쪽만 따라가고 다른 쪽이 뒤처진다. 순회로 일원화했고 **생성물은 완전히 동일**하다(diff 0).
고아가 된 옛 배열은 제거했다.

## 변경 파일

- `packages/canvas-core/src/properties.ts` — 필드 라벨 한글화
- `apps/agent-design/src/PropertyInspector.tsx` — 화면 문자열·셀렉트 표시명
- `apps/agent-design/src/LayersPanel.tsx`, `InsertPalette.tsx` — aria-label
- `apps/agent-design/src/PropertyInspector.test.tsx` — 언어 일관성 4건 + 기존 라벨 계약 갱신
- `apps/agent-design/scripts/generate-editor-tokens.mjs` — CSS 변수 목록을 SSOT 순회로 유도

## Verification

| 항목 | 결과 |
|---|---|
| 화면 텍스트에 영어 라벨 0건(금지어 9종) | PASS |
| 사람이 읽는 자리가 한국어(8종 확인) | PASS |
| 셀렉트 표시는 한국어, `value`는 내부 값 | PASS |
| 영문만으로 된 `aria-label` 0건 | PASS |
| 생성물 diff 0 (순회 == 손 나열) | PASS |
| **Failure probe** — 라벨 하나 영어로 되돌림 → 2건 실패 | PASS |
| canvas-core 108 / template-core 197 / agent-design 204 | PASS |
| `npm run typecheck` / `npm run verify` | exit 0 / exit 0 |

## 남는 것

`InsertPalette`의 컴포넌트 이름(`Layout` 등)은 **레지스트리 자산의 고유명**이라 번역하지 않는다.
`Node 0`·`Component 1` 같은 fixture 이름도 데이터이지 UI 문자열이 아니다.
