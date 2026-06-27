# UI Vocabulary Authoring Loop Step 2

Date: 2026-06-27
Topic: auth-form-patterns
Status: local verified, not deployed

## Scope

Added `kind` as an auxiliary unit field so canonical categories can stay stable while larger UI units are distinguishable in the site.

- `component`: default when `kind` is omitted
- `form-pattern`: reusable form composition such as login, signup, password reset
- `block`: larger page/dialog/card composition such as login page and auth card

## Added Terms

Form patterns:

- `login-form`
- `signup-form`
- `forgot-password-form`
- `reset-password-form`
- `change-password-form`
- `magic-link-login-form`
- `sso-login-form`
- `social-login-button-group`
- `otp-challenge-form`
- `mfa-challenge-form`
- `passkey-login-form`
- `invite-signup-form`
- `account-creation-form`
- `email-change-form`
- `reauthentication-form`
- `auth-method-choice`

Blocks:

- `auth-card`
- `login-page`
- `split-auth-layout`
- `login-dialog`

## Duplicate Handling

The batch intentionally avoided existing account recovery/access state terms such as `magic-link-sent-state`, `passkey-sign-in-sheet`, `mfa-enrollment-card`, `recovery-code-panel`, `invite-acceptance-screen`, and `session-expired-dialog`.

The split used here:

- Existing terms describe states, prompts, and component-level controls.
- This batch describes reusable auth form compositions and larger auth blocks.

## Verification

- `python scripts/validate-ui-vocabulary.py`: passed, 378 terms
- `npm run build:data`: passed, generated 378 terms
- `node scripts/audit-ui-vocabulary-candidates.mjs --strict-duplicates`: passed, 0 candidates, 0 warnings
- `npm run build`: passed
- `npm run lint`: passed with existing shadcn fast-refresh warnings only
- Chrome local smoke at `http://127.0.0.1:5173/`: passed

Smoke queries:

- `login form`: 7 results, includes `Login form`, related form patterns, and auth blocks
- `signup form`: 2 results, includes `Signup form` and `Invite signup form`
- `mfa challenge`: 1 result, includes `MFA challenge form`
- `auth card`: 2 results, includes `Auth card` and `Login page`
- `login page`: 1 result, includes `Login page` with `블록` badge and visual preview

## Deployment

Not deployed. This batch should be deployed only after the user approves the local shadcn gap + kind + auth form pattern changes together.
