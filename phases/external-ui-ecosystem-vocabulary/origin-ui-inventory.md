# Origin UI / coss ui Source Inventory

## Sources Checked

- `https://coss.com/ui`
  - coss ui is the active successor surface.
  - It lists 50+ primitives and 492 particles.
  - It is built on Base UI and Tailwind CSS.
- `https://coss.com/ui/docs/roadmap`
  - Confirms Origin UI evolved into coss ui.
  - Existing Origin UI components are expected to evolve into particles.
  - Original Origin UI remains available during the transition.
- `https://coss.com/origin`
  - Legacy Origin UI collection.
  - It lists broad category buckets and component counts.

## Source Sections

### Active coss ui primitives

Mostly duplicates or near-duplicates of existing vocabulary:

- Accordion
- Alert
- Alert Dialog
- Autocomplete
- Avatar
- Badge
- Breadcrumb
- Button
- Calendar
- Card
- Checkbox
- Checkbox Group
- Collapsible
- Combobox
- Command
- Context Menu
- Date Picker
- Dialog
- Drawer
- Empty
- Field
- Fieldset
- Form
- Frame
- Group
- Input
- Input Group
- Kbd
- Label
- Menu
- Meter
- Number Field
- OTP Field
- Pagination
- Popover
- Preview Card
- Progress
- Radio Group
- Scroll Area
- Select
- Separator
- Sheet
- Skeleton
- Slider
- Spinner
- Switch
- Table
- Tabs
- Textarea
- Toast
- Toggle
- Toggle Group
- Toolbar
- Tooltip

### Legacy Origin category buckets

Useful because the category pages contain many concrete particle variants:

- Accordion: 20 components
- Alert: 12 components
- Avatar: 23 components
- Badge: 13 components
- Banner: 12 components
- Breadcrumb: 8 components
- Button: 54 components
- Calendar & Date picker: 28 components
- Checkbox: 20 components
- Image Cropper: 11 components
- Dialog: 21 components
- Dropdown: 15 components
- File upload: 14 components
- Event calendar: 1 component
- Input: 59 components
- Navbar: 20 components
- Notification: 22 components
- Pagination: 12 components
- Popover: 9 components
- Radio: 20 components
- Select: 51 components
- Slider: 27 components
- Stepper: 17 components
- Switch: 17 components
- Table: 20 components
- Tabs: 20 components
- Textarea: 19 components
- Timeline: 12 components
- Tooltip: 12 components
- Tree: 15 components

## Duplicate Prefilter

Do not promote as new terms because they already exist or are better handled as aliases/related notes:

- Base controls: button, input, textarea, checkbox, radio, switch, select, slider, tabs, table, tooltip.
- Common overlays: dialog, drawer, popover, alert dialog, context menu, dropdown.
- Already covered shadcn gap entries: field group, input group, scroll area, kbd, hover/preview card equivalent.
- Already covered patterns: date picker, date range picker, time picker, file upload, upload dropzone, attachment list, image cropper, event calendar, timeline, tree view.

## Step 1 Candidate Queue: Form/Input/Field Composition

These are candidate concepts to inspect at component-example level before promotion:

1. Floating label input
2. Prefix input
3. Suffix input
4. Inline submit input
5. Input with leading icon
6. Input with trailing action
7. Password reveal input
8. Copyable input
9. Currency input
10. Unit input
11. Search input with keyboard shortcut
12. Search input with clear action
13. Inline validation input
14. Fieldset group
15. Grouped checkbox list
16. Segmented OTP field
17. Stepper number field
18. Scrubbable number field
19. Multi-date picker
20. Date picker with presets

Expected duplicate handling:

- If an item is only a decoration of `text-field`, add aliases or related examples instead of a new term.
- Promote only when the structure changes user behavior, composition, or prompt usefulness.

## Step 2 Candidate Direction

Focus navigation/disclosure examples from Navbar, Dropdown, Popover, Breadcrumb, Tree, Tabs, Pagination, and Command/Menu equivalents.

## Step 3 Candidate Direction

Focus data/feedback/layout examples from Banner, Notification, Table, Timeline, Avatar, Badge, Frame, Group, Meter, Progress, Empty, and Toast equivalents.
