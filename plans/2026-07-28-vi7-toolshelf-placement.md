# PLAN — VI7: 도구 층 배치

> 생성: 2026-07-28 · 갈래: 지식 자산화(문서+생성기 배선) · scope: toolshelf 비주얼 임팩트 카드 15건의 티어 배치·3분기 판정·정본 반영. goal `visual-impact-consolidation` 연쇄 2/3 — VI6 승인 영수증 `--chain VI7,VI8` 의 집행.
Status: approved (연쇄 승인 집행 — 새 사용자 소유 결정 없음, 기존 확정 계약 재사용)

## 북극성 → milestone → step (위계)
- **북극성**: Askewly Design (← `CLAUDE.md` 「북극성」 절) — "잡동사니 스크랩북이 되지 않는" 근거 기반 흡수 축.
- **goal**: `visual-impact-consolidation` · **milestone**: VI7 — 도구 층 배치.
- **리서치 입력**: `research/2026-07-28-visual-impact-goal-inventory.md` §2 (toolshelf 15카드) + `docs/design-system/absorption-criteria.md`(VI5 — 3분기 결정 규칙 + 15카드 중 6종 기판정: Motion=A완료 · GSAP=A대기 · react-bits/magicui/WebGL-Fluid=B · animated-grid-lines=C) + VI6 장부(`research/2026-07-28-vi6-kg-crosswalk.md`).

## Scope Boundary
- **포함**: ① 15카드 전수 판정 장부(4티어 배치 + 3분기 A/B/C + 사유 + 출처 URL) — 기판정 6종은 재확인·티어 배치만 ② 정본 반영: `absorption-criteria.md` 실측 표 행 추가/갱신 + `knowledge/` 필요 보강 ③ VI6 finding 해소: `scripts/generate-llms-txt.mjs` FIXED_ASSETS 에 `motion-principles.md`·`motion-references.md` 배선 ④ `shelf used` 기록 + 통합 검증.
- **제외**: A 판정 후보의 recipe 실구현(→VI8) · toolshelf 카드 신설·수정(카드는 읽기만, used 기록 제외) · KG 수정.
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / user_stopped
- rollback/cleanup: 문서·생성기 목록 변경만 — 커밋 revert 로 원복.

## 스캐폴딩 결정
- source-of-truth: 편입 판정 정본 = `docs/design-system/absorption-criteria.md` 실측 표 (VI5 운용 규칙 그대로 — 행 추가/갱신 + 근거 한 줄). 티어 배치 정본 = `knowledge/expressive-stack.md` 결정표.
- 검증: 장부 15카드 전수(빠짐 0) 기계 확인 + llms 재생성 후 motion-principles·motion-references 링크가 `public/llms.txt` 에 존재 + build·lint PASS.
- 배포/운영: push 는 세션 말 일괄 (VI6 과 동일).
- 자기선언 도메인 — **TC1 준수**: 판정은 문서 갱신으로만 인정(관찰만 = 미소화). 스타일 흡수 금지(공통 불변식) — 흡수는 원리·계약·판정 기준만.
- 검토 후 제외: 카드별 데모 실행(判定은 카드 메타+VI5 선례로 충분 — 실구동 검증은 VI8 recipe 단계) · 신규 외부 리서치.

## 결정 로그
- status: resolved
- **기존 확정 재사용**: 3분기 규칙·공통 불변식(VI5, 2026-07-17) · taste 흡수 계약(TC1) · goal 연쇄 승인(2026-07-28 "추천대로 ㄱㄱ").
- **기술 결정**: 기판정 6종은 재판정 아닌 티어 배치 보완 · llms 배선 해소를 이 milestone 에 배치(VI6 finding 소진 — knowledge 층 완결성이 이 milestone 의 capability).
- **새 사용자 소유 결정: 없음.**

## Step 트리

