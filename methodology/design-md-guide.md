# DESIGN.md 작성 가이드

> 스펙(`docs/spec.md`)은 "무엇이 합법인가"를 정의한다. 본 문서는 "**어떻게 잘 쓰는가**"를 다룬다.

## 0. 첫 30 분 — 어디부터 손대는가

순서대로 채우면 막히지 않는다.

1. **§ 1 Personality 3 줄** — 아무 토큰도 정의하기 전에. "이 시스템이 어떤 감정인지"를 문장으로 못 쓰면 토큰을 정해도 흔들린다.
2. **§ 8 Anti-patterns 3-5 줄** — Personality 의 거울. "절대 하지 말 것"을 먼저 박으면 토큰이 자기검열한다.
3. **Primitive color** 3-5 단계 (gray 만으로 시작 가능) + brand 1 개
4. **Semantic color** 5 개 (surface.base / surface.muted / text.default / text.muted / action.primary) — 더 늘리지 말 것
5. **Spacing** 4·8 그리드 (1, 2, 4, 6, 8, 12 정도)
6. **Typography** scale 4-5 단 + weight 2 개
7. **§ 7 Components** 에서 Button 하나만 — 나머지는 필요할 때 추가
8. **빌드 / lint 통과** 확인
9. 그 다음에야 §§ 4-6 채우고, § 9 Changelog 첫 줄 박기

처음부터 모든 칸을 채우려 들면 **공허한 일관성**이 생긴다. 5 개 토큰으로 시작해 30 개로 커지는 게 정상.

## 1. 3-tier 토큰을 진짜로 지키기

이론은 쉽고 실전은 흔들린다. 다음 두 질문을 자문하라.

- **"이 색을 컴포넌트에서 직접 쓰면 어떻게 부르겠나?"** — 답이 `gray.500` 이라면 semantic 이 빠진 것이다. `text.muted` 같은 이름이 나와야 한다.
- **"이 의미가 다른 색을 가리키게 될 가능성이 있나?"** — 있다면 semantic 만들 가치 있음. 없다면 primitive 직접 alias 도 OK (예: brand color 가 영원히 한 값일 때).

### 안 좋은 예 (semantic 이 primitive 의 alias 일 뿐)

```yaml
text:
  default: { value: "{color.primitive.gray.900}", type: color }
  muted:   { value: "{color.primitive.gray.900}", type: color }  # 같은 값
```

→ semantic 의 존재 의의 없음. 두 토큰을 하나로 합치거나, muted 를 진짜 다른 색으로.

### 좋은 예

```yaml
text:
  default:     { value: "{color.primitive.gray.900}", type: color }
  muted:       { value: "{color.primitive.gray.500}", type: color }
  on-primary:  { value: "{color.primitive.gray.50}",  type: color }
  destructive: { value: "{color.primitive.red.700}",  type: color }
```

## 2. Personality 를 "느낌"이 아니라 "결정 로그"로

"미니멀하고 모던한 톤" 같은 문장은 의미 없다. AI 가 같은 단어를 다르게 해석한다. 결정 로그로 써야 검증 가능하다.

### 안 좋은 예
> 깔끔하고 세련된 느낌. 사용자 경험 중심.

### 좋은 예
> 무채색 단일 컬러 + 1 accent. **그림자 금지** (위계는 보더와 여백으로). 헤딩 폰트 weight 500 이하만. 본문 폭 60-75ch. container max 960px — 더 넓히지 않는다.

후자는 5 개의 검증 가능한 룰이다. AI 가 이걸 어기면 lint·리뷰에서 잡힌다.

## 3. Anti-patterns 는 본 시스템의 면역계

§ 8 은 다른 디자인에선 합법인 것 중 **본 시스템에서 절대 금지**하는 것만 적는다. "color 4개 이상 금지" 같은 일반론 X. "primary 색을 텍스트에 사용 금지" 같이 본 시스템 특수성이 드러나야.

체크리스트:
- 흔히 발생하는 AI slop 중 본 시스템에 안 맞는 것 (예: gradient, glass over glass, drop-cap on sans-only)
- 과거 본인이 저질렀던 실수 (changelog 와 짝지을 것)
- 비슷한 시스템과의 의도된 차이 (예: "Material 의 elevation 사용 금지")

## 4. Components 섹션 — 토큰 사용 의무

§ 7 의 각 컴포넌트는 **반드시** 자기가 쓰는 토큰을 명시한다. "height 40px" 가 아니라 "height `space.8`+`space.2`" 처럼. 안 그러면 AI 가 코드 짤 때 매직 넘버 부활한다.

각 컴포넌트마다 4 항목 고정:
1. **Anatomy** (구조)
2. **Tokens used** (어떤 semantic 토큰)
3. **Variants** (primary / secondary / …)
4. **States** (hover / active / disabled / focus-visible)

