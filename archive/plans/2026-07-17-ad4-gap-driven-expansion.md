# Plan - AD4 Gap-driven 확장

Date: 2026-07-17
Milestone: AD4 (`ROADMAP.md`, pending → 사용자 지시로 조기 활성 — AD3는 step 4(기회주의 건)만 blocked로 병행 유지)
Status: approved (2026-07-17 사용자 "진행" — push·배포 포함 승인)

## 위계

- Objective: `OBJECTIVE.md`
- Horizon: `docs/horizons/2026-07-agent-adoption-loop.md` (active, 4/4)
- Milestone: AD4 — Gap-driven 확장

## Scope

AD3 dogfooding 장부(`docs/research/dogfooding/ledger.md` DF-1~DF-3)에 쌓인 갭 4건을 자산으로 반영한다. 사용자 결정(2026-07-17): **hook은 재활성하지 않는다** — 판정 의무는 hook 리마인더가 아니라 entry-protocol 텍스트가 소유한다(갭 ④는 이 결정으로 해소 처리).

| 갭 (장부 출처) | 반영 자산 | Step |
|---|---|---|
| ① 챗/대화 UI recipe 부재 (DF-1·DF-2) | `recipes/application-ui/chat-conversation-panel.md` + code_asset + gallery | 1 |
| ② 한글 break-keep 지침 anti-patterns 부재 (DF-1·DF-2) | anti-patterns.md 신규 클러스터 | 2 |
| ③ 라우팅이 스타일 주입으로 작동 (DF-3) | entry-protocol.md 판정-중심 재정렬 | 2 |
| ④ hook 리마인더에 판정 의무 없음 (DF-2) | hook 불사용 확정 — 판정 의무를 entry-protocol 의무 단계로 명문화 | 2 |

범위 밖: hook 재활성·신규 hook 작성(사용자 결정으로 배제), UI Vocabulary term 추가, AD3 step 4(기회주의 dogfood — 별도 진행 중), 신규 갭 발굴(장부의 기존 4건만).

## 스캐폴딩 결정

- 작업 유형: tooling (agent-facing 디자인 시스템 자산 확장)
- source-of-truth: `recipes/` + `docs/design-system/` (배포 파생본은 `scripts/generate-llms-txt.mjs`가 생성)
- deploy: `git push origin main` → Cloudflare(ui.askewly.com) 자동 배포 → 배포 curl로 정본 확인. **push·배포는 이 plan 승인에 포함**(커밋·푸시 기본 2026-07-17 + 이 레포 배포 승인 지점을 plan 승인으로 갈음)
- 테스트 표면: `python scripts/validate-recipes.py` · `node scripts/generate-llms-txt.mjs` · site `npm run build` · 브라우저 gallery smoke · 배포 후 curl(신규 recipe URL 200 + 오경로 404)

## Scope Boundary

- Execution mode: continuous
- 중단점(hard-stop policy): Stop only on ① 새 사용자 소유 결정(decision_required) ② 검증 체인 실패가 자산 밖 원인일 때(blocked) ③ risk_gate. 배포 push는 승인에 포함되므로 정지점이 아니다.
- Rollback/cleanup: changeset 단위 revert. llms.txt·catalog는 generator 재실행으로 재파생(수기 수정 없음).

## Planning gate

