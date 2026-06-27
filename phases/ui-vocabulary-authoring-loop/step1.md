# Step 1: shadcn Component Gap Batch

Date: 2026-06-27

Theme: remaining shadcn component names that were not clearly searchable as standalone terms.

## Added Terms

- `aspect-ratio-box`
- `hover-card`
- `scroll-area`
- `native-select`
- `keyboard-shortcut-key`
- `navigation-menu`
- `field-group`
- `item-row`
- `sonner-toast`
- `direction-provider`

## Handled As Existing Coverage

These shadcn names already had equivalent or broader terms and were not duplicated:

- `command` -> `command-palette`
- `collapsible` -> `disclosure-group`
- `empty` -> `empty-state`
- `progress` -> `progress-bar`
- `resizable` -> `resizable-panel`
- `sidebar` -> `sidebar-nav`, `sidebar-section`, `collapsible-sidebar`, `mini-sidebar`
- `message` -> `message-bar`, `validation-message`, `inline-alert`
- `attachment` -> `attachment-list`
- `marker` -> `map-marker`
- `bubble` -> `tooltip`

## Block And Form Pattern Notes

shadcn has at least three useful levels:

- Component: reusable primitive such as Button, Dialog, Select, Hover Card, Field, Sidebar.
- Block: composed screen section or page such as login page, dashboard shell, sidebar layout, settings page.
- Form pattern: recurring form composition such as login form, signup form, password reset form, MFA challenge, field group, error summary.

For the current UI Dictionary, components remain in the six existing categories.
Blocks and form patterns should not force a new top-level category yet. They can
be represented as terms under `structure`, `input`, or `feedback`, with a future
optional `scope` or `kind` field if the site needs filtering by `component`,
`block`, and `pattern`.

Recommended next batch: `auth-form-patterns`.
