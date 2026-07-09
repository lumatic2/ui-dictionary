# 20260710 Production Exposure Gate

## Target

- ROADMAP milestone: SFB1 - Structure Contract And Clean Production (Step 2)
- Plan: `docs/plans/2026-07-10-sfb1-structure-contract.md`
- Contract: `docs/design-system/site-blueprint.md` Production Exposure Policy

## Scope

- `src/lib/exposure.ts` (신규): 중앙 게이트 — `SHOW_UNFILLED = import.meta.env.DEV` + 컬렉션/필터/경로 노출 판정. 게이트 조건: `termIds: []` 컬렉션 + `plus-templates*` 전체.
- `src/App.tsx`: Plus/Patterns 카탈로그에서 미노출 컬렉션 필터링, 빈 그룹/섹션 제거 (Templates 섹션, Page Examples, Blog/Contact/Content/Logo Clouds).
- `src/components/home-page.tsx`: placeholder Atlas 카드 4개(landing/command/commerce/mobile) 비노출, DashboardShowcase placeholder 섹션 비노출, footer Download 링크·hero "Get Started"(Download 진입) 비노출.
- `src/components/term-page.tsx`: "다른 위치" 크로스링크가 게이트된 컬렉션으로 연결되지 않게 필터.
- 삭제 없음 — 데이터·정의·컴포넌트 전부 보존, dev 모드에서는 전체 노출 (SFB2 증축 도면).

## Contract

- 게이트는 노출 필터이지 삭제가 아니다. `npm run dev` = 전체 노출, production build = 게이트 작동.
- 숨김 규모: 컬렉션 42개(빈 termIds 8 + Templates 34), Atlas placeholder 카드 4 + placeholder 섹션 1, Download 진입점 4.
- Out of scope: 실개수 배지 신설(기존 UI에 개수 표시 없음 — 최소 변경 원칙), Pro 하위 skeleton(SFB2), 라우팅 전환.

## Verification

- [x] `npm run lint` PASS (구현 에이전트 + 부모 독립 재실행, 기존 무관 경고 3건만).
- [x] `npm run build` PASS (독립 재실행).
- [x] Production preview(4180) 브라우저 스모크: 홈 — placeholder/coming soon/Get Started/Download/dashboard placeholder 0건, Atlas 카드 8개 정상. Patterns — Templates/Blog/Contact/Logo Clouds/Page Examples 0건, Marketing/Application UI 정상. Docs/Pro 렌더 정상, Pro에 죽은 Download/Templates 링크 없음.
- [x] 실패 모드: dev 모드에서 전체 노출 확인 (12 Atlas 카드·Get Started·Templates 표시 — 구현 에이전트 dev 서버 검증).
- [ ] 프로덕션 배포 반영 확인 (`https://ui.askewly.com/`) — push 승인 후.
