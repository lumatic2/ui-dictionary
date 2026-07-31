# PLAN — HU1: 발표 운영력 (스피커 뷰·단일 파일 배포·PDF 노트)

> 생성: 2026-07-31 · 갈래: changeset(cross-repo — custom-skills) · scope: goal `html-upgrade` 1/3.
Status: approved (사용자 "ㄱㄱ" 2026-07-31 — fresh 검증자 2회 발견 7건 반영 후 일괄 승인, chain hu1→hu2→hu3→hu4)

## 북극성 → milestone → step (위계)
- **북극성**: Askewly Design — 발표 매체 판 (`CLAUDE.md` 「북극성」 절).
- **goal**: `html-upgrade` — HTML 발표 트랙 업그레이드. 배경(사용자 2026-07-31): 해커톤·강의 현장에서 HTML 덱 실사용 관측 — "퀄리티만 충분히 올리면 매력적인 자산". 리서치 격차 판정(§4)에서 **발표 운영력이 현행 최대 공백**: 덱은 잘 만들어지는데 발표 *현장*을 위한 장치(발표자 노트 보기·오프라인 배포·노트 딸린 인쇄본)가 없다.
- **리서치 입력**: `research/2026-07-31-html-upgrade-goal-refs.md` §2-2(reveal.js Speaker View)·§2-3(showNotes)·§2-4(단일 파일 base64 인라인, remark 철학).

## Scope Boundary
- **포함**: ① 스피커 뷰 — `S` 키로 별도 창(현재/다음 슬라이드 미리보기 + 발표자 노트 + 경과 타이머), 메인 창과 양방향 동기 ② 단일 파일 오프라인 export(`export-standalone.mjs` — CSS/JS/이미지/폰트 base64 인라인, 산출물 = 독립 html 1개) ③ PDF export 노트 옵션(`--notes` — 노트 별도 페이지) ④ SKILL.md·verification.md 등재 + 배포.
- **제외**: 리모컨 하드웨어 매핑(미확인 항목 — 표준 화살표 키만) · 발표 녹화 · 모션/레이아웃 변경(HU2) · 실증 덱 적용(HU3).
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / user_stopped
- rollback/cleanup: custom-skills 커밋 revert + 재배포. 신규 기능은 전부 opt-in(스피커 뷰=키 입력 시에만, standalone=별도 스크립트) — 기존 덱 빌드 산출 무변화가 회귀 게이트.

