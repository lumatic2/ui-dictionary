# 완료 — M23 harvest 배치 2 — M22 확정 목록 승격 집행

> 완료: 2026-08-04 · M23 (goal `harvest-deep` 2/2) · 배치: `docs/reports/`(이 레포 정본)

## 1. 결과

확정 12건 전건 승격 — asset 8종(logo-marquee·rotating-label·cursor-proximity-glow·floating-bars-hero·typing-headline·contrast-duo-card·graph-legend-panel·ask-input-bar, meta.harvest 전건) + cosmos 팔레트 프리셋(킥스타트 --color 옵션) + knowledge 2편(사전형 IA·랜딩 리듬) + head-meta 계약·템플릿(사용자 지시 B5). 각 자산은 /r/<name>.json 독립 fetch·독립 import 로 조합 가능 — 사용자가 조합 가능성을 확인 후 통과. goal `harvest-deep`(M22 채굴 + M23 집행) 완주 — 회수 루프가 계약(M21)→배치 반복(M23)으로 실증됐다.

## 2. 이슈와 해결

- 전 프로젝트 verify 잔여 1건 = 기지 오탐(ui/chart.tsx 속성 셀렉터 — M21 finding 이월, 신규 자산 무관·격리 verify 0건으로 분리 입증).
- cosmos 팔레트 첫 실구동에서 무옵션 init 이 브리프 경로가 아님을 확인(--block 필수) — 착오 없이 킥스타트 경로로 재검증.
- DoD 잔여 없음. 이월 명시: B4·C1~C5 + 2차 채굴 배치 3 후보(본체 미등재 마이크로 인터랙션 6종 등).

## 3. 증거

- changeset: `changesets/20260804-m23-harvest-batch2`
- 검증: `node scripts/generate-registry.mjs` 기존 30건 diff 0(순수 추가 8, 스냅숏 대조 스크립트 출력 "changed existing: []") · purity probe(date-fns 주입→FAIL) · llms probe(미등재 0건→등재 3건) · site build "prerender: 759 routes" · `check-llms-sync` PASS · 신선 프로젝트 격리 verify "8 file(s) 0건" · 킥스타트 cosmos 실구동 "28/28 defined·verify PASS"
- 크기 회고: changeset 1개(step 3절) — 착지 3형태(코드·CLI·문서) 독립 검증으로 milestone 판정 유지.
- 실표면: 신선 프로젝트 실브라우저 시간차 2장(모션 3종 전이 실측) + 관측 보드 Artifact — 사용자 통과 2026-08-04.
- 재현: harvest-contract.md 부록 8단 + 갤러리 App(scratchpad fresh-harvest).
