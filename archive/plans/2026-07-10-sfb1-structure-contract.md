# Plan - SFB1 Structure Contract And Clean Production

Date: 2026-07-10
Milestone: SFB1 (`ROADMAP.md`) — completed 2026-07-10, evidence: changesets/20260710-production-exposure-gate/README.md

## 위계

- Objective: `docs/OBJECTIVE.md` — 공개 레퍼런스 사이트 + 에이전트용 디자인 시스템
- Horizon: `docs/horizons/2026-07-structure-first-buildout.md` (active)
- Milestone: SFB1 — Structure Contract And Clean Production

## Scope

이번 run이 닫을 범위: blueprint v2 확정 + 프로덕션 클린 배포까지. 껍데기 구현(SFB2)·콘텐츠 채우기(SFB3)는 포함하지 않는다.

중단점: ① IA 초안 사용자 확정 대기 ② 크롤 스모크 실패 시 blocked ③ 배포 검증 PASS 후 milestone 완료.

## Step 트리

- [x] Step 1 — blueprint v2 문서: 목표 IA 전체(섹션 트리·페이지 타입·섹션별 완성 판정 기준·프로덕션 노출 규칙)를 `docs/design-system/site-blueprint.md`에 v2로 갱신. IA 초안은 사용자 확정 후 반영. (artifact: changeset[docs]) (verify: 노출 규칙·완성 판정 기준이 blueprint에 명문화 + 사용자 확정 기록)
- [x] Step 2 — 노출 게이트 구현 + 클린 프로덕션 배포: navigation-model에 노출 게이트(채워진 컬렉션만 공개) 적용, 명목상 Templates·Download placeholder 비노출(정의·데이터 보존), 카탈로그 실개수 노출, 빌드 후 프로덕션 배포. (verify: 전 라우트 크롤 스모크 — placeholder/빈 컬렉션 도달 0건 + build/lint + `https://ui.askewly.com/` 배포 반영 확인; 실패 모드 — 게이트 뒤 데이터가 dev 모드에서 여전히 접근 가능함을 확인)

## 결정 로그

- [확정 2026-07-10] 최종 IA: 상위 축 Docs / Patterns / Colors / Pro — Colors 축 신설(Coolors 레퍼런스, 팔레트 생성기 승격), Templates는 Pro 하위, Download는 앱 배포 표면으로 재정의해 앱 존재 전까지 게이트 뒤(에셋 다운로드는 Pro > Asset Packs로 분리). Showcase=홈 섹션, Resources=Docs Foundations 흡수 유지.
- [확정 2026-07-10] 작업 순서: 구조 문서화 → 클린 배포 → dev 껍데기 → 콘텐츠 승격 (사용자 지시).
- [확정 2026-07-10] truth-cut = 삭제가 아니라 노출 게이트. 빈 컬렉션 정의·termIds 데이터는 보존.
- [확정 2026-07-10] 완성 판정 기준(source-quality) = 실사 mock 데이터 + 라이트/다크 검증 + 복붙 가능한 실코드 (시장 하한선, `docs/market/2026-07-10-site-integrity-benchmarks.md`).
- [AI 기본값] 노출 게이트 구현 방식(플래그 필드 vs termIds 길이 기반 파생)은 코드 구조에 맞춰 구현 시 결정.
