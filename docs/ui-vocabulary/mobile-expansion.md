# UI Vocabulary Mobile Expansion

## Goal

Make mobile-specific UI easier to name, recognize, and request from an AI coding agent. A term belongs here when it has a distinct mobile screen role, touch interaction, placement, or platform convention that is not obvious from the desktop component name.

## Mobile Group Taxonomy

- `mobile-app-shell`: status bar, app bar, safe area, bottom app bar, floating action placement.
- `mobile-navigation`: tab bar, bottom navigation, navigation drawer, segmented page tabs, back affordance.
- `mobile-overlays`: bottom sheet, action sheet, share sheet, full-screen dialog, permission prompt.
- `mobile-gestures`: pull-to-refresh, swipe action, drag handle, long press menu, pinch zoom, page indicator.
- `mobile-inputs`: OTP input, passcode keypad, wheel picker, mobile date/time picker, contact picker, address picker.
- `mobile-feeds`: feed card, story carousel, media viewer, comment composer, sticky composer.
- `mobile-commerce`: cart bar, product option sheet, checkout bottom bar, delivery tracker, map bottom panel.
- `mobile-onboarding`: onboarding pager, coach mark, permission education screen, setup checklist.

## Acceptance Rules

Add a mobile term when:

- It has a recognizable mobile placement, gesture, or app-screen role.
- A beginner would plausibly need the name to prompt an AI: "하단 탭바", "옆으로 밀어서 삭제", "인증번호 입력칸".
- It can be shown in a mini phone frame without relying on external screenshots.
- It is not merely a responsive version of an existing desktop component.

Prefer aliases or related notes when:

- The term is just a platform synonym for an existing entry.
- The only difference is visual styling.
- The behavior is identical and the mobile wording is better captured as a Korean alias.

## Candidate Batches

## Promoted In 2026-06-26 Step 1

- `safe-area`
- `mobile-status-bar`
- `mobile-app-bar`
- `large-title-header`
- `bottom-app-bar`
- `mobile-search-header`
- `mobile-segmented-tabs`

Not duplicated because existing entries already cover the core term:

- `bottom-navigation-bar` -> existing `bottom-navigation`
- `mobile-tab-bar` -> existing `tab-bar`
- `mobile-back-button` -> existing `back-button`
- `mobile-floating-action-button` -> existing `floating-action-button`

## Promoted In 2026-06-26 Step 2

- `standard-bottom-sheet`
- `modal-bottom-sheet`
- `action-sheet`
- `share-sheet`
- `full-screen-dialog`
- `permission-prompt`
- `permission-education-screen`
- `mobile-snackbar`
- `mobile-toast`
- `mobile-alert-dialog`
- `mobile-popover-menu`
- `sheet-drag-handle`

## Promoted In 2026-06-26 Step 3

- `pull-to-refresh-indicator`
- `swipe-to-delete`
- `swipe-action-row`
- `long-press-menu`
- `drag-to-reorder-list`
- `grab-handle`
- `page-control`
- `carousel-peek`
- `edge-swipe-back`
- `pinch-zoom-viewer`
- `scrim`
- `touch-ripple`

### Batch 1 — App Shell And Navigation

- `phone-frame`: generic mobile viewport frame for visual examples.
- `safe-area`: inset area reserved for notches, home indicator, and rounded screen edges.
- `mobile-status-bar`: top system status strip with time, signal, battery.
- `mobile-app-bar`: mobile top bar with title and navigation/action icons.
- `large-title-header`: iOS-style large title header that collapses on scroll.
- `bottom-app-bar`: bottom command bar with primary mobile actions.
- `mobile-tab-bar`: app-section tabs fixed at the bottom.
- `bottom-navigation-bar`: Material-style bottom navigation destinations.
- `mobile-back-button`: back affordance inside mobile navigation.
- `mobile-search-header`: search field embedded in the mobile header.
- `mobile-segmented-tabs`: top segmented page switcher for mobile content sections.
- `mobile-floating-action-button`: floating primary action anchored above bottom UI.

### Batch 2 — Overlays And System Feedback

- `standard-bottom-sheet`: lower sheet for secondary content.
- `modal-bottom-sheet`: blocking bottom sheet with scrim.
- `action-sheet`: mobile action list that rises from the bottom.
- `share-sheet`: share target/action panel.
- `full-screen-dialog`: modal task that takes the whole mobile screen.
- `permission-prompt`: system-like prompt asking for camera/location/notification permission.
- `permission-education-screen`: pre-permission explainer screen.
- `mobile-snackbar`: bottom feedback message above navigation.
- `mobile-toast`: brief floating status message.
- `mobile-alert-dialog`: compact blocking alert dialog.
- `mobile-popover-menu`: small contextual menu anchored to a mobile icon.
- `sheet-drag-handle`: grabber handle that signals a draggable sheet.

