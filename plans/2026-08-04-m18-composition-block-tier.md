# PLAN — M18: 조합 블록 계층 — 앱 골격급 자산 정본화 + saas-app-shell 블록 1종

> 생성: 2026-08-04 · 갈래: 재사용 조합(reusable-composition goal 1/2) · scope: 컴포넌트급 code asset(27종) 위에 **페이지/앱 골격급 조합 자산 등급("블록")** 을 신설한다 — 계약 문서 + registry 표현 + entry-protocol 접합 + 첫 실물 `saas-app-shell` 1종 + 외부 프로젝트 이식 통합 검증.
Status: approved (사용자 승인 2026-08-04 "ㄱㄱ" — 결정 1 이름=블록·결정 2 구성 세트·흡수 베이스 채택 규칙 추천안 확정)

## 북극성 → milestone → step (위계)

- **북극성**: Askewly Design (← `CLAUDE.md` 「북극성」 절) — "탐색·주입 도구에서 → 제작 환경으로", "일회성 작업에서 → 반복 가능한 루프로" 축. 해커톤·신규 제품마다 디자인을 새로 시작하는 비효율을 "저장된 소스의 조합"으로 대체하는 첫 절반(저장 단위의 승급).
- **입력 실측 (2026-08-04 계획 탐색)**: ① code asset 27종 배포 중(`/r/registry.json`) — 전부 컴포넌트/패턴급, 앱 골격급 0종 ② saas-app-shell 구성 재료 기존재: `sidebar-application-shell`·`stat-summary-grid`·`interactive-data-table`·`recoverable-empty-state`·`actionable-toast` ③ `scripts/generate-registry.mjs` purity gate = `react|lucide-react|@/components/ui/*|@/lib/utils` 허용 표면 — 블록의 내부 상호 import 는 현재 차단됨(확장 필요) ④ entry-protocol 은 요소 1개 결정(N-2)에 정교하나 조합 단위 소비 경로 부재 ⑤ shadcn registry 공식 타입에 `registry:block`(다중 파일) 존재.
- **조사 인용 (재리서치 대신 — M12 규약)**: `research/2026-07-19-recipe-code-reuse-shadcn-registry.md`(registry 포맷·소비 경로 — 블록도 같은 포맷 승계) · `research/2026-07-19-st4-composition-patterns.md`(조합 원리 — 섹션 종류보다 순서·비중이 유형을 가른다). 신규 외부 조사 = **step-1 외부 공개 블록 실사**(사용자 방향 2026-08-04: 손 조합 전에 기존 공개 자산 흡수 우선 — shadcn 공식 blocks·shadcn-admin·Tremor 등 후보, 출처 URL+접근일 의무).

## run 전 scope 결정

- **포함**: ⓪ **외부 공개 블록 소스 실사**(shadcn 공식 blocks·shadcn-admin·Tremor 등 — 라이선스·구성·품질 대조, absorption-criteria 판정으로 saas-app-shell 베이스 결정) ① 블록 계약 문서 `docs/design-system/block-contract.md`(정의·구성 선언·레이아웃 계약·restyle 지점·소비 경로·외부 흡수 시 라이선스 표기 규칙) + entry-protocol A분기 접합 + llms 등재 ② `saas-app-shell` 블록 구현(베이스 = ⓪ 판정 결과 + registry 항목 + generate-registry 확장) ③ 외부 신선 프로젝트 이식 통합 검증(브라우저 스모크 + verify 0건).
- **제외**: 두 번째 블록(marketing-landing·docs-site — finding 큐) · kickstart 원커맨드(M19) · harvest 회수 계약(후속 goal) · 사이트 공개 페이지 노출(Pro/Templates 축 — 별도, 메모리 규약상 수익화 언급 없이 보류) · deck 블록.
- execution mode: continuous
- **중단점**: completed / 증거가 있는 blocked / decision_required / risk_gate / user_stopped. human gate 는 M19 step-3 에 집중(이번 milestone 은 기계 검증 + 에이전트 브라우저 스모크까지).
- rollback/cleanup: 커밋 단위 revert. registry 확장은 기존 27 자산 재생성 diff 0 회귀 게이트로 보호. 이식 검증용 신선 프로젝트는 scratchpad(레포 무오염).

