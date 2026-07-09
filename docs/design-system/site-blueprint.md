# Public Website Blueprint

Version: v2
Date: 2026-07-10 (v1: 2026-07-04)

> 분류 용어·축 목록의 정본은 [pattern-taxonomy.md](pattern-taxonomy.md). 이 문서는 `ui.askewly.com` 공개 사이트의 목표 IA, 프로덕션 노출 정책, 섹션별 완성 판정 기준의 정본이다. Structure-First Buildout horizon(`docs/horizons/2026-07-structure-first-buildout.md`)의 구조 계약 문서.

## Purpose

- 목표 사이트 구조(섹션·페이지 타입) 전체를 정의한다 — 지금 다 채우지 않더라도 증축 도면으로.
- 무엇이 채워져야 프로덕션에 노출되는지(노출 정책)를 정의한다.
- 각 섹션의 "완성 판정 기준"을 정의한다 — 껍데기(SFB2)와 콘텐츠 채우기(SFB3+)의 합격선.

## Product Promise (v1 유지)

> Askewly Design is a broad, working digital product design system. You can browse it like a visual encyclopedia, inspect complete product UI examples, learn the behavior and design reasoning behind them, and eventually copy/download original implementation assets or use them through coding agents.

## Top-Level Navigation (v2 확정)

```text
Docs      시스템 구조·foundations·컴포넌트 행동 계약·에이전트 레시피
Patterns  재사용 가능한 제품 표면·페이지 섹션·패턴 컬렉션 카탈로그
Colors    컬러 도구 축 — Coolors 레퍼런스 (팔레트 생성기·팔레트 라이브러리)
Pro       유료 경계 — 가격·Asset Packs·Templates·코드 소유/다운로드
```

v1 대비 변경 (2026-07-10 사용자 확정):

- **Colors 축 신설** — Coolors(`https://coolors.co/`)를 1차 레퍼런스로 하는 컬러 부문. PGD1의 팔레트 생성기(`palette-generator.ts`)가 씨앗. 홈의 데모 카드에서 전용 축으로 승격.
- **Showcase 축 제거 유지** (PSS2 결정) — 완성 페이지 예시는 홈의 Showcase Atlas 섹션이 담당. 갤러리가 충분히 커지면 축 승격 재검토.
- **Resources 축 제거 유지** — color/typography/spacing/motion/accessibility/tokens 는 Docs > Foundations 로 흡수.
- **Templates 는 Pro 하위** — Tailwind Plus 모델. 실제 템플릿이 생기기 전까지 비노출.
- **Download 는 앱 배포 표면으로 재정의** — 아래 Download 절 참조.

### Navigation roles

| Nav | 사용자 질문 |
|---|---|
| Docs | 이 시스템은 어떻게 구성·검증·사용(사람/에이전트)되는가? |
| Patterns | 어떤 제품 표면·페이지 섹션·패턴을 열람할 수 있는가? |
| Colors | 팔레트를 만들고, 탐색하고, 내 프로젝트에 가져갈 수 있는가? |
| Pro | 결제하면 무엇을 소유하는가 — 전체 코드·에셋·템플릿·팩? |

## Site Map (목표 구조 v2)

현 구현은 React Router 가 아니라 `PageMode` 상태 기반 SPA 다. 아래 트리는 URL 이 아니라 **화면 단위**의 목표 구조이며, 라우팅 방식 전환은 이 horizon 범위 밖이다.

