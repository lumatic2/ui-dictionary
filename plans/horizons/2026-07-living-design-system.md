# Horizon — Living Design System

Date: 2026-07-12 (활성화 2026-07-12, close 2026-07-12)
Status: closed

## Close Audit (2026-07-12)

- **Close criteria 판정**: ① 루프 반복 실증 — 목표 3배치를 넘어 **9배치**(RL 3 + MS 2 + SD 4)가 동일 5단계 절차로 완주, 각 배치가 validator 체인(+FW 이후 build:catalog)을 프로덕션 기준으로 통과 ✓ ② 전 표면 카테고리 실콘텐츠 — 7표면 전부 recipe 보유(commerce 6, internal-tools 5, documentation 6, mobile-apps 7, saas-dashboards/websites 기존 두터움, components-primitives 포함), 총 recipe 13→35·용어 536→562 ✓ ③ 캔버스 레지스트리·에이전트 진입점의 무재작업 소비 — recipes frontmatter→recipeCatalog 생성기 + Insert 팔레트 Recipes 섹션 + llms.txt glob + CLI build:data, 신규 배치는 스크립트 재실행만으로 4곳 도달 ✓.
- **Milestones**: RL·MS·FW·SD(구 CS+R2 병합) 4개 완료. 이력: `BACKLOG.md` §2026-07-12 Living Design System.
- **잔여(비차단)**: gen-2 토큰의 컴포넌트 소비 배선, safe-area 실구현, 캔버스 recipe 소스 실체화(materialize 확장), anti-patterns 가이드의 코퍼스 성장 시 갱신.

## Objective 임팩트

이동축 "일회성 Tailwind 패리티 → 반복 가능한 수집·검증 루프"와 "웹 전용 예시 → 표면을 가로지르는 제품 패턴"을 **완결**로 이동 — 성공상태 ③(전 표면 심화)·⑤(반복 루프) 달성. 남은 큰 축은 성공상태 ②(결제 사용자 차등)로, 다음 horizon(Public Product & Monetization)의 몫. ROADMAP 자기평가 재측정 불요(축 이동이 명확).

## Goal

일회성 레퍼런스 수집을 **반복 가능한 흡수 루프**(수집→중복 필터→적응→검증→흡수)로 운영화하고, 웹 전용을 넘어 모바일·커머스·대시보드·문서 표면으로 확장하며, 그 산출이 사이트·에이전트 가이드(llms.txt/CLI/레시피)·캔버스 레지스트리에 재작업 없이 흘러드는 구조를 만든다.

## Why (승인 시점 근거)

성공상태 ⑤(반복 루프)와 이동축 "일회성 Tailwind 패리티 → 반복 가능한 수집·검증 루프", "웹 전용 예시 → 표면을 가로지르는 제품 패턴"이 미완이다. 콘텐츠 파이프라인(SSOT·레시피·validator·llms.txt·CLI)은 2026-07-10까지 완성됐으나 루프로 돌지 않는다. H1이 산출의 목적지(레지스트리·캔버스 소비)를 먼저 만들어야 루프가 헛돌지 않으므로 H1 뒤에 배치한다.

## Milestone 후보 (활성화 시 §B0.5 Beat 3로 확정)

- **RL — Reference Loop Pipeline**: 수집 배치의 표준 절차·도구·장부화. 3배치 반복 실증이 DoD.
- **MS — Mobile Surface Batch**: HIG/Material 기반 모바일 패턴·레시피·예시 프로덕션 공개.
- **CS — Commerce/Dashboard/Docs Surface Batch**: 잔여 표면 카테고리 실콘텐츠.
- **R2 — Recipe/Token Coverage 2세대**: 신규 표면을 덮는 레시피·토큰 확장 + anti-pattern 가이드 심화.
- **FW — Feed Wiring**: 루프 산출이 캔버스 레지스트리·CLI·llms.txt에 코드 변경 없이 공급되는 배선.

## Close Criteria (초안)

루프를 최소 3배치 반복 실증(각 배치가 새 표면 콘텐츠를 프로덕션까지 도달시킴) + 전 표면 카테고리에 실콘텐츠 존재 + 캔버스 레지스트리와 에이전트 진입점이 새 배치를 재작업 없이 소비.

## Objective Impact Target

성공상태 ③ 심화(전 표면), ⑤ 완결. 이동축 "웹 전용 탈피" 완결.

## Backlinks

- Objective: `docs/OBJECTIVE.md`
- Predecessor (queued after): `docs/horizons/2026-07-canvas-production-environment.md`
- Next queued: `docs/horizons/2026-07-public-product-monetization.md`