## 스캐폴딩 결정

- source-of-truth: 블록 코드 SSOT = `examples/ui-vocabulary-site/src/components/blueprints/…` 아님 — **`src/components/blocks/<name>/`**(사이트가 렌더하는 소스 그대로 배포하는 기존 RC1 원칙 승계). 계약 정본 = `docs/design-system/block-contract.md`, 배포 표현 = `/r/<name>.json`(shadcn registry 호환), 소비 계약 = entry-protocol.
- 검증: step별 Verify + 통합 E2E = 신선 vite 프로젝트에 JSON fetch 이식 → deps 해결 → restyle → `npx @askewly/design verify` 0건 → dev 서버 실브라우저 스모크. + `node scripts/generate-registry.mjs` 기존 27 자산 회귀 diff 0 + `node scripts/check-llms-sync.mjs` PASS.
- 배포/운영: llms·registry 재생성 커밋. push 는 세션 일괄(사전 요약 보고 후 — deploy-batching 규약). npm publish 없음(CLI 무변경 milestone).
- 자기선언 도메인 — 조합 계약 소유: 블록의 "무엇을 어디에" 레이아웃 계약은 **블록 소스 코드 + 블록별 문서 절이 소유**(계약 문서는 형식만 정의). 구성 asset 간 결합은 블록 디렉터리 내부 상대 import 로 한정 — 외부 asset 을 수정하지 않는다.
- 검토 후 제외: agent-asset-model.md 스키마 개정 — `code_asset.copy_scope: page|pack` 필드가 이미 블록 개념을 예약하고 있어 신설 엔티티 불요(계약 문서가 이 필드를 인용).

## 결정 로그

- status: resolved
- **[승인 확정 2026-08-04]** 사용자 승인("ㄱㄱ", 대안 미지정): 결정 1 = 블록(block) 확정, 결정 2 = 추천 구성 세트 확정.
- **[사용자 방향 2026-08-04] 흡수 우선** — 손 조합 전에 깃허브 기존 공개 블록을 찾아 가져오는 것이 우선. 무중단 진행을 위한 **베이스 채택 규칙 사전 소진**: ① 라이선스 MIT/Apache-2.0 계열(재배포 시 표기 의무 이행 — `/r/` 재배포 전제) ② 결정 2 구성 세트와의 구조 일치도 ③ 우리 recipe checks·anti-patterns·시그니처 대조에서 자체 27 asset 조합 대비 우위 — 셋 다 충족하는 후보가 있으면 그 후보를 베이스로 흡수(+우리 asset 으로 보강), 없으면 자체 조합으로 폴백하고 근거를 absorption-criteria 표 행으로 기록. 후보가 복수면 상위 1개 채택, 판정 근거는 research 문서에 전건.
- **결정 1 — 자산 등급 이름 = "블록(block)"** (추천). 근거: shadcn `registry:block` 공식 타입과 일치해 발명 없음, 기존 `site-blueprint.md`(사이트 IA 도면)와 충돌 회피. 대안 "블루프린트" 기각 — 이름 충돌.
- **결정 2 — saas-app-shell 구성 세트 = 사이드바 셸 + 대시보드(stat-summary-grid + interactive-data-table) + 설정 페이지 + 빈 상태(recoverable-empty-state) + 토스트(actionable-toast)** (추천). auth 화면 제외 근거: 해커톤에서 auth UI 는 보통 프레임워크·서비스(Clerk/Supabase)가 소유 — 블록이 이기려 하면 오히려 결합 비용. 사용자 지정 시 교체.
- **기술 결정**: ① **등급 구분자는 registry 타입이 아니다** — 기존 27종이 이미 전부 `registry:block`(generate-registry.mjs L75·L93 실측, fresh 검증자 적발). 블록 등급 = 항목 `meta.tier: "block"`(생성기 파생) + `src/components/blocks/<name>/` 디렉터리 관례 + block-contract.md 등재 목록이 정본 ② purity gate 확장 = 블록 디렉터리 내부 상대 import + 기존 허용 표면 + **등재된 code asset 컴포넌트 import**(`@/components/<asset-name>` — registryDependencies 로 파생 선언) 허용, 그 외는 기존대로 FAIL ③ 블록 항목의 registryDependencies 에 구성 asset 을 URL 참조(`https://ui.askewly.com/r/<name>.json`)로 선언 — shadcn add 재귀 해결 경로 활용 ④ 라우팅은 블록에 포함하지 않음(react-router 결합 금지) — 페이지 컴포넌트 export 만 제공하고 배선은 소비자 몫(계약 문서에 명시) ⑤ **restyle 지점 선언 = cssVars 필드가 아니라 "요구 CSS 변수 목록"**(component-restyle.md 실계약: shadcn 계열 변수는 소비 프로젝트 토큰 정의부가 값의 정본 — 레포에 cssVars 사용 실적 0, fresh 검증자 적발) — 블록 문서가 요구 변수 전건을 나열하고 소비자가 자기 토큰 정의부로 채운다.

