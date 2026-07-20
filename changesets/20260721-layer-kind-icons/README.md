# changeset: 레이어 타입 아이콘 7종

- Date: 2026-07-21
- Plan: EU3 step 1 (`plans/2026-07-21-eu3-layer-legibility.md`)
- 증거: `evidence/editor-legibility/eu3-layers.md`

## 무엇이 문제였나

삼항 연쇄 끝의 `: '▭'` 폴백이 **frame·image·shape 세 종류를 조용히 삼켰다.** 7종 중 5개 글리프뿐이라
1000행 트리에서 프레임과 이미지가 같아 보였다.

## 무엇을 바꿨나

- `LAYER_KIND_ICONS: Record<CanvasNode['kind'], string>` — 폴백을 없애고 **망라를 타입으로 강제**한다.
  새 kind가 생기면 컴파일이 거부한다.
- 행이 `data-layer-kind`와 `title`로도 종류를 말한다 — 글리프만으로 못 읽는 사람에게도.

## Verification

- [x] agent-design 121 PASS · `tsc -b` 통과

### Failure probe

| 되돌린 것 | 결과 |
|---|---|
| image를 frame과 같은 아이콘으로 | 1 failed — `expected 6 to be 7` |
| 맵에서 `shape` 항목 제거 | 컴파일 거부 — `Property 'shape' is missing` |

## 곁다리로 드러난 것

probe B를 돌리려고 처음으로 타입체크를 실행했더니 **EU1이 남긴 타입 오류 2건**이 나왔다.
`collaboration.e2e.test.tsx`·`MaterializeAction.test.tsx`가 `rotation` 없이 노드를 만들고 있었다.
EU1에서 `rotation`을 필수로 만들 때 이 두 파일이 빠졌고, vite dev·vitest는 타입을 안 봐서
아무도 몰랐다. `build`의 `tsc -b`가 잡을 수 있었지만 이번 루프에서 한 번도 안 돌았다.

수정 + `npm run typecheck` 스크립트 추가 — 게이트가 있어도 안 돌리면 없는 것과 같다.
