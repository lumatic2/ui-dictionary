# 20260710 Collections Terms Promotion

## Target

- ROADMAP milestone: CF3 - Patterns 빈 컬렉션 배치 (Step 1)
- Plan: `docs/plans/2026-07-10-cf3-collections.md`

## Scope

- `docs/ui-vocabulary/terms.yml`: 후보 9종 승격(527→536, 전부 draft) + `marquee-row`에 "Logo marquee"/"로고 마키" alias 추가. `inbox.yml` 버퍼 비움.
- `src/lib/navigation-model.ts`: 빈 컬렉션 4개 termIds 배정 — Blog(3)/Contact(3)/Content(2)/Logo Clouds(2, marquee-row 교차 배정) → SFB1 노출 게이트 자연 해제.
- `src/components/term-visual.tsx`: 신규 9종 전용 visual renderer(각각 인터랙티브 요소 포함) + renderVisual 등록.

## Verification

- [x] `python scripts/validate-ui-vocabulary.py` PASS (536 terms, 57 groups — 에이전트 + 부모 재실행).
- [x] `node scripts/audit-ui-vocabulary-candidates.mjs` PASS (후보 0, 경고 0).
- [x] `npm run build`/`npm run lint` PASS (부모 독립 재실행).
- [x] `npm run audit:visuals`: fallback 15→6, 신규 9종 fallback 0 (잔여 6종은 기존 스코프 외).
- [x] prod preview 클릭 스루(부모, 로컬 Playwright): 4컬렉션 사이드바 노출·Blog Sections 예제 7종·Logo Clouds 예제 6종 풀 렌더·term 상세(한국어+visual) 렌더·Templates 비노출 유지. Evidence: `docs/research/assets/cf3-collections-2026-07-10/`.
- [ ] 프로덕션 배포 반영 확인 — 세션 일괄 push 후.
