# 비주얼 임팩트 자산 인벤토리 (2026-07-28)

> 소비처: 새 goal 「비주얼 임팩트 정리」 계획서 (plans/2026-07-28-vi6-*.md 예정)
> 방법: 병렬 탐색 3갈래 (knowledge-graph 레포 · toolshelf · 로컬 three.js/모션 작업물)

## 결론 요약

"비주얼 임팩트 방법"은 4곳에 흩어져 있고, 이 레포에는 이미 받을 그릇(VI1~VI5 표현 스택 체계)이 있다:

- **이 레포 (그릇, 완성)**: `knowledge/expressive-stack.md` 4티어 결정표(21행) · recipe 시스템(mesh gradient·glass·grain·scroll reveal·magnetic·spring drag·stagger·canvas particle·lazy three scene) · llms 배포. VI1~VI5 로 2026-07-17 완주.
- **knowledge-graph (지식, 미흡수)**: 핵심 노드 15건 — motion 클러스터(제품 모션 원칙·styleframe 위계·semantic transition·모션 타이포·Remotion 계열 5건)와 3D 클러스터(web-3d 파이프라인 게이트·AI 3D 생성 게이트·spatial repo portfolio 패턴). 허브 노드 = `frontend-motion-accessibility-source-map`(CSS/GSAP/WebGL 선택 규칙 — expressive-stack 결정표와 겹치되 별도 진화).
- **toolshelf (도구, 미배치)**: 비주얼 임팩트 카드 15건 — GSAP · motion · paper-design shaders · WebGL-Fluid-Simulation · jquery.ripples · simple-water-waves-shader · spark(gaussian splatting) · react-bits · magicui · animated-grid-lines · Brainwave landing 레퍼런스 · 3d-spatial-landing 8사이트 팩 · 60fps.design · landing.love · remotion. 표현 스택 티어에 미배치, 채택/보류 판정 없음.
- **로컬 구현 (2건 정본 밖)**:
  - `presentation-slides-yusung` 스킬: `three-scene` 레이아웃 완전 구현(CDN three@0.160, OrbitControls, 씬 프리셋 3종, PDF fallback 계약) — 슬라이드 매체 전용, ui-dictionary recipe 와 미연결.
  - `3d-repolis-portfolio`: Three.js 도시 시각화, 5,688줄 단일 index.html — 모듈화·레시피화 안 됨(재사용 불가 형태).
- **remotion-data**: 실시간 WebGL 아님(사전 렌더 영상 도메인) — 이번 범위 밖, KG 노드 경유로만 참조.

## 갈래별 상세

### 1) knowledge-graph 핵심 노드 15건

| 노드 | 요지 |
|---|---|
| 개발/frontend-motion-accessibility-source-map | CSS/GSAP/WebGL·Three 선택 규칙 — 허브 |
| 디자인/motion-animation-principles-product-motion | still appeal 게이트·단일 초점·톤 타이밍 |
| 디자인/motion-styleframe-visual-hierarchy | 정지 프레임 우선·시선 경로·대비 통제 |
| 디자인/motion-semantic-transition-design | 움직임=의미(초점·위계·인과·상태) |
| 디자인/motion-typography-readability | 모션 타이포 가독성 체크 |
| 디자인/motion-remotion-* 4건 | 패턴 라이브러리·씬 스펙 워크플로우·리소스 선택·frame-render 가드레일 |
| 개발/ui-state-motion-vocabulary | 상태 전환 정밀 어휘 |
| 개발/css-disclosure-transition-pattern | height:auto 없는 disclosure 애니메이션 |
| 개발/web-3d-asset-pipeline-quality-gate | 브라우저 3D 에셋 파이프라인 게이트 |
| AI/ai-3d-asset-generation-model-selection-gate | AI 3D 생성 도구 선택 게이트 |
| 디자인/spatial-repo-portfolio-agentic-wayfinding-pattern | Three.js 공간형 랜딩 사례(Bruno Simon 등) |
| AI/3d-previs-ai-stylized-animation-pattern · AI/agent-first-video-production-pipeline-pattern | 인접(영상) |

인접 3건: 책/book-microinteractions · 디자인/canvas-native-design-agent-pattern · 디자인/spatial-branding-reference-source-map.

### 2) toolshelf 카드 15건 (전부 출처 URL 카드 보유)

GSAP · motion(framer-motion 후속) · paper-design/shaders · WebGL-Fluid-Simulation · jquery.ripples · simple-water-waves-shader · spark(3DGS) · react-bits(130+ 컴포넌트) · magicui · animated-grid-lines · Brainwave-Interactive-Landing · 3d-spatial-landing-reference-pack(8사이트) · 60fps.design · landing.love · remotion. 인접 제외: KTX-Software·glTF-* 등 에셋 툴링.

### 3) 로컬 구현 재사용성 판정

| 위치 | 상태 | 재사용성 |
|---|---|---|
| ui-dictionary recipes (VI2~VI4 산출) | 코드+레시피 문서+검증 스크립트 정본 | 높음 — 그대로 그릇 |
| presentation-slides-yusung three-scene | 스킬 내 완결 구현 | 높음 — 단 매체가 슬라이드, 계약 이식 필요 |
| 3d-repolis site/index.html | 5,688줄 모놀리스 | 낮음 — 추출 비용 큼 |
| remotion-data | 영상 도메인 | 범위 밖 |

## 계획에 주는 시사점

1. 새 goal 은 "수집"이 아니라 **대조·판정·흡수** — KG 15노드 ↔ expressive-stack 결정표, toolshelf 15카드 ↔ 티어 배치. 중복(예: frontend-motion-accessibility-source-map vs expressive-stack)은 정본 단일화가 핵심.
2. VI 시리즈(VI1~VI5)가 이미 있으므로 **ID 는 VI6 부터 잇는 게 자연스럽다.**
3. 3d-repolis 추출은 별도 큰 작업 — 이번 범위에서 제외하고 관찰 기록만 남기는 것을 추천.
4. VI5 가 만든 "흡수 3분기 기준"(taste 흡수 계약 TC1)이 이미 있다 — 새 흡수도 그 계약을 따라야 한다.