## Step 트리

- [x] **step-1 — 외부 공개 블록 실사 + 베이스 판정 (흡수 우선)**
  - Artifact: `research/2026-08-04-m18-block-absorption-survey.md` — 후보 3~5개(shadcn 공식 blocks 대시보드/사이드바 세트·satnaing/shadcn-admin·Tremor 대시보드 템플릿 등 + 검색으로 추가 후보) 각각 라이선스(재배포·표기 의무)·구성(결정 2 세트 대조)·import 표면·품질(우리 recipe checks·anti-patterns·시그니처 하드페일 대조)을 실측 표로 → 결정 로그의 베이스 채택 규칙 적용 → saas-app-shell 베이스 확정(외부 흡수 or 자체 조합 폴백) + absorption-criteria 표 행 기록. 모든 출처 URL+접근일.
  - Files: write research/2026-08-04-m18-block-absorption-survey.md. edit docs/design-system/absorption-criteria.md(판정 행 추가).
  - Risk: 기계적 (조사·판정 문서 — 코드 무변경)
  - Dependencies: 없음
  - Verify: 후보 ≥3 실측 표(라이선스·구성·품질 3열 전건) + 채택 규칙 3항 대조 명시 + 베이스 확정 1줄 + absorption-criteria 행 존재.
  - Failure probe: 후보 라이선스가 코드는 MIT 인데 블록 소스만 별도 약관(예: 유료 블록 상품)인 경우 — 레포 LICENSE 파일이 아니라 해당 소스 파일·상품 페이지 단위로 확인, 불명확하면 그 후보 기각(추정 채택 금지).
  - Commit: changeset `20260804-m18-composition-block-tier` (README 절: step-1).

- [x] **step-2 — 블록 계약 문서 + entry-protocol 접합 + 구성 재료 실측**
  - Artifact: `docs/design-system/block-contract.md` 신설 — 정의(블록 = 페이지/앱 골격급 조합 자산), registry 표현(`registry:block`·files[]·registryDependencies 규칙), 레이아웃 계약 형식(구성 asset·배치·상태 배선), restyle 지점 선언(cssVars·토큰 슬롯), 소비 경로(fetch → 이식 → 의무 restyle — component-restyle.md 인용), agent-asset-model `copy_scope: page|pack` 백링크. + entry-protocol A분기(새 화면/페이지)에 "블록 우선 확인" 단계 삽입(A-1.5 — 표면이 블록과 일치하면 블록 출발이 기본). + 27 자산 인벤토리에서 saas-app-shell 구성 가능성 실측표(재료 asset 5종의 import 표면·cssVars 대조)를 계약 문서 부록 또는 evidence 초안에 기록.
  - Files: write docs/design-system/block-contract.md. edit docs/design-system/entry-protocol.md. read examples/ui-vocabulary-site/registry.json, src/components/{sidebar-application-shell,stat-summary-grid,interactive-data-table,recoverable-empty-state,actionable-toast}.tsx.
  - Risk: 기계적 (문서 — 코드 무변경)
  - Dependencies: 없음
  - Verify: 계약 문서 존재 + entry-protocol 에 블록 단계 grep 1건 이상 + `node scripts/check-llms-sync.mjs` PASS(llms 재생성 포함).
  - Failure probe: 재료 asset 실측에서 사이트 결합(terms.generated 등) 발견 — 그 asset 은 구성에서 제외하고 대체 재료 또는 블록 내 자체 구현으로 전환, 실측표에 기록(조용한 우회 금지).
  - Commit: changeset (README 절: step-2).

