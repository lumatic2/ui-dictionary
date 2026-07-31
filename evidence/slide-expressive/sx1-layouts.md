# Evidence — SX1: 임팩트 레이아웃 2종

- Plan: `plans/2026-07-28-sx1-impact-layouts.md` (사용자 승인 "ㄱㄱ" 2026-07-28, fresh 검증자 3건 선반영)
- 구현 레포: custom-skills 커밋 `c267570`(레이아웃+fixture) · `0a0fdf6`(문서·카탈로그)

## DoD 대조

| 항목 | 결과 |
|---|---|
| hero-motion·svg-filter-scene 4면(meta·schema·renderer·css) 완비 | PASS — 레이아웃 18종 등재, enum 정합 |
| 문서 3건(layouts.md §13·14 / layout-selection 표 / SKILL §5) + smoke 카탈로그 | PASS — catalogSlides 2장 삽입, smoke 전체 exit 0 (카탈로그 18장 × 테마) |
| 기존 16종 무회귀 | PASS — polish-smoke validate·build 출력 불변, smoke-runner 전체 통과 |
| reduced-motion 분기 | PASS — Playwright emulateMedia 양쪽 실측: reduce 시 애니메이션 전부 none·SVG pauseAnimations()=true / normal 시 hmTitleIn 동작 (css.mjs 신규 클래스 규칙 — fresh 검증자 적발분 반영) |
| exportFallback 계약 | PASS — 두 레이아웃 requiresFallback:true, fixture 전건 fallback 보유 |
| 브라우저 실조작 | PASS — 스크린샷 3매(`sx1-shots/`): hero-motion 블롭+단계 등장, turbulence 일렁임(본문 또렷), liquid 병합. 콘솔 에러 = favicon 404뿐 |
| 배포본 동일 동작 | PASS — `--skill` 단일 배포 후 배포본 fixture validate·build 재확인 |

## 실행 중 발견·수리

- SVG 필터 기본 영역(110%)이 displacement 변위를 직선으로 클리핑 — 필터 영역 확장(x/y/width/height)으로 수리 후 재검증.

## 판정

SX1 DoD 충족 — completed (2026-07-28).
