# DESIGN.md Spec — v0.1 (desing-manual canonical)

> 본 레포가 채택·검증·전파하는 DESIGN.md 의 정식 형태. DTCG v2025.10 호환을 목표.

## 파일 위치·이름

- 레포 루트에 정확히 `DESIGN.md`. 다른 이름·하위 경로 금지 (에이전트 자동 발견 위해).
- 하위 디자인 시스템(예: marketing site 와 dashboard 가 토큰 다를 때) 은 `apps/<name>/DESIGN.md` 허용. 루트 DESIGN.md 가 inherits 선언.

## 구조 — 2 층

1. **YAML frontmatter** (`---` … `---`) — machine-readable tokens (DTCG 호환)
2. **Markdown body** — human-readable rationale·rules·examples

## Frontmatter — DTCG 호환 형식

DTCG 정식형은 `$value`/`$type` prefix 를 쓰지만, YAML 가독성 위해 **약식**(`value`/`type`) 허용. 빌드 단계에서 `$` 가 자동 부여되어 `.tokens.json` 으로 emit.

```yaml
---
# 메타
name: "Acme"
version: "0.3.0"
inherits: null              # 부모 DESIGN.md 상대경로 (optional)

# 토큰 (DTCG-shape, 약식)
tokens:
  color:
    primitive:
      gray:
        "50":  { value: "oklch(98% 0 0)",      type: color }
        "900": { value: "oklch(15% 0 0)",      type: color }
      brand:
        "500": { value: "oklch(62% 0.18 250)", type: color }
    semantic:
      surface:
        base:  { value: "{color.primitive.gray.50}",  type: color }
        muted: { value: "{color.primitive.gray.100}", type: color }
      text:
        default: { value: "{color.primitive.gray.900}", type: color }
        muted:   { value: "{color.primitive.gray.600}", type: color }
      action:
        primary: { value: "{color.primitive.brand.500}", type: color }

  dimension:
    space:
      "1": { value: "4px",  type: dimension }
      "2": { value: "8px",  type: dimension }
      "4": { value: "16px", type: dimension }
      "8": { value: "32px", type: dimension }
    radius:
      sm:   { value: "4px",  type: dimension }
      md:   { value: "8px",  type: dimension }
      lg:   { value: "16px", type: dimension }
      full: { value: "9999px", type: dimension }

  typography:
    font:
      sans: { value: "Inter Variable, system-ui, sans-serif", type: fontFamily }
      mono: { value: "JetBrains Mono, ui-monospace, monospace", type: fontFamily }
    scale:                  # 본문/헤딩 크기 (px)
      xs:   { value: "12px", type: dimension }
      sm:   { value: "14px", type: dimension }
      base: { value: "16px", type: dimension }
      lg:   { value: "20px", type: dimension }
      xl:   { value: "24px", type: dimension }
      "2xl":{ value: "32px", type: dimension }
      "3xl":{ value: "48px", type: dimension }
    weight:
      regular: { value: 400, type: fontWeight }
      medium:  { value: 500, type: fontWeight }
      bold:    { value: 700, type: fontWeight }

# 테마 (light/dark 등) — token-set merge 방식. path 에 인코딩 X
themes:
  default: { base: true }
  dark:
    color.semantic.surface.base:  { value: "{color.primitive.gray.900}", type: color }
    color.semantic.text.default:  { value: "{color.primitive.gray.50}",  type: color }
---
```

### 토큰 작성 규칙

- **3-tier**: `primitive` → `semantic` → `component`. 컴포넌트는 semantic 만 참조, primitive 직접 사용 금지.
- **OKLCH 권장** for color. hex 도 허용하나 contrast 검증은 OKLCH 우선.
- **dimension 은 단위 포함 문자열** (`"4px"`, `"1rem"`). 숫자 단독 금지.
- **alias 문법**: `{group.subgroup.name}` (DTCG 표준).
- **테마**: path 에 `light`/`dark` 박지 말 것. `themes:` 블록의 override map 으로 처리.

## Body — 9 캐논 섹션 (순서·이름 고정)

```markdown
## 1. Personality
브랜드 톤·아이덴티티 3-5 줄. "왜 이 디자인인가".

## 2. Color
semantic 토큰 사용 의도. "primary 는 CTA 에만", "destructive 는 확정 액션에만" 등.
contrast 목표 (WCAG AA / AAA / APCA Lc).

## 3. Typography
스케일 사용 룰. 본문/헤딩 매핑. line-height·letter-spacing 규칙.
variable font 의 wght 범위 한정 등.

## 4. Spacing & Layout
4·8 점 그리드 여부. container max-width. breakpoint.
컴포넌트 간 minimum gap.

## 5. Radius & Borders
어디에 어느 radius. 보더 두께·색 규칙. 그림자 사용/금지 정책.

## 6. Elevation & Motion
shadow/elevation 토큰. 모션 duration·easing. reduced-motion 정책.

## 7. Components
컴포넌트별 spec — Button / Input / Card / Nav / Dialog 등.
각 컴포넌트마다: 토큰 사용, variant, state(hover/active/disabled/focus), a11y 요구.

## 8. Anti-patterns
"하지 말 것" 목록. 흔한 AI slop 사례 + 본 시스템 위반 사례.

## 9. Changelog
역순 날짜 목록. `## YYYY-MM-DD` 헤딩 + bullet.
```

## 빌드 산출물

`scripts/lint/build.js` 가 DESIGN.md 를 읽어 다음을 emit:

- `.design/tokens.json` — DTCG canonical (Style Dictionary v4 입력)
- `.design/lint.json` — ajv schema 검증 결과 + contrast 결과
- `.design/system.html` — body 섹션 렌더 (사람 읽기용)

## 검증 (CI / pre-commit)

ajv schema 통과 + 토큰 alias 모두 resolve + WCAG AA contrast 위반 0 건이면 PASS.
세부 단계는 [methodology/verify-loop.md](../methodology/verify-loop.md) 참조.

## 호환성

- **Style Dictionary v4+** — `.design/tokens.json` 직접 입력 가능.
- **Tokens Studio** — 동일 DTCG shape 으로 Figma 동기화 가능 (sd-transforms 경유).
- **Claude Design / Codex / Cursor** — DESIGN.md 자체를 그대로 인식.

## Changelog

- 2026-05-14: v0.1 초안. DTCG v2025.10 약식 허용, 9 섹션 캐논, 테마 token-set 머지 채택.
