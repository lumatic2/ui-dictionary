# 완료 — SX2 벡터 PDF export

> 완료: 2026-07-28 · SX2 (goal `slide-expressive`) · 배치: `docs/reports/` (이 레포 특례 — archive/ gitignore)
> **짧게 쓴다.**

## 1. 결과

슬라이드 PDF export가 2트랙이 됐다. 기존 raster(스크린샷 임베드 — 시각 충실) 옆에 **vector 트랙**(`export-vector-pdf.mjs`) — 덱마다 이미 생성되는 print.html을 Chromium 인쇄 엔진으로 직접 인쇄해 **텍스트가 선택·검색 가능한 PDF**를 만든다. 신규 의존성 0. 한글 폰트는 로드 대기 후 임베드. 스킬 문서에 트랙 선택 기준(공유·인쇄 기본=vector, 픽셀 정합=raster) 명시, 배포 완료.

## 2. 이슈와 해결

- Playwright 브라우저 바이너리 부재 환경에서 실패 — raster 툴의 시스템 Chrome 폴백을 이식해 해소.
- setup.sh 원자 교체가 배포본 내 임시 산출물 점유로 실패(`.tmp-*` 잔류) — 정리 후 재배포. 배포본 fixture 산출물은 즉시 삭제가 규칙.
- DoD 잔여 없음.

## 3. 증거

- changeset: `changesets/20260728-sx2-vector-pdf` (custom-skills ae6a50d·6c3ff8c)
- 검증: evidence `evidence/slide-expressive/sx2-vector-pdf.md` — DoD 7항 전부 PASS.
- 크기 회고: changeset 1개(커밋 2)로 닫힘 — 응집 변경 2개(exporter·문서)라 milestone 하한이지만 SX 연쇄의 독립 능력 단위로 정합.
- 실표면: 두 fixture에서 벡터 PDF 실생성 → PyMuPDF로 페이지 수(4/4·6/6)·텍스트 추출(376·884자) 실검사, 3면 래스터를 눈으로 확인(Pretendard·풀블리드·fallback 노트 정상). 배포본에서 재생성 확인.
- 재현: `cd ~/.claude/skills/presentation-slides-yusung/fixtures/impact-layouts-smoke && node ../../templates/build-slides.mjs && node ../../templates/export-vector-pdf.mjs` (확인 후 exports/ 삭제)
