# Plan - QA3 Canvas Recipe Materialization

Date: 2026-07-12
Milestone: QA3 (`ROADMAP.md`, active — horizon-run 연쇄 승격, QA1 완료 직후)
Status: approved (2026-07-12 horizon-run 연쇄 — QA2 승인 시 연쇄 범위에 포함)

## 위계

- Objective: `docs/OBJECTIVE.md`
- Horizon: `docs/horizons/2026-07-quality-dogfooding.md` (active, 3/3 마지막)
- Milestone: QA3 — Canvas Recipe Materialization

## Scope

팔레트 recipe 삽입은 `registry://recipe/<slug>` placeholder 노드만 만든다. QA3은 ① recipe 실체화가 제네릭 스켈레톤이 아닌 **recipe의 실 standalone 소스**를 프로젝트 파일로 쓰게 하고, ② 캔버스에 사용자 실체화 액션을 만들고, ③ 삽입→실체화→cold re-derive 왕복을 E2E로 증명한다.

기술 접근 (정찰 근거): `planMaterializeRegistryNode`는 이미 registry:// 노드 일반형 + identity 계약(생성 파일의 `data-agent-design-id` = 노드 id) + bridge `NEW_FILE_HASH` 채널 + undo 파일 삭제(QA2 Step 5)가 완비. recipe 소스는 catalog 빌드 시 code_asset 파일 내용을 marker placeholder(`__AD_NODE_ID__` 등) 주입해 generated module로 임베드하고, 실체화 시 placeholder를 노드 id로 치환한다.

범위 밖: 실체화 파일의 임의 프로젝트 컴파일 보장(shadcn/lucide 의존성은 헤더 주석으로 문서화), 웹(브리지 없는) 모드 실체화, 신규 recipe.

중단점: identity 왕복 불성립(blocked 보고), 검증 회귀 반복. push는 세션 단위 일괄 + 사용자 승인.

## Planning gate

```yaml
planning_gate:
  team_validation_mode: manual-pass
  scope_posture: selective
  delegation_decision:
    remote_background_agents: use
    reason: "registry 팩·캔버스 UI는 명세 고정 워커. E2E 게이트·커밋은 오케스트레이터."
    target_roles: ["worker(recipe 소스 실체화 changeset, 캔버스 액션 changeset)"]
    execution_path: claude_subagent
  spec_skip_reason: "기존 실체화 계약(RT Step 3)의 recipe 확장 — 신규 제품 계약 없음."
  perspectives:
    product: "삽입한 recipe가 진짜 코드가 되는 순간 — 캔버스 제작 루프의 마지막 고리."
    architecture: "identity 계약·NEW_FILE_HASH 채널 재사용. 소스는 빌드타임 임베드로 런타임 파일 읽기 없음."
    security: "쓰기 경로는 기존 project-root boundary 검증 그대로."
    qa: "registry 팩 유닛 + bridge 왕복 테스트 + 캔버스 통합 테스트 + packaged/E2E 왕복 관측."
    skeptic: "code_asset 소스에 marker 주입이 안전한가 — 빌드타임 주입 + 결정적 루트 요소 검증으로 고정, 주입 불가 recipe는 빌드 실패로 loud."
  role_lanes:
    gate: "완료 전 DoD·왕복 evidence 독립 대조 (오케스트레이터)"
  dod:
    - "recipe 노드 실체화가 recipe standalone 소스(marker 주입본)를 src/components/<Export>.tsx로 생성"
    - "캔버스 실체화 액션(브리지 연결 시)으로 삽입→실체화→파일 생성 관측"
    - "cold re-derive가 같은 노드 id를 실 파일로 해석 (왕복 E2E)"
    - "실패 모드: 이미 source-backed 노드 실체화 거부 + undo 시 파일 삭제(기존 계약) 회귀 무결"
    - "관련 패키지 테스트·빌드 전부 PASS"
```

## Step 트리

- [ ] Step 1 — recipe 소스 임베드 + 실체화 확장 (changeset, packages/component-registry): build:catalog가 code_asset 내용에 marker placeholder를 주입해 `recipe-sources.generated.ts` 생성, `planMaterializeRegistryNode`가 recipe/* 노드에서 임베드 소스+placeholder 치환 사용(비-recipe는 기존 스켈레톤 유지). (verify: registry 유닛 테스트 + build:catalog 재생성 결정성)
- [ ] Step 2 — 캔버스 실체화 액션 (changeset, apps/agent-design + bridge/desktop 필요분): 선택 노드가 registry-backed code-component이고 브리지 연결 시 "Materialize" 액션 → NEW_FILE_HASH source-patch 트랜잭션. (verify: 앱/브리지 테스트 무회귀 + targeted test)
- [ ] Step 3 — 왕복 E2E + 마감 (evidence): 삽입→실체화→파일 확인→cold re-derive 동일 id 해석을 bridge 왕복 테스트/실 구동으로 관측. (verify: E2E PASS)

## 결정 로그

- [확정 2026-07-12] horizon-run 연쇄: QA2 승인("진행")의 연쇄 범위에 QA3 포함.
- [AI 기본값] recipe 실체화 소스 = standalone code_asset 임베드(빌드타임 marker placeholder 주입, 런타임 id 치환). 컴파일 의존성은 헤더 주석 문서화.
- [AI 기본값] 실체화 액션은 브리지 연결(데스크톱) 한정 — 웹 데모 모드 비활성.
- [기존 관례] push는 세션 단위 일괄 + 사용자 승인.
- 남은 사용자 소유 결정: 없음.
- status: resolved
