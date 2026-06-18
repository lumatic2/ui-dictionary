# L2 실험 계획 — `/design-sync` × `glass-landing`

> 승인일: 2026-06-18  
> 목표: Claude Design × Claude Code 통합의 실제 동작을 관찰하고 DESIGN.md 포맷과의 호환성을 검증한다.

## 실험 대상

```
examples/glass-landing/
├── DESIGN.md          ← 3-tier 토큰 (검증 기준)
├── src/
│   ├── components/    ← GlassNav, Hero, FeatureBento, MagneticButton
│   ├── base.css       ← CSS 변수 참조
│   └── App.tsx
└── package.json       ← Vite + React + Tailwind
```

## 검증하려는 미지수

| ID | 질문 |
|---|---|
| D-02 | `/design-sync` CLI가 실제로 어떻게 동작하나? 어디서 실행하나? |
| D-03 | Handoff Bundle의 파일 구조/포맷은? |
| R-04 | Claude Design이 추출한 시스템이 DESIGN.md 3-tier와 호환되나? |

---

## 실험 스텝

### Step 1 — `/design-sync` 실행
**위치**: `examples/glass-landing/` 디렉토리에서 Claude Code 터미널

```
/design-sync
```

**관찰 기록 항목**:
- [ ] 명령어 실행 전 요구 조건 (인증, 로그인 상태 등)
- [ ] 프롬프트/옵션 (GitHub URL, 로컬 경로, 업로드 중 무엇을 묻는가)
- [ ] 소요 시간
- [ ] Claude Design UI에 어떤 화면이 뜨는가 (스크린샷)
- [ ] 에러/블로커 발생 시 메시지 전문

**기대**: 코드베이스를 읽고 색상·타이포·컴포넌트 패턴 추출 → Claude Design 조직 디자인 시스템으로 설정

---

### Step 2 — 추출된 디자인 시스템 기록
Claude Design에서 추출 완료 후:

**관찰 기록 항목**:
- [ ] 색상 팔레트: 몇 개 추출? oklch 값 보존되나?
- [ ] 타이포: Inter Variable, scale(sm/base/lg/xl/2xl), weight 추출되나?
- [ ] 컴포넌트: GlassNav, Hero, FeatureBento 패턴 인식되나?
- [ ] `glass` 이펙트 (backdrop-filter, color-mix) 추출되나?
- [ ] dark 테마 override 인식되나?

**DESIGN.md 대비 diff 기록**:

| 항목 | DESIGN.md 원본 | Claude Design 추출 결과 | 일치 여부 |
|---|---|---|---|
| 색상 primitive (slate/iris) | oklch 기반 | ? | ? |
| semantic surface/text/action | 참조 문법 `{...}` | ? | ? |
| space/radius/blur 토큰 | 명시적 px 값 | ? | ? |
| typography scale | 14~44px | ? | ? |
| dark theme override | 별도 섹션 | ? | ? |

---

### Step 3 — Claude Design에서 프로토타입 생성
추출된 디자인 시스템 기반으로 Hero 섹션 1개 생성:

> 프롬프트: "glass-landing의 Hero 섹션을 재현해줘. mesh gradient 배경, frosted glass 카드, iris 액센트 버튼."

**관찰 기록 항목**:
- [ ] 스크린샷 저장 (`references/loop/claude-design-code-integration/screenshots/`)
- [ ] 토큰 적용 품질 — 내 DESIGN.md와 시각적으로 얼마나 일치하나?
- [ ] 자가검증 작동 여부 (수정 루프 발생 시 횟수/내용)

---

### Step 4 — Handoff Bundle 분석
Claude Design에서 "Handoff to Claude Code → Send to local coding agent" 클릭:

**관찰 기록 항목**:
- [ ] 번들 포맷: 파일 목록 및 확장자
- [ ] Claude Code 터미널에서 수신 방식 (자동 프롬프트? 파일 drop?)
- [ ] 번들에 포함된 항목:
  - [ ] 디자인 토큰 (CSS 변수? JSON?)
  - [ ] 컴포넌트 명세 (HTML? JSX? 스펙 문서?)
  - [ ] 에셋 (이미지, 아이콘)
  - [ ] 프롬프트 컨텍스트 (Claude Code에 전달되는 instructions)
- [ ] 번들 전체 내용 파일로 저장: `references/loop/claude-design-code-integration/handoff-bundle-dump.md`

---

### Step 5 — Claude Code 핸드오프 후 코드 생성 관찰
Claude Code가 번들을 받아 코드를 생성하면:

**관찰 기록 항목**:
- [ ] 생성된 컴포넌트 구조 (파일명, 프레임워크 감지 정확도)
- [ ] Tailwind 클래스 vs CSS 변수 선택 (어느 쪽으로 생성하나?)
- [ ] DESIGN.md 토큰 참조 여부 (`var(--color-surface-glass)` 형태로 나오나?)
- [ ] 실제 렌더링 테스트: `npm run dev` → 스크린샷 비교

---

### Step 6 — DESIGN.md 호환성 판정 & 차이 문서화

**판정 기준**:

| 등급 | 조건 |
|---|---|
| ✅ 완전 호환 | 3-tier 구조 보존, oklch 값 일치, dark override 인식 |
| ⚠️ 부분 호환 | 색상/타이포 추출됨, semantic 참조 깨짐 or 단순화됨 |
| ❌ 불호환 | hex/rgb로 변환, 3-tier 구조 무시, 수동 재작업 필요 |

결과를 `ANALYSIS.md` §3 State 및 §5 Concrete Patterns에 반영.

---

## 산출물

| 파일 | 내용 |
|---|---|
| `references/loop/claude-design-code-integration/ANALYSIS.md` | §3·§5·§6 업데이트 (실험 결과 반영) |
| `references/loop/claude-design-code-integration/screenshots/` | 각 스텝 스크린샷 |
| `references/loop/claude-design-code-integration/handoff-bundle-dump.md` | 번들 구조 전문 |
| `references/loop/STATE.md` | D-02, D-03 resolved/unresolved 업데이트 |
| `methodology/design-md-guide.md` | Claude Design 호환성 섹션 추가 (사용자 게이트 후) |

---

## 블로커 처리 규칙

| 상황 | 조치 |
|---|---|
| `/design-sync` 명령 없음 / 인식 안 됨 | Claude Code 버전 확인 후 기록, 실험 중단 |
| Claude Design 로그인 필요 | 사용자에게 `! claude design` 또는 브라우저 직접 접속 요청 |
| 번들 수신 후 코드 생성 실패 | 에러 전문 기록, 수동 번들 내용 분석으로 전환 |
| 토큰 완전 불호환 | 브리지 변환 스크립트 필요성 기록 → `/design-bridge` 스킬 개선 이슈로 등록 |

---

## 이 실험 이후 할 일 (승인 필요)

1. 실험 결과 바탕으로 `methodology/design-md-guide.md`에 "Claude Design 연동" 섹션 추가
2. `/design-screen` 스킬에 Claude Design 경로(옵션 B) 추가
3. 호환성 판정이 ⚠️/❌이면 → `DESIGN.md ↔ Claude Design` 브리지 변환 스크립트 검토
