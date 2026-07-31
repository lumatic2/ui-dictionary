# PLAN — SX2: 벡터 PDF export

> 생성: 2026-07-28 · 갈래: changeset(cross-repo — custom-skills) · scope: goal `slide-expressive` 연쇄 2/3. SX1 영수증 `--chain SX2,SX3` 집행.
Status: approved (연쇄 승인 집행 — 새 사용자 소유 결정 없음)

## 북극성 → milestone → step (위계)
- **북극성**: Askewly Design — "매체 게이트" 축. **goal**: `slide-expressive` · **milestone**: SX2.
- **입력**: `research/2026-07-28-sx1-slide-expressive-survey.md` §갭 2 — 현행 `export-raster-pdf.mjs`는 슬라이드를 PNG 스크린샷으로 캡처해 이미지 PDF 생성(텍스트 선택 불가, 코드 실측). 활용 자산: 덱마다 생성되는 `print.html` + `@media print` 페이지 분할 CSS 기존재 — Playwright `page.pdf()`로 직접 인쇄하면 의존성 추가 없이 벡터 PDF.

## Scope Boundary
- **포함**: ① `export-vector-pdf.mjs` 신규 템플릿(print.html → page.pdf, 슬라이드 크기 페이지, 텍스트 벡터 유지) ② fixture로 벡터성 실증(텍스트 추출·페이지 수·경계) ③ 문서·배포.
- **제외**: 기존 raster 트랙 변경(병행 유지 — 모션 캡처·카드뉴스 용도) · 핸드아웃/노트 변형(후속 후보) · 소개 덱 적용(SX3).
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / user_stopped
- rollback/cleanup: 신규 파일 중심 + 문서 소폭 — custom-skills revert + 재배포.

## 스캐폴딩 결정
- source-of-truth: print.html의 인쇄 계약(`rendering-contract.md`·css printCss)이 정본 — 벡터 exporter는 그 소비자. 페이지 크기 = 덱 canvas(hd 1280×720)에서 파생.
- 검증: fixture에서 벡터 PDF 생성 → PyMuPDF로 ① 페이지 수 = 슬라이드 수 ② 텍스트 추출 가능(벡터성 — raster 산출물은 추출 0으로 대조) ③ 첫·중간·끝 3면 래스터 눈 확인(매체 게이트 원칙) + 한글 폰트 임베드 확인.
- 배포/운영: `setup.sh --skill presentation-slides-yusung` 단일 배포 → 배포본 재실행.
- 자기선언 — 트랙 경계 문서화: raster(시각 충실·모션 정지 캡처) vs vector(텍스트 선택·검색·경량) 선택 기준을 스킬 문서에 1절로 — methodology §2 결정표와 정합.
- 검토 후 제외: pdf-lib 병합 방식(Slidev식 per-slide) — print.html 단일 인쇄가 의존성 0으로 같은 결과라 불채택(다르게 판명 시 finding).

## 결정 로그
- status: resolved
- 방향·범위 = goal 승인에 포함(벡터 PDF는 SX 연쇄 2/3로 제시·승인됨 2026-07-28). 구현 방식(print.html 직접 인쇄 vs per-slide 병합)은 기술 결정 — 의존성 0 우선.
- **새 사용자 소유 결정: 없음.**

## Step 트리

- [x] **step-1 — export-vector-pdf.mjs 구현**
  - Artifact: `templates/export-vector-pdf.mjs` — print.html을 Playwright로 열어 `page.pdf({width,height,preferCSSPageSize,printBackground})`, canvas에서 페이지 크기 파생, 인터랙티브 슬라이드는 print.html의 기존 exportFallback 표시 계약 그대로.
  - Files: write ~/projects/custom-skills/promoted/presentation-slides-yusung/templates/export-vector-pdf.mjs. read templates/export-raster-pdf.mjs(Playwright resolve 4단 fallback 재사용)·src/shell.mjs(print.html 구조)·src/css.mjs(printCss).
  - Risk: 위험 (인쇄 CSS와 pdf 페이지 크기 불일치 시 잘림/여백 — 3면 래스터 확인으로 잡는다)
  - Dependencies: 없음
  - Verify: fixture 1건에서 PDF 생성 성공.
  - Failure probe: print.html이 화면 CSS로 흐르면 페이지 경계가 어긋난다 — html.print-mode 클래스·@page 크기를 실측해 맞추고, 어긋나면 exporter가 스타일 주입으로 보정.
  - Commit: changeset `sx2-vector-pdf` (custom-skills 커밋, README 절: step-1).

- [x] **step-2 — 벡터성 실증**
  - Artifact: impact-layouts-smoke·polish-smoke 두 fixture에서 벡터 PDF 생성 + PyMuPDF 검사 기록(페이지 수=슬라이드 수, 텍스트 추출 문자수 >0, raster 대조 추출 0, 한글 폰트 임베드) + 3면 래스터 눈 확인.
  - Files: 실행 중심(산출물은 tmp — 커밋 안 함). write(기록) evidence 초안.
  - Risk: 없음 (검사만)
  - Dependencies: step-1
  - Verify: 위 4항 전부 stdout/이미지 실관측.
  - Failure probe: CDN 폰트가 headless에서 로드 전 인쇄되면 폴백 폰트로 임베드 — 폰트 로드 대기(document.fonts.ready)를 exporter에 넣는다.
  - Commit: changeset `sx2-vector-pdf` (README 절: step-2).

- [x] **step-3 — 문서·배포 (SX2 마감)**
  - Artifact: SKILL.md(export 서술에 vector 트랙)·references/verification.md 또는 authoring-contract.md(복사 목록+선택 기준 1절) + 배포 + 배포본 재실행 + evidence.
  - Files: write custom-skills 문서 2건, evidence/slide-expressive/sx2-vector-pdf.md.
  - Risk: 위험 (배포 — 단일 스킬 경로로 격리)
  - Dependencies: step-2
  - Verify: 배포본에서 벡터 PDF 생성·텍스트 추출 재확인.
  - Failure probe: authoring-contract 복사 명령 목록에 빠뜨리면 새 덱이 이 도구를 못 받는다 — 목록 갱신 확인.
  - Commit: changeset `sx2-vector-pdf` (README 절: step-3).

## 검증/DoD
- **DoD**: 벡터 PDF 트랙이 raster와 병행 옵션으로 추가되고, fixture 실증(페이지 수·텍스트 추출·한글 폰트·3면 눈 확인)이 남으며, 문서·배포 완료. 기존 raster 트랙 무변경.
- **Evidence**: `evidence/slide-expressive/sx2-vector-pdf.md`
- **회귀 게이트**: export-raster-pdf.mjs diff 0 · 기존 fixture smoke 통과 유지.

## 수치 출처
- 라스터 현행 구조 = survey 문서 코드 실측.

## finding 큐
- Playwright 브라우저 바이너리 부재 환경 — 시스템 Chrome 폴백 필수(이식 완료).
- 배포본 fixture 안에 산출물을 만들면 setup 원자 교체가 실패한다 — 즉시 삭제 규칙.

## 진행 로그
- 2026-07-28 작성 — SX1 완료 직후 연쇄 집행.
