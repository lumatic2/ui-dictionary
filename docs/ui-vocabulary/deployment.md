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

## Why Not Use `examples/ui-vocabulary-site` As The Only Root?

The Vite app lives in `examples/ui-vocabulary-site`, but its data pipeline reads
shared files from the repository root. If a hosting provider builds only the
example folder without the parent repository context, `npm run build:data` cannot
find the vocabulary source files.

Use the repository root as the checked-out project and move into the app folder
inside the build command.

## Deploy

Local direct deploy:

```bash
cd examples/ui-vocabulary-site
npm ci
npm run build
cd ../..
npx wrangler pages deploy examples/ui-vocabulary-site/dist --project-name ui-vocabulary --branch main
```

For dashboard/Git integration, keep the same build command and output directory
shown above.
