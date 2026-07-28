# Plan - TC3 표현 배치: Dribbble 조건부

Date: 2026-07-17
Milestone: TC3 (`ROADMAP.md`, active — Taste Corpus 3/4, horizon-run 연쇄)
Status: approved (2026-07-17 사용자 "ㄱㄱ" 연쇄 — Dribbble 조건부(성립성 게이트) 구성은 horizon 승인에 포함)

## 위계

- Objective: `OBJECTIVE.md`
- Horizon: `plans/horizons/2026-07-taste-corpus.md` (active, 3/4)
- Milestone: TC3 — 표현 배치: Dribbble 조건부

## Scope

Dribbble 인기 샷을 관찰하되 **모든 관찰에 성립성 게이트 4문항(실데이터·상태·한글·다크/접근성)을 적용**한다. 통과 원리 흡수 1건 이상 + 탈락 사례의 anti-pattern 역이용 1건 이상. 콘셉트 목업의 "화면빨 좋은 미완성"이 판단에 오염되지 않게 하는 것이 이 milestone의 존재 이유.

범위 밖: 샷 자산 복제·다운로드(관찰·원리만), 대량 수집(좁고 깊게 2~4건).

## 스캐폴딩 결정

- 작업 유형: tooling (taste ledger + 판단 자산 갱신)
- source-of-truth: `research/taste/ledger.md` + 갱신 자산
- deploy: llms 재생성 → push → curl
- 테스트 표면: 게이트 4문항 판정 기록, 갱신 grep, 배포 curl

## Scope Boundary

- Execution mode: continuous
- 중단점: 새 사용자 소유 결정 / blocked·error / risk_gate.
- Rollback/cleanup: changeset revert.

## Planning gate

```yaml
planning_gate:
  team_validation_mode: not_required_lightweight
  scope_posture: selective
  delegation_decision:
    remote_background_agents: skip
    reason: "관찰 2~4건 소배치 — 게이트 판정은 오케스트레이터 소관."
    target_roles: []
    execution_path: local_manual
  spec_skip_reason: "taste-loop 계약 실행 배치."
  perspectives:
    product: "표현 상한 공급 — 단 게이트 없이는 오염원."
    architecture: "기존 자산 형식만 갱신."
    security: "공개 갤러리 관찰 — 자산 복제 없음."
    qa: "게이트 4문항 전 건 기록 + 배포 curl."
    skeptic: "게이트가 형식적 통과가 되면 무의미 — FAIL 1건 이상을 DoD로 강제해 게이트 실작동 증명."
  role_lanes:
    gate: "게이트 판정의 근거 구체성 검수 (오케스트레이터)"
  dod:
    - "게이트 통과 흡수 ≥1 + 게이트 FAIL의 anti-pattern 역이용 ≥1 — 둘 다 ledger 기록"
    - "갱신 자산 배포 curl + 오경로 404"
    - "실패 모드: 게이트 판정에 4문항별 근거 한 줄씩(뭉뚱그린 PASS 금지)"
```

## Step 트리

- [ ] Step 1 — Dribbble 관찰 + 게이트 판정 (changeset)
  - Artifact: changeset
  - Files: `research/taste/ledger.md` append(T-13~), 스크린샷 evidence
  - Dependencies: 없음
  - Verify: 건별 게이트 4문항 근거 + 7필드 완비
  - Failure probe: 전 건 PASS면 게이트 형식화 의심 — FAIL ≥1 확인
  - Commit: `feat(agent): TC3 step 1 — dribbble observations + feasibility gates`
- [ ] Step 2 — 자산 반영 + 배포 (changeset)
  - Artifact: changeset
  - Files: 갱신 자산(anti-patterns/recipe/knowledge 중 해당), llms 재생성
  - Dependencies: Step 1
  - Verify: 갱신 grep → push → 배포 curl + 오경로 404
  - Failure probe: 갱신 문구 look 복사 0
  - Commit: `feat(agent): TC3 step 2 — asset updates + deploy`

## 결정 로그

- [사용자 확정 2026-07-17] Dribbble 조건부 포함(성립성 게이트) — horizon 승인.
- [AI 기본값] 배치 규모 2~4건(좁고 깊게), 대상 샷은 인기 피드에서 제품 UI 계열 선별.
- 남은 사용자 소유 결정: 없음.
- status: resolved
