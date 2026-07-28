# Absorption Criteria — 외부 표현 라이브러리 흡수 기준

Date: 2026-07-17
Milestone: VI5 (plan: `plans/2026-07-17-vi5-component-layer-absorption.md`)
지위: 외부 표현 자산(애니메이션 컴포넌트 모음·모션 라이브러리·크리에이티브 코딩 레퍼런스)을 Askewly Design에 어떻게 편입하는지의 결정 규칙. 후보 발굴·사용 기록은 toolshelf가 담당, 편입 판정은 이 문서가 담당.

Audience: 에이전트 + 시스템 관리자.

## 3분기 결정 규칙

외부 자산을 만나면 셋 중 하나로 판정한다:

| 판정 | 기준 (전부 충족 시) | 산출물 |
|---|---|---|
| **A. Recipe로 정본화** | ① 패턴이 라이브러리와 독립적으로 서술 가능(원리가 이식됨) ② 실무 적용 빈도 높음(dogfooding·결정 표 근거) ③ 우리 검증 체인(live 데모·시그니처 판정)에 얹을 수 있음 | `recipes/<group>/<id>.md` + code_asset — 라이브러리는 구현 수단으로만 등장 |
| **B. 링크 참조** | 원리보다 *구현 완성도*가 가치(방대한 컴포넌트 모음·시뮬레이션) — 재서술하면 열화 복제가 됨 | knowledge/연구 문서에서 출처 링크로만 인용, 벤더링 금지 |
| **C. 보류** | 수요 미실증(결정 표·장부에 등장한 적 없음) 또는 유지 부담 > 가치 | toolshelf 카드로만 유지 — 수요 발생 시 재판정 |

**공통 불변식**: 어느 분기든 외부 자산의 *스타일*은 흡수 대상이 아니다 — 흡수하는 것은 원리·계약·판정 기준이고, look은 프로젝트 토큰 소유(component-restyle.md·DF-3 대원칙).

## 실측 후보 분류 (2026-07-17, toolshelf recall 기준)

| 후보 | 판정 | 근거 |
|---|---|---|
| Motion(구 Framer Motion) | **A** (완료) | 스프링·stagger 원리가 recipe로 이식됨 — `spring-drag-snap-card`·`staggered-entrance-group`·`magnetic-hover-button` (VI3) |
| GSAP ScrollTrigger | A 대기 | 핀·스크럽 원리는 결정 표 ② 티어에 등재 — 실수요 발생 시 recipe화 |
| react-bits | **B** | 130+ 완성 컴포넌트 모음 — 가치가 구현량 자체, 재서술은 열화 복제. 계보 문서에서 링크 참조 |
| magicui | **B** | 동일 — Tailwind+Motion 조합 모음 |
| cult-ui | **B** | shadcn-호환 컴포넌트 모음 — component-restyle 절차의 적용 대상 예시로만 |
| WebGL-Fluid-Simulation | **B** | 유체 시뮬 구현 자체가 가치 — 결정 표 ④ 티어에서 링크 참조 |
| animated-grid-lines | **C** | 수요 미실증 — 카드 유지 |
| p5.js | **C** | 크리에이티브 코딩 교육 가치 — 제품 recipe 수요 미실증 |
| taste-skill·nothing-design-skill | **C** | 스킬 형태 선례 — 자산이 아니라 배포 방식 참고 |
| shaders (paper-design) | **A 대기** | ④ 티어 결정표 등재 + 쇼케이스 Shader Gradient 실사용 = 수요 실증 — 토큰화 recipe 실구현 대기(VI8 후보). (VI7 2026-07-28) |
| jquery.ripples | **C** | 물결 수요 미실증 + jQuery 의존 구식 스택 (VI7) |
| simple-water-waves-shader | **C** | 의존성 0 WebGL 리플 — 수요 미실증, 카드 유지 (VI7) |
| spark (Gaussian splatting) | **C** | 3D 스캔·대형 씬 수요 미실증 — 에셋 게이트는 KG web-3d 노드 링크로 커버 (VI7) |
| Brainwave-Interactive-Landing | **B** | 애니메이션 헤비 랜딩 완성 사례 — 갤러리형, 관찰 소스로 링크만 (VI7) |
| 3d-spatial-landing-reference-pack | **B** | 공간형 랜딩 8사이트 — `knowledge/motion-references.md` §공간형 랜딩에 링크 반영(VI6) (VI7) |
| 60fps.design · landing.love | **B** | 큐레이션 갤러리 — 기법이 아닌 관찰 소스, motion-references 북마크 (VI7) |
| remotion | **B** | 사전 렌더 영상 매체 — 화면 티어 비대상, motion-references §영상 매체(KG 노드 링크)로 커버 (VI7) |

## 운용

- 새 후보는 toolshelf에 카드로 먼저 등재 → 실사용(recall→used) 기록이 쌓이거나 dogfooding 장부에 수요가 찍히면 이 표에 행을 추가하고 판정.
- A 판정 실행은 harness milestone/step으로 — recipe 계약(recipe-format.md)과 검증 체인을 그대로 통과해야 한다.
- 판정 변경(B→A 등)은 이 문서에 행 갱신 + 근거 한 줄.

## Changelog

- 2026-07-28: VI7 — toolshelf 비주얼 임팩트 카드 15건 전수 배치 후 신규 판정 9행 추가 (판정 장부: `research/2026-07-28-vi7-toolshelf-placement.md`).
- 2026-07-17: 초판 — 3분기 규칙 + 실측 후보 9종 분류 (VI5).
