# @askewly/design

Query, inject, and verify the [Askewly Design](https://ui.askewly.com) system from your terminal or coding agent.

```bash
npx @askewly/design verify src
```

## Commands

| Command | What it does |
|---|---|
| `verify [dir]` | Scan for color values that bypass the token system — hex literals and raw `rgb()`/`hsl()`/`oklch()`. Comments and SVG markup are exempt. |
| `terms search <query>` | Search the UI vocabulary (562 terms, Korean + English). |
| `terms show <id>` | Definition, aliases, visual anatomy, anti-use cases, prompt phrases. |
| `tokens` | Print the design token set. |
| `init [dir]` | Drop token CSS into a project. |
| `add <recipe>` | Add a component recipe. |
| `recipes list` / `recipes show <id>` | Agent-ready implementation contracts (45 recipes). |

## Why `verify` exists

A screenshot cannot tell `#3B82F6` from `var(--color-accent)` — they render identically. Whether a screen actually uses the token system is a question for a machine, not an eye.

`verify` exits `1` on violations and prints `file:line [rule] excerpt`, so a coding agent can read the list, fix, and re-measure.

Exempt by design: generated token files (`tokens.css`, `askewly.css`), build directories, comments, and SVG markup.

## License

MIT
