# PLAN — M27: marketing-landing 블록 — 두 번째 블록으로 블록 체계를 복수화

> 생성: 2026-08-04 · 갈래: 신규 goal `second-block-marketing` (1/1) · scope: 블록 등급 두 번째 실물 `marketing-landing` — st4 조합 패턴 12종을 재료로 마케팅 랜딩 골격을 블록화하고, 킥스타트 두 번째 선택지로 이식 실증까지 닫는다.
Status: approved (사용자 승인 2026-08-04 "ㄱㄱ" — 결정 A 표준 퍼널형·결정 B 구성 세트 추천안 확정)

## 북극성 → milestone → step (위계)

- **북극성**: Askewly Design (← `CLAUDE.md` 「북극성」 절) — "일회성 작업에서 → 반복 가능한 루프로" 축. 블록 1종(saas-app-shell)은 사례고, 2종부터 체계다 — 계약(M18)·킥스타트(M19)·라이브 소비(M26)가 이미 있으므로 이번엔 **기존 파이프라인에 실물만 얹어 재사용성을 실증**한다.
- **입력 실측 (2026-08-04 계획 탐색)**:
  - ① registry 55종 중 마케팅 계열 재료 풍부 — `floating-bars-hero`·`hero-composition`·`rotating-label`·`typing-headline`·`logo-marquee`·`zigzag-story-section`·`terminal-demo-panel`·`contrast-duo-card`·`mesh-gradient-surface`·`scroll-driven-reveal`·`staggered-entrance-group`·`promo-banner-system`·`image-treatment` 등.
  - ② `scripts/generate-registry.mjs` 는 블록을 범용 지원(M18 step-3): `tier:"block"` 선언 → 다중 파일 수집·purity gate 블록 규칙·`meta.tier`/`meta.requiredCssVars` 파생. **생성기 수정 불요.**
  - ③ CLI `init --block <name>` 은 블록명을 하드코딩하지 않고 registry 항목의 `meta.requiredCssVars` 를 그대로 소비(`packages/cli/src/kickstart.ts` L308·L396 실측). **CLI 재출고 불요** — 신규 블록은 registry 배포만으로 킥스타트 선택지가 된다.
- **조사 인용 (재리서치 대신 — M12 규약)**: `research/2026-07-19-st4-composition-patterns.md`(구성 유형 12종 — 섹션 종류가 아니라 **순서·비중·시각 밀도**가 유형을 가른다) · `knowledge/landing-section-rhythm.md`(섹션 리듬) · `research/2026-08-04-m18-block-absorption-survey.md`(외부 블록 실사 방법·채택 규칙 선례). 신규 외부 조사 = **step-1 외부 공개 마케팅 블록 실사**(absorption-first 규약 — 손 조합 전 기존 공개 소스 실사, 출처 URL+접근일 의무).

## run 전 scope 결정

- **포함**: ⓪ 외부 공개 마케팅 랜딩 블록/템플릿 실사(베이스 판정 — M18 채택 규칙 3항 재사용) ① `marketing-landing` 블록 소스(섹션 파일 분리·기본 순서 = 확정 구성 패턴) + registry 등재 + block-contract §6 등재 + 사이트 데모 ② 신선 프로젝트 킥스타트 E2E(`init --block marketing-landing`) + evidence + 사용자 관측.
- **제외**: CLI 코드 변경·npm 출고(0.4.x patch 큐 별도 — verify chart.tsx 오탐·킥스타트 기본값 폴리싱) · 세 번째 블록(docs-site — finding 큐 유지) · 사이트 공개 표면 노출(블록 열람 페이지) · st4 12종 전 유형 블록화(이번은 기본 1유형 + 재배열 가이드 문서).
- **연쇄**: 없음 — 사용자 선택이 이 블록 단독(2026-08-04 AskUserQuestion). 완료 시 큐 잔여(CLI 0.4.x 폴리싱·dark/light SSOT 등)는 /harness-done 에서 후보 제시만.
- execution mode: continuous
- **중단점**: completed / 증거가 있는 blocked / decision_required / risk_gate / user_stopped. human gate = step-3 사용자 관측.
- rollback/cleanup: 커밋 단위 revert. registry 재생성은 기존 55 자산(블록 1 포함) diff 0 회귀 게이트로 보호. E2E 신선 프로젝트는 scratchpad(레포 무오염). push 는 세션 일괄(deploy-batching 규약) — 라이브 스모크는 push·배포 후 별도 확인.

## 스캐폴딩 결정

