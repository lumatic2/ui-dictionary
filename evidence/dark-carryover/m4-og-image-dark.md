# Evidence — M4: og-image 3안 품질 비교·선택 교체

- Date: 2026-08-01 · Plan: `plans/2026-08-01-m4-og-image-dark.md` · Changeset: `changesets/20260801-m4-og-image-dark/`

## step-1 — 시안 생성·비교

| 항목 | 결과 |
|---|---|
| 생성 경로 | `codex exec -` stdin 지시문(내장 image_gen) — 프롬프트 전문 `tmp/og-image/prompt-dark.txt`·`prompt-light.txt` (재생성 소스) |
| 산출물 | `og-dark.png`·`og-light.png` 각 1200×630 (PIL 실측) — 워드마크·태그라인 텍스트 왜곡 0 |
| 3안 시트 | `tmp/og-image/compare-sheet.png` — A(다크)/B(라이트)/C(기존 SVG 렌더) × 라이트/다크 채팅 목업 |
| 기존 SVG 판정 재료 | 한국어 카피 잘림("…시스템으") + 태그라인이 목업에 가려짐 + 구 teal 브랜딩 — QA1 영어 단일 정책 불일치 |
| 포맷 근거 | research `2026-08-01-dark-carryover-goal-inventory.md` §C — SVG 를 지원 포맷으로 명시한 규격 없음(FB·LinkedIn 접근일 2026-08-01) |
| 사용자 선택 | (관측 게이트 대기) |

## step-2 — 메타 배선 (선택 후 기입)

## step-2 — 메타 배선 + 마감 검증

| 항목 | 결과 |
|---|---|
| 사용자 선택 | **A — imagegen 다크** (2026-08-01, 3안 목업 비교 관측) |
| 에셋 | `public/og-image.png` 1200×630 (823KB — FB 8MB 상한 내) · 구 `og-image.svg` 삭제(git 이력 보존) |
| 메타 | `index.html` og:image/twitter:image → **절대 URL** `https://ui.askewly.com/og-image.png` + `image/png` (구 상대경로 `/og-image.svg` 는 크롤러 호환 불리 — 절대 URL 로 함께 교정) |
| dist 검증 | 755 라우트 재프리렌더 — html 내 `og-image.svg` 참조 **0**, `og-image.png` 셸 상속 확인, `dist/og-image.png` 존재 |
| 게이트 | `npm run lint`(스캐너 포함) PASS · build PASS |
| 배포 후 확인 | push 8ffa52d → CF Pages 전파(~5분) — `https://ui.askewly.com/og-image.png` **200 + Content-Type image/png + 823530B** · 라이브 meta 절대 URL 확인 · 카드 디버거(opengraph.xyz) 가 신규 PNG 를 해석·FB 미리보기 렌더(스크린샷 `tmp/og-card-debugger.png`) |
