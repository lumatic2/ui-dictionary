# Taste 배치 ③ Antigravity + 배포 (TC2 Step 3)

- Date: 2026-07-17
- Milestone: TC2 Step 3 (plan: `plans/2026-07-17-tc2-curation-batch.md`)
- Scope: taste ledger T-11~T-12, `recipes/application-ui/canvas-particle-field.md`(Variants), llms 재생성(갱신 자산 일괄 배포)

## What

- Antigravity: 디스플레이 굵기 역전(80px weight 450 — 클러스터 13 합산 근거), 장식은 여백에·콘텐츠 축 순정(→particle recipe Variants).
- 배치 계수: 총 12건 — 흡수 9건, 미소화 2건(중복 재확인), 시그니처 제안 보류 1건. 갱신 자산 2종: anti-patterns(클러스터 13 보강+14·15 신설) + recipes 5파일.

## Verification

- [x] validate-recipes PASS (45) + generate-llms-txt PASS (58) + site build 에러 0
- [x] 계수 확인: 흡수 9 ≥ DoD 기준(10건 기록·갱신 자산 2종) — 기록 12건, 자산 2종(anti-patterns·recipes)
- [x] 정직성 probe: 미소화 2건 표기 존재(전 건 흡수 주장 아님)
- [x] 배포 curl: anti-patterns(클러스터 15 grep)·recipe 갱신 반영 + 오경로 404 (push 후 기록)
