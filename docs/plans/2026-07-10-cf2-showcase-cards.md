# Plan - CF2 Showcase Atlas Source-Quality 카드

Date: 2026-07-10
Milestone: CF2 (`ROADMAP.md`) — completed 2026-07-10, evidence: changesets 39-41

## 위계

- Objective: `docs/OBJECTIVE.md`
- Horizon: `docs/horizons/2026-07-content-fill.md` (active)
- Milestone: CF2 — Showcase Atlas Source-Quality 카드
- 완성 판정 계약: `docs/design-system/site-blueprint.md` Showcase Atlas 카드 행 (source-quality 하한선 + reduced-motion fallback + CLAUDE.md 카드 copy 규약)

## Scope

placeholder 카드 4종 + Dashboard 섹션을 인터랙티브 데모로 채워 공개. landing(Hero Composition)은 선반 작업으로 이미 완성(changeset #37, 게이트 뒤). 과거 실패 원인(정적 손그림 이미지)과 접근을 바꿔 기존 완성 8카드와 같은 토큰·레시피 기반 실동작 데모로 제작. 카드별 완성 판정 미달 시 채우기 대신 제거(부모 게이트 판단).

중단점: ① 카드별 판정 미달 시 그 카드만 제거 후 계속 ② 배포는 push 승인 후.

## Step 트리

- [x] Step 0 — landing(Hero Composition) 데모: 선반 작업 완료 (changeset #37, `HeroCompositionDemo`).
- [x] Step 1 — command/commerce/mobile 카드 3종 데모: Command Center Interface(커맨드 팔레트/topbar-command-search 레시피 파생), Commerce Flow(체크아웃/장바구니 미니 플로우), Mobile App Patterns(모바일 설정/네비 미니 목업) — 각각 실사 mock 데이터·인터랙션·reduced-motion·색 리터럴 0. (verify: dev 렌더+인터랙션 + lint/build + 색 리터럴 grep 0)
- [x] Step 2 — Dashboard 섹션(DashboardShowcase): placeholder를 토큰 기반 product operations dashboard 실데모(정적이어도 실사 mock 데이터·라이트/다크)로 교체. (verify: dev 렌더 + lint/build)
- [x] Step 3 — 게이트 열기 + 배포: 카드별 완성 판정(부모 직접) → `placeholderAtlasItemIds`/Dashboard 게이트 해제 → 프로덕션 preview 스모크(그리드 12칸·레이아웃) + Chrome evidence(데스크톱/모바일·라이트/다크·reduced-motion) → push 승인 후 실사이트 확인. (verify: 판정 미달 카드는 제거 기록; 실패 모드 — Pro/Download/Patterns 빈 컬렉션 여전히 비노출)

## 결정 로그

- [확정 2026-07-10] 접근 = 인터랙티브 데모로 채우기, 카드별 미달 시 제거 (horizon 승인에 포함).
- [AI 기본값] 카드 copy는 CLAUDE.md 규약(용어 정의 한 문장, em dash 금지) 준수 — 기존 copy 유지 우선, 데모에 맞춰 바꿀 필요 있으면 규약 내에서.
- [사용자 소유 — 예정] 배포 push는 Step 3에서 승인 요청 (프로덕션 변화: 홈 Atlas 8→최대 13칸).
