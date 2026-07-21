# 최종 보고서 — ECT3 묶고 푼다

> 완료: 2026-07-21 · 대상: ECT3 · 작성: 완료 경계(§B3)
> 배치: `archive/reports/2026-07-21-ect3-bind-and-detach.md` (record — 작성 후 동결)

## 1. 문제 정의

EU5에서 사용자가 막힌 지점이 여기다. 색이 안 묶인 노드의 시각 섹션은 "이 노드에 묶인
토큰이 없다"는 **막다른 안내문**만 띄웠고, 그 노드에서 색을 바꿀 방법이 없었다.

리서치가 본 다섯 시스템(Figma·Penpot·Framer·Webflow·Tokens Studio)은 **전부** 미바인딩
상태에서 새로 묶는 어포던스를 갖는다. 5 대 0은 취향 차이가 아니라 결손이다.

## 2. Objective 연결

"사람이 코드 네이티브 캔버스에서 실제 컴포넌트를 조작한다"는 축. ECT2가 이미 묶인 색을
바꾸게 했다면 ECT3은 **색이 없던 곳에 색을 만들고, 토큰 밖으로 나갔다 돌아오는** 경로를 열었다.

## 3. 경로

계획한 3 step(묶기 → 풀기 → 왕복)을 밟았고 검증 후속 1건이 붙어 4 changeset이 됐다.

**계획이 한 번 수정됐다.** plan은 "원시 색은 기존 리터럴 자리 우선"이었으나 실사 결과
리터럴 색 자리가 `ShapeNode.fill` 하나뿐이라 frame·text는 둘 곳이 없었다. plan이 남겨둔
"안 될 때만 새 필드" 조건이 성립해 `literalColors`를 신설했다.

## 4. 구현 결과

색이 없던 요소에 색을 묶을 수 있다. 묶인 색을 풀어 원시 색으로 벗어날 수 있고, 벗어난
상태가 화면에 세 겹으로 보인다 — 견본이 원형으로 바뀌고, 토큰 이름 대신 원시값이 뜨고,
"토큰에서 벗어난 색이다"라고 글자로 적힌다. 다시 묶을 수도 있고 전 구간이 undo로 되돌아온다.

**detach 순간 색이 변하지 않는다.** 푸는 것이지 바꾸는 게 아니다 — 브라우저에서 확인했다.

## 5. 이슈와 해결

**같은 실패를 네 번째로 했다. 이게 이 milestone의 가장 중요한 기록이다.**

독립 검증이 refuted했다: `literalColors` 검증을 `detach-token-binding` **연산 하나에만**
두어서 `update-node.patch`와 `create-node`가 검사 없이 통과했다. `javascript:alert(1)`,
`url(evil)`, `#zzz`, 10만 자 문자열이 전부 문서에 저장됐다.

스크립트로 실행되지는 않는다 — React가 CSSOM 속성 대입을 쓰므로 브라우저가 파싱 실패 값을
버린다. 하지만 **문서에는 저장되고 화면은 옛 색 그대로 남는다.** 문서와 화면이 어긋난 채
undo 이력에까지 들어가므로, ECT3의 DoD "그 상태가 화면에 보인다"가 그 값들에 대해 거짓이었다.

**ECT1에서 토큰 바인딩으로 똑같이 당한 실패다.** 그때 만든 처방(모든 연산이 지나는 길목에서
델타로 검사)이 바로 옆 코드에 있었는데, 새 필드를 만들면서 적용하지 않았다. 심지어 이번엔
검증자에게 "내가 안 본 경로"를 스스로 열거해 넘기기까지 했으면서, 정작 내 코드에 그 교훈을
쓰지 않았다.

수정은 `assertLiteralColorDelta`를 `assertTokenBindingDelta` 바로 옆에 두는 것이었다.
색 형식 검증과 상호배타(한 키에 두 출처 금지)를 함께 보고, 손대지 않은 기존 값은 통과시킨다.

재검증에서 confirmed. 검증자가 추가로 시도한 우회로(중첩 `batch`, `reparent-node` 조합,
`delete-node`+재생성, `replayOperations`)도 전부 막혔고, **과잉 검증도 없었다** — 레포에
실재하는 색 값 26개가 전부 통과한다.

**step-2에서 내가 만든 결함 하나를 step-3에서 고쳤다.** 원시값 입력이 `onChange`마다
연산을 내서 undo가 한 글자씩 되감기고 중간 상태가 문서에 저장됐다.

## 6. 결과물과 증거

- changeset: `20260721-bind-new-token`(215), `20260721-detach-token-binding`(216),
  `20260721-raw-color-and-rebind`(217), `20260721-literal-color-gate`(218)
- 커밋: `efe32f2`, `00ed046`, `31e2668`, `dce1f7f`
- evidence: `evidence/editor-color-and-token-editing/ect3-bind-detach.md` + `ect3/` 스크린샷
- plan: `plans/2026-07-21-ect3-bind-and-detach.md`

검증: canvas-core 105 tests(검증 시점) / agent-design 197 tests / `npm run typecheck` exit 0 /
`npm run verify` exit 0. Failure probe 6종 전부 물림(어포던스 6건 · 이미지 제외 1건 ·
두 출처 공존 2건 · 즉시 커밋 3건 · 길목 리터럴 3건).

**detach 계측(프리모템 2의 감시 장치)**: 저장된 자산 내 `literalColors` **0건**.
detach는 사용자가 명시적으로 눌러야만 생기고 기본 경로는 전부 토큰이다. 다음 milestone에서 재측정한다.

크기 회고: **4 changeset**(선언 `>=3`). 초과분 1개는 검증이 낸 결함 수정이다. 인플레 아님.

- 실표면: 브라우저에서 텍스트 노드에 색을 묶어 캔버스 글자색이 실제로 바뀌는 것, detach 시 색이 안 변하는 것, 5단계 왕복(`token → literal → literal(#ff8800) → token`)과 되감기 3회로 revision 0 복귀를 관측했다. 원시값이 `rgb(255,136,0)`으로 실제 칠해졌다.
- 재현: `cd packages/canvas-core && npx vitest run` · `cd apps/agent-design && npm test && npm run typecheck` · 루트에서 `npm run verify`

## 7. 후속 제안

- **ECT4 step-2(이미지 노드 렌더)로 연쇄** — 이 milestone이 이미지 노드를 일부러 제외했으므로 거기서 열린다.
- **ECT5는 사용자 브라우저가 필요하다** — 2026-07-21 현재 사용자가 브라우저를 쓸 수 없어 **ECT4 완료 시점에서 정지·핸드오프**한다. 스크린샷 제시로 대체하지 않는다(직전 horizon에서 실패한 방식).
- **인스펙터 한영 혼재** — ECT2에서 이월, 세 번 보고했으나 미결. ECT5 전에 정하는 게 안전하다.
- **"내가 만든 경로만 검증한다"가 네 번 나왔다** — ECT4 step-1이 그 구조적 처방(단일 출처 + 대조 게이트)을 이미 넣었다. 다음 horizon 설계 때 이 패턴을 프리모템에 반영한다.
- **렌더 경로 변경 시 주의** — 색 적용이 `<style>` 문자열 보간이나 `cssText`로 바뀌면 `literalColors`가 실제 CSS 주입 벡터가 된다. 지금은 형식 검증이 함께 막는다.
