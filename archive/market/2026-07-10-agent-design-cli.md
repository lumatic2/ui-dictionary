# 시장·선례 조사 — 에이전트/개발자용 디자인 시스템 CLI + 후속 데스크톱 앱

- **의뢰 맥락**: Askewly Design(ui.askewly.com)의 다음 단계로 (1) 에이전트/개발자용 CLI(디자인 시스템 질의·프로젝트 주입·검증), (2) 후속 데스크톱 앱을 검토
- **조사일**: 2026-07-10
- **범위**: 5개 항목 — shadcn CLI 모델, 토큰 CLI 선례, 에이전트-facing 디자인 도구 신호, 데스크톱 유틸리티 앱 선례, 수익화 선례

---

## 1. shadcn/ui CLI 모델 분석

### 핵심 발견

1. **Registry는 JSON 스키마 기반 오픈 포맷** — `registry.json`(카탈로그)과 `registry-item.json`(개별 아이템)이 공식 스키마(`https://ui.shadcn.com/schema/registry.json`)로 공개돼 있어, 누구나 자체 registry를 운영할 수 있다. 컴포넌트뿐 아니라 hooks, pages, config, rules, 임의 파일까지 배포 대상이 될 수 있다.
2. **주입 모델은 "복사"이지 "의존성 설치"가 아니다** — `npx shadcn add`는 npm 패키지처럼 node_modules에 넣는 게 아니라 소스 코드를 프로젝트에 직접 복사한다. 이는 사용자가 코드를 소유·수정할 수 있게 하는 shadcn의 핵심 차별점이며, Askewly CLI가 "컴포넌트/레시피 주입" 기능을 설계할 때 그대로 참조할 수 있는 모델이다.
3. **네임스페이스로 커뮤니티 registry 생태계가 실제로 작동 중** — shadcn 3.0에서 `@namespace/item` 문법이 도입되며 `npx shadcn add @aceternity/card` 같은 서드파티 설치가 표준화됐다. `shadcnregistry.com`, `registry.directory` 같은 디스커버리 사이트가 자생적으로 생겼고, Aceternity UI 같은 대형 커뮤니티 registry(150+ 컴포넌트)가 존재한다.
4. **2026년 들어 registry 저작 도구가 성숙 단계로 진입** — 2026-03 CLI v4, 2026-05에 `include`(여러 registry.json 합성)와 `shadcn registry validate`(배포 전 검증)가 추가됐다. 이는 "혼자 만드는 작은 registry"에서 "여러 파일로 구성된 대형 registry를 검증까지 거쳐 배포"하는 성숙 워크플로우로 진화했음을 보여준다.
5. **MCP 서버도 공식 제공** — `ui.shadcn.com/docs/mcp`에서 Claude Code/Cursor 등이 registry를 직접 질의할 수 있는 MCP 서버를 제공. CLI와 MCP를 병행 제공하는 것이 이제 표준 패턴이다.

### Askewly 차용/차별화 지점

- **차용**: registry-item.json 유사 스키마로 UI 용어 536종 + 컴포넌트 레시피를 "복사 주입" 가능한 단위로 노출. `npx shadcn add` 방식처럼 `askewly add <term-id>`로 토큰 참조 컴포넌트를 프로젝트에 직접 심는 방식.
- **차별화**: shadcn은 "컴포넌트 카탈로그"이고 Askewly는 "토큰 SSOT + 용어 사전 + 레시피"를 함께 갖고 있다. CLI 질의 대상이 코드뿐 아니라 **디자인 개념 정의**(JTBD, anti-pattern, 관련 용어)까지 포함되는 것이 차별점이 될 수 있다.

