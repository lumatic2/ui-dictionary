# Plan - SE2 전역 규칙 제거 + E2E 검증

Date: 2026-07-18
Milestone: SE2 (`ROADMAP.md`, pending — Skill Entry 2/2, horizon-run 연쇄)
Status: approved (2026-07-18 — 사용자 AskUserQuestion 승인: "완전 제거")

## 위계

- Objective: `OBJECTIVE.md`
- Horizon: `plans/horizons/2026-07-skill-entry.md` (active, 2/2)
- Milestone: SE2 — 전역 규칙 제거 + E2E

## Scope

① `~/.claude/CLAUDE.md`·`~/.codex/AGENTS.md`의 "디자인 판정 (Askewly Style Signature)" 절을 완전 제거하고, ② skill 경유 진입이 실제로 발화하는지 E2E로 관측한다.

범위 밖: 전역 파일의 다른 절 수정, skill 본문 재설계(발화 실패 시 description 조정만 허용).

## 스캐폴딩 결정

- 작업 유형: tooling
- source-of-truth: 전역 파일 2개(직접 편집 — 배포 스크립트 없음) / E2E 증거=`evidence/` png·로그
- deploy: 해당 없음 — 전역 파일은 로컬 즉시 반영
- 테스트 표면: grep 0건, headless 세션 E2E 관측

## 결정 로그

- 제거 범위 = "디자인 판정" 절 전체(양 파일) — resolved (사용자 "완전 제거")
- Codex E2E에서 Windows sandbox HTTPS 차단(기지 환경 결함)으로 fetch 실패 시: skill 로드·발화 관측까지로 partial 허용, 결함 재확인만 기록 — resolved (기존 ROADMAP 유지보수 후보)
- 그 외 예상 결정: 없음
- status: resolved

## Step 트리

- [ ] Step 1 — 전역 "디자인 판정" 절 제거 (changeset)
  - Artifact: changeset (기록 — 전역 파일 자체는 git 밖, 원문은 changeset README 보존)
  - Files: `~/.claude/CLAUDE.md` write, `~/.codex/AGENTS.md` write
  - Dependencies: SE1 완료 (skill 경로가 먼저 존재)
  - Verify: 양 파일 grep "디자인 판정" 0건 + 인접 절(로컬 도구 등) 무손상 diff 확인
  - Failure probe: ui-dictionary 레포 내 CLAUDE.md 시그니처 참조는 유지되는지 확인(본 레포 작업 무영향)
  - Commit: ui-dictionary changeset `feat(agent): SE2 step 1 — global design-routing section removed`
- [ ] Step 2 — E2E: skill 경유 진입 관측 (changeset)
  - Artifact: changeset (E2E evidence)
  - Files: `evidence/` write(로그·스크린샷), scratchpad 임시 프로젝트
  - Dependencies: Step 1
  - Verify: Claude headless E2E 로그에 skill 발화 + 프로토콜 fetch 흔적 + 산출 스크린샷 존재
  - Failure probe: skill 미발화 시 FAIL 기록 → description 조정 → 재시도 1회, 그래도 실패면 blocked 보고(전역 절 복원 여부는 사용자 결정)
  - Commit: ui-dictionary changeset `feat(agent): SE2 step 2 — skill entry E2E evidence`
  - 내용: 토큰 없는 스크래치 프로젝트에서 headless `claude -p` 소형 디자인 작업(askewly 언급 없이) → skill 발화·llms.txt fetch·스크린샷·사람 확인 대기 문구 관측. Codex `codex exec` 동일(HTTPS 차단 시 partial — 결정 로그).

## Scope Boundary

- Execution mode: continuous
- 중단점: E2E 재시도 1회 후에도 skill 미발화(사용자 결정 필요) / blocked·error
- Rollback/cleanup: 전역 절 원문은 changeset README에 보존 — 복원 시 붙여넣기

## Planning gate

```yaml
planning_gate:
  team_validation_mode: not_required_lightweight
  scope_posture: reduction
  delegation_decision:
    remote_background_agents: skip
    reason: "전역 파일 2개 절 삭제 + headless E2E 1~2회 — 직접 수행이 관측 포함 최단"
    target_roles: []
    execution_path: local_manual
  spec_delta: "전역 디자인 라우팅 제거 — 진입은 askewly-design skill 단일 경로"
  perspectives:
    product: "비디자인 세션 noise 0"
    architecture: "라우팅 단일화 — 규칙+skill 이중 경로 제거"
    security: "secret 없음"
    qa: "grep 0 + E2E 발화 관측 + 미발화 실패 경로"
    skeptic: "skill 자동 트리거 불발 리스크 — 재시도 1회 후 사용자 에스컬레이션 내장"
  dod:
    - "양 전역 파일 grep '디자인 판정' 0건"
    - "Claude headless E2E에서 skill 발화 + 스크린샷 산출 관측"
    - "실패 모드 확인: 미발화 시 FAIL 기록·조정 절차 실행 (또는 Codex HTTPS 차단 partial 기록)"
```
