# 조사 노트 — shadcn/ui Registry

> SMC0 시장 포맷 조사. 수집: 2026-07-07, sonnet 리서치 에이전트. 게이트 검증 완료.

## 1. 스키마

**registry.json**: `name`, `homepage`, `items`(배열) 또는 `include`(다른 registry.json 조합 — 2026-05 추가, `shadcn registry validate` 커맨드 동반). item name은 전체 registry 범위에서 유일.

**registry-item.json** 주요 필드: `name`, `title`, `description`, `type`, `dependencies`/`devDependencies`(npm), `registryDependencies`(다른 item — 이름/namespace/URL/로컬경로), `files`(path/type/target — target은 components.json alias로 resolve), `cssVars`(테마 섹션별 CSS 변수), `css`(@layer/@keyframes/@utility), `envVars`, `font`, `docs`, `categories`, `meta`. `tailwind` 필드는 deprecated(CSS 변수 기반 v4 이전).

## 2. Item type

`registry:base`(디자인 시스템 전체), `registry:style`, `registry:theme`(코드 없이 cssVars만), `registry:ui`, `registry:component`, `registry:block`(복합/페이지 섹션), `registry:lib`, `registry:hook`, `registry:page`, `registry:font`, `registry:file`, `registry:item`.

## 3. CLI 소비 흐름

`npx shadcn add <name>`: components.json의 namespace→URL 템플릿 → item fetch → dependencies + registryDependencies(재귀) 설치 → files를 alias 규칙으로 복사 → cssVars/css를 글로벌 CSS에 merge. 사설 registry는 Bearer/헤더/쿼리 인증 + `.env.local` `${VAR}` 참조.

## 4. 코드+토큰 원자적 패키징

한 item 안에 `files`(컴포넌트 소스)와 `cssVars`(그 컴포넌트가 참조하는 semantic 토큰)가 공존 — "설치 = 코드 복사 + 토큰 병합"이 원자적으로 성립. `registry:theme`은 토큰만, `registry:block`은 코드+토큰.

## 5. "코드를 복사해 소유" 철학

- npm 의존성이 아니라 사용자 코드베이스에 물리 복사 → 사용자 소유.
- framework-agnostic 명시 — 임의 파일 배포 범용 메커니즘.
- 버전 관리/업그레이드는 자동화되지 않음 — registry는 "최초 설치 지점".

## 6. 에이전트 소비 표면

- **공식 MCP 서버** `npx shadcn@latest mcp` — Claude Code/Cursor/VS Code/Codex 설정 지원. 브라우징·검색·자연어 설치.
- **llms.txt** (`ui.shadcn.com/llms.txt`) 존재.
- shadcn/skills (2026-04 changelog) — 세부 **미확인**.

## 7. Askewly Design 채택 관점

가져올 것: ① item 단위 코드+토큰 원자 패키징(레시피가 자기가 쓰는 semantic 토큰을 선언, 값은 SSOT에서 resolve) ② 코드 복사·소유 철학(탈-AI-티 목표와 부합, block 단위 배포 설계) ③ MCP/llms.txt 에이전트 표면(안정적 id·kebab-case·dependency 필드로 메타데이터를 기계 질의 가능하게 유지하면 후일 MCP화 비용 낮음).

안 맞는 것: ① npm dependency 모델(크로스 표면 목표와 불일치) ② CLI 중심 UX(우리 1차 표면은 웹사이트 — 코드 복사 버튼 + implementation pack이 더 적합) ③ tailwind deprecated 레거시(처음부터 cssVars 방식만 채택).

## 8. 출처

- https://ui.shadcn.com/docs/registry
- https://ui.shadcn.com/docs/registry/registry-item-json
- https://ui.shadcn.com/docs/mcp
- https://ui.shadcn.com/llms.txt
- https://ui.shadcn.com/docs/changelog/2026-05-registry-include
