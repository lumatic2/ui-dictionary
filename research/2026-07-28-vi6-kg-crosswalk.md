# VI6 — KG ↔ knowledge 전수 대조·판정 장부 (2026-07-28)

> 소비처: `plans/2026-07-28-vi6-knowledge-consolidation.md` step-2 (knowledge 층 갱신)
> 입력: `research/2026-07-28-visual-impact-goal-inventory.md` + KG 18노드 본문 다이제스트(sonnet 위임) + 의심 노드 3건 본문 직독(오케스트레이터)
> 계수 정정: 인벤토리는 "핵심 15+인접 3=18"로 셌으나 실제 나열은 핵심 16(3d-previs·agent-first-video 포함)+인접 3 = **19노드**. 본 장부는 19행 전수 — 빠짐 0.

## 판정 기준

- **흡수** = knowledge 문서 본문에 판단 규칙이 실제 문구로 들어간다 (TC1: 링크만 = 미소화).
- **링크** = 소재·요지 1~2줄 + KG 경로/출처를 남긴다 (본문 규칙화는 안 함 — 매체·단계가 달라 이 레포 판정 규칙이 아님).
- **제외** = 이 레포 범위(화면·지면 산출물의 비주얼 임팩트) 밖 — 사유만 기록.
- **정본 지정**: 화면 표현 기법의 "무엇으로 만드나" = `knowledge/expressive-stack.md`(이 레포)가 정본. KG 는 일반 지식 원본으로 유지하되 겹치는 판단 규칙은 expressive-stack 을 참조하는 방향. KG 쪽 수정은 범위 밖 → finding 큐.

## 판정표 (19행 전수)

| # | KG 노드 (nodes/) | 판정 | 착지 | 사유 |
|---|---|---|---|---|
| 1 | 개발/frontend-motion-accessibility-source-map | **흡수**+정본지정 | expressive-stack 판정 절차 | 도구 선택(CSS/GSAP/WebGL)은 expressive-stack 4티어와 겹침 — 티어 판정은 expressive-stack 정본. KG 에만 있는 **접근성 짝규칙**(disclosure 애니메이션에 `aria-expanded`+`aria-hidden`/pointer·focus guard 짝, "visual hiding 과 interaction state 가 어긋나면 위험")을 판정 절차로 흡수. 본문 대조 근거 아래 §겹침 대조 |
| 2 | 디자인/motion-animation-principles-product-motion | **흡수** | motion-principles.md(신규) | still appeal 게이트·단일 초점 등장·이징 기본/linear 예외 — 제품 모션 품질 규칙, 이 레포에 없던 층 |
| 3 | 디자인/motion-styleframe-visual-hierarchy | **흡수** | motion-principles.md | "모션은 약한 스틸을 못 구한다" + 그레이스케일·블러 진단 — still appeal 게이트의 실행 절차 |
| 4 | 디자인/motion-semantic-transition-design | **흡수** | motion-principles.md | 전환 목적 6분류(continue/create/replace/compare/focus/confirm) 우선 → 시각 실행 선택 — expressive-stack 규칙 6(전환 규모 비례)의 상위 판단 |
| 5 | 디자인/motion-typography-readability | **흡수** | motion-principles.md | 모션 타이포 role map·read order·밀도 통제·음소거 리뷰 — 슬라이드·모션 산출물 게이트 재료 |
| 6 | 디자인/motion-remotion-animation-pattern-library | 링크 | motion-references.md | 사전 렌더 영상 매체 — 이 레포 화면·지면 게이트와 다른 매체. 소재만 |
| 7 | 디자인/motion-remotion-scene-spec-workflow | 링크 | motion-references.md | 동상 (영상 매체 워크플로우) |
| 8 | 디자인/motion-remotion-official-resource-selection | 링크 | motion-references.md | 동상 |
| 9 | 디자인/motion-remotion-frame-render-guardrails | 링크 | motion-references.md | 동상 (Remotion 구현 가드레일) |
| 10 | 개발/ui-state-motion-vocabulary | **흡수** | motion-principles.md | "사용자 동작을 먼저 이름 짓고 CSS 기법을 나중에" + 제품 언어/구현 언어 분리 — 스펙·리뷰 언어 규칙. 본문 직독 확인 |
| 11 | 개발/css-disclosure-transition-pattern | **흡수** | expressive-stack 결정표 행 추가 | grid-template-rows 0fr↔1fr + overflow hidden + aria 계약 — 결정표에 없던 ① 티어 기법(height:auto 회피). 본문 직독 확인 |
| 12 | 개발/web-3d-asset-pipeline-quality-gate | 링크(+요지 1줄) | expressive-stack ④ 티어 주석 | 3D **에셋** 파이프라인 게이트(Khronos-clean ≠ 계약 보존) — 씬 구현(④) 인접 단계. VI8 에서 three.js recipe 확장 시 필수 참조 |
| 13 | AI/ai-3d-asset-generation-model-selection-gate | 링크(+요지 1줄) | expressive-stack ④ 티어 주석 | AI 3D 생성 레인 선택 — 동상, 에셋 생성 단계 |
| 14 | 디자인/spatial-repo-portfolio-agentic-wayfinding-pattern | **흡수** | motion-references.md 레퍼런스 절 | 공간형 랜딩(Bruno Simon 등 실사례 다수) + **decorative-skin failure gate**(정보구조·시각위계·증거접근 3층 매핑 안 되면 도시 메타포 실패) — 비주얼 임팩트 대표 사례군의 판단 규칙 |
| 15 | AI/3d-previs-ai-stylized-animation-pattern | 제외 | — | AI 영상 생성 프로덕션 도메인 — 화면·지면 UI 범위 밖 |
| 16 | AI/agent-first-video-production-pipeline-pattern | 제외 | — | 영상 프로덕션 파이프라인 — 동상 |
| 17 | 책/book-microinteractions | 링크 | motion-principles.md 관련 절 | trigger/rules/feedback/loops/modes 프레임 — 모션 원칙과 인접한 미시 UX 프레임, 규칙 중복 없음 |
| 18 | 디자인/canvas-native-design-agent-pattern | 제외 | — | 제작 도구 워크플로우(캔버스 내 AI) — 디자인 지식이 아니라 제작 표면 축(CLAUDE.md 별도 axis) 소관 |
| 19 | 디자인/spatial-branding-reference-source-map-2026-07 | 제외 | — | 오프라인 공간·건축 디자인 — 화면·지면 산출물 범위 밖 (인벤토리 단계에서 이미 경계 판정) |