- source-of-truth: 블록 코드 SSOT = `examples/ui-vocabulary-site/src/components/blocks/marketing-landing/`(M18 관례 승계). 계약 = `docs/design-system/block-contract.md` §6 등재 행. 배포 표현 = `/r/marketing-landing.json`. 구성 순서·재배열 가이드의 근거 정본 = `research/2026-07-19-st4-composition-patterns.md`(블록 문서 절이 인용).
- 검증: step별 Verify + 통합 E2E = 신선 vite 프로젝트에 `npx @askewly/design init --block marketing-landing --registry <로컬 서빙>` 1커맨드 → verify 0건 → dev 서버 실브라우저 스모크(라이트/다크 스크린샷). + `node scripts/generate-registry.mjs` 기존 자산 회귀 diff 0 + `node scripts/check-llms-sync.mjs` PASS + 사이트 `npm run build` PASS.
- 배포/운영: llms·registry 재생성 커밋. push 세션 일괄. npm publish 없음.
- 자기선언 도메인 — 조합 계약 소유(M18 승계): 레이아웃 계약은 블록 소스 + block-contract §6 행이 소유. 구성 asset 무수정 — 불일치는 블록 내 어댑터로 흡수. 라우팅 미결합(단일 페이지 export — 랜딩은 페이지 1장이므로 shell/페이지 분리도 불요).
- 자기선언 도메인 — 콘텐츠 슬롯: 블록의 카피·로고·수치는 mock 데이터 파일로 분리(M18 관례) — 소비자가 첫 편집으로 갈아끼우는 파일을 1곳으로 모은다.
- 검토 후 제외: generate-registry·CLI 수정(입력 실측 ②③ — 범용 경로 기존재) · block-contract 형식 개정(§6 행 추가만으로 충분).

## 결정 로그

- status: resolved
- **[승인 확정 2026-08-04]** 사용자 승인("ㄱㄱ", 대안 미지정): 결정 A = 표준 퍼널형 확정, 결정 B = 추천 구성 세트 확정(외부 베이스 채택 시 보강 목록 전환 — 기술 결정 ⑤ 사전 소진).
- **결정 A — 기본 구성 패턴 = 표준 퍼널형(st4 §2.1) [추천]**: Hero → 로고 스트립 → 가치제안/기능 서사 → 데모 증거 → 비교/전환 증거 → pricing → FAQ → 최종 CTA → footer. 근거: 범용 SaaS/제품 랜딩의 기본값이라 킥스타트 타깃(해커톤·신규 제품)과 일치. 섹션을 **파일 단위로 분리**해 소비자가 순서를 재배열할 수 있게 하고, st4 의 핵심(순서·비중이 유형을 가른다)을 블록 문서의 "재배열 가이드"(예: 증거 선행형·Z-패턴 압축형으로 바꾸는 법)로 담는다. 대안: Z-패턴 스플릿형(§2.2 — 압축 리드젠) 기각 사유: 섹션 수가 적어 두 번째 블록의 재료 소화력이 낮다.
- **결정 B — 구성 세트 [추천]**: hero = `floating-bars-hero` 계열 + `rotating-label`/`typing-headline` 헤드라인 슬롯 + `mesh-gradient-surface` 배경 · 로고 스트립 = `logo-marquee` · 기능 서사 = `zigzag-story-section` · 데모 증거 = `terminal-demo-panel` · 문제/해결 대비 = `contrast-duo-card` · pricing·FAQ·최종 CTA·footer = 블록 자체 구현(registry 에 해당 asset 부재 — shadcn primitive 기반) · 모션 = `scroll-driven-reveal`·`staggered-entrance-group`. 단 **step-1 실사에서 외부 베이스가 채택 규칙 3항을 충족하면 그 베이스에서 출발**하고 위 asset 으로 보강한다(M18 흡수 우선 선례).
- **기술 결정 (사전 소진)**: ① 블록은 단일 페이지 컴포넌트 + 섹션 컴포넌트들 + mock 데이터 파일로 구성 — shell 없음 ② 구성 asset 은 `@/components/<asset-name>` import + registryDependencies URL 파생(생성기 기존 경로) ③ 요구 CSS 변수는 shadcn 표준 세트(사이드바 계열 제외) — 실측 후 §6 행에 전건 나열 ④ E2E 의 registry 는 push 전이므로 로컬 정적 서빙을 `--registry` 로 지정 — **서빙 커맨드 고정**(fresh 검증자 지적): `python -m http.server 8899 --directory examples/ui-vocabulary-site/public` → `--registry http://127.0.0.1:8899` (CLI 는 base URL 뒤에 `/r/<name>.json` 을 붙여 fetch — index.ts L120 실측). 라이브 소비 재확인은 push·CF Pages 배포 후 스모크 1회(세션 일괄 push 규약과 충돌 없음 — M26 이 라이브 경로 자체는 이미 실증) ⑤ **step-1 결과 분기 사전 소진**: 외부 베이스 채택 시 결정 B 는 "보강 목록"으로 전환된다(재질문 없음 — 채택 규칙 3항이 이미 사용자 승인 대상이므로 M18 무중단 선례 승계). 흡수 시 step-2 Verify 에 파일 헤더 표기 전건 확인이 추가 발동.

