# Agent Entry Protocol 정본화 + llms.txt 노출

- Date: 2026-07-17
- Milestone: AD1 Step 1 (`docs/plans/2026-07-17-ad1-default-routing.md`)
- Scope: `docs/design-system/entry-protocol.md`(신규), `scripts/generate-llms-txt.mjs`, `examples/ui-vocabulary-site/public/404.html`(신규), 재생성된 `public/llms.txt`·`public/llms/**`

## What

- **entry-protocol.md 신설**: 에이전트가 디자인 작업을 받았을 때 "무엇을 어떤 순서로 fetch하는가"의 운영 계약. 공통(토큰→anti-patterns→검증 루프) + 작업 유형별(A 신규 화면 / B 기존 UI 개선 / C 단일 컴포넌트) fetch 순서 + 규칙(semantic 토큰만, 갭 기록, fetch 실패 시 정지·보고). agent-asset-model.md(스키마 계약)와 분리 — 이건 절차 계약.
- **llms.txt 최상단 "Entry Protocol" 섹션 노출**: `generate-llms-txt.mjs` FIXED_ASSETS에 추가, 인덱스 재생성 (43 assets).
- **SPA silent-fallback 봉합 (실패 probe 적발)**: 오경로 fetch가 404가 아니라 200 + index.html을 돌려주는 결함 발견 — 에이전트가 오타 경로에서 HTML 쓰레기를 조용히 받게 됨. 사이트 라우팅은 query-param 전용(`/?page=`)이라 path fallback 불필요 → `public/404.html` 추가로 Cloudflare Pages SPA fallback 비활성화.

## Contract

- Source of truth: `docs/design-system/entry-protocol.md` (레포) — `public/llms/**`는 생성물, 손 편집 금지.
- Deploy target: Cloudflare Pages (push 시 자동 배포). 전역 라우팅 규칙(Step 2/3)이 이 문서의 배포 URL을 목적지로 가리킨다.
- Out of scope: hook 강제, 스킬 갱신(Step 2), 사이트 UI 변경.

## Verification

- [x] `node scripts/generate-llms-txt.mjs` 재생성 + 내장 링크 무결성 검증 PASS (43 assets)
- [x] 로컬 생성물 확인: `public/llms/docs/design-system/entry-protocol.md` 존재, llms.txt 최상단 섹션 노출
- [x] 실패 모드 probe: 배포본 오경로 fetch가 200+index.html 반환하는 silent fallback **적발** → 404.html 봉합 (배포 후 재확인 항목 ↓)
- [ ] 배포 후: `curl https://ui.askewly.com/llms/docs/design-system/entry-protocol.md` 200 + 실제 md 내용, 오경로 404 (push는 사용자 승인 후 — deploy batching)
