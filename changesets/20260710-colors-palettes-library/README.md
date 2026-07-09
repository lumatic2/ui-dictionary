# 20260710 Colors Palettes Library

## Target

- ROADMAP milestone: SFB3 - Content Fill Batch 1: Colors Palettes (Step 1)
- Plan: `docs/plans/2026-07-10-sfb3-colors-palettes.md`

## Scope

- `src/lib/palette-generator.ts`: `paletteSeedLibrary` 7→13 팔레트 확장 (Fintech Trust, Wellness Calm, Gaming Neon, Enterprise Slate, Creator Warm, Data Viz Categorical — PGD1 규약: 결정론적 in-repo 데이터, 외부 API 없음).
- `src/components/colors-page.tsx`: Palettes skeleton을 실구현으로 교체 — `PaletteCard` 13종(이름·스와치·hex·시드 출처 라벨), 스와치 hex 복사 토스트, 팔레트 전체 복사, Export 다이얼로그(Image PNG/Code/SVG — PGD1 export 로직 재사용).
- `src/components/home-page.tsx`: `getReadableTextColor`/`downloadPalettePng`/`buildPaletteSvg` export 승격 (복제 없는 재사용).

## Contract

- Colors 축 shell 게이트는 이 changeset에서 열지 않음 — 노출은 Step 2(완성 판정 확인 후).
- Generator 뷰·다른 껍데기 무변.

## Verification

- [x] `npm run lint` PASS (에이전트 + 부모 독립 재실행).
- [x] `npm run build` PASS (독립 재실행).
- [x] dev 스모크: 팔레트 13종 렌더, hex 복사·팔레트 복사 토스트, Export 다이얼로그(PNG 다운로드·Code·SVG 복사) 동작, 라이트/다크 대비 확인 (구현 에이전트, 4201).
- [x] 게이트 무변 확인: `isShellVisible` 호출부 무수정 — Colors는 여전히 dev-only.
