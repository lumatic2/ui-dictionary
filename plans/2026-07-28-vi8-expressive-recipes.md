# PLAN — VI8: 실증 확장

> 생성: 2026-07-28 · 갈래: product 기능/화면(recipe 실구현) · scope: VI7 A 대기 2건의 recipe 실구현 + three-scene 계약 상호 링크. goal `visual-impact-consolidation` 연쇄 3/3 — VI7 영수증 `--chain VI8` 집행.
Status: approved (연쇄 승인 집행 — 새 사용자 소유 결정 없음, 범위는 VI7 판정 산출)

## 북극성 → milestone → step (위계)
- **북극성**: Askewly Design (← `CLAUDE.md` 「북극성」 절) — "시각적 영감에서 → 구현 가능한 코드·에셋·에이전트 가이드로" 축.
- **goal**: `visual-impact-consolidation` · **milestone**: VI8 — 실증 확장.
- **리서치 입력**: `research/2026-07-28-vi7-toolshelf-placement.md` §VI8 입력 — ① GSAP 스크롤 시퀀스(②, 결정표 "핀 고정·스크럽" 행 실수요) ② Paper Shaders 그라디언트(④, 쇼케이스 실사용·`@paper-design/shaders-react` 이미 의존성) ③ three-scene 계약 상호 링크. 구현 골격 실측: recipe = `recipes/<group>/<slug>.md`(frontmatter 계약) + 데모 컴포넌트 + `recipe-gallery-data.ts`/`recipe-gallery-demo-registry.ts` + `packages/component-registry` `build:catalog`.

## Scope Boundary
- **포함**: ① recipe `pinned-scroll-sequence`(② GSAP — gsap 의존성 신규, 번들 비용 실측 기록) ② recipe `shader-gradient-surface`(④ — lazy 경계·reduced-motion·WebGL 폴백, ①티어 `mesh-gradient-surface` 와 경계 명시) ③ `lazy-three-object-scene.md` ↔ presentation-slides three-scene 계약 상호 링크(스킬 쪽은 custom-skills 원본 수정 + setup.sh 배포 — 배포본 직접 편집 금지 규칙 준수) ④ 갤러리 등재·catalog/llms 재생성·브라우저 실동작 검증.
- **제외**: 추가 recipe(2종 한정 — A 대기 소진) · 3d-repolis · 결정표 구조 변경 · 사람 관측(DoD 비요구 — 브라우저 계측·디자인 verify 로 마감).
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / user_stopped
- rollback/cleanup: 신규 파일 중심 + package.json 의존성 1건 — 커밋 revert 로 원복. 기존 데모 무접촉.

## 스캐폴딩 결정
- source-of-truth: recipe frontmatter 가 SSOT(`recipe-format.md` 계약) — catalog·갤러리는 파생. 토큰은 semantic 참조만(하드코딩 금지).
- 검증: `python scripts/validate-recipes.py`(있는 그대로의 검사기) + `build:catalog` + 브라우저 실동작(Playwright — 데모 2종 렌더·인터랙션·콘솔 0에러) + build·lint + llms 재생성.
- 배포/운영: push 세션 말 일괄. custom-skills 쪽 1줄 링크는 해당 레포 커밋 + `setup.sh` 배포.
- 자기선언 도메인 — **④·② 티어 의무**: shader 데모는 dynamic import 격리 + `prefers-reduced-motion` 게이팅 + WebGL 실패 정적 폴백(lazy-three-object-scene 선례). GSAP 데모는 reduced-motion 분기 + 타임라인 kill cleanup(카드 지침). 실험적 표현 = 수동 opt-in 원칙(판정 절차 5) — 갤러리 데모로만 노출, 기본 UI 미적용.
- 검토 후 제외: ScrollTrigger 외 GSAP 플러그인(카드 지침: 필요 전 미도입 — 단 핀·스크럽엔 ScrollTrigger 자체가 필요) · 새 토큰 추가(기존 semantic 토큰으로 충분).

## 결정 로그
- status: resolved
- **범위 = VI7 판정 산출**(A 대기 2건 + DoD 기재 상호 링크) — 새 사용자 소유 결정 없음. 라이선스: GSAP 는 Webflow 인수 후 전 용도 무료(motion-references 기재·카드 재확인 지침 포함), Paper Shaders MIT.
- **기술 결정**: GSAP recipe 그룹 = marketing(스크롤 스토리텔링 표면) · shader recipe 그룹 = marketing(히어로/브랜드 표면, mesh-gradient 와 나란히) · 스킬 쪽 링크는 custom-skills 원본 경로로.
- **새 사용자 소유 결정: 없음.**

## Step 트리

