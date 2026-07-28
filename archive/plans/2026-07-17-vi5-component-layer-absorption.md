# Plan - VI5 부품 층 계약 + 레퍼런스 흡수

Date: 2026-07-17
Milestone: VI5 (`ROADMAP.md`, active — Expressive Stack 5/5, horizon-run 연쇄)
Status: approved (2026-07-17 horizon 승인 연쇄 — 사용자 "응 좋아 진행" 구성에 포함)

## 위계

- Objective: `OBJECTIVE.md`
- Horizon: `plans/horizons/2026-07-expressive-stack.md` (active, 5/5 — 마지막)
- Milestone: VI5 — 부품 층 계약 + 레퍼런스 흡수

## Scope

① shadcn류 부품 층을 프로젝트 토큰으로 재스타일하는 가이드("shadcn 룩 탈출") — 에이전트 소비용, llms 배포. ② 외부 표현 라이브러리(react-bits·magicui·GSAP·cult-ui 등) 흡수 기준 — 무엇을 recipe로 정본화하고 무엇을 링크 참조로만 두는지의 결정 규칙. toolshelf used 기록.

범위 밖: shadcn 컴포넌트 자체의 신규 데모(기존 code_asset이 이미 shadcn 관용구 사용 — 그 사실 자체가 증거), 외부 라이브러리 코드 벤더링.

## 스캐폴딩 결정

- 작업 유형: tooling (agent-facing 가이드 문서 2종)
- source-of-truth: `docs/design-system/component-restyle.md`(신규)·`docs/design-system/absorption-criteria.md`(신규)
- deploy: generate-llms-txt.mjs 목록 추가 → push → 배포 curl
- 테스트 표면: llms 재생성·링크 무결성·배포 curl·toolshelf used 기록

## Scope Boundary

- Execution mode: continuous
- 중단점: 새 사용자 소유 결정 / blocked·error / risk_gate. push·배포 포함 승인.
- Rollback/cleanup: changeset revert.

## Planning gate

```yaml
planning_gate:
  team_validation_mode: manual-pass
  scope_posture: selective
  delegation_decision:
    remote_background_agents: skip
    reason: "문서 자산 2종 — 재료(리서치·자체 코드 관행)는 이미 확보됨."
    target_roles: []
    execution_path: local_manual
  spec_skip_reason: "기존 design-system 문서군에 가이드 추가 — 계약 변경 없음."
  perspectives:
    product: "'shadcn 룩' 동질화 탈출이 Objective의 반-AI-티 포지셔닝과 직결."
    architecture: "가이드는 원리(토큰 재매핑 절차) 중심 — shadcn 버전 종속 서술 최소화."
    security: "없음."
    qa: "재스타일 가이드의 절차를 자체 사이트 실코드(기존 shadcn 관용구)와 대조."
    skeptic: "가이드가 askewly 스타일 주입으로 회귀하면 DF-3 재발 — '프로젝트 토큰으로' 재스타일임을 반복 명시."
  role_lanes:
    gate: "DF-3 교훈(판단 주입≠스타일 주입) 위반 여부 검수 (오케스트레이터)"
  dod:
    - "재스타일 가이드: 토큰 재매핑 절차 + '탈출' 체크리스트가 llms 노출·배포 curl 200"
    - "흡수 기준: recipe화 vs 링크 결정 규칙 + 실측 후보(toolshelf 카드) 분류 예시"
    - "toolshelf used 기록(참조 소비한 카드) — 실패 모드: 오경로 404 유지"
```

## Step 트리

- [ ] Step 1 — shadcn 재스타일 가이드 (changeset)
  - Artifact: changeset
  - Files: `docs/design-system/component-restyle.md`(신규), `scripts/generate-llms-txt.mjs`(목록 추가)
  - Dependencies: 없음
  - Verify: llms 재생성 + 자체 사이트 shadcn 관용구 실코드와 절차 대조(grep) + DF-3 위반 검수("프로젝트 토큰" 명시 grep)
  - Failure probe: askewly 팔레트 값이 가이드에 등장하지 않는지 grep(스타일 주입 회귀 방지)
  - Commit: `feat(agent): VI5 step 1 — component restyle guide`
- [ ] Step 2 — 흡수 기준 + toolshelf 기록 + 배포 (changeset)
  - Artifact: changeset
  - Files: `docs/design-system/absorption-criteria.md`(신규), llms 재생성, toolshelf used 기록(레포 밖 부수 기록)
  - Dependencies: Step 1
  - Verify: 후보 카드 분류 예시 포함 → push → 배포 curl 2 문서 200 + 오경로 404 + `shelf.py used` 실행 기록
  - Failure probe: 분류 규칙이 3분기(recipe화/링크/보류) 전부에 실례를 갖는지
  - Commit: `feat(agent): VI5 step 2 — absorption criteria + deploy`

## 결정 로그

- [사용자 승인 연쇄 2026-07-17] VI5 구성(기존 VI3+VI4 후보의 병합) 포함 승인.
- [AI 기본값] 가이드 2종은 recipe가 아닌 design-system 문서(패턴이 아니라 절차·판정 규칙이므로).
- 남은 사용자 소유 결정: 없음.
- status: resolved
