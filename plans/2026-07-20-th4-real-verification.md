# PLAN — TH4 검증 실체화

> 생성: 2026-07-20 · 갈래: tooling · scope 결정: exporter 실제 실행·산출물 파싱 검사·negative probe까지
Status: approved (2026-07-20)

## 북극성 → horizon → milestone → step (위계)
- **북극성**: Askewly Design을 공개 참고 시스템이자 에이전트가 직접 쓰는 구현 시스템으로 만든다. (← `OBJECTIVE.md`)
- **horizon**: 템플릿 제작 시스템 경화 (← `plans/horizons/2026-07-template-production-hardening.md`)
- **milestone**: TH4 — "통과했다"만 확인하는 검증을 "훼손하면 실패한다"까지 확인하는 검증으로 바꾼다.

## Scope Boundary
- **결정**: 기존 `scripts/verify-template-production-system.mjs`를 대체한다. 새 검증 프레임워크를 도입하지 않고 현 구조를 확장한다.
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / secret_required / external_authority_required / user_stopped
- **진행 보고**: commentary only. 미완 leaf는 턴 종료점이 아니다.
- rollback/cleanup: 생성된 export 산출물은 검증 후 임시 디렉터리에서 정리한다. `evidence/` manifest만 남긴다.

## 스캐폴딩 결정
- source-of-truth: 검증 결과의 정본은 **스크립트의 exit code**다. `e2e-manifest.json`은 사람이 읽는 부산물이지 판정 근거가 아니다.
- 검증: 스크립트 자체 실행(positive) + 훼손 fixture 실행(negative) 양방향.
- 배포/운영: 단일 npm script로 노출해 CI에서 부를 수 있게 한다. 실제 CI 파이프라인 구성은 제외.
- 산출물 검사: HTML은 슬롯 텍스트 포함 여부와 파싱 가능성, SVG는 XML 유효성과 슬롯 요소 개수, JSON은 스키마 검증.
- 검토 후 제외: 시각 회귀(스크린샷 diff)·성능 측정 — 별도 후보. 인증·DB·배포·관측 — 걸리지 않음.

## 결정 로그
- status: resolved
- 현 스크립트의 `exports:['json','html','svg']`는 하드코딩 문자열이다 — exporter를 실제 호출한 결과로 대체한다.
- negative probe 3종은 서로 다른 계층을 노린다: 콘텐츠 누락(컴파일 계층), 토큰 참조 깨짐(검증 계층), export 산출물 훼손(내보내기 계층).
- 사용자 결정 필요 항목 없음.

## Step 트리

- [ ] **step-1 — real-export-execution**
  - Artifact: 검증 스크립트가 6개 청사진 각각에 대해 JSON/HTML/SVG exporter를 실제 실행하고 산출물을 파싱 검사한다.
  - Files: read/write `scripts/verify-template-production-system.mjs`; read `apps/template-studio/src/exporters.ts`(공유 가능하면 core로 승격).
  - Dependencies: TH3 complete
  - Verify: 스크립트 실행 시 6청사진 × 3형식 = 18개 산출물이 생성되고 전부 파싱 검사를 통과. manifest의 exports 항목이 실행 결과에서 도출됨.
  - Failure probe: exporter가 빈 문자열을 반환하도록 임시 조작하면 exit≠0이 된다 — 확인 후 되돌린다.
  - Commit: changeset `verify-real-export-execution`.

- [ ] **step-2 — negative-probes**
  - Artifact: fixture 훼손 3종(콘텐츠 누락·토큰 참조 깨짐·export 산출물 훼손)에 대해 각각 exit≠0을 내는 negative probe가 검증에 포함된다.
  - Files: read/write `scripts/verify-template-production-system.mjs`, 훼손 fixture, `package.json` scripts.
  - Dependencies: step-1
  - Verify: 단일 커맨드가 positive PASS + negative 3종 전부 exit≠0 관측을 한 번에 보고하고, 하나라도 어긋나면 전체가 실패한다.
  - Failure probe: negative probe 하나를 일부러 통과하게 만들면(훼손을 검출 못 하게) 전체 검증이 실패한다 — probe 자체가 게이트임을 증명. 확인 후 되돌린다.
  - Commit: changeset `verify-negative-probes`.

## 검증/DoD
- **DoD**: 단일 커맨드가 6청사진 × 3형식 exporter를 실제 실행해 산출물을 파싱 검사하고, 훼손 3종에 대해 각각 exit≠0을 관측하며, probe가 무력화되면 전체가 실패한다.
- **Evidence**: `evidence/template-production-hardening/th4-verification.md` + negative probe 실행 로그

## finding 큐
- 시각 회귀(스크린샷 diff) 게이트는 별도 후보.
- exporter를 core로 승격할지는 step-1에서 판단해 여기 기록한다.

## 진행 로그
- 2026-07-20 계획 작성, 승인 대기.
