# PLAN — SP1: 영상 재현 랩 (슬라이드 파이프라인 업그레이드)

> 생성: 2026-07-31 · 갈래: 재현 실험 + 판정 장부 (본 레포) · scope: goal `slide-pipeline-upgrade` 연쇄 1/3.
Status: approved (2026-07-31 사용자 승인 "ㄱㄱ" — 연쇄 SP2·SP3 제시됨)

## 북극성 → milestone → step (위계)
- **북극성**: Askewly Design (← `CLAUDE.md` 「북극성」 절) — "화면 UI 전용 시스템에서 → 매체를 가로지르는 디자인 총괄 시스템으로" 축의 발표 매체 판.
- **goal**: `slide-pipeline-upgrade` — 유튜브 aITV54CLc_U(클로드 PPT 5단계, 150만 조회) 방법을 등가 재현해 검증하고, 흡수분으로 presentation-slides-yusung HTML 트랙을 업그레이드하며 PPTX(pptxgenjs) 파이프라인을 정본화한다. 워크트리 병합 전 마감 (사용자 방향 2026-07-31).
  - SP1 (이 계획서): 영상 재현 랩 — 5단계 등가 재현 + 네이티브 차트 PPTX 실개봉 검증 + 충실도 장부·흡수 판정
  - SP2 (연쇄 2/3): HTML 트랙 스킬 업그레이드 — SP1 채택분 구현 (후보: 브랜드 DESIGN.md→테마 변환 · 1장 캘리브레이션 절차 · 비교쌍 교정 · 리디자인 입력 트랙)
  - SP3 (연쇄 3/3): PPTX 파이프라인 정본화 — pptxgenjs 단일 경로를 스킬 export 트랙으로 승격 + methodology 갱신 + Askewly 스타일 실증
- **리서치 입력**: `research/2026-07-31-claude-ppt-video-analysis.md` — 5단계 워크플로우 표·우리 자산 대조표(흡수 후보 4건)·getdesign.md 실접속 확인(Google DESIGN.md 스펙, 약 75개 공개). 스크립트 원문 `research/sources/claude-ppt-aITV54CLc_U.transcript.md`.

## Scope Boundary
- **포함**: ① getdesign.md MiniMax DESIGN.md 실확보 + PPT용 커스터마이즈(영상 ①②) ② 1장 캘리브레이션 루프 + 스타일 프리셋 박제(영상 ③④, Claude Code 등가) ③ 주제 생성 + 리디자인 입력 2모드 본생산, pptxgenjs 네이티브 차트 PPTX + PowerPoint 실개봉·차트 편집 가능성 검증(영상 ⑤) ④ 충실도 장부 + 흡수 후보 4건 채택/보류 판정.
- **제외**: claude.ai 웹 프로젝트 실사용(등가 재현으로 확정 — 사용자 2026-07-31) · 스킬 소스 수정(SP2) · methodology 갱신(SP3) · Askewly 스타일 전환(SP3에서 실증).
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / user_stopped
- rollback/cleanup: 랩 산출물은 `decks/claude-ppt-lab/` 폴더 단위 — 실패 시 폴더 삭제로 원복(레포 기존 자산 무접촉). 스킬·methodology 무수정.

## 스캐폴딩 결정
- source-of-truth: 랩 덱 원본 = `decks/claude-ppt-lab/content/slides.json`(스킬 계약 준수) · 스타일 정본 = MiniMax DESIGN.md 원문(`research/sources/`) + 커스터마이즈 프리셋(`decks/claude-ppt-lab/style-preset.md`) · 판정 정본 = 충실도 장부(evidence).
- 검증: 스킬 표준(validate·build·overflow) + Chrome 실렌더 스크린샷(캘리브레이션 루프) + PPTX는 python-pptx 구조 검증(네이티브 CHART·AUTO_SHAPE) + PowerPoint COM 실개봉(SL3 확립 경로).
- 배포/운영: 배포 없음 — 본 레포 랩 산출물만. 스킬 배포는 SP2/SP3.
- 자기선언 — 재현 충실도 계약: 영상 5단계 각각에 등가 치환을 1:1 매핑하고 장부에 "영상 주장 / 재현 결과 / 편차" 3열로 기록 · 외부 인용(영상 주장·getdesign.md)은 출처 URL+접근일 명기 · MiniMax 브랜드 자산은 재현 실험 한정 사용(최종 아이덴티티 복사 금지 — CLAUDE.md 「하지 않는 것」).
- 검토 후 제외: ppt-master(SVG→DrawingML) 경로 재검증(SL3에서 비교 완료 — pptxgenjs 확정) · 영상 외 다른 PPT 유튜브 방법론 추가 수집(1건 재현 먼저).

