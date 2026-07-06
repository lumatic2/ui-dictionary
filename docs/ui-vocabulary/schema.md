# UI Vocabulary Term Schema

Canonical data file: `docs/ui-vocabulary/terms.yml`

The website can generate JSON or TypeScript from YAML, but YAML is the editable source of truth.

## Term Entry

```yaml
- id: text-field
  status: draft
  category: input
  kind: component
  group: input-text
  ko:
    name: 입력창
    aliases: [텍스트 필드, 인풋, 입력 요소]
  en:
    name: Text field
    aliases: [Input, Text input]
  one_liner: 짧은 글자를 입력받는 한 줄짜리 입력 요소.
  description: 사용자가 이름, 제목, 검색어처럼 짧은 텍스트를 직접 입력할 때 쓴다.
  visual_anatomy:
    - label or placeholder text
    - input container
    - optional helper or error text
  when_to_use:
    - 짧은 텍스트 값을 직접 입력받을 때
    - 폼 안에서 사용자가 값을 수정해야 할 때
  anti_use:
    - 긴 본문 입력에는 textarea를 쓴다
    - 정해진 보기 중 고르게 할 때는 select, radio group, checkbox를 검토한다
  prompt_phrases:
    - 이름을 입력하는 text field를 넣어줘
    - 검색어를 입력할 search input을 상단에 배치해줘
  navigation:
    canonical_path: [Plus, UI Blocks, Application UI, Forms]
    also_appears_in:
      - [Docs, Interaction]
      - [Index, 입력]
  related:
    - id: textarea
      relation: compare
      note: 여러 줄 입력이면 textarea가 더 적합하다
  asset:
    kind: mini-mock
    variant: text-field
    props:
      state: default
  sources:
    - source_id: material-m3-text-fields
      note: text field definition and anatomy
  confidence: high
```

## Required Fields

- `id`: kebab-case stable identifier.
- `status`: `draft`, `reviewed`, or `published`.
- `category`: one of `input`, `selection`, `action`, `structure`, `feedback`, `data-display`, `style`, `layout-rendering`, `accessibility`.
- `group`: required. Term's fine-grained classification within its category. Must match an `id` in `docs/ui-vocabulary/groups.yml`, and that group's `category` must equal the term's `category` (see `docs/design-system/pattern-taxonomy.md` §4, §6).
- `kind`: optional helper classification. If omitted, the build pipeline treats it as `component`.
  - `component`: reusable UI element with its own visible boundary or behavior.
  - `block`: larger page or section composition made from multiple components.
  - `form-pattern`: repeated form composition or input workflow.
  - `visual-effect`: decorative or attention-directing effect applied to a component or section.
  - `motion-pattern`: animation or scroll behavior pattern.
  - `visual-treatment`: background, texture, surface, or styling treatment that changes the look but is not itself an interaction component.
- `ko.name`, `en.name`: primary display names.
- `ko.aliases`, `en.aliases`: search aliases.
- `one_liner`: one sentence, beginner-friendly.
- `description`: short practical explanation.
- `visual_anatomy`: visible parts needed to render a mini asset.
- `when_to_use`: concrete use cases.
- `anti_use`: common misuse or better alternatives.
- `prompt_phrases`: Korean phrases a vibe-coding user can paste into an AI prompt.
- `navigation`: optional browse placement metadata for the Tailwind-style site IA.
  - `canonical_path`: exactly one primary browse home. Use this for first-class sidebar placement and duplicate prevention.
  - `also_appears_in`: secondary browse contexts. Use these only as chips, related links, or search/filter hints, not as another primary card home.
- `asset`: rendering hint for the website.
- `sources`: at least one source reference.
- `confidence`: `high`, `medium`, or `low`.

## Asset Kinds

- `mini-mock`: preferred. Rendered with React/CSS primitives.
- `icon-composition`: lucide icons plus simple UI chrome.
- `diagram`: fixed SVG or CSS diagram for layout concepts.
- `screenshot`: deferred. Use only when an actual product example is needed.

## Navigation Model

The visible site IA follows the Tailwind split:

- `Docs`: concept learning, implementation vocabulary, design-system language.
- `Plus`: ready-to-use UI patterns.
  - `UI Blocks`: surface and block families such as Marketing, Application UI, Ecommerce, Forms, Navigation, Overlays.
  - `Templates`: complete screen or page examples.
  - `UI Kit`: reusable component-system pieces.
- `Index`: full fallback index and legacy category browsing.

`category`, `kind`, and use-case groupings remain useful internal facets, but the user-facing sidebar should prefer `navigation.canonical_path`.

Canonical path rules:

- Every published term should eventually have one `navigation.canonical_path`.
- UI object terms belong under `Plus > UI Blocks` or `Plus > UI Kit`.
- Full page or screen terms belong under `Plus > Templates`.
- CSS, styling, layout, motion, and accessibility concepts belong under `Docs`.
- `also_appears_in` may contain multiple paths, but those paths must not render duplicate primary cards.

Examples:

```yaml
navigation:
  canonical_path: [Plus, UI Blocks, Application UI, Overlays]
  also_appears_in:
    - [Plus, UI Kit, Components]
    - [Docs, Accessibility]
```

```yaml
navigation:
  canonical_path: [Docs, Styling, Surfaces]
  also_appears_in:
    - [Docs, Effects]
    - [Index, 스타일·재질]
```

## Source Reference Shape

`source_id` must match an entry in `docs/ui-vocabulary/sources.md`.

```yaml
sources:
  - source_id: wai-aria-apg-patterns
    note: accessibility pattern and interaction behavior
```

## Review Rules

- Use official component/design-system docs for the main definition when possible.
- If Korean naming differs in practice, keep the English term canonical and add Korean variants as aliases.
- When two terms overlap, add a `related` comparison rather than merging them too early.
- Do not publish a term unless `visual_anatomy` is concrete enough to render a small recognizable asset.
