---
id: api-reference-three-column-layout
name: "API Reference Three-Column Layout"
pattern_group: docs
kind: block
status: draft
surface_refs: [documentation, websites]
tokens_used:
  - color.semantic.surface.base
  - color.semantic.surface.muted
  - color.semantic.text.default
  - color.semantic.text.muted
  - color.semantic.border.default
  - dimension.space.2
  - dimension.space.4
  - dimension.space.8
  - dimension.radius.md
  - typography.scale.sm
  - typography.weight.medium
code_asset: examples/ui-vocabulary-site/src/components/api-reference-layout.tsx
component_refs: [article-documentation-layout]
term_refs: [badge]
source_refs: [stripe-api-reference-docs]
last_verified: 2026-07-12
---

## Intent

An API reference page needs a reading path that is different from a prose article: the reader is scanning parameter names and types on the left while running or copying a request on the right. Splitting the page into a left explanation column and a right sticky code/response column lets both happen without scrolling back and forth.

## Anatomy

- Endpoint header: HTTP method badge + path, above both columns.
- Left column: one row per parameter — name, type, required/optional badge, description; nested object parameters indent under their parent.
- Right column: language/tool tabs (curl/node/python, etc.) over a request code sample, sticky while the left column scrolls.
- Response panel: JSON response sample stacked below the request sample in the same sticky column.

## States

- Default: two columns side by side on wide viewports, right column sticky within the viewport.
- Narrow viewport: columns stack, right column loses sticky positioning and follows normal document flow.
- Nested parameter: child rows render indented under the parent row, same row shape.
- No parameters: left column shows only the endpoint header and a short description, no empty param-list chrome.

## Variants

- Read-only reference: no request execution, samples are static text (this recipe's default).
- Paired with `interactive-api-playground` term: the right column's code sample becomes an executable form instead of static text — a distinct, heavier composition, not a variant to fake here.

## Code

```tsx
function ApiReferenceLayout({ method, path, params, samples, response }: ApiReferenceLayoutProps) {
  return (
    <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_26rem]">
      <div className="min-w-0 flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Badge className="font-mono uppercase">{method}</Badge>
          <code className="text-sm">{path}</code>
        </div>
        <div className="flex flex-col gap-5">
          {params.map((param) => <ParamRow key={param.name} param={param} />)}
        </div>
      </div>
      <aside className="lg:sticky lg:top-6 lg:h-fit">
        <Tabs defaultValue={samples[0]?.language}>
          <TabsList>{samples.map((s) => <TabsTrigger key={s.language} value={s.language}>{s.label}</TabsTrigger>)}</TabsList>
          {samples.map((s) => (
            <TabsContent key={s.language} value={s.language}>
              <pre className="overflow-x-auto rounded-md bg-foreground p-4 text-background"><code className="text-xs">{s.code}</code></pre>
            </TabsContent>
          ))}
        </Tabs>
      </aside>
    </div>
  )
}
```

Full implementation: `examples/ui-vocabulary-site/src/components/api-reference-layout.tsx`. Built on the `tabs` and `badge` shadcn primitives (`examples/ui-vocabulary-site/src/components/ui/tabs.tsx`, `.../ui/badge.tsx`).

## Checks

- Right column's `overflow-x-auto` never widens the page on narrow viewports; the code block scrolls within its own boundary.
- Required/optional badges are present on every top-level and nested parameter row.
- Nested parameters remain visually subordinate (indent + border) to their parent row, not flattened into the same list level.
- Sticky positioning only applies at `lg` and above; below that the right column reads in normal document order after the left column.

## Anti-patterns

- **Sticky column captures scroll on mobile**: applying the sticky/fixed right-column behavior below the `lg` breakpoint traps scroll or overlaps the left column.
- **Flattened nested params**: rendering a nested object's fields at the same indent level as their parent loses the object grouping the reader needs.
- **Missing required/optional signal**: omitting the badge forces the reader to infer requiredness from prose instead of scanning it.
- **Request sample without a response sample**: showing only the call and never the shape of what comes back leaves the reference half-finished.

## Agent notes

- prompt_phrases: "왼쪽에 파라미터 설명, 오른쪽에 sticky 코드 샘플이 있는 API 레퍼런스 레이아웃을 만들어줘", "엔드포인트 파라미터 목록과 언어별 요청 예시를 나란히 보여주는 문서 페이지를 만들어줘"
- fallbacks: if only one language sample exists, still use the `Tabs` shell with a single tab rather than switching to a bare `<pre>` block, so a second language can be added without restructuring.
- related: distinct from `article-documentation-layout`, whose right rail is a static on-this-page label list, not an executable code/response panel.
