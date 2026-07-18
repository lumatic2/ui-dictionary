# RC2 headless 코드 출발 E2E

- Date: 2026-07-19
- Worker: Claude headless (격리된 `tmp/rc2-agent-e2e`)
- Verifier: Codex root session
- Asset: `https://ui.askewly.com/r/stat-summary-grid.json`

## 1차 관측 — 정직한 실패

headless 에이전트는 registry의 `files[0].content`를 verbatim 이식하고 프로젝트 토큰을 재결합했지만, 세션 실행 권한으로 npm 명령이 거부되어 자체 `verification.json`에 `build_pass:false`를 기록했다. 실패를 성공으로 덮지 않고 다음 검증 단계로 넘겼다.

## 에이전트 산출

- `src/components/stat-summary-grid.tsx`: registry content와 byte-for-byte 동일.
- component hard-coded hex: 0.
- semantic classes: `text-foreground`, `text-muted-foreground`, `text-primary`, `border` 유지.
- 소비 프로젝트 token remap: warm off-white surface + forest green primary, CSS 변수 5개와 Tailwind 4 `@theme inline` bridge.

## 독립 검증

- `npm install`: 82 packages, vulnerability 0.
- `npm run build`: PASS — 30 modules, JS 195.91 kB, CSS 7.68 kB.
- Python Playwright: `Workspace summary`, `Active workspaces`, `98%` 표시.
- 실제 token: `--primary = oklch(0.45 0.09 150)`.
- Console errors: 0.
- Screenshot: `evidence/recipe-code-reuse/rc2-agent-e2e.png`.

## 실배포

- `https://ui.askewly.com/llms.txt`: HTTP 200, `Code Assets (verified implementations)` 확인.
- `https://ui.askewly.com/r/stat-summary-grid.json`: HTTP 200, `name=stat-summary-grid` 확인.
- 첫 조회는 배포 전이라 404였고, 배포 완료 후 정확한 링크로 재조회해 PASS했다.

## 실패 경로·교정

- 1차 브라우저 검증은 timeout 뒤 남은 Vite 프로세스가 포트를 가로채 Askewly 사이트를 열어 FAIL했다.
- PID command line과 HTML title로 잘못된 서버를 확인·종료하고 `--strictPort`로 재실행해 PASS했다.
- 레시피 백링크 주입은 Windows CRLF에서 heading/frontmatter 탐지가 실패했으며 `\r?\n` 지원 후 87 assets 재생성과 사이트 build가 PASS했다.

## 판정

RC2 DoD 충족: headless 에이전트가 registry 코드에서 출발해 프로젝트 토큰으로 재결합했고, 독립 build·브라우저·실배포 검증이 모두 통과했다.
