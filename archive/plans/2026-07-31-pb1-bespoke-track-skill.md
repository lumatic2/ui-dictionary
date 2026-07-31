# PLAN — PB1: PPTX bespoke 트랙 정식화 (스킬 측)

> 생성: 2026-07-31 · 갈래: changeset(cross-repo — custom-skills) · scope: goal `pptx-bespoke` 1/2.
Status: approved (사용자 "ㄱㄱ" 2026-07-31 — 결정 3건 AskUserQuestion·"B" 확정, fresh 검증자 6건 반영 후 승인)

## 북극성 → milestone → step (위계)
- **북극성**: Askewly Design — 발표 매체 판 (`CLAUDE.md` 「북극성」 절).
- **goal**: `pptx-bespoke` — PPTX 고품질 트랙. SP3 범용 매퍼는 뼈대(빠른 파생)로 유지하고, 고품질 덱은 영상(aITV54CLc_U) 방식대로 **덱 전용 pptxgenjs 코드를 생성 + 산출물을 보며 미세조정**하는 트랙을 정식화한다. 배경: 범용 매퍼 산출물이 영상 대비 품질 미달(사용자 관측 2026-07-31) — 원인은 ① 고정 기하 범용 매퍼 ② 그라디언트·그림자 등 표현 의도적 삭감 ③ PPTX 시각 캘리브레이션 0회.
- **리서치 입력**: SP1 랩(`research/2026-07-31-claude-ppt-video-analysis.md` — 5단계 중 3단계 "1장 미세조정"이 이 트랙의 원형) + `decks/claude-ppt-lab/style-preset.md` 캘리브레이션 로그(HTML 트랙 3라운드 수렴 실증) + SP3 `templates/export-pptx.mjs`(테마 판독 계약).

## Scope Boundary
- **포함**: ① PPTX 시각 자기검사 기계장치 — PowerPoint COM `Slide.Export` PNG 스크립트를 스킬 `scripts/` 에 박제(캘리브레이션 루프의 눈) ② bespoke 트랙 계약 문서 `references/pptx-bespoke.md`(입력·표현 레시피·미세조정 루프 절차) + SKILL.md 라우팅(범용 매퍼=빠른 파생 / bespoke=고품질) + verification.md 시각 게이트 등재 ③ 배포.
- **제외**: 범용 매퍼(export-pptx.mjs) 자체의 표현 강화(A안 — 이번 goal 범위 밖) · PDF/HTML 트랙 변경 · PPTX 마스터(defineSlideMaster) 도입.
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / user_stopped
- rollback/cleanup: custom-skills 커밋 revert + 재배포. 신규 스크립트·문서는 opt-in(기존 트랙 무접촉).

## 스캐폴딩 결정
- source-of-truth: bespoke 트랙 계약 정본 = `references/pptx-bespoke.md` 단일. 팔레트·폰트는 SP3 과 동일하게 theme.mjs/theme.json **판독**(하드코딩 금지 유지). 품질 기준 이미지 = **같은 덱의 HTML 렌더 스크린샷**(사용자 확정 2026-07-31).
- 검증: 캘리브레이션 스크립트는 기존 fixture PPTX 에서 PNG 실산출로 검증(파일 존재+에이전트 육안 판독 가능) + COM 프로세스 잔존 0 + 배포 출고 정합.
- 배포/운영: setup.sh 단일 배포(커밋 가드가 강제).
- 자기선언 — bespoke 계약: bespoke 코드는 **덱 로컬 파생 코드**(`decks/<deck>/tools/export-pptx-bespoke.mjs`) — 스킬은 계약·레시피·루프 절차만 소유하고 코드는 덱마다 생성한다(영상 방식의 본질) · SP3 export 계약 계승: 차트 addChart 네이티브만·텍스트 비트맵 금지·산출물 파생(손편집 금지) · 표현 레시피 최소 수록: shadow(outerShadow)·2톤 그라디언트 근사(pptxgenjs 는 gradient fill 미지원 — 근거: 로컬 node_modules/pptxgenjs 타입 정의·소스에 gradient 부재, 실측 2026-07-31, step-2 작성 시 공식 문서로 재확인 — 레이어드 도형/분할 블록으로 근사)·액센트 바·타이포 스케일·레이아웃별 아트디렉션(고정 기하 금지) · 미세조정 루프 = PNG 산출→기준(HTML 스크린샷) 비교→코드 조정, **라운드 상한 5**(초과 시 blocked 보고, 튜닝값) · 표현 불가 항목은 편차 장부에 기록(침묵 근사 금지).
- 검토 후 제외: LibreOffice headless 변환(PNG 산출 대체 경로) — PowerPoint COM 이 실렌더와 동일 엔진이라 우월 · 픽셀 diff 자동 판정 — 기준이 "근접"이지 픽셀 일치가 아니라 에이전트 육안+장부가 정합.

