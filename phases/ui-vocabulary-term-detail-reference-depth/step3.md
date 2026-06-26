# Step 3: Detail Smoke And Deploy Verification

## 읽어야 할 파일

- `docs/ui-vocabulary/deployment.md` — 왜: `ui-dictionary` Git integration 배포 경로와 검증 대상 URL이 적혀 있다.
- `CLAUDE.md` — 왜: Chrome 검증 및 프로젝트 작업 규칙을 따른다.
- `phases/ui-vocabulary-term-detail-reference-depth/index.json` — 왜: 이전 step 완료 summary를 확인하고 최종 상태를 갱신한다.

## 작업

마일스톤 통합 검증을 수행한다.

- source validation, data generation, build, lint를 실행한다.
- 로컬 개발 서버에서 Chrome smoke를 수행한다.
- smoke 대상은 최소 `select`, `dialog`, `toast`, `switch`, `tabs` detail drawer다.
- 확인 항목: source links, source notes, related comparison cards, prompt copy status, card count 328, console error 없음.
- 변경사항을 커밋하고 `ui-dictionary` remote에 push한다.
- Cloudflare deployment success를 확인하고 `https://ui.askewly.com/` 렌더 smoke를 수행한다.

## Acceptance Criteria

```bash
python scripts/validate-ui-vocabulary.py
cd examples/ui-vocabulary-site && npm run build && npm run lint
```

Chrome smoke:

```text
local: http://127.0.0.1:5173/
production: https://ui.askewly.com/
```

## 검증 절차

1. AC 커맨드 실행.
2. `$chrome:control-chrome`으로 로컬과 배포 URL을 확인한다.
3. Cloudflare Pages latest deployment가 success인지 확인한다.
4. phase index step 3을 completed로 갱신한다.
5. ROADMAP milestone DoD 충족 여부를 보고 milestone completion sync를 수행한다.

## 금지사항

- standalone Playwright부터 쓰지 마라. 이유: 홈 AGENTS 규칙상 Chrome control이 frontend render verification의 기본값이다.
- Cloudflare token 값을 출력하지 마라. 이유: 외부 토큰은 로그/채팅 노출 금지다.
