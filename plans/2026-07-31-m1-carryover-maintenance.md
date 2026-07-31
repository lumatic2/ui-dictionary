# PLAN — M1: 이월 유지보수 마감 — verify 타이포 게이트 보정 + SEO 메타 영어 통일

> 생성: 2026-07-31 · 갈래: 검사기 규칙 보정 + 셸 메타 정리 · scope: 이월 finding 2건(SQ1 타이포 7건→현 8건 · QA1 SEO 메타 언어)을 닫는다. goal `carryover-maintenance` 단일 milestone.
Status: approved (사용자 승인 2026-07-31 "ㄱㄱ" — 결정 전건 사전 매듭, fresh 검증자 발견 2건 반영 후 승인)

## 북극성 → milestone → step (위계)
- **북극성**: Askewly Design (← `CLAUDE.md` 「북극성」 절) — 검사기(디자인 게이트)와 공개 사이트 셸의 정합 유지보수.
- **goal**: `carryover-maintenance` · **milestone**: M1 (이 goal 의 유일 milestone — 연쇄 없음: 사용자가 지목한 이월 finding 2건이 전부다. 다크모드 3건은 사용자 판단 대기라 범위 밖).
- **리서치**: 조사 불요 — 재료는 실측 3건(2026-07-31): ① `npx @askewly/design verify src/components --ext tsx` → typography 8건(SQ1 당시 7건 + get-started QA2 증분 1건) ② `packages/cli/src/typography.ts`·`verify.ts` 전문 판독 ③ `scripts/prerender-ui-vocabulary.ts`·`index.html`·`page-meta.ts` 한국어 메타 소재 실측.

## Scope Boundary
- **포함**: ① packages/cli 타이포 규칙 보정(브레이크포인트 버킷 계수 + 파일 단위 사유 필수 opt-out 마커) + 테스트 + 버전 범프 ② 사이트 잔여 타이포 위반 처리(보정 후 재실측 → 잔여는 마커 또는 스케일 접기) → 위반 0 ③ SEO 셸 메타 영어 통일(index.html lang="en"·description/og/twitter, page-meta.ts DEFAULT_DESCRIPTION, prerender 정적 라우트 title/description/body).
- **제외**: 콘텐츠 파생 메타·본문 — 용어 데이터(`term.one_liner`·`term.ko.name`)와 **docs 아티클**(`documentation-pages.ts` 한국어 서술 아티클 — DA1 에서 의도적으로 한국어로 만든 콘텐츠)은 전환하지 않는다. 전환 대상은 셸 정적 라우트의 메타·골격 body 만 · 다크모드 이월 3건(강조색 토큰·forced-colors·다크 og-image — 사용자 판단 대기) · 타이포 임계값 변경(5 유지 — DOG3 실측 확정) · npm publish·git push 실행(세션 말 일괄 보고 후 — deploy batching 규약).
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / user_stopped
- rollback/cleanup: CLI 규칙 변경은 packages/cli 커밋 단위 revert. 사이트 마커·메타 문자열 치환도 커밋 단위 revert 로 완전 복구. 로직 표면(라우팅·데이터) 무변경.

## 스캐폴딩 결정
- source-of-truth: 타이포 규칙 정본 = `packages/cli/src/typography.ts`(+`verify.ts` 통합) — 사이트 쪽에 별도 검사기를 만들지 않는다. 카피 언어 정본 = `docs/design-system/copy-language.md`(영어 단일) — SEO 메타 결정을 이 문서 결정 기록에 1줄 추가.
- 검증: packages/cli `npm test`(vitest — typography·verify 스위트) + 사이트에서 **로컬 빌드 CLI**(`node ../../packages/cli/dist/index.js verify src/components --ext tsx`) 위반 0 + `npm run lint`·`npm run build`(postbuild prerender 755 라우트) + vite preview 실브라우저 스모크(홈·/get-started 렌더·콘솔 0 에러).
- 배포/운영: npm publish(@askewly/design 0.3.0)·git push 는 세션 말 사용자 보고 후 일괄. publish 절차 정본 = `changesets/20260722-cli-publication/` (DOG2).
- 자기선언 도메인 — **게이트 신뢰성**: opt-out 마커는 사유 문자열 필수(빈 사유 = 위반으로 보고), verify 출력에 skip 파일 수·사유를 표시해 조용한 면제를 금지한다. negative probe(사유 없는 마커·마커 없는 초과 파일)가 exit≠0 인지 확인.
- 검토 후 제외: 임계값 상향(--typography-threshold) — SQ1 계획의 "게이트를 낮춰 통과하는 것은 정리가 아니다" 유지. 엘리먼트 단위 반응형 오버라이드 추적(같은 요소의 base 크기를 md 가 대체하는 것의 정밀 모델) — 파일 텍스트 스캐너로는 요소 귀속이 불가능, 버킷 근사로 충분.

