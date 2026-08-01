# PLAN — M13: 흡수 지식 사이트 반영 — 레시피 소배치 + knowledge 사람용 노출 (goal 2/2)

> 생성: 2026-08-01 · 갈래: RL 승격 배치 + 사이트 표면 · scope: 오늘 다변화 라운드가 만든 knowledge 4본(mobile-navigation·dashboard-density·checkout-flow·focus-keyboard)을 사람이 보는 사이트에 회수한다 — 실동작 레시피 소배치 1회 + knowledge 결정표의 사람용 문서 노출. goal `usage-and-site-surfacing` 2번 milestone (연쇄: M12 → M13).
Status: approved (사용자 승인 2026-08-01 "ㄱㄱ" — 연쇄 M12→M13 일괄 승인)

## 북극성 → milestone → step (위계)
- **북극성**: Askewly Design — 사람이 둘러보는 시각 라이브러리와 에이전트용 시스템이 같은 정본을 공유한다. 지금은 knowledge 층만 다변화되고 사람 표면이 그 변화를 못 보여준다(갭 ③).
- **goal**: `usage-and-site-surfacing` · **리서치 입력**: 이 세션 조사 완료 — recipes 47건/10그룹 현황, 신규 레시피 1건의 등록 경로 5단계(md+code_asset+gallery-data+demos+registry), knowledge 4본과 기존 레시피 중복 지도. 판정: 신규 code_asset 가치가 확실한 표면은 mobile-navigation 1~2건, focus-keyboard 는 레시피화 부적합(행동 계약 — 8/1 배치의 recipes:0 판정과 정합), dashboard·checkout 은 기존 레시피가 구조를 커버해 억지 승격 금지.

## Scope Boundary
- **포함**: ① mobile-navigation 조합 레시피 승격 소배치 1회(1~2건 — knowledge 결정표를 실동작으로 구현: 태스크 깊이·플랫폼별 내비 컨테이너 적응 데모 중심) — recipe md + code_asset + 갤러리 등록 + build:data/build:catalog + ledger 신규 batch 행 ② knowledge 4본의 사람용 노출 — 사이트 docs 표면에 판정 결정표 문서 페이지(요약 + 관련 terms·recipes 상호 링크) ③ 통합 실브라우저 스모크.
- **제외**: dashboard-density·checkout-flow·focus-keyboard 의 신규 레시피(억지 승격 금지 — 수요 발생 시 후속 배치) · 기존 레시피 47건 개정 · Pro 잠금 정책 변경.
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / user_stopped
- rollback/cleanup: 커밋 단위 revert. 생성물(build:data·build:catalog·llms) 재생성으로 복원.

## 스캐폴딩 결정
- source-of-truth: 레시피 계약 = `docs/design-system/recipe-format.md`(8섹션·frontmatter 필수 필드·tokens semantic-only). 코드 SSOT = code_asset tsx. 사이트 docs 페이지 = `documentation-pages.ts`.
- 검증: validate-recipes.py + validate-ui-vocabulary.py + generate-tokens/llms + check-llms-sync + site build·lint + build:data + **build:catalog(이번엔 레시피 승격 있음 — 필수)** + audit:visuals + 실브라우저 스모크.
- 배포/운영: goal 마감 일괄 push — 사용자 승인 후(deploy batching 규약).
- 자기선언 도메인 — 없음.
- 검토 후 제외: 신규 term 추가 — knowledge 4본 배치에서 term 보강 완료, 이번엔 레시피·사이트 표면만.
- 검토 후 제외(2): knowledge md 원문의 사이트 직렌더(markdown 파이프 신설) — documentation-pages.ts 기존 구조에 수기 요약으로 착지(파이프 신설은 과설계, 4페이지 수기가 더 작다).

## 결정 로그
- status: resolved
- **사용자 확정(2026-08-01)**: 갭 ③ 진행 ("응. 2,3번 순서로 ㄱㄱ"). 범위 = mobile-navigation 소배치 + knowledge 4본 노출(승인 제시에 명시 — 억지 4배치 아님).
- **기술 결정**: ① 레시피 후보 = `adaptive-navigation-container`(결정표 구현: 목적지 수·태스크 깊이·플랫폼별 tab bar↔rail↔drawer 적응) 1건 확정 + `sheet-detent-flow`(모달 깊이·detent 규율) 1건 조건부(step-1 에서 기존 bottom-sheet-detents 와의 차별성 판정 후 — 차별성 없으면 1건으로 마감, 억지 승격 금지) ② knowledge 노출 형식 = docs 페이지 4건 — 대상은 **정확히 이 4개만**(mobile-navigation·dashboard-density·checkout-flow·focus-keyboard — knowledge/ 의 다른 5본 제외), 각각 "언제 무엇을 고르는가" 결정표 요약 + 관련 레시피·terms 딥링크 + llms 원문 링크 ③ pattern_group = navigation(어휘 고정 10종 내) ④ `sheet-detent-flow` 2건째의 차별성 판정 기준: 기존 `overlays/bottom-sheet-detents` 는 *단일 시트의 detent 규율*(스냅 지점·드래그) — 신규가 정당하려면 knowledge §모달 깊이의 *플로우 계약*(시트→풀스크린 전환 임계·중첩 금지 규칙)을 실연해야 한다. 이 경계를 못 세우면 승격하지 않고 1건으로 마감(재량 아님 — 이 기준이 판정 정본).
- 그 외 새 사용자 소유 결정: 없음.

