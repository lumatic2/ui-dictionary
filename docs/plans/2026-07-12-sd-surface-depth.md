# Plan - SD 표면 심화 2세대

Date: 2026-07-12
Milestone: SD (`ROADMAP.md`, active) — CS+R2 병합 재정의
Status: approved (2026-07-12 — FW 완료 boundary에서 사용자와 심화 표면 4종·R2 양 축 포함을 AskUserQuestion으로 확정)

## 위계

- Objective: `docs/OBJECTIVE.md`
- Horizon: `docs/horizons/2026-07-living-design-system.md` (active)
- Milestone: SD — Surface Depth 2세대 (구 CS·R2 후보 병합: 표면 심화 배치 + anti-pattern 가이드 + 토큰 커버리지)

## Scope

RL/MS가 연 표면들의 recipe 깊이가 얕다(commerce 3, internal-tools 2, documentation 3, mobile-apps 4). SD는:

1. 검증된 RL 루프로 4개 표면에 **심화 배치**를 1회씩 돌려 표면당 recipe 2~3종 + 용어를 추가하고 (FW 배선 덕에 사이트·llms.txt·CLI·캔버스 팔레트 4곳 자동 도달),
2. 전 recipe에 흩어진 Anti-patterns 섹션을 증류해 **agent-facing 통합 anti-pattern 가이드**를 만들고 llms.txt에 노출하며,
3. 신규 표면이 드러낸 **토큰 갭**(safe-area·데이터 밀도·터치 타깃 등)을 점검해 필요분만 SSOT 확장한다.

이 milestone 완료 시 H2 닫는 기준(전 표면 실콘텐츠 + 루프 반복 실증 + 자동 소비)의 깊이 요건까지 충족되어 horizon close 판정 대상이 된다.

범위 밖: 결제/계정(다음 horizon), 신규 표면 카테고리 추가, materialize 소스 실체화 확장.

중단점: validator/테스트 회귀 반복(3회 초과), 배포 게이트(push는 사용자 승인).

## Planning gate

```yaml
planning_gate:
  team_validation_mode: manual-pass
  scope_posture: selective
  delegation_decision:
    remote_background_agents: use
    reason: "RL/MS/FW와 동일 패턴 — 수집 4개 병렬 위임, 배치 적응은 terms.yml 공유로 순차 위임, anti-pattern/토큰은 배치 후 병렬 위임. 게이트·판정·통합은 오케스트레이터."
    target_roles: ["explorer(수집 ×4)", "worker(배치 적응 ×4)", "worker(anti-pattern 가이드)", "worker(토큰 갭)"]
    execution_path: claude_subagent
  spec_skip_reason: "recipe-format/taxonomy/token SSOT 계약 무변경. anti-pattern 가이드는 신규 문서(FIXED_ASSETS 등록), 토큰 확장은 기존 3-tier 규약 내 추가."
  perspectives:
    product: "표면별 깊이 균등화 + anti-pattern 가이드 — 북극성('AI 티 안 나는 UI')의 직접 자산."
    architecture: "전부 기존 파이프라인 소비. 새 정본 없음. 토큰 확장은 generate-tokens.mjs 파생 체계 유지."
    security: "secret 없음. push 승인 게이트."
    qa: "배치마다 RL 검증 체인 + build:catalog. anti-pattern 가이드는 llms 노출·링크 검증. 토큰은 lint-tokens + 파생 재생성."
    skeptic: "심화 배치가 잔여 후보 긁어모으기가 될 위험 — 각 배치는 수집을 새로 돌려 Tier 근거 있는 후보만. anti-pattern 가이드가 recipe 중복 서술이 될 위험 — 증류(일반 원칙)만 싣고 개별 사례는 recipe 포인터로."
  role_lanes:
    reviewer: "배치 diff의 recipe-format 준수 + 가이드의 SSOT 중복 여부 검토"
    qa: "배치·step마다 검증 체인 재실행"
    gate: "완료 전 DoD·ledger 독립 대조 + H2 close 판정 준비 (오케스트레이터)"
  dod:
    - "4개 표면 각각 심화 배치 1회 완주: ledger 4행 추가, 표면당 recipe +2 이상 (총 recipe 31+)"
    - "각 배치 검증 체인 PASS (validate-recipes/-ui-vocabulary, llms, site build/lint, CLI build:data, registry build:catalog)"
    - "docs/design-system/anti-patterns.md 존재 + FIXED_ASSETS 등록 + llms.txt 노출"
    - "토큰 갭 리포트 + 필요 확장분 SSOT 반영 (lint-tokens PASS + 파생 재생성)"
```

## Step 트리

- [x] Step 1 — 심화 배치: commerce (RL 루프, recipe 2~3 + 용어). (verify: 검증 체인 + build:catalog + ledger row)
- [x] Step 2 — 심화 배치: internal-tools. (verify: 동일)
- [x] Step 3 — 심화 배치: documentation. (verify: 동일)
- [x] Step 4 — 심화 배치: mobile-apps. (verify: 동일)
- [ ] Step 5 — anti-pattern 통합 가이드 (changeset): 전 recipe Anti-patterns 증류 → `docs/design-system/anti-patterns.md`, FIXED_ASSETS 등록. (verify: generate-llms-txt PASS + 문서 링크 검증)
- [ ] Step 6 — 토큰 커버리지 2세대 (changeset): 신규 표면 토큰 갭 점검 리포트 + 필요 확장 → SSOT·파생 재생성. (verify: lint-tokens + generate-tokens + site build)

## 결정 로그

- [확정 2026-07-12] CS+R2 병합 → SD milestone, H2 계속 — 사용자 선택(선택지 3).
- [확정 2026-07-12] 심화 표면 = commerce, internal-tools, documentation, mobile-apps (4종 전부) — 사용자 AskUserQuestion 확정.
- [확정 2026-07-12] R2 양 축(anti-pattern 가이드 + 토큰 2세대) 포함 — 사용자 AskUserQuestion 확정.
- [AI 기본값] 배치 규모 = 표면당 1배치, recipe 2~3종 + 용어 후보 ~10 (RL 관례). 수집 병렬, 적응 순차.
- [AI 기본값] anti-pattern 가이드는 증류 원칙 + recipe 포인터 (사례 본문 중복 금지).
- [기존 관례] push는 세션 단위 일괄 + 사용자 승인.
- 남은 사용자 소유 결정: 없음.
- status: resolved
