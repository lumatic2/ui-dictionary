# Plan - SCD1 Principles 증류

Date: 2026-07-10
Milestone: SCD1 (`ROADMAP.md`, active)

## 위계

- Objective: `docs/OBJECTIVE.md`
- Horizon: `docs/horizons/2026-07-system-content-depth.md` (active)
- Milestone: SCD1 — Principles 증류 (사람용 + 에이전트용)

## Scope

레포에 흩어진 암묵 디자인 원칙을 증류해 ① 에이전트용 정본 `docs/design-system/principles.md` ② 사람용 Docs 아티클(정본에서 파생)로 만들고 llms.txt에 연결. 레시피 확장(SCD2)은 범위 밖.

원칙 소스(발명 금지 — 전부 실존 문서에서 증류): 레시피 5종 Anti-patterns, `docs/design-system/site-blueprint.md` 완성 판정 기준, Docs 아티클들의 판단 기준 문장(오늘 7종 포함), CLAUDE.md Showcase 카피 원칙, tokens SSOT 규약(3-tier·리터럴 금지), PRD "AI-assisted UI의 generic함" 문제 정의.

중단점: ① 원칙 초안은 **사용자 승인 전 게이트 해제 금지**(내용 승인 = 사용자 소유) ② push는 세션 일괄.

## Step 트리

- [x] Step 1 — 소스 수집·증류: 위 소스에서 원칙 후보를 추출해 `docs/design-system/principles.md` 초안(원칙 각각에 근거 소스 경로 표기) 작성. (verify: 모든 원칙에 실존 소스 참조)
- [x] Step 2 — 에이전트 자산 연결: llms.txt 생성기에 principles.md 추가 + 재생성 + 링크 검증. (verify: generate-llms-txt PASS + 인덱스 포함)
- [x] Step 3 — 사람용 Docs 아티클: 정본에서 파생한 한국어 아티클(dev 게이트 뒤) + docs nav 배치. (verify: dev 렌더 + lint/build)
- [x] Step 4 — 사용자 승인 → 게이트 해제 + 검증: 원칙 내용 사용자 리뷰(정지 지점) → 승인 후 게이트 해제, 통합 smoke + 배포(세션 일괄 push). (verify: 승인 기록 + prod smoke)

## 결정 로그

- [확정 2026-07-10] 시퀀스에 System Content Depth 삽입, SCD1(Principles) 먼저 — 레시피 증류의 상위 기준이 되므로 (사용자 "추천대로").
- [확정 2026-07-10] **원칙 내용 최종 승인** — 사용자 응답 `승인`; 공개 게이트 해제 및 배포 완료.
- [AI 기본값] 정본=에이전트용 markdown, 사람용 아티클은 파생(SSOT 단일 출처 관례).
- 그 외 예상 결정: 없음.
