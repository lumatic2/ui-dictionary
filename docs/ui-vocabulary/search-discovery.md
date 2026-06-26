# UI Vocabulary Search Discovery Contract

## Goal

Search should help users find UI terms even when they do not know the exact component name.

The current site already supports simple Korean/English text search, but that mostly serves users who know the name. This contract defines the next search layer: autocomplete, ranked results, match reasons, no-result recovery, URL state, and QA fixtures.

## User Models

### Exact-name user

The user knows a term or close alias.

Examples:

- `토글`
- `modal`
- `breadcrumb`
- `dropdown`

Expected behavior:

- Exact Korean/English name, id, and alias matches rank first.
- The autocomplete panel should show the direct term before broader categories.

### Purpose-based user

The user knows the job to be done, not the term.

Examples:

- `여러 개 중 하나 고르기`
- `상태 보여주기`
- `표에서 필터하기`
- `진행 상태`

Expected behavior:

- `one_liner`, `when_to_use`, and `prompt_phrases` matches should surface terms.
- Results should explain the match with labels such as `AI 요청 문장`, `설명 일치`, or `사용 상황`.

### Appearance-based user

The user remembers the shape or placement.

Examples:

- `옆에서 나오는 창`
- `위에 뜨는 작은 말풍선`
- `카드 넘기는 UI`
- `비어 있을 때 화면`

Expected behavior:

- `visual_anatomy`, aliases, and description matches should contribute to ranking.
- Results should expose `생김새 단서` match reasons.

## Search API Direction

The implementation should keep the current public filter behavior but add ranked metadata.

Current behavior:

```ts
searchTerms(terms, query, filter): VocabularyTerm[]
```

Target behavior:

```ts
type SearchMatchReason =
  | "name"
  | "alias"
  | "category"
  | "group"
  | "one_liner"
  | "description"
  | "visual_anatomy"
  | "when_to_use"
  | "prompt_phrase"

type SearchResult = {
  term: VocabularyTerm
  score: number
  reasons: SearchMatchReason[]
  matchedText: string[]
}

searchTerms(terms, query, filter): SearchResult[]
```

Compatibility rule:

- Empty query should preserve the current source order.
- Existing category/group filter behavior should not change.
- App UI can derive `filteredTerms` from `results.map((result) => result.term)` until cards consume match metadata.

## Scoring Fields

Deterministic scoring is required so fixture QA is stable.

Suggested weights:

- `120`: exact Korean name, English name, or term id.
- `100`: exact alias.
- `80`: prefix Korean name, English name, id, or alias.
- `60`: category or group label.
- `45`: `one_liner`.
- `40`: `prompt_phrases`.
- `35`: `when_to_use`.
- `30`: `visual_anatomy`.
- `20`: `description`.
- `10`: `anti_use`.

Tie-breakers:

1. Higher score.
2. Earlier exact/prefix field priority.
3. Original term order from `terms.yml`.

## Autocomplete Candidates

Suggestion candidates should be generated from the same data source, not hardcoded lists.

Candidate types:

- `term`: Korean name, English name, id, aliases.
- `category`: major category label such as `입력` or `화면 구조`.
- `group`: detailed group label such as `커머스·청구`.
- `starter`: curated query examples for blank search.

Starter queries are allowed to be curated because they are user education prompts, not term definitions.

Initial starter queries:

- `켜고 끄는`
- `옆에서 나오는 창`
- `표 필터`
- `빈 화면`
- `카드 넘기기`
- `진행 상태`

## Representative Query Fixture

All expected ids below exist in `docs/ui-vocabulary/terms.yml` as of 2026-06-26.

