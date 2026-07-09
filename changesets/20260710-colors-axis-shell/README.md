# 20260710 Colors Axis Shell

## Target

- ROADMAP milestone: SFB2 - Shell Buildout (Step 2)
- Plan: `docs/plans/2026-07-10-sfb2-shell-buildout.md`

## Scope

- `src/components/colors-page.tsx` (신규): Colors 축 화면 — Generator 뷰(홈 `ColorPaletteGeneratorDemo` 재사용, 복제 없음) + Palettes 라이브러리 skeleton(카드 슬롯 8개 + "Content pending" 빈 상태) 탭 구조.
- `src/App.tsx`: PageMode `colors` 신설, 헤더 nav "Colors" 항목·`?page=colors` 진입 모두 `isShellVisible` 게이트(dev-only).
- `src/components/home-page.tsx`: `ColorPaletteGeneratorDemo` export 승격 (홈 generator 카드는 무변).

## Contract

- Colors 축 전체 dev-only — 프로덕션 nav·URL 진입 차단(홈으로 정규화). 프로덕션 표면 변화 0.
- Palettes 실데이터·프로덕션 노출은 SFB3.

## Verification

- [x] `npm run lint` PASS (에이전트 + 부모 독립 재실행).
- [x] `npm run build` PASS (독립 재실행).
- [x] dev 스모크: Colors nav 노출, Generator 실동작(Generate 클릭 팔레트 변경), Palettes skeleton 렌더, 콘솔 에러 0 (구현 에이전트, 4199).
- [x] prod 비노출 회귀: nav에 Colors 0건, `?page=colors`→홈 정규화, 홈 generator 정상 동작 (구현 에이전트, 4198).
