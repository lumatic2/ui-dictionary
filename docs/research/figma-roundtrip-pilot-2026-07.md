# Figma Round-trip Pilot — Landing Hero (2026-07)

Milestone: FW2-1 (horizon: `docs/horizons/2026-07-figma-workflow.md`)
방법론: `methodology/figma-workflow.md` §2 (하이브리드 왕복 — 첫 실행)
상태: **④ 사용자 디테일링 대기** (2026-07-07 핸드오프)

## 왕복 기록

### ① Taste direction 고정 (2026-07-07)

- 소스: `DESIGN.md` (White System / Intentional Asymmetry) + PSS2 갭 노트.
- **핵심 긴장점 발견**: DESIGN.md §7 Button은 radius `sm`(4px)·§8 안티패턴에 "oversized rounded pills"를 규정하는데, 현행 hero CTA는 `rounded-full` pill — PSS2의 "hero pill-button reconciliation" 갭과 동일 지점. → **사용자 디테일링의 1순위 소재.**

### ② 코드 디자인 + 브라우저 검증 (2026-07-07)

- 대상: `examples/ui-vocabulary-site/src/components/home-page.tsx` HomePage hero (기존 구현 = 코드 디자인 산출물).
- 검증: Vite dev(:5173) + Playwright 1440×900, 콘솔 에러 0.
- 증거: `docs/research/evidence/figma-pilot-hero-before-1440.png`

### ③ Figma 승격 (2026-07-07)

- 채널: 원격 claude.ai Figma MCP `use_figma` (figma-use 스킬 리소스 로드, `whoami` = SKKU 계정 확인 — 계약 §1 준수). `generate_figma_design`은 세션 도구 목록에 없어 `use_figma` 단독 경로 사용.
- 대상 파일: **"Askewly Design Tokens"** (`xY42P22E7CtnvuxX8ZzZec`, 어스큐리 팀) — FB3 variables(38 primitive + 21 semantic light/dark)가 살아있는 파일에 새 페이지로 승격 → 로컬 variables 직접 바인딩 가능.
- 위치: 페이지 **"Hero Pilot 2026-07-07"** (`6:2`), 프레임 **"Landing Hero / Desktop 1440"** (`6:3`, 1440×900).
- URL: https://www.figma.com/design/xY42P22E7CtnvuxX8ZzZec/?node-id=6-3
- 구축: 3회 incremental 호출(탑바 → hero 본문 → 스크린샷 검증). 색상은 전부 variables 바인딩 — `color/semantic/surface/raised`(배경), `text/default`(헤드라인·로고), `text/muted`(서브카피·검색), `text/secondary`(nav), `action/primary`(로고 마크·Pro Plan), `component/button/bg`·`button/text`(primary CTA), `border/default`·`border/input`(secondary CTA·검색). 폰트 Geist(SemiBold/Medium/Regular).
- **안 옮겨진 것 (parity 한계, 사람 단계 보정 대상)**: FloatingField 배경 글리프(장식 모션 필드), 검색 돋보기 아이콘(placeholder 원으로 대체), hover/focus 상태, ShowcaseAtlas(스크롤 하부라 범위 제외).

### ④ 사용자 디테일링 — **여기서 대기**

다듬을 소재 제안:
1. **CTA pill vs radius `sm` 정합** (1순위 — DESIGN.md와 코드의 충돌 지점): pill 유지·DESIGN.md 개정 vs 4px 각형 전환 vs 중간값, Figma에서 배리에이션으로 탐색.
2. 헤드라인 스케일·자간, 서브카피와의 수직 리듬.
3. 검색 바 스타일(DESIGN.md §7 Input은 "bottom-border only" 규정 — 현행은 박스형).
- **금지**: `askewly/*` variables 값 직접 수정 (다음 push가 덮어씀 — 토큰 변경은 SSOT 제안으로).

### ⑤ 코드 회수 — (사용자 디테일링 후)

- 절차: `get_design_context`(6:3 또는 다듬은 프레임) → `get_screenshot` → 변경 diff를 코드 반영 → 브라우저 재검증.

## 발견한 함정 (방법론 Changelog 후보)

- `generate_figma_design`이 도구 목록에 항상 있지는 않음 — `use_figma` 단독으로도 코드→Figma 승격 가능(구조 재구축 방식). 픽셀 퍼펙트 캡처가 아니라 "디자인 시스템 어휘로 재구성"이라 오히려 variables 바인딩이 자연스러움.
- variables가 있는 파일에 새 페이지로 승격하면 로컬 바인딩이 바로 됨 — 별도 파일 + 라이브러리 publish 경로(팀 플랜 제약)보다 간단.
- Geist 폰트 스타일명은 "SemiBold"(공백 없음) — Inter("Semi Bold")와 다름.