- [x] **step-1 — pinned-scroll-sequence recipe (② GSAP)**
  - Artifact: `recipes/marketing/pinned-scroll-sequence.md` + `examples/ui-vocabulary-site/src/components/pinned-scroll-sequence.tsx`(핀+스크럽 3단계 시퀀스 데모, 컨테이너 스코프, reduced-motion 분기, unmount kill) + gsap 의존성(번들 diff 실측).
  - Files: write recipes/marketing/pinned-scroll-sequence.md, examples/ui-vocabulary-site/src/components/pinned-scroll-sequence.tsx, examples/ui-vocabulary-site/package.json, src/lib/recipe-gallery-data.ts, src/lib/recipe-gallery-demo-registry.ts. read toolshelf cards/GSAP.md, recipes/marketing/scroll-driven-reveal.md(경계 서술 대칭).
  - Risk: 위험 (신규 런타임 의존성 — 번들 diff 실측·갤러리 외 무접촉으로 격리)
  - Dependencies: 없음
  - Verify: build PASS + 번들 diff 기록 + validate-recipes PASS(해당 파일).
  - Failure probe: ScrollTrigger 를 페이지 전역 스크롤에 걸면 갤러리 밖 레이아웃과 충돌 — scroller 를 데모 컨테이너로 스코프.
  - Commit: changeset `vi8-expressive-recipes` (README 절: step-1).

- [x] **step-2 — shader-gradient-surface recipe (④ Paper Shaders)**
  - Artifact: `recipes/marketing/shader-gradient-surface.md` + `examples/ui-vocabulary-site/src/components/shader-gradient-surface.tsx`(lazy 경계 + Suspense + 정적 그라디언트 폴백 + reduced-motion 시 speed 0) — ① `mesh-gradient-surface`(CSS 근사)와의 티어 경계를 Intent 에 명시.
  - Files: write recipes/marketing/shader-gradient-surface.md, examples/ui-vocabulary-site/src/components/shader-gradient-surface.tsx, src/lib/recipe-gallery-data.ts, src/lib/recipe-gallery-demo-registry.ts. read toolshelf cards/shaders.md, recipes/marketing/mesh-gradient-surface.md, src/components/lazy-three-object-scene.tsx(lazy 선례).
  - Risk: 위험 (WebGL 표면 — 폴백·reduced-motion 미비 시 접근성 회귀. lazy-three 선례 계약 이식으로 격리)
  - Dependencies: 없음
  - Verify: build PASS + validate-recipes PASS.
  - Failure probe: 토큰 색을 shader uniform 에 하드코딩 hex 로 넣으면 토큰 SSOT 위반 — CSS 변수 판독(getComputedStyle) 경로 사용.
  - Commit: changeset `vi8-expressive-recipes` (README 절: step-2).

- [x] **step-3 — three-scene 상호 링크 + 통합 검증 (VI8 마감)**
  - Artifact: `recipes/application-ui/lazy-three-object-scene.md` 에 presentation-slides three-scene 계약 링크 절 + custom-skills `promoted/presentation-slides-yusung/references/interactive.md`(실경로 확인 후) 역링크 1줄 + setup.sh 배포. catalog·llms 재생성, Playwright 실동작(2데모 렌더·스크럽/셰이더 동작·콘솔 0), evidence.
  - Files: write recipes/application-ui/lazy-three-object-scene.md, ~/projects/custom-skills/<presentation-slides 원본 경로>/references/interactive.md, evidence/visual-impact-consolidation/vi8-recipes.md. 실행: build:catalog·generate-llms-txt·Playwright.
  - Risk: 위험 (setup.sh 전체 배포 — 다른 스킬 소스가 dirty 면 중단하고 1줄 변경만 커밋, 배포는 finding 으로)
  - Dependencies: step-1, step-2
  - Verify: Playwright 2데모 PASS(콘솔 에러 0) · validate-recipes 전체 PASS · build·lint PASS · llms/catalog 에 신규 recipe 2건 존재.
  - Failure probe: 갤러리 등재 누락 시 데모가 사이트에 안 보이는데 build 는 통과 — Playwright 로 실제 갤러리 라우트에서 확인.
  - Commit: changeset `vi8-expressive-recipes` (README 절: step-3).

## 검증/DoD
- **DoD**: recipe 2종(문서+실동작 데모+갤러리 등재+catalog/llms 반영) + 브라우저 실동작 검증(콘솔 0에러) + reduced-motion·폴백 계약 + three-scene 상호 링크 + build·lint·validate-recipes PASS.
- **Evidence**: `evidence/visual-impact-consolidation/vi8-recipes.md`
- **회귀 게이트**: 기존 recipe 갤러리 스모크(기존 데모 1종 렌더 확인) · build·lint PASS.

## 수치 출처
- recipe 2종 = VI7 장부 §VI8 입력(A 대기 2건, 2026-07-28). 기존 recipe 수·구조 = `recipes/` 실측 + `recipe-gallery-data.ts` 헤더.

## finding 큐
- (실행 중 발견 항목을 여기 적는다)
- 쇼케이스 `home-page.tsx` ShaderGradientDemo 는 여전히 하드코딩 hex 5색 — recipe 정본(토큰 판독)과 불일치. 교정은 기존 데모 verify 위반 77건 정리(다음 goal 후보)와 함께.
- Paper Shaders 는 oklch 미파싱 — 토큰을 shader 에 먹일 땐 항상 sRGB hex 정규화 필요(재사용 유틸 후보).

## 진행 로그
- 2026-07-28 작성 (연쇄 집행 — VI7 완료 직후).
- 2026-07-28 step-1~3 완주 — recipe 2종 실구현·상호 링크·Playwright 5/5 PASS(적발 2건 수리)·catalog/llms 반영. DoD 충족.
