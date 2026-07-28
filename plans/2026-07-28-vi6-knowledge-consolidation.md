# PLAN — VI6: 비주얼 임팩트 지식 층 통합

> 생성: 2026-07-28 · 갈래: 지식 자산화(문서) · scope: KG 모션·3D 노드 ↔ 이 레포 knowledge 층 전수 대조·정본 단일화. 새 goal `visual-impact-consolidation`(VI6→VI7→VI8 연쇄, `--chain VI7,VI8`)의 첫 milestone — 사용자 승인 "추천대로 ㄱㄱ"(2026-07-28).
Status: approved

## 북극성 → milestone → step (위계)
- **북극성**: Askewly Design (← `CLAUDE.md` 「북극성」 절) — "레퍼런스 흡수: 외부 시스템과 로컬 디자인 작업을 근거 기반으로 흡수하면서도 잡동사니 스크랩북이 되지 않는다" 축.
- **goal**: `visual-impact-consolidation` — 흩어진 비주얼 임팩트 방법(KG 노드·toolshelf 카드·로컬 구현)을 VI1~VI5 표현 스택 체계로 흡수. **milestone**: VI6 — 지식 층 통합.
- **리서치 입력**: `research/2026-07-28-visual-impact-goal-inventory.md` — KG 핵심 15노드+인접 3(motion 클러스터·3D 클러스터, 허브 = `frontend-motion-accessibility-source-map`이 `knowledge/expressive-stack.md` 결정표와 중복 진화 중), toolshelf 15카드(VI7 소관), 로컬 구현 2건(VI8 소관).

## Scope Boundary
- **포함**: ① KG 18노드(핵심 15+인접 3) ↔ `knowledge/expressive-stack.md`·`knowledge/motion-references.md` 전수 대조 장부(노드별 판정: 흡수/링크/제외 + 사유 + 정본 지정) ② 판정에 따른 knowledge/ 문서 갱신(흡수·wikilink·Changelog) ③ llms 산출 파이프라인에 갱신 반영 확인.
- **제외**: KG 레포 쪽 노드 수정(발견 항목은 finding 큐 → 후속 `/kg` 세션) · toolshelf 카드 판정(VI7) · 데모·recipe 구현(VI8) · 3d-repolis 모놀리스 추출(범위 제외 확정 — 관찰 기록만) · 책 스터디(별도 goal 확정).
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / user_stopped
- rollback/cleanup: 문서 변경만 — 커밋 revert 로 즉시 원복.

## 스캐폴딩 결정
- source-of-truth: 화면 표현 기법의 "무엇을 언제 쓰나" 정본 = `knowledge/expressive-stack.md`(이 레포). KG 노드는 일반 지식 원본으로 유지하되, 겹치는 판단 규칙은 expressive-stack 이 정본이고 KG 쪽은 출처 링크로 참조하는 관계로 지정한다(정본 단일화의 방향 — KG 쪽 실제 수정은 범위 밖, finding 큐로).
- 검증: 대조 장부의 18노드 전수(빠짐 0) 기계 확인(노드 목록 대비 grep) + knowledge 문서 내부 링크·출처 표기 확인 + llms 생성 스크립트 실행 결과에 갱신 문서 포함.
- 배포/운영: push·실배포는 세션 말 일괄(사용자 사전 보고 후 — deploy batching 관례). 이 milestone 의 DoD 는 로컬 검증까지, 실배포 curl 확인은 push 후 항목.
- 자기선언 도메인 — **흡수 계약 준수**: VI5/TC1 taste 흡수 계약(관찰만 하고 갱신 없으면 미소화)을 따른다 — 각 흡수 항목은 knowledge 문서의 실제 문구 갱신으로만 인정.
- 검토 후 제외: KG 노드 이중 기록(사본 금지 — 링크만) · 새 지식 수집(이번은 기존 자산 대조가 목적, 신규 리서치는 VI8/책 스터디에서).

## 결정 로그
- status: resolved
- **사용자 확정(2026-07-28)**: ① 착지 깊이 = 실증 포함 VI6~VI8 3-milestone ② 3d-repolis 이번 범위 제외(관찰 기록만) ③ 책 스터디는 별도 goal.
- **기술 결정**: 정본 방향 = expressive-stack(위 스캐폴딩) · KG 쪽 수정은 finding 큐 이월 · milestone ID 는 기존 VI 시리즈 연속(VI6~).
- **새 사용자 소유 결정: 없음.**

## Step 트리

- [x] **step-1 — 전수 대조·판정 장부**
  - Artifact: `research/2026-07-28-vi6-kg-crosswalk.md` — KG 18노드 × 판정(흡수/링크/제외) × 사유 × 정본 지정 × 대응 knowledge 위치. expressive-stack 결정표와 `frontend-motion-accessibility-source-map` 의 겹침·차이 명시 포함.
  - Files: write `research/2026-07-28-vi6-kg-crosswalk.md`. read KG `nodes/` 해당 18파일 · `knowledge/expressive-stack.md` · `knowledge/motion-references.md`.
  - Risk: 없음 (분석 산출물 — 원본 무변경)
  - Dependencies: 없음
  - Verify: 장부에 18노드 전수 존재(인벤토리 목록 대비 대조, 빠짐 0) · 판정 3분류 외 값 없음 · 각 행에 사유 기재.
  - Failure probe: 제목만 보고 판정하면 겹침을 놓친다 — 겹침 의심 노드(허브·css-disclosure·ui-state-motion-vocabulary)는 본문 대조를 장부에 인용으로 남긴다.
  - Commit: changeset `vi6-knowledge-consolidation` (README 절: step-1).

