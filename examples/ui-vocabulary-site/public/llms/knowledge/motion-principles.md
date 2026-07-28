# Motion Principles — 모션 품질 판정 규칙

Date: 2026-07-28
Milestone: VI6 (plan: `plans/2026-07-28-vi6-knowledge-consolidation.md`)
지위: 살아있는 정본. "이 모션이 좋은가"를 판정한다 — "무엇으로 만드나"(티어·도구)는 [[expressive-stack]] 소관이며, 두 문서는 순서가 있다: **원칙 먼저, 도구 나중.**
근거: knowledge-graph 노드 4+1건 흡수 (`research/2026-07-28-vi6-kg-crosswalk.md` 판정 #2~#5·#10). 각 절에 KG 원본 경로 병기 — 원 출처(remotion-data ANALYSIS 등)는 KG 노드 frontmatter 가 보유.

## 1. Still appeal 게이트 — 모션은 약한 정지 화면을 못 구한다

애니메이션 전에 **정지 프레임이 먼저 통해야 한다**: 타이포·구성·실루엣·대비가 정지 상태로 읽히지 않으면 모션을 얹어도 실패다. 중요한 프레임마다 답한다 — 눈이 먼저 읽는 것은 무엇인가 · 두 번째는 · 배경으로 물러나도 되는 것은 · focal anchor 는 어디인가 · 대비가 한 곳에 집중되는가 · beat 이 안착할 여백이 있는가.

- 씬당 승리 요소는 하나. 고채도·고휘도 강조도 하나. 비활성·배경 요소는 대비·채도·선명도를 낮춘다.
- 등장 순서는 위계와 일치시킨다 — 먼저 등장하는 것이 primary 로 읽힌다.
- 실무 진단: **그레이스케일 + 블러 리뷰**에서 의도한 primary 가 사라지면 위계가 약한 것이다 — 애니메이션 전에 고친다.

(KG `nodes/디자인/motion-styleframe-visual-hierarchy.md` · `nodes/디자인/motion-animation-principles-product-motion.md`, 접근일 2026-07-28)

## 2. 목적 먼저, 효과 나중 — 전환의 의미 6분류

전환 효과(fade/slide/match/morph/crop/stagger/shared element)를 고르기 전에 **전환의 목적**을 먼저 고른다:

| 목적 | 뜻 |
|---|---|
| continue | 같은 흐름의 지속 |
| create | 새 것의 진입 |
| replace | 상태 교체 |
| compare | 두 상태 비교 |
| focus | 주목 이동 |
| confirm | 결과 확인 |

- 복잡한 전환에서는 **shared/focal 요소 하나**를 안정적으로 유지하고 나머지가 그 주변에서 출입하게 한다 — shared element 가 많거나 경로가 교차하면 관계가 안 읽힌다.
- 지속시간은 프레임 수가 아니라 목적·이동 거리·표면적 변화로 정한다 (짧게/표준/확장). [[expressive-stack]] 규칙 6(전환 규모 비례)의 상위 판단이다.

(KG `nodes/디자인/motion-semantic-transition-design.md`, 접근일 2026-07-28)

## 3. 등장 안무 — 한 번에 하나

- 한 번에 **하나의 focal element** 만 등장시킨다. 동시 등장은 의도된 예외로만.
- 관계를 명확히 할 때만 보조 요소가 지연·정착(follow-through)하게 한다.
- 이징 기본값은 명시적 easing 또는 스프링 — **linear motion 은 이유 있는 예외**다.
- 타이밍은 톤에 맞춘다: 차분한 제품·코퍼레이트는 정제된 페이싱, 프로모·액션은 빠르게.

(KG `nodes/디자인/motion-animation-principles-product-motion.md`, 접근일 2026-07-28)

## 4. 움직이는 텍스트의 가독성

텍스트 비중이 큰 모션(슬라이드·모션 그래픽·히어로 타이포)은 시간 압박 아래의 커뮤니케이션이다:

- role map(headline/support/label/caption/CTA)과 read order(first/second/last)를 정하고, 모든 텍스트를 동시에 애니메이션하지 말고 **의미 우선순위로 스태거**한다.
- 텍스트가 빠르게 움직이면: 카피를 줄이거나 · 크기를 키우거나 · 자간을 넓히거나 · 블러를 줄인다.
- 보이스오버 주도가 아니면 **음소거 리뷰**로 텍스트만으로 전달되는지 확인한다.

(KG `nodes/디자인/motion-typography-readability.md`, 접근일 2026-07-28)

## 5. 호명 규칙 — 동작을 먼저, 기법을 나중에

스펙·코드 리뷰·지식 문서에서 모션을 서술할 때 **사용자가 보는 동작을 먼저 이름 짓고, CSS 기법을 그다음에** 짓는다.

- 구현 언어(스펙·리뷰용): disclosure, collapsible region, expand/collapse, fade, clipping, layout interpolation, pointer guard, focus guard, ARIA state.
- 제품 언어(사용자 대면 카피용): "open details", "show filters", "hide completed items" — 두 언어를 섞지 않는다.

(KG `nodes/개발/ui-state-motion-vocabulary.md`, 접근일 2026-07-28)

## 관련

- 미시 상호작용 프레임(trigger/rules/feedback/loops/modes)으로 작은 순간의 실패를 진단하려면: KG `nodes/책/book-microinteractions.md` (규칙 중복 없음 — 링크만).
- 티어·도구 판정과 접근성 짝규칙: [[expressive-stack]] §판정 절차.
- 외부 데모·사례 북마크: [[motion-references]].

## Changelog

- 2026-07-28: 초판 (VI6 — KG 모션 원칙 노드 4건 + 어휘 노드 1건 흡수).