## 결정 로그
- status: resolved
- **재현 환경 = Claude Code 등가 재현** — 사용자 확정 2026-07-31 (AskUserQuestion). claude.ai 웹 프로젝트 대신 5단계를 등가 치환: 프로젝트 지침 박제 → 스타일 프리셋 파일.
- **PPTX 방향 = pptxgenjs 단일 경로 정본화** — 사용자 확정 2026-07-31. SL3 "중단" 결정의 철회가 아니라 좁히기: HTML/PDF 우선 유지 + PPTX 필요 시 정본 경로를 스킬 트랙으로 승격(SP3).
- **재현 스타일 = 영상 그대로 MiniMax → Askewly 전환** — 사용자 확정 2026-07-31. SP1은 MiniMax(충실도 판정), Askewly 전환은 SP3.
- **새 사용자 소유 결정: 없음** (테스트 주제·리디자인 입력 소재 선택은 튜닝값 — 기존 자산 재사용 우선).

## Step 트리

- [x] **step-1 — 스타일 확보 + 프롬프트 커스터마이즈 (영상 ①②)**
  - Artifact: MiniMax DESIGN.md 원문 저장(`research/sources/minimax-design-md.md`, 출처 URL+접근일) + PPT용 커스터마이즈 프리셋 초안(`decks/claude-ppt-lab/style-preset.md` — Pretendard·로고 자리·16:9·챕터명/제목/부제목 위치 고정·본문 밀도 규칙, 영어 프롬프트 본문).
  - Files: write research/sources/minimax-design-md.md, decks/claude-ppt-lab/style-preset.md. read research/2026-07-31-claude-ppt-video-analysis.md.
  - Risk: 없음 (신규 파일만)
  - Dependencies: 없음
  - Verify: DESIGN.md 원문이 Google 스펙 구조(색·타입·간격·컴포넌트+rationale)로 확보되고, 프리셋에 영상 ② 필수 3요소(폰트·로고·비율)+레이아웃 규칙이 전부 반영됨.
  - Failure probe: getdesign.md 페이지가 JS 렌더라 WebFetch로 본문이 안 잡히면 → chrome-ext 브라우저로 실접속 복사. 그래도 실패면 blocked 기록(대체: 공개 DESIGN.md 스펙 예시로 등가 구성 — 편차 장부 기록).
  - Commit: `feat(sp1): step-1 — MiniMax DESIGN.md 확보 + PPT 커스터마이즈 프리셋`
