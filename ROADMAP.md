# ROADMAP

> Last updated: 2026-07-12
> Status: Public Product & Monetization — PX completed (2026-07-12), 다음 AM은 사용자 토론 필요
> North star: Build Askewly Design as both a public reference website and an agent-usable implementation system.
> line budget: <=150

## Current Horizon

<!-- harness:goal id="public-product-monetization" status="active" -->
Goal: 공개 탐색 경험을 완성하고 에셋 모델을 정합시킨 뒤 계정·결제·Pro를 열어 결제 사용자가 실제로 구매·사용하는 제품으로 만든다. Details: `docs/horizons/2026-07-public-product-monetization.md`.

## Active Milestones

<!-- harness:milestone id="PX" status="completed" priority="P0" evidence="docs/plans/2026-07-12-px-public-experience.md" -->
### PX — Public Experience Pass
- DoD: 헤더 검색이 어느 페이지에서든 결과로 이동하고 전 표면(terms·docs·Patterns·Recipes·Colors)을 인덱싱, Getting set up이 디자인 작업 프로토콜을 서술, Docs/어휘/독립 표면 역할 재정의가 네비에 반영, Docs·Patterns·Recipes 사이드바 독립, 페이지별 meta/OG + 모바일 점검.
- Evidence: `docs/plans/2026-07-12-px-public-experience.md`
- Gap: 헤더 검색 자유 텍스트가 결과로 이동 안 함(버그) + stale 인덱스, Docs 역할 중복(Foundations↔어휘↔독립 표면), Docs·Patterns 사이드바 공유·Recipes 사이드바 부재.
- Status: [x]

- Completed at: 2026-07-12
- Summary: 검색 수리(+포털 클릭 결함 추가 적발)·전 표면 인덱싱, Getting set up 프로토콜, Vocabulary 그룹 통합, 섹션별 독립 사이드바, per-page meta/SEO — changesets #94–98

## Next Candidates (활성화 시 §B0.5 Beat 3 확정)

- **AM — Asset Model Alignment**: 무료/유료 경계·라이선스·다운로드 포맷 (사용자 소유 결정 다수 — §B0-1 토론 필수).
- **AC — Accounts/Auth**: 계정·인증 (askewly SSO 라우팅 자산 활용).
- **PG — Payments/Pro Gate**: 결제 연동 + Pro 게이트 해제 (크레덴셜 = 사용자 정지 지점).
- **PP — Premium Packs**: 프리미엄 코드 복사·에셋 다운로드·implementation pack.

## 유지보수 후보 (milestone 아님)

- 데스크톱 브리지 모드 human Undo/Redo 활성화 (QA2 dogfooding 결함 #2)
- 신뢰 프로젝트 소실 시 에러 표면 (QA2 dogfooding 결함 #3 — 현재 조용한 데모 폴백)
- 프로덕션 셸 정리: 기본 1,000-node fixture·dev 계기판 제거 (QA2 dogfooding 결함 #4)
- shortcuts dialog 배경 콘텐츠 inert/aria-hidden (스크린리더 가상 커서 — 키보드 트랩은 완료)

## Archive Pointer

Completed or archived milestone history lives in `BACKLOG.md`; Quality & Dogfooding (QA2–QA3) closed 2026-07-12, Living Design System (RL–SD) closed 2026-07-12, Canvas Production Environment (UX3–AI) closed 2026-07-12, Canvas Product UX (UX1–UX2) superseded 2026-07-12, Agent-Native UI Canvas (AUC0–AUC4) closed 2026-07-11.
