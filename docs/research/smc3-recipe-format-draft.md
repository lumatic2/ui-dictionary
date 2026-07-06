# SMC3 레시피 포맷 초안 (제안 — 미확정)

Date: 2026-07-07
Status: draft — SMC3 개시 시 오케스트레이터 심사 후 확정
Method: sonnet 설계 에이전트 초안 + Fable 1차 게이트 메모 (하단)

## 제안 요지

- **위치**: `recipes/<pattern_group>/<id>.md` — pattern_group은 pattern-taxonomy §3의 10종 고정, 파일명 = frontmatter `id` (kebab-case, 전역 유일).
- **코드는 내장하지 않고 포인터**: `dependencies.code_asset`이 실제 사이트 소스 경로를 가리키고, 본문 Code 섹션은 핵심 20~40줄 발췌만 (drift 방지 — 단일 markdown 내장 대안은 코드 이중화로 기각).
- **frontmatter** (배열 스칼라만 — 에이전트가 frontmatter만 파싱해도 검색 가능): id, name, pattern_group, kind, status(draft/stable/deprecated), surface_refs, tokens_used(semantic 이름만 — hex/리터럴 금지), dependencies{code_asset, component_refs}, term_refs, pattern_ref?, agent_recipe_ref?, source_refs, last_verified.
- **본문 8개 고정 섹션**: Intent / Anatomy / States / Variants / Code / Checks / Anti-patterns / Agent notes — 정규식으로 안정 추출 가능하게 헤더 이름 고정.
- **검증 계약** (`scripts/validate-recipes.py` 신설): 필수 필드, id↔파일명 일치, pattern_group 10종 대조, tokens_used가 SSOT 실존 + semantic 계층만(primitive 직접 참조 에러), 코드 블록 hex 금지, 필수 섹션 존재, code_asset 경로 실존, term_refs/surface_refs 대조.

## 첫 배치 후보 5개

1. **Button** (`ui/button.tsx`) — 포맷 저위험 검증 + component 토큰 3-tier 체인 유일 실사례
2. **Topbar Command Search** (`topbar-search.tsx`) — 키보드 상호작용으로 States/Checks 실증
3. **랜딩 Hero** (`home-page.tsx` 상단) — marketing 그룹, 레퍼런스 근거 기확보
4. **Showcase Card** (Matter 데모 등) — motion 안티패턴 실증, 최신 검증 로그 보유
5. **Popover** (`popover.tsx`) — #2가 이를 조합 → component↔pattern 2-depth 참조 체인 검증

커버리지: 5개가 pattern_group 4~5종에 걸침.

## Fable 게이트 메모 (확정 시 반영할 수정점)

1. frontmatter `kind`에 `overlay-pattern` 같은 신조어 사용 금지 — **term kind 6종 어휘 재사용** (component/block/form-pattern/visual-effect/motion-pattern/visual-treatment).
2. `last_verified`는 수기 갱신 필드라 stale 위험 — validate-recipes가 code_asset 파일 mtime과 대조해 경고하는 방안 검토.
3. Button의 pattern_group은 `forms`로 확정 제안 (layout 아님).

## Changelog

- 2026-07-07: sonnet 초안 수록 + 게이트 메모.