[출처: Introduction - shadcn/ui](https://ui.shadcn.com/docs/registry) | [registry-item.json](https://ui.shadcn.com/docs/registry/registry-item-json) | [March 2026 - shadcn/cli v4](https://ui.shadcn.com/docs/changelog/2026-03-cli-v4) | [May 2026 - Registry Include and Validate](https://ui.shadcn.com/docs/changelog/2026-05-registry-include) | [Namespaces](https://ui.shadcn.com/docs/registry/namespace) | [MCP Server](https://ui.shadcn.com/docs/mcp) | [registry.directory](https://registry.directory/)

---

## 2. 디자인 토큰 CLI/도구 선례

### 비교표

| 도구 | 유형 | 소스 오브 트루스 | DTCG 지원 | 가격 | 포지셔닝 |
|---|---|---|---|---|---|
| Style Dictionary | CLI 변환 엔진 | JSON 토큰 파일 | 도입 중 (Terrazzo 경로 추종) | 오픈소스 무료 | 캐노니컬 토큰→코드 변환기, 사실상 업계 표준 |
| Terrazzo (구 Cobalt) | CLI 변환 엔진 | JSON 토큰 파일 (DTCG) | 완전 지원 (유일) | 오픈소스 무료 | DTCG 완전 준수를 앞세운 차세대 대안 |
| Tokens Studio | Figma 플러그인 + CLI 보조 | Figma | DTCG 호환(완전 아님) | 프리미엄(유료) | 디자이너용 Figma 소스 → 개발 파이프라인 브리지 |

### 핵심 발견

1. **DTCG(Design Tokens Community Group) 스펙이 2025-10에 첫 안정 버전(2025.10)에 도달** — Style Dictionary·Tokens Studio·Terrazzo가 레퍼런스 구현체로 명시되어, 토큰 파일이 "Figma에서 export → Style Dictionary 변환 → Tailwind config → CI"까지 커스텀 글루 코드 없이 흐를 수 있게 됐다. Askewly의 DTCG 토큰 SSOT가 이 표준에 이미 정렬돼 있다는 점은 시장 타이밍상 유리하다.
2. **Style Dictionary는 "변환 엔진"이지 "질의 엔진"이 아니다** — 세 도구 모두 토큰 JSON을 CSS/Sass/JS 등으로 변환하는 데 집중하며, "이 토큰이 왜 이 값인지", "이 컴포넌트에 어떤 토큰을 써야 하는지" 같은 의미론적 질의 기능은 없다. 이는 Askewly CLI가 채울 수 있는 명확한 공백이다(토큰 변환기가 아니라 **디자인 시스템 질의/검증 도구**).
3. **Tokens Studio는 유료(freemium)인 반면 Style Dictionary·Terrazzo는 완전 무료 오픈소스** — 토큰 CLI 자체로는 직접 과금이 어렵고, Figma 플러그인처럼 디자이너 워크플로우에 결합된 지점에서만 과금이 성립한 전례.
4. **Specify.app 관련 검색에서 명확한 종료 공지를 찾지 못함** — 검색 결과는 대부분 DTCG 스펙 논의로 수렴됐고 Specify의 현재 상태는 확인되지 않음. (조사 미완 — 별도 확인 필요, 확정 주장 보류)

[출처: Design Tokens specification reaches first stable version](https://www.w3.org/community/design-tokens/2025/10/28/design-tokens-specification-reaches-first-stable-version/) | [Getting Started - Terrazzo](https://terrazzo.app/docs/) | [Style Dictionary + SD Transforms - Tokens Studio](https://docs.tokens.studio/transform-tokens/style-dictionary) | [Design Tokens | Style Dictionary](https://styledictionary.com/info/tokens/) | [GitHub - style-dictionary/style-dictionary](https://github.com/style-dictionary/style-dictionary)

---

## 3. 에이전트-facing 디자인 도구 신호 (2025-2026)

### 핵심 발견

1. **llms.txt 채택률은 여전히 낮지만(10% 안팎) 개발자 도구/SaaS 영역에 집중** — SE Ranking 표본(30만 도메인) 기준 전체 채택률 ~10%, 트래픽 티어별 차이는 거의 없음. 다만 IDE 에이전트(Cursor, Claude Code, Copilot, Windsurf)와 MCP 서버가 llms.txt를 실제로 fetch하는 소비 주체로 확인되어, **개발자 문서/디자인 시스템처럼 에이전트 오디언스가 명확한 카테고리에서 ROI가 상대적으로 높다.** Askewly가 이미 llms.txt를 갖춘 것은 얼리무버 포지션.
2. **Figma가 2026년 MCP 서버를 "디자인 시스템의 AI 언락 지점"으로 명시적으로 포지셔닝** — 자동 design-system-rules 파일 생성(토큰 정의·컴포넌트 라이브러리·네이밍 컨벤션을 구조화해 에이전트에게 제공), `use_figma` 범용 JS 실행 툴(2026-03) 등, "디자인 시스템을 에이전트가 소비 가능한 규칙 파일로 변환"하는 것이 업계 표준 패턴이 되고 있다. 단, **결과 편차가 크다** — 잘 구조화된 디자인 시스템을 가진 팀은 대시보드 구현이 2-3일 → 반나절로 단축되지만, 정돈 안 된 Figma 파일을 가진 팀은 개선이 미미하다는 실증 보고가 있다. → Askewly의 잘 구조화된 3-tier 토큰·536종 용어 SSOT가 실질적 경쟁우위로 작용할 수 있는 지점.
3. **"디자인 시스템은 AI를 위해 준비되지 않았다"는 담론이 2026년 업계 컨퍼런스 수준으로 확산** — AI Design Systems Conference 2026에서 다뤄진 핵심 문제: (a) docs·tokens·components 세 소스가 서로 다른 말을 하면 에이전트가 무엇이 맞는지 판단 못함(single source of truth 붕괴), (b) 컴포넌트 문서가 하나의 큰 블록(props+variants+a11y+usage 전부)이면 컨텍스트 윈도우 낭비가 크다. → Askewly의 "DTCG SSOT + 3-tier 토큰(primitive→semantic→component)" 구조가 이 업계 페인포인트에 정확히 대응한다는 근거 자료로 인용 가능.
4. **MCP 자체의 토큰 비용 논쟁이 진행 중 (2026)** — "MCP is dead, long live the CLI"라는 HN 인기 글(295 포인트/205 댓글)이 CLI가 MCP보다 토큰 효율적이라 주장. 실측치로 MCP가 CLI 대비 4-32배 토큰 비용이 높다는 벤치마크(Scalekit)도 인용됨. → **CLI를 1차 인터페이스로, MCP를 부가 옵션으로 두는 설계가 현재 업계 정서에 부합** (의뢰의 "CLI 우선" 방향과 일치).

### 요약 시사점

에이전트가 소비하는 디자인 시스템에 대한 수요 신호는 뚜렷하지만(Figma의 전사적 투자, 컨퍼런스 담론), **정작 CLI 형태로 "질의·검증"을 제공하는 독립 제품은 아직 드물다** — 대부분 Figma MCP처럼 "디자인 툴 벤더가 자사 파일을 에이전트에 노출"하는 방향이거나, shadcn처럼 "컴포넌트 코드 주입"에 집중돼 있다. **"토큰+용어+레시피 SSOT를 질의·검증 가능한 CLI로 제공"하는 포지션은 상대적으로 비어 있는 틈새**다.

[출처: State of llms.txt 2026 - Presenc AI](https://presenc.ai/research/state-of-llms-txt-2026) | [Design Systems And AI: Why MCP Servers Are The Unlock - Figma Blog](https://www.figma.com/blog/design-systems-ai-mcp/) | [Figma MCP Server Guide 2026](https://baeseokjae.github.io/posts/figma-mcp-design-to-code-2026/) | [Your Design System Is Not Ready for AI Agents](https://www.intodesignsystems.com/blog/design-system-not-ready-for-ai-agents) | [Design Systems for AI agents: The New Paradigm Shift](https://medium.com/@vicentegrafico.com/design-systems-for-ai-agents-the-new-paradigm-shift-ad097cfae228) | [Actually, MCP wastes a lot of tokens - Hacker News](https://news.ycombinator.com/item?id=45954572) | [MCP Token Cost Problem - buildmvpfast](https://www.buildmvpfast.com/blog/mcp-hidden-cost-cli-agent-infrastructure-2026)

---

## 4. 데스크톱 디자인 유틸리티 앱 선례

### 성공 패턴 vs 실패 패턴

| 사례 | 왜 데스크톱이 필요했나 (성공 요인) |
|---|---|
| Sip, ColorSlurp (메뉴바 색상 피커) | OS 클립보드/화면 픽셀 접근은 브라우저 API로 불가능. Photoshop·Xcode 등 타 네이티브 앱과의 실시간 연동(Cmd 키로 값 삽입)도 웹에서는 불가. → **OS-레벨 접근이 필수인 기능**이 데스크톱 존재 이유 |
| Raycast (런처 + 확장 스토어) | 시스템 전역 단축키, 클립보드 히스토리, 파일시스템 접근 등 OS 통합이 핵심 가치. 확장 생태계는 앱스토어형 커뮤니티 모델(GitHub 기반 오픈 기여 → 스토어 배포)로 shadcn registry와 유사한 "생태계 위임" 전략을 취함 |
| Figma Desktop | 로컬 폰트 전체 접근(웹은 Google Fonts만), 오프라인 작업, 대용량 파일 성능 — **웹 API의 구조적 한계**가 근거. 다만 핵심 기능은 웹과 동일하며 데스크톱은 "성능/접근성 강화판"이지 별개 제품이 아님 |
| Tauri 기반 개발자 도구(범용) | 파일시스템·클립보드 접근, 3MB 미만 경량 바이너리(Electron 대비), Rust 백엔드로 무거운 로컬 연산(예: 이미지 처리, 토큰 diff 대량 연산) 오프로드 가능 |

### 핵심 발견

1. **데스크톱 앱이 정당화되는 공통 조건은 "OS-레벨 접근이 필요한 기능"이지 "웹보다 예쁘다/빠르다"가 아니다.** 클립보드 전역 접근, 화면 픽셀 스포이드, 로컬 파일시스템 스캔, 시스템 전역 단축키 — 이런 것들은 브라우저 sandbox로 원천 불가능하다.
2. **실패 패턴(암묵적, 검색에서 직접 발견은 못했으나 업계 상식으로 보강 필요)**: 웹 기능을 그대로 감싼("wrapper") 데스크톱 앱은 설치 마찰 대비 가치가 낮아 채택이 저조한 경우가 많다는 것이 Tauri/Electron 커뮤니티의 통설이나, 이번 검색에서 구체적 실패 사례 출처는 확보하지 못함(추가 조사 필요 항목으로 남김).
3. **Tauri는 "웹 프론트엔드 + Rust 백엔드"로 기존 React/Tailwind 자산을 재사용할 수 있어, Askewly처럼 이미 웹 UI(Vite+React+TS+Tailwind)가 있는 프로젝트가 데스크톱으로 확장할 때 코드 재사용률이 높은 선택지**다. Electron 대비 번들 크기(3MB 미만) 우위도 개발자 도구 배포에 유리.

### Askewly 데스크톱 앱 함의

현재 웹사이트(browsing) + CLI(query/inject/validate)만으로는 채워지지 않는 "OS 접근이 필요한 기능"이 있어야 데스크톱 앱이 정당화된다. 후보: (a) 로컬 프로젝트 파일시스템을 스캔해 토큰 사용 현황을 실시간 진단, (b) 시스템 전역 색상 피커로 스크린 픽셀 → Askewly 토큰 매칭(예: "이 색이 우리 시스템의 어떤 semantic token에 가장 가까운가"), (c) 클립보드에 복사된 코드 스니펫을 감지해 즉시 토큰 lint. 단순 "웹사이트를 앱으로 감싼" 버전은 이번 조사 근거상 정당화되지 않는다.

[출처: Pricing - Sip for Mac](https://sipapp.io/pricing/) | [Pricing - ColorSlurp](https://colorslurp.com/pricing) | [How the Raycast API and extensions work](https://www.raycast.com/blog/how-raycast-api-extensions-work) | [Raycast Developer Program](https://www.raycast.com/developer-program) | [Understanding the Differences Between Web App and Desktop - Figma](https://blog.nobledesktop.com/learn/figma/understanding-the-differences-between-web-app-and-desktop-app-for-figma) | [What is Tauri?](https://v2.tauri.app/start/) | [Tauri adoption guide - LogRocket](https://blog.logrocket.com/tauri-adoption-guide/)

---

## 5. 수익화 선례

### 표: CLI/registry 기반 유료화 모델 비교

| 플레이어 | 무료 티어 | 유료 티어 | 가격 | 과금 단위 |
|---|---|---|---|---|
| shadcn/ui (공식) | 전체 registry 무료, MIT 라이선스 | 없음(공식 자체는 무료) | - | - |
| Shadcnblocks.com (서드파티) | 일부 무료 블록 | Pro/Premium (블록 6167+, Figma 키트, Admin 키트) | Pro $149 / Premium $299, 평생 라이선스 + 월 50+ 신규 블록 | 1회 결제(라이프타임) |
| Tailwind Plus (공식, 구 Tailwind UI) | 없음(전부 유료) | Personal / Team | Personal $299 / Team(25인) $979, 평생 접근 | 1회 결제, 구독 아님 |
| Raycast | Free (기본 런처+확장) | Pro | $8/월(연간 결제) | 월 구독, AI 기능이 유료 게이트 |
| Tokens Studio | 무료 플러그인 코어 | Pro(팀 협업 기능) | 프리미엄 구독 | 월/연 구독 |

### 핵심 발견

1. **"CLI/registry 자체는 무료, 콘텐츠 볼륨·프로 자산이 유료"라는 패턴이 지배적** — shadcn 공식 CLI·스키마는 완전 무료 오픈소스지만, 서드파티(Shadcnblocks)가 방대한 블록 라이브러리(6000+)와 Figma 키트를 라이프타임 결제로 판매하는 구조. **CLI를 무료 오픈 인프라로 두고, 그 위에 프리미엄 콘텐츠(레시피, 템플릿, Figma 자산)를 얹는 모델**이 검증돼 있다.
2. **Tailwind Plus는 "구독이 아닌 라이프타임 1회 결제"를 명시적으로 차별점으로 내세움** — SaaS 구독 피로도가 있는 개발자 도구 시장에서 1회 결제 모델이 여전히 강한 소구점.
3. **Raycast는 "코어 기능 무료 + AI 기능만 구독 게이트"** — 유틸리티 자체는 무료로 채택률을 넓히고, AI 관련 신규 기능에서만 과금하는 것이 최근(2025-2026) 개발자 도구의 표준 패턴. Askewly도 "CLI 질의/검증은 무료, 에이전트 자동 주입·프로젝트 전체 마이그레이션 같은 고급 기능은 유료"로 설계 가능.
4. **Figma 키트/디자인 자산 자체가 별도 SKU로 팔림** (Shadcnblocks Premium에 Figma Kit 포함) — 코드 자산과 디자인 자산(Figma 파일)을 분리 과금하는 것도 관찰되는 패턴.

### Askewly 수익화 후크 후보 (근거 기반)

- **CLI 코어(질의·검증·기본 주입) = 무료** — shadcn/Style Dictionary 패턴 답습, 채택 극대화가 우선
- **프리미엄 레시피/템플릿 팩(라이프타임 결제)** — Tailwind Plus·Shadcnblocks 패턴. 이미 CLAUDE.md에 "결제 사용자에게 코드 복사·에셋 다운로드" 계획이 있어 정합
- **팀/조직용 프라이빗 registry 호스팅(구독)** — shadcn 네임스페이스 모델 + Raycast Pro 구독 패턴 혼합
- **데스크톱 앱의 고급 진단 기능(예: 프로젝트 전체 토큰 마이그레이션 자동화)만 유료 게이트** — Raycast의 "무료 코어 + 유료 AI 기능" 구조 차용

[출처: Shadcnblocks.com Pricing](https://www.shadcnblocks.com/pricing) | [Tailwind Plus](https://tailwindcss.com/plus) | [Raycast Developer Program](https://www.raycast.com/developer-program) | [Style Dictionary + SD Transforms - Tokens Studio](https://docs.tokens.studio/transform-tokens/style-dictionary)

---

## Askewly Design 함의

### CLI 범위 추천

1. **1차 인터페이스는 CLI, MCP는 부가 옵션** — 2026년 HN 담론(MCP 토큰 비용 4-32배)과 "MCP is dead, long live the CLI" 여론을 볼 때, CLI를 우선 배포하고 MCP 서버는 CLI를 감싸는 얇은 래퍼로 나중에 추가하는 순서가 안전하다.
2. **주입 모델은 shadcn의 "복사 주입"을 그대로 따르되, 대상을 코드+개념 정의로 확장** — `askewly add <term-id>`가 컴포넌트 코드뿐 아니라 관련 토큰 참조, JTBD 정의, anti-pattern 경고까지 함께 주입하는 것이 shadcn 대비 차별점.
3. **질의/검증 기능이 핵심 공백** — Style Dictionary·Terrazzo는 변환기이지 질의 엔진이 아니다. `askewly check`(프로젝트의 하드코딩 색상을 semantic token으로 매핑 제안), `askewly explain <token>`(rationale·사용처 조회) 같은 기능이 기존 도구가 채우지 못한 틈새.
4. **DTCG 정렬을 마케팅 포인트로 명시** — 2025-10 DTCG 1.0 안정화 직후이므로 "우리 SSOT는 표준 스펙 기반"이라는 주장이 타이밍상 설득력 있다.

### 앱(데스크톱) 차별화 각도

1. **웹사이트의 단순 wrapper는 근거가 없다** — OS-레벨 접근(화면 픽셀 스포이드→토큰 매칭, 로컬 프로젝트 파일시스템 스캔, 클립보드 감지)처럼 브라우저로 불가능한 기능이 있을 때만 데스크톱 앱을 만들어야 한다는 것이 Sip/ColorSlurp/Raycast/Figma Desktop 선례의 공통 결론.
2. **Tauri가 기술적으로 적합** — 기존 Vite+React+TS+Tailwind 자산을 그대로 재사용 가능하고 번들 크기가 작다.
3. **"디자인 시스템 준수 여부를 로컬에서 실시간 진단"이 가장 근거 있는 데스크톱 전용 기능** — 2026년 업계 담론(Figma MCP의 "design-system-rules 자동 생성", "AI 에이전트를 위한 준비 안 된 디자인 시스템" 문제)이 정확히 이 지점을 가리킨다.

### 수익화 후크 후보

1. CLI 코어 무료(채택 극대화) + 프리미엄 레시피/템플릿 팩 라이프타임 결제(Tailwind Plus·Shadcnblocks 패턴)
2. 팀용 프라이빗 registry/호스팅 구독(shadcn 네임스페이스 + Raycast Pro 하이브리드)
3. 데스크톱 앱의 고급 진단·자동 마이그레이션 기능만 유료 게이트(Raycast식 "무료 코어 + 유료 AI 기능")

### 확인이 더 필요한 항목 (조사 미완, 확정 주장 보류)

- Specify.app의 현재 운영 상태(종료/피벗 여부) — 이번 검색에서 확인 못함
- 데스크톱 유틸리티 앱의 구체적 **실패** 사례(단순 wrapper로 실패한 예시) — 업계 통설 수준 언급만 가능, 1차 출처 미확보