### Batch 3 — Gestures And Touch Affordances

- `pull-to-refresh-indicator`: refresh spinner revealed by downward pull.
- `swipe-to-delete`: list row delete action revealed by horizontal swipe.
- `swipe-action-row`: generic row with leading/trailing swipe commands.
- `long-press-menu`: contextual commands opened by long press.
- `drag-to-reorder-list`: list with touch drag reorder state.
- `grab-handle`: small handle that indicates drag or reorder.
- `page-control`: dots that show current page in a swipe pager.
- `carousel-peek`: horizontal cards with the next card partially visible.
- `edge-swipe-back`: visual cue for back navigation by edge gesture.
- `pinch-zoom-viewer`: media/map surface that supports pinch zoom.
- `scrim`: dimmed background behind a modal sheet/dialog.
- `touch-ripple`: touch feedback highlight on a tappable item.

### Batch 4 — Inputs, Pickers, And Auth

- `otp-code-input`: separated code boxes for SMS/email verification.
- `passcode-keypad`: numeric keypad for PIN entry.
- `biometric-prompt`: Face ID/fingerprint confirmation prompt.
- `mobile-date-picker`: calendar/date selector optimized for phones.
- `wheel-picker`: iOS-style spinning value picker.
- `time-wheel-picker`: wheel-based time selector.
- `mobile-search-sheet`: full-screen or sheet search surface.
- `chip-input-mobile`: token/chip entry optimized for small screens.
- `contact-picker`: select a person/contact from the device-like list.
- `address-autocomplete`: mobile address search and suggestion picker.
- `voice-input-button`: microphone affordance beside a mobile input.
- `clear-text-button`: inline clear affordance inside a mobile text field.

### Batch 5 — Feeds, Commerce, Maps, And Onboarding

- `feed-card-mobile`: vertically stacked content card in a feed.
- `story-rail`: horizontal circular story/avatar rail.
- `story-viewer`: full-screen tappable story surface.
- `media-lightbox-mobile`: full-screen image/video viewer.
- `comment-composer`: sticky mobile comment input.
- `bottom-cta-bar`: sticky bottom call-to-action bar.
- `product-option-sheet`: variant/quantity selector sheet for commerce.
- `cart-summary-bar`: compact cart total and checkout action at bottom.
- `checkout-progress-header`: mobile checkout step progress in the header.
- `delivery-tracker`: mobile order/delivery status timeline.
- `map-bottom-panel`: map screen with draggable information panel.
- `location-permission-empty`: empty state asking for location access.
- `onboarding-pager`: swipeable onboarding screens with dots.
- `coach-mark`: highlighted hint pointing to one UI element.
- `mobile-empty-feed`: feed-specific empty state with starter action.

## Search Fixture Additions

| Query | Expected top ids |
| --- | --- |
| `하단 탭` | `mobile-tab-bar`, `bottom-navigation-bar`, `tab-bar` |
| `아래에서 올라오는 창` | `standard-bottom-sheet`, `modal-bottom-sheet`, `mobile-bottom-sheet` |
| `옆으로 밀어서 삭제` | `swipe-to-delete`, `swipe-action-row`, `swipe-action` |
| `끌어내려 새로고침` | `pull-to-refresh-indicator`, `pull-to-refresh` |
| `인증번호 입력` | `otp-code-input`, `passcode-keypad` |
| `권한 요청 화면` | `permission-prompt`, `permission-education-screen`, `permission-state` |
| `지도 아래 패널` | `map-bottom-panel`, `mobile-bottom-sheet` |
| `스토리 넘기는 화면` | `story-viewer`, `story-rail`, `carousel` |
| `상품 옵션 아래에서 선택` | `product-option-sheet`, `standard-bottom-sheet`, `quantity-stepper` |
| `고정된 하단 결제 버튼` | `bottom-cta-bar`, `cart-summary-bar`, `sticky-footer-bar` |

## Visual Direction

- Most terms should render inside a consistent phone frame.
- Gesture terms should show both default and revealed state where possible.
- Overlay terms should show the anchor screen, scrim, and sheet/dialog layer.
- Input/auth terms should be interactive when small state changes are useful: typed OTP digit, selected wheel row, toggled biometric prompt.
- Commerce/feed terms should keep text short and rely on placement, hierarchy, and affordance shape.
