# Plan - SFB2 Shell Buildout (dev-only)

Date: 2026-07-10
Milestone: SFB2 (`ROADMAP.md`) — completed 2026-07-10, evidence: changesets 30-32 + dev/prod 통합 스모크

## 위계

- Objective: `docs/OBJECTIVE.md` — 공개 레퍼런스 사이트 + 에이전트용 디자인 시스템
- Horizon: `docs/horizons/2026-07-structure-first-buildout.md` (active)
- Milestone: SFB2 — Shell Buildout (dev-only)
- 구조 계약: `docs/design-system/site-blueprint.md` v2 (Site Map·노출 정책)

## Scope

이번 milestone이 닫을 범위: blueprint v2 site map의 신설 껍데기 전부를 노출 게이트 뒤에 구현. 콘텐츠 채우기(SFB3)·프로덕션 노출은 포함하지 않는다. 프로덕션 배포 불필요(게이트 뒤라 배포해도 비노출이지만, push는 milestone 완료 기록 시점에 일괄).

껍데기(shell)의 정의: 라우트/화면 + 레이아웃 + 헤딩 + 콘텐츠 슬롯(빈 상태 명시). source-quality 요구 없음 — 그건 SFB3 완성 판정의 몫.

중단점: ① dev 렌더 스모크 실패 시 blocked ② 프로덕션 빌드 비노출 회귀 실패 시 blocked.

## Step 트리

- [x] Step 1 — Docs 껍데기: Foundations 섹션 7종(color/typography/spacing/motion/accessibility/dark-mode/tokens) 아티클 skeleton + Agent Recipes 표면 skeleton(llms.txt 자산 링크 슬롯 + 검증 체크리스트 슬롯). (verify: dev 렌더 + prod 빌드 비노출)
- [x] Step 2 — Colors 축 껍데기: PageMode `colors` 신설(게이트 뒤 nav) + Generator 화면 승격(홈 팔레트 생성기 엔진 `palette-generator.ts` 재사용) + Palettes 큐레이션 라이브러리 skeleton. (verify: dev 렌더 + generator 동작 + prod 빌드 비노출)
- [x] Step 3 — Pro 하위 + Download 껍데기: Pro에 Asset Packs/Templates/License 하위 섹션 skeleton + Download를 앱 배포 페이지 skeleton으로 재구성(플랫폼별 설치 슬롯). (verify: dev 렌더 + prod 빌드 비노출)

통합 검증(milestone DoD): dev 서버에서 전 섹션 라우트 렌더 스모크 + 프로덕션 빌드에서 신설 껍데기 전부 비노출 회귀 확인.

## 결정 로그

- [AI 기본값] Colors 축의 프로덕션 노출 시점은 SFB2가 아니라 SFB3 완성 판정 이후 — SFB2에서는 신설 껍데기 전부 게이트 뒤 (dev-only 원칙 일관).
- [AI 기본값] skeleton 시각 수준: 레이아웃·헤딩·슬롯·빈 상태 문구까지. 실사 mock 데이터·실코드는 SFB3.
- 예상 사용자 소유 결정: 없음.
