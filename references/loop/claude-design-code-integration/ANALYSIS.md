# Claude Design × Claude Code 통합

## 1. Source Identity

| 항목 | 내용 |
|---|---|
| 소스 유형 | 공식 발표문 + Help Center (4 URLs 종합) |
| 1차 출처 | https://www.anthropic.com/news/claude-design-anthropic-labs |
| 2차 출처 | https://support.claude.com/en/articles/14604416-get-started-with-claude-design |
| 3차 출처 | https://support.claude.com/en/articles/14604397-set-up-your-design-system-in-claude-design |
| 4차 출처 | https://claude.com/blog/claude-design-stays-on-brand-for-daily-work |
| 런치일 | 2026-04-17 |
| 업데이트 | 2026-06 (대규모 오버홀) |
| 모델 | Claude Opus 4.7 (vision) |
| 접근 | Claude Pro / Max / Team / Enterprise |

## 2. Core Claim

Claude Design은 텍스트 프롬프트 → UI/슬라이드/프로토타입을 생성하는 Anthropic Labs 제품이다.
핵심 주장: **디자인-코드 단절 없이 한 에이전트 생태계 안에서 순환**한다.
- 디자인 → Claude Code 핸드오프: 스크린샷 대신 "핸드오프 번들"로 이어받음
- 코드 → Claude Design 임포트: `/design-sync`로 실제 컴포넌트 라이브러리를 디자인 스타팅포인트로 사용

대규모 오버홀(2026-06)의 추가 클레임: 평균 턴당 토큰 감소 + 에러율 급감.

## 3. Loop Contract Elements

### Trigger
- Claude Design에서 "Handoff to Claude Code" 버튼 클릭 → 로컬 에이전트 또는 Claude Code Web으로 번들 전송
- Claude Code 터미널에서 `/design` 명령어 → Claude Design 세션 생성/동기화
- Claude Code 터미널에서 `/design-sync` → 로컬 코드베이스의 디자인 시스템을 Claude Design으로 임포트

### State
- 조직 스코프 디자인 시스템: 색상·타이포·컴포넌트 패턴을 한 번 설정하면 이후 모든 프로젝트에 자동 적용
- Claude Design이 output을 디자인 시스템 대비 자가 검증 후 자동 수정 → 사용자에게 표시

### Verifier
- 내장: Claude Design의 디자인 시스템 준수 자가검증 (선공개 → 수정 루프)
- 외부: 이 레포의 `/design-qa` 스킬 (WCAG contrast + 토큰 lint) — 핸드오프 이후 Claude Code 측에서 실행 가능

### Budget
- 토큰 소비: 오버홀 이후 "평균 턴당 감소" — 구체적 수치 미공개
- 구독 등급별 한도는 Chat / Claude Cowork / Claude Code 통합 풀로 공유

### Stop Rule
- 핸드오프 번들 포맷 불명확 (D-03): 파일 구조/스펙 공식 문서화 미확인
- 실제 `/design-sync` 동작은 직접 실험 전까지 미검증 (D-02)

### Human Gate
- Claude Design 접속 실험은 사용자 승인 필요 (별도 billing 풀)
- 핸드오프 번들을 실제 Claude Code에 넘기는 실험도 사용자 승인 후

## 4. Relationship To Harness Engineering

이 레포가 구축 중인 "디자인 하네스"와의 관계:

| design-manual 개념 | Claude Design 대응 |
|---|---|
| `DESIGN.md` (토큰 정의) | 조직 디자인 시스템 (색상·타이포·컴포넌트) |
| `/design-bootstrap` 스킬 | `claude.ai/design` 세션 생성과 동일 목적 |
| `/design-bridge` (`/design-sync`) | **직접 대응** — 코드베이스 → 디자인 시스템 임포트 |
| `/design-qa` 검증 루프 | Claude Design 자가검증 + 이 레포 lint |
| 핸드오프 개념 | "Handoff to Claude Code" 버튼 → 번들 |

핵심 판단: Claude Design의 `/design-sync`는 이 레포가 수동으로 하던 DESIGN.md 작성을
**코드베이스에서 자동 추출**로 대체할 수 있다. 단, DESIGN.md 포맷(YAML frontmatter)과
Claude Design의 내부 표현이 1:1 매핑되는지는 미확인.

## 5. Concrete Patterns Worth Adopting

**P-01 — `design-sync` 진입점 추가**
`/design-screen` 스킬(신설 예정)에 Claude Design 경로 추가:
```
옵션 A: DESIGN.md 기반 (기존) — design-manual 토큰 → Vite+React 생성
옵션 B: Claude Design 기반 (신규) — /design-sync → Claude Design → Handoff → Claude Code
```

