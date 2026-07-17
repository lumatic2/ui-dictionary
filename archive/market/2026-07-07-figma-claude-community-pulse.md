# Figma × Claude Code 커뮤니티 펄스 (2026-06-07 ~ 2026-07-07)

> 리서치 방법: `/last30days` 스킬은 Python 엔진 실행에 API 키·yt-dlp 등 무거운 전제조건이 필요해, 스킬이 명시한 폴백 경로("WebSearch로 직접 수행")를 사용했다. Reddit/HN/X 대상 site-scoped 검색을 시도했으나 색인 커버리지가 낮아 상당수는 0건이었다(아래 "커버리지 한계" 참조). 일반 웹 검색(블로그·뉴스·공식 문서)이 주 소스이며, Reddit/HN/X 원문 스레드는 확보된 것만 표기했다.

## ① 한눈 요약

**뜨는 것**
- **Code ↔ Canvas 양방향 흐름이 표준 화두가 됨.** "Figma 프레임 URL → Claude Code에 붙여넣고 구현" (design-to-code)과 "Claude Code에서 만든 UI를 Figma 캔버스로 되쏘기" (code-to-design, "Code to Canvas") 두 방향이 모두 실사용 워크플로우로 자리잡았다는 게시물이 다수. 2026-02-17 Figma×Anthropic 공식 파트너십 이후 6월 말 TechCrunch가 "code layers" 정식 출시를 보도.
- **1차 정확도 85~90% 체감이 반복 언급됨.** Auto Layout·컴포넌트 네이밍이 잘 된 Figma 파일일수록 정확도가 높고, 반응형 동작·애니메이션 타이밍 등 나머지 10~15%는 여전히 수작업이라는 서술이 여러 출처에서 유사하게 등장(925studios 플레이북, ByteByteGo 등 — 출처 간 표현이 유사해 원출처 하나에서 재인용됐을 가능성 있음, 교차검증 부족).
- **"라운드트립" 워크플로우 서사** — design→code→canvas→refine→code 루프를 실제로 구축했다는 개인 후기(Medium/Substack)가 6월에 다수 게재.

**지는 것 / 논쟁점**
- **Figma 주가·산업 위협 프레이밍.** (주의: 이 항목은 30일 창 밖) 4월 Claude Design 출시 당일 Figma 주가 -4.26%(장중 -7%)라는 r/FigmaDesign발 수치가 재인용되는데, 이는 2026-06-07 이전 사건이라 이번 30일 창에는 해당하지 않는다. 다만 그 여진(Figma가 6월 code layers·애니메이션 등 신기능으로 응수)은 창 안에 있다.
- **쿼터 소모 불만(창 밖, 참고용)**: "프롬프트 2개가 주간 한도의 95%를 먹었다"는 Reddit 인용이 반복 등장하지만 이 역시 4월 Claude Design 발표 시점 맥락이라 30일 창 밖.
- **보안 이슈 잔향**: CVE-2025-53967(Figma MCP 서버 command injection, CVSS 7.5)이 여전히 배경 논의로 언급됨 — 날짜상 30일 창 밖이지만 신뢰성 논쟁의 배경으로 계속 인용됨.

**논쟁 구도**: "이게 진짜 designer-to-developer 협업을 개선한다" vs "AI-slop 프로토타입 남발, 실제 디자인 라이프사이클(협업·리뷰·자산관리)은 못 대체한다"는 두 축이 HN·블로그 논조에서 반복.

## ② 플랫폼별 대표 포스트·스레드

### Hacker News
- **"A Better Figma MCP: Letting Claude Design"** — https://news.ycombinator.com/item?id=46883195 — 요지: 기존 Figma MCP 서버의 한계를 지적하며 대안적 MCP 구현을 제시하는 스레드. (접근일 2026-07-07, 게시 시점 불명 — 30일 창 내 여부 미확인)
- **"Figma's woes compound with Claude Design"** — https://news.ycombinator.com/item?id=47832366 — 요지: Claude Design 출시가 Figma 사업에 위협이라는 논조. 댓글 중 "디자인 라이프사이클은 와이어프레임 생성 이상(협업·피칭·리뷰·에셋 관리)"이라는 반박이 인용됨. **이 사건 자체는 4월 발표 기준으로 30일 창 밖.**
- **"Front End Development with Claude Code and Figma MCP and Playwright MCP"** — https://news.ycombinator.com/item?id=47675174 — 실무자가 Figma MCP + Claude Code + Playwright MCP를 엮은 프론트엔드 워크플로우 공유. (날짜 미확인)

*(주의: HN 반응 규모(포인트·댓글 수)는 WebSearch 결과에 노출되지 않아 확인 불가. 정확한 게시 날짜도 검색 스니펫만으로는 확정하지 못했다 — 30일 창 판정은 보수적으로 "미확인"으로 표기.)*

### Reddit
- 직접적인 site:reddit.com 검색은 대부분 0건으로 반환됨(색인 커버리지 한계, 아래 참조).
- 간접 인용으로 확보된 것: r/FigmaDesign 발 "Figma 주가 -4.26%(장중 -7%)" 수치 — 4월 Claude Design 출시 반응, **30일 창 밖**.
- r/FigmaDesign·r/UXDesign 대상 Claude Code MCP 경험 스레드는 이번 검색에서 확보하지 못함(폭주 차단 조항에 따라 이 플랫폼은 부분 보고로 남김).

