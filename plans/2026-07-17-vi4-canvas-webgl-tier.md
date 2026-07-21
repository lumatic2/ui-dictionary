# Plan - VI4 Canvas·WebGL·three.js 티어

Date: 2026-07-17
Milestone: VI4 (`ROADMAP.md`, active — Expressive Stack 4/5, horizon-run 연쇄)
Status: approved (2026-07-17 horizon 승인 연쇄 — three.js 정식 도입 + lazy-load 격리 조건 사용자 GO)

## 위계

- Objective: `OBJECTIVE.md`
- Horizon: `plans/horizons/2026-07-expressive-stack.md` (active, 4/5)
- Milestone: VI4 — Canvas·WebGL·three.js 티어

## Scope

③ 티어(Canvas 2D) 대표 recipe 1종(파티클 필드 — reduced-motion 게이팅 내장)과 ④ 티어(three.js/R3F) recipe 1종(토큰 파생 3D 오브젝트 씬)을 live 데모로 구현한다. three.js/R3F는 **dynamic import lazy-load로 격리** — 메인 청크 크기 비악화가 DoD(사용자 GO 조건). 물리(matter-js)·셰이더(Paper Shaders)는 쇼케이스에 기구현 — 계보 지도가 이미 참조하므로 이번 범위에서 recipe 신설하지 않음(수요 대기).

## 스캐폴딩 결정

- 작업 유형: tooling
- source-of-truth: `recipes/` + code_asset. 신규 의존성 `three` + `@react-three/fiber`(사용자 GO)
- deploy: llms 재생성 → push → Cloudflare → 배포 curl
- 테스트 표면: validate-recipes · build(메인 청크 전후 계측 + 분리 청크 확인) · 브라우저 실구동(lazy 로드·회전·reduced-motion) · 배포 curl

## Scope Boundary

- Execution mode: continuous
- 중단점: 새 사용자 소유 결정 / blocked·error / risk_gate. push·배포 포함 승인.
- Rollback/cleanup: changeset revert + `npm rm three @react-three/fiber`.

## Planning gate

```yaml
planning_gate:
  team_validation_mode: manual-pass
  scope_posture: selective
  delegation_decision:
    remote_background_agents: skip
    reason: "recipe 2종 + lazy-load 배선 — 단일 레포, 검증 커맨드 명확."
    target_roles: []
    execution_path: local_manual
  spec_skip_reason: "recipe-format 계약 준수 — three.js 도입은 horizon doc·결정 로그에 기록된 사용자 GO."
  perspectives:
    product: "③④ 티어 커버로 4티어 전부에 live recipe — Close Criteria의 마지막 티어 조각."
    architecture: "R3F 씬은 lazy 경계 뒤 — 메인 번들과 격리. 캔버스는 컴포넌트 소유 rAF 루프 + cleanup."
    security: "없음."
    qa: "lazy 청크 분리 실측 + reduced-motion 분기 + 인터랙션 실구동."
    skeptic: "three.js gzip ~155KB — lazy 격리 실패 시 메인 청크 폭증. 빌드 출력에서 메인 청크 크기·분리 청크 존재를 둘 다 확인해야 함. WebGL 미지원 환경 폴백(정적 대체) recipe 명시."
  role_lanes:
    gate: "번들 계측 대조 + reduced-motion 분기 검수 + 시그니처 판정 (오케스트레이터)"
  dod:
    - "canvas 파티클 recipe: rAF 루프 cleanup + reduced-motion 정지 분기 — 브라우저 실구동"
    - "three.js recipe: lazy 청크 분리 실측(메인 청크 비악화) + Suspense 로딩 상태 + reduced-motion 시 자동회전 정지"
    - "validate-recipes·build·llms 재생성·배포 curl 200 + 오경로 404"
    - "실패 모드: WebGL 컨텍스트 실패 시 정적 폴백 노출 명시"
```

## Step 트리

- [ ] Step 1 — Canvas 2D 파티클 필드 recipe (changeset)
  - Artifact: changeset
  - Files: `recipes/application-ui/canvas-particle-field.md` + code_asset + gallery 배선
  - Dependencies: 없음 (의존성 0 — 순수 Canvas API)
  - Verify: 브라우저에서 파티클 구동 + reduced-motion 시 정지 프레임 분기 코드 + 언마운트 cleanup(rAF cancel)
  - Failure probe: 캔버스가 pointer 이벤트를 가로채지 않는지, hex 리터럴 0(토큰 CSS 변수 판독)
  - Commit: `feat(agent): VI4 step 1 — canvas particle field recipe`
- [ ] Step 2 — three.js/R3F lazy 도입 + 3D 씬 recipe + 배포 (changeset)
  - Artifact: changeset
  - Files: `package.json`(three·@react-three/fiber), `recipes/application-ui/lazy-three-object-scene.md` + code_asset(lazy 경계 포함) + gallery 배선, llms 재생성
  - Dependencies: Step 1
  - Verify: 빌드 출력 — 메인 청크 크기 전후(753KB gzip 기준) + three 분리 청크 존재, 브라우저 — Suspense 로딩→씬 렌더·자동 회전, reduced-motion 분기 → push → 배포 curl
  - Failure probe: lazy import 제거 시(정적 import) 메인 청크 폭증을 확인하는 대신, 분리 청크 파일명에 three가 있는지와 메인 청크 델타 ≤5KB로 갈음
  - Commit: `feat(agent): VI4 step 2 — lazy three.js scene recipe + deploy`

## 결정 로그

- [사용자 확정 2026-07-17] three.js/R3F 정식 도입, lazy-load 격리 조건 GO.
- [AI 기본값] drei 미도입(경량 유지 — 카메라 컨트롤 수동 구현), 물리·셰이더 recipe는 기구현 쇼케이스 참조로 갈음(수요 대기).
- 남은 사용자 소유 결정: 없음.
- status: resolved
