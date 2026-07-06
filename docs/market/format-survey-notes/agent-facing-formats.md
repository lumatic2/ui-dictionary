# 조사 노트 — 에이전트용 디자인 포맷 선례 (Stitch DESIGN.md · llms.txt · MCP)

> SMC0 시장 포맷 조사. 수집: 2026-07-07, sonnet 리서치 에이전트. 게이트 검증 완료.

## 1. Google Stitch — DESIGN.md open format

- 구조: YAML frontmatter(토큰) + Markdown body. Frontmatter: `name`, `description`, `version`(alpha), `colors`(hex/rgb/oklch), `typography`, `rounded`, `spacing`, `components`(중첩 sub-token).
- Body 표준 섹션 순서: Overview → Colors → Typography → Layout → Elevation & Depth → Shapes → Components → **Do's and Don'ts** (생략 가능하나 순서 정규화 — 안티패턴의 스펙 강제 자리).
- 에이전트 소비: CLI lint(깨진 참조·WCAG contrast·orphan 토큰), JSON 파싱, Tailwind config/DTCG export, 라이브러리 API.
- 성숙도: Apache-2.0, **alpha** — "expect changes". Lovable의 DESIGN.md 채택 사례 언급(직접 확인 실패 — **미확인**).

## 2. llms.txt 규약

- Jeremy Howard 제안(2024-09). 사이트 루트 관행. H1(필수) → blockquote 요약 → H2 링크 섹션.
- **Atlassian Design System 사례 (확인됨)**: `atlassian.design/llms.txt` — Core Packages + Dev Tools(ESLint/Codemod/**ADS MCP Server**) + Design Tools 섹션. **주제별 서브파일 분할**: `llms-full.txt`, `llms-components.txt`, `llms-tokens.txt`, `llms-a11y.txt` 등.
- formal standard 아님, convention.

## 3. MCP 서버 사례

- **Figma Dev Mode MCP**: variables·components·metadata를 IDE 에이전트에 구조화 전달. Code Connect 연동 강할수록 유용. 저성숙 시스템도 토큰 도입 가속용으로 사용 가능.
- **shadcn MCP**: registry.json 기반 기계 질의 — "prose 문서 해석"이 아니라 "구조화 데이터 직접 질의"가 핵심 차별점.
- **Atlassian ADS MCP**: 대형 시스템이 llms.txt(발견)와 MCP(질의)를 **병행** 제공.

## 4. AI 코딩 도구의 디자인 주입 패턴

- 공통: "토큰을 프롬프트 텍스트가 아니라 구조화 파일(tokens.json/DESIGN.md)로 두고 참조시켜라".
- Cursor: `.cursor/index.mdc` Always rule + Figma MCP.
- 반복되는 원칙: "구조 없이 AI는 일반적 패턴으로 회귀한다. 구조화된 환경에서만 intent 해석·컴포넌트 참조·자기 검증이 된다."

## 5. 공통 설계 원칙 (선례 횡단)

1. **토큰=구조화 데이터, rationale=산문** 분리.
2. **발견(discovery) 계층과 질의(query) 계층 분리** — llms.txt/DESIGN.md는 정적 인덱스, MCP는 동적 질의. 큰 시스템은 둘 다.
3. **안티패턴을 스펙 강제 섹션으로 박제** (Do's and Don'ts).
4. **네이밍/스키마 일관성 = 에이전트 신뢰도** (kebab-case, 안정적 id).
5. **저성숙 상태에서도 유용하게** — 점진 채택 전제.
6. **주제별 파일 분할 + 인덱스** > 단일 거대 파일.

## 6. Askewly Design 채택 관점

가져올 것: ① DESIGN.md frontmatter+body 이분 구조 유지 + Do's and Don'ts 필수 섹션화 ② `ui.askewly.com/llms.txt` 인덱스(값은 담지 않음, 링크만 — 규모 커지면 서브파일 분할) ③ 메타데이터를 기계 질의 가능 형태(안정적 id·kebab-case·dependency 필드)로 유지해 후일 MCP화 비용 절감.

피할 함정: ① alpha 스펙(DESIGN.md)에 1:1 강결합 — 매핑 계층 하나 두기 ② llms.txt를 SSOT처럼 오용(값 중복 기술 금지) ③ 안티패턴 섹션을 사후로 미루기.

## 7. 출처

- https://github.com/google-labs-code/design.md
- https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-design-md/
- https://llmstxt.org/
- https://atlassian.design/llms.txt
- https://developers.figma.com/docs/figma-mcp-server/
- https://www.figma.com/blog/design-systems-ai-mcp/
- https://ui.shadcn.com/docs/registry/mcp
