# 완료 — M20 산출물 전수 teardown — 배포 표면 29종 실사 + harvest 후보 장부

> 완료: 2026-08-04 · M20 (goal `harvest` 1/2) · 배치: `docs/reports/`(이 레포 정본 — archive/ gitignore 규약)

## 1. 결과

배포된 자기 산출물의 전체 지형이 처음으로 장부화됐다. Cloudflare 계정 실측(census 29 표면) → 소스 레포 29/29 매칭 → 워커 6기 병렬 실브라우저 teardown 카드 29건 → 후보 순위표. 사용자가 추천(kifrs-viz·skku)을 기각하고 harvest 풀을 직접 확정: **askewly.com·brain·guide·dev·bootcamp·sixsense·ui-dictionary 본체** 7 표면(기각 사유: "나머진 AI slop 느낌"). 이 풀이 M21 회수 계약·첫 승격의 입력이다.

## 2. 이슈와 해결

- census 산술 오류(27→29)와 llms 등재 배선 누락을 fresh 검증자가 사전 적발 — 계획 단계에서 보수.
- prawn "무응답 사망" 전제가 워커 실측과 상충(콜드스타트 지연, 재실측 200) — 사망 카드 대신 라이브 카드로 정정하고 전제 반박을 기록.
- 사용자 확정 축이 순위표 축(신규성·품질)과 달랐다(브랜드 개성/취향) — 순위 설계의 교훈으로 ledger 에 기록. DoD 잔여 없음.

## 3. 증거

- changeset: `changesets/20260804-m20-harvest-teardown`
- 검증: census↔ledger 29:29 대조 0 누락 · 카드 29건 판정 3축 전건 · 오케스트레이터 표본 재관측 3건 일치 · 사망 표면 실측 코드 기록(physical-ai-arm 404) · 사용자 확정 1회 기록
- 크기 회고: changeset 1개(step 3절) — milestone 판정 유지 근거는 병렬 fan-out+human gate 라는 독립 step 구조, 다만 기록량 기준으로는 경계선.
- 실표면: 판정 보드 Artifact 로 사용자 실관측 → 풀 확정 회신 수신.
- 재현: `research/2026-08-04-harvest-asset-census.md` §수치 출처 커맨드 + `research/2026-08-04-m20-harvest-teardown-ledger.md`
