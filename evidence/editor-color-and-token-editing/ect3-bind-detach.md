# EVIDENCE — ECT3 묶고 푼다

- Milestone: ECT3 (`plans/2026-07-21-ect3-bind-and-detach.md`)
- Horizon: 편집기에서 색이 색으로 보이고, 바꿔진다
- 완료일: 2026-07-21
- 상태: **완료 — 3/3 leaf, changeset 215·216·217**

## DoD 대조

| DoD 항목 | 실측 | 판정 |
|---|---|---|
| 색이 안 묶인 노드에 색을 묶는다 | 브라우저: 텍스트 노드 `글자 색 묶기` → 캔버스 글자색 실제 변경 | PASS |
| 묶인 색을 풀어 원시 색으로 벗어난다 | 브라우저: detach 시 **캔버스 색 불변**(`oklch(1 0 0)`→`oklch(1 0 0)`) | PASS |
| 그 상태가 화면에 보인다 | 원형 견본 + 원시값 입력 + "토큰에서 벗어난 색이다" 3중 표시 | PASS |
| undo로 전 구간이 되돌아온다 | 5단계 왕복 + 브라우저 3단계 되감기 → `surface.raised`, revision 0 | PASS |

## 브라우저 5단계 왕복 실측

```
token:surface.raised → literal:oklch(1 0 0) → literal:#ff8800 → token:action.primary
```
원시값 `#ff8800`이 캔버스에 실제로 칠해졌다(`rgb(255, 136, 0)`).
되감기 3회로 `surface.raised`·revision 0 복귀, 리터럴 필드 잔존 없음.

## 설계 판정 — 새 필드가 필요했다

plan 결정은 "기존 리터럴 자리 우선, 새 필드는 안 될 때만"이었다. 실사 결과
리터럴 색 자리는 `ShapeNode.fill` **하나뿐**이라 frame·text는 둘 곳이 없다.
`CanvasNodeBase.literalColors?`를 신설하되:

- `tokenBindings`에 리터럴을 섞지 않는다 — ECT1의 토큰 실재 검증이 무너진다
- **선택 필드** — 필수면 저장된 문서가 안 열린다(테스트로 고정)
- 우선순위 **바인딩 > 리터럴** — 겹쳐도 모호하지 않다

## 두 출처가 동시에 살아 있는 순간이 없다

왕복 전 구간에서 `바인딩 && 리터럴`이 참인 순간이 없음을 테스트가 매 단계 확인한다.
`attach`가 리터럴을 안 지우게 하는 probe를 물리면 2건이 실패한다.

## detach 계측 (프리모템 2의 장치)

horizon 프리모템 2: "detach가 토큰 이탈의 문이 됐다 — 원시 hex가 편한 기본 습관이 되어
디자인 시스템 논지가 안에서부터 무너진다."

**현재 저장된 자산(템플릿 fixture·evidence 산출물)에 `literalColors` 등장: 0건.**
detach는 사용자가 명시적으로 눌러야만 생기고, 기본 경로(묶기·색 고르기)는 전부 토큰이다.
다음 milestone에서 이 수치를 다시 잰다 — 늘어나면 그게 프리모템 2가 현실이 된 신호다.

## Failure probe

| probe | 결과 |
|---|---|
| 미바인딩 어포던스 제거 | 6건 실패 |
| 이미지 노드 제외 규칙 제거 | 1건 실패 |
| attach가 리터럴을 안 지움 (두 출처 공존) | 2건 실패 |
| 원시값 입력을 즉시 커밋으로 되돌림 | 3건 실패 |

## 회귀 게이트

canvas-core 99 passed · agent-design 196 passed · `npm run typecheck` exit 0 · `npm run verify` exit 0

## 스크린샷

`evidence/editor-color-and-token-editing/ect3/` — 묶은 뒤, 벗어난 상태.

## finding 큐

1. 원시값 입력이 **아무 문자열이나 받는다** — `#zzz` 같은 값도 저장된다. 렌더는 무시하지만
   화면에는 남는다. 색 형식 검증은 이번 범위 밖이지만 ECT5에서 사람이 만지면 걸릴 수 있다.
2. 인스펙터 한영 혼재(ECT2에서 이월, 미해소).
