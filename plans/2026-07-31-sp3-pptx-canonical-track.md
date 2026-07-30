# PLAN — SP3: PPTX 파이프라인 정본화 (슬라이드 파이프라인 업그레이드)

> 생성: 2026-07-31 · 갈래: changeset(cross-repo — custom-skills) + methodology(본 레포) · scope: goal `slide-pipeline-upgrade` 연쇄 3/3.
Status: approved (연쇄 승인 — SP2 승인 시 chain 영수증 sp3 등록, 2026-07-31. 새 사용자 소유 결정 없음 — "pptxgenjs 단일 경로 정본화" 사용자 확정 2026-07-31)

## 북극성 → milestone → step (위계)
- **북극성**: Askewly Design — 발표 매체 판.
- **goal**: `slide-pipeline-upgrade` 연쇄 3/3. 방향: HTML/PDF 우선 유지 + PPTX 필요 시 정본 경로 = pptxgenjs 단일 (SL3 "중단"의 좁히기 — 사용자 확정).
- **리서치 입력**: SP1 랩 `decks/claude-ppt-lab/scripts/export-pptx.mjs`(팔레트 파라미터화 실증) + SL3 `decks/askewly-design-intro/export/html2pptx.mjs`(원형) + SP2 custom 테마 트랙.

## Scope Boundary
- **포함**: ① 스킬 export 트랙 `templates/export-pptx.mjs`(테마 자동 판독: canonical 팔레트 + custom theme.json — 레이아웃 매핑 6종 + 미지원 레이아웃 카드 폴백, pptxgenjs 의존성은 raster-pdf 의 playwright 해석 패턴 준용) ② SKILL.md·verification.md PPTX 트랙 등재 + ui-dictionary `methodology/slide-production.md` 결정표 갱신(중단→pptxgenjs 정본) ③ Askewly 스타일 실증(askewly-design-intro 덱 재산출 + python-pptx·COM 검증) + 배포.
- **제외**: ppt-master 경로 부활 · PPTX 차트 외 인터랙티브(three-scene 등) 네이티브 변환(폴백 처리) · PDF 트랙 변경.
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / user_stopped
- rollback/cleanup: custom-skills 커밋 revert + 재배포. exporter 는 opt-in 스크립트(기존 덱 무접촉).

## 스캐폴딩 결정
- source-of-truth: PPTX 팔레트 = theme.mjs THEME_ROOTS(canonical)/content/theme.json(custom)에서 **판독**(중복 하드코딩 금지 — SL3·SP1 스크립트는 하드코딩이었다, 이번에 해소). 레이아웃 매핑 계약 = exporter 내 명시 + 미지원 레이아웃은 카드 폴백 + stderr 고지.
- 검증: fixture 기반 export 스모크(custom-theme-smoke + theme-askewly-smoke 에서 PPTX 산출) + python-pptx 구조 검증 + PowerPoint COM 실개봉(SP1 박제 스크립트 재사용) + 기존 fixture 무회귀 + 배포 정합.
- 배포/운영: setup.sh 단일 배포 (커밋 가드가 강제).
- 자기선언 — export 계약: 차트는 `addChart` 네이티브만(이미지 폴백 금지 — 실패 시 에러) · 텍스트는 AUTO_SHAPE/텍스트박스(비트맵 금지) · 산출물은 파생(손편집 금지·재생성 전용) 헤더 명기 · CSS 전용 값(color-mix·gradient)은 PPTX 로 못 가므로 hex 근사 규칙 명시(gradient→시작색, color-mix→비율 근사).
- 검토 후 제외: PPTX 마스터/템플릿(defineSlideMaster) 도입 — 수요 실증 전 과잉 · speaker notes 외 애니메이션.

## 결정 로그
- status: resolved
- **PPTX 정본 경로 = pptxgenjs 단일** — 사용자 확정 2026-07-31 (SL3 중단의 좁히기).
- **methodology 정정 방식 = 결정표 갱신 + 이력 보존** — §2 "중단" 결론은 record 로 두고 정정 기록 추가(record 동결 원칙).
- **새 사용자 소유 결정: 없음** (레이아웃 매핑 범위·근사 규칙은 튜닝값).

## Step 트리

