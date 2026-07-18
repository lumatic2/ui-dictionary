# RC1 — registry 파이프라인 E2E 실측 (2026-07-19)

## Step 1 — 빌드·전수·실패 경로

- 54개 실사: 순수 29 / 결합 25 (판정 근거: import 허용면 — react·lucide-react·`@/components/ui/*`·`@/lib/utils`)
- 1차 배치 27 자산 빌드 (`generate-registry: OK — 27 assets`) — 인덱스 items=27 일치
- 로컬 정적 서빙 전수 curl 27/27 OK (content·의존 선언 검증)
- Failure probe ①: landing-hero(결합) 등재 시도 → `순수성 위반 — @/components/home-page, @/lib/exposure` + exit 1
- 샘플 검증: cart-drawer → registryDependencies=[button,sheet] · dependencies=[lucide-react] · content 6,588 chars · recipe docs 백링크 + restyle 계약 링크

## Step 2 — 깨끗한 새 프로젝트 이식 실구동 (Close Criteria ②)

- 대상: `stat-summary-grid` (에이전트 소비 경로 — registry JSON fetch → files[].content 파일 쓰기)
- 환경: scratchpad에 신규 `npm create vite`(react-ts) + Tailwind v4 — **사이트 코드 0줄, 자산 JSON만으로 이식**
- 관측: dev 서버 528ms 기동 → 브라우저 렌더 — 제목·범위 라벨·스탯 4종(레이블/값/트렌드 위계)·카드 그리드 전부 정상. semantic 토큰 변수(`--color-background` 등)를 소비 프로젝트가 정의해 적용됨 = cssVars→토큰 리맵 접점 실증
- 스크린샷: `rc1-transplant.png`
- 결합 잔재: 0 (import 에러·콘솔 에러 없음)

## llms 배선

- `generate-llms-txt.mjs`에 "## Code Assets (verified implementations)" 절 — registry 인덱스에서 파생, 27 자산 링크 + 소비 절차 한 줄(fetch→write→deps→**restyle 의무**) + `npx shadcn add` 사람 경로
- 링크 무결성: 기존 integrity check(writtenUrls)에 /r/ 경로 합류 — 백킹 파일 없으면 빌드 실패
- ui.askewly.com curl: push 후 확인
