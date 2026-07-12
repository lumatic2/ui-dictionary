# Getting set up — 디자인 작업 프로토콜 개편

- Date: 2026-07-12
- Milestone: PX Step 2 (`docs/plans/2026-07-12-px-public-experience.md`)
- Scope: `examples/ui-vocabulary-site/src/lib/documentation-pages.ts` 의 `docs-getting-started-setup` 엔트리 단독

## What

"Getting set up"을 환경 준비 문서에서 **디자인 작업 프로토콜** 문서로 개편. Explore(Patterns 맥락→vocabulary) → Acquire assets(토큰/DESIGN.md SSOT·Recipe Gallery) → Inject(사람=복사/CLI add, 에이전트=recipe+토큰+용어 컨텍스트) → Verify(다크모드·상태·반응형·a11y) 4단 왕복 루프를 사람/에이전트 트랙 병렬로 서술. 철학은 Principles 소유 유지(중복 없음). Next steps는 Principles/Foundations/Recipe Gallery/Using HTML·React·Vue로 연결. 추후 Get Started CTA 부활 시 목적지 후보.

## Verification

- [x] `npm run build` PASS (워커 검증 — tsc+vite, 에러 없음)
- [x] `npm run lint` 6-warning baseline 유지 (신규 경고 0)
- [x] 브라우저 렌더 smoke: dev 서버에서 5개 섹션·On this page 앵커·코드 블록 정상 렌더 관측 (워커, chrome-ext snapshot)
- [x] 오케스트레이터 게이트: diff 전수 검토 — 승인된 프로토콜 구조와 일치, 페이지 title/네비 위치 불변, 타 페이지 무접촉. 결합 빌드 게이트는 Step 1 커밋 시 재실행 예정.
