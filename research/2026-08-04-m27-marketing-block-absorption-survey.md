# M27 step-1 — 외부 공개 마케팅 랜딩 블록 실사 + marketing-landing 베이스 판정

> 조사일: 2026-08-04 · 소비처: `plans/2026-08-04-m27-marketing-landing-block.md` step-2(블록 구현 베이스). 흡수 우선 규약(absorption-first) + M18 채택 규칙 3항(라이선스·구성 일치·품질 우위) 재사용.

## 1. 판정 요약

**베이스 채택 = 자체 조합 폴백 (결정 B 세트)** — 외부 후보 중 채택 규칙 3항을 전부 충족하는 것이 없다. M18(dashboard-01 흡수)과 결과가 갈린 이유 2가지:

1. **마케팅 블록 생태는 Next.js 결합이 기본값** — 최유력 tailark/blocks 는 MIT·2,272★·구성 완비지만 next/link 195파일·next/image 109파일(GitHub code search 실측)로 흡수 = 사실상 전 파일 프레임워크 재작성. 우리 소비 경로(Vite 신선 프로젝트 킥스타트)와 정면 충돌.
2. **자체 재료의 질이 M18 시점과 다르다** — M18 의 27 asset 은 조합 실적이 없었지만, 지금의 마케팅 계열 13종+(zigzag-story-section·terminal-demo-panel·logo-marquee·floating-bars-hero 등)는 **askewly.com 등 라이브 표면에서 harvest 로 회수된 것** — 조합이 실서비스로 이미 검증됐고, Askewly 시그니처가 구조에 배어 있다. 외부 generic 베이스는 어차피 전면 restyle 대상이라 품질 우위(규칙 ③)가 성립하지 않는다.

pricing·FAQ·footer 등 asset 부재 섹션은 자체 구현하되, tailark·Launch UI 를 **구조 참고(B 링크 참조)** 로만 쓴다.

## 2. 실측 표

| 후보 | 라이선스 (재배포) | 구성 일치 (결정 A 퍼널 시퀀스 대조) | import 표면·이식 비용 | 품질 | 판정 |
|---|---|---|---|---|---|
| **tailark/blocks** | **MIT** (LICENCE.md·GitHub API spdx MIT 실측, 2,272★) | hero·features·pricing·testimonials·FAQ·CTA·footer 등 300+ 블록 — 퍼널 전 구간 커버 ✓ | **next/link 195파일·next/image 109파일**(code search 실측) — Vite 소비자 대상 흡수 = 전 파일 프레임워크 임포트 재작성. shadcn registry 배포(장점)이나 Next 전제 | 높음(상용 채택 다수) — 단 generic face, 시그니처는 restyle 필요 | **기각 (구조 참고 B)** — 규칙 ③ 불충족 + 이식 비용 |
| Launch UI (launch-ui/launch-ui) | MIT (831★) | navbar·hero·items·logos·FAQ·stats·CTA·footer = 부분 커버. **testimonials·social proof·bento 는 Pro 유료** — 퍼널의 증거 구간이 유료 벽 | Next.js 16 결합 — tailark 와 동일 계열 이식 비용 | 중상 | 기각 (구조 참고 B — free 구간만) |
| HyperUI (markmead/hyperui) | MIT (12.2k★) | 마케팅 섹션 다수 | **플레인 Tailwind HTML 스니펫** — React/shadcn 아님, registry 모델·토큰 계약 불일치, 이식 = 전면 재작성 | 중 | 기각 |
| shadcn 공식 blocks | MIT | **마케팅 카테고리 부재** — dashboard·sidebar·login·calendar 등 앱 계열만(공식 blocks 페이지 실측) | — | — | 후보 불성립 |
| Magic UI templates · shadcnblocks.com | 템플릿/블록 유료 상품 | — | — | — | 기각 (M18 failure probe 선례: 유료·약관 불명확 = 추정 채택 금지) |

## 3. 채택 규칙 3항 대조 (자체 조합 폴백 근거)

1. **라이선스**: tailark·Launch UI·HyperUI 모두 MIT ✓ — 이 항은 통과 후보 존재.
2. **구성 일치**: tailark ✓ / Launch UI 부분(증거 구간 유료) / HyperUI 모델 불일치.
3. **품질 우위(자체 조합 대비)**: 전 후보 ✗ — (a) Next 결합 재작성 비용이 "이식"이 아니라 "재구현"이 됨 (b) 자체 마케팅 asset 13종+ 는 라이브 harvest 산(조합 실증 완료 + Askewly 시그니처 내장), 외부 generic 은 restyle 후에도 구조가 범용 — 두 번째 블록의 목적(우리 색채의 킥스타트)에 역행.

→ 3항 전부 충족 후보 없음 = **계획 결정 로그의 폴백 규칙 발동: 자체 조합 (결정 B 세트)**.

## 4. step-2 구현 파생 (실측 기반)

- 구성 asset(등재 실측 완료): `floating-bars-hero`(+`rotating-label` 헤드라인 슬롯)·`mesh-gradient-surface`·`logo-marquee`·`zigzag-story-section`·`terminal-demo-panel`·`contrast-duo-card`·`scroll-driven-reveal`·`staggered-entrance-group`.
- 자체 구현 섹션(asset 부재): pricing·FAQ(shadcn accordion)·최종 CTA·footer — 구조 참고: tailark pricing/footer 계열·Launch UI FAQ/CTA(코드 이식 없음, 링크만).
- mock 데이터 파일 1곳 분리(M18 관례 승계) — 카피·로고·가격이 소비자 첫 편집 지점.

## 5. 출처 (전건 접근일 2026-08-04)

- tailark/blocks (MIT·2,272★): https://github.com/tailark/blocks — next/link·next/image 계수: GitHub code search API (`repo:tailark/blocks next/link` = 195, `next/image` = 109)
- tailark.com (유료 티어 병존 — repo 는 MIT): https://tailark.com/
- Launch UI (MIT·831★·free/Pro 분할): https://github.com/launch-ui/launch-ui
- HyperUI (MIT·12.2k★·플레인 Tailwind): https://github.com/markmead/hyperui
- shadcn 공식 blocks(마케팅 카테고리 부재): https://ui.shadcn.com/blocks
- 후보군 서베이: https://adminlte.io/blog/shadcn-ui-landing-page-templates/ · https://www.shadcndeck.com/blog/shadcn-component-libraries

## 종료

포화 판정: 유력 후보(tailark)가 규칙 ③·이식 비용에서 기각되고, 나머지 후보는 동일 사유(프레임워크 결합·유료·모델 불일치)로 수렴 — 자체 조합 폴백 확정, 종료.
