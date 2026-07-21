# Claude Code × Figma 워크플로우 리서치 (2026-07-07)

> 조사 목적: "연결"이 아니라 "활용 방법론". 이 레포는 이미 원격 Figma MCP `use_figma`의 Plugin API 수준 쓰기(variables 생성·바인딩)를 실측 검증했고, 토큰 59개를 SSOT(`tokens/askewly.tokens.json`) → Figma variables로 동기화 완료한 상태에서 다음 활용 방향을 찾기 위한 조사.

## 1. 요약 (핵심 발견)

1. **원격 MCP가 사실상 표준 채널로 굳어졌다.** Figma는 데스크톱/로컬 MCP보다 `https://mcp.figma.com/mcp` 원격 서버를 "recommended" 경로로 명시하고, Claude Code/Cursor/VS Code/Codex 등 카탈로그에 등재된 클라이언트만 접속 가능하다. Claude Code는 공식 플러그인(`claude plugin install figma@claude-plugins-official`)이 MCP 설정 + Agent Skills를 함께 설치하는 방식으로 수렴했다.
2. **읽기/쓰기 두 방향 모두 공식 지원으로 전환됐다(2026 상반기).** `get_design_context`(Figma→코드), `use_figma`/`generate_figma_design`(코드→Figma 캔버스 쓰기)가 나란히 1급 도구로 문서화됐고, Figma는 이를 "Plugin API parity를 향해 가는 중"이라고 명시한다 — 우리가 이미 실측한 것과 정확히 일치.
3. **디자인 시스템 "실행 레이어"는 풀렸지만 "판단 레이어"는 아직이다.** Code Connect + variables + `get_design_context`로 컴포넌트/토큰 일치는 잘 되는데, 브랜드 톤·포지셔닝 같은 전략적 맥락은 agent가 접근할 방법이 없다는 게 2026 업계 담론의 핵심 비판(sameness.co). 디자이너 42%가 "브랜드/제품 맥락 부족"을 최대 난제로 꼽는다는 인용도 있음(출처 불명확, 원문 재인용 — 미확인).
4. **"AI 티 나는 UI"의 원인은 프롬프트가 아니라 프로세스 붕괴다.** "taste direction / visual exploration / implementation spec"을 한 프롬프트에 뭉치면 모델이 항상 안전한 평균(Inter 폰트, indigo 그라디언트, 3-card hero)으로 수렴한다는 분석(superdesign.dev). 이는 이 레포의 `methodology/prompt-patterns.md` 철학과 직접 연결 가능.
5. **디자인 시스템의 "기계 판독 가능성"이 새 병목이다.** 토큰이 있어도 구조적 규칙(3-tier 위계, 컴포넌트 관계, 상태 규칙)이 machine-readable 형태(DTCG JSON + `AGENTS.md` 1페이지)로 없으면 에이전트가 무시한다는 것이 반복적으로 지적됨.
6. **code-to-design(역방향)은 아직 실무 사례가 얇다.** `generate_figma_design`/`use_figma`가 최근에야 1급 도구가 되어, "코드 먼저 만들고 Figma로 밀어넣어 사람이 다듬는다"는 흐름은 도구는 있지만 검증된 성공 사례·팁이 design-to-code 대비 훨씬 적음 — 미확인 영역.
7. **경쟁 지형은 "채팅으로 앱 생성"(v0/Lovable/Bolt) vs "Figma-native 생성"(Figma Make) vs "코드-Figma 브리지"(Claude Code+MCP, Cursor+MCP, Builder.io)로 3분된다.** Claude Code 워크플로우는 세 번째 축에 속하며, 기존 코드베이스·디자인 시스템을 이미 가진 프로젝트(=이 레포)에 가장 적합하다는 것이 여러 비교글의 공통 결론.
8. **가격/거버넌스 리스크**: Figma 캔버스 쓰기(`use_figma` 등)는 현재 베타 무료, "향후 사용량 기반 유료 API"로 전환 예정 — 이미 이 레포 `CLAUDE.local.md`에 기록된 계정 이원화 이슈와 별개로, 장기 의존 시 비용 변수로 추적 필요.

## 2. 축별 발견

### 2.1 Figma 공식 MCP 지형

