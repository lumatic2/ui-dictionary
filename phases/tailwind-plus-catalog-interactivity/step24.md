# Step 24 - Application UI Alias Route Normalization

Status: completed

Started: 2026-07-03T20:35:00+09:00
Completed: 2026-07-03T20:50:00+09:00

## Scope

- Chrome smoke found that `nav:plus-application-ui-elements` was a plausible route but did not resolve to the Application UI Elements leaf.
- The same alias shape can happen across Tailwind-style Application UI category paths: `application-ui/forms`, `application-ui/navigation/tabs`, `application-ui/elements/button-groups`, and similar.

## Implementation

- Added `normalizeNavigationFilter` in `navigation-model.ts`.
- Added canonical aliases from `plus-application-ui-*` filters to the existing local canonical filter IDs:
  - shells, headings, data display, lists, forms, feedback, navigation, overlays, elements, layout, and page examples.
- Updated `isNavigationFilter` and `getNavigationCollection` to accept normalized aliases.
- Updated initial URL parsing so alias query filters become canonical filters before leaf-page map lookup.

## Verification

- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `python scripts/validate-ui-vocabulary.py` passed.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- Chrome alias-route smoke verified:
  - `nav:plus-application-ui-elements`: `Elements`, `Admin` produced `Admin badge selected`.
  - `nav:plus-application-ui-elements-button-groups`: `Button Groups`, `Months` produced `Months selected`.
  - `nav:plus-application-ui-navigation-tabs`: `Tabs`, `Company` produced `Company tab opened`.
  - `nav:plus-application-ui-forms-form-layouts`: `Form Layouts`, `Save` produced `Form layout saved`.
- Chrome severe console log was empty.
