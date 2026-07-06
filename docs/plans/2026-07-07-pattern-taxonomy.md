# SMC2 - 패턴 분류 체계 구현 계획

Date: 2026-07-07
Status: active
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

- [ ] Step 1 - 정본 분류 문서 `docs/design-system/pattern-taxonomy.md`: 용어 통일(pattern/surface/pattern_group/group/collection 정의), surface 7종·pattern_group 10종 확정, term 축(category 9/kind 6/group)과 상위 축의 관계, 패턴→토큰·레시피·예시 연결 스키마(agent-asset-model 정합). + 기존 3개 문서(surface-taxonomy/site-blueprint/tailwind-reference-model)에 정본 포인터 주석 추가. (verify: pattern_group 목록이 4개 문서에서 단일 출처로 수렴)
- [ ] Step 2 - group 축 데이터화: search.ts의 categoryGroups(~74종)를 `docs/ui-vocabulary/groups.yml`로 추출 + terms.yml 527개 항목에 `group` 필드 주입(역매핑 스크립트) + validator 2곳(group 존재·groups.yml 대조) + build-ui-vocabulary-data.mjs가 group 포함 생성 + search.ts가 하드코딩 대신 생성 데이터에서 그룹 구성. (verify: validate-ui-vocabulary.py PASS, 모든 term에 group 존재, 사이트 build/lint PASS, Chrome smoke에서 Docs 그룹 페이지 동작 동일)
- [ ] Step 3 - 통합 검증: 신규 group 검증 실패 모드(존재하지 않는 group id 주입 → validator FAIL) + Chrome smoke(Docs 리프 페이지 1개, Plus 컬렉션 1개) + ROADMAP/plan 동기화. (verify: 실패 모드 FAIL 확인 + smoke 스크린샷)

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
