# Plan - FW 피드 배선

Date: 2026-07-12
Milestone: FW (`ROADMAP.md`, active)
Status: approved (2026-07-12 — MS 완료 boundary에서 사용자와 다음 milestone(FW)·공급 범위(전 recipe 23종)를 AskUserQuestion으로 확정 후 연쇄)

## 위계

- Objective: `docs/OBJECTIVE.md`
- Horizon: `docs/horizons/2026-07-living-design-system.md` (active)
- Milestone: FW — Feed Wiring (루프 산출이 캔버스 레지스트리·CLI·llms.txt에 코드 변경 없이 공급)

## Scope

llms.txt(glob 자동 발견)와 CLI(`build:data`)는 이미 루프 산출을 자동 소비한다. 남은 갭은 캔버스 `packages/component-registry`가 수작업 `shadcnCatalog`(shadcn 10 + layout 6)뿐이라 recipe 23종이 Insert 팔레트에 닿지 않는 것. FW는:

1. 구식 recipe들의 `code_asset`(App.tsx 내장 심볼)을 독립 컴포넌트 파일로 마이그레이션해 전 23종을 추출 가능하게 만들고,
2. recipes frontmatter → registry 카탈로그를 생성하는 build-time 생성기를 만들어 이후 배치가 코드 변경 없이 캔버스에 공급되게 하고,
3. Insert 팔레트에서 recipe 컬렉션을 실제로 소비하는 브라우저 E2E + 절차 문서 갱신으로 닫는다.

범위 밖: 신규 콘텐츠 배치(CS/R2), materialize 계약 재설계(기존 planner 유지, 필요 최소 확장만), Pro 에셋/라이선스.

중단점: agent-design/registry 기존 테스트 회귀, validator 실패 반복(3회 초과), 배포 게이트(push는 사용자 승인).

## Planning gate

```yaml
planning_gate:
  team_validation_mode: manual-pass
  scope_posture: selective
  delegation_decision:
    remote_background_agents: use
    reason: "명세 고정 구현은 워커 위임, 병렬 가능한 Step 1(사이트/recipes)·Step 2(registry 패키지)는 파일 영역이 분리되어 동시 스폰. 게이트·E2E·통합은 오케스트레이터."
    target_roles: ["worker(code_asset 마이그레이션)", "worker(카탈로그 생성기)", "worker(팔레트 소비)"]
    execution_path: claude_subagent
  spec_delta: "component-registry에 recipe 컬렉션 개념 추가(RegistryCollection 확장) — 계약 변경은 registry 패키지 내부로 한정, canvas-core 무변경."
  perspectives:
    product: "horizon 닫는 기준의 마지막 축 — 새 배치가 재작업 없이 캔버스 레지스트리와 에이전트 진입점에 소비된다."
    architecture: "카탈로그는 build-time 파생물(SSOT=recipes frontmatter). 수기 카탈로그와 생성 카탈로그를 분리 유지해 shadcn 계약을 침범하지 않는다."
    security: "secret 없음. push는 승인 게이트."
    qa: "registry/agent-design 테스트 무회귀 + validate-recipes 23 + 생성 카탈로그 23 검증 + 브라우저 E2E."
    skeptic: "App.tsx 추출이 시각 회귀를 만들 위험 — 추출은 이동(move)이지 재작성이 아니어야 하며 build/lint + 사이트 스모크로 고정. 생성기가 frontmatter 결손을 조용히 건너뛰는 위험 — 결손 recipe는 생성 실패(비제로 exit)로 크게 실패시킨다."
  role_lanes:
    reviewer: "추출 diff가 구현 변경 없이 이동인지, 생성기가 SSOT 복제를 만들지 않는지 검토"
    qa: "step마다 validator·테스트 체인 재실행 + E2E"
    gate: "완료 전 DoD·ledger 독립 대조 (오케스트레이터)"
  dod:
    - "전 recipe 23종의 code_asset이 독립 컴포넌트 파일 (validate-recipes PASS)"
    - "build-time 생성기가 recipes frontmatter에서 recipe 카탈로그 23 entries 생성, 결손 시 비제로 exit"
    - "registry + agent-design 테스트 무회귀"
    - "브라우저 E2E: Insert 팔레트에서 recipe 컬렉션의 모바일 recipe를 모바일 뷰포트 캔버스에 삽입 관측"
    - "reference-loop.md 흡수 단계에 registry 자동 공급 반영"
```

## Step 트리

- [ ] Step 1 — code_asset 독립화 마이그레이션 (changeset): App.tsx 내장 심볼을 참조하는 구식 recipe들(~13종)의 구현을 `examples/ui-vocabulary-site/src/components/` 독립 파일로 추출(이동, 재작성 금지)하고 recipe `code_asset` 갱신. (verify: `python scripts/validate-recipes.py` 23 ok + site build/lint PASS)
- [ ] Step 2 — recipe 카탈로그 생성기 (changeset): `packages/component-registry`에 recipes frontmatter → `recipeCatalog` 생성 스크립트(build-time, 결손=비제로 exit) + `RegistryCollection` 확장 + 테스트. (verify: 생성 카탈로그 23 entries + registry 테스트 PASS)
- [ ] Step 3 — 팔레트 소비 + E2E + 절차 갱신 (changeset): InsertPalette가 recipe 컬렉션을 노출(필요 최소 수정), 브라우저 E2E(모바일 뷰포트에서 모바일 recipe 삽입), reference-loop.md 흡수 단계 갱신, ledger 기록. (verify: agent-design 테스트 무회귀 + E2E 스크린샷 evidence)

## 결정 로그

- [확정 2026-07-12] 다음 milestone = FW — 사용자 AskUserQuestion 확정.
- [확정 2026-07-12] 공급 범위 = 전 recipe 23종 (App.tsx 내장 구현의 독립화 마이그레이션 포함) — 사용자 AskUserQuestion 확정.
- [AI 기본값] 카탈로그는 build-time 파생(SSOT=recipes frontmatter), 수기 shadcnCatalog와 분리 병존. RegistryCollection에 'recipe' 추가.
- [AI 기본값] 추출은 시각 동일성 유지(이동 원칙). materialize 계약은 기존 유지.
- [기존 관례] push는 세션 단위 일괄 + 사용자 승인.
- 남은 사용자 소유 결정: 없음.
- status: resolved
