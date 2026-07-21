# changeset: VL4 step-2 — 판별 데이터 검증기

- Date: 2026-07-21 · Plan: VL4 step-2

`scripts/validate-decisions.py`. 검사 6종: 필수 필드 / candidates가 terms.yml 실존 / 축의 source+confidence / rules의 pick·when 정합 / default / **교차 군집 모순**.

## failure probe 5종 — 전부 exit 1 + 원인 지목

| probe | 결과 |
|---|---|
| 없는 term id | `candidates 에 terms.yml 에 없는 id — __nope` |
| 축에 source 누락 | `축 section-count 에 source 가 없다` |
| pick이 candidates 밖 | `rules[1] 의 pick 이 candidates 밖이다 — __ghost` |
| when 값이 축 values 밖 | `rules[2] 의 section-count 값이 축 values 밖이다 — 99` |
| 필수 필드 누락 | `필수 필드 누락 — default` |

데이터 0건 상태에서 exit 0 + "0 clusters" 보고도 확인.
