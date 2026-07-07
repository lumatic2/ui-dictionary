# Figma Round-trip Pilot — Landing Hero (2026-07)

Milestone: FW2-1 (horizon: `docs/horizons/2026-07-figma-workflow.md`)
방법론: `methodology/figma-workflow.md` §2 (하이브리드 왕복 — 첫 실행)
상태: **왕복 완료** (2026-07-07 — ①~⑤ 전체 1일 내 닫힘)

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

### ④ 사용자 디테일링 (2026-07-07)

- 사용자가 Figma에서 직접 다듬음. **지속된 변경 2건: 헤드라인 fontSize 152 → 128px + 서브카피 수동 줄바꿈("system for" 뒤, Shift+Enter=U+2028)** (그 외 구조·간격·색·CTA는 push 원본과 동일).
- **정정 (2026-07-07)**: 1차 회수에서 줄바꿈을 누락 — U+2028이 JSON 문자열 출력에서 시각적으로 안 보여 characters 대조를 통과해버림. 사용자 지적으로 charCode 스캔 재검사에서 발견, 2차 회수로 반영.
- CTA pill 정합(1순위 제안 소재)은 "어떻게 건드려야 할지 모르겠다"로 보류 — **관찰**: 배리에이션 탐색은 프레임 복제 안내 없이는 사용자에게 진입 장벽이 있음. 미해결 과제로 이월(PSS2에서 처리).
- **후속 종결 (2026-07-07, PSS2 Step 11a)**: park된 CTA 결정을 방법론 재적용으로 닫음 — 오케스트레이터가 Figma "Hero Pilot" 페이지에 4/8/pill 배리에이션 보드(node 13:2)를 만들어 제시 → 사용자가 B(8px) 픽 → 코드(`rounded-lg`)·DESIGN.md(§7 sm→lg)·Figma 프레임 3자 8px 정합. **교훈 확증**: "배리에이션은 에이전트가 만들어 보여주면 사용자가 고르기만 하면 된다" — 방법론 §2④ 핸드오프에 조작 안내 대신 *배리에이션 선제작*이 더 나은 패턴.

### ⑤ 코드 회수 (2026-07-07)

- diff 판별: `use_figma` 읽기 전용 스크립트로 노드별 속성 스냅숏(fontSize/lineHeight/fills/padding/radius/strokes)을 push 원본과 전수 대조 — 구조 변경이 없을 땐 `get_design_context` 전체 코드 생성보다 이 방식이 정밀하고 저렴함.
- 코드 반영: `home-page.tsx` h1 `clamp(3.5rem,16vw,9.5rem)` → `clamp(3.5rem,16vw,8rem)` (데스크톱 최대 152→128px) + 서브카피 `<br className="hidden md:inline" />`(md+ 에서만 강제 줄바꿈, 모바일은 자연 줄바꿈 — Figma의 U+2028 의도 반영).
- 재검증: Vite dev + Playwright 1440×900, 콘솔 에러 0, oxlint 통과(선재 경고만). 부수 효과: 다음 섹션 노출 증가 — DESIGN.md §4 "dead poster 방지" 방향과 정합.
- 증거: `docs/research/evidence/figma-pilot-hero-after-1440.png` (before와 대조)

## 발견한 함정 (방법론 Changelog 후보)

- `generate_figma_design`이 도구 목록에 항상 있지는 않음 — `use_figma` 단독으로도 코드→Figma 승격 가능(구조 재구축 방식). 픽셀 퍼펙트 캡처가 아니라 "디자인 시스템 어휘로 재구성"이라 오히려 variables 바인딩이 자연스러움.
- variables가 있는 파일에 새 페이지로 승격하면 로컬 바인딩이 바로 됨 — 별도 파일 + 라이브러리 publish 경로(팀 플랜 제약)보다 간단.
- Geist 폰트 스타일명은 "SemiBold"(공백 없음) — Inter("Semi Bold")와 다름.
- 회수 diff는 구조 변경이 없으면 속성 스냅숏 전수 대조(`use_figma` 읽기 스크립트)가 `get_design_context`보다 정밀·저렴 — push 시점 값을 기록해둬야 가능하므로 승격 스크립트의 반환값(노드 ID+값)을 보존할 것.
- **텍스트 diff는 눈이 아니라 charCode로**: Figma Shift+Enter는 U+2028(LINE SEPARATOR)로 저장되고 JSON 문자열 출력에서 안 보인다 — characters 대조 시 charCodeAt 스캔(10/13/8232/8233) 필수. 또 `use_figma` 스크립트 안 정규식에 U+2028 리터럴이 들어가면 파서가 줄바꿈으로 해석해 SyntaxError.
- 사용자 디테일링 핸드오프에는 "배리에이션 탐색 = 프레임 복제 후 실험" 같은 조작 안내를 함께 줘야 함 — 소재 제안만으로는 진입 장벽(CTA pill 보류 사례).