## 결정 로그
- status: resolved
- **품질 기준 = HTML 렌더 근접** — 사용자 확정 2026-07-31 (AskUserQuestion). 같은 덱 HTML 스크린샷이 기준 이미지.
- **실증 덱 = askewly-design-intro** — 사용자 확정 2026-07-31 (PB2 에서 소비).
- **A안(범용 매퍼 강화) 아닌 B안(bespoke 트랙) 채택** — 사용자 확정 2026-07-31 ("B").
- bespoke 코드 위치=덱 로컬 `tools/`·라운드 상한 5 = 튜닝값(에이전트 결정, 기록만).

## Step 트리

- [x] **step-1 — 시각 자기검사 기계장치 (pptx-to-png)**
  - Artifact: 신규 custom-skills `scripts/pptx-to-png.ps1` — PowerPoint COM 으로 PPTX 를 열어 슬라이드별 PNG export(전장 또는 `-Slides 1,3` 선택), try/finally Quit + ReleaseComObject, 프로세스 잔존 검사. SP1 `open-verify-pptx.ps1` 에서 준용 가능한 것은 **COM 열기/닫기 예외처리 골격뿐** — `Slide.Export` PNG API(시그니처·해상도 파라미터)는 이 레포에 실증 전례가 없어 step-1 에서 신규 조사·실증한다. + `references/verification.md` 에 "PPTX 시각 게이트(PNG vs HTML 스크린샷 비교)" 절 등재.
  - Files: write custom-skills `promoted/presentation-slides-yusung/scripts/pptx-to-png.ps1`·`references/verification.md`. read `decks/claude-ppt-lab/scripts/open-verify-pptx.ps1`(COM 원형).
  - Risk: 위험 (PowerShell COM — try/finally Quit 필수, 잔존 프로세스)
  - Dependencies: 없음
  - Verify: 기존 실증 PPTX(askewly-design-intro.skill-track.pptx)에서 PNG 실산출 → 파일 존재 + Read 로 육안 판독 가능 확인 + PowerPoint 프로세스 잔존 0.
  - Failure probe: `Slide.Export` 가 보호 모드/추가 프롬프트로 블록될 수 있음 — ReadOnly+WithWindow:$false 열기로 회피, 실패 시 에러 표면화(조용한 빈 산출 금지). 한글 경로 인자 인코딩 확인.
  - Commit: changeset `20260731-pb1-bespoke-track-skill` (custom-skills, README 절: step-1).
- [x] **step-2 — bespoke 트랙 계약 문서화 + 라우팅 + 배포**
  - Artifact: 신규 `references/pptx-bespoke.md` — ① 입력 계약(slides.json + theme 판독 + HTML 렌더 스크린샷=기준) ② 표현 레시피(shadow·2톤 그라디언트 근사·액센트 바·타이포 스케일·레이아웃별 아트디렉션 — MiniMax 캘리브레이션에서 얻은 편차 유형 반영) ③ 미세조정 루프 절차(pptx-to-png → 기준 비교 → 조정, 라운드 상한 5, 라운드 장부 양식) ④ SP3 export 계약 계승 조항 ⑤ 편차 장부 양식. + SKILL.md 에 트랙 등재(범용 export-pptx.mjs=빠른 파생 / bespoke=고품질, 진입 조건) + `templates/export-pptx.mjs` 헤더에 상호 참조 1줄. + setup.sh 배포.
  - Files: write custom-skills `references/pptx-bespoke.md`·`SKILL.md`·`templates/export-pptx.mjs`(헤더 1줄). read `decks/claude-ppt-lab/style-preset.md`(캘리브레이션 로그)·`research/2026-07-31-claude-ppt-video-analysis.md`.
  - Risk: 없음 (문서 + 헤더 1줄)
  - Dependencies: step-1
  - Verify: SKILL.md/references 중복 없음 + 배포 출고 정합(커밋 가드) + 배포본에 스크립트·문서 존재.
  - Failure probe: SKILL.md 의 **실제 라우팅 절**(작성 시점에 grep 으로 현행 문구 확인 — 계획의 인용은 의역)과 충돌하지 않게 — 트랙 2단(범용/bespoke)으로 세분화만, 스킬 경계(슬라이드 덱=이 스킬/문서형=ppt 스킬)는 불변.
  - Commit: changeset 동일 (README 절: step-2).

## 검증/DoD
- **DoD**: PPTX 시각 자기검사 스크립트와 bespoke 트랙 계약 문서가 스킬에 배포되고, 기존 실증 PPTX 에서 PNG 산출이 실동작(육안 판독 + 프로세스 잔존 0)하며, SKILL.md 라우팅이 2단 트랙을 안내한다.
- **Evidence**: `evidence/slide-pipeline/pb1-bespoke-track.md`
- **회귀 게이트**: 기존 export 트랙(범용 PPTX·PDF 2트랙)·smoke 무접촉.

## 수치 출처
- 캘리브레이션 라운드 수렴 실증(3라운드) = `decks/claude-ppt-lab/style-preset.md` 로그.

## 재생성 장벽
- step-2 배포 후 배포본 검증(커밋 가드가 배포를 커밋 시점에 강제).

## finding 큐

## 진행 로그
- 2026-07-31 작성 — 사용자 B안 확정, 품질 기준·실증 덱 AskUserQuestion 확정.
