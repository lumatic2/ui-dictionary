# PLAN — M16: 매체 통합 검증 — 슬라이드 파이프라인의 토큰 SSOT 소비 실측 + 판정

> 생성: 2026-08-03 · 갈래: 매체 통합(북극성 "같은 토큰 SSOT에서 출발" 주장 실증) · scope: 슬라이드 파이프라인(스킬 테마·export 경로·실증 덱·문서층)이 정본 토큰 SSOT 를 실제로 소비하는지 전수 대조하고, 그 결과를 사용자 판정으로 매듭지어 매체 게이트 문서에 기록한다. 단일 milestone(반나절 그릇 — 2026-08-01 핸드오프 보류 후보 C 승격).
Status: approved (사용자 승인 2026-08-03 "ㄱㄱ" — 그릇=실측+판정+기록, 생성기 구현 제외 추천안 확정)

## 북극성 → milestone → step (위계)

- **북극성**: Askewly Design (← `CLAUDE.md` 「북극성」 절) — 성공 모습 "화면 UI든 슬라이드·지면 산출물이든, **같은 토큰 SSOT에서 출발**하되 매체별 게이트를 각각 통과한다"의 앞절이 검증된 적 없다. 게이트(뒷절)는 medium-taxonomy·slide-spec 으로 정본화됐지만, 출발점(앞절)은 주장으로만 남아 있다.
- **goal**: 단일 milestone — 사용자 확정 2026-08-03 "ㄱㄱ" (5-C 매체 통합 검증 승격).
- **사전 실측(2026-08-03, 계획 탐색 중)**: ① 슬라이드 스킬 `presentation-slides-yusung` 의 `askewly` 테마는 수기 hex 팔레트(#F4F3EE 크림·#2F4B7C 네이비·#C65A3B 테라코타, `templates/src/theme.mjs:74~`) — SSOT `tokens/askewly.tokens.json` 의 브랜드 팔레트(#6F2DBD violet 계열)와 값·파생 관계·기계 배선 전부 부재(스킬 전체에 6F2DBD/A663CC 검색 0건). ② `docs/design-system/slide-spec.md`·`medium-taxonomy.md` 에 "토큰 출발점" 서술 없음(캔버스·대비 게이트만). ③ 단 "하지 않는 것" 절의 "화면용 토큰을 지면 산출물에 그대로 옮기지 않는다"(2026-07-20 어록 PDF 사고)와의 긴장 — 괴리가 결함인지 의도적 매체 분리인지는 실측 후 **사용자 판정** 사안.

## Scope Boundary

- **포함**: ① 슬라이드 파이프라인 토큰 소비 지점 전수 실측(스킬 테마 3종·css.mjs·export-pptx.mjs 테마 판독·실증 덱 로컬 사본·문서층) + SSOT 대조표 → research doc ② 사용자 판정(A/B) ③ 확정 판정을 `docs/design-system/` 매체 게이트 문서에 기록 + llms 재생성.
- **제외**: 토큰→슬라이드 테마 생성기 구현(판정 A 시 후속 goal 후보로 finding 큐에만) · 슬라이드 테마 색값 변경(관측 없는 팔레트 교체 금지 — QA1 교훈) · 북극성 문구 수정(사용자 소유 — 제안만 가능) · print/pdf 매체(이번 그릇은 발표 매체만) · push(세션 일괄).
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / **decision_required — step-1 완료 후 사용자 판정 게이트(계획된 정지)** / risk_gate / user_stopped.
- rollback/cleanup: 문서·research 커밋 단위 revert. 정본 토큰 데이터·스킬 소스 무변경(실측·기록만).

## 스캐폴딩 결정

- source-of-truth: 토큰 SSOT = `tokens/askewly.tokens.json`(DESIGN.md 는 생성물) · 슬라이드 테마 정본 = custom-skills `promoted/presentation-slides-yusung/templates/src/theme.mjs`(배포본 `~/.claude/skills/...` 은 사본) · 매체 게이트 정본 = `docs/design-system/medium-taxonomy.md`·`slide-spec.md`.
- 검증: step별 Verify + 통합 = 대조표 전수성(테마 변수 누락 0) + `node scripts/check-llms-sync.mjs` PASS + 인용 file:line 표본 실재 확인.
- 배포/운영: 이 레포 문서 커밋만(스킬 소스 무변경). llms 재생성 후 push 는 세션 마감 일괄(사용자 승인 후 — deploy batching).
- 검토 후 제외: 사이트 build·Playwright — 정본 데이터·사이트 코드 무변경이므로 생략(M11 선례 — 생략 사유 기록).

## 결정 로그

- status: resolved
- (주: 계획 층 결정은 소진 — 단 아래 둘째 항은 실측 의존이라 계획된 decision gate 로 이월, 중단점에 선언됨)
- **[추천안 — 승인 질문 포함] 그릇 = 실측 + 판정 + 문서 기록까지.** 생성기 구현(판정 A 시)은 이 milestone 밖 후속 goal 후보 — 검증 그릇(반나절)을 구현 그릇으로 불리지 않는다.
- **[계획된 decision gate — step-1 후] 판정 A/B 는 사용자 소유, 실측 결과 의존이라 사전 소진 불가.** A = "슬라이드 테마는 SSOT 파생이어야 한다" → 후속 goal(테마 생성기) 개설 + 그때까지 현행을 '미배선 결함'으로 등재. B = "발표 매체는 독립 팔레트가 의도" → slide-spec 에 '토큰 출발점' 절로 분리 선언 정본화 + 북극성 앞절 문구 조정은 사용자에게 제안만.
- **기술 결정**: ① 대조 기준층 = 스킬 테마 CSS 변수(`--bg-primary` 등) ↔ SSOT semantic 층(`surface.*`·`text.*`·`accent.*`) — primitive 직대조는 파생 관계 판별이 안 됨 ② 실측 대상에 문서층 포함(북극성·medium-taxonomy·slide-spec·slide-production 의 토큰 서술 유무) — 코드만 보면 "문서가 이미 분리를 선언했는지"를 놓친다 ③ 스킬은 custom-skills 소스를 정본으로 읽고 배포본과 drift 검사만.

## Step 트리

- [x] **step-1 — 토큰 소비 실측 장부 (research)**
  - Artifact: 슬라이드 파이프라인의 색·타이포 값 출처 전수 실측 → `research/2026-08-03-m16-media-token-audit.md` (소비처=이 plan 백링크). 내용: ① 스킬 테마 3종(dark/light/askewly) CSS 변수 전수 ↔ SSOT semantic 토큰 대조표(값 일치/파생/무관 3분류) ② css.mjs·export-pptx.mjs 테마 판독 경로의 값 출처 ③ 실증 덱 로컬 tools 사본의 테마 drift(HU4 교훈 — 덱이 구판 사본을 들고 있을 수 있음) ④ 문서층 4본(북극성 절·medium-taxonomy·slide-spec·slide-production)의 토큰 출발점 서술 유무 ⑤ 판정 후보 A/B 각각의 근거·비용 정리.
  - Files: write research/2026-08-03-m16-media-token-audit.md. read ~/projects/custom-skills/promoted/presentation-slides-yusung/templates/src/{theme,css}.mjs·templates/export-pptx.mjs, tokens/askewly.tokens.json, docs/design-system/{medium-taxonomy,slide-spec}.md, methodology/slide-production.md.
  - Risk: 기계적 (읽기 전용 실측 — 소스·토큰 무변경)
  - Dependencies: 없음
  - Verify: 대조표에 askewly 테마 CSS 변수 누락 0(theme.mjs 정의 전수) + 인용 file:line 표본 3건 grep 재확인 일치 + A/B 근거가 각 3줄 이상.
  - Failure probe: custom-skills 소스와 `~/.claude/skills` 배포본 drift — `diff` 로 확인해 어긋나면 소스 기준으로 기록하고 drift 사실을 장부에 남긴다(배포 회귀 단정 전 check_checkout_freshness 먼저).
  - Commit: changeset `20260803-m16-media-token-audit` (README 절: step-1).

- [ ] **step-2 — 사용자 판정 + 매체 게이트 문서 기록 (decision gate 후)**
  - Artifact: step-1 장부의 A/B 를 [선택지+추천+근거]로 제시 → 사용자 확정 → 확정 내용을 `docs/design-system/slide-spec.md` 신규 절(「토큰 출발점」) + `medium-taxonomy.md` 발표 행에 기록 → `node scripts/generate-llms-txt.mjs` 재생성 → 판정 A 면 후속 goal 후보(테마 생성기)를 ROADMAP 큐·finding 큐에 등재.
  - Files: write docs/design-system/slide-spec.md, docs/design-system/medium-taxonomy.md, ROADMAP.md(큐 한 줄), examples/ui-vocabulary-site/public/llms/**(재생성물). read research/2026-08-03-m16-media-token-audit.md.
  - Risk: 기계적 (문서 — 단 decision gate: 사용자 판정 전 기록 금지)
  - Dependencies: step-1
  - Verify: `node scripts/check-llms-sync.mjs` PASS + 기록 절이 판정 원문(사용자 확정 날짜) 인용 + 판정과 "하지 않는 것" 절(화면 토큰 지면 이식 금지)이 모순 없이 정합.
  - Failure probe: (fresh 검증자 실측 2026-08-03) slide-spec·medium-taxonomy 는 FIXED_ASSETS 에 **이미 등재됨**(generate-llms-txt.mjs L72-73) — 미등재 분기는 죽은 분기. 잔여 probe = 재생성물과 check-llms-sync 가 실제 diff 를 잡는지 실행으로 확인(안 잡으면 배선 회귀로 기록).
  - Commit: changeset `20260803-m16-media-token-audit` (README 절: step-2).

## 검증/DoD

- **DoD**: 북극성 "같은 토큰 SSOT 출발" 주장이 발표 매체에 대해 실측 장부 + 사용자 판정 + 게이트 문서 기록으로 닫힘. 검증 = 대조표 전수성 + check-llms-sync PASS. 실패 모드 확인 = 배포본-소스 drift 또는 llms 미등재 중 최소 1건을 실제 확인해 기록(둘 다 정상이면 그 확인 자체를 기록).
- **Evidence**: `evidence/media-unification/m16-token-audit.md` (완료 경계에 장부·판정·기록 링크 합본)
- **회귀 게이트**: 정본 토큰·스킬 소스·사이트 코드 무변경(git diff 로 확인).

## 수치 출처

- askewly 테마 hex 값(#F4F3EE·#2F4B7C·#C65A3B): `custom-skills/promoted/presentation-slides-yusung/templates/src/theme.mjs` L74~ (2026-08-03 grep 실측).
- SSOT 브랜드 팔레트(#6F2DBD·#A663CC): `DESIGN.md` frontmatter `color.primitive.askewly` (생성 출처 `tokens/askewly.tokens.json`).

## finding 큐

- (예약) 판정 A 확정 시: 토큰→슬라이드 테마 생성기 goal 후보.

## 진행 로그

- 2026-08-03 작성.
- 2026-08-03 fresh 검증자(sonnet) 반영 — 인용 전수 실재 확인(hex·SSOT·스크립트·문서·export-pptx.mjs), 배포본-소스 drift 현재 없음, step-2 llms 미등재 probe 는 죽은 분기로 판명(FIXED_ASSETS 기등재) → probe 문구 교체.
- 2026-08-03 step-1 완료 — 실측 장부 `research/2026-08-03-m16-media-token-audit.md`: SSOT 소비 0건(29변수 일치 0·파생 0·평행 13·부재 16), 스킬 내부 단일출처 규율 건강, SP2 custom 트랙 = A 인입점 발견, drift probe 미발생(정상 확인 기록). Verify 3항 PASS. decision gate 진입: 사용자 판정 A/B 대기.
