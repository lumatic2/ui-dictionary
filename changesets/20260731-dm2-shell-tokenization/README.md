# changeset: dm2-shell-tokenization

- Milestone: DM2 — 사이트 셸 토큰 치환 + 하드코딩 색 스캐너 (plan: `plans/2026-07-31-dm2-shell-tokenization.md`)
- Date: 2026-07-31

## step-1 — 하드코딩 색 스캐너 + baseline

- `examples/ui-vocabulary-site/scripts/lint-hardcoded-colors.mjs` 신설 — 리터럴 팔레트 Tailwind 클래스(전 prefix × 팔레트/white/black, variant 접두 포함)+hex 검출. allowlist(marketing-section-preview·variation-demos), 줄/직전줄 `hardcoded-color-ok` opt-out, `--max N` 게이트(초과 exit 1)·`--list`.
- `package.json` `lint:colors` 등록.
- baseline 실측: **998건/21파일** — App 360·home-page 321·article-layout 170·palette-generator 68(콘텐츠 데이터)·term-visual 55 등. 오탐 표본 검수 3건(주석 제외·데이터 hex 진성 검출) PASS, `--max 900` 게이트 exit 1 동작 확인.

## step-2 — App.tsx·home-page.tsx 토큰 치환 (sonnet 병렬 위임 2기)

- **home-page.tsx 321→0**: 실사이트 크롬(다크 히어로 카피·푸터·검색 그림자)은 인버스 매핑(`bg-black`→`bg-foreground`·`text-white`→`text-background`) 포함 치환, Atlas/쇼케이스 데모 캔버스 208줄은 의도적 고정색 마커.
- **App.tsx 360→147**: 213건 치환(slate 계열→foreground/muted-foreground/background/card/border, 스크림→`bg-foreground/N`, 인버스 버튼→`bg-foreground text-background`). 잔여 147 = Google/Kakao 브랜드 hex(마커)·상시 어두운 코드 블록 3곳(마커)·복사용 스니펫 문자열(~100, 콘텐츠 — 치환 제외 판단)·정확 대응 없는 유채색.
- 오케스트레이터 독립 검증: 스캐너 재실행 일치·build(755 routes)·tsc PASS + **스크린샷 대조**(로컬 preview vs 실배포=치환 전): 홈 상단·다크 쇼케이스+푸터·검색(1440px), 홈 390px — 전부 시각 무손실. 카카오 `#fee500` 마커 실검수.

## step-3 — 잔여 치환 + 게이트 통합 (0 달성)

- article-documentation-layout 170→0 (sonnet 위임 — 세션 재시작으로 에이전트 중단됐으나 작업은 디스크에 완결 착지, 오케스트레이터가 검증 인수), 소수 12파일 0 (dialog·sheet 스크림=shadcn 관례 마커, slider thumb→`bg-background` 치환), term-visual = allowlist(전수 판독: 미니목 콘텐츠 색뿐).
- 스캐너 확장: 블록 예외 `hardcoded-color-ok-start/end` — App.tsx 복사용 스니펫 함수(getMarketingSnippet)·LegacyDocsElementPreview 데모 렌더러 래핑. App.tsx 잔여 강조색 9곳 사유 마커(JSX 단일 자식 괄호 안 주석 2건은 인라인 주석으로 정정 — tsc 적발).
- **게이트: `lint:colors` = `--max 0`, `npm run lint` 파이프라인 통합 — total 0 violations.** verify 비악화(색 0·타이포 7 기존분)·build·tsc·docs 허브/아티클 스크린샷 대조·콘솔 0에러. 상세 → `evidence/dark-mode/dm2-shell-tokenization.md`.
