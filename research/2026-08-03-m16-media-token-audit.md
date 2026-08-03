# M16 실측 — 슬라이드 파이프라인의 토큰 SSOT 소비 여부

- Date: 2026-08-03 (접근·grep 실측 전부 2026-08-03)
- 소비처: `plans/2026-08-03-m16-media-token-audit.md` step-1 (M16 · 매체 통합 검증)
- 판정 대상 주장: 북극성 「성공 모습」 — "화면 UI든 슬라이드·지면 산출물이든, **같은 토큰 SSOT에서 출발**하되 매체별 게이트를 각각 통과한다" (`CLAUDE.md`)
- 실측 기준: SSOT = `tokens/askewly.tokens.json` (생성물 `DESIGN.md` frontmatter로 대조) · 슬라이드 정본 = custom-skills `promoted/presentation-slides-yusung` (배포본·덱 사본 drift 별도 검사)

## 결론 요약

**슬라이드 파이프라인은 토큰 SSOT를 소비하지 않는다 — 소비 지점 0건.** 스킬 테마 3종(dark/light/askewly) 29변수 전수가 수기 hex이고, SSOT와 값 일치 0건·기계 파생 0건·참조 배선 0건이다. 다만 파이프라인 *내부* 규율은 건강하다(export가 theme.mjs 단일 출처 판독, 덱 사본 drift 없음) — 문제는 그 단일 출처가 레포 SSOT에 연결돼 있지 않다는 것 하나다. 그리고 이 분리가 결함인지 의도인지를 가르는 문서 근거가 양쪽 다 존재한다(§5).

## 1. 스킬 테마 층 — askewly 테마 29변수 전수 대조표

출처: `custom-skills/promoted/presentation-slides-yusung/templates/src/theme.mjs` L74~101 (askewly), 변수 집합 정의 = `REQUIRED_THEME_VARS` L141~150 (29종 — canonical 3종·custom 트랙 공통 계약).

분류 기준: **일치**(값 동일) / **파생**(기계 변환·참조 관계 존재) / **역할 평행**(이름·역할만 대응, 값 무관) / **대응 부재**(SSOT에 해당 역할 토큰 자체가 없음). SSOT hex는 oklch→sRGB 근사(≈)임.

| # | 테마 변수 | askewly 값 | SSOT 대응 후보 (semantic) | SSOT 값 | 분류 |
|---|---|---|---|---|---|
| 1 | --bg-primary | #F4F3EE (웜 크림) | surface.base = gray.1 | ≈#FBFBFB (뉴트럴) | 역할 평행 |
| 2 | --bg-card | #FFFDF7 | surface.raised = white | #FFFFFF | 역할 평행 |
| 3 | --surface-raised | #FFFFFB | surface.overlay = white | #FFFFFF | 역할 평행 |
| 4 | --border-card | #D8D0C1 (웜) | border.default = gray.6 | ≈#DBDAE1 (쿨) | 역할 평행 |
| 5 | --text-primary | #15130F (웜 블랙) | text.default = gray.12 | ≈#1B1A20 (쿨) | 역할 평행 |
| 6 | --text-secondary | #4A463D | text.secondary = gray.11 | ≈#3B3A42 | 역할 평행 |
| 7 | --text-muted | #777164 | text.muted = gray.9 | ≈#6E6D78 | 역할 평행 |
| 8 | --text-sub | #2B261E | (해당 semantic 없음) | — | 대응 부재 |
| 9 | --accent-start | #2F4B7C (네이비) | action.primary = askewly.violet | #6F2DBD | 역할 평행 |
| 10 | --accent-end | #C65A3B (테라코타) | action.secondary = askewly.orchid | #A663CC | 역할 평행 |
| 11 | --accent-gradient | (9·10 합성) | (없음) | — | 대응 부재 |
| 12 | --accent-soft | #E8F0ED | emphasis.surface = indigo.50 | ≈#EEF2FE | 역할 평행 |
| 13 | --accent-border | #AEC5C0 | border.accent = askewly.lavender | #B298DC | 역할 평행 |
| 14 | --shadow-accent | rgb(47 75 124/.13) | (없음) | — | 대응 부재 |
| 15 | --card-gradient | #FFFDF7→#EEF5F1 | (없음) | — | 대응 부재 |
| 16 | --nav-bg | rgb(244 243 238/.96) | (없음 — 내비 계열 전무) | — | 대응 부재 |
| 17 | --nav-border | #D8D0C1 | (없음) | — | 대응 부재 |
| 18 | --nav-accent | #2F4B7C | (없음) | — | 대응 부재 |
| 19 | --nav-hover | #C65A3B | (없음) | — | 대응 부재 |
| 20 | --nav-disabled | #ACA493 | (없음) | — | 대응 부재 |
| 21 | --input-bg | #EAE4D8 | (component 층에 input 없음) | — | 대응 부재 |
| 22 | --option-bg | #FFFDF7 | (없음) | — | 대응 부재 |
| 23 | --hint-bg | rgb(20 17 13/.85) | (없음) | — | 대응 부재 |
| 24 | --chart-1 | #2F4B7C | (차트 팔레트 전무) | — | 대응 부재 |
| 25 | --chart-2 | #2F9E85 | (없음) | — | 대응 부재 |
| 26 | --chart-3 | #C65A3B | (없음) | — | 대응 부재 |
| 27 | --chart-4 | #7B689B | (없음) | — | 대응 부재 |
| 28 | --font-main | Pretendard | typography.font.sans = Geist, Noto Sans KR | — | 역할 평행 |
| 29 | --font-mono | JetBrains Mono | typography.font.mono = Geist Mono | — | 역할 평행 |

