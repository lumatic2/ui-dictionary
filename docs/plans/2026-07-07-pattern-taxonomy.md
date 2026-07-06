# SMC2 - 패턴 분류 체계 구현 계획

Date: 2026-07-07
Status: completed 2026-07-07 (SMC2 closed — canonical taxonomy doc + group axis promoted to data; category 편중 재설계는 후속 큐)
Milestone: SMC2 (horizon `system-model-core`)
설계 입력: surface-taxonomy/agent-asset-model/site-blueprint/tailwind-reference-model 조사 + ui-vocabulary 데이터 조사 (2026-07-07, sonnet fan-out)

## 문제

1. "패턴"이 4개 문서에서 4가지 의미(UI 요소 나열 / 스키마 엔티티 / 사이트 URL 카테고리 / Tailwind 원본 카테고리)로 쓰이고, pattern_group 목록이 문서마다 7~10개로 흔들린다.
2. 분류가 네 겹으로 동시 운영된다: category 9종 + kind 6종(terms.yml, 검증됨) / **group ~74종(search.ts 하드코딩, term id 문자열 나열)** / navigation 컬렉션 ~216종(navigation-model.ts). group 축은 terms.yml을 늘릴 때마다 코드를 손으로 고쳐야 하는 이중 관리 상태.
3. 스키마 정의가 3곳(schema.md / validate-ui-vocabulary.py / build-ui-vocabulary-data.mjs)에 중복.

## 방침

- **분류 의미론은 재설계하지 않는다** — 기존에 검증된 축(category/kind)과 운영 중인 group 배정을 그대로 데이터로 승격. 카테고리 편중 재설계는 후속.
- 정본 문서 1개(`docs/design-system/pattern-taxonomy.md`)가 용어와 축을 확정하고, 나머지 문서는 그것을 가리킨다.
- group 축을 코드에서 데이터(`docs/ui-vocabulary/groups.yml` + terms.yml `group` 필드)로 옮기되 **사이트 동작은 동일하게 유지**한다.

## Step 트리

- [x] Step 1 - 정본 분류 문서 `docs/design-system/pattern-taxonomy.md` + 3개 문서 정본 포인터. (verify: pattern_group 10종 단일 출처 수렴 ✓, 커밋 0ffef13)
- [x] Step 2 - group 축 데이터화: groups.yml **57종**(조사 추정 ~74는 과대), terms.yml 527개 전부 group 주입(misc 신규 0), validator 강화, search.ts 하드코딩 제거(공개 API 불변 — navigation-model 등 무수정). (verify: validator PASS 527/57 ✓, build/lint PASS ✓, 배정 동일성 전후 비교 불일치 0 ✓)
- [x] Step 3 - 통합 검증: 실패 모드(미존재 group id → validator FAIL) ✓, Chrome smoke — Docs Layout 리프 + Plus Application UI 컬렉션 정상 렌더 (`docs/research/assets/smc2-pattern-taxonomy-2026-07-07/plus-appui.png`) ✓, ROADMAP/plan 동기화 ✓.

## 결정 로그

1. **pattern_group 정본 = agent-asset-model의 10종** (marketing, application-ui, commerce, docs, data-display, forms, navigation, overlays, feedback, layout) — 가장 완전한 목록, site-blueprint sitemap과 개수 정합.
2. **category 9종·kind 6종은 그대로 유지** — 편중(accessibility 8개 등) 재설계는 SMC2 범위 밖, 후속 큐.
3. **navigation 컬렉션(~216)은 분류 체계가 아니라 사이트 뷰로 규정** — 데이터로 옮기지 않고 코드에 남긴다. 단 컬렉션이 참조하는 group은 이제 데이터 정본.
4. **terms.yml `group` 필드는 필수화** — 역매핑에서 빠지는 term은 기존 `-misc` 캐치올 그룹으로 배정.
5. **documentation-pages(자유 작문 페이지)는 term 분류와 별개 계층으로 인정** — 분류 체계에 넣지 않음.

## 중단점

- Step 2가 사이트 동작을 바꾸면(그룹 배정 diff 발생) 정지 후 diff 보고.

## Changelog

- 2026-07-07: 최초 작성.
