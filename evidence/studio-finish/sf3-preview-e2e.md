# SF3 — 미리보기 고도화 E2E 실측 (2026-07-19)

## Step 1 — 다크 토글 (Playwright)

| 확인 | 관측 |
|---|---|
| 다크 on | 미리보기 배경 rgb(250,248,244) → rgb(29,24,19) (베이스 축 warm-dark 파생), aria-pressed true |
| Failure probe | 다크 축 "라이트만" 선택 → 토글 비활성 + 강제 off + 라이트 복귀 (미정의 상태 0) |
| dark-first 재선택 | 토글 재활성, 수동 다크 정상 |

## Step 2 — 조합 매트릭스 12조합 (Playwright)

구성 3종(hero-cards-info · faq-trust · compare-table) × 라이트/다크 × 데스크톱(398px)/모바일(318px) = **12조합 전부 rendered=true · overflow=false** (fails 0). 모바일 뷰에서 카드·정보 행 세로 스택 확인.

스크린샷: `sf3-preview-dark-mobile.png`(다크+모바일 — 카드 세로 스택·다크 서페이스), `sf3-preview-light-desktop.png`.

## 통합 검증 (horizon Close Criteria ④) — 커스텀 데이터 전 루프

`sf2-unhide.json`(커스텀 데이터) → `make-studio.py` 생성 → 실브라우저에서 18/18 축 선택 → "선택 완료" 제출 → 폴백 JSON 수집: `{version: 2, selections: 18축, composition: hero-cards-info}` 파싱 성공. 주입→선택→수집 루프 1회 관측 완료.

## 계약

- `docs/design-system/brief-studio.md` 미리보기 뷰 토글 절 추가 + Changelog. llms 재생성.
- curl 배포: push 후 확인.
