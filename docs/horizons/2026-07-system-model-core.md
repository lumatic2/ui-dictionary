# Horizon - System Model Core (시스템 모델 코어)

Date: 2026-07-07
Status: closed 2026-07-07 — 4/4 milestones completed in one day; close criteria met (token SSOT + pattern taxonomy + recipe batch + shared-consumption demo proving site and agent output derive from the same SSOT). Milestone history archived in BACKLOG.md; follow-up queue recorded there. Next horizon: to be authored via planning discussion (§B0.5).
Objective link: `docs/OBJECTIVE.md` (장기 아크 3 — 시스템 모델)

## Goal

Askewly Design의 심장인 "시스템 그 자체"를 실체로 만든다: 3-tier 토큰, 패턴 분류 체계, 컴포넌트 레시피, 안티패턴을 사이트와 코딩 에이전트가 공유하는 단일 소스(SSOT) 데이터 자산으로 정의한다.

## Why Now

기반(장기 아크 1)과 레퍼런스 흡수(장기 아크 2, RME1~5)는 끝났고, 제품 표면(public-site-shell horizon)은 shell까지 완성됐다. 그런데 Objective의 핵심 명사인 "디자인 시스템"은 아직 실체가 없다 — 사이트는 shell이고, 디자인 지식은 레퍼런스 노트로 흩어져 있다. 사이트 콘텐츠 채우기, 에이전트 통합, Figma 브리지, 수익화 전부가 이 시스템 모델의 소비자이므로, 지금 이것을 만드는 것이 Objective에 가장 빠르게 다가가는 경로다.

## Milestones

### SMC0 - 시장 포맷 조사 (market beat)

DoD:

- Radix Themes, shadcn registry, Vercel Geist, Material 3 tokens, W3C DTCG(Design Tokens Community Group) 포맷과 에이전트용 디자인 포맷 선례(DESIGN.md/Stitch 등)를 조사한다.
- 토큰 스키마, 레시피 포맷, 배포 형태(코드/데이터/문서)를 비교표로 정리하고 우리 포맷 채택 기준을 결정한다.

Evidence:

- `docs/market/design-system-format-survey.md`

### SMC1 - 토큰 시스템 SSOT

DoD:

- primitive → semantic → component 3-tier 토큰이 기계가 읽을 수 있는 단일 소스로 정의된다.
- `DESIGN.md`와 사이트의 토큰 사용(index.css 등)이 그 소스와 정렬되고, WCAG contrast/토큰 참조 lint가 통과한다.

Evidence:

- 토큰 SSOT 데이터 파일 + 검증(lint) 실행 결과
- `DESIGN.md` 정렬 diff

### SMC2 - 패턴 분류 체계

DoD:

- 웹·모바일·SaaS·커머스·대시보드·문서를 가로지르는 패턴 분류 체계가 기존 `docs/design-system/surface-taxonomy.md`와 ui-vocabulary 데이터를 흡수해 확정된다.
- 각 패턴이 토큰·레시피·예시와 연결되는 스키마를 갖는다.

Evidence:

- 패턴 분류 체계 문서/데이터 + 기존 vocabulary 매핑

### SMC3 - 컴포넌트 레시피 + 안티패턴 첫 배치

DoD:

- 레시피 포맷(intent / tokens / states / checks / anti-patterns)이 확정되고 첫 배치 레시피가 작성된다.
- 사이트 페이지 1개와 코딩 에이전트 구현 1건이 같은 레시피 소스에서 파생됨을 데모로 증명한다.

Evidence:

- 레시피 파일 첫 배치 + 사이트/에이전트 공용 소비 데모

## Close Criteria

토큰 SSOT, 패턴 분류 체계, 레시피 첫 배치가 존재하고, 같은 SSOT에서 사이트 표면과 에이전트 산출물이 모두 파생되는 것을 데모 1개로 증명하면 이 horizon을 닫는다.

## Objective Impact

이 horizon이 닫히면 Objective의 "에이전트용 디자인 시스템"이 처음으로 실체를 갖는다. 이후 horizon(에이전트 통합, 제품 표면 품질/콘텐츠, Figma 브리지)은 전부 이 SSOT를 소비·확장하는 작업이 된다.