**집계: 일치 0 · 파생 0 · 역할 평행 13 · 대응 부재 16.** (dark/light 테마도 같은 29변수 구조·수기 hex — dark accent #8b5cf6 은 브랜드 violet 에 가장 근접해 *보이지만* Tailwind violet-500 기본값이지 SSOT #6F2DBD 가 아니다. theme.mjs L27.)

스킬 전체에서 SSOT 브랜드 hex 검색 0건: `grep -ri '6F2DBD\|A663CC' promoted/presentation-slides-yusung/` → 0 (2026-08-03 실행).

## 2. 파이프라인 내부의 값 출처 (스킬 내부 규율)

- **css.mjs**: hex 하드코딩 12건 — 전부 테마별 스코프 블록(`.theme-askewly` 등)에서 테마 팔레트 에코(#E8F0ED·#AEC5C0·#2F9E85 등, L600~616). 테마 밖 독자 팔레트는 없음. 단 theme.mjs 값의 **사본**이라 테마 수정 시 이중 갱신 지점.
- **export-pptx.mjs**: L28~50 — `THEME_ROOTS` 동적 import + custom 이면 덱 `content/theme.json` vars 판독. 헤더 주석에 "팔레트는 theme.mjs/theme.json 판독(하드코딩 금지)" 계약 명문. **스킬 내부는 단일 출처 규율이 서 있다.**
- **SP2 custom 테마 트랙** (theme.mjs L136~172): `meta.template:"custom"` + 덱 로컬 `theme.json` 으로 29변수 전건 주입 — **SSOT 파생 테마를 스킬 무변경으로 주입할 수 있는 기존 인입점.** 판정 A 의 구현 경로가 이미 뚫려 있다는 뜻.

## 3. 실증 덱 (decks/askewly-design-intro)

- `content/slides.json` meta: `"template": "askewly"` — canonical 테마 사용, custom 트랙 아님.
- 덱 로컬 `tools/src/theme.mjs` vs 스킬 소스: **IDENTICAL** (CRLF/LF 개행만 차이 — `diff --strip-trailing-cr` 통과). HU4 가 우려한 구판 사본 drift 없음.
- 배포본 `~/.claude/skills/.../theme.mjs` vs 소스: IDENTICAL (fresh 검증자 2026-08-03 diff — plan 진행 로그). **failure probe 결과: drift 미발생** — DoD 실패 모드 요건은 "정상 확인 기록"으로 충족.

## 4. 문서층 — 토큰 출발점 서술 유무

| 문서 | 토큰 출발점 서술 | 실측 |
|---|---|---|
| `CLAUDE.md` 북극성 「성공 모습」 | **"같은 토큰 SSOT에서 출발"** — 검증 대상 주장 | 있음(주장만) |
| `docs/design-system/medium-taxonomy.md` | 발표(deck) 행 게이트 = 캔버스·대비·옵트인 통설뿐 — 토큰 조건 없음. **화면 행에만** "색·크기가 semantic 토큰을 거치는가" 게이트 존재(L22·24) | 없음 |
| `docs/design-system/slide-spec.md` | 캔버스·대비·통설 등급만 — 토큰/SSOT 언급 0건 (grep 실측) | 없음 |
| `methodology/slide-production.md` | HTML 정본·export 결정표 — 토큰 출발점 언급 없음 | 없음 |
| `CLAUDE.md` 「하지 않는 것」 | **"화면용 토큰을 지면 산출물에 그대로 옮기지 않는다. 매체가 다르면 게이트도 다르다"** (2026-07-20 어록 PDF 사고 → medium-taxonomy 계기) | 반대 방향 근거 |

즉 게이트 문서들은 "출발점"을 한 번도 정의한 적 없고, 북극성 앞절(같은 SSOT 출발)과 「하지 않는 것」(화면 토큰 이식 금지)이 해석 없이 긴장 상태로 공존한다.

## 5. 판정 후보 A/B — 근거·비용

**A. 슬라이드 테마는 SSOT 파생이어야 한다 (현행 = 미배선 결함)**
- 근거: ① 북극성 앞절의 문자적 의미 — "같은 토큰 SSOT에서 출발" ② 브랜드 일관성 — 사이트(violet 계열)와 공식 소개 덱(네이비·테라코타)이 지금 서로 다른 브랜드로 보임 ③ 구현 인입점 기존재 — SP2 custom 트랙으로 `tokens → theme.json` 생성기만 만들면 스킬 소스 무변경(§2).
- 비용: 29변수 중 16종이 SSOT에 대응 토큰 부재(§1 — 차트 4·내비 5·input/hint 등) → 생성기 전에 **SSOT에 발표 매체 파생 규칙·누락 역할 확장**이 선행돼야 함. 별도 goal 그릇(이번 반나절 밖). 또한 현행 크림 팔레트는 사용자 관측을 여러 라운드 통과한 자산(PB2·HU4) — 교체는 관측 게이트 재통과 필요(QA1 교훈: 취향 변경은 실물 관측 먼저).

**B. 발표 매체는 독립 팔레트가 의도다 (현행 = 분리 선언 누락일 뿐)**
- 근거: ① 「하지 않는 것」의 "화면용 토큰을 지면에 그대로 옮기지 않는다" — 매체 분리는 이미 시스템 원칙 ② 어록 PDF 사고(2026-07-20)가 이 원칙의 실측 근거 ③ 현행 askewly 발표 팔레트는 발표 매체 관측(프로젝터 대비·지면 관습)을 거쳐 살아남은 값.
- 비용: ① slide-spec 에 「토큰 출발점」 절로 분리를 *선언*해야 함(지금은 무선언 방치 — 이번 step-2 그릇 안) ② 북극성 앞절 문구가 실태와 어긋난 채 남음 — "같은 SSOT에서 출발"을 조정하는 건 사용자 소유(제안만 가능).
- 절충 변형 **B′**: 독립 팔레트 유지하되 브랜드 앵커 1~2변수(예: accent 계열)만 SSOT 참조로 배선 — 완전 분리도 완전 파생도 아닌 중간. 비용은 B + 소형 배선.

## 부록 — 검증 표본 (Verify 재확인용)

- theme.mjs L75 `--bg-primary: #F4F3EE` · L83 `--accent-start: #2F4B7C` · L84 `--accent-end: #C65A3B` — grep 재확인 일치 (2026-08-03).
- `tokens/askewly.tokens.json` violet #6F2DBD·orchid #A663CC 존재 (fresh 검증자 L25·L26 확인).
- export-pptx.mjs L29 `THEME_ROOTS` import · L50 fallback — grep 재확인 일치.