- 서버는 **remote(권장)** vs **desktop(로컬)** 두 종류. Remote가 기능 범위 최대치이며 OAuth 인증, `claude mcp add --transport http figma https://mcp.figma.com/mcp` 형태로 등록. Desktop은 특정 조직 제약 상황용.
- Remote 서버는 **Dev 또는 Full 시트(유료 플랜)** 가 필요 — 이 레포 이력의 "student tier Full seat"가 이 요건을 충족한 이유로 보임.
- 도구군: `get_design_context`(선택 프레임→코드, 기본 React+Tailwind, Vue/HTML/Swift 지정 가능), `get_screenshot`, `get_metadata`, `get_variable_defs`, `get_code_connect_map`/`add_code_connect_map`, `use_figma`(네이티브 콘텐츠 생성·수정 — 프레임/컴포넌트/오토레이아웃/variables), `generate_figma_design`(설명→Figma 레이어, 신규/기존 파일/클립보드로 출력), `generate_diagram`(FigJam).
- **2026년 3월 이후 공식 방향 전환**: Figma 블로그 "Agents, Meet the Figma Canvas" / "The Figma Design Agent is Here" — Config 2026(샌프란시스코, 6월 말)에서 "agent-native" 전환을 공식화. Design Agent가 키노트 전날 전사용자 배포. Skills(팀 컨벤션 패키징), Connectors(Notion/Slack/GitHub/Atlassian 등 양방향 쓰기)도 함께 발표.
- **쓰기 기능은 여전히 Plugin API "parity를 향해 가는 중"**이며 이미지 지원·커스텀 폰트부터 확장 중 — 완전 동등은 아직 아님. 이 레포가 실측한 "Plugin API 수준 쓰기"는 이 확장의 최전선에 해당하는 것으로 해석 가능.
- 가격: 캔버스 쓰기는 베타 기간 무료, 추후 유료 API化 예정.

