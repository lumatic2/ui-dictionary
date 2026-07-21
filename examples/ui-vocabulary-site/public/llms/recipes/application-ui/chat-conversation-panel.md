---
id: chat-conversation-panel
name: "Chat Conversation Panel"
pattern_group: application-ui
kind: block
status: draft
surface_refs: [websites, mobile-apps, saas-dashboards]
tokens_used:
  - color.semantic.surface.base
  - color.semantic.surface.muted
  - color.semantic.text.default
  - color.semantic.text.muted
  - color.semantic.text.on-accent
  - color.semantic.action.primary
  - color.semantic.action.destructive
  - color.semantic.border.default
  - color.semantic.border.input
  - color.semantic.border.focus
  - dimension.space.2
  - dimension.space.4
  - dimension.radius.md
  - dimension.radius.lg
  - typography.scale.sm
code_asset: examples/ui-vocabulary-site/src/components/chat-conversation-panel.tsx
component_refs: [button, actionable-toast]
term_refs: []
source_refs: []
last_verified: 2026-07-17
---

> **STOP — do not re-implement this recipe from prose.** A verified code asset exists: fetch https://ui.askewly.com/r/chat-conversation-panel.json, write `files[].content` into the project, install the declared dependencies, THEN restyle the look to the project's own tokens (mandatory — component-restyle.md). Prose below is the contract you verify against, not the thing you rebuild.

## Intent

A chat conversation panel turns a request-response exchange with a person or an AI assistant into one continuously readable thread: a bounded, self-scrolling message log above a single always-visible input bar. It exists for turn-taking conversation — not for comment threads (no reply nesting), notification feeds (no input), or one-shot form submission.

Demand source: dogfooding ledger DF-1/DF-2 — two consecutive real chat-UI tasks found no recipe covering this surface.

## Anatomy

- Bounded thread container that owns its own vertical scroll and pins to the newest message; the page never scrolls to follow the conversation.
- Message bubbles aligned by author (user trailing, assistant leading), each with a visually hidden author prefix for screen readers.
- A polite live region (`role="log"`, `aria-live="polite"`) around the thread so new turns are announced without stealing focus.
- Waiting indicator rendered *as a thread entry* in the assistant position — the reply appears where the user is already looking.
- Error row rendered as a thread entry with an icon + text (never color alone) and a single Retry action; the failed draft is never discarded.
- Input bar: multiline-capable field + send control. Enter sends, Shift+Enter breaks a line; send stays disabled while the draft is empty or a reply is pending.

## States

- Empty: first-use guidance ("no messages yet" + what to ask) — distinct from an error and from a cleared conversation.
- Waiting: typing indicator with `motion-safe` animation, a `motion-reduce` static fallback, and an `sr-only` "Assistant is typing" mirror.
- Error: tinted `role="alert"` row with icon, plain-language explanation, and Retry re-sending the last user message.
- Focus: visible `focus-visible` ring on the input and send button; keyboard path covers compose → send → retry.
- Scroll: thread auto-follows new messages; long messages wrap inside the bubble (`break-keep` so CJK text never splits mid-word).

## Variants

- Assistant chat (AI product): waiting/error states are load-bearing — model latency and failures are routine, not exceptional.
- Elevated input (first-run / hero chat): the input bar is the product's center of gravity — it may claim the lightest surface and the most distinctive radius on screen (e.g. pure white on a warm off-white base), while everything else stays flat. Reserve this emphasis for the input alone (taste ledger T-7).
- Human-to-human messaging: waiting indicator maps to the other party typing; delivery/read receipts attach to bubbles.
- Embedded support widget: same anatomy inside a popover/sheet; the thread height bounds to the overlay, never the page.

## Code

```tsx
<div ref={threadRef} aria-label="Conversation" className="flex-1 space-y-3 overflow-y-auto p-4" role="log" aria-live="polite">
  {messages.map((message) => (
    <div key={message.id} className={message.role === "user" ? "flex justify-end" : "flex justify-start"}>
      <p className={message.role === "user"
        ? "max-w-[85%] break-keep rounded-lg rounded-br-sm bg-primary px-3 py-2 text-sm text-primary-foreground"
        : "max-w-[85%] break-keep rounded-lg rounded-bl-sm bg-muted px-3 py-2 text-sm text-foreground"}>
        <span className="sr-only">{message.role === "user" ? "You: " : "Assistant: "}</span>
        {message.text}
      </p>
    </div>
  ))}
  {status === "error" ? (
    <div className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2" role="alert">
      <AlertCircleIcon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-destructive" />
      <div className="min-w-0 flex-1">
        <p className="break-keep text-sm text-foreground">The assistant could not respond. Your message was not lost.</p>
        <Button variant="link" onClick={onRetry}>Retry</Button>
      </div>
    </div>
  ) : null}
</div>
```

## Checks

- Thread is the only scroll container that grows; the input bar stays visible at every viewport height (`h-[…]` or flex column with `flex-1` thread).
- Waiting and error are rendered in the thread flow, in the assistant position, so state changes appear where attention already is.
- Error text names what happened and what is preserved; Retry is the single action and re-sends the exact failed message.
- Send is disabled for empty drafts and while waiting — no double-submit path.
- New messages are announced via the polite log; focus never jumps when a reply arrives.
- CJK copy wraps with `word-break: keep-all` (`break-keep`) inside bubbles.

## Anti-patterns

- **Silent failure**: request fails and nothing appears in the thread — the user cannot tell waiting from broken. Render an explicit error entry with Retry.
- **Happy-path-only thread**: no waiting indicator, so slow replies look like ignored input and users resend duplicates.
- **Page-level scroll**: the whole page scrolls to follow messages, detaching the input bar and losing surrounding context.
- **Color-only role separation**: user/assistant bubbles differ only by hue — alignment + shape (asymmetric corner) + sr-only prefix must carry the distinction too.

## Agent notes

- prompt_phrases: "bounded chat thread with role=log polite live region, typing indicator with reduced-motion fallback, and an in-thread error row with a single Retry", "chat input where Enter sends, Shift+Enter breaks, and send disables while waiting"
- fallbacks: for a read-only transcript use a plain list (no input, no live region); for threaded discussion with replies use a comment-thread structure, not this panel.
- canonical guidance: `docs/design-system/principles.md` principles 5 and 7; `docs/design-system/anti-patterns.md` clusters 3, 4, 11.
