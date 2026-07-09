# 20260710 Atlas Cards: Command / Commerce / Mobile

## Target

- ROADMAP milestone: CF2 - Showcase Atlas Source-Quality 카드 (Step 1)
- Plan: `docs/plans/2026-07-10-cf2-showcase-cards.md`

## Scope

- `src/components/home-page.tsx`: placeholder 카드 3종을 인터랙티브 데모로 교체 —
  - `CommandCenterDemo`: topbar-command-search 레시피 파생 커맨드 팔레트 (실시간 필터·키보드 내비·실행 피드백·empty state)
  - `CommerceFlowDemo`: 실사 상품 3종·수량 스테퍼·Cart→Shipping→Payment 단계·배송비 로직($150 이상 무료)·주문 완료 상태
  - `MobileAppPatternsDemo`: 폰 프레임 설정 화면 — Radix Switch 토글 3종 실동작·리스트 행·탭바 전환
- 죽은 코드가 된 `AtlasContentPlaceholder` 제거 (tsc noUnusedLocals 게이트 요구).
- `placeholderAtlasItemIds` 게이트 무변 — 공개는 Step 3 일괄.

## Contract

- 데모 캔버스 톤은 기존 완성 8카드 관례(slate 톤 자립 캔버스, 사이트 테마 독립) 준수. 색 리터럴 2건은 기존 관용구 복사(violet-hover·폰 프레임 그림자).
- 자동 애니메이션 없음 → reduced-motion fallback 불요 (전부 사용자 트리거).

## Verification

- [x] `npm run lint` PASS, `npm run build` PASS (에이전트 + 부모 독립 재실행).
- [x] dev: 커맨드 필터("dark"→1건)·수량 2→$606 합계·Wi-Fi 토글·단계 전환·다크 모드 가독 확인 (구현 에이전트, Chrome).
- [x] prod preview: 신규 3카드 + Hero 비노출, 기존 8카드만 렌더.
