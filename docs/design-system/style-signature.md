# Askewly Style Signature

Status: **draft** — 기존 자산 역산 초안 (2026-07-17). 사용자 인터뷰 확정 전까지 llms.txt에 노출하지 않는다.

Audience: coding agents (판정 기준) + 사용자 (확정 인터뷰 대상)

역할 구분: `principles.md`는 *보편 품질* 원칙(누구의 디자인이든 지켜야 할 것), 이 문서는 *유성 취향* — "유성이 만든 것처럼 보이는가"를 판정하는 시그니처다. 중복 시 principles가 품질을, 이 문서가 취향을 소유한다.

## 축별 시그니처 (근거 자산 인용)

### 1. 컬러 운용 — 조용한 white 위의 절제된 violet 신호

- 기본은 white/near-white 표면(`surface.base`=gray.1) + 고대비 charcoal 텍스트. 회색조차 hue 270(보라 기운)으로 통일되어 있다 — 무채색이 아니라 "차가운 보라빛 중성". (근거: `tokens/askewly.tokens.json` gray ramp 전체가 hue 270)
- Violet→Orchid→Lavender→Sky→Mint 5-step spectrum은 **신호**(primary action·선택 상태·상태 칩·작은 글로우)로만 — 장식적 도포 금지. "Do not turn the whole page purple." (근거: `DESIGN.md` §2)
- 판정: 액센트 면적이 화면의 소수(체감 ~10% 미만)이고, 모든 색이 토큰 파생인가. purple-dominated·one-note gradient는 FAIL.

### 2. 타이포 — Geist 얼굴, 큰 정적 제목, 조밀하지 않은 본문

- Geist(라틴) + Noto Sans KR(한글) 단일 sans 스택, Geist Mono는 코드·토큰명·단축키·기술 라벨 전용. (근거: `DESIGN.md` §3, tokens.css `--font-sans`)
- Hero 제목은 크고(데스크톱 72–96px) 중앙 정렬, line-height 0.95–1.05. body 16–18px. negative letter-spacing은 hero 광학 보정 외 금지. (근거: `DESIGN.md` §3·§4)
- 판정: 임의 폰트·과도한 자간 조정·본문 14px 미만 밀집이 없는가.

### 3. 레이아웃·밀도 — 단일 초점, 프레임 최소화

