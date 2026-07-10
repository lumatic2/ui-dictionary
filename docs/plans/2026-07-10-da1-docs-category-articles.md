# Plan - DA1 Docs 카테고리 아티클 7종 심화

Date: 2026-07-10
Milestone: DA1 (`ROADMAP.md`, active)

## 위계

- Objective: `docs/OBJECTIVE.md` — 공개 레퍼런스 사이트 + 에이전트용 디자인 시스템
- Horizon: `docs/horizons/2026-07-docs-depth-page-examples.md` (active)
- Milestone: DA1 — Docs 카테고리 아티클 7종 심화
- 완성 판정 계약: `docs/design-system/site-blueprint.md` — Docs 아티클 행 + source-quality 공통 하한선

## Scope

이번 milestone: docs nav 카탈로그 폴백 카테고리 7종(Layout / Styling / Interaction / Accessibility / Motion Effects / UI Blocks / Component API)을 서술형 아티클로 저작 + 게이트 해제 + 로컬 검증. Page Examples(PE1)·Pro/Download는 범위 밖.

콘텐츠 소스(SSOT — 파생, 발명 금지): `tokens/askewly.tokens.json` + 생성 CSS(`src/tokens.css`·`index.css @theme`), `docs/design-system/pattern-taxonomy.md`, `recipes/`, 기존 장문 아티클 22종(`src/lib/documentation-pages.ts`)의 관례. ※ `knowledge/color.md` 등 3개는 CLAUDE.md 구조도에만 있고 실재하지 않음(CF1에서 적발) — 참조 금지.

중단점: ① 아티클이 SSOT와 어긋나면 blocked(SSOT 우선) ② push는 세션 말 일괄(deploy batching).

## Step 트리

- [x] Step 1 — 구조·시각 축 3종 아티클: Layout / Styling / Motion Effects — tokens SSOT와 사이트 관찰 관례에서 파생, 한국어 저작 완료. (verify: dev 렌더 + lint/build PASS, 2026-07-10)
- [x] Step 2 — 상호작용·접근성 축 2종 아티클: Interaction / Accessibility — Elements/Foundations와 역할 분담(컴포넌트 계약 vs 카테고리 관점) 명시 서술. (verify: dev 렌더 + lint/build PASS)
- [x] Step 3 — 시스템 축 2종 아티클: UI Blocks / Component API — pattern-taxonomy·Elements 관례 파생. (verify: dev 렌더 + lint/build PASS)
- [x] Step 4 — 완성 판정 + 게이트 해제 + 로컬 검증: 7종 판정 통과 → shell 7곳 해제, lint/build + dev/prod preview 스모크(해제 전 비노출 7/7 → 해제 후 노출 7/7 + docs-all 랜딩 클릭 E2E + 모바일 overflow 0 + nav 게이트 홀드 라이브 패리티) + evidence 4장. 배포 반영 확인만 세션 일괄 push 후 잔여. (verify: `changesets/20260710-docs-category-articles/README.md` 4/5)

## 결정 로그

- [확정 2026-07-10] 방향: Docs 아티클 심화 + Page Examples를 한 horizon으로, DA1 먼저 (사용자 확정).
- [확정 2026-07-10] milestone 구성 2개(DA1+PE1), Docs 7종 = 1 milestone (CF1 선례 grain, 사용자 확정).
- [확정, CF1 계승] 아티클 언어 = 한국어 서술 + 영어 섹션 헤딩, Tailwind docs 스타일, SSOT 파생 원칙.
- [AI 기본값] 카테고리 페이지의 기존 카탈로그 목록(term 링크)은 제거하지 않고 아티클 하단에 보존 — 아티클은 목록을 대체가 아니라 서술 계층으로 보강.
- [사용자 소유 — 예정] push는 세션 말 일괄 승인 (deploy batching 규칙).
- 그 외 예상 결정: 없음.