```yaml
planning_gate:
  team_validation_mode: manual-pass
  scope_posture: selective
  delegation_decision:
    remote_background_agents: skip
    reason: "자산 2 changeset·단일 레포·검증 커맨드 명확 — 워커 위임 이득보다 왕복 비용이 큼. AD3와 달리 '라우팅 실사용 관측' 목적이 없어 신규 세션 워커 불필요."
    target_roles: []
    execution_path: local_manual
  spec_skip_reason: "AD4 계약은 ROADMAP DoD·horizon doc에 이미 기록 — recipe/protocol은 기존 계약(recipe-format.md)을 따르는 자산 추가라 spec 변경 없음."
  perspectives:
    product: "dogfooding에서 실측된 수요만 채움 — 수요 주도 성장 루프의 첫 실증."
    architecture: "recipe 계약(frontmatter·8섹션·code_asset)·taxonomy 10종 어휘 준수, 파생본은 generator 소유."
    security: "secret·외부 연동 없음. 공개 배포 자산이므로 내부 경로·개인정보 미포함 확인."
    qa: "validate-recipes + build + 브라우저 실구동 + 배포 curl — E2E 표면(웹) 실구동 포함."
    skeptic: "entry-protocol 재정렬이 과교정되어 무토큰 프로젝트에서 askewly 기본값까지 죽이면 AD1 성과 훼손 — 재정렬은 '프로젝트 토큰 우선' 유지 + 무토큰 fallback 보존으로 한정."
  role_lanes:
    gate: "오케스트레이터가 검증 체인 독립 재실행 + 시그니처로 신규 데모 자가 판정 + 갭 추적표 대조"
  dod:
    - "챗 recipe가 validate-recipes.py PASS + gallery live-render(브라우저 실구동) + llms.txt Recipes 섹션 노출"
    - "anti-patterns 한글 타이포 클러스터 + entry-protocol 판정-중심 재정렬이 배포 curl로 확인"
    - "실패 모드: 배포 후 오경로 fetch가 404(loud failure 유지) + 데모 시그니처 자가 판정 기록"
    - "갭 4건 → 자산 반영 추적표(이 문서)가 changeset 경로로 완결"
```

## Step 트리

- [ ] Step 1 — 챗/대화 UI recipe (changeset)
  - Artifact: changeset
  - Files: `recipes/application-ui/chat-conversation-panel.md`(신규), `examples/ui-vocabulary-site/src/components/chat-conversation-panel.tsx`(신규 code_asset), `examples/ui-vocabulary-site/src/lib/recipe-gallery-data.ts`, `examples/ui-vocabulary-site/src/components/recipe-gallery-demos.tsx`
  - Dependencies: 없음
  - Verify: `python scripts/validate-recipes.py` PASS + site `npm run build` PASS + 브라우저에서 gallery 상세 live-render(라이트/다크) + 시그니처 자가 판정(원칙 5·비선호 0)
  - Failure probe: 데모에 로딩·에러·빈 상태 누락 시 FAIL(DF-2가 잡은 바로 그 갭이므로 상태 완비가 합격선), tokens_used에 primitive 참조·hex 리터럴 0
  - Commit: `feat(agent): AD4 step 1 — chat conversation recipe (gap ①)`
- [ ] Step 2 — 프로토콜·안티패턴 재정렬 (changeset)
  - Artifact: changeset
  - Files: `docs/design-system/entry-protocol.md`(판정-중심 재정렬 — 갭 ③·④), `docs/design-system/anti-patterns.md`(한글 타이포그래피 클러스터 — 갭 ②), `examples/ui-vocabulary-site` llms 파생본(`node scripts/generate-llms-txt.mjs` 재생성)
  - Dependencies: Step 1 (llms.txt에 신규 recipe 포함해 1회 재생성)
  - Verify: generator 재생성+링크 무결성 PASS → push → 배포 curl(entry-protocol·anti-patterns·신규 recipe 200 + 오경로 404)
  - Failure probe: 재정렬 후에도 "무토큰 프로젝트 → askewly tokens.css 기본값" 경로가 살아있는지 grep(과교정 방지), 판정 의무 단계가 명문인지 grep
  - Commit: `feat(agent): AD4 step 2 — protocol realignment + hangul anti-pattern (gaps ②③④)`

## 결정 로그

- [사용자 확정 2026-07-17] hook 재활성 안 함 ("hook은 안 쓸거야") — 갭 ④는 hook 수정이 아니라 entry-protocol 판정 의무 명문화 + 불사용 결정 기록으로 해소.
- [사용자 확정 2026-07-17] AD4 조기 활성 — AD3 step 4(기회주의 dogfood)는 blocked 유지, 완료 순서 역전 허용.
- [AI 기본값] 챗 recipe 단위 = 1건(스레드+말풍선+입력바+로딩/에러/빈 상태 포함), pattern_group=application-ui, id=chat-conversation-panel.
- [AI 기본값] break-keep 지침은 anti-patterns 신규 클러스터 "한글 타이포그래피·줄바꿈"으로 — 시그니처(비선호 2·3)와 중복 서술하지 않고 에이전트 지시형 문구로 구체화.
- [기존 관례] push·배포는 plan 승인에 포함(커밋·푸시 기본 2026-07-17).
- 남은 사용자 소유 결정: 없음.
- status: resolved