- [x] **step-2 — 1장 캘리브레이션 루프 + 프리셋 박제 (영상 ③④)**
  - Artifact: 테스트 주제 1장 덱(`decks/claude-ppt-lab/` — 스킬 템플릿 복사, slides.json 1장) 생성 → Chrome 스크린샷 → 프리셋 대비 편차 교정 ≥2회 왕복(제목/부제 간격·본문 위치·로고/넘버링 위치 — 영상의 교정 항목 재현) → 확정 프리셋 v1 박제. 교정 전/후 스크린샷 보존.
  - Files: write decks/claude-ppt-lab/**(스킬 표준 구조), decks/claude-ppt-lab/style-preset.md(v1 확정), evidence용 스크린샷. 실행: 빌드+Chrome.
  - Risk: 없음 (랩 폴더 한정)
  - Dependencies: step-1
  - Verify: validate·build·overflow PASS + 교정 루프 전/후 스크린샷 쌍 ≥2 + 최종 1장이 프리셋 규칙(위치 고정·밀도) 충족.
  - Failure probe: 교정을 말로만 기록하면 재현 불가 — 각 왕복마다 "지시문 → 반영 diff → 스크린샷"을 남긴다. 스킬 3테마에 MiniMax 색이 없어 하드코딩 유혹 → 덱 로컬 토큰(css 변수)으로 격리, 스킬 소스 무접촉.
  - Commit: `feat(sp1): step-2 — 1장 캘리브레이션 루프 + 스타일 프리셋 v1`
- [ ] **step-3 — 본생산 2모드 덱 생성 (영상 ⑤ 전반)**
  - Artifact: (a) 주제 입력 모드: 차트 포함 주제로 5~7장 덱 생성(HTML 정본) (b) 리디자인 모드: 기존 저품질 소스 1건(구 덱 PDF 또는 마크다운 자료)을 프리셋 스타일로 재생성. 둘 다 `decks/claude-ppt-lab/` 하위, 스킬 표준 구조.
  - Files: write decks/claude-ppt-lab/content/**, 생성 HTML. read decks/askewly-design-intro/(구조 참고). 실행: node 빌드+Chrome.
  - Risk: 없음 (랩 폴더 한정)
  - Dependencies: step-2
  - Verify: 두 덱 validate·build·overflow PASS + Chrome 실렌더 스크린샷(프리셋 규칙 준수).
  - Failure probe: 리디자인 입력 소스가 마땅치 않으면 임의 제작 유혹 — 실존 저품질 소스(레포 내 구 자료 또는 사용자 제공)를 쓰고 출처를 장부에 남긴다. 없으면 마크다운 보고서 1건을 소스로 지정하고 그 사실 명기.
  - Commit: `feat(sp1): step-3 — 본생산 2모드 덱 생성 (주제 입력·리디자인)`
- [ ] **step-4 — 네이티브 차트 PPTX export + 실개봉 검증 (영상 ⑤ 후반)**
  - Artifact: step-3 두 덱을 pptxgenjs로 PPTX 산출(`decks/askewly-design-intro/export/html2pptx.mjs` 재사용 — AUTO_SHAPE 텍스트+네이티브 `addChart`) + python-pptx 구조 검증 + PowerPoint COM 실개봉 스크립트 **신규 작성**(SL3는 즉석 명령이었음 — 이번에 박제).
  - Files: write decks/claude-ppt-lab/pptx/**, decks/claude-ppt-lab/scripts/open-verify-pptx.ps1(신규). read decks/askewly-design-intro/export/html2pptx.mjs. 실행: node·python·PowerShell COM.
  - Risk: 위험 (PowerShell COM — PowerPoint 프로세스 기동·종료 관리)
  - Dependencies: step-3
  - Verify: **자동 판정 기준 명시** — python-pptx `shape.has_chart` ≥1 + COM에서 `Shape.HasChart` 및 `Chart.ChartData.Workbook` 접근 성공(=엑셀 데이터 연동 존재)이면 PASS. GUI 더블클릭 편집 UX 자체는 자동화 대상이 아님 — 사용자 관측 항목으로 장부에 분리 기록(미관측 시 해당 항목 partial).
  - Failure probe: 차트가 이미지로 떨어지면 영상 결정타 재현 실패 — `addChart` 경로 확인(이미지 폴백 금지). COM은 try/finally Quit으로 프로세스 잔존 방지(일반 위생 — SL3 기록 결함 아님).
  - Commit: `feat(sp1): step-4 — PPTX export + COM 실개봉 검증 스크립트`
- [ ] **step-5 — 충실도 장부 + 흡수 판정 (SP1 마감)**
  - Artifact: `evidence/slide-pipeline/sp1-video-lab.md` — 영상 5단계 × "영상 주장 / 재현 결과 / 편차" 장부 + 흡수 후보 4건(브랜드 DESIGN.md 테마 변환 · 1장 캘리브레이션 · 비교쌍 교정 · 리디자인 입력) 채택/보류 판정(각 근거 1줄) → SP2/SP3 scope 입력으로 백링크.
  - Files: write evidence/slide-pipeline/sp1-video-lab.md, plans/(이 문서 finding 큐·진행 로그).
  - Risk: 없음 (장부 문서만)
  - Dependencies: step-4
  - Verify: 장부에 5단계 전부 편차 포함 기록 + 4건 전부 판정 존재(미판정 0) + 출처 URL·접근일 전건.
  - Failure probe: "재현 성공"만 적고 편차를 생략하면 SP2 설계가 영상 주장 위에 선다 — 편차 열이 비면 FAIL로 간주하고 재검.
  - Commit: `docs(sp1): step-5 — 충실도 장부 + 흡수 판정, SP1 마감`

## 검증/DoD
- **DoD**: 영상 5단계가 Claude Code 등가로 전부 재현되고(편차 명기), 네이티브 차트 PPTX가 PowerPoint 실개봉·차트 편집 확인까지 통과하며, 흡수 후보 4건의 채택/보류 판정이 장부로 남아 SP2/SP3 scope 를 결정한다.
- **Evidence**: `evidence/slide-pipeline/sp1-video-lab.md`
- **회귀 게이트**: 스킬 소스·기존 덱·methodology 무접촉 (git diff 로 확인).

## 수치 출처
- 영상 5단계·타임스탬프·주장 = `research/sources/claude-ppt-aITV54CLc_U.transcript.md` (자동 자막, 접근일 2026-07-31). 브랜드 "미니맥스(MiniMax)"는 자막 [02:01] 한글 표기 — getdesign.md 실제 항목 존재는 step-1에서 확인(부재 시 failure probe 대체 경로).
- getdesign.md 스펙·규모 = `research/2026-07-31-claude-ppt-video-analysis.md` §4 (실접속 2026-07-31).

## 재생성 장벽
- 없음 (배포·출고 없음 — 랩 한정).

## finding 큐
- (비어 있음 — 실행 중 append)

## 진행 로그
- 2026-07-31 작성 — 사용자 방향("병합 전 스킬 업그레이드 + PPT 파이프라인 명확화") + 결정 3건 확정(등가 재현·pptxgenjs 정본화·MiniMax→Askewly) 후 goal 개설.
