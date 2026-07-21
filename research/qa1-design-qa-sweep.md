# QA1 design-qa Sweep — Recipe Gallery 35종

Date: 2026-07-12
Milestone: QA1 Step 2 (evidence)
방법: preview 빌드(:4173) 갤러리를 Playwright로 순회 — recipe 35종 × 라이트/다크 스크린샷 70장 + 근사 WCAG contrast 스캔(텍스트 노드별 전경/배경 luminance ratio, AA 4.5/3.0). 산출물: `tmp/qa1-sweep/` (스크린샷·sweep-report.json, gitignored 로컬 보존).

## 결과 요약

- 스크린샷: 35/35 recipe 라이트+다크 캡처 완료.
- contrast 후보: 6 recipe 7건 — **전수 수동 판독 결과 전부 오탐 또는 AA 통과** (아래).
- 실결함: 오버레이 데모 2종이 갤러리 컨테이너를 탈출 (아래 결함 목록).

## Contrast 후보 판독 (7건)

| recipe | 후보 | 판독 |
|---|---|---|
| button, bulk-action-toolbar | "Delete" white on red | red-600(#dc2626) 위 white = 4.52:1 → AA 통과. 스캐너가 배경(gradient/클래스 배경)을 백색으로 오독 |
| showcase-card, landing-hero | "Read More 👉", "Chip" | 데모 내부 목업 일러스트의 미니 칩 — 실 UI 텍스트 아님 + 유색 배경 오독 |
| permission-matrix | "high risk" 12px white on red | red 배지 위 white — AA 통과 (button과 동일 계열) |
| data-import-wizard | "rows need attention" 12px | 다크 모드 red 배지 — 동일 판독, 통과 |

스캐너 한계 기록: backgroundColor만 읽어 gradient/background-image·반투명 레이어 배경을 백색으로 판정 → white-on-color가 ratio 1.0으로 잡힘. 후보는 수동 판독 필수 (이번 회 7/7 오탐).

## 결함 목록

| # | 심각도 | recipe | 증상 | 라우팅 |
|---|--------|--------|------|--------|
| G1 | major | cart-drawer | 데모가 auto-open 전면 스크림 + 드로어가 `data-export-root` 밖(body portal)으로 렌더 — 갤러리 화면이 스크림에 덮이고 Back 버튼 클릭 차단, 캡처에 드로어 미포함 | **해소 — Step 3** (changeset #90): contained 데모로 재구성, 재sweep PASS |
| G2 | major | doc-search-cmdk-grouped-results-panel | 동일 전면 오버레이 패턴 — 다이얼로그+스크림이 뷰포트 전체를 덮고 컨테이너 높이에 잘림 | **해소 — Step 3** (changeset #90): plain Command 인라인 렌더, 재sweep PASS |
| G3 | minor | landing-hero | 데모가 히어로가 아니라 홈페이지 전체(자체 sticky topbar 포함)를 렌더 — 무겁고 갤러리 맥락에서 topbar가 중간에 떠 보임 | 기록 (큐레이션 판단, 차단 아님) |

## 관측 노트

- 다크 모드: 35종 전부 다크 토큰으로 정상 전환 렌더 — 다크 전용 깨짐 0건.
- 오버레이 recipe 중 action-sheet, bottom-sheet-detents, popover, topbar-command-search는 데모가 인라인/닫힘 기본이라 문제 없음 — G1/G2도 같은 패턴으로 수렴시키면 됨.
