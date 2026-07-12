# 20260712 갤러리 오버레이 데모 격리

Target: QA1 Step 3 — design-qa sweep 결함 G1/G2 수정.

## Scope

- **G1 cart-drawer**: `CartDrawerBody` 추출(포털 없는 본문) + 데모가 relative/overflow-hidden 컨테이너 안에 absolute 스크림·패널로 정적 오픈 렌더. 프로덕션 `CartDrawer`는 Sheet 경유 불변(sr-only SheetTitle로 a11y 라벨 유지).
- **G2 doc-search-cmdk**: `DocSearchCmdkGroupedResultsPanelBody` 추출 — 데모가 plain `Command` 루트에 인라인 렌더(캡션 유지). 프로덕션 컴포넌트는 CommandDialog 경유 불변.
- 오케스트레이터 게이트 추가 수정 2건: ① Body의 `SheetTitle`이 Dialog 컨텍스트 밖에서 크래시(백화면) → plain h2로 교체, ② 데모 루트 `w-full` 누락으로 `items-center` 플렉스에서 폭 0 수축 → `w-full max-w-3xl` 부여. (워커 검증이 build/lint뿐이라 런타임 크래시를 못 잡음 — sweep 재실행이 잡음)

## Verification

- [x] `npm run build` — exit 0 / `npm run lint` — 기준선 6 경고 유지
- [x] 재sweep: 두 recipe 모두 상세 렌더 + 라이트/다크 캡처 + Back 클릭 정상 (스크림이 데모 컨테이너 내부에 격리)
- [x] 실패 모드: SheetTitle 컨텍스트 크래시 재현→해소 관측 (수정 전 앱 전체 백화면)

## Result

Completed. sweep 결함 G1/G2 해소 — 오버레이 recipe 데모가 다른 contained 데모들과 같은 패턴으로 수렴.
