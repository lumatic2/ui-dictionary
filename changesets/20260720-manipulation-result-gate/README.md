# changeset: 조작 결과 게이트

- Date: 2026-07-20
- Plan: EU1 step 3 (`plans/2026-07-20-eu1-selection-affordance.md`)
- 증거: `evidence/editor-legibility/eu1-selection.md`

핸들 모양을 갈랐고(step-1) 회전을 넣었지만(step-2), **"조작하면 이 결과가 나온다"**를
고정하는 테스트가 없었다. 모양만 닮고 역할은 같은 상태로 퇴화할 수 있다.

## 무엇을 검사하나

| 조작 | 입력 | 기대 |
|---|---|---|
| 이동 | +20,+10 | 두 축 이동, 크기 불변 |
| 변 핸들 n | +30,+12 | **x·width 불변**, y·height만 |
| 모서리 se | +20,+10 | width·height 함께 |
| 회전 | 위→오른쪽 | +90°, 위치·크기 불변 |

기대값은 **입력 델타에서 계산**한다 — 렌더 출력을 되읽으면 게이트가 자기 말을 되풀이한다.

## Verification

- [x] agent-design 110 PASS (106 + 4)

### Failure probe

| 되돌린 것 | 결과 |
|---|---|
| 변 핸들을 양축 리사이즈로 | 2 failed — `expected '54px' to be '24px'` |

역할 분리가 **실재함**을 이 probe가 증명한다. 클래스 이름만 바꾼 것이었다면 통과했을 것이다.
