# Dribbble 배치 자산 반영 + 배포 (TC3 Step 2)

- Date: 2026-07-17
- Milestone: TC3 Step 2 (plan: `plans/2026-07-17-tc3-dribbble-batch.md`)
- Scope: `docs/design-system/anti-patterns.md`(클러스터 16 신설 — 콘셉트 대시보드 관성), `recipes/data-display/stat-summary-grid.md`(Checks 단일 액센트 항목), llms 재생성

## What

- T-13 역이용 → 클러스터 16: 인사말 히어로·사진 위 데이터·축 없는 장식 차트 3형태 금지 + "콘셉트 목업 레퍼런스는 게이트 4문항 선통과" 지시.
- T-14 흡수 → stat-summary-grid: 무채 베이스+강조 1점(라벨 병행) 강조 운용.

## Verification

- [x] validate-recipes PASS (45) + llms 재생성 (58)
- [x] look 복사 probe: 갱신 문구에 샷 팔레트 값 0
- [x] 배포 curl: 클러스터 16 grep + 오경로 404 (push 후 기록)
