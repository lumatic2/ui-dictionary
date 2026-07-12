# 20260712 에디터 크롬 전면 다크 모드

Target: QA2 Step 3 — 유지보수 (ROADMAP 후보 소진).

## Scope

- 캔버스 token-mode 토글(Default/Dark)이 캔버스 콘텐츠만 바꾸고 에디터 크롬은 라이트 고정이던 것을, 같은 토글 하나로 크롬까지 다크 전환되게 확장.
- `scripts/generate-editor-tokens.mjs`가 SSOT(askewly.tokens.json) dark 모드를 두 번째 패스로 해석해 `.app-shell[data-ad-mode="dark"]` 오버라이드 블록을 생성 (`src/editorTokens.css` 재생성, semantic `--ad-*` 19종).
- `App.tsx`가 `history.present.tokenSetId`에서 `data-ad-mode`를 파생 — 새 상태·설정 시스템 없음. fixed-dark `.inspector`는 의도대로 유지.
- 테스트: 기존 token-mode 테스트에 app-shell `data-ad-mode` default→dark→default 왕복 assertion 추가.

## Verification

- [x] `cd apps/agent-design && npm test -- --run` — 10 files, 73/73 PASS (오케스트레이터 게이트 재실행 포함)
- [x] `npm run build` — exit 0
- [x] 다크 전환 관측 — dev 서버 브라우저에서 token-mode Dark 전환 시 크롬 다크 적용 (아래 Result 참조)

## Result

Completed. token-mode 단일 컨트롤이 캔버스와 에디터 크롬을 함께 테마한다. 잔여 token-exception 리터럴(리사이즈 핸들 등 소형 액센트)은 코스메틱으로 목록만 유지.
