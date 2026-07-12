---
id: mobile-signup-field-stack
name: "Mobile Signup Field Stack"
pattern_group: forms
kind: form-pattern
status: draft
surface_refs: [mobile-apps]
tokens_used:
  - color.semantic.text.default
  - color.semantic.text.muted
  - color.semantic.border.default
  - color.semantic.border.focus
  - color.semantic.action.destructive
code_asset: examples/ui-vocabulary-site/src/components/mobile-signup-field-stack.tsx
component_refs: []
term_refs: [mobile-form-field-stack]
source_refs: [apple-hig-components]
last_verified: 2026-07-12
---

## Intent

`mobile-form-field-stack` names the structural constraint (48×48 touch targets, next-field keyboard action) but not the field-level implementation. This recipe fixes the per-field keyboard type dispatch (email/numeric/secure), the logical tab order driven by the keyboard's own return key, and blur-time (not keystroke-time) validation for a stacked signup/login form.

## Anatomy

- Stacked label-input-helper units: one label, one input, one helper/error line per field, stacked vertically.
- Secure text field for password: masked input with `autoComplete="new-password"`, distinct from plain text fields.
- Per-field keyboard type: `inputMode`/`type` set per field purpose (email keyboard for email, default for name, masked for password).
- Next-field return key action: `enterKeyHint="next"` on every field except the last, `"done"` on the last.
- Submit CTA: pinned at the end of the stack, a full-width button separate from the last field's return key action.

## States

- **Untouched**: no helper/error shown beyond the field's static hint (e.g. password's minimum-length note).
- **Focused**: visible focus ring (`focus:ring-2`), current field highlighted so the active position in the stack is unambiguous.
- **Touched + invalid**: error replaces the helper text only after the field has been blurred at least once — never on every keystroke.
- **Touched + valid**: helper text (if any) reappears, no error state.

## Variants

- Field set is illustrative (name/email/password) — swap in the actual fields needed, keeping one keyboard-type decision and one validation-timing decision per field.
- Submit CTA can be `pinned` (fixed above the keyboard) or `inline` (part of the scrolling stack, as implemented) depending on form length; both are valid per the parent term.

## Code

```tsx
<input
  id={field.id}
  type={field.type}
  inputMode={field.inputMode}
  enterKeyHint={field.enterKeyHint}
  autoComplete={field.type === "password" ? "new-password" : field.id}
  onBlur={() => setTouched((current) => ({ ...current, [field.id]: true }))}
  onKeyDown={(event) => {
    if (event.key === "Enter" && field.enterKeyHint === "next") {
      event.preventDefault()
      focusNext(index)
    }
  }}
  className="h-11 min-h-11 rounded-md border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
/>
```

Full field definitions, focus-ref wiring, and the colocated `MobileSignupFieldStackDemo` (rendered inside `DeviceFrame`) live in `code_asset`.

## Checks

- Every field is at least 44×44 (`h-11 min-h-11`, ~44px) per the parent term's touch-target floor.
- Password field uses a masked `type="password"` input with `autoComplete="new-password"`, not a plain text field.
- Pressing the keyboard's return/next action on a non-final field moves focus to the next field without requiring a tap.
- Validation errors only appear after a field has been blurred at least once (`touched`), never while the user is still actively typing into it.

## Anti-patterns

- **Wrong keyboard type per field**: using the default text keyboard for an email field (instead of `inputMode="email"`) forces users to manually switch keyboards to type `@`.
- **Keystroke-time validation**: showing an error on every keystroke (e.g. "too short" while the user is still typing the password) is noisy and reads as broken rather than helpful — validate on blur.
- **Swipe-only field navigation**: relying on the user to manually tap each next field, or requiring a swipe gesture to move between fields, ignores the keyboard's own next/return action that most users already expect.
- **Sub-44px touch targets**: shrinking field height below the 44×44 floor to fit more fields on screen trades density for tap accuracy, contradicting the parent term's core constraint.

## Agent notes

- `prompt_phrases`: "모바일 가입 폼에 이름/이메일/비밀번호를 세로로 쌓아줘", "이메일 필드는 이메일 키보드가 뜨게 해줘", "다음 필드로 넘어가는 키보드 액션을 연결해줘", "비밀번호는 8자 이상 검증을 blur 시점에만 보여줘"
- If the form only has a single field, use a plain `text-field` instead of this stack — the term's own `anti_use` already says one field doesn't need the stack contract.
- Fallback: if a UI kit doesn't expose `enterKeyHint`, at minimum wire the `Enter`/`Return` keydown to advance focus (as implemented) so keyboard-driven progression still works.
