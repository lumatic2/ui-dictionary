# DM2 — 사이트 셸 토큰 치환 + 하드코딩 색 스캐너 (완료)

- Date: 2026-07-31 · Plan: `plans/2026-07-31-dm2-shell-tokenization.md` · Changeset: `changesets/20260731-dm2-shell-tokenization/`

## 1. 결과

2026-07-28 다크모드 차단의 원인이 제거됐다. 사이트 셸의 하드코딩 리터럴 색 998건(실측 baseline)이 semantic 토큰 치환 또는 사유 마커로 전건 정리되어 신설 스캐너(`lint:colors --max 0`)가 lint 파이프라인 게이트로 걸렸고, 라이트 모드는 실배포본과의 스크린샷 대조로 시각 무손실이 확인됐다. 이제 셸에 리터럴 색을 넣으면 lint가 막는다.

## 2. 이슈와 해결

- 실측 baseline(998)이 계획 추정(455+α)의 2배 — 스캐너 정규식 커버리지 차(white/black·전 prefix·hex). 계획서에 "스캐너가 정본" 명시해 둔 대로 진행, 회귀 없음.
- step-3 위임 에이전트 2기가 세션 재시작으로 중단 통지 — 디스크 실측 결과 article-layout 170→0 등 작업은 완결 착지, 오케스트레이터가 검증 인수 후 잔여(term-visual·ui 3건·colors-page)를 직접 마무리.
- JSX 단일 자식 괄호 안에 마커 주석을 넣어 구문 파손 2건 — tsc가 적발, 인라인 주석으로 정정.
- 복사용 코드 스니펫 문자열(~100건)은 외부 프로젝트용 콘텐츠라 토큰 치환이 오히려 파손 — 스캐너에 블록 예외(`-start/-end`) 신설로 해소(위임 에이전트의 판단 채택).

## 3. 증거

- Evidence: `evidence/dark-mode/dm2-shell-tokenization.md` — 게이트 표 전건 PASS (스캐너 0·verify 비악화 색0/타이포7 기존분·build 755·tsc·lint 파이프라인).
- 실표면: 로컬 preview vs 실배포(치환 전) 스크린샷 대조 — 홈 상단·다크 쇼케이스·푸터·검색(1440px)·홈(390px)·docs 허브·docs 아티클 픽셀 동일 + Playwright 콘솔 에러 0 — assertion 실평가 통과.
- 재현: `cd examples/ui-vocabulary-site && npm run lint && npm run build && node scripts/lint-hardcoded-colors.mjs --max 0`
- 크기 회고: changeset 1개·커밋 3건(step당 1) — steps=3 계획과 정합, milestone 규모 적정.