```text
Home
├── Hero (검색/커맨드 + 대표 데모)
├── Showcase Atlas (대표 인터랙티브 데모 그리드 — source-quality 카드만 노출)
├── Docs / Patterns / Colors / Pro 진입 섹션
└── Agent-Ready 섹션 (llms.txt 안내)

Docs
├── Getting Started (setup / html / react / vue / assets) ......... 채워짐 5
├── Foundations (color·typography·spacing·motion·a11y·dark·tokens) . 구 Resources 흡수, 아티클 필요
├── Components (dialog·dropdown·popover·tabs·select·…) ............ 채워짐 9, 확장 대상
├── Catalog (용어 기반 목록 — layout/styling/interaction/…) ........ 채워짐 (527 terms)
└── Agent Recipes (llms.txt 자산의 사람용 표면 + 검증 체크리스트) ... 신설 껍데기

Patterns (구 Plus 카탈로그 재편 — pattern-taxonomy 10종 기준)
├── Marketing / Application UI / Commerce / Navigation /
│   Overlays / Forms / Data Display / Feedback / Layout / Docs&Content
│   └── 각 그룹 하위 컬렉션: termIds 채워진 것만 노출 + 실개수 표기
└── Page Examples (Landing/Pricing/About …) ....................... 전부 미충족, 게이트 뒤

Colors (신설 — Coolors 레퍼런스)
├── Generator (팔레트 생성기 — PGD1 엔진 승격) .................... 채워짐
├── Palettes (큐레이션 팔레트 라이브러리 — 탐색/복사) .............. 신설 껍데기
└── (future) Contrast checker / gradient / image-to-palette

Pro
├── Overview (가격·포함 범위) ..................................... 채워짐(마케팅)
├── Asset Packs (구 Download 의 pack 카드 흡수) .................... 껍데기
├── Templates (16종 정의의 목표 위치) .............................. 껍데기
└── License / Provenance ........................................... 껍데기

(비노출) Download — 앱 배포 표면 (future)
```

### Download 재정의 (2026-07-10)

사용자 의도: Figma / OpenDesign 처럼 **앱 자체를 다운로드**하게 하고 싶다.

채택한 접근:

1. **에셋(zip/pack) 다운로드와 앱 다운로드를 분리한다.** 에셋 다운로드는 Pro > Asset Packs 의 기능이다 (시장 표준: 프리뷰 무료, 소유·다운로드 유료).
2. **Download 페이지 = 앱 배포 표면.** Figma 의 downloads 페이지처럼 데스크톱/플랫폼별 설치 파일을 제공하는 페이지로 재정의한다. 상단 nav 가 아니라 footer/보조 진입(시장 관행)에 둔다.
3. **실배포 가능한 앱이 존재하기 전까지 노출 게이트 뒤에 둔다.** 현 placeholder 라우트는 프로덕션 비노출로 전환하고, 앱 개발 자체는 별도 horizon 으로 다룬다 (Objective "웹 전용으로 만들지 않는다"와 정합).

## Production Exposure Policy (신설 — 핵심)

원칙: **나열된 것 = 완성된 것.** 미완성 섹션은 "Coming soon" 으로 노출하지 않고 프로덕션 카탈로그에서 보이지 않게 한다 (Tailwind Plus 관행, `docs/market/2026-07-10-site-integrity-benchmarks.md`).

게이트 규칙:

| 대상 | 노출 조건 |
|---|---|
| Patterns 컬렉션 | `termIds` ≥ 1 (또는 published 플래그) — 빈 컬렉션은 nav·목록에서 제외 |
| Docs 아티클 nav | 장문 아티클 콘텐츠가 존재하는 항목만 아티클로 링크, 없으면 카탈로그 목록만 |
| Showcase Atlas 카드 | source-quality 판정 통과 카드만 렌더 — placeholder 카드는 프로덕션에서 숨김 |
| Pro 하위 (Packs/Templates) | 실제 판매 가능 항목이 생기기 전까지 Overview 만 노출 |
| Download | 배포 가능한 앱 존재 전까지 비노출 |

운영 규칙:

- **데이터·정의는 삭제하지 않는다.** 게이트는 노출 필터이지 삭제가 아니다. dev 모드에서는 껍데기 전체에 접근 가능해야 한다 (SFB2 증축 도면).
- **실개수 노출**: 남는 카탈로그 그룹에는 "N components/patterns" 실개수를 표기한다 (저비용 신뢰 신호).
- 게이트 구현 방식(플래그 필드 vs 파생 판정)은 코드 구조에 맞춰 구현 시 결정.

