# Plan - PX Public Experience Pass

Date: 2026-07-12
Milestone: PX (`ROADMAP.md`, active — Public Product & Monetization horizon 활성화 첫 milestone)
Status: pending approval

## 위계

- Objective: `docs/OBJECTIVE.md`
- Horizon: `docs/horizons/2026-07-public-product-monetization.md` (active, 1/5 첫 번째)
- Milestone: PX — Public Experience Pass

## Scope

공개 사이트의 탐색 경험을 완성한다: ① 헤더 검색 수리·품질 갱신(자유 텍스트 커밋이 결과로 이동 안 하는 버그 + stale 인덱스), ② Getting set up의 프로토콜 문서 개편, ③ Docs 역할 재정의(어휘 사전과 시스템 문서의 겹침 해소), ④ 섹션별 독립 사이드 네비, ⑤ 성능·모바일·SEO 마감 패스.

검색 버그 정찰 근거: `TopbarSearch.commitQuery` → `App.updateQuery`는 `setQuery`만 하고 pageMode를 바꾸지 않는다 — home/colors/recipes/pro에서 Enter를 쳐도 결과 화면(explore layout 분기)으로 이동하지 않는다 (`App.tsx:337`). suggestion 클릭(collection형)은 `updateFilter`가 pageMode를 바꿔서 동작한다. 인덱스는 vocabulary terms + 하드코딩 starter 8건뿐 — docs 페이지·Recipes·Colors 미포함.

범위 밖: 결제·계정·Pro 게이트(AM/AC/PG/PP), 새 콘텐츠 제작, Get Started CTA 부활(앱 안정화 후 별도).

중단점: 검증 회귀 반복, IA 재편 중 예상 밖 사용자 소유 결정 발생. push는 세션 단위 일괄 + 사용자 승인.

## Planning gate

```yaml
planning_gate:
  team_validation_mode: manual-pass
  scope_posture: selective
  delegation_decision:
    remote_background_agents: use
    reason: "검색·문서·네비는 명세 고정 워커 작업. IA 결정·게이트·커밋은 오케스트레이터."
    target_roles: ["worker(검색 changeset, 문서 개편 changeset, 사이드네비 changeset, SEO changeset)"]
    execution_path: claude_subagent
  spec_skip_reason: "PX 입력 3건은 horizon 문서에 이미 기록(2026-07-12 사용자 확정). 신규 제품 계약 없음."
  perspectives:
    product: "방문자가 검색·네비로 원하는 화면에 실제로 도달하는 것 — 수익화 전 공개 경험의 신뢰 기반."
    architecture: "PageMode 라우팅·exposure 게이트 유지. 검색 인덱스는 기존 generated data 위에 얹는다."
    security: "외부 연동·secret 없음."
    qa: "build + lint 6-warning baseline + 브라우저 smoke(검색 이동·섹션별 사이드바) + 배포 전 로컬 preview."
    skeptic: "IA 재편이 기존 딥링크(?page=, nav: filter)를 깨뜨릴 수 있다 — 기존 URL 파라미터 하위호환을 각 step 검증에 포함."
  role_lanes:
    gate: "완료 전 DoD·smoke evidence 독립 대조 (오케스트레이터)"
  dod:
    - "헤더 검색: 어느 페이지에서든 자유 텍스트 Enter가 결과 화면으로 이동, 인덱스가 terms+docs+Patterns 컬렉션+Recipes+Colors 커버"
    - "Getting set up이 탐색→자산 확보→주입→검증 프로토콜(사람/에이전트 트랙)을 서술"
    - "Docs/어휘/독립 표면 역할 원칙이 네비 구조에 반영, 중복 축 해소"
    - "Docs·Patterns·Recipes 사이드바 독립, 기존 nav: 딥링크 하위호환"
    - "site build PASS + lint 6-warning baseline + 브라우저 smoke + 페이지별 meta/OG"
```

## Step 트리

- [ ] Step 1 — 헤더 검색 수리 + 인덱스 확장 (changeset): 자유 텍스트 커밋 시 결과 화면 이동, suggestion 인덱스에 docs 페이지·Patterns 컬렉션·Recipes·Colors 추가, starter 항목 갱신. (verify: build + lint + 브라우저 smoke — home에서 검색→결과 이동·recipe 검색→갤러리 이동 관측)
- [ ] Step 2 — Getting set up 프로토콜 개편 (changeset): 탐색→자산 확보→주입→검증 4단 왕복 루프, 사람/에이전트 트랙 병렬 서술. (verify: build + 페이지 렌더 smoke)
- [ ] Step 3 — Docs 역할 재정의 (changeset): 어휘 카테고리 축을 용어 참조로 통합, Foundations/어휘 중복(Accessibility·Motion) 해소, Elements↔Patterns 경계 명시. (verify: build + nav 전수 클릭 smoke + 기존 nav: filter 하위호환)
- [ ] Step 4 — 섹션별 독립 사이드 네비 (changeset): Docs 문서 트리 / Patterns 컬렉션 브라우저 분리, Recipes 컬렉션 앵커 사이드바 신설. (verify: build + 브라우저 smoke — 3개 섹션 사이드바 각각 관측, 모바일 레이아웃 확인)
- [ ] Step 5 — 성능·모바일·SEO 패스 (changeset): 페이지별 title/meta/OG, 모바일 뷰포트 점검, 이미지·번들 예산 확인. (verify: build + preview에서 meta 확인 + 모바일 뷰포트 smoke)

## 결정 로그

- [확정 2026-07-12] horizon 활성화: 사용자 지시 "이제 horizon 진행 해보면 어때". 연쇄 범위는 PX 단독 — AM은 사용자 소유 결정 다수(무료/유료 경계·라이선스)로 별도 §B0-1 토론 필요.
- [확정 2026-07-12] IA 원칙: Docs = 읽는 것 / 어휘 사전 = 용어 참조 / 보는 것(Colors·Patterns·Recipes) = 독립 표면 (사용자 "좋아").
- [확정 2026-07-12] Get Started CTA는 앱 안정화 후 부활 — PX 범위 밖.
- [AI 기본값] 검색 결과 화면은 기존 explore layout 재사용(신규 결과 페이지 제작 없음).
- [기존 관례] push는 세션 단위 일괄 + 사용자 승인.
- 남은 사용자 소유 결정: 없음.
- status: resolved
