# changeset: 인스펙터 섹션 순서

- Date: 2026-07-21
- Plan: EU4 step 2 (`plans/2026-07-21-eu4-inspector-ia.md`)
- 증거: `evidence/editor-legibility/eu4-inspector.md`

인스펙터는 제목 없는 `<label>` 평면 나열이었다. 기하/구조/시각/내보내기 구분이 없어
리서치가 확인한 순서와 **대조할 대상 자체가 없었다.**

## 순서의 출처

`INSPECTOR_SECTIONS = ['geometry', 'structure', 'visual', 'export']`는 **우리가 지어낸 순서가
아니다.** 리서치가 Figma·Penpot 공통으로 확인한 순서다(§1.4·§3.4). 코드 주석에 근거를 남겼다.

- `token` scope → 시각, 나머지(`layout`·`prop`·`variant`·`override`) → 구조.
- 내보내기 섹션은 **자리만** 만들고 현재 상태를 말한다. 기능은 template-core 소관이고,
  빈 자리에 가짜 버튼을 두면 판독성이 오히려 나빠진다.

## Verification

- [x] agent-design 138 PASS · `tsc -b` 통과

### Failure probe

| 되돌린 것 | 결과 |
|---|---|
| 시각 섹션을 구조 앞으로 이동 | 1 failed — 순서가 실제로 고정돼 있다 |