- 뷰포트당 강한 초점 영역 1개. 컨테이너 1120–1200px, 주요 수직 리듬은 `space.12`/`space.16`. (근거: `DESIGN.md` §4, principles #2)
- hero 아래는 nested card 그리드가 아니라 full-width band 또는 무프레임 그리드 선호. split hero(좌 텍스트/우 목업) 비선호. (근거: `DESIGN.md` §4·§8)
- 판정: 카드 안의 카드 0, 뷰포트당 경쟁하는 강조 요소 ≤1.

### 4. 형태 — 각이 남는 부드러움, 헤어라인 구조, 무그림자

- radius는 작게: 카드·프레임 4px 이하, 버튼 8px(`radius.lg`). **완전한 pill 금지** — "살짝 부드럽되 각이 남는" 것이 기본값. (근거: `DESIGN.md` §5·§7 Button)
- 구조는 1px 헤어라인 보더로, elevation은 보더·간격·tint 표면으로 — heavy drop shadow 금지. Input은 보더 없이 bottom-border 1px. (근거: `DESIGN.md` §5·§6·§7)
- 판정: box-shadow 사용이 0 또는 극히 미세, pill 0, 보더 두께 1px 기준.

### 5. 모션 — 정지 프레임 우선, 인과 설명용 120–180ms

- still frame이 먼저 성립하고, 모션은 focus·상태·진행을 설명할 때만. 크로스페이드/슬라이드 120–180ms. perpetual 루프·충돌형 모션 금지, reduced-motion 존중. (근거: `DESIGN.md` §6, principles #6)
- 판정: 모든 애니메이션에 완료 상태가 있고 정지 시에도 화면이 성립하는가.

### 6. 카피 — 정의하는 한 문장, 서술하지 않는다

- 카드/쇼케이스 카피는 데모가 뭘 하는지 서술이 아니라 **용어 자체를 정의하는 한 문장**. em dash 금지, 명사구 위주 콤팩트. (근거: `CLAUDE.md` Showcase Atlas 카드 카피 규약 2026-07-08)
- 가짜 지표·의미 없는 SaaS 대시보드 카피 금지. 실제 제품 맥락의 라벨·데이터. (근거: principles #4, `DESIGN.md` §8)
- 판정: 카피가 정의형인가, placeholder 지표("+127% growth")가 없는가.

### 7. 의도적 비대칭 — 정돈 속의 사람이 남긴 긴장

- "살짝 비틀렸지만 의도적인" 브랜드: 레이아웃은 정돈하되 작은 비대칭·겹침·단계적 색 전환으로 사람이 설계한 긴장을 남긴다. 완벽 대칭 그리드의 무표정함은 시그니처가 아니다. (근거: `DESIGN.md` §1 Personality, principles #8 "quiet white surfaces and intentional asymmetry")
- 판정: 완전 대칭·완전 균질 반복만으로 구성된 화면인가(그렇다면 시그니처 미달 신호).

## 판정 체크리스트 (v0 draft)

각 항목 PASS/FAIL. 8/10 이상 + 필수(★) 전부 PASS = 시그니처 통과.

1. ★ 모든 색·치수가 토큰 파생 (발명 리터럴 0)
2. ★ white/near-white 기반 + 액센트는 신호 면적만 (purple-dominated 아님)
3. 회색이 hue 270 계열 (tokens.css ramp 사용 시 자동 충족)
4. Geist 스택 + 기술 라벨 Geist Mono
5. ★ pill 0 · heavy shadow 0 · nested card 0
6. radius가 카드 ≤4px / 버튼 8px 기준
7. 뷰포트당 초점 1개, 계층은 절제로 (경쟁하는 강조 없음)
8. 인터랙션 상태 완비 (hover/focus/active/disabled + 다크 모드 성립)
9. 모션이 있다면 120–180ms·설명용·정지 성립 (없으면 자동 PASS)
10. 카피가 정의형·실제 맥락 (가짜 지표·데모 서술 없음)

## 인터뷰 질문지 (확정용 — 사용자 응답으로 이 문서를 확정한다)

역산의 함정("이미 만든 것 = 취향") 검증을 위해 비선호·예외 발굴을 포함한다.

1. **컬러**: white 기반 + violet 신호가 "내 스타일"의 핵심이 맞나? 다른 프로젝트(askewly.com·브레인 등)에서도 이 팔레트를 기본으로 쓰길 원하나, 아니면 프로젝트별 팔레트 위에 *운용 방식*(신호로만, 소면적)만 시그니처인가?
2. **형태**: "pill 금지·무그림자·작은 radius"는 ui-dictionary 한정 규칙인가, 전 제품 취향인가? 그림자를 쓰고 싶은 예외 상황이 있나(예: 오버레이·드래그)?
3. **밀도**: 대시보드·운영 도구처럼 데이터 밀집 화면에서도 "여백 넉넉한 단일 초점"을 유지하나, 아니면 밀도 높은 표면은 별도 모드인가?
4. **비대칭**: §7 "의도적 비대칭"을 에이전트가 능동적으로 시도하길 원하나(리스크: 어설픈 비틀림), 아니면 사람이 넣는 마감 터치로 남기나?
5. **비선호 발굴**: 지금까지 에이전트가 만든 UI에서 "이건 내 스타일이 아니다"라고 느낀 구체 사례 2~3개가 있다면? (그 사례가 체크리스트 항목이 된다)
6. **통과 기준**: 체크리스트 "8/10 + 필수 3개"가 적정한가, 더 엄격/느슨해야 하나?

## Changelog

- 2026-07-17: 역산 초안 작성 (AD2 Step 1) — DESIGN.md·principles.md·tokens SSOT·CLAUDE.md 카피 규약 근거.
