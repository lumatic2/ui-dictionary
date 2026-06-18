# 실험 로그 — `/design-sync` × glass-landing

실험일: 2026-06-18  
프로젝트 ID: `a5a628f3-b2ed-4ad4-bede-93a6f8c4714e`  
프로젝트명: glass-landing Design System

---

## Step 1 — `/design-sync` 실제 동작 확인 ✅ D-02 해결

**발견**: `/design-sync`는 CLI 슬래시 명령이 아니라 **`DesignSync` MCP 툴**로 구현되어 있다.
Claude Code 세션 안에서 직접 호출 가능. 별도 터미널 명령 불필요.

**실제 플로우**:
```
DesignSync(list_projects)       ← 기존 프로젝트 목록
DesignSync(create_project)      ← 새 design-system 프로젝트 생성
  → projectId: a5a628f3-b2ed-4ad4-bede-93a6f8c4714e
DesignSync(finalize_plan)       ← 업로드 경로 잠금 + permission 프롬프트
  → planId: plan_a5a628f3b2ed4ad4_92c5f26e9101
DesignSync(write_files)         ← 디스크에서 직접 읽어 업로드 (컨텍스트 통과 안 함)
  → written: 6
DesignSync(list_files)          ← 확인
  → 6개 확인됨
```

**전제조건**: claude.ai 로그인 세션. 첫 호출 시 `user:design:read` + `user:design:write` 스코프 자동 승격.

---

## Step 2 — 추출된 디자인 시스템 vs DESIGN.md diff ⚠️ R-04 부분 해결

**방법론 차이 발견**: Claude Design의 "디자인 시스템 임포트"는 두 방향이 있음.

| 방향 | 메커니즘 | 이 실험 |
|---|---|---|
| **Push** (로컬 → Claude Design) | DesignSync MCP 툴로 HTML 프리뷰 업로드 | ✅ 완료 |
| **Pull** (Claude Design이 코드베이스 읽기) | Claude Design 웹 UI에서 "import from codebase" | ❌ 미테스트 (웹 UI 필요) |

**Push 방향 호환성 판정**: ⚠️ **부분 호환**

| 항목 | DESIGN.md 원본 | Claude Design 업로드 결과 |
|---|---|---|
| 색상 primitive (oklch) | `oklch(98% 0.01 250)` 형식 | ✅ CSS 변수로 그대로 보존 |
| semantic 참조 구문 `{...}` | DTCG 참조 문법 | ❌ CSS var() 로 펼쳐서 인라인 처리 |
| 3-tier 구조 | primitive → semantic → component | ⚠️ HTML 안에서 구조 설명으로 표현됨 (기계적 추적 불가) |
| dark theme override | 별도 섹션 in DESIGN.md | ❌ 미업로드 (별도 dark 프리뷰 파일 필요) |
| 타이포 scale | 14~44px, 3 weights | ✅ typography.html에 시각화 |
| spacing/radius/blur | 명시적 px 값 | ❌ 별도 토큰 프리뷰 미생성 |

**핵심 인사이트**: DesignSync는 HTML 프리뷰 카드를 올리는 것이지, DESIGN.md의 토큰 구조를 직접 소비하지 않는다. Claude Design은 이 카드들을 "시각 레퍼런스"로 참조할 뿐, DESIGN.md의 3-tier 계층을 이해하지 않는다.

---

## Step 3 — Claude Design UI에서 프로젝트 접근 시도 ❌ 핵심 발견

**관찰**:
- `list_projects` API → glass-landing 확인됨
- claude.ai/design "Search design systems" UI → glass-landing 미노출
- 직접 URL `https://claude.ai/design/project/{id}`, `https://claude.ai/design/system/{id}` → 모두 `https://claude.ai/design` 으로 리다이렉트

**결론: DesignSync MCP 툴 ≠ claude.ai/design UI 직접 연결**

