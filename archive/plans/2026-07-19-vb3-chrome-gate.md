# Plan - VB3 크롬 상시 표시 게이트

Date: 2026-07-19
Milestone: VB3 (`ROADMAP.md`, pending — Visual Brief 3/4)
Status: approved (2026-07-19 — 사용자 horizon 승인)

## 위계

- Objective: `OBJECTIVE.md`
- Horizon: `plans/horizons/2026-07-visual-brief.md` (active, 3/4)
- Milestone: VB3 — 크롬 상시 표시 게이트

## Scope

사람 게이트(프로토콜 5단계)를 개정: 결과물을 **사용자 기본 브라우저로 열고, 확인이 끝날 때까지 로컬 서버를 유지**한다. 스크린샷은 증거 기록용으로 존속. skill 마무리 절 재강조 + E2E 1회(실제 열림·유지 관측).

범위 밖: 스튜디오(VB2와 별개 표면), 원격 미리보기 호스팅.

## 스캐폴딩 결정

- 작업 유형: tooling
- source-of-truth: `docs/design-system/entry-protocol.md` 5단계
- deploy: llms 재생성 → push → curl
- 테스트 표면: 브라우저 실열림(Start-Process/open), 서버 생존 확인, curl

## 결정 로그

- [사용자 지시 2026-07-19] "사람이 볼 수 있게 꼭 크롬으로 띄워서 유지".
- [AI 기본값] 구현 관례: 정적 단일 파일이면 파일 직접 열기 허용, 서버 필요(모션·fetch)하면 http.server 유지 + 확인 후 종료. 세션 종료 시 정리 의무 병기.
- 그 외 예상 결정: 없음
- status: resolved

## Step 트리

- [ ] Step 1 — 프로토콜 5단계 개정 + 배포 (changeset)
  - Artifact: changeset
  - Files: `docs/design-system/entry-protocol.md` write, llms 산출물
  - Dependencies: 없음
  - Verify: push 후 curl에 "open it in the user's browser and keep it served" 계열 문구 grep
  - Failure probe: CDN 미반영 폴링
  - Commit: `feat(agent): VB3 step 1 — live browser gate in protocol`
- [ ] Step 2 — skill 재강조 + E2E (changeset)
  - Artifact: changeset
  - Files: `~/projects/custom-skills/askewly-design/SKILL.md`(마무리 절 1줄), `evidence/visual-brief/`
  - Dependencies: Step 1
  - Verify: skill 재배포 grep + 데모 결과물 1건을 브라우저로 실제 열고 서버 생존 확인 로그
  - Failure probe: 서버 조기 종료 시 페이지 깨짐을 확인(유지 의무의 근거 기록)
  - Commit: `feat(agent): VB3 step 2 — skill + live-open E2E`

## Scope Boundary

- Execution mode: continuous
- 중단점: blocked·error
- Rollback/cleanup: 프로토콜 revert + llms 재생성

## Planning gate

```yaml
planning_gate:
  team_validation_mode: not_required_lightweight
  scope_posture: selective
  delegation_decision:
    remote_background_agents: skip
    reason: "문서 2곳 + 실열림 확인 — 직접 수행"
    target_roles: []
    execution_path: local_manual
  spec_delta: "사람 게이트 판정 표면이 스크린샷→실물 브라우저로"
  perspectives:
    product: "사용자가 실물로 판정 — 게이트 취지 완성"
    architecture: "프로토콜 정본 1곳 수정"
    security: "로컬호스트만"
    qa: "실열림·생존 + 조기 종료 실패 경로"
    skeptic: "서버 방치 리스크 — 확인 후 종료·세션 정리 의무 병기"
  dod:
    - "curl 개정 문구 배포 확인"
    - "실열림 E2E 로그"
    - "실패 모드: 서버 조기 종료 확인"
```
