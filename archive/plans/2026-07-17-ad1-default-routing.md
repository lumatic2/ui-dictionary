# Plan - AD1 Default Routing 배선

Date: 2026-07-17
Milestone: AD1 (`ROADMAP.md`, active — Agent Adoption Loop horizon 활성화 첫 milestone)
Status: approved-pending (승인 대기)

## 위계

- Objective: `OBJECTIVE.md`
- Horizon: `docs/horizons/2026-07-agent-adoption-loop.md` (active, 1/4 첫 번째)
- Milestone: AD1 — Default Routing 배선

## Scope

디자인 작업이 들어왔을 때 Claude/Codex가 askewly design을 *자동으로 먼저* 조회하게 만든다. 세 changeset:

1. **진입 프로토콜 정본화** (이 레포) — "디자인 작업을 받으면 무엇을 어떤 순서로 fetch하는가"를 작업 유형별(신규 화면 / 기존 UI 개선 / 컴포넌트 단위)로 서술한 에이전트용 정본 문서. 기존 `docs/design-system/agent-asset-model.md`(자산 소비 계약)를 재사용·확장하고 llms.txt 인덱스 상단에 노출.
2. **Claude 배선** (외부 파일 — cross-repo) — 전역 `~/.claude/CLAUDE.md`에 디자인 라우팅 규칙(Context7 MCP 라우팅 규칙과 같은 형식: "UI·디자인 작업이면 ui.askewly.com/llms.txt 진입 프로토콜을 우선 조회") + custom-skills 디자인 스킬(design-harness·design-bootstrap 등)이 진입 프로토콜을 좌표로 참조하도록 갱신 + `setup.sh` 재배포.
3. **Codex 배선 + 양 에이전트 통합 E2E** (외부 파일 — cross-repo) — Codex 전역 지침(정본 위치는 실사로 판단: 전역 AGENTS.md 어댑터 또는 config 지침)에 동일 라우팅 규칙 + `~/.codex/skills` 배포 미러 확인. 통합 E2E: Claude·Codex 각각 신규 세션에서 외부 프로젝트 디자인 지시 → 지시문에 askewly design 언급 없이도 조회가 관측되고 결과물이 토큰 파생(색 리터럴 0).

범위 밖: 스타일 체크리스트(AD2), dogfooding 반복(AD3), 레시피 확장(AD4), MCP 서버, 사이트 UI 변경, hook 강제(E2E 미발화 관측 시 격상 — 결정 로그 참조).

## Scope Boundary

- Execution mode: continuous
- 중단점(hard-stop policy): Stop only on ① 통합 검증 실패 2회 반복(blocked — 원인 보고 후 정지) ② 전역 CLAUDE.md·스킬 정본 편집 중 예상 밖 충돌 발견(risk_gate) ③ 새 사용자 소유 결정 출현(decision_required).
- Rollback/cleanup: 전역 CLAUDE.md·custom-skills는 각자 git 레포 — revert 후 `setup.sh` 재배포로 원복. 이 레포 변경은 changeset 단위 revert. 임시 산출물 없음(E2E 관측 기록은 changeset README에 남긴다).

## Planning gate

```yaml
planning_gate:
  team_validation_mode: manual-pass
  scope_posture: selective
  delegation_decision:
    remote_background_agents: skip
    reason: "표면이 전역 설정 파일(~/.claude/CLAUDE.md)·스킬 정본(custom-skills)·에이전트 문서 소면적. 라우팅 문구는 판단 작업이고 오편집 비용이 커서 위임 이득이 없다. E2E 게이트는 오케스트레이터가 직접."
    target_roles: []
    execution_path: local_manual
  spec_delta: "새 horizon agent-adoption-loop 활성 + monetization park (이 커밋의 cascade 문서들)"
  perspectives:
    product: "사용자가 원하는 건 '흐름' — 규칙이 있어도 실제 세션에서 발화 안 하면 실패. 통합 검증이 곧 제품 가치."
    architecture: "정본은 이 레포(SSOT), 라우팅은 전역 규칙·스킬이 정본을 가리키는 포인터만 — 값 중복 금지(C-10 승계)."
    security: "secret 없음. 외부 fetch는 공개 URL(ui.askewly.com)뿐."
    qa: "llms.txt 링크 무결성 + 스킬 재배포 확인 + 신규 세션 E2E 관측."
    skeptic: "규칙을 넣어도 모델이 안 따를 수 있다 — 트리거 문구를 스킬 description 수준으로 구체화하고, 실패 시 hook 강제(발화 감지)로 격상하는 후속 경로를 남긴다."
  role_lanes:
    gate: "완료 전 DoD·E2E evidence 독립 대조 (오케스트레이터)"
  dod:
    - "진입 프로토콜 문서가 llms.txt에 노출되고 링크 무결성 검증 PASS"
    - "Claude 배선: 전역 CLAUDE.md 라우팅 규칙 + 디자인 스킬 참조 갱신 + setup.sh 재배포 로그"
    - "Codex 배선: 전역 지침 라우팅 규칙 + ~/.codex/skills 배포 미러 확인"
    - "E2E: Claude·Codex 각각 신규 세션·외부 프로젝트 디자인 지시에서 askewly design 자동 조회 관측 + 결과물 색 리터럴 0"
    - "실패 모드: llms.txt 진입 링크를 의도적으로 잘못된 경로로 fetch 시 loud failure 확인(조용한 fallback 없음)"
```

