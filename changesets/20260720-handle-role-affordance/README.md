# changeset: 핸들 역할 어포던스

- Date: 2026-07-20
- Plan: EU1 step 1 (`plans/2026-07-20-eu1-selection-affordance.md`)
- 증거: `evidence/editor-legibility/eu1-selection.md`

## 왜

핸들 8개가 전부 같은 9×9 사각형이었다. 변과 모서리가 **커서로만** 갈려서, 커서를 올리기 전에는
무엇이 달라지는지 알 수 없었다. 리서치가 Figma에서 확인한 역할 분리(변=단축 / 모서리=양축)가
우리 화면에는 시각적으로 없었다.

## 무엇을 바꿨나

- **모서리=정사각 9×9, 변=축 방향 막대(20×6 / 6×20).** 형태가 조작 종류를 말한다.
- **호버 상태 신설** — 점선 외곽선. "고를 수 있음"과 "골랐음"을 구분한다.
- **다중선택 구분** — 외곽선 2px + `N개 선택` 배지. 색만으로 신호하지 않는다(anti-patterns 3).
- **`white` 리터럴 제거** — `var(--ad-surface-base)`. 토큰 파생 원칙 위반이었다.

정확한 px 규격은 1차 출처가 없다(리서치 확인 실패 2번). 우리가 정한 값임을 코드 주석에 명시했고,
근거는 "역할이 구분돼야 한다"는 구조 규칙에서만 가져왔다 — 수치를 Figma 것인 양 쓰지 않았다.

## Verification

- [x] `npm --prefix apps/agent-design test` — 104 PASS (98 + 6)
- [x] 실제 브라우저 `getBoundingClientRect` 실측 — 모서리 4개 9×9, 변 4개 20×6·6×20
- [x] Shift+클릭 실조작 → 배지 `3개 선택`, 노드 3개 `data-selection-scope="multi"`
- [x] 스크린샷 2종 (`evidence/editor-legibility/eu1/`)

### Failure probe

| 되돌린 것 | 결과 |
|---|---|
| 변 핸들 치수를 모서리와 같게 | 1 failed — 스타일시트 규칙 대조가 잡는다 |

## finding 큐

- `selection-count` testid가 이미 인스펙터에 있어 배지는 `selection-count-badge`로 뒀다. 같은 값을 두 곳이 보여주지만 **같은 렌더에서 같은 출처로 계산**되므로 드리프트는 없다(anti-patterns 4 대조 완료).
- 회전은 아직 없다 — step-2.
