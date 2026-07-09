# Horizon - Structure-First Buildout

Date: 2026-07-10
Status: closed 2026-07-10 — 닫는 기준 3개 전부 충족: ① 목표 구조가 blueprint v2 + dev 껍데기로 존재 (SFB2) ② 프로덕션 미완 노출 0건 (SFB1 게이트 + SFB3 누출 2건 추가 차단) ③ 첫 콘텐츠 배치(Colors Palettes) 완성 판정 통과·공개 (SFB3, `https://ui.askewly.com/?page=colors`).

## Objective 임팩트

이 horizon은 Objective의 "제품 표면" 축을 "만들다 만 카탈로그 → 작지만 전부 진짜인 시스템 + 증축 도면"으로 움직였다: 프로덕션은 나열된 것=완성된 것 원칙을 지키고(빈 컬렉션 42·placeholder 카드 5 비노출), dev에는 목표 구조 전체의 골조(Docs Foundations·Agent Recipes·Colors·Pro 하위·Download)가 세워졌으며, Colors 축이 완성 판정→게이트 열기 승격 프로세스의 첫 실증으로 공개됐다. 다음 축 이동은 남은 껍데기 채우기(Showcase 카드·Docs 아티클·Pro 자산)가 담당한다.

## Goal

목표 사이트 구조(IA)를 먼저 문서로 확정하고, 프로덕션은 미완 껍데기가 보이지 않는 클린 버전으로 유지하면서, 개발서버에서 전체 구조의 껍데기(skeleton)를 구현한 뒤, 완성 판정을 통과한 콘텐츠부터 노출 게이트를 열어 프로덕션에 승격한다.

## Why Now

public-site-shell horizon까지로 랜딩·검색·Term 상세·팔레트 생성기 등 대표 표면은 완성됐지만, 사이트 전반에 두 종류의 구멍이 남았다 (2026-07-10 실측):

- 과잉 약속형: Plus 카탈로그 130+ 컬렉션 중 다수가 `termIds: []`, Templates 16종은 이름만 존재, Docs 아티클은 nav 46개 중 14개, Download 페이지는 자인된 placeholder.
- 품질 게이트형: Showcase Atlas 카드 4개 + Dashboard 카드가 source-quality 대기 상태로 리셋됨 (커밋 851ce1c).

시장 재료(`docs/market/2026-07-10-site-integrity-benchmarks.md`): Tailwind Plus는 미완성 카테고리를 카탈로그에서 아예 빼고(나열된 것=완성된 것), 라이브 프리뷰는 무료 전체 공개가 표준이며, 2026 데모 품질 하한선은 실사 mock 데이터 + 라이트/다크 검증 + 복붙 가능한 실코드다.

사용자 결정(2026-07-10): 빈 컬렉션을 지금 삭제하는 대신, 구조 문서화 → 클린 프로덕션 → dev 껍데기 증축 → 콘텐츠 채워 승격 순서로 간다. truth-cut은 삭제가 아니라 **프로덕션 노출 정책**이다.

## Milestones

### SFB1 - Structure Contract And Clean Production

DoD:

- 목표 IA 전체(섹션·페이지 타입·각 섹션의 완성 판정 기준·프로덕션 노출 규칙)가 blueprint v2 문서로 확정된다.
- 프로덕션이 노출 게이트를 통과한 콘텐츠만 보여준다: 빈 컬렉션·명목상 Templates·Download placeholder가 공개 표면에서 사라진다 (데이터/정의는 보존).
- 전 라우트 크롤 스모크에서 placeholder/빈 컬렉션 도달 0건 + 프로덕션 배포 확인.

Evidence: `docs/design-system/site-blueprint.md` (v2) + changeset README + 크롤 스모크 결과.

### SFB2 - Shell Buildout (dev-only)

DoD: blueprint v2의 전 섹션 skeleton(라우트·레이아웃·빈 상태·콘텐츠 슬롯)이 노출 게이트 뒤에서 구현되고, dev 서버에서 전 섹션 라우트 렌더 스모크를 통과한다.

Evidence: changeset README + dev 렌더 스모크.

### SFB3 - Content Fill Batch 1

DoD: 우선순위 배치 1개(Showcase 카드 / Docs 아티클 / Plus 컬렉션 중 SFB3 계획 시 확정)가 완성 판정 기준(실사 mock 데이터·라이트/다크·복붙 가능 코드)을 통과해 노출 게이트를 열고 프로덕션에 공개된다.

Evidence: changeset README + Chrome evidence(데스크톱/모바일·라이트/다크) + 배포 확인.

## Close Criteria

목표 구조 전체가 문서 + dev 껍데기로 존재하고, 프로덕션에는 미완 노출 0건이며, 첫 콘텐츠 배치 1개 이상이 완성 판정을 통과해 공개된 상태.

## Backlinks

- Objective: `docs/OBJECTIVE.md` (장기 아크 4 "제품 표면" 심화)
- Market intake: `docs/market/2026-07-10-site-integrity-benchmarks.md`
- 직전 horizon close: `docs/horizons/2026-07-public-site-shell.md`
