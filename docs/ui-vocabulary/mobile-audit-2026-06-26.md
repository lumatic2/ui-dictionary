# Mobile UI Vocabulary Audit — 2026-06-26

## Summary

- Baseline before mobile horizon: 257 terms.
- After Step 1: 264 terms.
- After Step 2: 276 terms.
- After Step 3: 288 terms.
- After Step 4: 300 terms.
- After Step 5: 315 terms.
- Net new mobile-focused terms: 58.

## Completed Batches

- Step 1 app shell/navigation: 7 terms.
- Step 2 overlays/system feedback: 12 terms.
- Step 3 gestures/touch affordances: 12 terms.
- Step 4 inputs/pickers/auth: 12 terms.
- Step 5 content/commerce/maps/onboarding: 15 terms.

## Duplicate Handling

Existing broad terms were kept as canonical base vocabulary:

- `bottom-navigation`, `tab-bar`, `back-button`, `floating-action-button`
- `toast`, `snackbar`, `dialog`, `permission-state`
- `pull-to-refresh`, `swipe-action`, `draggable-list`, `reorder-handle`, `carousel`
- `otp-input`, `date-picker`, `time-picker`, `tag-input`, `search-view`
- `product-card`, `cart-summary`, `order-status`, `image-gallery`, `empty-state`, `onboarding-checklist`

Mobile terms were added only when they name a distinct mobile placement, gesture affordance, or screen pattern. Examples:

- `mobile-status-bar` vs `status-bar`: OS/system chrome vs app/editor status strip.
- `standard-bottom-sheet` and `modal-bottom-sheet` vs `mobile-bottom-sheet`: specific behavior and blocking semantics.
- `swipe-to-delete` and `swipe-action-row` vs `swipe-action`: destructive shortcut and bidirectional row pattern.
- `mobile-search-sheet` vs `search-view`: mobile sheet/full-screen search surface.
- `cart-summary-bar` vs `cart-summary`: sticky mobile bottom summary vs full order summary content.

## Category Decision

No new top-level category is needed yet.

The existing six categories remain usable:

- `input`
- `selection`
- `action`
- `structure`
- `feedback`
- `data-display`

Mobile-specific discoverability is handled through existing detailed groups, especially:

- `structure-mobile`
- `input-search-command`
- `input-pickers`
- `feedback-empty-error`
- `feedback-status-notifications`
- `data-cards-content`
- `data-commerce-billing`

If mobile terms grow beyond roughly 120 focused entries, consider adding a `platform_context` field instead of a top-level `mobile` category. Top-level category should continue to describe the UI role, not the platform.

## Search Smoke Results

Representative mobile queries passed in a 390px Chrome viewport with no horizontal overflow:

- `지도 아래 패널` -> `map-bottom-panel`, `mobile-bottom-sheet`
- `스토리 넘기는 화면` -> `story-viewer`, `story-rail`, `carousel`
- `상품 옵션 아래에서 선택` -> `product-option-sheet`, `standard-bottom-sheet`, `quantity-stepper`
- `고정된 하단 결제 버튼` -> `bottom-cta-bar`, `cart-summary-bar`, `sticky-footer-bar`
- `댓글 입력 바` -> `comment-composer`
- `위치 권한 필요 화면` -> `location-permission-empty`
- `온보딩 넘김 화면` -> `onboarding-pager`

## Verification

```bash
cd examples/ui-vocabulary-site
npm run build
npm run lint
```

Results:

- `npm run build`: pass, generated 315 terms.
- `npm run lint`: pass with existing shadcn fast-refresh warnings in `button.tsx`, `badge.tsx`, and `tabs.tsx`.