## Step 트리

- [ ] Step 1 — 진입 프로토콜 정본화 (changeset)
  - Artifact: changeset
  - Files: `docs/design-system/entry-protocol.md`(신규) 또는 `docs/design-system/agent-asset-model.md` 확장(실행 시 판단), `scripts/generate-llms-txt.mjs`(인덱스 상단 노출), `changesets/` 인덱스
  - Dependencies: 없음
  - Verify: `node scripts/generate-llms-txt.mjs` 재생성 + 로컬 링크 무결성 + 배포 후 `curl https://ui.askewly.com/llms.txt` 에 프로토콜 링크 확인
  - Failure probe: 프로토콜이 가리키는 자산 URL 하나를 오타로 fetch → 404 관측(조용한 성공 없음)
  - Commit: `feat(agent): AD1 step 1 — agent entry protocol`
- [ ] Step 2 — Claude 배선 (changeset)
  - Artifact: changeset (cross-repo — 전역 CLAUDE.md·custom-skills 변경, evidence는 이 레포 changeset README에 기록)
  - Files: `~/.claude/CLAUDE.md`(MCP 라우팅 절에 디자인 라우팅 규칙 추가), `~/projects/custom-skills/design-harness/SKILL.md`·`design-bootstrap/SKILL.md`(+실사 중 발견되는 디자인 스킬), `setup.sh` 재배포, 이 레포 `changesets/` README
  - Dependencies: Step 1 (프로토콜 URL이 라우팅 규칙의 목적지)
  - Verify: 재배포 로그 + 신규 Claude 세션에서 외부 프로젝트 디자인 지시 1건 E2E — askewly design 조회 관측 + 산출물 색 리터럴 0
  - Failure probe: askewly design을 언급하지 않은 순수 디자인 지시로 테스트(언급 시 통과는 무효) — 미조회면 트리거 문구 보강 후 재시도(2회 실패 시 hard-stop, hook 격상 논의)
  - Commit: `feat(agent): AD1 step 2 — claude design routing` (custom-skills 레포는 자체 커밋)
- [ ] Step 3 — Codex 배선 + 양 에이전트 통합 E2E (changeset)
  - Artifact: changeset (cross-repo — Codex 전역 지침 변경, evidence는 이 레포 changeset README에 기록)
  - Files: Codex 전역 지침(실사로 정본 위치 판단 — 전역 AGENTS.md 어댑터 또는 config 지침), `~/.codex/skills` 배포 미러 확인, 이 레포 `changesets/` README
  - Dependencies: Step 1, Step 2 (동일 프로토콜 URL·문구 준용)
  - Verify: Codex 신규 세션 디자인 지시 1건 E2E(자동 조회 관측 + 색 리터럴 0) + Claude/Codex 양쪽 관측 기록을 changeset README에 통합
  - Failure probe: Codex도 askewly design 미언급 지시로 테스트 — 미조회면 문구 보강 후 재시도(2회 실패 시 hard-stop, hook/Codex hook 격상 논의)
  - Commit: `feat(agent): AD1 step 3 — codex design routing + dual-agent e2e`

## 결정 로그

- [확정 2026-07-17] 현 horizon(monetization) park + 새 horizon 4-milestone(AD1~AD4) 구성 (AskUserQuestion).
- [확정 2026-07-17] dogfooding = 실제 프로젝트 실작업 / 스타일 = 기존 자산 역산 + 인터뷰 보강 (AskUserQuestion).
- [확정 2026-07-17] 실행 순서 = AD1 라우팅 → AD2 스타일 시그니처 → AD3 dogfooding → AD4 확장 (AskUserQuestion — 판정 기준 선행).
- [확정 2026-07-17] hook 강제는 AD1 범위 밖 — 규칙+스킬 먼저, E2E 미발화 관측 시 격상 논의 (AskUserQuestion).
- [확정 2026-07-17] AD3 확보 = 혼합 — 지정 실작업 2건(활성화 시 후보 목록에서 사용자와 확정) + 기회주의 1~3건 (AskUserQuestion).
- [사용자 요청 파생] 전역 CLAUDE.md에 디자인 라우팅 규칙 추가 — 이번 요청("askewly design에서 찾아보자는 흐름") 자체가 근거. 구체 문구는 실행 시 Context7 라우팅 규칙 형식 준용.
- [AI 기본값] 진입 프로토콜의 파일 위치·신규 vs 확장 판단, llms.txt 노출 방식.
- 남은 사용자 소유 결정: 없음 (AD2 대상 프로젝트 선정은 AD2 활성화 시 별도).
- status: resolved
