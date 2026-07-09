# Site Integrity Horizon — 벤치마크 재료 (2026-07-10)

> 목적: ui.askewly.com의 다음 horizon "Site Integrity"(placeholder/빈 컬렉션 제거, showcase 품질 확보, docs 심화) 결정을 위한 시장 재료 수집.
> 이 문서는 결론을 내리지 않는다. 판단은 사용자 몫이며, 아래는 재료(사례·인용·출처)만 정리한 것이다.
> 모든 항목 접근일: 2026-07-10

---

## 1. 콘텐츠 깊이 벤치마크 — breadth 대비 depth 유지 방식, 미완성 섹션 노출 정책

### Tailwind Plus (구 Tailwind UI)
- 카탈로그는 3개 최상위 카테고리(Marketing / Application UI / Ecommerce)로 breadth를 의도적으로 좁게 유지한다.
- 각 카테고리 페이지는 컴포넌트 개수를 명시한다 (예: "12 components", "19 components") — 숫자를 카탈로그 표면에 노출해 완성도를 스스로 증명하는 방식.
- 확인된 범위 내에서 **빈 슬롯, "coming soon" 섹션, placeholder 콘텐츠가 카탈로그 표면에 전혀 없다.** 나열된 모든 카테고리는 실제 라이브 프리뷰와 완전한 문서를 갖는다. 즉 "만들다 만" 상태를 공개 표면에 절대 노출하지 않는 정책으로 보인다.
- [출처: Tailwind CSS Components – Tailwind Plus](https://tailwindcss.com/plus/ui-blocks/)

### shadcn/ui
- 문서는 프레임워크별 설치 가이드(Next.js/Vite/Remix/Astro/Laravel/Gatsby 등) + 70+ 컴포넌트를 5개 카테고리(Form&Input / Layout&Navigation / Overlays&Dialogs / Feedback&Status / Display&Media)로 조직.
- "flat-file" 구조 + CLI 배포 방식으로, 컴포넌트 자체가 문서와 1:1 매칭되어 깊이가 얕아질 여지가 구조적으로 적음(문서 없는 컴포넌트를 배포할 수 없는 아키텍처).
- [출처: Introduction – shadcn/ui](https://ui.shadcn.com/docs), [Components – shadcn/ui](https://ui.shadcn.com/docs/components)

### 일반 디자인 시스템 문서 관행 — "coming soon" 패턴 실사례
- Mosaic Design System(oneadvanced.io)은 미완성 컴포넌트 페이지에 실제로 "Coming Soon" placeholder를 노출한다: "We cannot provide a description for this page right now."라는 문구가 컴포넌트 개별 페이지에 그대로 표시됨. (TLS 인증서 문제로 직접 fetch는 실패했으나 검색 스니펫으로 확인)
- 일반적 권고: 컴포넌트 개별 페이지는 상태(default/hover/active/disabled/error) + do/don't 예시 + 코드 스니펫 + prop 테이블을 갖춰야 "문서 부채(documentation rot)"가 누적되지 않는다는 것이 업계 공통 권고.
- [출처: Placeholder – Mosaic Design System](https://mosaic.oneadvanced.io/components/placeholder/), [Documentation That Drives Adoption – Figma Blog](https://www.figma.com/blog/design-systems-103-documentation-that-drives-adoption/), [How to document design system components – StackBlitz Blog](https://blog.stackblitz.com/posts/design-system-component-documentation/)

### 관찰된 두 가지 대조적 전략
1. **완전 은닉형** (Tailwind Plus): 미완성 카테고리는 아예 카탈로그에 목록화하지 않음. 나열된 것 = 완성된 것.
2. **명시적 placeholder형** (Mosaic 등 사내/오픈 디자인 시스템): "Coming Soon" 문구로 부재를 인정하되, 페이지 자체는 존재시켜 향후 링크 안정성을 유지.

---

## 2. 무료/유료 경계 사례 — 프리뷰 vs 잠금 설계

### Tailwind Plus
- **경계가 카탈로그 자체가 아니라 "구매 전/후"에 있음.** 로그인 여부와 무관하게 모든 컴포넌트가 웹사이트에서 라이브로 보이고 코드도 프리뷰 가능. 실제 코드 복사·다운로드만 유료.
- 단일 결제($149/패키지, $299 번들)로 평생 접근 — 구독 아님. "잠긴 콘텐츠"를 시각적으로 흐리게 하거나 badge로 표시하는 대신, 헤더의 "Sign in / Get full access" 버튼으로만 구분.
- [출처: Tailwind CSS Components – Tailwind Plus](https://tailwindcss.com/plus/ui-blocks/), [Tailwind Plus 소개](https://tailwindcss.com/plus)

### Untitled UI
- Figma/React/Icons 세 라인 모두 **완전 무료 버전이 별도로 존재** (상업적 이용 가능). Pro는 컴포넌트 수(10,000+ vs 무료 기본), 페이지 예시(420+), variables/다크모드 등 고급 기능으로 차별화.
- 경계 설계는 "잠금 표시"가 아니라 **조직적 분리**: 무료 리소스는 별도 메뉴("Resources" + FREE 배지)로, 유료는 "NEW!" 배지 + 3단계 가격표($59~$349)로 기능을 체크마크 목록으로 투명하게 제시.
- [출처: Untitled UI](https://www.untitledui.com/), [14 Best React UI Component Libraries – Untitled UI Blog](https://www.untitledui.com/blog/react-component-libraries)

### Flowbite / Flowbite Pro
- 무료 버전에 핵심 UI 컴포넌트 + JS 기능 전체 포함. Pro는 대시보드 레이아웃 전체, 마케팅 페이지 템플릿, 복잡한 UI 요소, Figma 디자인 시스템 추가.
- Developer Edition 일회성 $299.
- [출처: Flowbite Pro](https://flowbite.com/pro/), [Flowbite 무료/Pro 차이 – Helpdesk](https://flowbite.crisp.help/en/article/what-is-the-difference-between-the-free-and-pro-version-fa4qsv/)

### Preline / Preline Pro
- 무료 200+ 블록은 **프리뷰·복사·사용이 전부 가능** (open-source). Pro는 더 큰 블록/템플릿 컬렉션 + 애플리케이션 대시보드 데모 + 이커머스 데모 + Figma 시스템.
- [출처: Tailwind CSS Blocks – Free & Premium – Preline UI](https://preline.co/blocks/), [Preline Pro](https://preline.co/pro/)

### shadcnblocks.com (서드파티 shadcn 카탈로그)
- Basic-tier 블록은 로그인만 하면 전체 카탈로그 열람 가능. 1721 블록 / 1684 컴포넌트 / 17 템플릿 규모의 카탈로그를 "로그인 게이트"로 1차 필터링하고, 그 위에 결제 게이트를 얹는 2단 구조로 보임 (검색 스니펫 기반, 잠금 시각 표시의 구체적 형태는 직접 확인 못함).
- [출처: Shadcnblocks](https://www.shadcnblocks.com/)

### 공통 패턴 요약
- 4개 사례(Tailwind Plus, Untitled UI, Flowbite, Preline) 모두 **"라이브 프리뷰는 무료·전체 노출, 코드 소유/다운로드/고급 템플릿만 유료"** 라는 동일 골격을 공유. "블러 처리된 잠긴 카드"류의 노골적 paywall UI는 검색된 자료 범위 내에서 뚜렷이 확인되지 않았고, 오히려 가격표 페이지에서 체크마크 비교표로 투명하게 안내하는 방식이 우세.

---

## 3. Showcase/데모 품질 기준

- 2026년 기준 컴포넌트 라이브러리에 대한 업계 기대치: TypeScript 지원, WCAG 접근성, 라이트/다크 테마, SSR 호환성, 고성능이 사실상 표준으로 언급됨.
- 대시보드형 데모(예: "Haze" — shadcn/ui 기반 Next.js 96페이지 프로덕트)는 **실제처럼 보이는 mock 데이터**로 튜닝됨: 차트 대비, 배지 가독성, 서페이스 elevation을 다크 배경에서도 검증. 런타임 테마 커스터마이저로 컬러 모드/강조색/밀도/RTL을 리빌드 없이 토글 가능.
- Tailwind Plus는 모든 컴포넌트 패키지에 HTML/React/Vue 3개 포맷의 실제 코드 예시를 포함 — "복붙 가능한 완성 코드"가 최소 기준으로 보임.
- [출처: Top 16 React Component Libraries 2026 – Digital Thrive](https://digitalthriveai.com/en-us/resources/web-design/top-16-react-component-libraries-kits-ui/), [15 Best React UI Libraries for 2026 – Builder.io](https://www.builder.io/blog/react-component-libraries-2026), [Tailwind Plus](https://tailwindcss.com/plus)

> 주의: "인터랙티브 프리뷰(라이브 코드 실행)" 여부, 반응형 브레이크포인트 전환 데모 유무에 대해서는 검색 결과에서 개별 사이트별 구체적 확인이 부족했다. 필요 시 각 사이트를 직접 브라우징(Playwright)해 확인 권장.

---

## 4. AI/에이전트 소비 트렌드 — llms.txt, MCP, 에이전트용 문서

### shadcn/ui
- `ui.shadcn.com/llms.txt` 실제 존재 — AI 에이전트가 프레임워크별 설치 가이드, 70+ 컴포넌트 카탈로그, 테마/설정, monorepo/React19 등 고급 주제, 레지스트리 시스템까지 구조화된 경로로 탐색하도록 구성.
- **shadcn MCP 서버**: Claude Code, Cursor, VS Code(Copilot), Codex 등에서 자연어로 컴포넌트를 검색·설치 가능. 로컬에서 동작(외부 API 호출/자격증명 불필요)해 리스크 표면이 낮음.
- **shadcn/skills**: 코딩 에이전트에게 Radix/Base UI 프리미티브, 최신 API, 컴포넌트 패턴, 레지스트리 워크플로우 컨텍스트를 제공하는 전용 스킬 문서.
- [출처: llms.txt – shadcn UI](https://ui.shadcn.com/llms.txt), [Introduction – shadcn/ui](https://ui.shadcn.com/docs), [Skills – shadcn/ui](https://ui.shadcn.com/docs/skills)

### Figma
- 2026년 2월 Figma가 Claude Code와 양방향 통합(Design-to-Code + Code-to-Canvas) 공식 출시. 이후 MCP 서버 레지스트리가 2025년 Q1 1,200개에서 2026년 4월 9,400+개로 급증, 엔터프라이즈 AI 팀의 78%가 MCP 기반 에이전트를 프로덕션에 사용 중이라는 통계 인용됨(출처 원문 확인 필요 — 2차 블로그 인용).
- Figma MCP 서버는 선택된 프레임의 레이아웃/스타일/변수/Dev Mode 주석을 에이전트 컨텍스트 윈도우로 스트리밍. Code Connect로 매핑되어 있으면 실제 코드 리소스를 참조, 없으면 스타일 컨텍스트만 제공.
- [출처: Introducing our Dev Mode MCP server – Figma Blog](https://www.figma.com/blog/introducing-figma-mcp-server/), [Design Systems And AI: Why MCP Servers Are The Unlock – Figma Blog](https://www.figma.com/blog/design-systems-ai-mcp/), [Figma MCP Server Guide 2026 – RockB](https://baeseokjae.github.io/posts/figma-mcp-design-to-code-2026/)

### 공통 관찰
- llms.txt와 MCP는 "정적 문서 사이트"와 별개의 레이어로, **문서 depth 자체보다 구조화(파싱 가능한 경로, 명확한 카테고리 트리)** 가 에이전트 소비 품질을 좌우하는 것으로 보임.
- MCP를 제공하는 사이트(shadcn)는 로컬 실행·무자격증명 원칙을 강조 — 보안/신뢰 이슈를 사전에 차단하는 설계가 채택 확산의 조건으로 보임.

---

## Askewly Design Site Integrity horizon에 주는 시사점 (재료 요약, 결론 아님)

1. Tailwind Plus는 미완성 카테고리를 카탈로그에 아예 노출하지 않는 반면(완전 은닉), Mosaic류는 "Coming Soon" placeholder로 부재를 명시한다 — 두 전략 중 무엇을 택할지는 별도 판단 필요.
2. 4개 유료 모델 사례(Tailwind Plus/Untitled UI/Flowbite/Preline) 모두 라이브 프리뷰는 완전 무료·전체 노출이고 유료는 코드 소유/다운로드/고급 템플릿에만 걸린다 — "보이는 것과 가진 것"을 분리하는 패턴.
3. 2026년 데모 품질 하한선은 실사 mock 데이터 + 라이트/다크 검증 + 복붙 가능한 실제 코드(HTML/React/Vue 등 멀티 포맷)로 보인다.
4. shadcn은 llms.txt + MCP + 전용 skills 문서까지 3단으로 에이전트 소비 경로를 갖췄다 — Askewly Design의 "agent-facing design system" 목표와 직접 비교 가능한 참조점.
5. 카탈로그 breadth 증명 방식으로 Tailwind Plus는 카테고리별 컴포넌트 개수를 표면에 숫자로 노출한다 — 완성도를 정량적으로 드러내는 저비용 장치.

---

## 조사 한계
- 각 사이트를 직접 브라우징(스크린샷/Playwright)하지 않고 WebSearch/WebFetch 스니펫 기반으로 작성됨. 시각적 잠금 UI(블러/badge 등)의 정확한 형태는 미확인 항목으로 남겨둠.
- Figma MCP 채택률 통계(9,400+ 서버, 78% 엔터프라이즈)는 2차 블로그(RockB) 인용으로, 원 출처 재검증 필요.
- Radix Themes/Primitives의 "coming soon" 처리 방식은 검색 결과에서 구체적으로 확인되지 않음 — 직접 사이트 탐색 필요.
