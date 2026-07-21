# changeset: 인스펙터 기하값

- Date: 2026-07-21
- Plan: EU4 step 1 (`plans/2026-07-21-eu4-inspector-ia.md`)
- 증거: `evidence/editor-legibility/eu4-inspector.md`

## 실사가 계획을 바꿨다

EU4의 선언은 "인스펙터 **순서** 재배치"였다. 그런데 열어보니 **위치·크기를 볼 수도 고칠 수도
없었다.** `propertyFieldsForNode()`가 내놓는 건 layout mode·sizing·gap·padding·token·prop·
variant·override뿐이고 `bounds`의 `x·y·width·height`가 하나도 없다.

인스펙터의 "Width/Height"는 숫자가 아니라 `fixed|hug|fill` **사이징 모드**다 — 이름이 같아서
오히려 더 헷갈린다. EU1에서 넣은 `rotation`도 인스펙터엔 없었다(회전은 되는데 각도를 못 읽는다).

**없는 것은 재배치할 수 없다.** 그래서 step-1을 "순서"가 아니라 "존재"로 잡았다.

## 설계 판단 — 기존 연산으로 커밋한다

기하 편집을 캔버스 드래그와 **같은 연산**(`transform-nodes`·`rotate-nodes`)으로 보낸다.
인스펙터 전용 변경 경로를 새로 만들면 캔버스와 인스펙터가 서로 다른 문서 변경 경로를 갖게 되고,
하나만 undo에 잡히는 사태가 난다.

`propertyFieldsForNode`에 섞지 않은 이유도 같다 — 그쪽은 `set-node-property` 계약이다.

## Verification

- [x] agent-design 135 PASS · `tsc -b` 통과
- [x] 값 표시가 문서를 따라온다(캔버스에서 끌면 인스펙터 숫자가 갱신)
- [x] 크기 0 이하·빈 입력 거부, 값이 같으면 연산 없음

### Failure probe

| 되돌린 것 | 결과 |
|---|---|
| transform 커밋 제거(표시 전용으로) | 1 failed — 입력만 바뀌고 문서는 그대로인 상태를 잡는다 |

## 잡은 결함

`Number('')`은 `0`이다. 빈 칸을 그대로 넘기면 **좌표가 0으로 날아간다.** 테스트가 먼저 잡았고,
빈 문자열을 `NaN`으로 바꾸는 파서를 따로 뒀다 — `x = 0`은 정당한 값이라 숫자 검사만으로는 못 거른다.
