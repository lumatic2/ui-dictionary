# 20260710 Docs Foundations Content

## Target

- ROADMAP milestone: CF1 - Docs Foundations And Agent Recipes 공개 (Step 1+2 병합)
- Plan: `docs/plans/2026-07-10-cf1-docs-foundations.md`

## Scope

- `src/lib/documentation-pages.ts`: Foundations 아티클 7종 실콘텐츠(한국어) — color/typography/spacing-layout(영어 초안→한국어 재작성) + tokens/dark-mode/motion/accessibility(신규). 각 6섹션(Tokens/Usage/Good-bad/Light-dark/Implementation/Agent constraints), 복붙 가능한 토큰 참조 스니펫. 죽은 `foundationSkeleton()` 헬퍼 제거.
- SSOT 파생 원칙 준수: 모든 토큰명 `tokens/askewly.tokens.json` 실존 대조, motion은 duration/easing 토큰 부재를 발명 없이 명시하고 실측 관례(Dialog duration-200 등)만 기록.
- `shell: true` 유지 — 프로덕션 비노출, 게이트 열기는 Step 4.

## Contract

- 아티클 언어 = 한국어 (사용자 확정 2026-07-10, 기존 Docs와 일관). 토큰명·코드는 영어.
- 계획 당시 가정한 `knowledge/color.md` 등 3개 파일은 실재하지 않음 — tokens SSOT 단독 파생으로 대체 (plan doc 기록).

## Verification

- [x] `npm run lint` PASS, `npm run build` PASS (구현 에이전트).
- [x] 7종 전부 dev 렌더 (한국어 lead + 6섹션 헤딩, 구현 에이전트 4177).
- [x] 토큰 실존 대조 (gray ramp·semantic surface/text/action/border·component button·dimension·typography 전 참조).
- [ ] 부모 통합 게이트 재검증 — Step 4에서 일괄 (병렬 편집 중인 home-page.tsx 안정화 후).
