# UI Vocabulary Deployment

Production target: `ui.askewly.com`

Hosting: Cloudflare Pages

## Build

Run the build from the repository root so the site can read both:

- `docs/ui-vocabulary/terms.yml`
- `scripts/build-ui-vocabulary-data.mjs`

Cloudflare Pages build command:

```bash
cd examples/ui-vocabulary-site && npm ci && npm run build
```

Build output directory:

```text
examples/ui-vocabulary-site/dist
```

## Pages Functions

The production Pages project also serves a small same-origin auth proxy:

```text
functions/api/auth/[[path]].js
```

Requests under `https://ui.askewly.com/api/auth/*` are forwarded to the shared
Askewly auth authority at `https://askewly.com/api/auth/*`. OAuth provider
configuration, session signing, user storage, and secrets stay in the shared
Askewly Worker. This repository must not add OAuth secrets or duplicate identity
storage.

## Why Not Use `examples/ui-vocabulary-site` As The Only Root?

The Vite app lives in `examples/ui-vocabulary-site`, but its data pipeline reads
shared files from the repository root. If a hosting provider builds only the
example folder without the parent repository context, `npm run build:data` cannot
find the vocabulary source files.

Use the repository root as the checked-out project and move into the app folder
inside the build command.

## Manual Deploy

Local direct deploy:

```bash
cd examples/ui-vocabulary-site
npm ci
npm run build
cd ../..
npx wrangler pages deploy examples/ui-vocabulary-site/dist --project-name ui-vocabulary --branch main
```

## Automatic Deploy

GitHub repository:

```text
https://github.com/lumatic2/ui-dictionary
```

Cloudflare Pages project:

```text
ui-dictionary
```

The Pages project uses Cloudflare Git integration, not GitHub Actions. A push to
`main` triggers Cloudflare to build the repository with the build command and
output directory above.

Production domain:

```text
https://ui.askewly.com/
```

Previous manual project:

```text
ui-vocabulary
```

`ui-vocabulary` was created as a Direct Upload project. Cloudflare does not allow
adding a `source` object to an existing Direct Upload project, so automatic
deployment uses the separate Git-connected `ui-dictionary` project.

Status: deleted after `ui.askewly.com` was moved to `ui-dictionary`.
