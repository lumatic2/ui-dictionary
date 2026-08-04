# PLAN — M23: harvest 배치 2 — M22 확정 목록 승격 집행

> 생성: 2026-08-04 · 산출물: changeset (승격 자산·문서·registry) · scope 결정: M22 확정 목록 상위 배치(최대 6건) 승격 + 통합 E2E + 사용자 관측
> milestone-레벨 durable plan doc. Claude/Codex 가 이 문서만 읽고 이어받는 단일 장부.

Status: approved (사용자 승인 2026-08-04 "ㄱㄱ" — M22+M23 연쇄, 집행 목록은 M22 step-3 확정이 입력)

## 북극성 → milestone → step (위계 — 2계층)

- **북극성**: Askewly Design — 입력 루프 반복 가동 (← `CLAUDE.md` 「북극성」 절). M21 이 계약·재현 절차를 정본화했으니 이번은 그 계약의 **배치 반복 집행**이다.
- **milestone**: M22 확정 목록의 상위 배치(최대 6건 — 잔여는 후속 배치로 이월)를 harvest-contract 6단 그대로 승격하고, 통합 E2E 1회 + 사용자 관측으로 닫는다. 리프 판정 근거: 독립 step ≥2(자산 승격/문서·팔레트 착지/통합 검증) + 통합 검증 + 단독 capability.
- **조사 인용**: `docs/design-system/harvest-contract.md` 부록 8단(재현 시퀀스 — 시간차 스크린샷 의무) · M22 mining ledger(집행 목록 입력).

## run 전 scope 결정 (확정)

- **결정**: M22 확정 목록 상위 최대 6건. 착지 형태는 M22 step-3 확정을 그대로 집행(재해석 금지). 제외: 잔여 재료(후속 배치) · CLI npm publish · 사이트 공개 페이지 노출.
- **execution mode**: `continuous`
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / user_stopped. human gate = step-3(승격 실물 관측).
- **진행 보고**: commentary only.
- **rollback/cleanup**: 커밋 단위 revert. registry 재생성은 기존 자산 diff 0 게이트(승격분 제외 순수 추가 확인). E2E 신선 프로젝트는 scratchpad.

## 스캐폴딩 결정

- source-of-truth: 승격물 코드 = `examples/ui-vocabulary-site/src/components/…`(RC1) · 문서 착지 = `knowledge/`·`recipes/`(해당 시) · 팔레트 착지 = M22 확정 형태 그대로.
- 검증: harvest-contract 부록 8단 전 구간(diff 0·purity·build/lint·llms-sync·신선 E2E verify·시간차 실브라우저) + 착지가 문서·팔레트면 해당 게이트(llms 등재·킥스타트 브리프 옵션 실구동).
- 배포/운영: registry·llms 재생성 커밋. push 세션 일괄.
- 위임: skip — 승격 재작성은 품질 판단 밀도가 높아(시그니처 준수·간결화) 오케스트레이터 직접, E2E 관측만 필요 시 보조.
- 검토 후 제외: harvest 자동화 스크립트 — M21 결정 유지(반복 실적 후 재판단).

## 결정 로그 (run 전 사전 소진)

- 결정 1 — 배치 상한 기본값 6건·잔여 이월, 단 **M22 확정 목록이 나온 시점에 상한을 재검**해 사용자 확정에 포함(목록이 6±α 로 갈리면 게이트에서 함께 매듭 — fresh 검증자 적발 반영: 목록을 모르는 시점의 고정 상한 금지) → **확정**.
- 결정 2 — 집행 목록·착지 = M22 step-3 사용자 확정이 유일 입력, 재해석 금지 → **확정**.
- status: resolved

## Step 트리

- [ ] **step-1 — 컴포넌트/모션 승격 (asset 착지분)**
  - Artifact: 확정 목록 중 asset 착지분을 계약 §3 6단(추출→restyle 정규화→선언→등재→재생성)으로 승격 — meta.harvest 출처 전건.
  - Risk: 위험 (registry 재생성 — diff 0 게이트로 방어)
  - Files: write examples/ui-vocabulary-site/src/components/…(M22 확정 목록이 지정 — 착수 전 이 plan 진행 로그에 실파일 목록 기록). edit examples/ui-vocabulary-site/registry.json. run scripts/generate-registry.mjs.
  - Dependencies: none (milestone 전제: M22 완료 — ROADMAP marker 가 소유, 확정 목록 없이 착수 금지)
  - Verify: 기존 자산 재생성 diff 0(순수 추가) + purity PASS + 신규 `/r/*.json` 전건 존재 + build/lint PASS.
  - Failure probe: 승격물 1건에 hex 리터럴 주입 → verify 적발 확인 후 제거(게이트 자기시험 — M21 선례).
  - Commit: changeset `20260804-m23-harvest-batch2` (README 절: step-1).
- [ ] **step-2 — 비-asset 착지 집행 (문서·팔레트·구조분)**
  - Artifact: 확정 목록 중 knowledge/recipe/팔레트/블록 착지분 집행 + llms 재생성(FIXED_ASSETS 규칙) — 팔레트 착지면 킥스타트 브리프 옵션 실구동 1회.
  - Risk: 기계적 (문서·설정 — 코드 게이트는 해당 시 step-1 규칙 준용)
  - Files: knowledge/·recipes/·scripts/generate-llms-txt.mjs·packages/cli(팔레트 옵션 확정 시) — M22 확정 목록이 지정, 착수 전 진행 로그에 실파일 목록 기록.
  - Dependencies: none (milestone 전제: M22 완료 — 확정 목록 없이 착수 금지)
  - Verify: 착지물 전건 존재 + check-llms-sync PASS (+팔레트면 CLI 실구동 출력).
  - Failure probe: llms 미등재 상태에서 llms.txt 부재 확인 후 등재(M21 선례).
  - Commit: changeset (README 절: step-2).
- [ ] **step-3 — 통합 E2E + 사용자 관측**
  - Artifact: 신선 프로젝트 이식 E2E(부록 8단 — 시간차 스크린샷 의무) + 관측 보드 갱신 + 사용자 관측 1회 + 잔여 이월 목록 기록.
  - Risk: 기계적 (검증·문서)
  - Files: scratchpad(신선 프로젝트) · research ledger(이월 기록).
  - Dependencies: step-1, step-2
  - Verify: E2E 체인 전 구간 PASS + 사용자 관측 기록.
  - Failure probe: 모션 자산은 시간차 2장 이상에서 상태 전이 확인 — 정지 화면 1장 판정 금지(M21 실적발 교훈).
  - Commit: changeset (README 절: step-3).

## 재생성 장벽

- after: step-1, step-2 · run: `node scripts/generate-registry.mjs && node scripts/generate-llms-txt.mjs && node scripts/check-llms-sync.mjs`

## 검증/DoD

- **DoD**: 확정 배치 전건 승격(착지 형태별 게이트 통과) + 통합 E2E 1회 + 사용자 관측 1회 + 잔여 이월 명시. 실패 모드 검증 = 게이트 자기시험 2건(step-1·step-2 probe).

## finding 큐 (작업 중 발견 — 다음 step/changeset 으로 흘림)

- (이월 후보) CLI verify chart.tsx 속성 셀렉터 오탐 — M21 finding 승계.

## 진행 로그 (append-only)

- (없음)
