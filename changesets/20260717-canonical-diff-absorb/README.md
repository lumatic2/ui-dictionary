# 성문 판단 diff 흡수 + 배포 (TC4 Step 2)

- Date: 2026-07-17
- Milestone: TC4 Step 2 (plan: `plans/2026-07-17-tc4-canonical-diff.md`)
- Scope: anti-patterns(클러스터 13 서체 증식 금지), knowledge/expressive-stack(판정 절차 6 — 모션 규모 비례), recipes/forms/button.md(verb-first Checks), llms 재생성

## What

- 채택 3: HIG 서체 증식 금지(T-15), M3 모션 규모 비례(T-16), Polaris verb-first 레이블(T-17).
- 기각 2 (사유 기록): M3 색 역할 어휘(T-18 — 스타일 고정 금지·토큰 체계 종속), HIG 재질 계층(T-19 — 플랫폼 스타일 + principles 중복).
- diff 실작동 증명: 전량 수용 아님(기각 2 존재 — DoD 요건).

## Verification

- [x] validate-recipes PASS (45) + llms 재생성 (58)
- [x] 채택 ≥1(3)·기각 ≥1(2, 사유 명기)
- [x] 배포 curl: 서체 증식·판정 절차 6·verb-first 노출 + 오경로 404 (push 후 기록)