## Step 트리

- [x] **step-1 — 외부 공개 마케팅 랜딩 블록 실사 + 베이스·구성 확정 (흡수 우선)**
  - Artifact: `research/2026-08-04-m27-marketing-block-absorption-survey.md` — 후보 3~5개(shadcn 생태의 공개 마케팅 블록/템플릿: tailark, launch-ui, HyperUI, Magic UI 계열 등 + 검색 추가 후보)를 라이선스(재배포·표기)·구성(결정 A 시퀀스 대조)·import 표면·품질(recipe checks·anti-patterns·시그니처 대조) 실측 표로 → M18 채택 규칙 3항 적용 → 베이스 확정(외부 흡수 or 자체 조합 폴백) + `docs/design-system/absorption-criteria.md` 판정 행 추가. 모든 출처 URL+접근일.
  - Files: write research/2026-08-04-m27-marketing-block-absorption-survey.md. edit docs/design-system/absorption-criteria.md.
  - Risk: 기계적 (조사·판정 문서 — 코드 무변경)
  - Dependencies: 없음
  - Verify: 후보 ≥3 실측 표(라이선스·구성·품질 3열 전건) + 채택 규칙 3항 대조 + 베이스 확정 1줄 + absorption-criteria 행 존재.
  - Failure probe: 코드 레포는 MIT 인데 마케팅 블록만 유료 상품(pro 티어)인 후보 — 파일·상품 페이지 단위로 라이선스 확인, 불명확하면 기각(추정 채택 금지).
  - Commit: changeset `20260804-m27-marketing-landing-block` (README 절: step-1).

