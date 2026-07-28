# 완료 — SL3 편집 가능 PPTX 실증

> 완료: 2026-07-28 · SL3 (goal `slide-methodology`) · 배치: `docs/reports/` (이 레포 특례 — archive/ gitignore)
> **짧게 쓴다.**

## 1. 결과

Askewly Design 소개 덱(7장, askewly 테마)을 HTML 정본으로 만들고 — SL1 방법론·SL2 린터의 첫 실사용, lint 0경고 — 같은 덱을 편집 가능 PPTX 두 경로로 실증했다. 경로 A(pptxgenjs): 7장 전부 네이티브 텍스트 프레임 + 진짜 CHART 개체 + 발표자 노트. 경로 B(ppt-master SVG→DrawingML): 대표 3장 네이티브 TEXT_BOX, 좌표 보존. 두 산출물 모두 widescreen 13.333×7.5in 프리셋 정합. 8축 비교 장부가 `research/2026-07-28-sl3-pptx-path-comparison.md`에 남았다 — 자동 왕복은 A, 시각 충실도는 B라는 판정.

## 2. 이슈와 해결

- ppt-master 정식 경로가 `spec_lock.md` 프로젝트 계약을 요구 — 표적 실험은 `--quick-test`(test-only)로 우회하고, 반복 자동화에는 계약 스크립트화가 필요함을 결함으로 기록.
- PowerPoint·LibreOffice 미설치로 실개봉 게이트를 로컬에서 못 밟음 — python-pptx 구조 검사로 대체, **실개봉 1항 partial**.
- real-use-lap 부활 조건 판정: 소개 덱 PPTX 실물 2종 + dogfood 결함 3건으로 조건 실질 충족 — goal 처분은 사용자 확인 사항으로 남김.

## 3. 증거

- changeset: `changesets/20260728-sl3-editable-pptx-proof`
- 검증: evidence `evidence/slide-methodology/sl3-pptx.md` — DoD 7항 중 6 PASS · 실개봉 1항 partial 명시
- 크기 회고: changeset 1개(커밋 2)로 닫힘 — 독립 응집 변경 3개(덱·경로A·경로B+장부)라 정합.
- 실표면: 덱 HTML을 브라우저에서 실조작(키보드 내비 01→02 전환·Chart.js 실렌더 스크린샷 2매) — 성공. PPTX 2종은 python-pptx로 개체 트리를 실검사(AUTO_SHAPE/TEXT_BOX/CHART 카운트) — 성공. 평가 못 함: PowerPoint 실개봉(뷰어 미설치 — 설치 환경에서 후속 1회).
- 재현: `cd decks/askewly-design-intro && node tools/validate-slides.mjs --lint && node export/html2pptx.mjs` (경로 B는 venv + `svg_to_pptx.py pptmaster-project --quick-test`)

## 정정 (2026-07-28 2차 — 기록 추가)

"PowerPoint·LibreOffice 미설치" 판정은 오판이었다(PATH 검색만 수행 — 사용자 지적으로 재확인, 둘 다 설치돼 있었음). 실개봉 재수행: PowerPoint COM으로 두 PPTX 열기·개체 이동·텍스트 편집·SaveAs 전부 성공(복구 대화 0), LibreOffice Impress 렌더 성공 — **partial 해소, 실개봉 PASS**. 렌더에서 실결함 2건 신규 발견(경로 A Pretendard 폰트 폴백 · 경로 B SVG 절대좌표 저작발 텍스트 겹침) — 비교 장부에 기록. 교훈: 설치 확인은 PATH가 아니라 App Paths 레지스트리+표준 경로로.
