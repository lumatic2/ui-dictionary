# changeset: VL3 step-3 — 자산 없는 용어의 폴백 규약

- Date: 2026-07-21
- Plan: VL3 step-3 (`plans/2026-07-21-vl3-reference-repair.md`)

## 무엇을 했나

`docs/design-system/no-asset-fallback.md` 신설 + 그 경로로 실제 컴포넌트 1건 구현.

용어 562개 중 **481개는 아무 자산도 없다.** 판정이 정확해져도 그중 하나를 고르면 만들 근거가
없어 "combobox를 쓰세요"에서 멈추거나 감으로 그린다. 둘 다 사용자에겐 아무것도 안 바뀐 것과 같다.

핵심 주장: **자산이 없다는 것은 재료가 없다는 뜻이 아니다.** 용어 항목 자체가 재료다 —
`visual_anatomy`(부위 체크리스트) · `anti_use`(넘지 말 선) · `related`(이웃과의 차이) ·
같은 그룹 인접 레시피(구조 참고).

## 실증 — combobox

`examples/ui-vocabulary-site/src/components/fallback/combobox.tsx`

| 검증 | 결과 |
|---|---|
| 부위(`visual_anatomy`) | **4/4** — input trigger · typed query · filtered option list · highlighted option |
| 경계(`anti_use`) | **2/2 미위반** — 목록 밖 문자열은 값이 될 수 없고(Enter가 `filtered[activeIndex]` 있을 때만 확정), 소수 옵션이면 쓰지 말라고 주석에 명시 |
| 이웃 차이(`related`) | select와 달리 입력으로 좁힌다 / dropdown-menu와 달리 선택이 명령이 아니라 값이 된다 |
| 구조 참고 | 같은 `input-pickers` 그룹에 레시피 없음 → 4단계 건너뜀 (**없는 대로 간다**) |
| 타입 | `npx tsc --noEmit` exit 0 |

## failure probe — 규약이 순환하지 않는가

폴백은 자산이 **없는** 상황의 경로다. 절차 어느 단계도 존재하지 않는 레시피를 요구하면 안 된다.
4단계에 "없으면 없는 대로 간다 — 존재하지 않는 레시피를 만들라고 요구하지 않는다(그러면 폴백이
아니라 순환이다)"를 명시했고, combobox 구현이 실제로 그 경로를 밟았다(인접 레시피 없음).

## 배포 등재

`no-asset-fallback.md`와 `term-asset-map.json`을 llms.txt Contracts 섹션에 등재.
`--strict` 무결성 PASS.

## 판정

complete.