## 결정 로그
- status: resolved
- **게이트 보정 (사용자 확정 2026-07-28)**: 타이포 5단계/파일 규칙을 실태에 맞게 보정 — 강제 접기·파일 분할이 아니라 규칙 쪽을 고친다.
- **SEO 메타 = 영어 통일 (사용자 확정 2026-07-31 AskUserQuestion)**: 셸 메타 title/description 영어 전환 + `lang="en"`. 사이트 카피 영어 단일(copy-language.md)과 정합.
- **임계값 5 유지 (기존 사용자 확정 — DOG3 2026-07-22)**: 변경 없음.
- **기술 결정**: ① 반응형 계수 = 브레이크포인트 버킷 — 무접두 크기는 base 버킷, 브레이크포인트 변형(`sm:`~`2xl:`·`max-*:`·`min-*:` — 특정 목록 하드코딩이 아니라 변형 체인 문자열로 일반 버킷화)이 붙은 크기는 그 체인 버킷, 위반 판정은 **버킷별 독립**(한 브레이크포인트에서 동시에 렌더되는 크기만 센다 — `text-5xl md:text-7xl` 이 2계수되던 오탐 해소). hover/dark 등 비반응형 변형은 현행대로 strip. **단 실측상 위반 8건 중 반응형 접두 사용은 소수라 버킷 보정만으로 해소되는 파일은 일부다 — 실질 부담은 step-2(마커·접기)에 있다**(fresh 검증자 실측 2026-07-31). ② 멀티 데모·미니어처 파일은 파일 상단 마커 `askewly-typography-ok: <사유>` 로 명시 면제 — lint-hardcoded-colors 의 사유 마커 관례를 따르고, 단일 화면 파일에는 붙이지 않는다(남발 금지 — 마커 대상은 여러 데모를 수납한 집합 파일만). ③ 버전 0.2.0→0.3.0(규칙 동작 변경 = minor). ④ 용어 페이지 메타는 용어 데이터 파생이라 이번 전환에서 제외.
- 그 외 새 사용자 소유 결정: 없음.

## Step 트리

- [x] **step-1 — CLI 타이포 게이트 보정**
  - Artifact: `packages/cli` — typography.ts 버킷 계수(반응형 접두 sm/md/lg/xl/2xl → 버킷, 무접두 → base, 버킷별 임계 판정) + verify.ts 파일 마커 `askewly-typography-ok: <사유>`(사유 필수, skip 수·사유 출력) + 테스트(반응형 쌍 1계수·버킷 위반·마커 skip·빈 사유 거부) + package.json 0.3.0 + CHANGELOG 갱신(있으면).
  - Files: write packages/cli/src/typography.ts, packages/cli/src/verify.ts, packages/cli/test/typography.test.ts, packages/cli/test/verify.test.ts, packages/cli/package.json. read packages/cli/src/index.ts(출력 표면).
  - Risk: 위험 (규칙 완화 방향의 변경 — 진짜 남용을 함께 통과시키지 않는지 테스트로 고정)
  - Dependencies: 없음
  - Verify: `cd packages/cli && npm test` 전건 PASS + `npm run build` PASS.
  - Failure probe: ① 사유 없는 마커 파일 → 위반 보고(exit≠0) ② 무접두 6단계 파일 → 여전히 위반(완화가 남용을 덮지 않음) ③ DOG6 fixture 회귀 무변.
  - Commit: changeset `m1-carryover-maintenance` (README 절: step-1).

