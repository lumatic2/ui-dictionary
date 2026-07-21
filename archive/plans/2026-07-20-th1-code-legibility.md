# PLAN — TH1 코드 가독성 복구 + 회귀 방어망

> 생성: 2026-07-20 · 갈래: tooling · scope 결정: template 제작 스택 3표면의 압축 해제와 재발 차단까지
Status: approved (2026-07-20)

## 북극성 → horizon → milestone → step (위계)
- **북극성**: Askewly Design을 공개 참고 시스템이자 에이전트가 직접 쓰는 구현 시스템으로 만든다. (← `OBJECTIVE.md`)
- **horizon**: 템플릿 제작 시스템 경화 (← `plans/horizons/2026-07-template-production-hardening.md`)
- **milestone**: TH1 — 이후 5개 milestone이 편집할 코드를 사람이 읽고 고칠 수 있는 상태로 만들고, 그 과정에서 동작이 바뀌지 않았음을 증명한다.

## Scope Boundary
- **결정**: 포맷과 가독성만 바꾼다. 로직 개선·리팩터링·죽은 코드 삭제는 하지 않는다(발견 시 finding 큐에만 적는다).
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / secret_required / external_authority_required / user_stopped
- **진행 보고**: commentary only. 미완 leaf는 턴 종료점이 아니다.
- rollback/cleanup: 각 step은 독립 revert 가능. 서명 대조 실패 시 해당 step을 되돌리고 재시도한다.

## 스캐폴딩 결정
- source-of-truth: 동작의 정본은 **복구 전에 고정한 `templateSignature` 값**이다. 이 값이 대조 기준이며 코드가 아니다.
- 검증: 기존 Vitest 스위트 + 서명 전후 대조 + 최대 줄 길이 lint.
- 배포/운영: 해당 없음 — 로컬 패키지·스크립트만 바뀌고 배포면 변화 없음.
- lint 규칙: 최대 줄 길이 300자. 기존 코드가 전부 위반하므로 step-1/2 완료 후에 켠다.
- 포맷 도구: 레포에 이미 있는 설정을 따른다(별도 도구 도입 없음). 없으면 수동 포맷 + lint 규칙만 건다.
- 검토 후 제외: 테스트 추가·타입 강화·성능 — TH2~TH4가 각자 다룬다. 인증·데이터·배포·관측 — 이 작업에 걸리지 않음.

## 결정 로그
- status: resolved
- 사용자 확정(2026-07-20): 압축 코드 **전면 복구**. 만지는 파일만 푸는 절충안은 기각 — 이후 milestone이 어차피 전 표면을 건드린다.
- 임계값 300자는 현 코드 실사(300~1,000자 라인 다수, 정상 코드는 100자 내외)에서 도출. 사용자 결정 불요.

## Step 트리

- [ ] **step-1 — core-legibility**
  - Artifact: `packages/template-core` 전 소스가 정상 포맷으로 해제되고, 복구 전 서명이 fixture 파일로 고정된다.
  - Files: read/write `packages/template-core/src/**/*.ts`; 신규 `packages/template-core/src/__fixtures__/signatures.json`(복구 전 서명 3종).
  - Dependencies: 없음
  - Verify: `npm --prefix packages/template-core test` PASS + 해제 후 세 fixture 서명이 `signatures.json`과 일치.
  - Failure probe: `signatures.json`의 값을 일부러 1글자 바꾸면 대조 테스트가 FAIL한다(대조가 실제로 작동함을 증명).
  - Commit: changeset `template-core-legibility`.

- [ ] **step-2 — studio-and-script-legibility**
  - Artifact: `apps/template-studio` 소스와 `scripts/verify-template-production-system.mjs`가 정상 포맷으로 해제된다.
  - Files: read/write `apps/template-studio/src/**`, `scripts/verify-template-production-system.mjs`.
  - Dependencies: step-1
  - Verify: 스튜디오 빌드 PASS + 기존 Playwright smoke PASS + verify 스크립트 실행 결과 manifest가 해제 전과 동일.
  - Failure probe: 해제 중 JSX 구조가 깨졌다면 빌드가 실패한다 — 빌드 통과만으로 부족하므로 Playwright로 세 형식 렌더 nonblank를 함께 확인한다.
  - Commit: changeset `template-studio-script-legibility`.

- [ ] **step-3 — line-length-guard**
  - Artifact: 최대 줄 길이 300자 lint 규칙이 template 스택에 적용되고 CI 가능한 단일 커맨드로 실행된다.
  - Files: 레포 lint 설정 파일, `package.json` scripts.
  - Dependencies: step-2
  - Verify: lint 커맨드 exit 0.
  - Failure probe: 임의 파일에 400자 라인을 넣으면 exit≠0이 된다 — 확인 후 되돌린다.
  - Commit: changeset `template-line-length-guard`.

## 검증/DoD
- **DoD**: template 제작 스택 3표면에 300자 초과 라인이 0개이고, 해제 전후 세 fixture의 `templateSignature`가 동일하며, 재발을 막는 lint가 단일 커맨드로 돈다.
- **Evidence**: `evidence/template-production-hardening/th1-legibility.md`

## finding 큐
- 해제 중 발견한 로직 결함·죽은 코드는 고치지 말고 여기에 적어 TH2~TH4로 넘긴다.

## 진행 로그
- 2026-07-20 계획 작성, 승인 대기.