출처:
- [Claude Code and Figma: Set up the MCP server](https://help.figma.com/hc/en-us/articles/39888612464151-Claude-Code-and-Figma-Set-up-the-MCP-server) (접근 2026-07-07)
- [Guide to the Figma MCP server](https://help.figma.com/hc/en-us/articles/32132100833559-Guide-to-the-Figma-MCP-server) (접근 2026-07-07)
- [Set up the remote server (recommended)](https://developers.figma.com/docs/figma-mcp-server/remote-server-installation/) (접근 2026-07-07)
- [figma/mcp-server-guide (GitHub)](https://github.com/figma/mcp-server-guide) (접근 2026-07-07, 목록만 확인·본문 미fetch)
- [Agents, Meet the Figma Canvas – Figma Blog](https://www.figma.com/blog/the-figma-canvas-is-now-open-to-agents/) (접근 2026-07-07, 검색결과 요약만·본문 미fetch — 미확인 등급 낮음)
- [The Figma Design Agent is Here – Figma Blog](https://www.figma.com/blog/the-figma-agent-is-here/) (접근 2026-07-07, 동일)
- [Figma MCP Catalog](https://www.figma.com/mcp-catalog/) (접근 2026-07-07, 목록만)

### 2.2 Code-to-Design (코드 → Figma)

- `generate_figma_design`은 Claude Code, Codex, VS Code에서 동작하며 **Playwright를 통해 살아있는 웹앱에 직접 주입**도 가능하다고 명시(빌더용 워크플로우: "러프한 AI 생성 UI를 Figma 캔버스로 승격시켜 정제").
- `html.to.design`(서드파티, MCP tab 제공)이 별도 경쟁/보완 도구로 존재 — "any HTML/CSS/JS를 Figma로 변환하는 유일한 API"라고 자체 주장.
- Figma 공식 "Workflow lab: Code to canvas" 문서가 존재(help.figma.com) — 이번 조사에서 본문 fetch는 하지 않음, 목록 확인만(미확인).
- **실무 팁/사례는 design-to-code 대비 확연히 얇다.** 검색 결과 상위 글 다수가 "가능하다"는 기능 소개 수준이고, "이렇게 하면 정확도가 오른다"는 구체적 노하우는 아직 축적되지 않은 것으로 보임 — code-to-design은 2026년 상반기 기준 **초기 단계**로 판단.
- 이 레포가 FB1~FB3에서 이미 검증한 반대 방향(코드 토큰 → Figma variables push)이 사실상 이 축의 실증 사례에 해당함.

출처:
- [Free Design to Code Generator – Figma](https://www.figma.com/solutions/design-to-code/) (접근 2026-07-07, 목록만)
- [Workflow lab: Code to canvas – Figma Help Center](https://help.figma.com/hc/en-us/articles/40219873508247-Workflow-lab-Code-to-canvas) (접근 2026-07-07, 목록만·미확인)
- [html.to.design MCP tab docs](https://html.to.design/docs/mcp-tab/) (접근 2026-07-07, 목록만)
- [Figma Design to Code, Code to Design: Clearly Explained – ByteByteGo](https://blog.bytebytego.com/p/figma-design-to-code-code-to-design) (접근 2026-07-07, 목록만·미확인)

### 2.3 Design-to-Code (Figma → 코드)

- **권장 루프**: "Figma 디자인 → 코드 생성 → 브라우저 확인 → 디자인 또는 코드 직접 수정 → 반복"(cyclical). 단발성이 아니라 짧은 순환 고리로 운영하라는 것이 공통 조언.
- **정확도를 올리는 준비 작업(파일 쪽)**:
  - Auto Layout 사용 — Flexbox/Grid로 깨끗하게 변환됨(절대좌표는 지저분한 코드로 이어짐).
  - 레이어 이름을 의미론적으로("hero-section", "cta-button") — "Frame 437" 같은 기본명은 품질 저하.
  - Figma variables로 색상/간격을 캡처해두면 토큰 생성이 일관됨.
  - 컴포넌트를 실제 Figma Component로 만들어두면 재사용 가능한 React 컴포넌트로 자동 변환.
- **프롬프트 전략**: "이 Figma 디자인 만들어줘" 같은 모호한 지시 대신 프레임워크/스타일링 방식/인터랙션까지 명시. 예시: "선택한 Figma 프레임을 React + Tailwind로 구현, 디자인의 정확한 색상·간격 사용".
- **Code Connect**로 Figma 컴포넌트 ↔ 실제 코드 컴포넌트를 매핑하면 "Primary Button"이 진짜 `<Button variant="primary" />`로 매핑되어 하드코딩된 제네릭 버튼 생성을 방지.
- **도구 호출 순서 권장**: `get_design_context` 먼저(구조화 데이터) → `get_screenshot`(시각 참조) → 구현 시작. 프로젝트당 1회 `create_design_system_rules`로 영구 규칙 파일 생성 권장(design system context를 지속적으로 주입).
- **흔한 실수**: 레이어 이름 부실, 절대좌표, 모호한 프롬프트 — 이 셋이 이후 대규모 수정을 유발.

출처:
- [The Complete Guide to Building a Design System in Figma Using Claude Code – Design Systems Collective](https://www.designsystemscollective.com/the-complete-guide-to-building-a-design-system-in-figma-using-claude-code-bd99d2b67327) (접근 2026-07-07, 검색요약만)
- [Figma to Code Best Practices — Claude Code for Designers](https://www.aiuxdesign.guide/guides/claude-code-learning-path/figma-to-code-best-practices) (접근 2026-07-07, 본문 fetch 완료)
- [Give Claude Code eyes and hands on your Figma design files using MCP](https://www.zerotopete.com/p/give-claude-code-eyes-and-hands-on) (접근 2026-07-07, 목록만·미확인)
- [Claude Code + Figma: A Designer-Developer Workflow That Actually Works! – Medium](https://medium.com/design-bootcamp/claude-code-figma-a-designer-developer-workflow-that-actually-works-b7d7545edc40) (접근 2026-07-07, 목록만·미확인)
- superdesign.dev 워크플로우 글(원 검색결과에 링크됨: `superdesign.dev/blog/figma-to-code-workflow`)은 fetch 시 404 — **접근 실패, 미확인 처리**

### 2.4 디자인 시스템 × 에이전트

- **3-tier 토큰(Global → Semantic → Element)이 업계 표준으로 재확인됨** — 이 레포의 `primitive → semantic → component` 3단계 관례와 정확히 일치. "Submit Button 배경만 바꾸려다 모든 Primary 요소가 초록색이 되는" 사고를 막는 근거로 재확인.
- **"Design System Context Gap" 담론**: 문제는 AI 역량이 아니라 실제 디자인 시스템에 대한 *접근성*이다. 토큰 값은 빠르게 전파되지만 구조적 규칙(컴포넌트 관계, 상태 규칙, 위계)은 machine-readable spec 없이는 전혀 전파되지 않는다는 것이 반복 지적됨.
- **권장 파이프라인 패턴** (atomize.tools 등 다수 소스 일치): Figma variables → **DTCG 포맷 JSON**으로 export → Style Dictionary로 CSS 빌드 → 에이전트가 코드 수정 전 읽는 **`AGENTS.md` 1페이지**를 진입점으로 고정. "각 작업에 자기 단계를 주고, 모델이 건너뛴 결정들의 평균을 내지 않고 당신이 내린 결정을 실행하게 하라"는 원칙.
- **W3C Design Tokens Community Group 스펙이 2025년 10월 v1.0 도달** — Figma/Sketch/Penpot이 같은 스펙을 구현 중이라, 도구 간 커스텀 변환 스크립트 없이 토큰 파일 이동이 가능해지는 방향(미확인 — 원문 재인용, 1차 소스 미확인).
- **자동화 CI/CD 사례**: Figma 자체 디자인 시스템 팀이 GitHub Action으로 Figma Variables → CSS 토큰 자동 동기화(디자이너가 variables 수정 → Action이 PR 생성 → 개발자가 리뷰·머지) — 이 레포의 "idempotent upsert" 스크립트(`generate-figma-variables-sync.mjs`)와 방향은 같으나 트리거 방향이 반대(Figma→코드 vs 이 레포는 코드→Figma)임에 유의.
- **"AI 티 안 나는 UI" 방법론(축 4의 핵심)**: "distributional convergence" — 모델이 안전한 평균(Inter/Roboto, indigo-to-purple 그라디언트, 중앙정렬 히어로+3카드)으로 수렴하는 이유는 학습 데이터의 "누구도 불쾌하게 하지 않는" 선택이 다수이기 때문. 코딩 에이전트는 "구현이 쉬운 것만 커밋"하는 경향으로 문제를 악화시킴. 해법은 프롬프트 개선이 아니라 **프로세스 분리**: ① Taste Direction(비주얼 가이드라인·레퍼런스 확정) ② Visual Exploration(발산적 옵션 다수 생성) ③ Implementation Spec(빌드 가능한 스펙 확정) — 세 단계를 하나의 프롬프트로 뭉치지 말 것.
- **브랜드 맥락 격차(sameness.co)**: 디자인 시스템("실행" 레이어: 컴포넌트·토큰·타이포·간격)은 이제 에이전트에 잘 노출되지만, 브랜드 맥락("판단" 레이어: 포지셔닝·톤·오디언스 이해·크리에이티브 원칙)은 여전히 기계 판독 불가능한 채로 남아있다는 비판. "두 레이어 모두에 접근 가능한 에이전트만이 시각적으로 일관될 뿐 아니라 전략적으로 일관된 결과를 낼 수 있다"는 주장. 42% 통계는 원문 재인용으로 1차 소스 미확인.

출처:
- [The Design System Context Gap – AI Guild Blue](https://aiguild.blue/the-design-system-context-gap-why-your-ai-coding-agent-doesnt-know-your-design-system/) (접근 2026-07-07, 목록만·미확인)
- [Stop AI from Ignoring Your Design Tokens — DTCG + AGENTS.md Workflow – atomize.tools](https://atomize.tools/blog/figma-design-tokens-vibe-coding/) (접근 2026-07-07, 검색요약만)
- [Can AI Follow Design Tokens? The Honest Answer (2026) – uxmagic.ai](https://uxmagic.ai/blog/ai-follow-design-tokens-honest-answer) (접근 2026-07-07, 목록만·미확인)
- [My 4-step framework to make design systems AI-readable – Muzli](https://medium.muz.li/my-4-step-framework-to-make-design-systems-ai-readable-74ba07145312) (접근 2026-07-07, 목록만·미확인)
- [Design Tokens: How to Sync Design and Code in Figma – Figma resource library](https://www.figma.com/resource-library/design-tokens/) (접근 2026-07-07, 목록만)
- [figma-design-sync (GitHub, lifesized)](https://github.com/lifesized/figma-design-sync) (접근 2026-07-07, 목록만·미확인)
- [Why AI Design Looks Generic (and How to Fix It) (2026) – superdesign.dev](https://superdesign.dev/blog/why-ai-design-looks-generic) (접근 2026-07-07, 본문 fetch 완료)
- [Figma Gave Agents Your Design System. Not Your Brand – sameness.co](https://www.sameness.co/blog/figma-config-brand-context) (접근 2026-07-07, 본문 fetch 완료)

### 2.5 경쟁·대안 지형

- **분류 축 3개로 정리됨**:
  1. **채팅으로 앱 생성**(v0, Lovable, Bolt.new): "설명하면 동작하는 앱이 나온다"에 가장 가까움. v0는 Vercel/Next.js 스택 친화, GitHub export가 **단방향**이라 왕복 워크플로우에 부적합. Lovable은 풀스택+멀티플레이어, **양방향 GitHub sync** 지원("Figma MCP in Cursor로 코드 변환 → Lovable에서 계속 빌드" 같은 흐름 가능). Bolt.new는 브라우저 기반 속도 우선.
  2. **Figma-네이티브 생성**(Figma Make): Figma 생태계 안에 있을 때 최적.
  3. **코드-Figma 브리지**(Claude Code+MCP, Cursor+MCP, Builder.io Visual Copilot): 기존 코드베이스·디자인 시스템이 있는 팀에 적합 — **이 레포의 위치**. Builder.io는 비주얼-CMS/디자인옵스 성향이 강해 엔터프라이즈 스택에 어울린다는 평.
- **MCP 서버 레지스트리 성장**: 2025 Q1 약 1,200개 → 2026 4월 9,400개 이상(수치는 재인용, 1차 소스 미확인) — MCP가 "design-to-code 워크플로우의 가장 의미 있는 아키텍처 전환"이라는 평가.
- **Cursor + Figma MCP 특기 사례**: 프로덕트 디자이너가 "일하는 방식이 바뀌었다"고 서술한 1인칭 사례 존재(Medium) — Cursor 쪽도 동일 remote MCP를 사용하므로 Claude Code 워크플로우와 도구 자체는 사실상 동일, 차이는 클라이언트 UX/에디터 통합 방식.
- Claude Code 워크플로우 차별점: 이미 검증된 것처럼 **코드가 SSOT이고 Figma는 파생물**인 구조를 만들 수 있다는 점(FB2 계약 문서와 일치) — v0/Lovable/Figma Make는 반대로 "생성 자체가 목적"이라 SSOT가 도구 내부에 갇히는 경향.

출처:
- [Brain Dump: How using Figma MCP Server with Cursor is changing my life as a product designer – Medium](https://medium.com/@mariamargarida/brain-dump-how-using-figma-mcp-server-with-cursor-is-changing-my-life-as-a-product-designer-830ae2e95a65) (접근 2026-07-07, 목록만·미확인)
- [Choosing your AI prototyping stack: Lovable, v0, Bolt, Replit, Cursor, Magic Patterns compared – Medium](https://annaarteeva.medium.com/choosing-your-ai-prototyping-stack-lovable-v0-bolt-replit-cursor-magic-patterns-compared-9a5194f163e9) (접근 2026-07-07, 목록만·미확인)
- [Lovable vs Builder.io vs Figma Make: What's the Vibe Code Tool for You? – DEV Community](https://dev.to/codelink/lovable-vs-builderio-vs-figma-make-whats-the-vibe-code-tool-for-you-174l) (접근 2026-07-07, 검색요약만)
- [Best Design to Code Tools Compared: Detailed Analysis – aimultiple](https://aimultiple.com/design-to-code) (접근 2026-07-07, 목록만·미확인)

## 3. 추천 워크플로우 후보

| 방식 | 강점 | 약점 | askewly 적합성 |
|---|---|---|---|
| **코드 SSOT → 원격 MCP `use_figma` 로 variables/컴포넌트 푸시** (현재 FB1~FB3 검증 경로) | 이미 실증됨(59토큰 idempotent 동기화), 코드가 SSOT로 남아 거버넌스 단순, DTCG/3-tier 관례와 정합 | 쓰기 API가 Plugin API parity 미완성(이미지·폰트 등 제한), 베타 무료→유료 전환 리스크, 브랜드 맥락(판단 레이어)은 여전히 코드에 없음 | **높음** — 이미 채택한 방향과 정확히 일치, 추가 투자로 Code Connect까지 확장 가능 |
| **Figma → `get_design_context` → Claude Code 구현(design-to-code 표준 루프)** | 업계 표준 워크플로우로 실무 팁 풍부(Auto Layout·레이어명·Code Connect), 사람이 디테일 다듬는 데 강함 | 이 레포는 아직 "사람이 먼저 Figma에서 디자인"하는 워크플로우가 아님(코드/DESIGN.md가 출발점) — 현재 관례와 방향이 반대 | 중간 — 향후 사람 디자이너가 Figma에서 먼저 목업할 경우에만 유효 |
| **`generate_figma_design`/`use_figma`로 코드→Figma 캔버스 승격(code-to-design)** | 이미 만든 React 컴포넌트를 사람이 다듬을 수 있는 Figma 레이어로 승격, 디자이너 핸드오프에 유용 | 실무 노하우 축적이 design-to-code 대비 훨씬 얇음(2026 상반기 초기 단계), Playwright 주입 등 파이프라인 복잡도 증가 | 중간 — showcase/atlas 페이지를 디자이너 리뷰용으로 Figma에 올리는 용도로는 유효할 수 있음(미검증) |
| **DTCG JSON + `AGENTS.md` 1페이지 진입점 패턴** | "AI가 토큰 무시" 문제의 구체적 해법으로 반복 추천됨, 구현 비용 낮음 | 이 레포는 이미 `CLAUDE.md`/`tokens/askewly.tokens.json`으로 유사 기능을 하고 있어 증분 가치가 제한적일 수 있음 | 중간 — DTCG 표준 정합성 점검 정도의 작은 개선 항목 |
| **브랜드 맥락 레이어 별도 구축(sameness.co 제안)** | "판단" 레이어를 명시화하면 에이전트 산출물의 전략적 일관성 향상 가능 | 개념 단계, 구체적 구현 패턴/표준 아직 없음(1차 소스 자체가 미확인 통계 포함) | 낮음~중간 — knowledge/ 문서 확장 아이디어로만 참고 |
| **v0/Lovable/Figma Make류 "채팅→앱" 생성** | 빠른 프로토타이핑, Figma 불필요 | SSOT가 도구 내부에 갇힘, 이 레포의 "코드가 SSOT" 철학과 충돌 | 낮음 — 이 레포 목적(에이전트용 디자인 시스템 자산 구축)과 어긋남 |

## 4. 메모 — 이 레포 다음 스텝 후보 (판단은 사용자 몫)

- `methodology/prompt-patterns.md`에 "taste direction / visual exploration / implementation spec" 3단계 분리 원칙을 명시적으로 채택할지 검토 가치 있음(§2.4 근거).
- `figma-codex-workflow` 스킬 갱신 항목(이미 `CLAUDE.local.md`에 기록된 3건)에 "get_design_context → get_screenshot → 구현" 순서, `create_design_system_rules` 1회 실행 권장을 추가할 여지.
- code-to-design(`generate_figma_design`/`use_figma`로 컴포넌트 승격) 실증은 이 레포에서 아직 하지 않은 축 — 다음 horizon 후보로 검토 가능하나, 실무 사례가 얇아 리스크가 design-to-code보다 큼.

---
*조사 방법: WebSearch(5축 × 최소 1쿼리) + WebFetch(주요 소스 6건 본문 확인, 1건 404로 스킵). 폭주 차단 조항에 따라 동일 원인 2회 실패 소스(superdesign.dev 워크플로우 글)는 건너뛰고 부분 보고로 마감. 통계·수치 인용 중 1차 소스 미확인분은 각 섹션에 "미확인"으로 표기.*
