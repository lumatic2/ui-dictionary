# Plan - MS 모바일 표면 배치

Date: 2026-07-12
Milestone: MS (`ROADMAP.md`, active)
Status: approved (2026-07-12 — RL 완료 boundary에서 사용자와 표현 방식·배치 규모를 AskUserQuestion으로 확정 후 연쇄)

## 위계

- Objective: `docs/OBJECTIVE.md`
- Horizon: `docs/horizons/2026-07-living-design-system.md` (active)
- Milestone: MS — Mobile Surface Batch (HIG/Material 기반 모바일 패턴·레시피·예시 프로덕션 공개)

## Scope

mobile-apps 표면은 기준 문서(`docs/research/mobile-platform-design-baseline.md`)만 있고 recipe 0종이다. MS는:

1. 사이트에 **디바이스 프레임 컴포넌트**(모바일 뷰포트 프레임 렌더)를 만들어 모바일 예시의 프로덕션 공개 경로를 확보하고,
2. RL에서 실증된 5단계 루프로 **모바일 수집 2배치**(내비게이션·구조/HIG 우선, 입력·피드백/Material 우선)를 완주시키고,
3. **Agent Design 캔버스 설정에 모바일 뷰포트 preset**을 추가해 신규 모바일 콘텐츠를 캔버스에서 여는 E2E로 닫는다.

범위 밖: 네이티브(iOS/Android) 코드, 잔여 표면 배치(CS), anti-pattern 가이드 심화(R2), 레지스트리 자동 배선(FW), 캔버스 디바이스 프레임 렌더(preset은 뷰포트 크기만).

중단점: validator 실패 반복(3회 초과), agent-design 기존 테스트 회귀, 배포 게이트(push는 세션 단위 일괄 + 사용자 승인).

## Planning gate

```yaml
planning_gate:
  team_validation_mode: manual-pass
  scope_posture: selective
  delegation_decision:
    remote_background_agents: use
    reason: "RL과 동일 — 수집 리서치는 병렬 위임, 구현은 명세 고정 후 위임, 게이트·판정·통합은 오케스트레이터."
    target_roles: ["explorer(배치 수집 ×2)", "worker(디바이스 프레임)", "worker(배치 적응 ×2)", "worker(캔버스 preset)"]
    execution_path: claude_subagent
  spec_skip_reason: "recipe-format/pattern-taxonomy/authoring-workflow 계약 무변경. 디바이스 프레임은 사이트 컴포넌트 추가, 캔버스 preset은 viewport 설정 추가로 canonical document 계약을 바꾸지 않는다."
  perspectives:
    product: "Objective 성공상태 ③(전 표면) 이동 — 모바일이 첫 비웹 표면으로 열린다."
    architecture: "디바이스 프레임은 표현 래퍼일 뿐 recipe 계약 불변. 캔버스 preset은 renderer가 아닌 설정/뷰포트 레이어만 건드린다."
    security: "secret/auth 없음. push는 사용자 승인 게이트."
    qa: "배치별 RL 검증 체인 + agent-design 기존 테스트(npm test -- --run) 회귀 확인 + 캔버스 E2E 관측."
    skeptic: "웹 컴포넌트를 폰 프레임에 넣고 '모바일 패턴'이라 부를 위험 — HIG/Material 구조 근거(source tier 1)와 터치 시맨틱을 recipe Checks에 강제해 차단."
  role_lanes:
    explorer: "배치별 HIG/Material/Tailwind Plus 후보 수집 (sonnet)"
    reviewer: "recipe가 데스크톱 웹 패턴의 재포장이 아닌지, 프레임/preset이 기존 계약을 침범하지 않는지 diff 검토"
    qa: "validator 체인 + agent-design 테스트 + E2E를 배치/step마다 재실행"
    gate: "완료 전 ledger·DoD 독립 대조 (오케스트레이터)"
  dod:
    - "사이트 디바이스 프레임 컴포넌트 존재 + 모바일 recipe 예시가 프레임 안에서 프로덕션 렌더"
    - "모바일 2배치 RL 루프 완주: ledger 2행 + 각 배치 validator 체인 PASS"
    - "mobile-apps 표면 recipe ≥4, 용어 배치 반영 (validate-recipes/validate-ui-vocabulary PASS)"
    - "agent-design 캔버스 설정 viewport preset으로 모바일 콘텐츠 열기 E2E 관측 + 기존 테스트 무회귀"
```

## Step 트리

- [x] Step 1 — 디바이스 프레임 인프라 (changeset): `examples/ui-vocabulary-site`에 DeviceFrame 컴포넌트(모바일 뷰포트 프레임) + 모바일 예시 렌더 경로. (verify: site build/lint PASS + 프레임 렌더 관측)
- [x] Step 2 — 모바일 배치 1: 내비게이션·구조 (HIG 우선 — 탭바·내비 스택·시트·풀-투-리프레시 등). RL 5단계 루프, recipe 2종 + 용어 10~20. (verify: audit + validator 체인 PASS + ledger row)
- [ ] Step 3 — 모바일 배치 2: 입력·피드백 (Material 우선 — 모바일 폼·액션 시트·FAB·스와이프 액션 등). 동일 루프, recipe 2종 + 용어. (verify: 동일 + ledger row)
- [ ] Step 4 — 캔버스 모바일 뷰포트 preset (changeset): `apps/agent-design` 캔버스 설정에 viewport preset(Mobile 390×844 / Tablet 768×1024 / Desktop) + 신규 모바일 recipe를 캔버스에서 여는 E2E. (verify: `cd apps/agent-design; npm test -- --run` 무회귀 + build PASS + E2E 관측)

## 결정 로그

- [확정 2026-07-12] 표현 방식 = 사이트 디바이스 프레임(본체) + 캔버스 viewport preset(마무리 step) — 사용자 AskUserQuestion 확정.
- [확정 2026-07-12] 배치 규모 = 2배치 (내비게이션·구조 / 입력·피드백) — 사용자 AskUserQuestion 확정.
- [AI 기본값] viewport preset 크기 = Mobile 390×844, Tablet 768×1024, Desktop 기존값. 프레임 렌더(베젤 등 시각 장식)는 사이트 쪽만, 캔버스는 크기 preset만.
- [AI 기본값] 배치당 recipe 2종 + 용어 후보 10~20 (RL 관례 유지).
- [기존 관례] push는 세션 단위 일괄 + 사용자 승인.
- 남은 사용자 소유 결정: 없음.
- status: resolved
