# PLAN — M21: 회수 계약(harvest) 정본화 + 첫 승격 실증

> 생성: 2026-08-04 · 산출물: changeset (계약 문서 + 승격 실증 코드/registry) · scope 결정: 계약 문서 정본화 → M20 확정 후보 1~2건 실제 승격 E2E 까지
> milestone-레벨 durable plan doc. Claude/Codex 가 이 문서만 읽고 이어받는 단일 장부.

Status: approved (사용자 승인 2026-08-04 "ㄱㄱ" — M20+M21 연쇄, 승격 대상은 M20 step-3 확정이 입력)

## 북극성 → milestone → step (위계 — 2계층)

- **북극성**: Askewly Design — "일회성 작업에서 → 반복 가능한 루프로" (← `CLAUDE.md` 「북극성」 절). M20 이 회수할 재료를 확정하면, M21 은 그 재료가 저장고(registry·블록·자산)로 되돌아오는 **반복 가능한 계약**을 정본화하고 실물 1~2건으로 실증한다.
- **milestone**: 리프 판정상 milestone 근거: 독립 step ≥2(계약 문서 / 승격 구현 / 통합 검증) + 통합 검증(registry 회귀 + verify + 브라우저 스모크) + 단독 capability(이후 모든 해커톤·프로젝트 산출물이 이 경로로 자산화) + 사용자 관측 게이트.
- **조사 인용 (M12 규약)**: `docs/design-system/absorption-criteria.md`(흡수 판정 — 자기 산출물 축은 M20 결정 2 승계) · `docs/design-system/block-contract.md`(승격 목적지 등급 계약) · `archive/plans/2026-08-04-m18-composition-block-tier.md` 기술 결정(meta.tier·purity gate·요구 CSS 변수 — 승격물도 같은 게이트 통과) · `docs/design-system/no-asset-fallback.md`.

## run 전 scope 결정 (확정)

- **결정**: M21 전체(step-1~3). 승격 대상·건수는 M20 step-3 사용자 확정이 입력(계획상 1~2건). 제외: CLI npm publish(별도 큐·승인 게이트) · 사이트 공개 페이지 노출 · 두 번째 블록 marketing-landing(독립 큐 — 단, M20 조사가 재료를 지목하면 finding 으로 연결만).
- **execution mode**: `continuous`
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / user_stopped. human gate = step-3(승격 실물 사용자 관측).
- **진행 보고**: commentary only.
- **rollback/cleanup**: 커밋 단위 revert. registry 재생성은 기존 자산(27종+블록) diff 0 회귀 게이트로 보호(M18 선례). 승격 실험 임시 프로젝트는 scratchpad.

## 스캐폴딩 결정

- source-of-truth: 계약 정본 = `docs/design-system/harvest-contract.md`(신설 — 한국어 정본 명칭 "회수 계약(하베스트)"). 승격물 코드 SSOT = 기존 규약 승계(`examples/ui-vocabulary-site/src/components/…` — RC1 원칙). 배포 표현 = `/r/<name>.json`.
- 검증: `node scripts/generate-registry.mjs` 기존 자산 diff 0 + `node scripts/check-llms-sync.mjs` PASS + `npx @askewly/design verify`(로컬 CLI) 0건 + 사이트 dev 서버 실브라우저 스모크.
- 배포/운영: llms·registry 재생성 커밋. push 는 세션 일괄(사전 요약 보고 — deploy-batching 규약).
- 자기선언 도메인 — 계약 내용 소유: 회수 계약이 정하는 것 = ①후보 판정 축(M20 결정 2 인용) ②승격 절차(재료 추출→restyle 정규화→토큰 대조→registry 등재→검증 체인) ③출처 표기(원 산출물 레포·날짜 — 자기 산출물이라도 이력 명시) ④중복 규칙(기존 자산과 겹치면 신규 등재 대신 기존 자산 보강/alias). 등급 신설 없음 — 승격 목적지는 기존 등급(asset/block)만.
- 검토 후 제외: harvest 자동화 스크립트(CLI 서브커맨드 등) — 첫 실증은 수동 절차 문서가 정본, 기계화는 반복 실적 후 별도 판단(과설계 방지).

## 결정 로그 (run 전 사전 소진)

- 결정 1 — 계약 이름·위치: `docs/design-system/harvest-contract.md`, 정본 명칭 "회수 계약(하베스트)" (용어 규칙 — 한국어 정본 + 원어 병기 1회) → **확정** (기술 결정 — 기존 design-system 문서 관례 승계).
- 결정 2 — 승격 목적지: 기존 등급(asset/block)만, 신설 등급 없음 → **확정** (block-contract·agent-asset-model 이 이미 그릇 소유 — 발명 없음).
- 결정 3 — 승격 대상·건수 = **사용자 소유**, M20 step-3 확정이 이 milestone 의 입력(1~2건 추천). M20 완료 전 step-2 착수 금지.
- status: resolved