## Step 트리

- [x] **step-1 — mobile-navigation 레시피 승격 소배치**
  - Artifact: `recipes/navigation/adaptive-navigation-container.md`(+조건부 2건째) + code_asset tsx(실동작 데모 — knowledge/mobile-navigation.md 결정표 준수, 토큰 semantic-only) + 갤러리 3파일 등록(recipe-gallery-data·recipe-gallery-demos·demo-registry) + ledger 신규 batch 행(`20260801-mobile-nav-recipes`, promoted 에 recipe id·code_asset 경로) + build:data·build:catalog 재생성.
  - Files: write recipes/navigation/adaptive-navigation-container.md, examples/ui-vocabulary-site/src/components/(신규 데모 tsx), examples/ui-vocabulary-site/src/lib/recipe-gallery-data.ts, examples/ui-vocabulary-site/src/components/recipe-gallery-demos.tsx, examples/ui-vocabulary-site/src/lib/recipe-gallery-demo-registry.ts, docs/research/loop/ledger.md, packages/cli/data/(재생성), packages/component-registry/(재생성). read knowledge/mobile-navigation.md, docs/design-system/recipe-format.md, recipes/navigation/, recipes/overlays/bottom-sheet-detents.md.
  - Risk: 위험 (정본 recipes + 생성물 재생성 — 검증 체인으로 차단)
  - Dependencies: 없음 (M12 완료가 전제 — 연쇄 순서)
  - Verify: `python scripts/validate-recipes.py` PASS + `npm run build:data` + `npm run build:catalog` + site build + `npm run audit:visuals`(신규 데모 generic-renderer 아님).
  - Failure probe: 기존 bottom-tab-bar·bottom-sheet-detents 와 중복 판정 위험 — audit-recipe-candidates 성격의 자기 대조를 레시피 Intent 에 명시(기존 = 단일 컨테이너, 신규 = 컨테이너 간 적응·선택 규칙의 실연). 차별성 못 세우면 승격 축소.
  - Commit: changeset `m13-knowledge-site-surfacing` (README 절: step-1).

- [ ] **step-2 — knowledge 4본 사람용 문서 노출 + 통합 스모크 (M13 마감)**
  - Artifact: 사이트 docs 표면에 판정 가이드 페이지 4건(mobile-navigation·dashboard-density·checkout-flow·focus-keyboard — 결정표 요약 + 관련 recipes·terms 딥링크 + llms 원문 링크) + 내비 등록 + `evidence/usage-and-site-surfacing/m13-knowledge-site-surfacing.md`.
  - Files: write examples/ui-vocabulary-site/src/lib/documentation-pages.ts(페이지 정의 + `docsNavGroups` 내비 등록 — 같은 파일), evidence/usage-and-site-surfacing/m13-knowledge-site-surfacing.md. read knowledge/*.md(대상 4본), examples/ui-vocabulary-site/src/lib/documentation-pages.ts.
  - Risk: 기계적 (사이트 콘텐츠 추가 — 빌드·스모크로 차단)
  - Dependencies: step-1
  - Verify: site build·lint PASS + 실브라우저 통합 스모크(신규 docs 페이지 4건 렌더 + 신규 레시피 갤러리 데모 실동작 + 딥링크 왕복) — M12·M13 산출물을 한 번의 브라우저 패스로 확인.
  - Failure probe: 결정표 요약이 knowledge 원문과 어긋나는 이중 정본 위험 — 페이지는 요약+링크로 한정하고 "정본은 knowledge/llms" 명시(수치·규칙 전문 복제 금지).
  - Commit: changeset `m13-knowledge-site-surfacing` (README 절: step-2).

## 검증/DoD
- **DoD**: 다변화 라운드의 산출이 사람 표면에 존재 — 신규 실동작 레시피 ≥1(mobile-navigation, 전 검증 체인+build:catalog PASS) + knowledge 4본이 사이트 docs 에서 탐색 가능(실브라우저 확인). 실패 모드: 갤러리 등록 누락 = audit:visuals·실브라우저가 차단.
- **Evidence**: `evidence/usage-and-site-surfacing/m13-knowledge-site-surfacing.md`
- **회귀 게이트**: 전 검증 체인 + 기존 47 레시피 무회귀(validate-recipes 전건) + ledger 무손실 + M12 grep 게이트 재실행(오기 재유입 0 — goal 마감 시점 회귀 확인).

## finding 큐
- (실행 중 발견 항목)

## 진행 로그
- 2026-08-01 작성.
