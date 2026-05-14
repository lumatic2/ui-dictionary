# Skill Routing — 디자인 관련 스킬 역할 매핑

> 디자인과 관련된 슬래시 스킬이 여럿 있다. 본 문서는 "어느 상황에 무엇을 부르나"를 정리.

## 4 개 레이어로 분류

```
                      ┌─────────────────────────────────┐
        FOUNDATION    │ DESIGN.md (시각 언어의 단일 출처)  │
                      └────────────────┬────────────────┘
                                       │
                  ┌────────────────────┼────────────────────┐
                  ↓                    ↓                    ↓
              SYSTEM              GENERATION           VALIDATION
        (시스템 만들기)         (시스템에서 만들기)    (시스템 지키기)
                  │                    │                    │
        /design-bootstrap         /design                /design-qa
        /design-consultation      /design-flow           desing-manual
                                  /design-system           lint pipeline
                                  /design-full
                                  frontend-design:
                                    frontend-design

                                       │
                                       ↓
                                     ASSET
                                  /generate-asset
```

각 레이어는 명확한 입력·출력을 가진다.

---

## SYSTEM 레이어 — DESIGN.md 를 만든다

### `/design-bootstrap` (본 레포 출처)

| | |
|---|---|
| **언제** | 새 프로젝트에 처음 디자인 깔 때 |
| **입력** | git repo, (선택) 톤 한 문장 |
| **출력** | DESIGN.md + docs/CLAUDE-design.md + pre-commit hook + (vite-react) Playwright VRT |
| **특징** | desing-manual 스펙(DTCG 호환) 강제 + 4단계 lint 자동 검증 + hash-tracked sync |
| **트레이드오프** | 스펙·검증이 강제 → 자유도 적음 |

### `/design-consultation` (gstack 출처)

| | |
|---|---|
| **언제** | DESIGN.md 가 없고, 톤·방향성부터 폭넓게 탐색하고 싶을 때 |
| **입력** | 프로젝트 컨텍스트 (README, package.json, office-hours 결과 등) |
| **출력** | DESIGN.md (스펙 자유, 10+ aesthetic direction 중 선택) |
| **특징** | 더 개방적 — Brutally Minimal / Maximalist Chaos / Art Deco 등 풍부한 옵션, 프리뷰 페이지 생성, 사용자와 대화하며 정리 |
| **트레이드오프** | 검증 도구 없음 — 만든 DESIGN.md 가 일관되거나 contrast 통과한다는 보장 X |

### 둘 다 안 부르면?

이미 다른 출처(Figma, Notion 등) 에서 DESIGN.md 만들어 코드 레포에 복사해도 OK. desing-manual 의 lint·build 만 따로 호출 가능:

```bash
node ~/projects/desing-manual/scripts/lint/index.js ./DESIGN.md
node ~/projects/desing-manual/scripts/lint/build.js ./DESIGN.md --out ./src/theme.generated.css
```

---

## GENERATION 레이어 — 시스템에서 화면을 뽑는다

DESIGN.md 가 *있다는 전제* 에서 동작. 시스템을 만들지는 않음.

### `/design`
**한 화면 생성**. "트렌디한 디자인을 짧은 설명으로 즉시" — 예: "SaaS 랜딩 hero 만들어줘".

### `/design-flow`
**여러 화면 일관성 있게**. 사용자 플로우(onboarding A → B → C) 처럼 시퀀스가 있을 때.

### `/design-system`
**기존 시스템에 맞는 새 화면 추가**. 기존 DESIGN.md / 코드의 톤을 유지하며 새 페이지·컴포넌트 추가.

### `/design-full`
(설명 미공개) — full 패키지 생성으로 추정. 명확히 알기 전엔 비추.

### `frontend-design:frontend-design` (Anthropic 공식 플러그인)
**프로덕션급 코드 생성**. "AI 생성티 안 나는" 차별화된 코드 산출. 본 레포 cookbook 의 기법들과 잘 어울림.

---

## VALIDATION 레이어 — 시스템에서 벗어나지 않았는지 본다

### `/design-qa` (외부)
**렌더된 UI 에 대해 WCAG/a11y/일관성 검사**. axe-core 류 도구를 자동으로 돌려준다고 추정.

### desing-manual lint pipeline (본 레포)
**DESIGN.md 자체에 대해 4 단계 검증** — parse / schema / alias / contrast (multi-theme).
- `/design-bootstrap` 가 깔아준 pre-commit hook 으로 자동 실행
- 또는 `npm run lint:design` 으로 수동
- `verify-loop.md` 의 5-7 단계 (stylelint / axe / Playwright VRT) 는 별도 npm scripts

