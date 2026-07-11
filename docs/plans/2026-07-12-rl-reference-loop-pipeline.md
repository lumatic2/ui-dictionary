# Plan - RL 레퍼런스 루프 파이프라인

Date: 2026-07-12
Milestone: RL (`ROADMAP.md`, active)
Status: approved (2026-07-12 사용자 "진행하자" — 배치 표면 3종 추천안 포함 승인, 백그라운드 에이전트 병렬 활용 지시)

## 위계

- Objective: `docs/OBJECTIVE.md`
- Horizon: `docs/horizons/2026-07-living-design-system.md` (active)
- Milestone: RL — Reference Loop Pipeline (수집 배치의 표준 절차·도구·장부화, 3배치 반복 실증)

## Scope

vocabulary 쪽(`docs/ui-vocabulary/authoring-workflow.md`)에는 inbox→dedup audit→promote→validate→deploy 승인이라는 반복 루프가 이미 있으나, pattern/recipe 쪽 레퍼런스 흡수(`docs/research/*-ledger.md`)는 전부 일회성 수동 배치다. RL은 그 루프 구조를 pattern/recipe 흡수로 이식한다:

1. 표준 절차 문서 + pattern candidate inbox + batch ledger를 만들고,
2. dedup/schema audit 도구를 붙인 뒤,
3. thin 표면 3개(commerce, internal-tools, documentation)에서 실증 배치 3회를 동일 절차로 완주시킨다.

범위 밖: mobile 표면(MS milestone), llms.txt `FIXED_ASSETS` 자동 발견·registry 자동 배선(FW milestone), CLI 기능 변경, npm publish, 사이트 신규 화면.

중단점: validator 실패 반복(3회 자가교정 초과), 절차가 배치 간 재사용 불가로 판명(설계 회귀 필요), 배포 게이트. git push는 세션 단위 일괄 + 사용자 승인(기존 관례).

## Planning gate

```yaml
planning_gate:
  team_validation_mode: manual-pass
  scope_posture: selective
  delegation_decision:
    remote_background_agents: use
    reason: "배치별 후보 수집(레퍼런스 조사)은 독립·병렬 가능한 리서치 노동이라 sonnet 하위 에이전트에 위임한다. 절차 설계·dedup 판정·게이트는 오케스트레이터가 직접 수행한다."
    target_roles: ["explorer(배치 후보 수집)"]
    execution_path: claude_subagent
  spec_skip_reason: "agent-asset-model, recipe-format, pattern-taxonomy 계약은 변경하지 않는다. 신규 문서(reference-loop.md)는 기존 계약을 절차로 엮을 뿐 제품 계약 델타가 없다."
  perspectives:
    product: "표면 확장(MS/CS)이 매번 재발명 없이 굴러가는 운영 루프 — horizon 성공상태 ⑤의 직접 구현."
    architecture: "기존 SSOT(terms.yml/recipes/tokens)와 validator를 그대로 소비하는 절차 레이어. 새 데이터 정본을 만들지 않는다."
    security: "secret/auth 없음. 외부 쓰기는 git push뿐이며 사용자 승인 게이트 유지."
    qa: "배치마다 audit→validate-recipes→validate-ui-vocabulary→build→lint→llms 재생성 게이트. 실패 모드: 중복 후보 fixture가 audit에서 실제로 검출되는지 확인."
    skeptic: "절차 문서만 만들고 루프가 안 도는 위험 — DoD를 문서 존재가 아니라 3배치 완주 증거(ledger 3 entries)로 고정해 차단."
  role_lanes:
    explorer: "배치별 레퍼런스 후보 수집 (sonnet 위임, 산출=inbox 후보)"
    planner: "3배치가 서로 다른 표면을 덮고 절차가 동일한지 대조"
    reviewer: "레시피가 recipe-format 8섹션·token 참조 계약을 지키는지 diff 검토"
    qa: "배치마다 전체 validator 체인 실행 + 중복 fixture 음성/양성 확인"
    gate: "완료 전 ledger 3 entries와 ROADMAP DoD 독립 대조"
  dod:
    - "docs/research/reference-loop.md 절차 + docs/research/loop/{inbox.yml,ledger.md} 존재"
    - "node scripts/audit-recipe-candidates.mjs가 클린 후보 PASS + 중복 fixture 검출 양쪽 관측"
    - "실증 배치 3회 완주: 각각 validate-recipes/validate-ui-vocabulary/build/lint PASS + ledger entry"
    - "신규 콘텐츠가 generate-llms-txt.mjs 재생성과 CLI build:data에 반영"
```

## Step 트리

- [ ] Step 1 — 루프 절차 + intake/장부 (changeset): `docs/research/reference-loop.md`(수집→중복 필터→적응→검증→흡수 절차, source tiering, evidence 필드, 배치 정의) + `docs/research/loop/inbox.yml`(pattern candidate staging) + `docs/research/loop/ledger.md`(batch ledger). (verify: 절차가 agent-asset-model 4-layer·recipe-format 계약과 정합, inbox 스키마 문서화)
- [ ] Step 2 — 배치 audit 도구 (changeset): `scripts/audit-recipe-candidates.mjs` — inbox 후보를 기존 recipes/terms 대비 id/name/유사 overlap 검사 + 스키마 검증. (verify: 중복 fixture 검출 + 클린 fixture 통과 2케이스 실행 관측)
- [ ] Step 3 — 실증 배치 1: commerce. 후보 ~10 수집→audit→recipe 1~2종+용어 적응→전체 검증→ledger 기재. (verify: validator 체인 PASS + ledger entry 1)
- [ ] Step 4 — 실증 배치 2: internal-tools. 동일 절차. (verify: validator 체인 PASS + ledger entry 2)
- [ ] Step 5 — 실증 배치 3: documentation + 절차 회고: 3배치에서 드러난 절차 수정을 reference-loop.md에 반영. (verify: validator 체인 PASS + ledger 3 entries + 절차 Changelog)

## 결정 로그

- [확정 2026-07-12] H2 Living Design System 활성화 + 첫 milestone RL — 사용자 지시("H2 활성화하고 ㄱㄱ").
- [확정 2026-07-12] 3개 실증 배치 표면 = commerce / internal-tools / documentation — 사용자 "진행" 승인에 포함 (현재 가장 thin한 표면; mobile은 MS milestone에 유보).
- [확정 2026-07-12] 실행 방식 = 백그라운드 에이전트 병렬 위임(sonnet 워커), 오케스트레이터는 게이트·통합 전담 — 사용자 지시.
- [AI 기본값] 배치 규모 = 배치당 recipe 1~2종 + 용어 후보 10~20 (authoring-workflow의 "좁은 주제 1개, 후보 20개 내외" 관례 준수).
- [AI 기본값] llms.txt FIXED_ASSETS는 RL에서 수동 등록(절차에 명시), 자동 발견화는 FW로 유보.
- [기존 관례] git push는 세션 단위 일괄, 사전 요약 보고 + 사용자 승인 후.
