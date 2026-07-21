---
id: docs-code-block-with-tabs-and-copy
name: "Docs Code Block With Language Tabs And Copy"
pattern_group: docs
kind: block
status: draft
surface_refs: [documentation, websites]
tokens_used:
  - color.semantic.surface.base
  - color.semantic.text.default
  - color.semantic.text.muted
  - color.semantic.border.default
  - dimension.space.2
  - dimension.space.4
  - dimension.radius.md
  - typography.scale.sm
code_asset: examples/ui-vocabulary-site/src/components/docs-code-block.tsx
component_refs: [button]
term_refs: [copy-button]
source_refs: [nextra-docs-theme]
last_verified: 2026-07-12
---

> **STOP — do not re-implement this recipe from prose.** A verified code asset exists: fetch https://ui.askewly.com/r/docs-code-block.json, write `files[].content` into the project, install the declared dependencies, THEN restyle the look to the project's own tokens (mandatory — component-restyle.md). Prose below is the contract you verify against, not the thing you rebuild.

## Intent

Documentation readers often need the same instruction in more than one equivalent form (npm/yarn/pnpm, or curl/node/python) and want to copy it without hand-selecting text. Tabs switch between equivalent code variants in place, and a fixed copy button turns the block into a one-click action instead of a select-and-copy chore.

## Anatomy

- Tab header: one tab per language/tool variant, switching the code body below without changing surrounding prose.
- Copy button: pinned to the top-right corner of the code body, above the code, not inline with it.
- Code body: monospace text with local horizontal scroll — never widens the parent column.
- Copy confirmation: the button's icon/state changes briefly after a successful copy, then reverts.

## States

- Default: first variant tab active, copy button in its resting icon state.
- Copied: button shows a confirmation icon for a short duration, then returns to the copy icon.
- Long line: code scrolls horizontally within the block; the block's own width still respects the parent column.
- Single variant: tab header still renders (with one tab) rather than collapsing to a bare code block, so a second variant can be added later without restructuring.

## Variants

- Package manager tabs (npm/yarn/pnpm/bun) for install commands.
- Language tabs (curl/node/python/etc.) for API usage samples.
- Optional line-highlight/diff styling layered on top of the same tab+copy shell (not implemented in the base `code_asset` — a token-safe extension point, not a new recipe).

## Code

```tsx
function DocsCodeBlock({ variants }: DocsCodeBlockProps) {
  const [copied, setCopied] = useState(false)
  async function handleCopy(code: string) {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }
  return (
    <Tabs defaultValue={variants[0]?.id}>
      <TabsList variant="line">
        {variants.map((v) => <TabsTrigger key={v.id} value={v.id}>{v.label}</TabsTrigger>)}
      </TabsList>
      {variants.map((v) => (
        <TabsContent key={v.id} value={v.id} className="relative">
          <Button aria-label="Copy code" className="absolute right-2 top-2" size="icon" variant="ghost" onClick={() => handleCopy(v.code)}>
            {copied ? <CheckIcon className="size-4" /> : <CopyIcon className="size-4" />}
          </Button>
          <pre className="overflow-x-auto rounded-md bg-foreground p-4 pr-10 text-background"><code className="text-xs">{v.code}</code></pre>
        </TabsContent>
      ))}
    </Tabs>
  )
}
```

Full implementation: `examples/ui-vocabulary-site/src/components/docs-code-block.tsx`. Built on the `tabs` and `button` shadcn primitives (`examples/ui-vocabulary-site/src/components/ui/tabs.tsx`, `.../ui/button.tsx`).

## Checks

- Copy button sits above the code text (`pr-10` reserves space) so it never overlaps a long line's visible characters.
- The code block's `overflow-x-auto` is scoped to the block itself, not the page.
- Copy confirmation state reverts automatically; it does not require a second click to reset.
- Tab switching swaps only the code body, not the surrounding heading/prose.

## Anti-patterns

- **Copy button inline with code**: placing the button inside the text flow instead of pinned to a corner breaks selection and reading of the code itself.
- **No confirmation after copy**: a copy button that gives no visible feedback leaves the reader unsure whether the click worked.
- **Single global scrollbar**: letting a long code line scroll the whole page horizontally instead of scoping `overflow-x-auto` to the `<pre>` block.
- **Tabs without equivalent content**: using tabs to switch between genuinely different (non-equivalent) instructions, which belongs in separate sections, not a tab set implying interchangeability.

## Agent notes

- prompt_phrases: "npm yarn pnpm 탭과 복사 버튼이 있는 문서 코드 블록을 만들어줘", "여러 언어 탭 전환과 복사 버튼이 있는 코드 스니펫을 문서 페이지에 넣어줘"
- fallbacks: if clipboard write fails (unsupported browser/context), keep the button visible but silently no-op rather than throwing; do not block rendering the code block.
- related: pairs with `copy-button` (the underlying action) and can sit inside `api-reference-three-column-layout`'s right column when the reference needs one code sample per language.