**둘의 차이**:
- desing-manual lint = *토큰 정합성* (정의된 디자인 시스템 내부의 모순 잡기)
- `/design-qa` = *렌더 결과 검사* (실제 화면이 a11y 기준 통과하는지)

둘 다 필요. 보완적.

---

## ASSET 레이어

### `/generate-asset`
아이콘, 일러스트, OG 이미지 등 정적 자산 생성. DESIGN.md 의 컬러 토큰을 입력으로 받을 수 있으면 가장 좋음 (현재는 추정).

---

## 의사 결정 트리

```
새 프로젝트 시작
│
├─ "디자인부터 깔자" / "DESIGN.md 만들어줘"
│      │
│      ├─ desing-manual 의 4 family + DTCG + 검증을 원함 → /design-bootstrap
│      └─ 10+ aesthetic direction 중 골라 폭넓게 탐색      → /design-consultation
│
├─ 이미 DESIGN.md 있음, 페이지 만들고 싶음
│      │
│      ├─ 한 화면                                          → /design  (또는 frontend-design)
│      ├─ 여러 화면 일관성                                 → /design-flow
│      └─ 기존 톤 따라 추가                                → /design-system
│
├─ 코드 품질 (차별화된 frontend)
│      └─                                                  → frontend-design:frontend-design
│
├─ a11y / WCAG 검사
│      │
│      ├─ DESIGN.md 자체 검증                              → npm run lint:design
│      └─ 렌더된 UI 검사                                   → /design-qa
│
└─ 아이콘·이미지 자산
       └─                                                  → /generate-asset
```

---

## 조합 패턴 (recipe)

### 패턴 1: "랜딩 페이지 처음부터" (가장 흔함)
1. `/design-bootstrap` — DESIGN.md + hooks + (vite-react) Playwright
2. § 1 Personality / § 8 Anti-patterns 채움 (사람 작업, [design-md-guide.md](design-md-guide.md) 참조)
3. `npm run build:design` — theme.generated.css 생성
4. `frontend-design:frontend-design` 또는 `/design` — hero / feature 섹션 코드 생성
5. 자동: pre-commit hook 이 매번 lint
6. `npm run test:vrt` — baseline 캡처 + 회귀 테스트

### 패턴 2: "이미 DESIGN.md 있고 새 컴포넌트만"
1. DESIGN.md § 7 Components 에 spec 추가 (Anatomy / Tokens / Variants / States, [prompt-patterns § 4](prompt-patterns.md))
2. `/design-system` 또는 `frontend-design:frontend-design` 으로 구현
3. `npm run lint:design` — 토큰 정합 확인
4. `/design-qa` — a11y 확인

### 패턴 3: "외부 시스템(Figma) 에서 가져온 DESIGN.md 검증만"
1. 외부에서 DESIGN.md 받아 레포에 두기
2. `node ~/projects/desing-manual/scripts/lint/index.js ./DESIGN.md` — 통과 안 하면 fix
3. (선택) `/design-bootstrap` 의 부산물 — hook 만 따로 깔고 싶으면 `init-design.sh` 직접 호출
4. 코드 생성은 `frontend-design:frontend-design`

---

## 메모 — 스킬 vs 슬래시 커맨드 구분

`/design`, `/design-system`, `/design-qa`, `/design-export`, `/design-flow`, `/design-full`, `/generate-asset` 일곱 개는 **스킬이 아니라 슬래시 커맨드** (`~/.claude/commands/*.md`). 외부 SaaS 도구의 진입점.

- **스킬** = 자연어 의도로 자동 호출 가능. `skill-toggle` 로 활성/비활성.
- **슬래시 커맨드** = `/이름` 명시 호출만. `skill-toggle` 관할 밖. 정의되어 있으면 system reminder 에 노출되지만 명시 호출 안 하면 작동 안 함.

`skill-toggle` 로 안 꺼진다고 헷갈리지 말 것 — 정상이다.

## 정확히 안 풀린 것 (TODO)

- `/design-full`, `/generate-asset` 의 정확한 동작은 미확인. 호출 후 결과 보고 본 문서 갱신 필요
- `/design-qa` 와 desing-manual lint 의 stage 5-7 (stylelint/axe/VRT) 가 겹칠 수 있음. 실제 둘 다 돌려보고 중복 제거 정책 결정
- `/design`, `/design-system`, `/design-flow` 가 외부 출처(예: Anthropic Claude Design 또는 3rd-party 마켓플레이스) 인 듯한데 정확한 출처·계정 의존성은 미확인

본 문서는 *현재 알려진 동작 기준*이고, 새 정보 들어오면 즉시 갱신한다.
