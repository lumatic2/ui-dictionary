# 20260804-m21-harvest-contract

> M21 — 회수 계약(하베스트) 정본화 + 첫 승격 실증. Plan: `plans/2026-08-04-m21-harvest-contract.md`

## step-1 — 계약 정본화 + 배선 (2026-08-04)

- `docs/design-system/harvest-contract.md` 신설: 판정 3축+취향 게이트(M20 교훈 — 사용자가 신규성·품질 상위 후보를 기각하고 브랜드 개성 축으로 확정), 표준 6단 승격 절차, 출처 표기, 중복 규칙. entry-protocol Rules 에 자산 유입 2-lane(외부 흡수/자기 회수) 1줄. FIXED_ASSETS 등재 — probe: 미등재 상태 llms.txt 0건 실측 후 등재(1건).

## step-2 — 첫 승격 2건 (2026-08-04)

- `zigzag-story-section` ← askewly.com building-section (지그재그 스토리텔링 — 일러스트는 소비자 슬롯+번호 placeholder 로 분리, 계약 §3.2) · `terminal-demo-panel` ← guide.askewly.com TerminalDemo (자동 재생 터미널→결과 듀얼 패널, 421줄→간결화·reduced-motion 분기·pause 컨트롤).
- generate-registry 에 item.meta passthrough 신설(harvest 출처 표기 §4) — 기존 항목은 meta 부재라 출력 불변.
- 게이트: 기존 28건 재생성 diff 0(스냅숏 대조·index 순수 추가 확인) · purity probe(date-fns 주입→FAIL) · 사이트 build 759 routes · lint/llms-sync PASS.

## step-3 — 신선 프로젝트 E2E (2026-08-04)

- 킥스타트(`init --block saas-app-shell --registry 로컬 서빙`) 신선 프로젝트에 vite 셸 + 승격물 2건 fetch 이식 → 격리 verify 0건 → hex probe(#ff4400 주입→적발) → dev 서버 실브라우저 시간차 3장.
- **E2E 실적발 결함 1**: scenes inline-prop identity 가 effect deps 에 있어 상태 갱신마다 타이머 전체 리셋(타이핑 0글자 고정) — 정적 게이트 전부 통과한 모션 결함. 수정 후 재이식·전 사이클(타이핑→스트리밍→결과 패널) 관측 PASS.
- finding: CLI verify 가 shadcn chart.tsx `[stroke='#ccc']` 속성 셀렉터를 오탐(킥스타트 내장 verify 는 블록만 스캔하는 비대칭) — 큐.
