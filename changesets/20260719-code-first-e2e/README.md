# changeset: headless code-first E2E (RC2 step 2)

- Date: 2026-07-19
- Plan: `plans/2026-07-19-rc2-code-first-contract.md`
- Evidence: `evidence/recipe-code-reuse/rc2-agent-e2e.md` (병행 세션 3시도 기록 포함 — 2차 코드출발 미발화 FAIL → STOP 백링크·공통 1.5단계 계약 강화(1fcdfd3) → 3차 PASS)

## Result

- Claude headless가 `stat-summary-grid` registry content를 verbatim 이식했다.
- 이식 코드는 색 리터럴 0이며, 소비 프로젝트 semantic token 5개로 forest/warm palette를 적용했다.
- 에이전트 내부 npm 권한 실패를 기록한 뒤 root verifier가 build·Playwright·live curl을 독립 확인했다.
- RC2 계약의 Windows CRLF 백링크 주입 결함을 수정하고 87개 llms 자산을 재생성했다.

## Verification

- `node scripts/generate-llms-txt.mjs` — 87 assets PASS.
- `npm --prefix examples/ui-vocabulary-site run build` — PASS.
- 격리 소비 앱 `npm run build` — PASS.
- Python Playwright — 화면 텍스트·forest token·console errors 0 PASS.
- live `llms.txt`와 registry asset — HTTP 200.

## Cleanup

- Vite 잔여 프로세스 3개는 명령행 확인 후 종료했다.
- `tmp/rc2-agent-e2e`는 gitignored 재생성 가능 자원이나 현재 실행 정책이 재귀 삭제를 차단해 로컬에 남았다.
