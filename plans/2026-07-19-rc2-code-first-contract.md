# Plan - RC2 코드 출발 계약 + 에이전트 E2E

Date: 2026-07-19
Milestone: RC2 (`ROADMAP.md`, pending — Recipe Code Reuse 2/4)
Status: proposed

## 위계

- Objective: `OBJECTIVE.md`
- Horizon: `plans/horizons/2026-07-recipe-code-reuse.md` (2/4)

## Scope

① 에이전트 계약 문서(entry-protocol·agent-asset-model·component-restyle·recipe md)에 **"코드에서 출발" 경로**를 명문한다: 레시피 구현 시 registry JSON fetch → 코드 이식 → **프로젝트 토큰 리맵 의무**(cssVars→semantic 토큰, shadcn 기본 표정 탈출) → 레시피 Checks 검증 ② headless 에이전트 E2E 1회로 fetch→적용→리맵을 관측한다.

## 스캐폴딩 결정

- source-of-truth: `docs/design-system/entry-protocol.md`·`agent-asset-model.md`·`component-restyle.md` + 레시피 md 코드 자산 링크
- 검증: headless claude 세션 E2E(신규 화면 의뢰 → 코드 출발 경로 발화 관측) + 산출물 토큰 리맵 grep(하드코딩 shadcn 기본색 0) + curl 배포
- 배포/운영: llms (push 후 자동)
- 검토 후 제외: 서버·데이터(문서 계약 — 해당 없음)

## 결정 로그

- [AI 기본값] 코드 출발은 **해당 레시피가 코드 자산을 가진 경우의 기본 경로**, 문서-재구현은 자산 없는 레시피의 폴백 — 강제 아닌 우선순위.
- [AI 기본값] 리스타일 의무: 이식 직후 cssVars·하드코딩 색을 프로젝트 DESIGN.md 토큰으로 리맵 — 생략 시 style-signature 판정 실패로 취급 (프리모템 2 예방장치).
- 그 외 예상 결정: 없음
- status: resolved

## Step 트리

- [ ] Step 1 — 계약 명문 + 배포 (changeset)
  - Artifact: changeset
  - Files: `docs/design-system/entry-protocol.md`, `agent-asset-model.md`, `component-restyle.md`, `scripts/generate-llms-txt.mjs`(레시피 md에 코드 자산 링크 자동 주입)
  - Dependencies: RC1
  - Verify: llms 재생성 + 코드 출발 절 grep + 자산 보유 레시피 md 전수에 코드 링크 존재
  - Failure probe: 자산 없는 레시피 md에는 링크가 주입되지 않음(잘못된 링크 0)
  - Commit: `feat(agent): RC2 step 1 — code-first contract + deploy`
- [ ] Step 2 — 에이전트 E2E (changeset)
  - Artifact: changeset (evidence)
  - Files: `evidence/recipe-code-reuse/rc2-agent-e2e.md`(+스크린샷)
  - Dependencies: Step 1
  - Verify: headless 세션에 신규 화면 의뢰(자산 보유 레시피 해당) → registry fetch·이식·토큰 리맵 관측, 산출 화면 스크린샷 + 기본 표정 탈출 확인(리맵 전후 색 대조)
  - Failure probe: 리맵 생략 산출이 나오면 계약 문구 교정 → 재실행 (SE2 전례: 1차 FAIL 허용·기록)
  - Commit: `feat(agent): RC2 step 2 — headless code-first E2E`

## Scope Boundary

- Execution mode: continuous
- 중단점: blocked·error
- Rollback/cleanup: revert

## Planning gate

```yaml
planning_gate:
  team_validation_mode: not_required_lightweight
  scope_posture: selective
  delegation_decision:
    remote_background_agents: skip
    reason: "계약 문서 + headless E2E — 직접 수행·관측"
    target_roles: []
    execution_path: local_manual
  spec_delta: "에이전트 소비 계약에 코드 출발 경로(fetch→이식→리맵→Checks) 추가"
  perspectives:
    product: "재구현 분산 제거 — 검증된 코드 + 프로젝트 고유 룩"
    architecture: "기존 계약(restyle·asset-model)에 얹음 — 새 문서 발명 없음"
    security: "-"
    qa: "headless 관측 + 리맵 grep 실패 경로"
    skeptic: "에이전트가 코드를 그대로 붙여 shadcn 표정 고착 (프리모템 2 — 리맵 의무 게이트)"
  dod:
    - "계약 배포 curl + 레시피 링크 전수"
    - "headless E2E 1회 — fetch·이식·리맵 관측 (실패 시 교정·재실행 기록)"
```
