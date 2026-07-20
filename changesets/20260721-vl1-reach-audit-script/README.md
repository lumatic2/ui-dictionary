# changeset: VL1 step-2 — 용어 도달 계수기

- Date: 2026-07-21
- Plan: VL1 step-2 (`plans/2026-07-21-vl1-flow-audit.md`)
- 증거: `evidence/vocabulary-in-use/vl1-flow-audit.md` §8

## 무엇을 했나

step-1의 수기 관측을 **재현 가능한 계측**으로 승격했다. `scripts/audit-vocabulary-reach.mjs`는
판정 기준을 배포본(`public/llms/**`)으로 고정한다 — 레포에 원본이 있다는 사실은 해소가 아니다.

## 계수 결과

용어 562 · 배포된 용어 **0** · 레시피 45(참조 35) · distinct term_refs 81 · **끊긴 term_refs 91**
· 커버리지 14.4%(자산 없는 용어 481) · 코드 자산 27 · 프로토콜 용어 언급 0

수기 계수를 정정: 서로 다른 이름은 81개지만 등장 **횟수**는 91회다. 고쳐야 할 자리는 91곳.
끊긴 사유는 전부 "로컬에만 존재 — 미배포" — 오타나 없는 용어가 아니라 배포가 안 됐을 뿐이다.

## 검증 (failure probe)

배포 디렉터리에 `cart-summary` 1개 fixture 투입 → 끊김 91→88(그 용어를 참조하는 레시피 3건),
제거 → 91 복구. `groups.yml`은 같은 디렉터리에 있어도 `published_sources`가 빈 배열 —
축 데이터를 용어로 오인하지 않는다.

## 판정

complete.
