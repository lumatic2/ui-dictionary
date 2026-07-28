# Evidence — SL3: 편집 가능 PPTX 실증

- Plan: `plans/2026-07-28-sl3-editable-pptx-proof.md` (G2~G4 사용자 승인 "ㄱㄱ" 2026-07-28)
- 비교 장부: `research/2026-07-28-sl3-pptx-path-comparison.md`

## DoD 대조

| 항목 | 결과 |
|---|---|
| 소개 덱 HTML 정본 완성 (7장, askewly 테마) | PASS — validate `--lint` 0경고(자기적용) · build 7장 · overflow 0 |
| 브라우저 실조작 (G5/G6) | PASS — http.server 기동, 표지→2장 키보드 이동, 차트 슬라이드 Chart.js 실렌더 스크린샷 2매(`sl3-shots/`), 콘솔 에러 = favicon 404 1건(서버 부산물, 덱 결함 아님) |
| 경로 A: pptxgenjs 네이티브 PPTX | PASS — 7장 전부, AUTO_SHAPE 텍스트 프레임 + 네이티브 CHART + 발표자 노트 (python-pptx 검사) |
| 경로 B: ppt-master SVG→DrawingML | PASS — 대표 3장, TEXT_BOX/AUTO_SHAPE 네이티브, 13.333×7.5in 자동 추론 (`--quick-test`) |
| 캔버스 프리셋 정합 (`pptx-widescreen-16-9`) | PASS — 두 산출물 모두 13.333×7.5in |
| 실개봉 (텍스트 선택·개체 이동) | **평가 못 함** — PowerPoint·LibreOffice 미설치. python-pptx 개체 구조 검사로 대체 → **이 항목 한정 partial** |
| 비교 장부 실측 행 완성 | PASS — 8축 비교 + 판정 + 평가 못 함 + dogfood 결함 3건 |

## real-use-lap 부활 조건 판정

pending goal `real-use-lap`의 정의("Askewly Design으로 Askewly Design 소개 덱(PPTX)을 실제로 만들고, 막히는 지점만 결함으로 기록")를 SL3가 실질 수행했다 — 소개 덱 PPTX 실물 2종 + dogfood 결함 3건 기록. **판정: 부활 조건 충족으로 보이나 goal 처분(completed 전환 또는 잔여 정의)은 사용자 확인 사항** — ROADMAP pending 상태는 유지하고 이 판정만 남긴다.

## 판정

SL3 DoD 충족 — completed (2026-07-28), 실개봉 1항 partial 명시.