## Step 트리

- [ ] **step-1 — 회수 계약 문서 정본화 + 배선**
  - Artifact: `docs/design-system/harvest-contract.md` 신설(판정 축·승격 절차·출처 표기·중복 규칙·검증 체인) + entry-protocol 백링크(신규 자산 유입 경로로 1줄) + llms 등재.
  - Risk: 기계적 (문서 + llms 재생성 — 코드 무변경)
  - Files: write docs/design-system/harvest-contract.md. edit docs/design-system/entry-protocol.md(1줄 배선) + scripts/generate-llms-txt.mjs(FIXED_ASSETS 배열에 harvest-contract 등재 — absorption-criteria.md L28 규약, fresh 검증자 적발 반영). run llms 재생성 + scripts/check-llms-sync.mjs.
  - Dependencies: none
  - Verify: 계약 문서 존재 + 4 요소(판정 축·절차·출처 표기·중복 규칙) grep 확인 + 재생성된 llms.txt 에 harvest-contract 항목 grep 1건 + `node scripts/check-llms-sync.mjs` PASS.
  - Failure probe: FIXED_ASSETS 등재 없이 문서만 추가한 상태에서 llms.txt 에 harvest-contract 가 나타나지 않음을 먼저 확인(미등재=미배포 실측) 후 등재.
  - Commit: changeset `20260804-m21-harvest-contract` (README 절: step-1).
- [ ] **step-2 — 첫 승격 실증 (M20 확정 후보 1~2건)**
  - Artifact: 후보 재료를 계약 절차 그대로 승격 — 재료 추출→restyle 정규화(토큰 하드코딩 제거)→registry 등재(meta·requiredCssVars)→`/r/<name>.json` 생성. 절차 이탈 지점은 계약 문서에 즉시 반영(계약이 실물로 검증되는 것이 목적).
  - Risk: 위험 (registry 재생성이 기존 자산 출력에 영향 가능 — diff 0 회귀 게이트로 방어)
  - Files: write examples/ui-vocabulary-site/src/components/…(승격물 — 대상은 M20 확정 후). edit registry 관련(generate-registry 경로는 기존 계약 내 사용, 수정 최소). run scripts/generate-registry.mjs.
  - Dependencies: step-1 (계약 절차가 실증의 대본)
  - Verify: 신규 `/r/<name>.json` 존재 + 기존 자산 재생성 diff 0 + purity gate PASS + `npm run build`·`npm run lint`(examples/ui-vocabulary-site) PASS.
  - Failure probe: 승격물에 하드코딩 색/토큰 이탈을 1개 심은 상태에서 purity/verify 게이트가 실제로 FAIL 하는지 확인 후 제거(게이트 자기시험).
  - Commit: changeset (README 절: step-2).
- [ ] **step-3 — 통합 검증 + 사용자 관측**
  - Artifact: 신선 프로젝트에 승격물 이식 E2E(fetch→이식→restyle→verify 0건→실브라우저 스모크) + 사용자 관측 1회 + 회수 루프 재현 절차(다음 산출물이 따라올 커맨드 시퀀스)를 계약 문서 부록으로.
  - Risk: 기계적 (검증·문서 — 신선 프로젝트는 scratchpad)
  - Files: edit docs/design-system/harvest-contract.md(부록). scratchpad(신선 프로젝트).
  - Dependencies: step-2
  - Verify: E2E 체인 전 구간 PASS 기록 + 사용자 관측 기록.
  - Failure probe: requiredCssVars 미충족 신선 프로젝트에서 verify 가 실제로 실패하는지 1회 확인(빈 토큰 정의로 재현) 후 정상 경로 재검증.
  - Commit: changeset (README 절: step-3).

## 재생성 장벽

- after: step-1, step-2 · run: `node scripts/check-llms-sync.mjs && node scripts/generate-registry.mjs` (llms·registry 재생성 후 diff 게이트 확인)

## 검증/DoD

- **DoD**: 회수 계약 문서 llms 등재 + 승격 실증 ≥1건이 [기존 자산 diff 0 · purity PASS · build/lint PASS · 신선 프로젝트 E2E 스모크] 전 구간 통과 + 사용자 관측 1회. 실패 모드 검증 = 게이트 자기시험 2건(step-2·step-3 Failure probe).

## finding 큐 (작업 중 발견 — 다음 step/changeset 으로 흘림)

- (예약) M20 조사가 marketing-landing 블록 재료를 지목하면 두 번째 블록 큐에 연결.

## 진행 로그 (append-only)

- (없음)
