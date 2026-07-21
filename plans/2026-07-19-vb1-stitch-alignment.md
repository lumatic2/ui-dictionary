# Plan - VB1 Stitch 양식 리서치·정합

Date: 2026-07-19
Milestone: VB1 (`ROADMAP.md`, active — Visual Brief 1/4)
Status: approved (2026-07-19 — 사용자 horizon 승인, 리서치 beat 포함 명시)

## 위계

- Objective: `OBJECTIVE.md`
- Horizon: `plans/horizons/2026-07-visual-brief.md` (active, 1/4)
- Milestone: VB1 — Stitch 양식 정합

## Scope

Google Labs Stitch의 DESIGN.md 공식 양식(스펙·예시·GitHub)을 리서치로 수집하고, 우리 `templates/DESIGN.md.tmpl`·design-brief.md 저장 계약을 대조·정합한다. 의도적 차이는 사유를 기록한다(전량 수용 금지 — TC4 diff 원칙).

범위 밖: 스튜디오(VB2), 프로토콜 게이트(VB3).

## 스캐폴딩 결정

- 작업 유형: learning + tooling
- source-of-truth: `research/2026-07-19-vb1-stitch-design-md.md` (동결 기록) + `templates/DESIGN.md.tmpl`(정합 반영)
- deploy: 템플릿·계약 변경 시 llms 재생성 → push → curl
- 테스트 표면: 전 인용 출처 URL+접근일, diff 표(채택/기각/유지 사유)

## 결정 로그

- [사용자 지시 2026-07-19] "구글 측 규칙 웹검색 또는 GitHub에서 찾기" — 리서치 위임(sonnet 백그라운드) 승인 범위.
- [AI 기본값] 전량 수용 금지 — 우리 계약(결정/추정 구분 등)과 충돌 시 기각 사유 기록.
- 그 외 예상 결정: 없음
- status: resolved

## Step 트리

- [ ] Step 1 — Stitch DESIGN.md 스펙 리서치 (artifact: analysis)
  - Artifact: analysis (research doc)
  - Files: `research/2026-07-19-vb1-stitch-design-md.md` write
  - Dependencies: 없음
  - Verify: 공식 출처(Google/Stitch GitHub·문서) URL+접근일 전 항목, 양식 구조(섹션·frontmatter 규칙) 수집
  - Failure probe: 공식 출처를 못 찾으면 추정 작성 금지 — 발견 실패를 그대로 기록하고 커뮤니티 관례로 라벨 구분
  - Commit: `feat(agent): VB1 step 1 — stitch design-md research`
- [ ] Step 2 — 템플릿·계약 diff 정합 + 배포 (changeset)
  - Artifact: changeset
  - Files: `templates/DESIGN.md.tmpl`, `docs/design-system/design-brief.md`(§3 저장 계약), `methodology/design-md-guide.md`(필요분), llms 산출물
  - Dependencies: Step 1
  - Verify: diff 표(채택≥1 또는 "완전 일치" 근거) + 변경 시 push·curl 반영
  - Failure probe: 우리 계약과 충돌 항목을 무사유 수용하면 FAIL — 기각 사유 기록 확인
  - Commit: `feat(agent): VB1 step 2 — template alignment + deploy`

## Scope Boundary

- Execution mode: continuous
- 중단점: 새 사용자 소유 결정 / blocked·error
- Rollback/cleanup: changeset revert

## Planning gate

```yaml
planning_gate:
  team_validation_mode: not_required_lightweight
  scope_posture: selective
  delegation_decision:
    remote_background_agents: use
    reason: "공식 스펙 수집은 병렬 웹/GitHub 조사 노동 — 위임 기본, 사용자 지시로 승인됨"
    target_roles: ["explorer"]
    execution_path: claude_subagent
  spec_delta: "DESIGN.md 템플릿이 Stitch 공식 양식과 대조·정합됨(차이 사유 기록)"
  perspectives:
    product: "표준 준수 — 다른 Stitch 소비 도구와 호환 가능성"
    architecture: "템플릿 1곳 정본 유지"
    security: "secret 없음"
    qa: "출처 규율 + diff 표 + 무출처 실패 경로"
    skeptic: "공식 스펙이 빈약할 수 있음 — 커뮤니티 관례와 라벨 구분"
  dod:
    - "research doc 전 인용 출처 URL+접근일"
    - "diff 표: 채택/기각/유지 각 사유"
    - "실패 모드: 공식 출처 부재 시 추정 금지 절차 확인"
```
