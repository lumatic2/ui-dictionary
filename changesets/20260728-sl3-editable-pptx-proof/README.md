# Changeset — SL3: 편집 가능 PPTX 실증

- Plan: `plans/2026-07-28-sl3-editable-pptx-proof.md`

## step-1 — 소개 덱 (HTML 정본)

- 신규: `decks/askewly-design-intro/` — slides.json 7장(askewly 테마·주장형 제목·레포 실측 수치 562/166/47/13) + 표준 템플릿 복사 + 빌드 산출.
- Verify: validate `--lint` 0경고 · build 7장 · overflow 0 · 브라우저 실조작(키보드 내비·Chart.js 렌더) 스크린샷 2매.

## step-2 — 경로 A: pptxgenjs

- 신규: `export/html2pptx.mjs`(slides.json→네이티브 매핑, 레이아웃 6종) + `askewly-design-intro.pptxgenjs.pptx`. pptxgenjs 4.0.1 고정(구버전 손상 이력).
- Verify: python-pptx — 7장, AUTO_SHAPE 텍스트 프레임 + 네이티브 CHART + 노트.

## step-3 — 경로 B: ppt-master + 비교 장부

- 신규: `export/pptmaster-project/svg_output/` 대표 3장 SVG + `askewly-design-intro.pptmaster.pptx`(`svg_to_pptx.py --quick-test`, venv 격리 5패키지).
- Verify: python-pptx — 3장 네이티브 TEXT_BOX/AUTO_SHAPE, 13.333×7.5in. 정식 경로는 spec_lock.md 계약 필요(장부 결함 1).
- 장부: `research/2026-07-28-sl3-pptx-path-comparison.md` — 8축 실측 비교·판정·평가 못 함(실개봉)·dogfood 결함 3건.
