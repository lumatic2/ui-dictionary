# Plan - SE1 skill 신설 + 프로토콜 사람 게이트 개정

Date: 2026-07-18
Milestone: SE1 (`ROADMAP.md`, active — Skill Entry 1/2)
Status: approved (2026-07-18 — 사용자 AskUserQuestion 승인: 진행 + 전역 절 완전 제거)

## 위계

- Objective: `OBJECTIVE.md`
- Horizon: `plans/horizons/2026-07-skill-entry.md` (active, 1/2)
- Milestone: SE1 — skill 신설 + 사람 확인 게이트

## Scope

① `entry-protocol.md`에 사람 눈 확인 게이트를 추가해 배포하고, ② 진입 라우터인 `askewly-design` skill을 custom-skills에 신설·배포한다. skill은 얇은 라우터 — 프로토콜 내용 복제 금지.

범위 밖: 전역 규칙 제거(SE2), 프로토콜 판단 계약 재설계, 기존 design-* 스킬 개편.

## 스캐폴딩 결정

- 작업 유형: tooling
- source-of-truth: 프로토콜=`docs/design-system/entry-protocol.md`(본 레포) / skill=`~/projects/custom-skills/askewly-design/SKILL.md`
- deploy: 프로토콜=`generate-llms-txt.mjs` → push origin main → curl 검증 / skill=`setup.sh --skill askewly-design` → 양 배포처 존재 확인
- 테스트 표면: curl(ui.askewly.com), `~/.claude/skills/`·`~/.codex/skills/` 파일 존재, grep

## 결정 로그

- skill 이름 = `askewly-design` (사용자 표현 "어스큐리 디자인을 사용하는 진입점"과 일치) — resolved
- 스크린샷 규격 = 라이트/다크 최소 2장 + 핵심 상태 포함, 파일 경로를 보고에 첨부 — resolved (사용자 "눈으로 확인 꼭 필요" + 진행 승인)
- 사람 확인 게이트 = 스크린샷 제시 후 사용자 확인 전 완료 선언·배포 금지 — resolved
- 그 외 예상 결정: 없음
- status: resolved

## Step 트리

- [ ] Step 1 — entry-protocol 사람 게이트 개정 + 배포 (changeset)
  - Artifact: changeset
  - Files: `docs/design-system/entry-protocol.md` write, `scripts/generate-llms-txt.mjs` 산출물 재생성
  - Dependencies: 없음
  - Verify: generate-llms-txt 성공 + push 후 curl entry-protocol.md 에 신설 단계 grep
  - Failure probe: CDN 캐시 구버전이면 cache-bust 폴링, 미반영 시 partial 기록
  - Commit: `feat(agent): SE1 step 1 — human verification gate in entry protocol`
  - 내용: "Always" 절에 5단계 신설 — 시각 검증 증거(스크린샷 라이트/다크 ≥2장, 핵심 상태) 캡처 + 보고 첨부 의무, **사람 확인이 최종 게이트** — 확인 전 완료 선언·배포 금지. 자가 판정(4단계)=하한선, 사람 확인=최종 관계 명시.
- [ ] Step 2 — askewly-design skill 신설 + 배포 (changeset)
  - Artifact: changeset (custom-skills 커밋 + ui-dictionary 기록)
  - Files: `~/projects/custom-skills/askewly-design/SKILL.md` write, 배포본 2곳(setup.sh 산출)
  - Dependencies: Step 1 (skill이 참조할 프로토콜이 먼저 배포)
  - Verify: `bash setup.sh --skill askewly-design` 성공 + `~/.claude/skills/askewly-design/SKILL.md`·`~/.codex/skills/askewly-design/SKILL.md` 존재
  - Failure probe: 미존재 skill 이름으로 setup.sh --skill 호출 시 실패하는지 확인(조용한 성공 방지)
  - Commit: custom-skills `feat: askewly-design entry skill` + ui-dictionary changeset
  - 내용: frontmatter(name/description — 디자인·UI 작업 자동 트리거 문구, Codex 병행) + 본문은 라우터 안무만: llms.txt fetch → entry-protocol 준수(내용 복제 금지, URL 참조) → 시그니처 자가 판정 → 스크린샷 → 사람 확인 대기. fetch 실패 시 중단·보고.

## Scope Boundary

- Execution mode: continuous
- 중단점: 새 사용자 소유 결정 / blocked·error / risk_gate
- Rollback/cleanup: 프로토콜 revert + skill 디렉터리 삭제 후 setup.sh 재배포

## Planning gate

```yaml
planning_gate:
  team_validation_mode: not_required_lightweight
  scope_posture: selective
  delegation_decision:
    remote_background_agents: skip
    reason: "파일 2개 수정 + 배포 스크립트 실행 — 단일 세션 직접 수행이 검증 포함 최단"
    target_roles: []
    execution_path: local_manual
  spec_delta: "entry-protocol에 사람 확인 게이트 신설, 진입 경로가 전역 규칙→skill로 이전 시작"
  perspectives:
    product: "사용자가 결과물을 눈으로 확인하는 게이트 — 품질 최종 판정권을 사람에게"
    architecture: "정본 1(프로토콜) + 얇은 라우터(skill) — 복제·드리프트 없음"
    security: "secret 없음"
    qa: "curl grep + 배포처 파일 존재 + setup.sh 실패 경로"
    skeptic: "skill 자동 트리거가 안 될 수 있음 — SE2 E2E가 검증, 실패 시 description 조정"
  dod:
    - "curl entry-protocol.md에 사람 게이트 단계 존재"
    - "양 배포처에 askewly-design/SKILL.md 존재"
    - "실패 경로 1개 확인 (setup.sh 미존재 skill 또는 CDN 미반영 처리)"
```
