# 20260804-m20-harvest-teardown

> M20 — 산출물 전수 teardown. Plan: `plans/2026-08-04-m20-harvest-teardown.md` (승인 chain M21, 2026-08-04)

## step-1 — 소스 레포 매칭 장부 (2026-08-04)

- census 29 표면 전건에 로컬 소스 매칭 — `research/2026-08-04-m20-harvest-teardown-ledger.md` §step-1 표.
- 매칭 방법: wrangler.toml `name` 실측(9건 직결) + `.vercel/project.json` 실측(5건) + agent-orchestration manifests(기기별 레포 장부 — M4 원격 소스 2건 판별) + lumatic2 프로필 README·Askwely-company projects.ts(라벨 대조) + INDEX.md.
- 결과: 29/29 행, 소스 확정 24 · 원격(M4) 2(americano-robot·futsal) · 추정 2(overrism=over-series-site, skku=후보 2 미판별) · 미상 1(precon — 전수 grep 0건). 추정·미상은 step-2 라이브 실측으로 판별.
- 검증: census↔ledger 29:29 대조, 소스 칸 공란 0.