| Query | User model | Expected top ids |
| --- | --- | --- |
| `토글` | exact-name | `switch`, `toggle-button`, `toggle-group` |
| `켜고 끄는` | purpose-based | `switch`, `toggle-button` |
| `옆에서 나오는 창` | appearance-based | `drawer`, `side-sheet`, `navigation-drawer` |
| `위에 뜨는 창` | appearance-based | `dialog`, `popover`, `tooltip` |
| `표 필터` | purpose-based | `filter-bar`, `filter-panel`, `faceted-filter`, `data-table-toolbar` |
| `검색창` | exact-name | `search-field`, `search-view`, `autocomplete` |
| `빈 화면` | appearance-based | `empty-state`, `empty-search-result`, `empty-table` |
| `카드 넘기기` | appearance-based | `carousel`, `image-gallery` |
| `결제 카드` | purpose-based | `payment-method-card`, `price-card`, `plan-card` |
| `진행 상태` | purpose-based | `progress-bar`, `stepper`, `setup-progress` |
| `명령어` | purpose-based | `command-palette`, `search-view` |
| `여러 개 중 하나` | purpose-based | `radio-group`, `select`, `segmented-control` |
| `목록에서 고르기` | purpose-based | `select`, `combobox`, `dropdown-menu` |
| `잠깐 뜨는 안내` | appearance-based | `toast`, `snackbar`, `announcement-banner` |

Step 2 should turn this table into a lightweight executable fixture or browser smoke helper.

## Result Explanation Labels

UI labels should use plain Korean.

- `name`: `이름 일치`
- `alias`: `별칭 일치`
- `category`: `대분류 일치`
- `group`: `세부 분류 일치`
- `one_liner`: `한 줄 설명`
- `description`: `설명 일치`
- `visual_anatomy`: `생김새 단서`
- `when_to_use`: `사용 상황`
- `prompt_phrase`: `AI 요청 문장`

## No-Result Recovery

Empty search should not stop at "검색 결과가 없습니다."

Recovery UI should include:

- Clear query action.
- Clear filter action when a filter is active.
- Starter queries.
- Category/group shortcuts.
- Closest suggestions if the query partially matches aliases or category labels.

The app must not silently clear the user's filter or query.

## URL State Contract

The final horizon should support shareable state:

```txt
?q=토글&filter=selection-options
```

Rules:

- `q` maps to search input.
- `filter` maps to `"all"`, major category id, or group id.
- Unknown filter values fall back to `"all"`.
- Empty query should be omitted from the URL.

## Smoke Checklist

Required implementation checks:

- Build: `npm run build`.
- Lint: `npm run lint`.
- Autocomplete: typing `토` shows switch/toggle candidates.
- Autocomplete: typing `옆에서` shows drawer/side-sheet candidates.
- Keyboard: ArrowDown and Enter select a suggestion.
- Ranking: fixture queries surface expected ids near the top.
- Match reason: result cards show why a result matched.
- No result: unknown query shows recovery controls.
- URL: reload with `?q=토글&filter=selection-options` restores state.
- Mobile: 390px viewport has no horizontal overflow and suggestion panel stays visible.

### Smoke Log: 2026-06-26

- `npm run build`: passed.
- `npm run lint`: passed with existing shadcn Fast Refresh warnings in `button.tsx`, `badge.tsx`, and `tabs.tsx`.
- Autocomplete: `토` showed switch/toggle candidates.
- Autocomplete: `옆에서` showed side-sheet/drawer candidates.
- Keyboard: ArrowDown + Enter selected `스위치`.
- Ranking fixture: `토글`, `켜고 끄는`, `옆에서 나오는 창`, `표 필터`, `빈 화면` surfaced expected ids near the top.
- Match reason: result cards showed Korean reason badges such as `별칭 일치`, `AI 요청 문장`, and `생김새 단서`.
- No-result recovery: unknown query showed query clearing, filter clearing, starter queries, and category shortcuts.
- URL state: `?q=토글&filter=selection-options` restored query and filter on load.
- Mobile: 390px viewport had no horizontal overflow; suggestion panel, result summary, and empty-state controls stayed within viewport.

## Next Horizon Candidates

- Term detail depth: related-term comparisons, "not this, use that" guidance, source links.
- Data authoring workflow: `inbox.yml`, promotion checklist, duplicate-risk review script.
- Mobile navigation polish: category drawer, sticky active section, compact browse controls.
- Cookbook bridge: connect selected vocabulary terms to implementation recipes.

## Non-Goals

- No server-side search.
- No saved search history.
- No analytics or search logging.
- No embedding/vector API.
- No user account personalization.