- [ ] **step-1 — 스킬 export 트랙 (templates/export-pptx.mjs)**
  - Artifact: 신규 `templates/export-pptx.mjs` — 덱 cwd 기준(`content/slides.json`+테마 판독), 레이아웃 매핑(cover·closing·hero-cards/summary-grid 카드 공통·comparison-2col·step-flow·chart-interactive 네이티브 차트) + 미지원 레이아웃 카드 폴백·고지, pptxgenjs 해석은 export-raster-pdf.mjs 의 playwright 패턴 준용, CSS 전용 값 hex 근사. + 산출물 파생 헤더.
  - Files: write custom-skills templates/export-pptx.mjs. read templates/export-raster-pdf.mjs(의존성 패턴)·decks/claude-ppt-lab/scripts/export-pptx.mjs(원형)·templates/src/theme.mjs.
  - Risk: 위험 (신규 파일이지만 theme 판독 계약 결합 — fixture 스모크로 격리)
  - Dependencies: 없음
  - Verify: custom-theme-smoke·theme-askewly-smoke 두 fixture 에서 PPTX 산출 + python-pptx 로 차트/텍스트/이미지0 구조 확인.
  - Failure probe: THEME_ROOTS 는 CSS 문자열이라 파싱 필요 — `--var: value;` 정규식 판독이 color-mix/gradient 를 만나면 hex 근사 규칙 적용(시작색 추출). 근사 불가 값은 기본 무채색이 아니라 에러로 표면화.
  - Commit: changeset `20260731-sp3-pptx-canonical-track` (custom-skills, README 절: step-1).
- [ ] **step-2 — 문서 정본화 (스킬 + methodology)**
  - Artifact: SKILL.md description·§7·G7 에 PPTX 트랙 등재(3-format: HTML/PDF 2트랙/PPTX) + verification.md export 절 갱신 + ui-dictionary `methodology/slide-production.md` 3-format export 결정표를 "PPTX = pptxgenjs 단일 정본 경로(스킬 export-pptx.mjs)"로 갱신 — §2 실측 결론(중단)은 record 보존, 정정 기록 추가(2026-07-31 사용자 확정 근거 링크).
  - Files: write custom-skills SKILL.md·references/verification.md + ui-dictionary methodology/slide-production.md.
  - Risk: 없음 (문서만)
  - Dependencies: step-1
  - Verify: SKILL.md/reference 중복 없음 + methodology 정정이 이력 보존 형태(기존 문구 삭제 아님).
  - Failure probe: SKILL.md 라우팅 문구("편집 가능한 PPTX가 핵심이면 ppt 스킬")와 충돌 — PPTX 트랙 등재에 맞춰 라우팅 문구를 "슬라이드 덱 PPTX 는 이 스킬 export 트랙, 문서형 PPTX 제작은 ppt 스킬"로 정정.
  - Commit: changeset 동일 (README 절: step-2) + ui-dictionary `docs(sp3)`.
- [ ] **step-3 — Askewly 스타일 실증 + 배포 (SP3 마감)**
  - Artifact: 배포 후 배포본 exporter 로 `decks/askewly-design-intro` 재산출(askewly 테마 판독 검증) + `decks/claude-ppt-lab/topic-deck`(custom 테마) 재산출 → python-pptx 구조 검증 + COM 실개봉(SP1 `open-verify-pptx.ps1` 재사용) + evidence.
  - Files: write decks/askewly-design-intro/export/askewly-design-intro.skill-track.pptx·decks/claude-ppt-lab/pptx/*·evidence/slide-pipeline/sp3-pptx-canonical.md. 실행: 배포+node+python+COM.
  - Risk: 위험 (PowerShell COM — try/finally Quit)
  - Dependencies: step-1, step-2
  - Verify: 두 덱 PPTX python-pptx(has_chart·pictures 0) + COM Opened·Workbook 접근 PASS + 기존 fixture 무회귀.
  - Failure probe: askewly 덱에 hero-motion 등 미지원 레이아웃 존재 — 카드 폴백 경로가 실제로 동작하는지 이 덱이 검증한다(폴백 고지 stderr 확인).
  - Commit: changeset 동일 (README 절: step-3) + ui-dictionary `docs(sp3)` 마감 커밋.

## 검증/DoD
- **DoD**: pptxgenjs 단일 경로가 스킬 정식 export 트랙(테마 판독·폴백 계약)으로 배포되고, methodology 결정표가 정정(이력 보존)되며, Askewly·custom 두 테마 실증 PPTX 가 구조 검증+COM 실개봉을 통과한다.
- **Evidence**: `evidence/slide-pipeline/sp3-pptx-canonical.md`
- **회귀 게이트**: 기존 fixture·PDF 2트랙 무접촉, smoke 무회귀.

## 수치 출처
- 원형 스크립트·검증 절차 = SP1 evidence (`evidence/slide-pipeline/sp1-video-lab.md`).

## 재생성 장벽
- step-3 배포 후 배포본 검증 (커밋 가드가 배포를 커밋 시점에 강제 — SP2 관측).

## finding 큐
- (비어 있음 — 실행 중 append)

## 진행 로그
- 2026-07-31 작성 — SP2 완료 경계에서 연쇄 개설 (chain 영수증 sp3).
