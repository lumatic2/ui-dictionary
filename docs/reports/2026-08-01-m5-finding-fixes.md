# M5 — finding 소수리: search title + llms 정합 게이트 (완료)

- Date: 2026-08-01 · Plan: `plans/2026-08-01-m5-finding-fixes.md` · Changeset: `changesets/20260801-m5-finding-fixes/`

## 1. 결과

`/search` 런타임 title 이 "Search — Askewly Design" 으로 정합됐고(원인: page-meta 에 search 유형 부재 — URL 스킴상 검색이 Patterns 모드를 상속), llms 재생성 누락을 잡는 정합 게이트(`scripts/check-llms-sync.mjs`)가 사이트 lint 체인에 들어갔다. 로고 포커스 링 finding 은 실측으로 오탐 판정(키보드 Tab 시 브랜드 보라 2px 링 정상 — programmatic focus 가 :focus-visible 을 안 태운 측정 아티팩트), 코드 무변경 기록.

## 2. 이슈와 해결

- llms 게이트의 EOL 오탐 잠재 리스크(생성기 LF 고정 vs autocrlf) — fresh 검증자 지적을 `.gitattributes` `eol=lf` 고정으로 선제 차단.
- 게이트가 작업 트리를 더럽히지 않도록 설계: 검사 전 dirty 거부(exit 2) + 판정 후 부산물 원복 + untracked 검출.
- 완료 감사: 드리프트 없음(계획 그대로 2 step). 순조로움 의심 — FAIL 경로를 말로 안 믿고 실제 소스 오염→FAIL→원복→PASS 왕복으로 실증.

## 3. 증거

- Evidence: `evidence/finding-cleanup/m5-finding-fixes.md`
- 실표면: 실브라우저 4라우트 title assertion(search/patterns/docs/term 전부 기대값 일치 확인) + 게이트 FAIL 경로 실행에서 exit 1 과 어긋난 파일 경로 출력을 실제로 관측, PASS 복귀 exit 0.
- 재현: `cd examples/ui-vocabulary-site && npm run build && npx vite preview` 후 `/search?q=button` title 확인 · `node scripts/check-llms-sync.mjs`.
- 크기 회고: changeset 1개·커밋 2건 — steps=2 계획 정합. title 수리와 게이트 신설은 독립 응집 변경 + 통합 검증(lint 체인) 보유.