## 스캐폴딩 결정
- source-of-truth: 발표 운영 계약 정본 = `references/rendering-contract.md`(shell 계약 확장) + `references/verification.md`(검증 절차). 노트 데이터 원본 = `content/slides.json` 의 기존 `notes` 필드(신규 필드 발명 금지 — PPTX 이관과 동일 원본).
- 검증: fixture 덱 빌드 → Chrome 실조작(S 키 → 창 2개 동기 확인) + standalone 산출을 dev 서버 없이 `file://` 로 열어 실동작 + PDF 노트 페이지 실산출 육안 판독. 기존 덱 재빌드 diff 0(회귀).
- 배포/운영: setup.sh 단일 배포(커밋 가드 강제). custom-skills 는 공유 레포 — add 는 변경 경로만 명시.
- 자기선언 — 스피커 뷰 계약: 창 간 동기 = **BroadcastChannel**(동일 origin·file:// 미지원 → file:// 폴백 = localStorage storage 이벤트, 둘 다 불가 시 단일 창 오버레이 폴백) · 스피커 창은 빌드 산출물에 포함되는 정적 html(별도 서버 불요) · 타이머는 스피커 창 로컬(동기 대상 아님) · export(print·PDF·standalone)에 스피커 뷰 UI 미노출.
- 자기선언 — standalone 계약: **다중 문서 → 단일 문서 병합이 본체**(현행 빌드 = 슬라이드당 별도 HTML + full navigation — 검증자 실측) — 병합은 export 산출 전용, 기존 빌드 구조 무접촉 · base64 인라인 대상 = CSS/JS/이미지/웹폰트(Pretendard CDN stylesheet 는 CSS fetch 후 내부 폰트 URL까지 인라인) · 인터랙티브 레이아웃(chart/three 등)의 CDN 의존은 로컬 번들 인라인, 불가 시 `exportFallback` 정적 대체 + 고지(침묵 열화 금지) · 산출 크기 상한 경고 20MB(base64 ~33% 오버헤드 고지, 튜닝값).
- 검토 후 제외: Node notes-server(reveal.js 방식 별도 기기 노트) — 서버 의존 추가 대비 실익 낮음, BroadcastChannel 이 단일 기기 듀얼 스크린을 충족 · WebSocket/원격 동기 — 범위 밖.

## 결정 로그
- status: resolved
- **범위 = 추천안(A 발표 운영력 + B 모션 문법 1차, C 얹기, D finding 큐)** — 사용자 확정 2026-07-31 ("추천대로 계획 ㄱ").
- 스피커 뷰 동기 기술(BroadcastChannel+폴백)·standalone 크기 경고 상한 = 기술/튜닝값 (에이전트 결정, 기록만).

## Step 트리

- [x] **step-1 — 스피커 뷰 (듀얼 윈도우 노트)**
  - Artifact: shell(builder 산출 공통 스크립트)에 `S` 키 → `speaker.html` 새 창 열기 + BroadcastChannel 동기(슬라이드 인덱스 양방향). `speaker.html` 은 builder 가 생성: 현재/다음 슬라이드 iframe 미리보기 + notes 텍스트 + 경과 타이머. `references/rendering-contract.md` 에 스피커 뷰 계약 절 추가.
  - Files: write custom-skills `promoted/presentation-slides-yusung/templates/`(builder·src shell 관련 파일 — 착수 시 실경로 확정)·`references/rendering-contract.md`. read `references/builder-architecture.md`.
  - Risk: 위험 (shell 공통 스크립트 변경 — 전 레이아웃 회귀 표면)
  - Dependencies: 없음
  - Verify: fixture 덱 빌드 → Chrome 실조작: S 키로 스피커 창 열림 + 메인 창 이동 시 스피커 창 동기 + 노트 표시 + 기존 키보드 내비 회귀 없음. 스피커 뷰 미사용 시 산출 html 렌더 무변화.
  - Failure probe: `file://` 에서 BroadcastChannel 미지원 — localStorage 폴백 실동작을 file:// 로 열어 별도 확인. iframe 미리보기가 인터랙티브 레이아웃(three 등)에서 이중 로드 부하 — 미리보기는 정적 스냅샷 우선, 부하 확인.
  - Commit: changeset `20260731-hu1-presenter-ops` (custom-skills, README 절: step-1).
- [x] **step-2 — 단일 파일 standalone export (다중 문서 → 단일 문서 병합)**
  - Artifact: 신규 `templates/export-standalone.mjs`. ⚠ 핵심은 에셋 인라인이 아니라 **내비게이션 모델 재설계**다(검증자 발견): 현행 빌드는 슬라이드당 별도 HTML + `window.location.href` full navigation(rendering-contract 모드 1) — standalone 은 N개 문서를 단일 문서의 `<section>` 상태 전환으로 병합(nav script rewrite, id/scope 충돌 회피)한 뒤 에셋(CSS/JS/이미지/웹폰트) base64 인라인.
  - Files: write custom-skills `templates/export-standalone.mjs`. read `references/rendering-contract.md`(모드 계약)·fixture 덱.
  - Risk: 위험 (내비 모델 병합 재설계 — 단 신규 스크립트라 기존 빌드 경로 무접촉)
  - Dependencies: step-1
  - Verify: fixture 덱에서 standalone 실산출 → dev 서버 종료 상태 `file://` 로 Chrome 실개봉(렌더·키 내비·장 전환 동작) + 기존 빌드 산출(다중 파일) 무변화.
  - Failure probe: 웹폰트/CDN 의존(Pretendard CDN stylesheet — theme.mjs `PRETENDARD_LINK` 실측)의 인라인은 CSS fetch + 내부 폰트 URL 인라인 2단 — 오프라인 실개봉으로만 판정(네트워크 있으면 위양성). 인터랙티브 레이아웃 script 병합 시 전역 충돌. 20MB 초과 경고 실동작.
  - Commit: changeset 동일 (README 절: step-2).
- [x] **step-3 — PDF export 노트 옵션**
  - Artifact: 기존 raster/vector PDF exporter 에 `--notes` 플래그(슬라이드 뒤 노트 페이지 삽입 — notes 원본은 slides.json `notes` 필드).
  - Files: write custom-skills `templates/export-raster-pdf.mjs`·`templates/export-vector-pdf.mjs`.
  - Risk: 위험 (기존 exporter 수정 — 플래그 미지정 경로 불변이 회귀 계약)
  - Dependencies: step-1
  - Verify: `--notes` PDF 실산출 노트 페이지 육안 판독 + 플래그 미지정 재산출이 기존과 동일(회귀).
  - Failure probe: notes 빈 슬라이드 처리(빈 페이지 삽입 금지 — 생략 또는 "노트 없음" 표기 일관).
  - Commit: changeset 동일 (README 절: step-3).
- [x] **step-4 — 등재·라우팅·배포 + 통합 검증**
  - Artifact: SKILL.md(발표 운영 기능 절 — 스피커 뷰·standalone·PDF 노트 진입점)·`references/verification.md`(검증 체크 추가) + setup.sh 배포.
  - Files: write custom-skills `SKILL.md`·`references/verification.md`.
  - Risk: 없음 (문서+배포)
  - Dependencies: step-2, step-3
  - Verify: 배포본에서 fixture 덱 신규 생성 → 스피커 뷰·standalone·PDF 노트 3기능 통합 실동작(배포 출고 정합 — 커밋 가드).
  - Failure probe: SKILL.md 현행 라우팅 절과 충돌 없게 grep 후 편집(계획의 인용은 의역).
  - Commit: changeset 동일 (README 절: step-4).

## 검증/DoD
- **DoD**: 스피커 뷰(별도 창 노트+동기)·단일 파일 standalone·PDF 노트 옵션이 스킬에 배포되고 fixture 덱에서 3기능 실동작(Chrome 실조작 + file:// 개봉 + PDF 육안)하며, 기능 미사용 시 기존 덱 산출 무변화(회귀 게이트).
- **Evidence**: `evidence/html-upgrade/hu1-presenter-ops.md`
- **회귀 게이트**: 기존 fixture 재빌드 산출 diff 0(신기능 미사용 경로) + 기존 export 3트랙 무변화.

## 수치 출처
- base64 ~33% 오버헤드 = research 문서 §2-4 (DevPry, 접근 2026-07-31).

## 재생성 장벽
- step-3 배포 후 배포본 검증(커밋 가드가 배포를 커밋 시점에 강제).

## finding 큐

## 진행 로그
- 2026-07-31 작성 — 리서치 3본 종합 후 goal 연쇄 1/3 로 개설.
