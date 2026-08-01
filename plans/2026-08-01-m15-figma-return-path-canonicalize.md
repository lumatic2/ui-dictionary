# PLAN — M15: 귀환 절차 정본화·배선 (figma-return-path 2/2)

> 생성: 2026-08-01 · 갈래: 방법론·계약 정본화 + agent-facing 배선 · scope: M14 실증에서 확정된 기계화 회수 절차를 방법론·계약의 정본으로 흡수하고, 에이전트가 읽는 표면(llms)과 소비 스킬(figma-codex-workflow)에 배선한다. goal `figma-return-path` 2번 milestone (연쇄: M14 → M15).
Status: approved (사용자 승인 2026-08-01 "ㄱㄱ" — 연쇄 M14→M15 일괄 승인, 스킬 승격 포함 확정)

## 북극성 → milestone → step (위계)
- **북극성**: Askewly Design (← `CLAUDE.md` 「북극성」 절) — 왕복이 1회 실증으로 끝나지 않고 "반복 가능한 능력"으로 남으려면 정본 문서·스킬이 그 절차를 소유해야 한다.
- **goal**: `figma-return-path` (M14 후속 — M14 evidence 가 이 milestone 의 입력).
- **리서치 입력**: 조사 불요 — M14 실증 기록이 입력 전부다. 갱신 대상 좌표는 이미 식별됨: `methodology/figma-workflow.md` Changelog 관례 · `docs/design-system/figma-bridge-contract.md` §5 "스킬 쪽 갱신 필요 지점 3건(FB3 이후 반영)" 명시 목록 · llms FIXED_ASSETS 수동 등재 규칙(reference-loop 교훈).

## Scope Boundary
- **포함**: ① 방법론·계약 갱신(회수 기계화·2회차 교훈) ② agent-facing 노출(llms 등재+재생성+동기화 검사) ③ figma-codex-workflow 스킬 갱신 3건 + 배포(cross-repo: `~/projects/custom-skills`).
- **제외**: 새 왕복 실행(M14 소관) · 결제·라이선스 표면 · push(goal 마감 시 일괄, 사용자 승인 후).
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / user_stopped
- rollback/cleanup: 문서·스킬 텍스트 위주 — 커밋 단위 revert. 스킬 배포는 setup.sh 재실행으로 재배포(멱등).

## 스캐폴딩 결정
- source-of-truth: 절차 정본 = `methodology/figma-workflow.md`, 계약 정본 = `docs/design-system/figma-bridge-contract.md`, 스킬 원본 = `~/projects/custom-skills/`(배포본 직접 편집 금지 — 전역 규칙).
- 검증: `node scripts/generate-llms-txt.mjs` 재생성 + check-llms-sync + 사이트 build·lint + 스킬 `setup.sh` 배포 후 배포본 diff 0.
- 배포/운영: ui-dictionary push = goal 마감 일괄(사용자 승인 후 — deploy batching). custom-skills 커밋은 해당 레포 관례를 따름.
- 자기선언 도메인 — cross-repo 경계: custom-skills 수정은 원본 레포에서만, 이 레포 changeset 에는 좌표·커밋 해시만 기록.
- 검토 후 제외: 계약 §2(나가는 방향 동기화 규약) 개정 — M14 재동기화가 규약대로 통과하면 무개정, 스크립트 보수가 있었으면 그 폭만 반영.

## 결정 로그
- status: resolved
- **[사용자 확정 2026-08-01] 스킬 갱신 포함 + promoted 승격 승인** (추천안 "ㄱㄱ"). 원안 서술: figma-codex-workflow 3건(계약 §5 — Claude Code 주력 채널 명시·계정 이원화 whoami 선행·계약 문서 소비 좌표 링크)은 cross-repo 작업. **실측(fresh 검증자 2026-08-01): 스킬이 `in-progress/` 버킷 — promoted 만 배포되므로(ADR 0001) 갱신을 배포까지 끌려면 promoted 승격(git mv) 결정이 선행돼야 한다.** 추천 = 포함 + 승격(계약이 "FB3 이후 반영"으로 명시한 미완 항목이라 이 goal 이 자연 마감 지점). 승격 기각 시 대안: 원본만 갱신하고 Verify 를 "원본 3건 문자열 확인"으로 축소(배포 diff 검사 제외).
- **기술 결정**: ① 귀환 절차의 정본 착지 = methodology(절차) + 계약 §3에 "사람 디테일링 회수"를 §3 흡수 lane 과 구분되는 별도 lane 으로 명문화(파일럿·2회차가 실증한 구분) ② llms 노출 대상 = 계약 문서(agent-facing) — methodology 는 사람용이므로 비노출 유지, 대신 계약에서 wikilink.
- 그 외 새 사용자 소유 결정: 없음.

## Step 트리

