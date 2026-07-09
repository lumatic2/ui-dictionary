# 20260710 Dashboard Section Demo

## Target

- ROADMAP milestone: CF2 - Showcase Atlas Source-Quality 카드 (Step 2)
- Plan: `docs/plans/2026-07-10-cf2-showcase-cards.md`

## Scope

- `src/components/home-page.tsx`: `DashboardShowcase` placeholder를 토큰 기반 실마크업 product operations dashboard로 교체 — 스탯 행 4종(배포·에러율·p95·업타임, 실사 수치+추세), 최근 배포 목록(서비스/버전/상태), 7일 배포량 CSS 바 차트(askewly-violet 토큰, 라이브러리 무추가), 서비스 상태 리스트 5종.
- 과거 실패 방식(정적 이미지)과 달리 실마크업 — 기존 DarkInversionSection bento-tile 관용구·상태색 idiom 재사용, 신규 임의 값 0.
- `DarkInversionSection` 프로덕션 게이트 무변 — 공개는 Step 3.

## Verification

- [x] `npm run lint` PASS, `npm run build` PASS (구현 에이전트).
- [x] dev 렌더·가독 확인, prod 비노출 유지 (구현 에이전트).
- [x] 정적 마크업 — reduced-motion 자동 안전.
