# Horizon — Public Product & Monetization

Date: 2026-07-12 (queued — H2 Living Design System 이후 활성화)
Status: paused (2026-07-13 사용자 재우선순위 — 수익화보다 AskewlyDesign 편집기 품질을 먼저 개선; PX 완료 증거는 유지)

## Goal

공개 탐색 경험을 완성도 있게 닫고(IA·검색·성능·모바일), 에셋 모델을 정합시킨 뒤, 계정·결제·Pro 티어·에셋 다운로드·implementation pack을 열어 **결제 사용자가 실제로 구매·사용하는 제품**으로 만든다.

## Why (승인 시점 근거)

Objective 성공상태 ②(결제 사용자 프리미엄)와 ①의 완성. Objective "하지 않는 것"이 "공개 탐색 경험과 에셋 모델이 정합해지기 전에는 결제·계정·라이선스 강제를 붙이지 않는다"로 이 지평을 마지막에 게이트해 뒀다 — H1(캔버스 제품)·H2(콘텐츠 깊이)가 팔 것과 쓸 곳을 먼저 완성해야 한다.

## Milestone 후보 (활성화 시 §B0.5 Beat 3로 확정)

- **PX — Public Experience Pass**: IA·검색·성능·모바일·SEO 완성 패스.
  - PX 입력 (2026-07-12 사용자 논의 확정 — 사이트 IA 재편 3건):
    1. **Getting set up 개편** — 환경 준비 문서에서 "디자인 작업 프로토콜" 문서로: 탐색(Patterns→용어) → 자산 확보(토큰/DESIGN.md·Recipes) → 주입(CLI add·에이전트 컨텍스트) → 검증(다크모드·상태·a11y) 왕복 루프를 사람 트랙/에이전트 트랙 병렬로 서술. 철학은 Principles 소유 유지. 추후 Get Started CTA(현재 SHOW_UNFILLED 게이트, 앱 안정화 후 부활)의 목적지 후보.
    2. **Docs 역할 재정의** — 겹침 해소: Foundations Color ↔ Colors 페이지 ↔ 어휘 Styling, Foundations/어휘 Accessibility·Motion 중복, Elements ↔ Patterns UI Kit, docs Agent recipes Overview ↔ Recipes 갤러리. 원칙: Docs = 읽는 것(온보딩·원칙·근거·API 계약) / 어휘 사전 = 검색·용어 참조로 통합 / 보는 것(Colors·Patterns·Recipes) = Docs 밖 독립 표면.
    3. **섹션별 독립 사이드 네비게이션** — 현재 Docs·Patterns가 explore 사이드바 공유(PrimaryAxisNav 축 전환), Colors·Recipes는 사이드바 없음. 개편: Docs = 문서 트리 / Patterns = 컬렉션 브라우저(Docs 축과 분리) / Recipes = 10 컬렉션 앵커 사이드바 / Colors = 없음 유지 또는 팔레트 앵커.
- **AM — Asset Model Alignment**: 무료/유료 경계, 라이선스, 다운로드 포맷 정합 판정 (사용자 소유 결정 다수 예상 — 활성화 시 §B0-1 토론 필수).
- **AC — Accounts/Auth**: 계정·인증 (기존 askewly SSO 라우팅 자산 활용).
- **PG — Payments/Pro Gate**: 결제 연동 + Pro 게이트 해제 (외부 크레덴셜·결제 수단 = 사용자 정지 지점).
- **PP — Premium Packs**: 프리미엄 코드 복사·에셋 다운로드·implementation pack 배포.

## Close Criteria (초안)

실제 결제 사용자가 구매를 완료하고 프리미엄 코드 복사·에셋 다운로드를 사용하는 것이 관측된다. 무료 방문자 경험은 회귀 없이 유지된다.

## Objective Impact Target

성공상태 ① 완결 + ② 달성. 장기 아크 4(제품 표면) 종결.

## Backlinks

- Objective: `docs/OBJECTIVE.md`
- Predecessor (queued after): `docs/horizons/2026-07-living-design-system.md`
- Paused by: `docs/horizons/2026-07-askewlydesign-editor-quality.md`
