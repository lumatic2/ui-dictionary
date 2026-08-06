# Absorption Criteria — 외부 표현 라이브러리 흡수 기준

Date: 2026-07-17
Milestone: VI5 (plan: `plans/2026-07-17-vi5-component-layer-absorption.md`)
지위: 외부 표현 자산(애니메이션 컴포넌트 모음·모션 라이브러리·크리에이티브 코딩 레퍼런스)을 Askewly Design에 어떻게 편입하는지의 결정 규칙. 후보 발굴·사용 기록은 toolshelf가 담당, 편입 판정은 이 문서가 담당.

Audience: 에이전트 + 시스템 관리자.

## 3분기 결정 규칙

외부 자산을 만나면 셋 중 하나로 판정한다:

| 판정 | 기준 (전부 충족 시) | 산출물 |
|---|---|---|
| **A. Recipe 또는 Knowledge 규칙으로 정본화** | ① 패턴·원리가 소스와 독립적으로 서술 가능(원리가 이식됨) ② 실무 적용 빈도 높음(dogfooding·결정 표 근거) ③ 우리 검증 체인(live 데모·시그니처 판정)에 얹을 수 있음 | 컴포넌트 패턴이면 `recipes/<group>/<id>.md` + code_asset — 라이브러리는 구현 수단으로만 등장. **규범·판정 기준이면 `knowledge/<topic>.md` 결정표** (아래 §원칙류 소스 참조) |
| **B. 링크 참조** | 원리보다 *구현 완성도*가 가치(방대한 컴포넌트 모음·시뮬레이션) — 재서술하면 열화 복제가 됨 | knowledge/연구 문서에서 출처 링크로만 인용, 벤더링 금지 |
| **C. 보류** | 수요 미실증(결정 표·장부에 등장한 적 없음) 또는 유지 부담 > 가치 | toolshelf 카드로만 유지 — 수요 발생 시 재판정 |

**공통 불변식**: 어느 분기든 외부 자산의 *스타일*은 흡수 대상이 아니다 — 흡수하는 것은 원리·계약·판정 기준이고, look은 프로젝트 토큰 소유(component-restyle.md·DF-3 대원칙).

## 원칙류 소스 (플랫폼 가이드라인·규범 문서) 착지 규칙

3분기 규칙은 원래 표현 라이브러리(컴포넌트·모션 모음)를 겨냥해 설계됐다. Apple HIG·Material Design 같은 **원칙·규범 문서**는 "구현물"이 없어 A 판정의 산출물이 recipe 로 떨어지지 않는다 — 이 경우 착지는 다음과 같다 (M7 신설, 2026-08-01):

- **A 판정 산출물 = `knowledge/<topic>.md` 판정 규칙** — 규범을 "언제 무엇을 고르는가"의 결정표로 번역한다(예: 태스크 깊이·플랫폼별 내비게이션 컨테이너 선택). knowledge 양식(지위+결정표+판정 절차+Changelog)을 따르고, 근거 원문은 `research/` 캡처 문서에 동결한다.
- **B 판정** — 규범 전문(全文)이 가치인 경우(세부 스펙 표·플랫폼별 수치): 재서술하지 않고 knowledge/연구 문서에서 공식 URL 로 링크 참조. 플랫폼 문서는 개정되므로 벤더링 금지가 특히 중요하다.
- **term 보강 경로** — 규범이 기존 `terms.yml` 항목의 사용 조건을 정교화하는 경우: 신규 항목이 아니라 기존 항목의 description/when_to_use 보강으로 흡수(authoring-workflow §3 판정 규칙과 동일).
- knowledge 신설 파일을 에이전트 진입 경로에 노출하려면 `scripts/generate-llms-txt.mjs` 의 `FIXED_ASSETS` 수동 등재가 필수다(생성기는 knowledge/ 를 glob 하지 않는다 — reference-loop.md §llms.txt 등록).

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
| Around/Createx (템플릿 카탈로그·패키징) | **A** (2026-08-06 재판정, 구 C) | 이식물 = 패키징·customizer 원리. C 사유(소비처 미개방)가 M26~M32 로 해소돼 재판정 — 킥스타트가 톤·강조색·타이포 3질문으로 브랜드 CSS 61종을 생성하고 톤 프리셋이 radius 까지 묶는다(코드 실측). 흡수 = 새 기능이 아니라 **규칙 명문화**: `knowledge/customizer-and-packaging.md` + `docs/PRD.md` 「제품 약속」. 원 캡처 `research/around-template-system-capture.md` 는 동결·링크 참조. 판정서 `research/2026-08-06-m34-around-reverdict.md` (M34) |
| shadcn 공식 blocks `dashboard-01` | **A** | MIT 소스 흡수 — saas-app-shell 블록 베이스로 이식(+우리 asset 보강·restyle 의무·파일 헤더 attribution). 이미 registry:block 동형 배포라 이식 비용 최소. 근거: `research/2026-08-04-m18-block-absorption-survey.md` (M18) |
| satnaing/shadcn-admin · Tremor · Next 계열 스타터 | **B** | 라우터/프레임워크/자체 컴포넌트 체계 결합으로 registry 단위 이식 불가 — 구조 참고 링크만 (M18 실사) |
| tailark/blocks · Launch UI | **B** | MIT 이나 Next.js 결합(tailark: next/link 195·next/image 109 실측)으로 Vite 소비 경로와 충돌 + 자체 마케팅 asset(라이브 harvest 산)이 품질 우위 — marketing-landing 블록은 자체 조합, pricing/FAQ/footer 구조 참고 링크만. 근거: `research/2026-08-04-m27-marketing-block-absorption-survey.md` (M27) |
| HyperUI | **C** | 플레인 Tailwind HTML — React/shadcn registry 모델 불일치, 수요 시 개별 패턴 참고만 (M27) |

## 운용

- 새 후보는 toolshelf에 카드로 먼저 등재 → 실사용(recall→used) 기록이 쌓이거나 dogfooding 장부에 수요가 찍히면 이 표에 행을 추가하고 판정.
- A 판정 실행은 harness milestone/step으로 — recipe 계약(recipe-format.md)과 검증 체인을 그대로 통과해야 한다.
- 판정 변경(B→A 등)은 이 문서에 행 갱신 + 근거 한 줄.

## Changelog

- 2026-08-04: M27 — 마케팅 블록 후보 3행 추가(tailark/Launch UI = B, HyperUI = C) — marketing-landing 블록 자체 조합 폴백 판정.
- 2026-08-01: M7 — A 판정 산출물을 "recipe 또는 knowledge 규칙"으로 확장 + §원칙류 소스 착지 규칙 신설(플랫폼 가이드라인 대응).
- 2026-07-28: VI7 — toolshelf 비주얼 임팩트 카드 15건 전수 배치 후 신규 판정 9행 추가 (판정 장부: `research/2026-07-28-vi7-toolshelf-placement.md`).
- 2026-07-17: 초판 — 3분기 규칙 + 실측 후보 9종 분류 (VI5).