**P-02 — 핸드오프 번들 실험 계획**
1. 간단한 React 컴포넌트 라이브러리(Tailwind) 레포에서 `/design-sync` 실행
2. 생성된 디자인 시스템 확인 → DESIGN.md와 diff
3. 프로토타입 1개 생성 → Handoff to Claude Code
4. 핸드오프 번들 구조 기록 → `methodology/` 문서화

**P-03 — 자가검증 루프 활용**
Claude Design의 "디자인 시스템 대비 자가검증"을 `/design-qa` 이전 단계로 포지셔닝.
Claude Design → 핸드오프 → `/design-qa` 순서로 2-tier 검증 파이프라인 구성 가능.

**P-04 — 커넥터 생태계 활용**
Vercel + Lovable + Replit 커넥터: Claude Design에서 직접 배포까지 연결 가능.
현재 이 레포의 `examples/glass-landing`처럼 수동 빌드하던 것을 대체할 수 있는지 확인 필요.

## 6. Risks, Hype, Or Weak Assumptions

**R-01 핸드오프 번들 포맷 미공개**
"패키지로 넘긴다"는 클레임만 있고 번들 스펙(파일 형식, 토큰 직렬화 방식)이 공개되지 않음.
현재로서는 블랙박스 — 커스텀 파이프라인 통합에 장벽.

**R-02 조직 스코프 = 팀 계정 필요**
디자인 시스템 잠금(admin lock) 기능은 Team/Enterprise 전용 가능성 높음.
개인 Pro 계정에서 얼마나 동작하는지 검증 필요.

**R-03 토큰 풀 공유의 역설**
"Chat + Claude Code + Claude Design 통합 풀"은 capacity 증가처럼 포지셔닝하지만,
Claude Code 헤비유저에게는 Claude Design 사용 시 Claude Code 한도가 줄어들 수 있음.

**R-04 DESIGN.md 포맷과의 불일치 가능성**
Claude Design이 추출한 디자인 시스템이 이 레포의 3-tier 토큰 구조
(primitive → semantic → component)와 호환되지 않을 수 있음.
자동 추출이 "색상 팔레트 + 타이포" 수준에 머무를 경우 semantic/component 토큰은 여전히 수동.

**R-05 Anthropic Labs = 실험적**
Claude Design은 Anthropic Labs 제품 — API/포맷 변경 리스크 있음. 안정화 전 하네스 깊은 통합은 기술 부채.

## 7. Follow-up Questions For This Repo

1. `/design-sync`를 실제 `examples/glass-landing` 코드베이스에 돌리면 어떤 디자인 시스템이 추출되나?
2. Handoff Bundle의 파일 구조는? Claude Code가 어떻게 소비하나?
3. Claude Design이 추출한 컬러/타이포가 `DESIGN.md` YAML frontmatter로 변환 가능한가?
4. `/design` CLI 명령이 `design-manual`의 `/design-bootstrap` 스킬과 충돌하거나 대체하나?
5. Pro 계정 단독으로 팀 디자인 시스템 잠금 없이도 충분히 실험 가능한가?

## L2 실험 추가 발견 (2026-06-18)

**DesignSync MCP 툴 실제 동작 확인**:
- `create_project → finalize_plan → write_files` 플로우 정상 작동
- 파일 6개 업로드 성공 (HTML 프리뷰 카드)
- BUT: claude.ai/design UI에 미노출, 직접 URL 접근도 리다이렉트

**아키텍처 수정 이해**:
DesignSync는 claude.ai/design UI 피커가 아니라 **Claude Code 컨텍스트용 컴포넌트 레지스트리**에 연결되는 것으로 보임. 두 시스템은 별도 레이어.

**R-04 재판정**: ❌ → DESIGN.md 토큰이 claude.ai/design UI로 직접 흐르지 않음. 연결 경로 자체가 다름.

## L1 Verdict (업데이트)

**HOLD — 아키텍처 재확인 필요**

공식 문서의 클레임("코드베이스 읽어 디자인 시스템 자동 추출", "Handoff to Claude Code") 과
실제 DesignSync MCP 툴 동작 사이에 **레이어 불일치**가 확인됨.

- DesignSync: Claude Code ↔ 컴포넌트 레지스트리 (API 레이어)
- claude.ai/design UI: 별도 시각 편집 툴, Org default 시스템만 피커 노출

공식 문서가 설명하는 "한 번에 이어지는 통합 워크플로우"는
**Org 계정 + UI 플로우로 생성한 시스템**에서만 성립할 가능성이 높음.
개인 계정 + MCP API 경로로는 UI 노출까지 연결되지 않음.

다음 검증: Org 계정에서 UI로 직접 "import from codebase" 시도 OR
DesignSync 레지스트리가 Claude Code 코드 생성 시 실제로 참조되는지 별도 실험.
