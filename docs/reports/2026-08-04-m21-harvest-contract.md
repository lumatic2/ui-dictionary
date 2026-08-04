# 완료 — M21 회수 계약(하베스트) 정본화 + 첫 승격 실증

> 완료: 2026-08-04 · M21 (goal `harvest` 2/2) · 배치: `docs/reports/`(이 레포 정본)

## 1. 결과

산출물→저장고 입력 루프가 계약과 실물로 닫혔다. `docs/design-system/harvest-contract.md`(판정 3축+취향 게이트·6단 절차·출처 표기·중복 규칙·재현 부록) llms 실등재 + entry-protocol 자산 유입 2-lane 배선. 첫 승격 2건 — `zigzag-story-section`(← askewly.com)·`terminal-demo-panel`(← guide.askewly.com) — registry `meta.harvest` 출처 표기와 함께 배포 표현까지 생성. goal `harvest`(M20+M21) 완주.

## 2. 이슈와 해결

- E2E 실브라우저가 정적 게이트(빌드·lint·verify·purity) 전부를 통과한 모션 결함(타이핑 루프 inline-prop identity 리셋)을 적발 — 수정 후 전 사이클 재검증, "시간차 스크린샷 생략 금지"를 계약 부록에 명문화.
- requiredCssVars 결손 probe 는 플레인 자산(선언 0)이라 hex-literal probe 로 대체 — 계획 대비 적응, 기록.
- finding 이월: CLI verify 의 shadcn chart.tsx `[stroke='#ccc']` 속성 셀렉터 오탐(킥스타트 내장 verify 와 스캔 범위 비대칭) · 확정 풀 잔여 5 표면 후속 배치.

## 3. 증거

- changeset: `changesets/20260804-m21-harvest-contract`
- 검증: llms.txt harvest-contract·승격 2건 grep + check-llms-sync PASS · 기존 자산 28건 재생성 diff 0 · purity probe(date-fns)·hex probe(#ff4400) FAIL 실확인 · 사이트 build 759 routes·lint PASS · 신선 프로젝트 격리 verify 0건
- 크기 회고: changeset 1개(step 3절) — 계약 문서+생성기 확장+승격 실증이 각각 독립 검증을 가져 milestone 판정 유지.
- 실표면: 신선 프로젝트 실브라우저 시간차 3장 + 사용자 관측 보드(Artifact) 통과("응 ㄱㅊ" 2026-08-04).
- 재현: harvest-contract.md 부록 8단 시퀀스.
