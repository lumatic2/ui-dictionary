# changeset: 정적 거리 측정

- Date: 2026-07-21
- Plan: EU2 step 2 (`plans/2026-07-21-eu2-snap-measure.md`)
- 증거: `evidence/editor-legibility/eu2-snap-measure.md`

편집기에 거리를 재는 경로가 **아예 없었다**(`grep -i "measure\|distance"` 0건).
간격이 맞는지 확인하려면 눈대중밖에 없었다.

## 무엇을 넣었나

- `measureDistance(a, b)` — 축마다 **가장 가까운 변 사이의 빈 거리**. 겹친 축은 0이다(음수 거리를 지어내지 않는다).
- Alt + 호버로 진입. 드래그 gesture와 **다른 상태**로 둔다 — 하나로 합치면 "지금 끄는 중인지
  재는 중인지"가 화면에서 갈리지 않는다(리서치 함의 2).
- 판독은 문서 좌표에서 계산한다. 화면 픽셀에서 되읽으면 zoom·pan이 값에 섞인다.

## 측정 기준 (명문화)

**바운딩 박스다.** 회전한 노드도 회전 **전** 축 정렬 bounds로 잰다 — 회전 후 외접 사각형을 쓰면
각도가 조금만 달라져도 값이 흔들려 정렬 도구로 못 쓴다. 대신 화면에 보이는 외곽선과 다를 수 있고,
스트로크 두께·텍스트 베이스라인도 들어가지 않는다. Figma도 같은 규약이다("the bounding box that
surrounds an object or layer" — [Measure distances between layers](https://help.figma.com/hc/en-us/articles/360039956974-Measure-distances-between-layers), 접근 2026-07-20).

## Verification

- [x] canvas-core 142 PASS / agent-design 116 PASS
- [x] 회전 45°를 준 노드의 측정값이 회전 전과 같다 — 각도가 값을 흔들지 않음을 테스트로 고정

### Failure probe

| 되돌린 것 | 결과 |
|---|---|
| 측정을 드래그 gesture 경로에 함께 붙임 | agent-design 1 failed — "드래그 중에는 측정이 켜지지 않는다" |

분리가 **실재함**을 이 probe가 증명한다. 두 기능이 각각 동작하는 것만으로는 분리를 못 보인다.