- [ ] **step-2 — 사이트 잔여 타이포 처리 → 위반 0**
  - Artifact: 보정된 로컬 CLI 로 재실측 → 반응형 보정으로 해소 안 된 잔여 파일 처리: 멀티 데모·미니어처 집합 파일(현 후보: home-page·marketing-section-preview·term-visual·article-documentation-layout)은 사유 마커, 단일 화면 파일(현 후보: colors-page·get-started-page·term-page·recipe-gallery — 보정 후 재실측으로 확정)은 마커 금지 — 스케일 접기(시각 무손실 우선, 손실 발생 시 decision_required 중단).
  - Files: write examples/ui-vocabulary-site/src/components/(잔여 위반 파일들 — 마커 1줄 또는 크기 유틸 치환). read 재실측 출력.
  - Risk: 위험 (스케일 접기가 시각 변화를 만들 수 있음 — 전/후 스크린샷 대조, 취향 판단 발생 시 중단점)
  - Dependencies: step-1
  - Verify: `node ../../packages/cli/dist/index.js verify src/components --ext tsx` → 위반 0(skip 목록·사유 출력 확인) + `npm run lint`·`npm run build` PASS + 접기 발생 파일 전/후 스크린샷 시각 무손실.
  - Failure probe: 마커 파일 1개의 사유를 비워 실행 → 위반 재출현 확인 후 복원(게이트가 살아있다는 증거).
  - Commit: changeset `m1-carryover-maintenance` (README 절: step-2).

- [ ] **step-3 — SEO 셸 메타 영어 통일**
  - Artifact: index.html(`lang="en"` + description/og/twitter 영어) + page-meta.ts DEFAULT_DESCRIPTION 영어 + prerender-ui-vocabulary.ts 정적/셸 라우트(get-started·docs 허브·patterns 허브·컬렉션·colors·recipes·pro·search) title/description/body 영어 + copy-language.md 결정 기록 1줄(SEO 메타 영어 확정 2026-07-31).
  - Files: write examples/ui-vocabulary-site/index.html, examples/ui-vocabulary-site/src/lib/page-meta.ts, scripts/prerender-ui-vocabulary.ts, docs/design-system/copy-language.md. read dist 산출 spot.
  - Risk: 기계적 (문자열 치환 + lang 속성 — 로직 무변경. 용어 데이터 파생 메타는 건드리지 않음)
  - Dependencies: 없음 (step-1·2 와 독립)
  - Verify: `npm run build`(prerender 755 라우트 성공) + dist 셸 정적 라우트(`dist/index.html`·`dist/get-started/`·`dist/colors/`·`dist/recipes/`·`dist/pro/`·`dist/search/`·`dist/patterns/`·`dist/docs/index.html`)의 **`<head>` 메타(title·description·og·twitter)에 한국어 0** — 검사 범위는 head 메타 한정(용어·docs 아티클 라우트와 콘텐츠 body 는 한국어가 의도된 콘텐츠라 제외) + vite preview 실브라우저 스모크 — 홈·/get-started 렌더·콘솔 0 에러·`document.documentElement.lang === "en"`.
  - Failure probe: 전환 전 grep 로 한국어 메타 검출됨(양성 대조) → 전환 후 0 — 검출 커맨드 자체가 살아있음을 증명.
  - Commit: changeset `m1-carryover-maintenance` (README 절: step-3).

## 검증/DoD
- **DoD**: ① 보정된 verify 가 반응형 쌍을 1계수하고 사유 마커를 지원하며(테스트 고정) 사이트 `src/components` 타이포 위반 0 ② 셸 SEO 메타(문서 lang 포함)가 영어이고 prerender 산출물에 반영 ③ packages/cli 테스트·사이트 lint·build·브라우저 스모크 전건 PASS. 실패 모드 확인: 사유 없는 마커·무접두 초과 파일이 여전히 잡힌다(negative probe).
- **Evidence**: `evidence/carryover-maintenance/m1-closeout.md`
- **회귀 게이트**: 색 위반 0 유지 + lint:colors --max 0 무회귀 + 용어 라우트 메타 무변경 + DOG6 self-correction fixture 무회귀.

## 수치 출처
- 타이포 8건·파일별 단계 목록 = `npx @askewly/design verify src/components --ext tsx` 실행 출력 2026-07-31 (SQ1 당시 7건 → get-started QA2 증분으로 8건).
- 한국어 메타 소재 = index.html:2,20-41 · page-meta.ts:4 · prerender-ui-vocabulary.ts:50-166 실측 2026-07-31.
- 임계값 5 근거 = DOG3 보고서(`docs/reports/2026-07-22-dog3-typography-scale.md`).

## finding 큐
- (실행 중 발견 항목을 여기 적는다)

## 진행 로그
- 2026-07-31 작성 — 사용자 결정 2건(게이트 보정 2026-07-28 · SEO 영어 통일 2026-07-31) 기반, 새 결정 없음.
