# AI Slop Catalog — 금지 카탈로그

> 정적 reference. DESIGN.md § 8 Anti-patterns 를 채울 때 후보 풀로 사용.
> [prompt-patterns §9 AI-slop Smell Test](prompt-patterns.md#9-ai-slop-smell-test-검수) 와 짝.
>
> **차이점**: §9는 "기존 결과물을 점검하는 프롬프트", 이 문서는 **만들기 전에 박을 금지 목록**.

## A. CSS / 시각 효과 금지 (jha0313 `harness_framework` 흡수, 2026-05-14)

| 금지 사항 | 이유 | 대체 |
|---|---|---|
| `backdrop-filter: blur()` | glassmorphism = AI 템플릿의 가장 흔한 징후 | 단색 + 1px hairline border |
| 배경 그라데이션 텍스트 (`gradient-text`) | AI가 만든 SaaS 랜딩의 1번 특징 | 단색 + 충분한 size·weight |
| "Powered by AI" 류 배지 | 기능이 아니라 장식, 사용자에게 가치 0 | 빼라 |
| `box-shadow` 네온 글로우 애니메이션 | 네온 글로우 = AI slop 신호 | 그림자 안 쓰거나 hairline border |
| 보라/인디고 브랜드 색상 | "AI = 보라색" 클리셰 (Midjourney, Anthropic 마케팅, 등) | 도메인에 맞는 색 — 금융=무채색, 미디어=흑백+1 accent |
| 모든 카드 동일한 `rounded-2xl` | 균일한 둥근 모서리 = 템플릿 느낌 | 각진 카드 또는 비대칭 radius |
| 배경 gradient orb (`blur-3xl` 원형) | 모든 AI 랜딩 페이지에 있는 장식 | 비워두거나 grid / noise |

## B. 토큰·레이아웃 디폴트 금지 (`prompt-patterns §9` 에서 추출)

- 그림자 `0 4px 12px rgba(0,0,0,0.1)` — Material 디폴트 카피
- CTA가 보라/파랑 그라데이션
- 라운드 8 또는 12px (가장 흔한 디폴트)
- 폰트 Inter / Geist 만
- hero = 좌측 텍스트 + 우측 일러스트 split
- 카드 = white-on-light-gray + 1px border + 부드러운 그림자
- CTA 옆 "↗" 또는 "→" 아이콘
- dark mode 가 #000 아닌 #111~#1a1a1a (Vercel 디폴트)
- 헤딩 -2% letter-spacing
- 본문 16/24 + line-height 1.5 (= 모든 Tailwind 디폴트)

## C. 컴포넌트 패턴 금지 (커뮤니티 관찰, 갱신 가능)
- "토스트가 우상단 4초 후 자동 닫힘 + 옅은 그림자" (이건 그냥 shadcn 디폴트)
- 빈 상태 일러스트가 항상 사람·바구니·돋보기
- 로딩 스피너가 항상 좌->우 회전하는 원호

## 사용법

### 신규 DESIGN.md 작성 시
1. 이 카탈로그에서 본 시스템에 명백히 안 맞는 것 **3~5개**를 골라 § 8 Anti-patterns 에 그대로 박는다
2. 카탈로그 전체를 복사하지 말 것 — § 8 은 본 시스템의 "면역계"라서 짧고 날카로워야 함 ([design-md-guide.md §3](design-md-guide.md))

### Adversarial Critic 돌릴 때 (`prompt-patterns §7`)
"이 카탈로그의 A·B 항목 중 위반한 것 짚어줘" 라고 명시적으로 첨부.

### 갱신 정책
- AI 트렌드가 변하면 (보라색 → 그린, gradient → mesh 등) 항목 갱신
- 새 출처는 표 하단에 ` (출처, YYYY-MM)` 로 박기

---
*최종 갱신: 2026-05-14 (A 섹션 jha0313/harness_framework 에서 흡수)*
