# 20260804-m20-harvest-teardown

> M20 — 산출물 전수 teardown. Plan: `plans/2026-08-04-m20-harvest-teardown.md` (승인 chain M21, 2026-08-04)

## step-1 — 소스 레포 매칭 장부 (2026-08-04)

- census 29 표면 전건에 로컬 소스 매칭 — `research/2026-08-04-m20-harvest-teardown-ledger.md` §step-1 표.
- 매칭 방법: wrangler.toml `name` 실측(9건 직결) + `.vercel/project.json` 실측(5건) + agent-orchestration manifests(기기별 레포 장부 — M4 원격 소스 2건 판별) + lumatic2 프로필 README·Askwely-company projects.ts(라벨 대조) + INDEX.md.
- 결과: 29/29 행, 소스 확정 24 · 원격(M4) 2(americano-robot·futsal) · 추정 2(overrism=over-series-site, skku=후보 2 미판별) · 미상 1(precon — 전수 grep 0건). 추정·미상은 step-2 라이브 실측으로 판별.
- 검증: census↔ledger 29:29 대조, 소스 칸 공란 0.

## step-2 — 표면별 teardown 실사 (2026-08-04)

- sonnet 워커 6기 병렬 fan-out(표면 4~5개씩) — 카드 29/29, 실브라우저 스크린샷 58장(viewport+full-page, scratchpad `m20-shots/`). 오케스트레이터 표본 재검 3건(kifrs·skku·askewly.com) 일치.
- step-1 판별 정정 4건: overrism=`archive/over-series-site` 확정 · precon=`archive/gcp-solana-agentic`(README 라이브 URL 실측) · skku=`archive/skku-startup-hub` · **prawn 생존**(콜드스타트 지연 — 재실측 2회 200, census "무응답"은 스윕 timeout).
- failure probe: physical-ai-arm 사망 카드에 curl 404 실측 기록. prawn 은 사망 전제가 관측과 상충 → 라이브 카드로 정정(전제 반박이 기록됨 — 조용한 통과 없음).

## step-3 — harvest 후보 순위 (2026-08-04, 사용자 확정 대기)

- 후보 yes 14 / no 14 / 저장고 본체 1. 1군 추천: ① kifrs-viz 데이터비주얼 3종(그래프·트리맵 서가·타임라인 — registry 차트 공백) ② skku 에디토리얼 신문 레이아웃. 2군 11건 큐 기록.
