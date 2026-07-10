# Plan - CF3 Patterns 빈 컬렉션 배치

Date: 2026-07-10
Milestone: CF3 (`ROADMAP.md`)

## 위계

- Objective: `docs/OBJECTIVE.md`
- Horizon: `docs/horizons/2026-07-content-fill.md` (active)
- Milestone: CF3 — Patterns 빈 컬렉션 배치
- 근거: `docs/research/cf3-collection-mapping-2026-07-10.md` (전면 신규 수집 판정) + `docs/ui-vocabulary/inbox.yml` (후보 9종 수집 완료)
- 워크플로우: `docs/ui-vocabulary/authoring-workflow.md` + `docs/ui-vocabulary/visual-quality-workflow.md`

## Scope

inbox 후보 9종을 terms.yml로 승격하고 빈 컬렉션 4개에 배정해 공개. Marketing Page Examples 3종(Landing/Pricing/About)은 완성 페이지 예시 성격이라 이월(horizon doc 명시).

중단점: ① validate/audit 실패 시 blocked ② 배포는 세션 일괄 push (사용자 지시 2026-07-10: milestone별 분할 배포 금지).

## Step 트리

- [ ] Step 1 — 승격 + 배정 + 검증: inbox 9종 → terms.yml 승격(스키마 준수), `marquee-row`에 logo-marquee alias 추가(수집 중 중복 판정 권고), navigation-model.ts 4개 컬렉션 termIds 배정(게이트는 termIds≥1로 자연 해제), visual renderer 확인(`npm run audit:visuals` — generic fallback이면 전용 렌더러 보강), `python scripts/validate-ui-vocabulary.py` + build + lint + dev 스모크. (verify: validate/audit/build/lint PASS + 4컬렉션 dev 렌더 + 신규 term 상세 페이지 렌더)

## 결정 로그

- [확정 2026-07-10] 배포 배칭 — CF2·CF3 프로덕션 확인은 세션 말미 일괄 push 후 몰아서 (사용자 지시).
- [확정 2026-07-10] logo-marquee는 신규 term이 아니라 marquee-row alias (수집 에이전트 중복 판정).
- [AI 기본값] strict-duplicates 오탐(한국어 범용어 토크나이저)은 수동 리뷰 기록으로 갈음 — 수집 단계에서 이미 수행.