집계: 흡수 8 · 링크 7 · 제외 4.

## 겹침 대조 (의심 노드 본문 직독 근거)

**hub(#1) vs expressive-stack**: KG hub — "Choose the lightest animation surface that can express the intended state: CSS for ordinary UI state changes… GSAP for coordinated multi-step timelines, scroll-synchronized sequences… WebGL/Three for a continuously rendered spatial, shader, or large-particle scene." ↔ expressive-stack 판정 절차 1 "하위 티어 우선" + 4티어 표. **같은 판단을 3분류/4티어로 달리 쪼갬** (expressive-stack 이 Canvas 2D 티어·lazy-load 의무·비용 수치까지 더 정밀). → 티어 판정 정본 = expressive-stack. KG 에만 있는 것: ① 접근성 짝규칙("aria-expanded on the control / aria-hidden, pointer guards, or focus guards for collapsed content when it remains mounted") ② reduced-motion 을 **전 수단 공통 전제**로 요구(expressive-stack 은 ③④ 티어만 의무) — 이 2건을 흡수.

**css-disclosure(#11)**: "collapsed: grid-template-rows: 0fr / expanded: 1fr / inner content: overflow: hidden … the control owns aria-expanded" — 결정표 21행에 대응 행 없음(신규 기법). 부적합 조건(대영역 지연·가상화 높이 불안정·reduced-motion)도 함께 흡수.

**ui-state-motion-vocabulary(#10)**: "name the user-facing behavior first, then the CSS technique" + 제품 언어("open details") vs 구현 언어("disclosure transition") 분리 — expressive-stack 은 기법→티어만 다루고 호명 규칙이 없음. 중복 아님, 보완 — 흡수.

## KG 쪽 후속 (finding 큐 이월 — 이 milestone 범위 밖)

1. hub 노드 sources 의 내부 참조가 stale: `nodes/개발/디자인-구현/css-disclosure-transition-pattern.md`·`nodes/디자인/모션/semantic-transition-design.md` 는 존재하지 않는 경로 (실경로 `nodes/개발/…`·`nodes/디자인/motion-semantic-transition-design.md`) — 실측 2026-07-28.
2. hub 의 도구 선택 절에 expressive-stack(4티어 정밀판) 참조 추가 검토 — 정본 단일화의 KG 측 절반.
3. #10·#11 노드 review.state=unreviewed(외부 URL 네트워크 검증 미완) — KG 검수 큐.
