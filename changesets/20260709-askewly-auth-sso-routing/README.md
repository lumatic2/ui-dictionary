# 20260709 Askewly Auth SSO Routing

Target: ROADMAP milestone PSS2 - Landing Page Design Quality.

## Scope

- Connect Askewly Design sign-in to the existing Askewly Google/Kakao OAuth flow.
- Align the Askewly Design sign-in surface with the existing Askewly-company language while keeping only Google/Kakao providers.
- Replace the centered sign-in modal with a compact popover anchored under the header `Sign in` button.
- Add a Cloudflare Pages Function that proxies `ui.askewly.com/api/auth/*` to the shared Askewly auth Worker.
- Show signed-in state from `/api/auth/session` and provide a same-origin logout action.
- Preserve current `page`, `filter`, and hash state through OAuth return handling.
- Keep the authenticated header state singular: after `auth=ok`, show `Sign out` only instead of a `Signed in` chip beside `Sign in`.
- Update the Google Auth Platform app logo for project `askewly` using the Askewly square A-mark from `Askwely-company/brand/askewly-a-mark-square.svg`.
- Keep the existing landing CTA/navigation cleanup in the same route-quality changeset.

## Contract

- Source of truth: `examples/ui-vocabulary-site/src/App.tsx`, `examples/ui-vocabulary-site/src/components/home-page.tsx`, `functions/api/auth/[[path]].js`, and `docs/ui-vocabulary/deployment.md`.
- Shared auth authority remains `https://askewly.com`; this repo must not introduce OAuth secrets, token verification, or new identity storage.
- The Pages Function is a narrow reverse proxy for `/api/auth/*` only. It must not expose arbitrary upstream URLs.
- Local Vite auth starts may fall back to `https://askewly.com`; production `ui.askewly.com` should use same-origin `/api/auth/*`.
- Provider settings change is limited to Google OAuth branding logo only. Out of scope: changing OAuth clients, secrets, scopes, Kakao provider settings, subscription billing, or pushing/deploying without explicit approval.

## Security Check

- [x] No OAuth client secret, session signing key, token, or user credential is added to this repo.
- [x] Proxy target is fixed to `https://askewly.com`, not user-controlled.
- [x] Session status and logout use same-origin `/api/auth/*` so browser cookies stay in the normal `.askewly.com` domain flow.

## Verification

- [x] `npm run lint` from `examples/ui-vocabulary-site`
- [x] `npm run build` from `examples/ui-vocabulary-site`
- [x] Local Chrome smoke: Google button enters Askewly OAuth and preserves return URL state. Kakao was previously verified in the same modal flow and returned with `auth=ok` from an existing logged-in browser session.
- [x] Local Chrome smoke: `auth=ok` is consumed while preserving `page/filter`.
- [x] Local Chrome smoke: after `auth=ok`, the header shows `Sign out`, does not show `Sign in`, and does not show a separate `Signed in` chip.
- [x] Local Chrome smoke: sign-in popover uses Korean Askewly provider copy/buttons, no email field, and no old English provider labels.
- [x] Local Chrome smoke: sign-in popover opens under the header `Sign in` trigger, right-aligns to the trigger, uses explicit `askewly-login-popover-in` keyframe animation (`0.22s`), and does not lock page scroll.
- [x] Proxy/source inspection: Pages Function only forwards `/api/auth/*` to fixed Askewly origin and introduces no secrets.
- [x] Google Cloud Console: project `askewly` branding logo was replaced with `tmp/askewly-oauth-icon.png` rendered from `Askwely-company/brand/askewly-a-mark-square.svg`, verified, and published.
- [x] Google OAuth account chooser smoke: `client_id=711578332120-la4vk405ir11u95o3rs7enip9st8a42c.apps.googleusercontent.com` now exposes an `alt="askewly"` app image from `lh3.googleusercontent.com` with a 512px source.

## Result

Completed. `wrangler pages dev examples/ui-vocabulary-site/dist --port 8788 --compatibility-date 2026-06-27` returned JSON for `/api/auth/session`, 302 to Google OAuth for `/api/auth/oauth/google/start`, and logout returned session-clearing cookies including `Domain=.askewly.com`. Chrome smoke on the Pages dev URL confirmed Sign in opens the Askewly OAuth entry surface, Google enters Askewly OAuth, and `auth=ok&page=plus&filter=nav%3Aplus-marketing` cleans to `?page=plus&filter=nav%3Aplus-marketing` while showing signed-in feedback. A follow-up Chrome smoke on the dev server confirmed the sign-in surface is now a header-anchored popover under the `Sign in` trigger with Korean provider-only copy: `로그인`, `Google로 계속하기`, `카카오로 계속하기`, no email fields, no old English provider labels, explicit `askewly-login-popover-in` computed animation, and no document scroll lock. Google Auth Platform project `askewly` was updated with the Askewly square A-mark logo, passed branding verification, and was published so the Google account chooser now renders the new `askewly` app image.