## Section Completion Criteria (완성 판정 기준)

공통 하한선 — **source-quality** (2026 시장 하한선):

1. 실사 mock 데이터 (lorem/명목상 텍스트 금지)
2. 라이트/다크 모드 검증 (대비·가독성 포함)
3. 복붙 가능한 실코드 또는 실동작 인터랙션

섹션별 추가 기준:

| 섹션 | 완성 판정 |
|---|---|
| Showcase Atlas 카드 | 공통 하한선 + reduced-motion fallback + 카드 copy 규약(CLAUDE.md) |
| Docs 아티클 | 정의·사용 이유·실예시·상태/반응형/토큰 연결 (Tailwind docs 서술 방식) |
| Patterns 컬렉션 | 실 term 연결 ≥ 1 + 프리뷰 렌더 + 그룹 실개수 정확 |
| Colors > Palettes | 큐레이션 팔레트 실데이터 + 복사/내보내기 동작 |
| Pro > Packs/Templates | 라이브 프리뷰 + 포함 파일 목록 + 라이선스/출처 문구 |
| Agent Recipes 표면 | llms.txt 실자산과 링크 정합 (링크 깨짐 0) |

## Page Types

v1 의 6종 페이지 타입 계약(Surface Index / Pattern Collection / Component Leaf / Foundation / Agent Recipe / Pro Asset Pack)을 유지하고 1종을 추가한다. 각 타입의 필수 콘텐츠 목록은 v1 정의를 승계한다 (git 이력 `43efe18` 이전 버전 참조).

### 7. Colors Tool Page (신설)

Example: Colors > Generator

Purpose: 도구형 페이지 — 문서가 아니라 실사용 유틸리티.

Required content:

- 즉시 동작하는 도구 (생성기/라이브러리)
- 시드/생성 근거 표기 (PGD1 규약: seed source copy)
- lock·복사·내보내기 등 실작업 어포던스
- 라이트/다크 대응
- 관련 Foundations(color)·토큰 문서로의 연결

## Content Ownership (v1 유지)

| Content type | Canonical location |
|---|---|
| Objective, PRD, roadmap | `docs/OBJECTIVE.md`, `docs/PRD.md`, `ROADMAP.md` |
| Site IA·노출 정책·완성 기준 | `docs/design-system/site-blueprint.md` (이 문서) |
| Surface taxonomy | `docs/design-system/surface-taxonomy.md` |
| Agent asset schema | `docs/design-system/agent-asset-model.md` |
| Reference research | `docs/research/*.md` |
| Site implementation | `examples/ui-vocabulary-site/` |

## Implementation Order (Structure-First Buildout)

1. **SFB1 — 구조 계약 + 클린 프로덕션**: 이 문서 확정 → 노출 게이트 구현 → placeholder/빈 컬렉션이 보이지 않는 클린 버전 배포.
2. **SFB2 — 껍데기 증축 (dev-only)**: 위 site map 의 신설 껍데기(Docs Foundations/Agent Recipes, Patterns 재편, Colors > Palettes, Pro 하위)를 노출 게이트 뒤에 구현.
3. **SFB3+ — 콘텐츠 채우기 배치**: 완성 판정 통과분부터 게이트를 열어 프로덕션 승격. 배치 우선순위는 각 milestone 계획 시 확정.

## Changelog

- 2026-07-10 v2: 상위 축 Docs/Patterns/Colors/Pro 확정 (Colors 신설, Showcase/Resources 흡수 유지, Templates→Pro), Download 를 앱 배포 표면으로 재정의(게이트 뒤), Production Exposure Policy·Section Completion Criteria 신설, Implementation Order 를 SFB horizon 에 정렬.
- 2026-07-04 v1: 최초 blueprint — homepage job, 5축 nav, site map, page types 6종, first vertical slice.
