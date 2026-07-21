# changeset: VL5 step-3 — 전 군집 무결성 + 인덱스

- Date: 2026-07-21 · Plan: VL5 step-3

`docs/design-system/decisions/README.md` — 군집 인덱스 + **만들지 않은 군집과 그 사유**.

인덱스가 "무엇이 있나"만 적으면 빠진 자리가 실수처럼 보인다. 만들지 않은 것을 두 갈래로 나눠 적었다: ① 이미 맞히는 군집 8개(VL1 기준선 만점 — 축을 달아도 향상 없이 유지 비용만 는다) ② 원문을 확보 못 한 것.

## 교차 모순 검사

`validate-decisions.py`가 같은 축=값에서 두 군집이 다른 답을 고르는지 본다.

**probe**: 고의 충돌 fixture(`content-overflow=scrolls`에서 dialog를 고르는 군집) 투입 →
`교차 모순: 축 content-overflow=scrolls 에서 __probe-conflict 는 dialog 을, overlay-surfaces 는 drawer 을 고른다` exit 1.

## 최종 상태

6 clusters / 축 26 / 규칙 32 · 교차 모순 0 · 참조 무결성 위반 0
