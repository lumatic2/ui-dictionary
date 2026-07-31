# PLAN — M6: 타이포 스케일 전수 등재 + Tailwind 배선 (finding 정리 2/2)

> 생성: 2026-08-01 · 갈래: product 기능/화면(토큰 SSOT) · scope: 실화면이 쓰는 타이포 단계를 SSOT 에 전수 등재하고 Tailwind text-* 변수로 배선(렌더 값 무손실) — "화면이 스케일 밖에서 빌려 쓰는" 상태를 끝낸다. goal `finding-cleanup` 2번 milestone.
Status: approved (사용자 승인 2026-08-01 "ㄱㄱ" — 연쇄 M5→M6 일괄 승인)

## 북극성 → milestone → step (위계)
- **북극성**: Askewly Design (← `CLAUDE.md` 「북극성」 절) — 색에 이어 타이포도 "SSOT 가 실물을 기술한다". M2 색 전수 승격과 같은 원칙.
- **goal**: `finding-cleanup` · **milestone**: M6 (M5 완료 후 연쇄).
- **리서치 입력**: 조사 불요 — M1 실측이 계획 입력: `evidence/carryover-maintenance/m1-closeout.md` §step-2 임계 재산정 표(3화면 구성: 10/12/14/16/20/30/40/48 + term-page 의 72). 실사용 스케일 = **10·12·14·16·20·30·40·48·72 의 9단계**, 기존 SSOT 5단계(14/16/20/28/40) 중 `xl`(28) 은 실화면 미사용.

## Scope Boundary
- **포함**: ① `tokens/askewly.tokens.json` typography.scale 을 실사용 9단계로 확장(신규: 10·12·30·48·72 — 값은 화면이 이미 렌더하는 Tailwind 기본값 그대로) ② `generate-tokens.mjs` FONT_SIZE_MAPPINGS 확장 → tokens.css 재생성 ③ `index.css` `@theme` 에 Tailwind `--text-*` 배선 — **값이 Tailwind 기본값과 동일한 단계만**(text-xs 12·text-3xl 30·text-5xl 48·text-7xl 72 등: 클래스 무변경·값만 SSOT 경유, 렌더 무손실). 10px 는 Tailwind 기본 유틸이 없으므로 신규 `text-2xs` 유틸 제공(기존 `text-[10px]` 임의값 치환은 실사용 지점만) ④ 문서 표면(Foundations Typography 아티클)·llms 반영.
- **제외**: `xl`(28)·`2xl`(40) 등 기존 SSOT 이름 제거·개명(record 유지 — llms 소비자 호환, 미사용 사실만 $description 에 기록) · Tailwind 기본값과 값이 **다른** 단계의 배선(예: SSOT lg=20 vs Tailwind lg=18 — 렌더가 바뀌므로 금지, SSOT 자체 변수(--font-size-*)로만 유지) · 화면 타이포 재설계 · verify 임계(7) 변경.
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / user_stopped
- rollback/cleanup: additive 토큰 + @theme 몇 줄 — 커밋 단위 revert. 무손실 계약 위반 발견 시 해당 배선 줄만 제거.

## 스캐폴딩 결정
- source-of-truth: `tokens/askewly.tokens.json` (M2 와 동일 — 생성물 손편집 금지, llms 는 `generate-llms-txt.mjs` 별도 실행. M5 의 llms 정합 게이트가 이걸 감시).
- 검증: 재생성 diff 검수(기존 값 무변경) + **렌더 무손실 계약**: 배선 전후 대표 화면(colors·get-started·recipe-gallery·용어 상세) 스크린샷 대조 + computed font-size 표본 대조(text-5xl 요소가 여전히 48px 등) + `npx @askewly/design verify` 비악화(위반 0 유지) + site lint(M5 llms 게이트 포함)·build PASS.
- 배포/운영: goal 마감 일괄 배포 — 요약 보고 후 사용자 승인.
- 자기선언 도메인 — **렌더 무손실 계약**: 배선은 Tailwind 기본값과 동일 값 등재만 허용. 어떤 화면의 computed font-size 도 바뀌면 안 된다(바뀌는 배선은 스코프 밖 — finding 큐).
- 검토 후 제외: 화면들의 `text-[10px]`·`text-[40px]` 류 임의값을 전수 치환 — 실사용 지점 소수만 신규 유틸로 치환하고 대량 치환은 이득 대비 diff 과다(콘텐츠 데모 다수).

## 결정 로그
- status: resolved
- **방향 = 전수 등재 + 배선** (사용자 확정 2026-08-01): 등재만/확장 안 함 기각.
- **기술 결정**: ① 신규 단계 이름은 Tailwind 정합(2xs=10·xs=12·3xl=30·5xl=48·7xl=72) — 기존 SSOT 5이름은 하위호환 유지, `xl`(28) 은 "실화면 미사용" $description 기록 ② 배선 안전선 = 값 동일 단계만(위 무손실 계약) ③ 40 은 Tailwind 4xl(36)과 달라 배선하지 않고 SSOT `2xl` 변수로만 유지(실화면은 `--font-size-2xl` 경유 확인 후 필요 시 그대로).
- 그 외 새 사용자 소유 결정: 없음.