a11y 요구사항(키보드, ARIA, focus indicator)도 한 줄 박을 것.

## 5. Changelog — 세션 간 일관성의 핵심

가장 안 쓰는 섹션이고 가장 중요하다. AI 와 멀티세션 작업하면 "내가 어제 뭘 바꿨더라" 가 매번 발생.

### 좋은 changelog 한 줄

```
## 2026-05-14
- text.muted 를 gray.700 → gray.500 으로 약화. body 위계 너무 강했음.
- shadow.sm 토큰 제거. 그림자 사용 안 하기로 결정 (anti-patterns 에 박음).
```

WHY 가 들어가야 한다. "변경했다" 가 아니라 "왜 변경했다". `git log` 와 중복? 아니다 — Changelog 는 토큰의 **의미론적 변경**만 추적, commit 은 모든 변경.

## 6. 호환성 — 미래의 본인을 위한 작은 노력

- **DTCG-shape 약식 (`value`/`type` no `$`)** 권장 — 빌드 시 자동 prefix.
- **OKLCH 권장** for color — contrast 계산 정확, color-mix 와 잘 어울림. hex 도 허용.
- **dimension 은 단위 포함 문자열** — Style Dictionary 에서 px/rem 변환 가능.
- **테마 분리는 path 가 아니라 `themes:` 블록** — `color.dark.text.default` 같은 path 금지.

## 7. 빌드·검증 흐름

```bash
# 1) lint (4단계, 5초 안에)
node ~/projects/desing-manual/scripts/lint/index.js DESIGN.md

# 2) 빌드 산출물 — .design/tokens.json (Style Dictionary 입력)
# (build 스크립트는 후속 작업, 현재 lint 만)
```

`.design/lint.json` 은 JSON 이므로 에이전트가 직접 읽고 수정 루프 돌릴 수 있다. 사람용 요약은 stdout 으로 출력.

## 8. 워크플로우 — 4 가지 시나리오

### 시나리오 A: 0 → 1 (새 프로젝트)

```bash
bash ~/projects/desing-manual/scripts/init-design.sh ~/projects/new-app --style minimal
# → DESIGN.md 가 생기고, .design-harness.json 추적 시작
# → § 1 Personality, § 8 Anti-patterns 부터 손으로 채움
# → lint 통과 확인
```

### 시나리오 B: 기존 프로젝트에 디자인 레이어 주입

기존 코드에 흩어진 매직 넘버·hex 부터 모은다 → primitive 추출 → semantic 매핑 → DESIGN.md 작성 → 코드를 토큰 참조로 치환. 이때 `repo-to-design-system` 레시피(future) 사용.

### 시나리오 C: 디자인 변경 후 propagate

`desing-manual` 본체의 템플릿이 갱신되면:

```bash
cd ~/projects/new-app
bash ~/projects/desing-manual/scripts/propagate.sh
# → 사용자가 안 건드린 파일만 갱신, 수정한 파일은 skip + 경고
```

### 시나리오 D: AI 에게 새 컴포넌트 시키기

1. 먼저 DESIGN.md § 7 에 spec 추가 (Anatomy / Tokens / Variants / States)
2. AI 에게 "DESIGN.md § 7.Dropdown 스펙대로 구현" 으로 지시
3. PR 에서 토큰 직접 사용·매직 넘버 검사 (lint stage 5/6 후속 작업으로)

## 9. 자주 하는 실수

| 증상 | 원인 | 처방 |
|---|---|---|
| 토큰이 50 개 넘어가는데 일관성 없음 | semantic 단계 건너뛰고 primitive 만 만들었음 | semantic 5-10 개 정의 후 컴포넌트는 거기만 참조 |
| AI 가 매번 다른 hex 쓴다 | DESIGN.md 가 코드에 import 안 됨 | `init-design.sh` 로 `docs/CLAUDE-design.md` 도 같이 깔기 |
| 라이트/다크 토글 시 색이 깨짐 | path 에 light/dark 인코딩 | `themes:` 블록으로 옮기고 token-set 머지 |
| contrast lint 실패 | text/surface 가 같은 명도대 | OKLCH 의 L 값을 50% 이상 벌리기 |
| changelog 가 commit log 의 복붙 | WHY 누락 | "왜 바꿨나" 한 줄 추가, 합법화는 별도 |

## 10. 더 읽을 거리

- 스펙: [docs/spec.md](../docs/spec.md)
- 프롬프트 패턴: [prompt-patterns.md](prompt-patterns.md)
- 검증 루프 상세: `verify-loop.md` (TODO)
- 4 종 aesthetic family 예시: `design-md/{minimal,editorial,brutalist,glass}/DESIGN.md`
- 외부: [google-labs-code/design.md](https://github.com/google-labs-code/design.md), [DTCG draft](https://www.designtokens.org/tr/drafts/format/)
