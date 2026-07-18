# DESIGN.md — Google Stitch 오픈 포맷 공식 스펙 조사

> 조사일 2026-07-19. 모든 인용에 출처 URL + 접근일을 명시한다. 발견하지 못한 항목은 "발견 실패"로 표기한다.

## 1. 요약

**공식 스펙이 존재하며 신뢰도는 높다.** Google Labs가 2026-04-21 블로그 공지로 DESIGN.md 포맷을 오픈소스화했고([Google Blog](https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-design-md/), 접근 2026-07-19), 정본 스펙과 CLI 도구가 GitHub `google-labs-code/design.md` 레포에 Apache 2.0 라이선스로 공개돼 있다([GitHub repo](https://github.com/google-labs-code/design.md), 접근 2026-07-19). npm 패키지 `@google/design.md`가 실제로 배포돼 있고(`lint`/`diff`/`export`/`spec` 서브커맨드 보유), 공식 예시 3종(`heritage`는 README 발췌에만 존재, `atmospheric-glass`, `paws-and-paths`, `totality-festival`)이 레포 `examples/`에 들어 있다.

현재 포맷 버전은 `alpha`이며, README·spec.md 모두 "스펙·스키마·CLI는 활발히 변경 중"이라고 명시한다. 즉 공식이지만 아직 안정판은 아니다.

stitch.withgoogle.com의 `/docs/design-md/*` 페이지는 SPA(JS 렌더링)라서 WebFetch로는 타이틀만 확인되고 본문을 못 읽었다 — 이 부분은 "발견 실패"로 남기고, 대신 GitHub 레포의 `README.md`와 `docs/spec.md`(둘 다 정적 raw 마크다운으로 전문 확인)를 정본 출처로 사용했다.

## 2. 공식 양식 구조

출처: [`docs/spec.md`](https://github.com/google-labs-code/design.md/blob/main/docs/spec.md) (raw: `https://raw.githubusercontent.com/google-labs-code/design.md/main/docs/spec.md`, 접근 2026-07-19). 이 파일 자체가 `spec.mdx`에서 자동 생성된 정본("Generated from spec.mdx + spec-config.ts | version: alpha")이다.

### 2.1 파일 구조

> "A DESIGN.md file contains two parts: An optional YAML frontmatter, and a markdown body. The YAML front matter contains machine-readable design tokens. The markdown body sections provide human-readable design rationale and guidance." (spec.md)

- YAML frontmatter는 선택(optional)이다 — 없어도 유효한 파일.
- frontmatter는 `---` 로 시작·종료.
- 토큰이 normative value, 프로즈(markdown body)는 그 적용 맥락을 설명.
- 토큰 스펙은 [Design Token JSON spec (W3C DTCG)](https://www.designtokens.org/tr/2025.10/format/#abstract)에서 영감을 받았고, `{path.to.token}` 참조 문법을 채택.

### 2.2 Frontmatter YAML 스키마

```yaml
version: <string>          # optional, current version: "alpha"
name: <string>
description: <string>      # optional
colors:
  <token-name>: <Color>
typography:
  <token-name>: <Typography>
rounded:
  <scale-level>: <Dimension>
spacing:
  <scale-level>: <Dimension | number>
components:
  <component-name>:
    <token-name>: <string|token reference>
```
(spec.md "Schema" 섹션 원문)

- `<scale-level>`: `xs`, `sm`, `md`, `lg`, `xl`, `full` 등 임의 문자열 키 허용.
- 필수 키는 `name` 뿐으로 보이며(`colors`에서 최소 `primary`는 있어야 한다는 규칙은 있음, 아래 참고), 다른 그룹은 전부 optional.

### 2.3 토큰 타입

| Type | Format | Example |
|---|---|---|
| Color | 모든 유효 CSS color 문자열 (hex `#RGB`/`#RGBA`/`#RRGGBB`/`#RRGGBBAA`, named, `rgb()`/`rgba()`/`hsl()`/`hsla()`/`hwb()`, wide-gamut `oklch()`/`oklab()`/`lch()`/`lab()`, `color-mix(in srgb, ...)`) | `"#1A1C1E"`, `"oklch(62% 0.18 250)"` |
| Dimension | 숫자+단위(px, em, rem만 유효) | `48px`, `-0.02em` |
| Token Reference | `{path.to.token}` (원시값 참조가 기본, `components` 섹션에서만 typography 등 복합값 참조 허용) | `{colors.primary}` |
| Typography | 객체: `fontFamily`, `fontSize`, `fontWeight`, `lineHeight`, `letterSpacing`, `fontFeature`, `fontVariation` | 아래 예시 참조 |

(spec.md 및 README.md "Token Types" 표 종합)

- Hex 표기(`#RRGGBB`)가 "recommended default"로 명시됨(단순성·툴링 호환성 이유).
- 모든 color 값은 내부적으로 sRGB로 변환돼 WCAG contrast 체크에 쓰이지만, 원본 표기는 디스플레이·export용으로 보존됨.
- `fontWeight`는 bare number 또는 quoted string 둘 다 동등하게 허용.
- `lineHeight`는 Dimension(예: `24px`)이나 unitless number(예: `1.6`, fontSize의 배수 — CSS 권장 관행) 둘 다 허용.

### 2.4 표준 섹션 (순서 고정)

spec.md "Section Order" 원문:

| # | Section | Aliases |
|---|---|---|
| 1 | Overview | Brand & Style |
| 2 | Colors | |
| 3 | Typography | |
| 4 | Layout | Layout & Spacing |
| 5 | Elevation & Depth | Elevation |
| 6 | Shapes | |
| 7 | Components | |
| 8 | Do's and Don'ts | |

규칙: "Sections can be omitted if they're not relevant to your project, but those present should appear in the sequence listed below. All sections use `<h2>` (`##`) headings. An optional `<h1>` heading may appear for document titling purposes but is not parsed as a section."

각 섹션이 담당하는 토큰 그룹:
- **Colors** 섹션 ↔ `colors:` 토큰. 최소 `primary` 컬러는 정의되어야 함("At least the `primary` color palette must be defined"). 흔한 관례: `primary`, `secondary`, `tertiary`, `neutral` 순서로 명명.
- **Typography** 섹션 ↔ `typography:` 토큰. 통상 9~15개 레벨. 흔한 네이밍: `headline`, `display`, `body`, `label`, `caption` 카테고리 × `small`/`medium`/`large` 크기.
- **Layout** 섹션 ↔ `spacing:` 토큰(map<string, Dimension|number>).
- **Elevation & Depth** 섹션: 전용 토큰 그룹 없음 — flat 디자인이면 대체 수단(테두리·색 대비)을 프로즈로 설명.
- **Shapes** 섹션 ↔ `rounded:` 토큰(map<string, Dimension>).
- **Components** 섹션 ↔ `components:` 토큰(map<string, map<string, string|reference>>). 공식 언급 컴포넌트 종류: Buttons, Chips, Lists, Tooltips, Checkboxes, Radio buttons, Input fields. "components 스펙은 현재도 계속 진화 중"이라고 명시.
- **Do's and Don'ts**: 순수 프로즈 가이드라인, 전용 토큰 없음.

### 2.5 컴포넌트 토큰 상세

```yaml
components:
  button-primary:
    backgroundColor: "{colors.primary-60}"
    textColor: "{colors.primary-20}"
    rounded: "{rounded.md}"
    padding: 12px
  button-primary-hover:
    backgroundColor: "{colors.primary-70}"
```

유효 component property: `backgroundColor`, `textColor`, `typography`, `rounded`, `padding`, `size`, `height`, `width`.

Variant(hover/active/pressed 등)는 별도 키(`button-primary-hover` 등 관련된 이름)로 표현하며, 에이전트가 모든 variant를 종합해 스타일링 판단.

### 2.6 알 수 없는 콘텐츠에 대한 소비자(consumer) 동작 규칙

spec.md 표 원문(README.md와 거의 동일하나 spec.md가 더 상세):

| Scenario | Behavior | Example |
|---|---|---|
| Unknown section heading | Preserve; do not error | `## Iconography` |
| Unknown color token name | Accept if value is valid | `surface-container-high: '#ede7dd'` |
| Unknown typography token name | Accept as valid typography | `telemetry-data` |
| Unknown spacing value | Accept; store as string if not a valid dimension | `grid-columns: '5'` |
| Unknown component property | Accept with warning | `borderColor` |
| Duplicate section heading | Error; reject the file | 두 개의 `## Colors` 헤딩 |

### 2.7 권장 토큰 이름 (Non-Normative)

- Colors: `primary`, `secondary`, `tertiary`, `neutral`, `surface`, `on-surface`, `error`
- Typography: `headline-display`, `headline-lg`, `headline-md`, `body-lg`, `body-md`, `body-sm`, `label-lg`, `label-md`, `label-sm`
- Rounded: `none`, `sm`, `md`, `lg`, `xl`, `full`

### 2.8 CLI / 린팅 (참고 — README.md 원문)

출처: [README.md](https://github.com/google-labs-code/design.md/blob/main/README.md) (raw, 접근 2026-07-19).

- 설치: `npm install @google/design.md` (Windows PowerShell에서는 `@` 이스케이프를 위해 큰따옴표로 감싸야 함 — README에 명시된 Windows 전용 주의사항).
- 서브커맨드: `lint`(구조 검증 + WCAG AA contrast 4.5:1 체크), `diff`(두 버전 비교, 토큰/프로즈 회귀 탐지), `export`(`json-tailwind`/`css-tailwind`/`tailwind`/`dtcg` 포맷으로 변환), `spec`(스펙 자체를 마크다운/JSON으로 출력 — 에이전트 프롬프트에 주입 목적).
- 린팅 규칙 9종(README "Linting Rules" 표): `broken-ref`(error), `missing-primary`(warning), `contrast-ratio`(warning, AA 4.5:1 미만), `orphaned-tokens`(warning), `token-summary`(info), `missing-sections`(info), `missing-typography`(warning), `section-order`(warning), `unknown-key`(warning — 오타 감지, 커스텀 확장 키는 조용히 통과).
- **Windows 관련 알려진 이슈**(README 명시): `npx @google/design.md ...` 직접 실행 시 PowerShell에서 `.md` 접미사가 Windows 마크다운 파일 연결과 충돌해 아무 출력도 없거나 마크다운 에디터가 열릴 수 있음 → 대신 `npx -p @google/design.md designmd lint DESIGN.md`(dot-free alias `designmd`) 사용 권장.

## 3. 공식 예시 전문

출처: [`examples/atmospheric-glass/DESIGN.md`](https://github.com/google-labs-code/design.md/blob/main/examples/atmospheric-glass/DESIGN.md) (raw, 접근 2026-07-19). 레포에는 이 외에 `paws-and-paths`, `totality-festival` 예시도 있음(내용은 미확인 — 시간상 atmospheric-glass만 전문 확인).

이 예시는 frontmatter가 W3C Material-Design 스타일 풀 팔레트(`primary`/`secondary`/`tertiary`/`error` 각각의 `on-*`/`*-container`/`*-fixed` 변형까지 포함, 40+ 컬러 토큰), typography 6레벨(`display-lg`~`label-sm`), `rounded` 6단계, `spacing` 5개, `components` 9개(카드/버튼/인풋/리스트)로 구성돼 있다. 섹션 순서는 스펙 그대로: `## Brand & Style`(Overview의 별칭) → `## Colors` → `## Typography` → `## Layout & Spacing` → `## Elevation & Depth` → `## Shapes` → `## Components`. `Do's and Don'ts` 섹션은 이 예시에는 없음(옵션이므로 생략 가능 — 스펙과 일치).

핵심 발췌 (frontmatter 앞부분 + Colors 섹션 프로즈):

```yaml
---
name: Atmospheric Glass
colors:
  surface: "#0b1326"
  surface-dim: "#0b1326"
  ...
  primary: "#ffffff"
  on-primary: "#2f3131"
  ...
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 84px
    fontWeight: "700"
    lineHeight: 90px
    letterSpacing: -0.04em
  ...
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-padding: 24px
  card-gap: 16px
  section-margin: 40px
  glass-padding: 20px
components:
  glass-card-standard:
    backgroundColor: rgba(255, 255, 255, 0.1)
    textColor: "{colors.primary}"
    rounded: "{rounded.lg}"
    padding: "{spacing.glass-padding}"
  ...
---

## Brand & Style

This design system centers on a high-fidelity Glassmorphism aesthetic
designed to evoke a sense of clarity, depth, and modern sophistication...

## Colors

The color strategy prioritizes luminosity and contrast. Because the
background is a vibrant, multi-colored abstract composition, the UI
components utilize a monochromatic white palette with varying alpha
channels to maintain legibility.

- **Primary Canvas:** A multi-stop linear or radial gradient background
  featuring Deep Blue (#1E3A8A), Vivid Purple (#7E22CE), and Soft Pink
  (#DB2777).
- **Surface Alpha:** Component backgrounds are never solid. They range
  from `rgba(255, 255, 255, 0.1)` for secondary depth to `0.2` for
  primary interaction areas.
...
```

(전체 파일은 위 raw URL에서 확인 가능 — 약 220줄, frontmatter만 약 130줄)

README.md에 나오는 별도 축약 예시("Heritage" — `#1A1C1E` primary, Public Sans/Space Grotesk 타이포)도 스펙 구조를 보여주는 공식 인라인 예시다.

## 4. 커뮤니티 관례

WebSearch로 발견한 2차 자료들(공식 아님 — 라벨 구분):

- **[MindWiredAI 블로그](https://mindwiredai.com/2026/04/23/design-md-is-now-open-source-googles-new-file-format-that-makes-ai-build-your-brand-correctly/)** (접근 2026-07-19, 커뮤니티): "DESIGN.md는 프로젝트 루트에 두면 Claude Code·Cursor·Copilot 등 UI 코드를 작성하는 모든 에이전트가 브랜드 일관성 있는 인터페이스를 생성한다"는 사용 패턴을 설명. 공식 레포 README의 취지와 일치하지만 이 블로그 자체는 3rd-party 해설.
- **[CreativeAINews](https://www.creativeainews.com/blog/google-design-md-open-source-ai-brand-design-stitch/)** (접근 2026-07-19, 커뮤니티): 유사 요약, 추가 정보 없음.
- **[Medium (fernandocomet)](https://medium.com/design-bootcamp/google-makes-design-md-open-source-on-its-way-to-become-a-industry-standard-16119f2368dd)** (접근 2026-07-19, 커뮤니티): "현재는 Stitch에서 잘 작동하지만, 업계 표준이 되려면 Figma·v0·Cursor 등도 채택해야 한다"는 논평 — 즉 2026-07-19 현재 Stitch 외 타 도구의 네이티브 지원은 확인되지 않음(발견 실패로 취급).
- **[dsebastien.net](https://www.dsebastien.net/design-md-specification/)** (접근 2026-07-19, 커뮤니티): 개인 블로그의 스펙 재정리 — 별도 신규 정보 없이 공식 스펙을 요약한 것으로 보임(본문 미상세 확인).
- **[pasqualepillitteri.it](https://pasqualepillitteri.it/en/news/1251/google-stitch-design-md-open-source-spec-2026)** (접근 2026-07-19, 커뮤니티): 유사 뉴스 요약.
- **[MindStudio 블로그](https://www.mindstudio.ai/blog/what-is-google-stitch-design-md-file)** (접근 2026-07-19, 커뮤니티): 유사 뉴스 요약.

커뮤니티 자료 중 공식 스펙과 모순되거나 추가 검증이 필요한 주장은 발견되지 않았다 — 전부 공식 GitHub README/spec.md를 재서술하는 수준.

## 5. 출처 목록

| # | 출처 | 성격 | URL | 접근일 |
|---|---|---|---|---|
| 1 | Google Blog 공식 발표 | 공식 | https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-design-md/ | 2026-07-19 |
| 2 | GitHub 레포 (google-labs-code/design.md) | 공식 | https://github.com/google-labs-code/design.md | 2026-07-19 |
| 3 | README.md (raw) | 공식 | https://raw.githubusercontent.com/google-labs-code/design.md/main/README.md | 2026-07-19 |
| 4 | docs/spec.md (raw, 정본 스펙) | 공식 | https://raw.githubusercontent.com/google-labs-code/design.md/main/docs/spec.md | 2026-07-19 |
| 5 | examples/atmospheric-glass/DESIGN.md (raw) | 공식 | https://raw.githubusercontent.com/google-labs-code/design.md/main/examples/atmospheric-glass/DESIGN.md | 2026-07-19 |
| 6 | npm 패키지 @google/design.md | 공식(참조만, 미설치) | https://www.npmjs.com/package/@google/design.md | 2026-07-19 |
| 7 | stitch.withgoogle.com/docs/design-md/specification, /format/, /overview/ | 공식(사이트, SPA라 본문 미확인 — 발견 실패) | https://stitch.withgoogle.com/docs/design-md/specification 등 | 2026-07-19 |
| 8 | W3C Design Tokens Format Module (DESIGN.md가 영감을 받은 스펙) | 공식(외부 표준, 참조용) | https://tr.designtokens.org/format/ | 2026-07-19 |
| 9 | MindWiredAI 블로그 | 커뮤니티 | https://mindwiredai.com/2026/04/23/design-md-is-now-open-source-googles-new-file-format-that-makes-ai-build-your-brand-correctly/ | 2026-07-19 |
| 10 | CreativeAINews 블로그 | 커뮤니티 | https://www.creativeainews.com/blog/google-design-md-open-source-ai-brand-design-stitch/ | 2026-07-19 |
| 11 | Medium (fernandocomet) | 커뮤니티 | https://medium.com/design-bootcamp/google-makes-design-md-open-source-on-its-way-to-become-a-industry-standard-16119f2368dd | 2026-07-19 |
| 12 | dsebastien.net | 커뮤니티 | https://www.dsebastien.net/design-md-specification/ | 2026-07-19 |
| 13 | pasqualepillitteri.it | 커뮤니티 | https://pasqualepillitteri.it/en/news/1251/google-stitch-design-md-open-source-spec-2026 | 2026-07-19 |
| 14 | MindStudio 블로그 | 커뮤니티 | https://www.mindstudio.ai/blog/what-is-google-stitch-design-md-file | 2026-07-19 |

## 발견 실패 항목

- stitch.withgoogle.com 자체 문서 페이지(`/docs/design-md/specification`, `/format/`, `/overview/`)의 본문 내용 — SPA라 WebFetch가 타이틀만 받아옴. 대신 GitHub 레포 `docs/spec.md`(같은 콘텐츠의 정적 소스로 추정, "Generated from spec.mdx"라는 주석으로 볼 때 Stitch 사이트가 렌더링하는 것과 동일한 spec.mdx에서 생성됨)를 정본으로 사용.
- `examples/paws-and-paths`, `examples/totality-festival` 두 예시의 전문 — 존재만 확인, 내용은 시간상 미조사.