## Step 트리

- [x] **step-1 — SSOT 확장 + 재생성 + @theme 배선**
  - Artifact: typography.scale 9단계 확장 → `node scripts/generate-tokens.mjs`(FONT_SIZE_MAPPINGS 확장 포함, DESIGN.md frontmatter 동반 재작성) → `index.css` `@theme` `--text-*` 배선(값 동일 단계) + `text-2xs` 신설 → `node scripts/generate-llms-txt.mjs`.
  - Files: write tokens/askewly.tokens.json, scripts/generate-tokens.mjs, DESIGN.md(생성), examples/ui-vocabulary-site/src/tokens.css(생성), examples/ui-vocabulary-site/src/index.css, examples/ui-vocabulary-site/public/llms*(생성). read M1 closeout 표, node_modules/tailwindcss/theme.css(기본값 대조).
  - Risk: 기계적 (additive + 값 동일 배선 — computed 대조로 즉시 검증)
  - Dependencies: 없음
  - Verify: 재생성 diff 신설분만 + 배선 단계별 "SSOT 값 == Tailwind 기본값" 표 대조 + build PASS + 대표 화면 computed font-size 표본(48·72·30·12) 무변화.
  - Failure probe: `@theme` 의 `--text-*` 재정의가 line-height 짝(`--text-5xl--line-height` 류)을 깨뜨리는지 — Tailwind v4 는 크기·행간 쌍 변수 구조라 크기만 덮으면 행간이 무너질 수 있음. 대표 헤딩의 computed line-height 전후 대조 필수.
  - Commit: changeset `m6-typography-scale` (README 절: step-1).

- [ ] **step-2 — 문서 표면 반영 + 통합 검증 (M6 마감)**
  - Artifact: Foundations Typography 아티클(documentation-pages.ts)의 스케일 서술을 9단계로 갱신 + 실사용 `text-[10px]` 지점의 `text-2xs` 치환(셸 소수) + 통합 검증 + `evidence/finding-cleanup/m6-typography-scale.md`.
  - Files: write examples/ui-vocabulary-site/src/lib/documentation-pages.ts, (실사용 지점) src/components/*.tsx 소수, evidence/finding-cleanup/m6-typography-scale.md. read 전 단계 산출물.
  - Risk: 기계적
  - Dependencies: step-1
  - Verify: `npm run lint`(색·llms 게이트 포함)·build PASS + verify 비악화(위반 0·면제 4 유지) + 대표 4화면 스크린샷 무손실 + Playwright 콘솔 0에러.
  - Failure probe: text-2xs 치환 지점이 마커 면제 파일(집합 파일) 계수에 영향 주는지 — verify 출력의 면제 목록·위반 수 전후 동일 확인.
  - Commit: changeset `m6-typography-scale` (README 절: step-2).

## 검증/DoD
- **DoD**: SSOT typography.scale 이 실사용 9단계를 전수 기술하고 Tailwind text-* 가 값 동일 단계에서 SSOT 를 경유하며(렌더 무손실 — computed 표본 대조), 문서·llms 정합 + verify 위반 0 유지. 실패 모드: line-height 쌍 파손·computed 변화가 대조에서 잡힌다.
- **Evidence**: `evidence/finding-cleanup/m6-typography-scale.md`
- **회귀 게이트**: 대표 4화면 스크린샷 무손실 + verify·lint·build PASS + 콘솔 0에러.

## 수치 출처
- 실사용 스케일 9단계(10/12/14/16/20/30/40/48/72) = `evidence/carryover-maintenance/m1-closeout.md` §step-2 임계 재산정 표(2026-08-01 실측) + 반응형 쌍 `text-5xl md:text-7xl`(48·72). Tailwind 기본값 대조 커맨드: `grep -oE -- "--text-(2xs|xs|3xl|5xl|7xl)[^;]*" examples/ui-vocabulary-site/node_modules/tailwindcss/theme.css` (step-1 Verify — tailwindcss 는 사이트 워크스페이스에만 설치, 루트 상대경로 금지. fresh 검증자 실측: xs=12·3xl=30·5xl=48·7xl=72 + 각 `--text-*--line-height` 쌍 존재, `--text-2xs` 부재).

## finding 큐
- (실행 중 발견 항목)

## 진행 로그
- 2026-08-01 작성.
- 2026-08-01 fresh 검증자(sonnet) 반영 — M6 tailwind theme.css 경로 정정(사이트 워크스페이스), M5 llms 게이트 EOL 오탐 리스크에 .gitattributes 선제 고정 추가. 사실 검증 전건 정확 판정.
- 2026-08-01 step-1 실행 노트 — 신규 단계는 rem 등재(px 강제 시 사용자 폰트 확대에서 렌더 변화 — 무손실 계약 엄밀 해석, 기술 결정 보강).
