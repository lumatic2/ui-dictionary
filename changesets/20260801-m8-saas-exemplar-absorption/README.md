# changeset — M8 SaaS exemplar 흡수 (Linear·Vercel/Geist → 대시보드 밀도·저소음 위계)

- Plan: `plans/2026-08-01-m8-saas-exemplar-absorption.md`
- Goal: `reference-diversification` (연쇄 2/2)

## step-1 — 대시보드 밀도 배치 수집 + dedup (2026-08-01)

- 실브라우저 캡처 3면: Linear 리프레시 원문(2026-03-12 게재 — "밀도≠소음"·earned attention·structure felt not seen)·Geist introduction·Geist colors(10-스케일 역할 밴드). Linear 실제품 내부는 로그인 벽 — 공식 블로그로 대체(한계 기록).
- 근거 동결: `research/2026-08-01-m8-dashboard-density-capture.md` (knowledge 결정표 재료 7행 포함).
- inbox batch `20260801-dashboard-density` 후보 9건(source=tier 2) 스테이징. 스키마 학습: `pattern_group: style` 은 무효 어휘(10종에 없음) — audit ERROR 로 적발, `application-ui` 로 정정 후 exit 0·warnings 0.
- 프로세스성 후보 1건(feature-flag-design-rollout)은 표면 밖 보류 예정 판정.

## step-2 — 승격 + 검증 체인 + ledger (2026-08-01, M8·goal 마감)

- `knowledge/dashboard-density.md` 신설(밀도≠소음 대원칙 · 주의 예산 · structure felt not seen · 상태색=스케일 인접 단계 · 텍스트 2단 위계 + 판정 절차) + FIXED_ASSETS 등재(자산 169→170) — mobile-navigation 과 경계 wikilink.
- terms 보강 3건: sidebar-nav(도착 후 후퇴) · divider(여백 우선·그룹 경계만) · table-density-control(밀도≠소음).
- knowledge 흡수 5건 + 보류(C) 1건 판정 — ledger dedup 열에 전건 기록. inbox 비움 + ledger 1행(source=`linear+vercel-geist (t2)`).
- 검증: validate 2종·build 755 routes·oxlint(기존 경고만)·lint:colors 0·build:data terms=563·audit:visuals 신규 fallback 0·실브라우저 `/terms/divider` 렌더 확인·check-llms-sync 커밋 후 PASS. build:catalog 생략(recipe 0).
