# changeset: 인스펙터 선택 종류별 노출

- Date: 2026-07-21
- Plan: EU4 step 3 (`plans/2026-07-21-eu4-inspector-ia.md`)
- 증거: `evidence/editor-legibility/eu4-inspector.md`

## 무엇을 바꿨나

- **선택 없음 / 다중 / 단일이 다른 말을 한다.** 전에는 셋을 하나로 뭉쳐 3개를 골라도
  "Select one node"가 떠서 *아무것도 안 골랐다*는 뜻으로 읽혔다.
- 종류별 노출을 테스트로 고정: code-component만 Prop·Variant, instance만 Override,
  **기하는 전 종류 공통**(무엇을 고르든 어디에 얼마나 큰지는 읽혀야 한다).

## 스크린샷이 잡은 결함

기하 섹션의 `너비·높이`(숫자) 바로 아래 구조 섹션에 `Width·Height`가 있었는데,
**그건 크기가 아니라 크기를 정하는 방식**(`fixed|hug|fill`)이다. 같은 이름이 두 개면 둘 다 안 읽힌다.
`가로 사이징`·`세로 사이징`으로 바꿨다. 테스트는 전부 초록이었고 **눈으로 보고 알았다.**

## Verification

- [x] agent-design 142 PASS · canvas-core 73 PASS · template-core 311 PASS · `tsc -b` · `npm run verify` PASS
- [x] 브라우저: X에 512 → 캔버스 `left:512px`·revision 1, 각도 30 → `rotate(30deg)`·revision 2

### Failure probe

| 되돌린 것 | 결과 |
|---|---|
| `propertyFieldsForNode`의 kind 조건 제거 | 종류별 노출 테스트 실패 + 비컴포넌트 노드 크래시 |

## 검증 방법 메모

합성 `new Event('blur')`로는 React 핸들러가 안 돈다(React는 `focusout` 위임). 그걸로 "안 된다"를
결론낼 뻔했고, Playwright 실제 타이핑으로 정상임을 확인했다. 합성 이벤트의 음성 결과는 증거가 아니다.
