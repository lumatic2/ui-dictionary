# changeset: 스냅이 좌표를 실제로 보정한다

- Date: 2026-07-21
- Plan: EU2 step 1 (`plans/2026-07-21-eu2-snap-measure.md`)
- 증거: `evidence/editor-legibility/eu2-snap-measure.md`

## 무엇이 문제였나

`alignmentGuides()`는 이웃 모서리를 찾아 가이드 선을 돌려줬다. **그런데 아무도 그 값으로
좌표를 보정하지 않았다.** 선이 떠도 커밋되는 bounds는 3px 어긋난 그대로였다.

이건 horizon 미리 쓰는 실패 회고 3번("스냅이 스냅처럼 보이기만 한다")이 코드에 이미 있던 상태다.
개설 시점에 예방 항목으로 적은 병리를 같은 레포에서 실물로 발견했다.

## 무엇을 바꿨나

- `snapBounds()` — 가이드와 **보정된 bounds를 함께** 돌려준다. 둘을 갈라두면 다시 어긋난다.
- 이동은 묶음 전체를 밀고, 리사이즈는 **잡은 모서리만** 옮긴다(안 잡은 변에 스냅하면 제자리에서 튄다).
- `pinSnappedEdges()` — 비례 재배치의 나눗셈이 500을 499.99999999999994로 만든다. 화면은 같지만
  좌표 비교로 "붙었나"를 물으면 어긋난 것으로 나온다. 스냅한 변만 목표값에 정확히 앉힌다.
- 캔버스에 스냅 on/off 토글. 미세 조정에는 꺼야 한다.
- `SNAP_THRESHOLD = 4` — 공식 출처 없음(Figma·Penpot 모두 비공개). **우리가 정한 값**임을 코드에 명시.
- `alignmentGuides()`는 `snapBounds().guides`로 남긴다 — 두 계산이 갈라지지 않게.

## Verification

- [x] canvas-core 132 PASS / template-core 195 PASS / agent-design 112 PASS
- [x] `npm run verify` PASS

### Failure probe

| 되돌린 것 | 결과 |
|---|---|
| 보정 제거, 가이드 계산만 남김(= 발견 당시 상태) | canvas-core 2 failed |
| 표면 배선을 보정 전 bounds로 되돌림 | agent-design 1 failed — `expected 197 to be 200` |

두 번째 probe가 중요하다. 라이브러리만 고치고 표면 배선을 빠뜨리면 사용자에게는 아무것도
안 바뀐다 — 그 구멍을 표면 테스트가 막는다.

## 곁다리로 드러난 것

- `packages/canvas-core`가 **EU1 이후 빌드된 적이 없었다.** `npm run build`가 EU1 테스트의
  타입 오류(`at: 1` — 문자열이어야 함) 2건에서 멈췄다. 앱은 dist를 import하므로, 라이브러리
  변경이 앱에 안 닿는 상태였다. 타입 오류를 고치고 빌드를 통과시켰다.
- EU1 조작 결과 테스트가 스냅에 흔들렸다(`top` 34 → 38). 그 테스트들이 재는 건 조작 자체의
  산술이므로, 실제 토글로 스냅을 끄고 측정하게 했다.