- [x] **step-2 — marketing-landing 블록 소스 + registry 등재 + 사이트 데모**
  - Artifact: ① `examples/ui-vocabulary-site/src/components/blocks/marketing-landing/` — step-1 베이스에서 출발(외부 흡수 시 파일 헤더 표기 + 시멘틱 토큰 restyle / 폴백 시 결정 B 세트 자체 조합): 섹션 파일 분리(hero·logo-strip·features·demo·comparison·pricing·faq·cta·footer) + 페이지 조립 파일 + mock 데이터 파일, 시멘틱 토큰만·라우팅 미결합 ② `registry.json` 항목 등재(`tier:"block"`·requiredCssVars) ③ block-contract §6 에 marketing-landing 행(구성·표기·요구 변수 + st4 재배열 가이드 절 백링크) ④ 사이트 블록 데모 렌더(기존 관례 경로) ⑤ llms 재생성.
  - Files: write examples/ui-vocabulary-site/src/components/blocks/marketing-landing/*.tsx. edit examples/ui-vocabulary-site/registry.json + 사이트 데모 등재 파일(기존 관례) + docs/design-system/block-contract.md.
  - Risk: 기계적 (신규 파일 위주 — 생성기·기존 asset 무변경. registry 재생성은 diff 0 게이트로 방어)
  - Dependencies: step-1
  - Verify: `node scripts/generate-registry.mjs` PASS + 기존 자산(55종) diff 0 + `/r/marketing-landing.json` 생성(files ≥5·구성 asset URL registryDependencies·meta.tier·meta.requiredCssVars) + 사이트 `npm run build` PASS + `npx @askewly/design verify` 블록 디렉터리 0건 + `node scripts/check-llms-sync.mjs` PASS + 사이트 데모 브라우저 렌더 확인. **외부 흡수 시 추가**: 흡수 파일 헤더 표기(origin·license·copyright) 전건 grep 확인.
  - Failure probe: 구성 asset 의 props 계약이 랜딩 맥락과 불일치(예: hero 계열의 고정 카피 슬롯) — 원 asset 무수정, 블록 내 어댑터로 흡수하고 §6 레이아웃 계약에 기록. 외부 베이스 import 표면이 purity gate 밖이면 dependencies 선언으로 통과시키고 안 되는 결합은 절단(게이트 완화 금지).
  - Commit: changeset (README 절: step-2).

- [x] **step-3 — 킥스타트 통합 E2E + evidence + 사용자 관측**
  - Artifact: scratchpad 신선 디렉터리에서 로컬 서빙(기술 결정 ④ 커맨드) 기동 후 `npx @askewly/design init <dir> --block marketing-landing --registry http://127.0.0.1:8899 --yes`(+비-cosmos 팔레트 1종) 1커맨드 → 이식·requiredCssVars 대조·verify 0건 → dev 서버 실브라우저 스모크(전 섹션 렌더·모션 실발화·콘솔 에러 0·라이트/다크 스크린샷) → `evidence/second-block-marketing/m27-marketing-landing.md`(이식 로그·스크린샷 경로·판정) → **사용자 관측 1회**(사이트 데모 또는 E2E 산출물 실화면).
  - Files: write evidence/second-block-marketing/m27-marketing-landing.md. scratchpad(신선 프로젝트 — 레포 밖).
  - Risk: 기계적 (검증 — 레포 변경은 evidence 만)
  - Dependencies: step-2
  - Verify: 킥스타트 1커맨드 exit 0 + verify 0건 + 브라우저 콘솔 에러 0 + 스크린샷 ≥2장(라이트/다크) + restyle 후 askewly 팔레트 잔존 0 + evidence 문서 존재 + 사용자 관측 통과.
  - Failure probe: `--registry` 로컬 경로에서 registryDependencies 가 라이브 URL(`ui.askewly.com/r/...`)로 파생돼 push 전 자산(신규 없음 — 기존 55종은 라이브)과 어긋나는 경우 — 이식 로그에 그대로 기록하고 로컬/라이브 혼합 해석 규칙을 evidence 에 명시(조용한 우회 금지). 킥스타트 자체 결함 발견 시 이번 scope 에서 고치지 않고 CLI 0.4.x 큐에 finding 으로 적재.
  - Commit: changeset (README 절: step-3).

## 검증/DoD

- **DoD**: 외부 실사·베이스 판정 기록(출처 전건 + absorption-criteria 행) + `marketing-landing` 블록이 registry·block-contract §6·사이트 데모로 등재되고, **신선 프로젝트 킥스타트 1커맨드 이식 + 비-askewly 토큰 restyle + verify 0건 + 실브라우저 스모크(모션 실발화 포함) + 사용자 관측 1회** 통과. 실패 모드 확인 = 기존 자산 재생성 diff 0 + purity gate 가 블록 디렉터리 밖 결합을 실제 차단(기존 자기시험 회귀).
- **Evidence**: `evidence/second-block-marketing/m27-marketing-landing.md`
- **회귀 게이트**: 기존 자산 55종 출력 diff 0 · 사이트 빌드 PASS · llms 동기화 PASS · 기존 saas-app-shell 킥스타트 경로 무변경(CLI·생성기 무수정이므로 구조적 보장 — 재생성 diff 로 확인).

## 수치 출처

- registry 55종·마케팅 재료 목록: `examples/ui-vocabulary-site/public/r/registry.json` (2026-08-04 실측).
- 생성기 블록 범용 지원: `scripts/generate-registry.mjs` L53·L130-132·L144 (2026-08-04 실측).
- CLI 블록명 비하드코딩: `packages/cli/src/kickstart.ts` L308·L396 (2026-08-04 실측).
- 구성 유형 12종: `research/2026-07-19-st4-composition-patterns.md` (2026-07-19 조사).

## finding 큐

- docs-site 블록(세 번째) · 사이트 공개 블록 열람 페이지.
- CLI 0.4.x patch 큐: verify chart.tsx 속성 셀렉터 오탐 · 킥스타트 기본값 폴리싱(M19 코멘트) — 이번 scope 밖, E2E 중 발견분도 여기로.

## 진행 로그

- 2026-08-04 작성.
- 2026-08-04 step-1 완료 — 외부 후보 전건 기각(tailark next 결합 195/109 실측·Launch UI 유료 벽·HyperUI 모델 불일치·공식 blocks 카테고리 부재) → **자체 조합 폴백 확정**(결정 B 세트 = 구현 목록). 산출: research survey + absorption-criteria 3행.
- 2026-08-04 fresh 검증자 반영 — ① 계획 인용 실측 4지점(생성기 블록 범용·CLI 비하드코딩·--registry 실존·구성 asset 10종 등재) 전건 확인 ② E2E 로컬 서빙 커맨드 미명시 적발 → 기술 결정 ④ 로 고정 ③ 외부 흡수 분기 사전 소진(⑤)·흡수 시 헤더 표기 Verify 추가.