추정 아키텍처:
```
DesignSync MCP 툴
  └─ Design System 컴포넌트 레지스트리 (백엔드 API 레이어)
       └─ Claude Code가 코드 생성 시 참조

claude.ai/design UI
  └─ 별도 디자인 편집 툴
       └─ Org default 시스템만 피커 노출
            └─ UI 플로우로 직접 생성한 것만 활성화
```

DesignSync는 Claude Code 컨텍스트에서 컴포넌트를 참조할 때 쓰는 레지스트리이며,
claude.ai/design UI 디자이너가 보는 시스템 피커와 별도 레이어임.
UI에 노출되려면 "Org default" 지정 또는 별도 publish 플로우가 필요한 것으로 추정.

---

## Step 4 — Handoff Bundle 포맷 분석 ⚠️ D-03 부분 해결

**현재 알 수 있는 것** (공식 문서 + 이번 실험 추론):

```
Handoff Bundle 추정 구조:
├── design-tokens/           ← Claude Design이 인식한 토큰 (CSS vars 또는 JSON)
├── component-specs/         ← 각 컴포넌트 HTML 프리뷰 + 메타데이터
├── layout.json              ← 화면 레이아웃 정보
└── handoff-prompt.md        ← Claude Code에게 전달되는 컨텍스트/지시
```

**미확인**: 실제 번들을 받아본 적 없음. 웹 UI에서 "Handoff to Claude Code" 클릭 필요.

---

## Step 5 — `/design` 커맨드 실체 확인

**관찰**: `/design` 슬래시 커맨드 실행 시 로드된 스킬 내용:
- `mcp__stitch__list_projects`, `mcp__stitch__suggest_trending_design` 등 **Google Stitch MCP 툴** 사용
- 이 세션에 Stitch MCP 미연결 → 작동 불가
- Anthropic 내장 `/design` 명령이 아닌 **커스텀 스킬** (`~/projects/custom-skills/`)

**결론**: 공식 문서가 언급하는 Claude Code 내장 `/design` 커맨드와 이 스킬은 별개.
Anthropic의 공식 CLI ↔ claude.ai/design 연결 MCP는 이 세션에 없음.

---

## Step 6 — 최종 판정

**전체 그림**:

```
현재 Claude Code CLI에서 가능한 것:
  DesignSync MCP → component library push → claude.ai/design 레지스트리
  (단, UI 피커에 미노출 — Org default 설정 없이)

현재 Claude Code CLI에서 불가능한 것:
  "화면 생성" 명령 → claude.ai/design에서 결과 확인
  (해당 MCP 없음 / 웹 UI에서만 작동)

공식 문서 클레임 vs 현실:
  "Claude Code에서 /design으로 디자인 생성" → 문서 언급 있지만 MCP 미노출
  "Handoff to Claude Code" → 웹 UI 버튼 클릭 필요, CLI 자동 수신 없음
```

**판정: ❌ CLI 단독 제어 불가 (2026-06-18 기준)**

Claude Code CLI가 디자인의 "컨트롤 센터"가 되려면:
1. Anthropic이 claude.ai/design 생성 API를 MCP로 노출해야 함
2. 또는 Google Stitch MCP 연결 (커스텀 스킬 경로)
3. 현재는 웹 UI가 주 인터페이스, CLI는 component library push만 가능

---

## 업로드된 파일 목록

| 파일 | 그룹 | 설명 |
|---|---|---|
| `tokens/colors.html` | Tokens | Primitive + Semantic 색상 스와치 |
| `tokens/typography.html` | Tokens | Inter Variable 타입 스케일 + 웨이트 |
| `components/glass-nav.html` | Components | Floating glass navigation bar |
| `components/magnetic-button.html` | Components | Primary + Ghost 버튼 |
| `components/feature-card.html` | Components | Bento grid glass card |
| `components/hero.html` | Components | Hero 섹션 전체 |

Claude Design URL: `https://claude.ai/design` → "glass-landing Design System" 프로젝트
