# changeset: code-first contract + deploy (RC2 step 1)

- Date: 2026-07-19
- Milestone: RC2 step-1 (`plans/2026-07-19-rc2-code-first-contract.md`)
- Target: RC2 — 코드 출발 계약 + 에이전트 E2E

## Scope

- `docs/design-system/entry-protocol.md` — A-2.5 신설(+C-1.5): 자산 보유 레시피는 **코드 출발이 기본 경로** — fetch `/r/<name>.json` → files[].content 이식 → deps 해결 → **리스타일 의무**(생략 = style-signature 실패). 문서-재구현은 자산 없는 레시피의 폴백.
- `docs/design-system/component-restyle.md` — "Registry 코드 자산 이식 후 리맵" 절: CSS 변수 정본=소비 프로젝트 토큰, semantic 클래스는 유지+변수 최소 수술, 최소 리맵 지점(radius·주 버튼·포커스 링) 후에만 보고.
- `docs/design-system/agent-asset-model.md` — `code_asset` 엔티티의 첫 실현체(registry 자산) 명시.
- `scripts/generate-llms-txt.mjs` — 레시피 llms 사본에 code-asset 백링크 자동 주입(헤딩 뒤, 헤딩 없으면 frontmatter 직후 — 실패 시 빌드 에러) + 인덱스 `[code: /r/<name>.json]` 태그.

## Contract

- source of truth: docs/design-system 3문서 + generate-llms-txt.mjs
- deploy: llms (push 후 자동)
- out of scope: headless E2E (step 2)

## Verification checklist

- [x] llms 재생성 87 assets — 인덱스 code 태그 26 + 레시피 사본 백링크 주입 26 (자산 27 중 api-reference-layout는 다중 매칭으로 미주입 — 퍼지 매칭 단일해석 규칙)
- [x] 자산 없는 레시피(landing-hero) 백링크 0 (잘못된 링크 없음 — failure probe)
- [x] 코드 출발 절 grep — entry-protocol A-2.5·C-1.5, restyle 리맵 절, asset-model 실현체 주석
- [ ] curl 배포 확인 (세션 push 후)