- [x] **step-1 — 15카드 전수 판정 장부**
  - Artifact: `research/2026-07-28-vi7-toolshelf-placement.md` — 카드 × (4티어 배치 | 3분기 A/B/C | 사유 | 출처 URL+접근일). 기판정 6종은 기존 판정 유지 여부 명시.
  - Files: write `research/2026-07-28-vi7-toolshelf-placement.md`. read toolshelf `cards/*.md`(해당 15), `docs/design-system/absorption-criteria.md`, `knowledge/expressive-stack.md`.
  - Risk: 없음 (분석 산출물)
  - Dependencies: 없음
  - Verify: 장부 15행 전수(카드명 grep 대조, 빠짐 0) · 3분기 외 값 없음 · 전 행 출처 URL.
  - Failure probe: 카드 설명만 보고 판정하면 티어 오배치 — 갤러리형(60fps·landing.love)과 코드형을 구분해 갤러리형은 티어 배치 아닌 "레퍼런스 소스" 표기.
  - Commit: changeset `vi7-toolshelf-placement` (README 절: step-1).

- [x] **step-2 — 정본 반영 + llms 배선**
  - Artifact: `absorption-criteria.md` 실측 표 갱신(행 추가/갱신+근거) · 필요 시 `knowledge/expressive-stack.md`·`motion-references.md` 보강(기존 행 무단 변경 금지) · `scripts/generate-llms-txt.mjs` FIXED_ASSETS Knowledge 절에 motion-principles·motion-references 등재.
  - Files: write `docs/design-system/absorption-criteria.md`, `scripts/generate-llms-txt.mjs`, (필요 시) `knowledge/expressive-stack.md`·`knowledge/motion-references.md`. read step-1 장부.
  - Risk: 위험 (생성기 수정 — llms 재생성 실행으로 즉시 검증, 실패 시 revert)
  - Dependencies: step-1
  - Verify: 장부 판정 전 행이 absorption-criteria 표에 반영 · `node scripts/generate-llms-txt.mjs` 성공 + `public/llms.txt` 에 motion-principles·motion-references 링크 존재.
  - Failure probe: FIXED_ASSETS 항목 형식(경로·설명 2요소) 안 맞으면 생성기 조용히 누락 — 재생성 후 grep 으로 실존 확인.
  - Commit: changeset `vi7-toolshelf-placement` (README 절: step-2).

- [ ] **step-3 — shelf used 기록 + 통합 검증 (VI7 마감)**
  - Artifact: toolshelf `used` 기록(이번에 실제 참조한 카드) + `evidence/visual-impact-consolidation/vi7-placement.md`(판정 집계·배선 확인·회귀 게이트).
  - Files: write `evidence/visual-impact-consolidation/vi7-placement.md`. 실행: `python3 ~/projects/toolshelf/bin/shelf.py used <name> --ok`.
  - Risk: 없음 (기록·검증)
  - Dependencies: step-1, step-2
  - Verify: build·lint PASS(examples/ui-vocabulary-site) · llms.txt 링크 2건 grep · evidence 에 15카드 집계 표.
  - Failure probe: shelf used 는 toolshelf 레포 상태 변경 — 실행 실패해도 milestone 을 막지 않되 사유를 evidence 에 기록.
  - Commit: changeset `vi7-toolshelf-placement` (README 절: step-3).

## 검증/DoD
- **DoD**: 15카드 전수 판정 장부 + absorption-criteria 표 반영 + 4티어 배치 + llms 에 knowledge 3문서 전부 배선 + `shelf used` 기록 + build·lint PASS.
- **Evidence**: `evidence/visual-impact-consolidation/vi7-placement.md`
- **회귀 게이트**: llms 재생성 성공 · build·lint PASS · absorption-criteria 기존 행 의미 변경 없음(갱신은 근거 병기).

## 수치 출처
- 카드 수 15 = `research/2026-07-28-visual-impact-goal-inventory.md` §2 (toolshelf recall 전수, 2026-07-28). 기판정 6종 = `docs/design-system/absorption-criteria.md` 실측 표(2026-07-17) 대조.

## 연쇄 (승인 범위)
- **VI8 — 실증 확장**: 이 milestone 의 A 판정 상위 2~3 기법 recipe 실구현. plan doc 은 착수 시 작성.

## finding 큐
- (실행 중 발견 항목을 여기 적는다)

## 진행 로그
- 2026-07-28 작성 (연쇄 집행 — VI6 완료 직후).