- [x] **step-3 — generate-registry 블록 지원 확장 (다중 파일·purity gate·meta.tier)**
  - Artifact: `scripts/generate-registry.mjs` 확장 — ① 블록 디렉터리(`src/components/blocks/<name>/`) 다중 파일 수집 ② purity gate 기술 결정 ② 규칙(블록 내부 상대 import + 등재 asset import 허용) ③ registryDependencies 에 구성 asset URL 파생 ④ 항목 `meta.tier: "block"` 파생. 검증용 최소 픽스처 블록(임시 2파일)으로 생성 경로 실측 후 제거.
  - Files: edit scripts/generate-registry.mjs. scratchpad(게이트 자기시험 픽스처).
  - Risk: 위험 (registry 생성기 수정이 기존 27 자산 출력에 영향 가능 — 확장 전 `public/r/` 스냅숏 대비 기존 27건 diff 0 회귀 게이트로 방어)
  - Dependencies: step-1
  - Verify: `node scripts/generate-registry.mjs` PASS + 기존 27 자산 diff 0 + 픽스처 블록이 files ≥2·구성 asset URL·meta.tier 로 생성됨 + **게이트 자기시험**: 금지 import(`@/data/terms.generated`)를 넣은 픽스처가 실제 FAIL.
  - Failure probe: purity gate 확장이 느슨해져 사이트 결합 import 가 배포로 새는 경우 — 자기시험 FAIL 미발생 시 규칙을 좁히고 재시험(느슨한 채 통과 금지).
  - Commit: changeset (README 절: step-3).