- [ ] **step-2 — knowledge 층 갱신 (흡수 집행)**
  - Artifact: 판정 "흡수/링크" 항목이 반영된 `knowledge/expressive-stack.md`·`knowledge/motion-references.md`(필요 시 신규 knowledge 문서 — 폴더당 ≤10 준수) + 각 문서 Changelog. KG 쪽 갱신 필요 항목은 plan finding 큐에 목록화.
  - Files: write `knowledge/expressive-stack.md`, `knowledge/motion-references.md`, (필요 시) `knowledge/` 신규 1~2파일. read step-1 장부.
  - Risk: 위험 (정본 문서 오염 — 기존 결정표 21행의 판정을 바꾸는 갱신은 사유 없이 금지, 추가·출처 보강만)
  - Dependencies: step-1
  - Verify: 장부의 흡수/링크 판정 전 항목이 문서에 반영(항목별 대조) · 모든 신규 인용에 출처 URL/경로+접근일 · 기존 결정표 행 무단 변경 0(diff 검토).
  - Failure probe: 흡수가 "KG 에 있음" 한 줄 링크로 끝나면 미소화(TC1 위반) — 문서 본문 판단 규칙에 실제 문구가 들어가야 인정.
  - Commit: changeset `vi6-knowledge-consolidation` (README 절: step-2).

- [ ] **step-3 — 통합 검증 + 파이프라인 반영 (VI6 마감)**
  - Artifact: `evidence/visual-impact-consolidation/vi6-knowledge.md` — 대조 전수성·흡수 집행·llms 파이프라인 포함 여부 증거. llms 산출에 knowledge 갱신이 반영되는 배선인지 확인(아니면 배선 실측 결과와 갭을 evidence 에 명기).
  - Files: write `evidence/visual-impact-consolidation/vi6-knowledge.md`. read llms 생성 배선(`docs/design-system/`·사이트 빌드 산출).
  - Risk: 없음 (검증·기록 중심)
  - Dependencies: step-1, step-2
  - Verify: 사이트 빌드 PASS(`examples/ui-vocabulary-site` build·lint) · llms 산출물 생성 확인 · evidence 문서에 18노드 전수 처리 결과 표.
  - Failure probe: knowledge/ 가 llms 배포 경로에 안 물려 있으면 "정본 갱신"이 에이전트에게 안 보인다 — 배선 여부를 실측하고, 미배선이면 갭으로 기록(수리는 VI8 또는 finding).
  - Commit: changeset `vi6-knowledge-consolidation` (README 절: step-3).

## 검증/DoD
- **DoD**: KG 18노드 전수 판정 장부 존재 + 흡수/링크 판정 전 항목 knowledge 문서 반영 + 빌드·린트 PASS + evidence 기록. 실배포 확인은 세션 말 push 후.
- **Evidence**: `evidence/visual-impact-consolidation/vi6-knowledge.md`
- **회귀 게이트**: 기존 결정표 행 무단 변경 0 · build·lint PASS.

## 연쇄 (승인 범위)
- **VI7 — 도구 층 배치**: toolshelf 15카드 → 4티어 배치·채택/보류/제외 판정(TC1 계약)·`shelf used` 기록. plan doc 은 착수 시 작성.
- **VI8 — 실증 확장**: VI7 채택 상위 2~3 기법 recipe 실구현 + presentation-slides three-scene 계약 상호 링크. plan doc 은 착수 시 작성(범위는 VI7 판정에 종속 — 아는 만큼만 펼침).

## 수치 출처
- KG 노드 수 18 = 핵심 15 + 인접 3 — `research/2026-07-28-visual-impact-goal-inventory.md` §갈래별 상세 1) (KG 레포 전수 grep 탐색 결과, 2026-07-28). 결정표 21행 = `knowledge/expressive-stack.md`(VI1 산출) 실측.

## finding 큐
- (실행 중 발견 항목을 여기 적는다 — KG 쪽 갱신 필요 항목 포함)
- KG hub 노드(`frontend-motion-accessibility-source-map`) sources 내부 참조 stale — `nodes/개발/디자인-구현/…`·`nodes/디자인/모션/…` 은 없는 경로 (실측 2026-07-28, 장부 §KG 쪽 후속)
- KG hub 도구 선택 절에 expressive-stack 참조 추가 검토 (정본 단일화 KG 측 절반)
- KG `ui-state-motion-vocabulary`·`css-disclosure-transition-pattern` review.state=unreviewed (외부 URL 네트워크 검증 미완) — KG 검수 큐
- 계수 정정: 인벤토리 "18노드"는 실제 19노드 (핵심 16+인접 3) — 장부는 19행 전수

## 진행 로그
- 2026-07-28 작성·승인 등록.
