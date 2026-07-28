# Plan - VI3 모션 오케스트레이션 티어 recipes

Date: 2026-07-17
Milestone: VI3 (`ROADMAP.md`, active — Expressive Stack 3/5, horizon-run 연쇄)
Status: approved (2026-07-17 사용자 "추천대로" — Motion(구 Framer Motion) 도입 확정)

## 위계

- Objective: `OBJECTIVE.md`
- Horizon: `docs/horizons/2026-07-expressive-stack.md` (active, 3/5)
- Milestone: VI3 — 모션 오케스트레이션 티어 recipes

## Scope

② 티어(JS 지휘 + CSS/DOM 렌더) 대표 패턴 3종을 Motion 라이브러리 기반 recipe + live 데모로: 커서 반응(magnetic hover), 스프링 물리(drag + snap-back — 중단 가능성 시연), 모션 안무(staggered entrance). 각 recipe에 시그니처 원칙 5("실험적 터치는 수동") 접점 — 어떤 것이 기본값이고 어떤 것이 opt-in인지 — 명시.

범위 밖: GSAP ScrollTrigger(지도에 ② 티어로 존재, recipe는 수요 발생 시), View Transitions API, ③④ 티어.

## 스캐폴딩 결정

- 작업 유형: tooling
- source-of-truth: `recipes/` + code_asset. 신규 의존성 `motion`(사용자 확정 2026-07-17) — import는 `motion/react`
- deploy: llms 재생성 → push → Cloudflare → 배포 curl
- 테스트 표면: validate-recipes · build(+번들 크기 전후 비교) · 브라우저 실구동 · 배포 curl

## Scope Boundary

- Execution mode: continuous
- 중단점: 새 사용자 소유 결정 / blocked·error / risk_gate. push·배포 포함 승인.
- Rollback/cleanup: changeset revert + `npm rm motion`.

## Planning gate

```yaml
planning_gate:
  team_validation_mode: manual-pass
  scope_posture: selective
  delegation_decision:
    remote_background_agents: skip
    reason: "VI2와 동일 패턴의 recipe 구현 3종 — 계약·검증 명확."
    target_roles: []
    execution_path: local_manual
  spec_skip_reason: "recipe-format 기존 계약 준수 — 신규 의존성은 결정 로그에 기록(사용자 확정)."
  perspectives:
    product: "스프링·stagger는 실무 기본값, magnetic은 opt-in — 실무/전시 경계를 recipe가 직접 가르침."
    architecture: "Motion은 사이트 데모 의존성 — recipe 본문은 라이브러리 원리(스프링 파라미터·stagger)를 계약화해 라이브러리 교체에도 생존."
    security: "없음."
    qa: "인터랙션 실구동(드래그·호버) + reduced-motion 분기 + 번들 크기 전후."
    skeptic: "magnetic hover가 기본값처럼 읽히면 시그니처 '절제' 위반 — Agent notes에 수동 opt-in 명시 필수. Motion 번들 +30~50KB — 전후 계측으로 실측."
  role_lanes:
    gate: "시그니처 판정 + 결정 표 티어 라벨 일관성 + 번들 계측 (오케스트레이터)"
  dod:
    - "3 recipe validate-recipes PASS + 브라우저 실구동(호버 끌림·드래그 스냅백·stagger 순차 등장 관측)"
    - "각 recipe에 reduced-motion 분기와 기본값/opt-in 구분 명시"
    - "번들 크기 전후 비교 기록(빌드 출력)"
    - "실패 모드: 배포 오경로 404 유지 + magnetic의 키보드 경로(focus 시 동작 동등성) 확인"
```

## Step 트리

- [ ] Step 1 — Motion 도입 + 커서·스프링 recipe 2종 (changeset)
  - Artifact: changeset
  - Files: `package.json`(motion 추가), `recipes/marketing/magnetic-hover-button.md`, `recipes/application-ui/spring-drag-snap-card.md` + code_asset 2종 + gallery 배선
  - Dependencies: 없음
  - Verify: validate-recipes PASS + build PASS(번들 전후 기록) + 브라우저: 호버 시 끌림·이탈 시 스프링 복귀, 드래그 후 스냅백 관측 + reduced-motion 분기 코드 확인
  - Failure probe: magnetic이 focus-visible 키보드 경로를 죽이지 않는지(버튼 기능 동등), 데모에 hex 리터럴 0
  - Commit: `feat(agent): VI3 step 1 — motion dep + magnetic/spring recipes`
- [ ] Step 2 — stagger 안무 recipe + 배포 (changeset)
  - Artifact: changeset
  - Files: `recipes/application-ui/staggered-entrance-group.md` + code_asset + gallery 배선, llms 재생성
  - Dependencies: Step 1
  - Verify: 브라우저에서 순차 등장 관측 → push → 배포 curl 3 recipe 200 + 오경로 404
  - Failure probe: reduced-motion에서 전 항목 즉시 가시(움직임 없음) 분기 확인
  - Commit: `feat(agent): VI3 step 2 — stagger recipe + deploy`

## 결정 로그

- [사용자 확정 2026-07-17] 모션 라이브러리 = Motion(구 Framer Motion) 도입 ("추천대로").
- [AI 기본값] 대표 3패턴 선정(magnetic/spring-drag/stagger), GSAP recipe는 수요 대기.
- 남은 사용자 소유 결정: 없음.
- status: resolved