- [x] **step-4 — saas-app-shell 블록 소스 + registry 등재 + 사이트 데모**
  - Artifact: ① `examples/ui-vocabulary-site/src/components/blocks/saas-app-shell/` — **step-1 판정 베이스에서 출발**(외부 흡수 시: 소스 이식 + 라이선스 표기(파일 헤더+계약 문서 규칙) + 시멘틱 토큰 restyle + 우리 recipe checks 대조 보강 / 자체 조합 폴백 시: 결정 2 구성 세트 조합) — shell 레이아웃 + dashboard 페이지 + settings 페이지 + 빈 상태·토스트 배선, 시멘틱 토큰만·라우팅 미결합 ② registry.json 항목 등재 ③ 사이트에서 블록 데모 렌더(기존 데모 등재 관례 경로 1개) ④ 요구 CSS 변수 목록을 블록 문서 절로 선언(기술 결정 ⑤).
  - Files: write examples/ui-vocabulary-site/src/components/blocks/saas-app-shell/*.tsx. edit examples/ui-vocabulary-site/registry.json + 사이트 데모 등재 파일(기존 관례 따름). edit docs/design-system/block-contract.md(saas-app-shell 등재 절).
  - Risk: 기계적 (신규 파일 위주 — 생성기·기존 asset 무변경)
  - Dependencies: step-3
  - Verify: `node scripts/generate-registry.mjs` PASS + `/r/saas-app-shell.json` 생성(files ≥3·registryDependencies 에 구성 asset URL·meta.tier) + `npm run build`(사이트) PASS + `npx @askewly/design verify` 블록 디렉터리 0건 + 사이트 데모 브라우저 렌더 확인.
  - Failure probe: 구성 asset 의 상태 배선(토스트·빈 상태)이 조합 시 props 계약 불일치 — 블록 내 어댑터로 흡수하되 원 asset 은 수정하지 않는다(스캐폴딩 결정의 결합 한정 규칙), 불일치 내역을 계약 문서 레이아웃 계약 예시로 기록. 외부 베이스의 import 표면이 purity gate 허용 밖(recharts·@/hooks 등)이면 step-3 게이트 규칙에 선언적 허용을 추가하는 게 아니라 **블록 dependencies 로 선언**해 통과시키고, 안 되는 결합은 절단.
  - Commit: changeset (README 절: step-4).

- [x] **step-5 — 외부 이식 통합 검증 + 기록**
  - Artifact: scratchpad 에 신선 vite+react+tailwind 프로젝트 생성 → `/r/saas-app-shell.json` fetch 이식(entry-protocol A-2.5 경로 그대로: files[].content 기록 + dependencies 설치 + registryDependencies 해결) → 임의 비-askewly 토큰(테스트용 DESIGN.md 1본)으로 restyle → `npx @askewly/design verify` 0건 → dev 서버 + 실브라우저 스모크(대시보드·설정·빈 상태 렌더 + 콘솔 에러 0) + 스크린샷 → `evidence/reusable-composition/m18-block-tier.md`(실측표·이식 로그·스크린샷 경로·판정).
  - Files: write evidence/reusable-composition/m18-block-tier.md. scratchpad(신선 프로젝트 — 레포 밖).
  - Risk: 기계적 (검증 — 레포 변경은 evidence 만)
  - Dependencies: step-4
  - Verify: 이식 프로젝트 빌드 PASS + 브라우저 콘솔 에러 0 + verify 0건 + 스크린샷 ≥2장(라이트/다크) + evidence 문서 존재. restyle 후 askewly 팔레트 잔존 0(판단 주입 ≠ 스타일 주입 계약).
  - Failure probe: registryDependencies 재귀 해결에서 shadcn 내장 primitive 버전 충돌 — 이식 로그에 실패 그대로 기록하고 계약 문서의 소비 경로 절에 해결 절차 추가(실패를 문서 입력으로 회수).
  - Commit: changeset (README 절: step-5).

## 검증/DoD

- **DoD**: 외부 공개 블록 실사·베이스 판정(출처 전건 + absorption-criteria 행)이 기록되고, 앱 골격급 자산 등급이 계약 문서·registry 표현·entry-protocol 소비 경로로 정본화되며, 첫 실물 saas-app-shell(판정 베이스 출발, 외부 흡수 시 라이선스 표기 포함)이 **외부 신선 프로젝트 이식 + 비-askewly 토큰 restyle + verify 0건 + 실브라우저 스모크**를 통과. 실패 모드 확인 = purity gate 자기시험(금지 import 실제 FAIL) + 기존 27 자산 회귀 diff 0. check-llms-sync PASS.
- **Evidence**: `evidence/reusable-composition/m18-block-tier.md`
- **회귀 게이트**: 기존 code asset 27종 출력 diff 0 · 사이트 빌드 PASS · llms 동기화 PASS.

## 수치 출처

- code asset 27종: `curl https://ui.askewly.com/r/registry.json` (2026-08-04 실행).
- purity gate 허용 표면: `scripts/generate-registry.mjs` L27 `ALLOWED` (2026-08-04 실측).
- registry:block 타입·재귀 해결: `research/2026-07-19-recipe-code-reuse-shadcn-registry.md` §2 (shadcn 공식 문서, 접근 2026-07-19).

## finding 큐

- 두 번째 블록(marketing-landing — st4 조합 패턴 12종이 재료) · docs-site 블록.
- harvest 회수 계약(자기 산출물 → 자산 승격) — 후속 goal 후보.
- 사이트 공개 표면 노출(블록 열람 페이지) — site-blueprint 증축 판단 필요.

## 진행 로그

- 2026-08-04 작성.
- 2026-08-04 fresh 검증자 반영 — ① registry:block 이 이미 전 자산 타입임을 실측, 등급 구분을 meta.tier 로 정정 ② cssVars 필드 미실재 적발, restyle 지점을 "요구 CSS 변수 목록" 선언으로 정정 ③ 구 step-2 를 생성기 확장과 블록 구현으로 분해.
- 2026-08-04 사용자 방향 반영 — **흡수 우선**: 외부 공개 블록 실사·베이스 판정을 step-1 로 신설(베이스 채택 규칙 결정 로그 사전 소진), 블록 구현은 판정 베이스 출발로 변경. step 5개로 재배열.