### X (Twitter)
- **Claude 공식 계정** — https://x.com/claudeai/status/2024148286844649887 — "Claude Code에서 만들던 걸 이제 바로 Figma로 push할 수 있다. 최신 Figma MCP 서버 업데이트로 코드에서 워킹 프로토타입을 만든 뒤 Figma 캔버스로 보내 여러 버전을 탐색하라" (공식 기능 발표 트윗, engagement 수치는 검색 결과에 노출 안 됨).
- **@dai___you (ゆーだい@Findy)** — https://x.com/dai___you/status/2036466866370269638 — "Claude to Figma!!" 짧은 반응 포스트, 개인 사용 후기 성격.

### 블로그 / 뉴스 (일반 웹 — 30일 창 내 확인된 것 위주)
- **TechCrunch, 2026-06-24** — "Figma adds code layers, support for animations, more AI features in new update" — https://techcrunch.com/2026/06/24/figma-adds-code-layers-support-for-animations-more-ai-features-in-new-update/ — Figma가 코드 레이어를 캔버스에 직접 추가하는 정식 기능 발표. **창 내 확인됨.**
- **Youga Chang, Medium (Design Bootcamp), 2026-06** — "How I built a round-trip workflow between Figma and Claude Code" — https://medium.com/design-bootcamp/how-i-built-a-round-trip-workflow-between-figma-and-claude-code-93eb3cb333bd — 실사용자가 Figma↔Claude Code 왕복 워크플로우를 직접 구축한 후기. **창 내(6월) 확인됨.**
- **Figma 공식 블로그** — "From Claude Code to Figma: Turning Production Code into Editable Figma Designs" — https://www.figma.com/blog/introducing-claude-code-to-figma/ — code-to-design(Code to Canvas) 기능의 공식 설명. 스크린샷을 찍어 AI로 Figma 네이티브 레이어(오토레이아웃 포함)로 재구성하는 방식이라고 설명.
- **CNBC, 2026-02-17** — "Figma partners with Anthropic on AI feature integrating Claude Code" — https://www.cnbc.com/2026/02/17/figma-anthropic-ai-code-designs.html — 파트너십 공식 발표 보도. **창 밖(2월)**이지만 이번 30일 소식들의 배경 맥락.
- **925studios, 2026-03-18** — "How to Use Figma MCP with Claude Code: The Complete Playbook (2026)" — https://www.925studios.co/blog/2026-03-18-how-to-use-figma-mcp-with-claude-code-the-complete-playbook-2026 — 1차 정확도 85~90% 수치 출처. **창 밖(3월)**, 여전히 자주 재인용되는 레퍼런스.
- **Eleken** — "Figma to Claude Code: Real Workflow, Use Cases & Limitations" — https://www.eleken.co/blog-posts/figma-to-claude-code — 실제 워크플로우와 한계를 정리한 실무 가이드. 날짜 미확인.
- **xda-developers** — "I connected Claude to Figma and it's the workflow I didn't know I was missing" — https://www.xda-developers.com/connected-claude-to-figma-improved-design-workflow/ — 개인 사용 후기, 긍정적 톤. 날짜 미확인.
- **Muzli Blog** — "Claude Code to Figma: How the New 'Code to Canvas' Integration Works" — https://muz.li/blog/claude-code-to-figma-how-the-new-code-to-canvas-integration-works/ — Code to Canvas 기능 해설.
- **Lenny's Newsletter** — "From Figma to Claude Code and back | Gui Seiz & Alex Kern (Figma)" — https://www.lennysnewsletter.com/p/from-figma-to-claude-code-and-back — Figma 팀 인터뷰 형식, 제품 방향성 논의. 팟캐스트/뉴스레터 인터뷰이므로 업계 관계자 시선(1차 소스가 아닌 스폰서/파트너 관점)임을 감안.
- **UX Planet (Nick Babich), 2026-04** — "Top 3 Claude Code + Figma Workflows" — https://uxplanet.org/top-3-claude-code-figma-workflows-75e5c4dd0f9f — **창 밖(4월)**, 워크플로우 패턴 정리용 참고.
- **Salt Security** — "Deconstructing the Figma MCP Vulnerability" (CVE-2025-53967, CVSS 7.5) — https://salt.security/blog/anatomy-of-a-modern-threat-deconstructing-the-figma-mcp-vulnerability — command injection 취약점 분석. 날짜 미확인이나 CVE 번호상 2025년 이슈로 추정 — **창 밖**, 신뢰성 논쟁의 배경 자료로만 인용.
- **GitHub — rohitg00/awesome-claude-design** — https://github.com/rohitg00/awesome-claude-design — "honest community takes"를 표방하는 큐레이션 레포. Claude Design(Figma MCP와는 별개 제품, 혼동 주의) 관련 커뮤니티 반응을 모아둔 2차 출처. 원문 검증 없이 재인용하므로 신뢰도는 참고 수준.

## ③ 커버리지 한계 (폭주 차단 조항 적용)

- `site:reddit.com` 조합 검색 2회 연속 0건 → Reddit 직접 스레드 확보를 포기하고 간접 인용으로 대체(위 표시). r/FigmaDesign·r/webdev·r/ClaudeAI 원문 스레드는 이번 리포트에 없음.
- HN 스레드 3건은 URL만 확보, 정확한 게시일·포인트·댓글 수는 WebSearch 스니펫에 노출되지 않아 미기재.
- X 검색은 공식 계정 발표 1건 + 개인 반응 1건만 확보. 트렌드성 스레드(다중 인용·리트윗 규모)는 확인하지 못함.
- YouTube는 이번 리서치에서 별도 검색하지 않음(last30days 폴백 경로가 일반 WebSearch 위주였음).

**접근일**: 모든 URL은 2026-07-07 기준 WebSearch 결과.
