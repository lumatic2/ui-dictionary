# Evidence — SX2: 벡터 PDF export

- Plan: `plans/2026-07-28-sx2-vector-pdf.md` (연쇄 승인 집행 — SX1 영수증 `--chain SX2,SX3`)
- 구현 레포: custom-skills `ae6a50d`(exporter+문서) · `6c3ff8c`(트리 보충)

## DoD 대조

| 항목 | 결과 |
|---|---|
| 벡터 트랙 신설 (raster 병행) | PASS — `templates/export-vector-pdf.mjs`: print.html(@page 크기·페이지 분할 CSS 기존재)을 Chromium 인쇄 엔진으로 직접 인쇄, 신규 의존성 0 (pdf-lib 병합 방식 불채택 근거 계획서 기록) |
| 페이지 수 = 슬라이드 수 | PASS — impact-layouts-smoke 4/4 · polish-smoke 6/6 (PyMuPDF) |
| 텍스트 추출 가능 (벡터성) | PASS — 376자 / 884자 추출 (라스터 트랙은 이미지 임베드라 추출 불가 구조 — survey 실측) |
| 한글 폰트 | PASS — document.fonts.ready 대기 후 인쇄, 3면 래스터 눈 확인에서 Pretendard 정상(hero-motion 표지 포함) |
| 3면 눈 확인 (매체 게이트 원칙) | PASS — 첫·중간·끝 래스터 확인, hero-motion 풀블리드·exportFallback 노트가 인쇄 계약대로 표시 |
| 기존 raster 트랙 무변경 | PASS — export-raster-pdf.mjs diff 0 |
| 문서·배포 | PASS — SKILL(§7.10 트랙 선택 기준·description)·authoring-contract(복사 목록+트리) 갱신, `--skill` 배포, 배포본에서 벡터 PDF 재생성 확인 |

## 실행 중 발견

- Playwright 패키지는 잡히나 브라우저 바이너리 부재 환경 — raster 툴의 시스템 Chrome 폴백(chromeCandidates)을 이식해 해소.
- setup.sh 원자 교체가 배포본 안 임시 산출물(exports/) 점유로 실패해 `.tmp-*` 디렉터리 잔류 — 정리 후 재배포로 해소. 교훈: 배포본 fixture에서 산출물 만들면 즉시 지운다.

## 판정

SX2 DoD 충족 — completed (2026-07-28).
