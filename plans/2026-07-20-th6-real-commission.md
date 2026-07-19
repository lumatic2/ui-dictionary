# PLAN — TH6 실사용 실연 + horizon close

> 생성: 2026-07-20 · 갈래: product · scope 결정: 실제 의뢰 1건의 전 루프 관측과 닫는 기준 7항 대조까지
Status: approved (2026-07-20)

## 북극성 → horizon → milestone → step (위계)
- **북극성**: Askewly Design을 공개 참고 시스템이자 에이전트가 직접 쓰는 구현 시스템으로 만든다. (← `OBJECTIVE.md`)
- **horizon**: 템플릿 제작 시스템 경화 (← `plans/horizons/2026-07-template-production-hardening.md`)
- **milestone**: TH6 — 경화된 루프가 실사용감으로 도는지 실물로 확인하고 horizon을 닫는다.

## Scope Boundary
- **결정**: 새 기능을 만들지 않는다. TH1~TH5 산출물만 써서 실제 결과물 1건을 끝까지 만든다. 실연 중 발견한 결함은 고칠 수 있으나, 새 capability 추가는 finding 큐로 넘긴다.
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / secret_required / external_authority_required / user_stopped
- **진행 보고**: commentary only. 단 **사람 확인 게이트(step-1 말미)는 명시 정지점**이다 — 사용자가 결과물을 눈으로 보고 승인해야 step-2로 간다.
- rollback/cleanup: 실연 산출물은 `evidence/`에만 남기고 임시 파일은 정리한다.

## 스캐폴딩 결정
- source-of-truth: 실연 판정의 정본은 **사람 확인 게이트**다. 자동 검증 통과는 필요조건이지 충분조건이 아니다.
- 검증: 전 루프 1회 관측(청사진 선택→토큰→소재→편집→내보내기) + 최종 산출물 육안 확인 + 닫는 기준 7항 선언/실측 대조.
- 배포/운영: 해당 없음 — 로컬 실연.
- 결과물 형식: 스튜디오가 내보내는 HTML/SVG/JSON. 이건 **읽기용 산출물**이므로 최종 확인은 화면 스크린샷이 아니라 산출물 형식 그대로 렌더해 본다(전역 규약).
- 검토 후 제외: 인쇄 발주·PDF 변환·실물 출력 — 별도 후보. 인증·DB·배포·관측 — 걸리지 않음.

## 결정 로그
- status: resolved
- 실연 대상(무엇을 만들 것인가)은 **step-1 시작 시 사용자에게 묻는다** — 이 milestone에 내장된 사용자 소유 결정이다. 후보는 askewly 명함(세로형), 제품 포스터, 인포그래픽 중 1건.
- 이 결정 때문에 TH6은 horizon 전체 연쇄로 승인되더라도 step-1 진입 시 한 번 정지한다.

## Step 트리

- [ ] **step-1 — commission-run**
  - Artifact: 사용자가 고른 실제 의뢰 1건이 청사진 선택 → 토큰 결합 → Codex imagegen 소재 → 스튜디오 편집 → 3형식 내보내기까지 전 루프를 통과하고, 최종 산출물이 사람 확인 게이트를 받는다.
  - Files: write `evidence/template-production-hardening/th6-commission.md` + 산출물 사본; read TH1~TH5 산출물 전체.
  - Dependencies: TH5 complete
  - Verify: 전 루프 각 단계의 관측 기록 + 최종 산출물을 그 형식 그대로 렌더한 이미지 + **사용자 승인 한 줄**.
  - Failure probe: 루프 중 어느 단계가 막히면 그 지점과 원인을 기록하고, 우회하지 않고 결함으로 계수한다(무결점 서사 금지).
  - Commit: changeset `th6-commission-run`.

- [ ] **step-2 — close-audit**
  - Artifact: horizon 닫는 기준 7항이 `선언 / 실측 / 판정` 형식으로 대조되고, 크기 회고(changeset 수)·분량 회고(무감독 세션 수)·프리모템 대조가 기록된다.
  - Files: read/write `plans/horizons/2026-07-template-production-hardening.md`(Close 절 추가), `ROADMAP.md`, `docs/BACKLOG.md`.
  - Dependencies: step-1
  - Verify: 7항 전부에 실측값이 붙고, 미달 항목이 있으면 close하지 않고 보고한다.
  - Failure probe: 기준 하나라도 "실측 없음"이면 close 판정을 내리지 않는다 — 선언만으로 닫는 것이 이 horizon이 고치려던 병리다.
  - Commit: changeset `th6-horizon-close`.

## 검증/DoD
- **DoD**: 실제 의뢰 1건이 전 루프를 통과해 사람 확인 게이트를 받고, 닫는 기준 7항이 실측으로 대조되며, 크기·분량·프리모템 회고가 기록된다.
- **Evidence**: `evidence/template-production-hardening/th6-commission.md`

## finding 큐
- 실연 중 발견한 새 capability 요구는 전부 여기로.

## 진행 로그
- 2026-07-20 계획 작성, 승인 대기.
