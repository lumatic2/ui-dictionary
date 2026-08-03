# 20260804-m18-composition-block-tier

> M18 — 조합 블록 계층 (외부 흡수 실사 + 앱 골격급 자산 정본화 + saas-app-shell 1종). Plan: `plans/2026-08-04-m18-composition-block-tier.md`

## step-1 — 외부 공개 블록 실사 + 베이스 판정 (2026-08-04)

- `research/2026-08-04-m18-block-absorption-survey.md` 신설 — 후보 5개 실측 표(라이선스·구성·import 표면·품질), 채택 규칙 3항 대조.
- **판정: shadcn 공식 `dashboard-01`(MIT) 베이스 채택** — 이미 registry:block 동형 배포(11 files·shadcn primitives registryDependencies 19종), 설정·빈 상태·토스트는 우리 asset 보강. shadcn-admin(라우터 결합)·Tremor(자체 체계)·Next 스타터(프레임워크 결합)·shadcnblocks(유료) 기각.
- `docs/design-system/absorption-criteria.md` 실측 후보 분류 표에 A(dashboard-01)·B(기각 3종) 행 추가 + llms 재생성.
- 검증: 후보 ≥3 실측 표 ✓ · 규칙 3항 대조 ✓ · 베이스 확정 1줄 ✓ · absorption-criteria 행 ✓ · llms 재생성(sync 판정은 커밋 후 PASS 확인).
