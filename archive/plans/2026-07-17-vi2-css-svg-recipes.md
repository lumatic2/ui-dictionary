# Plan - VI2 CSS·SVG 티어 recipes

Date: 2026-07-17
Milestone: VI2 (`ROADMAP.md`, active — Expressive Stack 2/5, horizon-run 연쇄 승격)
Status: approved (2026-07-17 horizon 승인 연쇄 — 사용자 "응 좋아 진행", 선정 기준 "제품 적용 가능성 우선"은 사용자 승인된 추천)

## 위계

- Objective: `OBJECTIVE.md`
- Horizon: `docs/horizons/2026-07-expressive-stack.md` (active, 2/5)
- Milestone: VI2 — CSS·SVG 티어 recipes

## Scope

VI1 지도의 선언 티어(①) 기법 중 **실무용 판정** 4종을 recipe + Gallery live 데모로 구현: mesh gradient surface, glass panel(backdrop-filter), grain texture overlay(SVG feTurbulence), scroll-driven reveal(CSS animation-timeline). 전시용 기법(1-div art, 텍스트 왜곡)은 범위 밖 — 지도에만 존재.

범위 밖: ②~④ 티어(VI3·VI4), 신규 라이브러리 의존성(선언 티어는 0 의존성이 정체성).

## 스캐폴딩 결정

- 작업 유형: tooling (recipe 자산 + 사이트 데모)
- source-of-truth: `recipes/` + code_asset(`examples/ui-vocabulary-site/src/components/`)
- deploy: llms 재생성 → push → Cloudflare → 배포 curl
- 테스트 표면: validate-recipes.py · site build · 브라우저 live-render(라이트/다크) · 배포 curl

## Scope Boundary

- Execution mode: continuous
- 중단점: 새 사용자 소유 결정 / blocked·error / risk_gate. push·배포는 승인에 포함.
- Rollback/cleanup: changeset 단위 revert.

## Planning gate

```yaml
planning_gate:
  team_validation_mode: manual-pass
  scope_posture: selective
  delegation_decision:
    remote_background_agents: skip
    reason: "단일 레포 recipe 구현 4종 — 계약·검증 커맨드 명확, AD4 chat recipe와 동일 패턴. 왕복 비용 > 위임 이득."
    target_roles: []
    execution_path: local_manual
  spec_skip_reason: "recipe-format.md 기존 계약 준수 자산 추가 — spec 변경 없음. kind=visual-effect/visual-treatment/motion-pattern 어휘는 계약에 이미 존재."
  perspectives:
    product: "실무용 판정 기법만 — 히어로 배경·글래스 표면·그레인·스크롤 리빌은 실제 제품 표면 빈도 최상위."
    architecture: "선언 티어 recipe는 의존성 0 — CSS/SVG만. code_asset은 기존 데모 idiom 준수."
    security: "없음 — 시각 자산만."
    qa: "recipe당 라이트/다크 브라우저 실구동 + 시그니처 자가 판정 + 검증 체인."
    skeptic: "scroll-driven animations는 Safari/Firefox 단계 지원 — recipe Checks에 progressive enhancement(미지원 시 정적 표시) 명시 필요. 실험적 시각이 시그니처 '절제' 원칙과 충돌하지 않게 Agent notes에 사용 조건 명시."
  role_lanes:
    gate: "시그니처 판정 + 결정 표와 recipe 티어 라벨 일관성 대조 (오케스트레이터)"
  dod:
    - "4 recipe validate-recipes PASS + Gallery live-render 브라우저 확인(라이트/다크)"
    - "각 recipe에 티어 판정 근거(왜 ① 티어인가)와 사용 조건(시그니처 원칙 5 접점) 명시"
    - "실패 모드: scroll-driven 미지원 브라우저 폴백(정적 상태) 동작 명시 + 배포 오경로 404 유지"
    - "llms.txt 재생성·배포 curl 200"
```

## Step 트리

- [ ] Step 1 — 정적 표면 질감 recipe 3종 (changeset)
  - Artifact: changeset
  - Files: `recipes/marketing/mesh-gradient-surface.md`, `recipes/overlays/glass-panel.md`, `recipes/marketing/grain-texture-overlay.md` + code_asset 3종(`src/components/`) + gallery 배선 2파일
  - Dependencies: VI1 결정 표(티어 근거 인용)
  - Verify: validate-recipes PASS + build PASS + 브라우저 live-render 3종(라이트/다크) + 시그니처 자가 판정
  - Failure probe: hex 리터럴 0(토큰/currentColor 파생), 다크 모드에서 그레인·글래스 대비 유지 확인
  - Commit: `feat(agent): VI2 step 1 — declarative surface recipes (mesh/glass/grain)`
- [ ] Step 2 — scroll-driven reveal recipe + 배포 (changeset)
  - Artifact: changeset
  - Files: `recipes/marketing/scroll-driven-reveal.md` + code_asset + gallery 배선, llms 재생성
  - Dependencies: Step 1 (llms 1회 재생성에 합류)
  - Verify: validate-recipes PASS + 브라우저에서 스크롤 시 리빌 관측 + `animation-timeline` 미지원 폴백(콘텐츠 항상 가시) 명시 → push → 배포 curl 4 recipe 200 + 오경로 404
  - Failure probe: 미지원 브라우저 시뮬(속성 제거)에서 콘텐츠가 숨겨지지 않는지 확인 — reveal 실패가 콘텐츠 소실이 되면 안 됨
  - Commit: `feat(agent): VI2 step 2 — scroll-driven reveal + deploy`

## 결정 로그

- [사용자 승인 연쇄 2026-07-17] 선정 기준 = 제품 적용 가능성(실무용) 우선 — 전시용 기법은 지도에만.
- [AI 기본값] 4종 선정(mesh/glass/grain/scroll-reveal), pattern_group 배치(marketing x3·overlays x1), kind=visual-effect/visual-treatment/motion-pattern.
- 남은 사용자 소유 결정: 없음.
- status: resolved