- [ ] **step-1 — 방법론·계약 갱신**
  - Artifact: `methodology/figma-workflow.md` §2⑤·§3 도구 좌표를 기계화 회수(스냅숏 장부·diff 스크립트)로 갱신 + Changelog(2회차 교훈) · `docs/design-system/figma-bridge-contract.md` §3 에 "사람 디테일링 회수 lane" 명문화(흡수 lane 과 구분) + §1 채널 표 현행화(M14 research 반영) + Changelog.
  - Files: write methodology/figma-workflow.md, docs/design-system/figma-bridge-contract.md. read evidence/figma-return-path/m14-roundtrip-2.md, research/2026-08-01-m14-figma-channel-recheck.md.
  - Risk: 기계적 (문서 — 단 계약은 정본이라 M14 실측과 문장 단위 대조)
  - Dependencies: 없음
  - Verify: 대조 표를 evidence 에 기록 — 스크립트명·채널명·계정 문자열은 `grep` 커맨드로 재현 가능하게(예: `grep -n "figma-return-diff\|figma-push-snapshot\|yusung345" methodology/figma-workflow.md docs/design-system/figma-bridge-contract.md`), 절차 서술 대조는 표로 남긴다.
  - Failure probe: M14 가 partial(디테일링 무변경)로 닫힌 경우 — 검증 안 된 문장은 정본에 넣지 않고 "미실증" 표기로 구분.
  - Commit: changeset `m15-figma-return-path-canonicalize` (README 절: step-1).

- [ ] **step-2 — agent-facing 노출 (llms 배선)**
  - Artifact: `scripts/generate-llms-txt.mjs` FIXED_ASSETS 에 figma-bridge-contract 등재(미등재 시) + 재생성 산출물 + 사이트 검증 체인.
  - Files: write scripts/generate-llms-txt.mjs, examples/ui-vocabulary-site/public/llms.txt·public/llms/(재생성).
  - Risk: 기계적 (생성기 — check-llms-sync 게이트)
  - Dependencies: step-1
  - Verify: check-llms-sync PASS + 재생성 llms.txt 에 figma-bridge-contract 노출 문자열 확인 + 사이트 build·lint PASS.
  - Failure probe: FIXED_ASSETS 수동 등재 누락(생성기가 docs/design-system glob 안 할 수 있음 — knowledge 선례와 동일 함정)을 등재 후 문자열 확인으로 차단.
  - Commit: changeset `m15-figma-return-path-canonicalize` (README 절: step-2).

- [ ] **step-3 — figma-codex-workflow 스킬 갱신 3건 + 배포 (cross-repo)**
  - Artifact: `~/projects/custom-skills/` 원본에서 계약 §5 의 3건 반영 — ① Tool Rules 에 Claude Code 주력 채널(원격 Figma MCP·figma-use 리소스 로드) 명시 ② 계정 이원화 주의(`whoami` 선행) ③ Askewly 레포 한정 소비 좌표로 계약 문서 링크 — 후 `setup.sh` 배포.
  - Files: write ~/projects/custom-skills/**/figma-codex-workflow/SKILL.md(원본 — 정확 경로는 실행 시 확인). read docs/design-system/figma-bridge-contract.md §5.
  - Risk: 기계적 (스킬 텍스트 — 배포 멱등)
  - Dependencies: step-1
  - Verify: 배포 후 배포본(`~/.claude/skills/` 또는 `~/.codex/skills/`)과 원본 diff 0 + 3건 각각 문자열 존재 확인.
  - Failure probe: (승인 전 실측으로 해소 — 결정 로그 참조) 스킬은 현재 `in-progress/` — 승격 승인 시 git mv 후 배포, 기각 시 원본 갱신+문자열 확인으로 축소.
  - Commit: custom-skills 레포 커밋 + 이 레포 changeset `m15-figma-return-path-canonicalize` (README 절: step-3, 좌표·해시 기록).

## 검증/DoD
- **DoD**: 귀환 절차가 정본·스킬·llms 세 표면에 배선됨 — 계약·방법론 갱신(실측 대조 불일치 0) + llms 노출 + 스킬 3건 배포. 실패 모드 확인: check-llms-sync 게이트 + 스킬 배포본 diff 검사(happy-path 배포 아님을 확인).
- **Evidence**: `evidence/figma-return-path/m15-canonicalize.md`
- **회귀 게이트**: 사이트 build·lint + llms 기존 등재 자산 무손실(check-llms-sync).

## finding 큐
- (실행 중 발견 항목)

## 진행 로그
- 2026-08-01 작성.
- 2026-08-01 fresh 검증자(sonnet) 반영 — figma-codex-workflow 가 `in-progress/` 버킷 실측(배포 전제 깨짐) → 승격 여부를 사용자 결정으로 승격, step-1 Verify 를 grep 재현 가능형으로 교체. FIXED_ASSETS 미등재·M14/M15 ID 무충돌 확인됨.
