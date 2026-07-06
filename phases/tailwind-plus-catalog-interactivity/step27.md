# Step 27 - Marketing residual filler and job CTA sweep

Date: 2026-07-03

## Scope

- Marketing Blog Sections, Stats, Newsletter, and Contact examples that still contained placeholder-style Latin copy.
- Blog `With photo and list` example where `View job opening` and `View all openings` looked clickable but were static text.
- Related Application feed titles that still used filler-style question text.

## Implementation

- Replaced residual Latin/filler copy in Marketing stats, newsletter, blog, and contact support blocks with UI Dictionary-specific copy.
- Replaced Application feed placeholder question titles with concrete UI workflow discussion titles.
- Converted `View job opening` and `View all openings` in the Blog photo-list example into real buttons.
- Added visible feedback for the job opening and all-openings actions.
- Kept the change scoped to visible content and interaction quality; no navigation model changes were needed.

## Verification

- Targeted filler scan passed for the known residual Latin/filler phrases.
- Targeted pseudo-CTA scan confirmed `View job opening` and `View all openings` are no longer rendered as static `<p>` actions.
- Standalone Playwright smoke on `http://127.0.0.1:5174` verified:
  - `Blog Sections` leaf renders.
  - `With photo and list` example is visible.
  - Three `View job opening` buttons are present.
  - `View all openings` button is present.
  - Clicking the first job button shows `Full-time designer opening opened`.
  - Clicking `View all openings` shows `All openings opened`.
  - The checked filler phrases are not visible.
  - No horizontal overflow or severe console warnings.
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `python scripts/validate-ui-vocabulary.py` passed.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
