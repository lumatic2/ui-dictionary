# Evidence — DM2: 사이트 셸 토큰 치환 + 하드코딩 색 스캐너

- Date: 2026-07-31
- Plan: `plans/2026-07-31-dm2-shell-tokenization.md`
- Changeset: `changesets/20260731-dm2-shell-tokenization/`

## step-1 — 스캐너 + baseline

| 검증 | 결과 |
|---|---|
| 스캐너 실행 (`lint:colors`) | PASS — baseline 998건/21파일 (App 360·home 321·article 170·term-visual 55 등) |
| 오탐 표본 검수 | PASS — 주석 줄 제외·데이터 hex 진성 검출·ui 프리미티브 1건짜리 실위반 확인 |
| `--max` 게이트 exit code | PASS — `--max 900` 에서 exit 1 |

## step-2 — App.tsx·home-page.tsx 치환 (sonnet 병렬 2기 + 오케스트레이터 검증)

| 검증 | 결과 |
|---|---|
| home-page.tsx | 321→0 (셸 크롬 치환 + 데모 캔버스 마커 208줄) |
| App.tsx | 360→147 분류 잔여 → step-3 에서 0 (블록 예외·강조색 마커) |
| tsc·build | PASS |
| 스크린샷 대조 (로컬 preview vs 실배포=치환 전) | PASS — 홈 상단·다크 쇼케이스·푸터·검색 1440px, 홈 390px 시각 무손실 |
| 브랜드 hex 검수 | PASS — 카카오 `#fee500`·Google 로고 hex 마커 유지 |

## step-3 — 잔여 치환 + 게이트 배선

| 검증 | 결과 |
|---|---|
| article-documentation-layout.tsx | 170→0 (치환+마커) |
| 소수 파일 12건 | 전부 0 (ui/dialog·sheet 스크림은 shadcn 관례 마커, slider thumb `bg-background` 치환) |
| term-visual.tsx | allowlist 등재 — 잔여 55건 전수 판독 결과 미니목 콘텐츠 색(Google 로고 hex·글래스·Light/Dark 병치)뿐, 셸 프레임 위반 0 |
| 스캐너 블록 예외 신설 | `hardcoded-color-ok-start/end` — App.tsx 복사용 스니펫 함수·LegacyDocsElementPreview 데모 렌더러 래핑 |
| **최종 게이트** | **`lint-hardcoded-colors --max 0` → total 0 violations, exit 0** · `npm run lint` = oxlint && lint:colors 배선 |
| design verify 비악화 | PASS — 색 위반 0 유지, 타이포 7건 = SQ1 이월 기존분 그대로 |
| build (755 routes)·tsc | PASS |
| 스크린샷 대조 | PASS — docs 허브·docs 아티클(`/docs/getting-started-setup`, article layout 실표면) 로컬 vs 실배포 픽셀 동일 |
| Playwright 콘솔 | 에러 0 (홈·검색·docs·아티클·용어 상세 순회 누적) |

## 산출물

- `scripts/lint-hardcoded-colors.mjs` (+`lint:colors` --max 0, lint 파이프라인 통합) — allowlist 5(marketing-section-preview·variation-demos·palette-generator·documentation-pages·term-visual), 줄/블록 opt-out
- 셸 치환: App.tsx·home-page.tsx·article-documentation-layout.tsx + 소수 12파일 — semantic 토큰 경유, 라이트 무손실
- 잔여 의도적 고정색은 전건 사유 마커: 브랜드(카카오·구글)·코드 블록 관례·오버레이 스크림·토큰 부재 강조색(finding 큐 등재)
