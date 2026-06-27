import { useState, type ReactNode } from "react"
import {
  AlertTriangle,
  Bell,
  Bold,
  BookOpen,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Circle,
  Clock,
  Copy,
  Download,
  EyeOff,
  FileUp,
  Folder,
  Heart,
  Home,
  Image as ImageIcon,
  Info,
  Link as LinkIcon,
  LoaderCircle,
  MapPin,
  Menu,
  Mic,
  MoreHorizontal,
  Palette,
  Play,
  Plus,
  Search,
  Settings,
  Share2,
  Star,
  Type,
  Trash2,
  User,
  X,
} from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

type TermVisualProps = {
  variant: string
  label: string
  size?: "card" | "detail" | "poster"
}

export function TermVisual({ variant, label, size = "card" }: TermVisualProps) {
  const canvasClass = cn(
    "flex w-full items-center justify-center rounded-md border bg-muted/40 p-3",
    size === "detail" ? "min-h-56" : size === "poster" ? "h-24 p-1" : "min-h-28"
  )
  const visualClass = size === "detail" ? "scale-125" : size === "poster" ? "scale-75" : ""

  return (
    <div className={canvasClass} onClick={(event) => event.stopPropagation()} onKeyDown={(event) => event.stopPropagation()}>
      <div className={cn("origin-center", visualClass)}>{renderVisual(variant, label)}</div>
    </div>
  )
}

function renderVisual(variant: string, label: string) {
  if (variant === "text-field") return <TextField />
  if (variant === "search-field") return <SearchField />
  if (variant === "textarea") return <TextareaVisual />
  if (variant === "select") return <SelectVisual />
  if (variant === "combobox") return <ComboBox />
  if (variant === "checkbox") return <CheckboxVisual />
  if (variant === "radio-group") return <RadioGroupVisual />
  if (variant === "switch") return <SwitchVisual />
  if (variant === "slider") return <SliderVisual />
  if (variant === "date-picker") return <DatePicker />
  if (variant === "file-upload") return <FileUpload />
  if (variant === "tabs") return <TabsVisual />
  if (variant === "segmented-control") return <SegmentedControl />
  if (variant === "dropdown-menu") return <DropdownMenuVisual />
  if (variant === "command-palette") return <CommandPalette />
  if (variant === "breadcrumb") return <BreadcrumbVisual />
  if (variant === "pagination") return <PaginationVisual />
  if (variant === "stepper") return <StepperVisual />
  if (variant === "navigation-rail") return <NavigationRail />
  if (variant === "sidebar-nav") return <SidebarNav />
  if (variant === "chip") return <ChipVisual />
  if (variant === "button") return <ButtonVisual label={label} />
  if (variant === "primary-button") return <ButtonVisual label={label} emphasis="primary" />
  if (variant === "secondary-button") return <ButtonVisual label={label} emphasis="secondary" />
  if (variant === "destructive-button") return <ButtonVisual label={label} emphasis="destructive" />
  if (variant === "icon-button") return <IconButtonVisual />
  if (variant === "floating-action-button") return <FabVisual />
  if (variant === "link") return <LinkVisual />
  if (variant === "toolbar") return <ToolbarVisual />
  if (variant === "split-button") return <SplitButton />
  if (variant === "menu-item") return <MenuItemVisual />
  if (variant === "card") return <CardVisual />
  if (variant === "dialog") return <DialogVisual />
  if (variant === "drawer") return <DrawerVisual />
  if (variant === "popover") return <PopoverVisual />
  if (variant === "header") return <HeaderVisual />
  if (variant === "footer") return <FooterVisual />
  if (variant === "grid") return <GridVisual />
  if (variant === "list") return <ListVisual />
  if (variant === "accordion") return <AccordionVisual />
  if (variant === "carousel") return <CarouselVisual />
  if (variant === "tooltip") return <TooltipVisual />
  if (variant === "toast") return <ToastVisual />
  if (variant === "alert") return <AlertVisual />
  if (variant === "badge") return <BadgeVisual />
  if (variant === "progress-bar") return <ProgressBarVisual />
  if (variant === "spinner") return <SpinnerVisual />
  if (variant === "skeleton") return <SkeletonVisual />
  if (variant === "empty-state") return <EmptyStateVisual />
  if (variant === "validation-message") return <ValidationMessage />
  if (variant === "status-indicator") return <StatusIndicator />
  if (variant === "table") return <TableVisual />
  if (variant === "avatar") return <AvatarVisual />
  if (variant === "metric-card") return <MetricCardVisual />
  if (variant === "chart") return <ChartVisual />
  if (variant === "timeline") return <TimelineVisual />
  if (variant === "kanban") return <KanbanVisual />
  if (variant === "calendar-view") return <CalendarView />
  if (variant === "tree-view") return <TreeView />
  if (variant === "description-list") return <DescriptionList />
  if (variant === "icon") return <IconVisual />
  if (variant === "label") return <LabelVisual />
  if (variant === "divider") return <DividerVisual />
  if (variant === "spacer") return <SpacerVisual />
  if (variant === "typography") return <TypographyVisual />
  if (variant === "image") return <ImageVisual />
  if (variant === "logo") return <LogoVisual />
  if (variant === "thumbnail") return <ThumbnailVisual />
  if (variant === "password-field") return <PasswordField />
  if (variant === "number-input") return <NumberInput />
  if (variant === "otp-input") return <OtpInput />
  if (variant === "autocomplete") return <AutocompleteVisual />
  if (variant === "search-suggestions") return <SearchSuggestions />
  if (variant === "inline-edit") return <InlineEditVisual />
  if (variant === "rich-text-editor") return <RichTextEditor />
  if (variant === "color-picker") return <ColorPicker />
  if (variant === "listbox") return <ListboxVisual />
  if (variant === "menu-bar") return <MenuBarVisual />
  if (variant === "bottom-navigation") return <BottomNavigation />
  if (variant === "tab-bar") return <BottomNavigation />
  if (variant === "filter-chip") return <FilterChip />
  if (variant === "toggle-button") return <ToggleButtonVisual />
  if (variant === "disclosure") return <DisclosureVisual />
  if (variant === "anchor-nav") return <AnchorNav />
  if (variant === "back-button") return <BackButtonVisual />
  if (variant === "navigation-bar") return <NavigationBarVisual />
  if (variant === "button-group") return <ButtonGroupVisual />
  if (variant === "copy-button") return <ActionIconButton icon={<Copy aria-hidden="true" />} label="복사" />
  if (variant === "download-button") return <ActionIconButton icon={<Download aria-hidden="true" />} label="PDF" />
  if (variant === "share-button") return <ActionIconButton icon={<Share2 aria-hidden="true" />} label="공유" />
  if (variant === "close-button") return <ActionIconButton icon={<X aria-hidden="true" />} label="닫기" />
  if (variant === "overflow-button") return <ActionIconButton icon={<MoreHorizontal aria-hidden="true" />} label="더보기" />
  if (variant === "top-app-bar") return <TopAppBar />
  if (variant === "section") return <SectionVisual />
  if (variant === "container") return <ContainerVisual />
  if (variant === "hero") return <HeroVisual />
  if (variant === "filter-bar") return <FilterBarVisual />
  if (variant === "sort-control") return <SortControl />
  if (variant === "data-grid") return <DataGridVisual />
  if (variant === "legend") return <LegendVisual />
  if (variant === "chart-axis") return <ChartAxisVisual />
  if (variant === "textarea-autosize") return <TextareaAutosizeVisual />
  if (variant === "input-group") return <InputGroupVisual />
  if (variant === "date-range-picker") return <DateRangePickerVisual />
  if (variant === "time-picker") return <TimePickerVisual />
  if (variant === "rating-input") return <RatingInputVisual />
  if (variant === "tag-input") return <TagInputVisual />
  if (variant === "masked-input") return <MaskedInputVisual />
  if (variant === "toggle-group") return <ToggleGroupVisual />
  if (variant === "navigation-drawer") return <NavigationDrawerVisual />
  if (variant === "mega-menu") return <MegaMenuVisual />
  if (variant === "context-menu") return <ContextMenuVisual />
  if (variant === "loading-button") return <LoadingButtonVisual />
  if (variant === "copy-field") return <CopyFieldVisual />
  if (variant === "bulk-action-bar") return <BulkActionBarVisual />
  if (variant === "speed-dial") return <SpeedDialVisual />
  if (variant === "app-shell") return <AppShellVisual />
  if (variant === "split-pane") return <SplitPaneVisual />
  if (variant === "snackbar") return <SnackbarVisual />
  if (variant === "undo-toast") return <UndoToastVisual />
  if (variant === "row-selection") return <RowSelectionVisual />
  if (variant === "search-view") return <SearchViewVisual />
  if (variant === "tree-navigation") return <TreeNavigationVisual />
  if (variant === "side-sheet") return <SideSheetVisual />
  if (variant === "breadcrumbs-menu") return <BreadcrumbsMenuVisual />
  if (variant === "icon-toggle-button") return <IconToggleButtonVisual />
  if (variant === "resizable-panel") return <ResizablePanelVisual />
  if (variant === "master-detail") return <MasterDetailVisual />
  if (variant === "sticky-header") return <StickyHeaderVisual />
  if (variant === "sticky-footer-bar") return <StickyFooterBarVisual />
  if (variant === "sidebar-section") return <SidebarSectionVisual />
  if (variant === "inline-alert") return <InlineAlertVisual />
  if (variant === "error-boundary") return <ErrorBoundaryVisual />
  if (variant === "confirmation-dialog") return <ConfirmationDialogVisual />
  if (variant === "rate-limit-state") return <RateLimitStateVisual />
  if (variant === "data-table-toolbar") return <DataTableToolbarVisual />
  if (variant === "column-header-menu") return <ColumnHeaderMenuVisual />
  if (variant === "faceted-filter") return <FacetedFilterVisual />
  if (variant === "stat-list") return <StatListVisual />
  if (variant === "activity-feed") return <ActivityFeedVisual />
  if (variant === "map-marker") return <MapMarkerVisual />
  if (variant === "scrubber") return <ScrubberVisual />
  if (variant === "range-slider") return <RangeSliderVisual />
  if (variant === "multi-select") return <MultiSelectVisual />
  if (variant === "transfer-list") return <TransferListVisual />
  if (variant === "virtualized-list") return <VirtualizedListVisual />
  if (variant === "infinite-scroll") return <InfiniteScrollVisual />
  if (variant === "pull-to-refresh") return <PullToRefreshVisual />
  if (variant === "swipe-action") return <SwipeActionVisual />
  if (variant === "wizard") return <WizardVisual />
  if (variant === "toast-stack") return <ToastStackVisual />
  if (variant === "skeleton-table") return <SkeletonTableVisual />
  if (variant === "empty-table") return <EmptyTableVisual />
  if (variant === "table-density-control") return <TableDensityControlVisual />
  if (variant === "column-visibility-menu") return <ColumnVisibilityMenuVisual />
  if (variant === "saved-view-tabs") return <SavedViewTabsVisual />
  if (variant === "filter-panel") return <FilterPanelVisual />
  if (variant === "advanced-filter-builder") return <AdvancedFilterBuilderVisual />
  if (variant === "query-builder") return <QueryBuilderVisual />
  if (variant === "grouped-list") return <GroupedListVisual />
  if (variant === "nested-list") return <NestedListVisual />
  if (variant === "draggable-list") return <DraggableListVisual />
  if (variant === "reorder-handle") return <ReorderHandleVisual />
  if (variant === "selection-summary") return <SelectionSummaryVisual />
  if (variant === "comparison-table") return <ComparisonTableVisual />
  if (variant === "pivot-table") return <PivotTableVisual />
  if (variant === "tree-table") return <TreeTableVisual />
  if (variant === "expandable-row") return <ExpandableRowVisual />
  if (variant === "detail-row") return <DetailRowVisual />
  if (variant === "audit-log") return <AuditLogVisual />
  if (variant === "workspace-switcher") return <WorkspaceSwitcherVisual />
  if (variant === "account-switcher") return <AccountSwitcherVisual />
  if (variant === "global-header") return <GlobalHeaderVisual />
  if (variant === "utility-bar") return <UtilityBarVisual />
  if (variant === "command-bar") return <CommandBarVisual />
  if (variant === "status-bar") return <StatusBarVisual />
  if (variant === "breadcrumb-header") return <BreadcrumbHeaderVisual />
  if (variant === "page-title-bar") return <PageTitleBarVisual />
  if (variant === "content-tabs") return <ContentTabsVisual />
  if (variant === "right-rail") return <RightRailVisual />
  if (variant === "inspector-panel") return <InspectorPanelVisual />
  if (variant === "properties-panel") return <PropertiesPanelVisual />
  if (variant === "preview-pane") return <PreviewPaneVisual />
  if (variant === "canvas-toolbar") return <CanvasToolbarVisual />
  if (variant === "floating-panel") return <FloatingPanelVisual />
  if (variant === "dockable-panel") return <DockablePanelVisual />
  if (variant === "collapsible-sidebar") return <CollapsibleSidebarVisual />
  if (variant === "mini-sidebar") return <MiniSidebarVisual />
  if (variant === "responsive-stack") return <ResponsiveStackVisual />
  if (variant === "safe-area") return <SafeAreaVisual />
  if (variant === "mobile-status-bar") return <MobileStatusBarVisual />
  if (variant === "mobile-app-bar") return <MobileAppBarVisual />
  if (variant === "large-title-header") return <LargeTitleHeaderVisual />
  if (variant === "bottom-app-bar") return <BottomAppBarVisual />
  if (variant === "mobile-search-header") return <MobileSearchHeaderVisual />
  if (variant === "mobile-segmented-tabs") return <MobileSegmentedTabsVisual />
  if (variant === "standard-bottom-sheet") return <StandardBottomSheetVisual />
  if (variant === "modal-bottom-sheet") return <ModalBottomSheetVisual />
  if (variant === "action-sheet") return <ActionSheetVisual />
  if (variant === "share-sheet") return <ShareSheetVisual />
  if (variant === "full-screen-dialog") return <FullScreenDialogVisual />
  if (variant === "permission-prompt") return <PermissionPromptMobileVisual />
  if (variant === "permission-education-screen") return <PermissionEducationScreenVisual />
  if (variant === "mobile-snackbar") return <MobileSnackbarVisual />
  if (variant === "mobile-toast") return <MobileToastVisual />
  if (variant === "mobile-alert-dialog") return <MobileAlertDialogVisual />
  if (variant === "mobile-popover-menu") return <MobilePopoverMenuVisual />
  if (variant === "sheet-drag-handle") return <SheetDragHandleVisual />
  if (variant === "pull-to-refresh-indicator") return <PullToRefreshIndicatorVisual />
  if (variant === "swipe-to-delete") return <SwipeToDeleteVisual />
  if (variant === "swipe-action-row") return <SwipeActionRowVisual />
  if (variant === "long-press-menu") return <LongPressMenuVisual />
  if (variant === "drag-to-reorder-list") return <DragToReorderListVisual />
  if (variant === "grab-handle") return <GrabHandleVisual />
  if (variant === "page-control") return <PageControlVisual />
  if (variant === "carousel-peek") return <CarouselPeekVisual />
  if (variant === "edge-swipe-back") return <EdgeSwipeBackVisual />
  if (variant === "pinch-zoom-viewer") return <PinchZoomViewerVisual />
  if (variant === "scrim") return <ScrimVisual />
  if (variant === "touch-ripple") return <TouchRippleVisual />
  if (variant === "otp-code-input") return <OtpCodeInputVisual />
  if (variant === "passcode-keypad") return <PasscodeKeypadVisual />
  if (variant === "biometric-prompt") return <BiometricPromptVisual />
  if (variant === "mobile-date-picker") return <MobileDatePickerVisual />
  if (variant === "wheel-picker") return <WheelPickerVisual />
  if (variant === "time-wheel-picker") return <TimeWheelPickerVisual />
  if (variant === "mobile-search-sheet") return <MobileSearchSheetVisual />
  if (variant === "chip-input-mobile") return <ChipInputMobileVisual />
  if (variant === "contact-picker") return <ContactPickerVisual />
  if (variant === "address-autocomplete") return <AddressAutocompleteVisual />
  if (variant === "voice-input-button") return <VoiceInputButtonVisual />
  if (variant === "clear-text-button") return <ClearTextButtonVisual />
  if (variant === "feed-card-mobile") return <FeedCardMobileVisual />
  if (variant === "story-rail") return <StoryRailVisual />
  if (variant === "story-viewer") return <StoryViewerVisual />
  if (variant === "media-lightbox-mobile") return <MediaLightboxMobileVisual />
  if (variant === "comment-composer") return <CommentComposerVisual />
  if (variant === "bottom-cta-bar") return <BottomCtaBarVisual />
  if (variant === "product-option-sheet") return <ProductOptionSheetVisual />
  if (variant === "cart-summary-bar") return <CartSummaryBarVisual />
  if (variant === "checkout-progress-header") return <CheckoutProgressHeaderVisual />
  if (variant === "delivery-tracker") return <DeliveryTrackerVisual />
  if (variant === "map-bottom-panel") return <MapBottomPanelVisual />
  if (variant === "location-permission-empty") return <LocationPermissionEmptyVisual />
  if (variant === "onboarding-pager") return <OnboardingPagerVisual />
  if (variant === "coach-mark") return <CoachMarkVisual />
  if (variant === "mobile-empty-feed") return <MobileEmptyFeedVisual />
  if (variant === "mobile-bottom-sheet") return <MobileBottomSheetVisual />
  if (variant === "mobile-filter-bottom-sheet") return <MobileFilterBottomSheetVisual />
  if (variant === "inline-date-range-chip") return <InlineDateRangeChipVisual />
  if (variant === "floating-search-button") return <FloatingSearchButtonVisual />
  if (variant === "avatar-group") return <AvatarGroupVisual />
  if (variant === "info-label") return <InfoLabelVisual />
  if (variant === "message-bar") return <MessageBarVisual />
  if (variant === "spin-button") return <SpinButtonVisual />
  if (variant === "scope-bar") return <ScopeBarVisual />
  if (variant === "structured-list") return <StructuredListVisual />
  if (variant === "inline-loading") return <InlineLoadingVisual />
  if (variant === "tag-picker") return <TagPickerVisual />
  if (variant === "disclosure-group") return <DisclosureGroupVisual />
  if (variant === "contained-list") return <ContainedListVisual />
  if (variant === "page-layout") return <PageLayoutVisual />
  if (variant === "dashboard-grid") return <DashboardGridVisual />
  if (variant === "permission-state") return <PermissionStateVisual />
  if (variant === "locked-state") return <LockedStateVisual />
  if (variant === "offline-state") return <OfflineStateVisual />
  if (variant === "maintenance-state") return <MaintenanceStateVisual />
  if (variant === "syncing-state") return <SyncingStateVisual />
  if (variant === "saving-indicator") return <SavingIndicatorVisual />
  if (variant === "unsaved-changes-banner") return <UnsavedChangesBannerVisual />
  if (variant === "session-expired-dialog") return <SessionExpiredDialogVisual />
  if (variant === "upgrade-prompt") return <UpgradePromptVisual />
  if (variant === "quota-warning") return <QuotaWarningVisual />
  if (variant === "trial-banner") return <TrialBannerVisual />
  if (variant === "destructive-confirmation") return <DestructiveConfirmationVisual />
  if (variant === "success-toast") return <SuccessToastVisual />
  if (variant === "error-toast") return <ErrorToastVisual />
  if (variant === "notification-center") return <NotificationCenterVisual />
  if (variant === "notification-list") return <NotificationListVisual />
  if (variant === "status-chip") return <StatusChipVisual />
  if (variant === "health-indicator") return <HealthIndicatorVisual />
  if (variant === "connection-status") return <ConnectionStatusVisual />
  if (variant === "retry-panel") return <RetryPanelVisual />
  if (variant === "media-card") return <MediaCardVisual />
  if (variant === "video-player-controls") return <VideoPlayerControlsVisual />
  if (variant === "audio-player-controls") return <AudioPlayerControlsVisual />
  if (variant === "image-gallery") return <ImageGalleryVisual />
  if (variant === "lightbox") return <LightboxVisual />
  if (variant === "cropper") return <CropperVisual />
  if (variant === "upload-dropzone") return <UploadDropzoneVisual />
  if (variant === "attachment-list") return <AttachmentListVisual />
  if (variant === "file-card") return <FileCardVisual />
  if (variant === "product-card") return <ProductCardVisual />
  if (variant === "price-card") return <PriceCardVisual />
  if (variant === "plan-card") return <PlanCardVisual />
  if (variant === "feature-comparison") return <FeatureComparisonVisual />
  if (variant === "coupon-field") return <CouponFieldVisual />
  if (variant === "quantity-stepper") return <QuantityStepperVisual />
  if (variant === "cart-summary") return <CartSummaryVisual />
  if (variant === "checkout-step") return <CheckoutStepVisual />
  if (variant === "payment-method-card") return <PaymentMethodCardVisual />
  if (variant === "address-card") return <AddressCardVisual />
  if (variant === "order-status") return <OrderStatusVisual />
  if (variant === "calendar-event-card") return <CalendarEventCardVisual />
  if (variant === "kanban-card") return <KanbanCardVisual />
  if (variant === "board-column") return <BoardColumnVisual />
  if (variant === "empty-search-result") return <EmptySearchResultVisual />
  if (variant === "onboarding-checklist") return <OnboardingChecklistVisual />
  if (variant === "setup-progress") return <SetupProgressVisual />
  if (variant === "help-center-card") return <HelpCenterCardVisual />
  if (variant === "faq-list") return <FaqListVisual />
  if (variant === "announcement-banner") return <AnnouncementBannerVisual />
  if (variant === "release-note-card") return <ReleaseNoteCardVisual />
  if (variant === "profile-card") return <ProfileCardVisual />
  if (variant === "team-member-row") return <TeamMemberRowVisual />
  if (variant === "role-badge") return <RoleBadgeVisual />
  if (variant === "api-key-field") return <ApiKeyFieldVisual />
  if (variant === "webhook-endpoint-row") return <WebhookEndpointRowVisual />
  if (variant === "integration-card") return <IntegrationCardVisual />
  if (variant === "connection-card") return <ConnectionCardVisual />
  if (variant === "billing-summary") return <BillingSummaryVisual />
  if (variant === "invoice-row") return <InvoiceRowVisual />
  if (variant === "version-history-list") return <VersionHistoryListVisual />
  if (variant === "email-verification-banner") return <AccountFlowVisual kind="email-banner" />
  if (variant === "verification-required-screen") return <AccountFlowVisual kind="verify-gate" />
  if (variant === "magic-link-sent-state") return <AccountFlowVisual kind="magic-link" />
  if (variant === "passkey-enrollment-prompt") return <AccountFlowVisual kind="passkey-enroll" />
  if (variant === "passkey-sign-in-sheet") return <AccountFlowVisual kind="passkey-sheet" />
  if (variant === "mfa-enrollment-card") return <AccountFlowVisual kind="mfa-card" />
  if (variant === "recovery-code-panel") return <AccountFlowVisual kind="recovery-codes" />
  if (variant === "recovery-code-warning") return <AccountFlowVisual kind="recovery-warning" />
  if (variant === "trusted-device-prompt") return <AccountFlowVisual kind="trusted-device" />
  if (variant === "device-approval-state") return <AccountFlowVisual kind="device-approval" />
  if (variant === "access-request-panel") return <AccountFlowVisual kind="access-request" />
  if (variant === "access-pending-state") return <AccountFlowVisual kind="access-pending" />
  if (variant === "invite-acceptance-screen") return <AccountFlowVisual kind="invite-accept" />
  if (variant === "invite-expired-state") return <AccountFlowVisual kind="invite-expired" />
  if (variant === "workspace-join-request") return <AccountFlowVisual kind="workspace-join" />
  if (variant === "welcome-choice-screen") return <AccountFlowVisual kind="welcome-choice" />
  if (variant === "import-data-choice") return <AccountFlowVisual kind="import-choice" />
  if (variant === "setup-blocker-state") return <AccountFlowVisual kind="setup-blocker" />
  if (variant === "reconnect-account-state") return <AccountFlowVisual kind="reconnect" />
  if (variant === "consent-review-screen") return <AccountFlowVisual kind="consent-review" />
  if (variant === "aspect-ratio-box") return <ShadcnGapVisual kind="aspect-ratio" />
  if (variant === "hover-card") return <ShadcnGapVisual kind="hover-card" />
  if (variant === "scroll-area") return <ShadcnGapVisual kind="scroll-area" />
  if (variant === "native-select") return <ShadcnGapVisual kind="native-select" />
  if (variant === "keyboard-shortcut-key") return <ShadcnGapVisual kind="kbd" />
  if (variant === "navigation-menu") return <ShadcnGapVisual kind="navigation-menu" />
  if (variant === "field-group") return <ShadcnGapVisual kind="field-group" />
  if (variant === "item-row") return <ShadcnGapVisual kind="item-row" />
  if (variant === "sonner-toast") return <ShadcnGapVisual kind="sonner" />
  if (variant === "direction-provider") return <ShadcnGapVisual kind="direction-provider" />
  if (variant === "login-form") return <AuthPatternVisual kind="login-form" />
  if (variant === "signup-form") return <AuthPatternVisual kind="signup-form" />
  if (variant === "forgot-password-form") return <AuthPatternVisual kind="forgot-password-form" />
  if (variant === "reset-password-form") return <AuthPatternVisual kind="reset-password-form" />
  if (variant === "change-password-form") return <AuthPatternVisual kind="change-password-form" />
  if (variant === "magic-link-login-form") return <AuthPatternVisual kind="magic-link-login-form" />
  if (variant === "sso-login-form") return <AuthPatternVisual kind="sso-login-form" />
  if (variant === "social-login-button-group") return <AuthPatternVisual kind="social-login-button-group" />
  if (variant === "otp-challenge-form") return <AuthPatternVisual kind="otp-challenge-form" />
  if (variant === "mfa-challenge-form") return <AuthPatternVisual kind="mfa-challenge-form" />
  if (variant === "passkey-login-form") return <AuthPatternVisual kind="passkey-login-form" />
  if (variant === "invite-signup-form") return <AuthPatternVisual kind="invite-signup-form" />
  if (variant === "account-creation-form") return <AuthPatternVisual kind="account-creation-form" />
  if (variant === "email-change-form") return <AuthPatternVisual kind="email-change-form" />
  if (variant === "reauthentication-form") return <AuthPatternVisual kind="reauthentication-form" />
  if (variant === "auth-method-choice") return <AuthPatternVisual kind="auth-method-choice" />
  if (variant === "auth-card") return <AuthPatternVisual kind="auth-card" />
  if (variant === "login-page") return <AuthPatternVisual kind="login-page" />
  if (variant === "split-auth-layout") return <AuthPatternVisual kind="split-auth-layout" />
  if (variant === "login-dialog") return <AuthPatternVisual kind="login-dialog" />
  if (variant === "dashboard-overview-page") return <ShadcnBlockVisual kind="dashboard-overview-page" />
  if (variant === "sidebar-dashboard-layout") return <ShadcnBlockVisual kind="sidebar-dashboard-layout" />
  if (variant === "collapsible-sidebar-layout") return <ShadcnBlockVisual kind="collapsible-sidebar-layout" />
  if (variant === "icon-sidebar-layout") return <ShadcnBlockVisual kind="icon-sidebar-layout" />
  if (variant === "inset-sidebar-layout") return <ShadcnBlockVisual kind="inset-sidebar-layout" />
  if (variant === "right-sidebar-layout") return <ShadcnBlockVisual kind="right-sidebar-layout" />
  if (variant === "dual-sidebar-layout") return <ShadcnBlockVisual kind="dual-sidebar-layout" />
  if (variant === "file-tree-sidebar-layout") return <ShadcnBlockVisual kind="file-tree-sidebar-layout" />
  if (variant === "calendar-sidebar-layout") return <ShadcnBlockVisual kind="calendar-sidebar-layout" />
  if (variant === "sidebar-dialog-layout") return <ShadcnBlockVisual kind="sidebar-dialog-layout" />
  if (variant === "area-chart-card") return <ShadcnBlockVisual kind="area-chart-card" />
  if (variant === "bar-chart-card") return <ShadcnBlockVisual kind="bar-chart-card" />
  if (variant === "line-chart-card") return <ShadcnBlockVisual kind="line-chart-card" />
  if (variant === "pie-chart-card") return <ShadcnBlockVisual kind="pie-chart-card" />
  if (variant === "radar-chart-card") return <ShadcnBlockVisual kind="radar-chart-card" />
  if (variant === "radial-chart-card") return <ShadcnBlockVisual kind="radial-chart-card" />
  if (variant === "interactive-chart-card") return <ShadcnBlockVisual kind="interactive-chart-card" />
  if (variant === "stacked-chart-card") return <ShadcnBlockVisual kind="stacked-chart-card" />
  if (variant === "chart-tooltip-pattern") return <ShadcnBlockVisual kind="chart-tooltip-pattern" />
  if (variant === "chart-kpi-card") return <ShadcnBlockVisual kind="chart-kpi-card" />
  if (variant === "chat-message") return <ShadcnEcosystemVisual kind="chat-message" />
  if (variant === "chat-bubble") return <ShadcnEcosystemVisual kind="chat-bubble" />
  if (variant === "chat-attachment") return <ShadcnEcosystemVisual kind="chat-attachment" />
  if (variant === "conversation-marker") return <ShadcnEcosystemVisual kind="conversation-marker" />
  if (variant === "message-scroller") return <ShadcnEcosystemVisual kind="message-scroller" />
  if (variant === "react-hook-form-pattern") return <ShadcnEcosystemVisual kind="react-hook-form-pattern" />
  if (variant === "tanstack-form-pattern") return <ShadcnEcosystemVisual kind="tanstack-form-pattern" />
  if (variant === "formisch-form-pattern") return <ShadcnEcosystemVisual kind="formisch-form-pattern" />
  if (variant === "scroll-fade") return <ShadcnEcosystemVisual kind="scroll-fade" />
  if (variant === "shimmer-effect") return <ShadcnEcosystemVisual kind="shimmer-effect" />
  if (variant === "floating-label-field") return <OriginCossVisual kind="floating-label-field" />
  if (variant === "clearable-input") return <OriginCossVisual kind="clearable-input" />
  if (variant === "inline-submit-field") return <OriginCossVisual kind="inline-submit-field" />
  if (variant === "character-count-field") return <OriginCossVisual kind="character-count-field" />
  if (variant === "password-strength-meter") return <OriginCossVisual kind="password-strength-meter" />
  if (variant === "fieldset") return <OriginCossVisual kind="fieldset" />
  if (variant === "checkbox-card") return <OriginCossVisual kind="checkbox-card" />
  if (variant === "date-preset-picker") return <OriginCossVisual kind="date-preset-picker" />
  if (variant === "navbar-menu") return <OriginCossVisual kind="navbar-menu" />
  if (variant === "nav-user-menu") return <OriginCossVisual kind="nav-user-menu" />
  if (variant === "breadcrumb-overflow") return <OriginCossVisual kind="breadcrumb-overflow" />
  if (variant === "popover-form") return <OriginCossVisual kind="popover-form" />
  if (variant === "disclosure-card") return <OriginCossVisual kind="disclosure-card" />
  if (variant === "pagination-jump") return <OriginCossVisual kind="pagination-jump" />
  if (variant === "avatar-stack") return <OriginCossVisual kind="avatar-stack" />
  if (variant === "status-avatar") return <OriginCossVisual kind="status-avatar" />
  if (variant === "badge-group") return <OriginCossVisual kind="badge-group" />
  if (variant === "meter") return <OriginCossVisual kind="meter" />
  if (variant === "table-row-actions") return <OriginCossVisual kind="table-row-actions" />
  if (variant === "empty-filter-state") return <OriginCossVisual kind="empty-filter-state" />
  if (variant === "notification-inbox-row") return <OriginCossVisual kind="notification-inbox-row" />
  if (variant === "progress-stepper") return <OriginCossVisual kind="progress-stepper" />
  if (EXTERNAL_ECOSYSTEM_VARIANTS.has(variant)) return <ExternalEcosystemVisual kind={variant as ExternalEcosystemKind} />
  if (variant === "error-state") return <StateVisual tone="error" />
  if (variant === "success-state") return <StateVisual tone="success" />
  if (variant === "warning-state") return <StateVisual tone="warning" />
  if (variant === "info-state") return <StateVisual tone="info" />
  if (variant === "loading-state") return <LoadingStateVisual />
  return <FallbackVisual label={label} />
}

function Chrome({ children, className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("rounded-md border bg-card shadow-sm", className)} {...props}>{children}</div>
}

function Line({ className }: { className?: string }) {
  return <span className={cn("block h-2 rounded-full bg-muted-foreground/25", className)} />
}

function TextField() {
  const [value, setValue] = useState("입력값")

  return (
    <Chrome className="flex h-10 w-48 items-center px-3 text-sm">
      <input
        aria-label="텍스트 입력 예시"
        className="w-full bg-transparent outline-none"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
    </Chrome>
  )
}

function SearchField() {
  const [query, setQuery] = useState("검색어")

  return (
    <Chrome className="flex h-10 w-48 items-center gap-2 px-3 text-sm text-muted-foreground">
      <Search aria-hidden="true" />
      <input
        aria-label="검색어 입력 예시"
        className="min-w-0 flex-1 bg-transparent text-foreground outline-none"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      {query && (
        <button type="button" aria-label="검색어 지우기" onClick={() => setQuery("")}>
          <X aria-hidden="true" />
        </button>
      )}
    </Chrome>
  )
}

function TextareaVisual() {
  const [value, setValue] = useState("긴 글을 입력해보세요.")

  return (
    <Chrome className="h-24 w-48 p-2">
      <textarea
        aria-label="여러 줄 입력 예시"
        className="h-full w-full resize-none bg-transparent text-sm outline-none"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
    </Chrome>
  )
}

function SelectVisual() {
  const [selected, setSelected] = useState("옵션 A")
  const [open, setOpen] = useState(false)
  const options = ["옵션 A", "옵션 B", "옵션 C"]

  return (
    <Chrome className="relative w-48">
      <button
        type="button"
        className="flex h-10 w-full items-center justify-between px-3 text-sm"
        onClick={() => setOpen((value) => !value)}
      >
        <span>{selected}</span>
        <ChevronDown aria-hidden="true" />
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-11 z-10 rounded-md border bg-popover p-1 text-sm shadow-md">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              className={cn(
                "flex w-full items-center justify-between rounded px-2 py-1.5 text-left",
                option === selected && "bg-primary text-primary-foreground"
              )}
              onClick={() => {
                setSelected(option)
                setOpen(false)
              }}
            >
              {option}
              {option === selected && <Check aria-hidden="true" />}
            </button>
          ))}
        </div>
      )}
    </Chrome>
  )
}

function ComboBox() {
  const options = ["Combobox", "Command", "Search view"]
  const [query, setQuery] = useState("co")
  const [selected, setSelected] = useState("Combobox")
  const filteredOptions = options.filter((option) => option.toLowerCase().includes(query.toLowerCase()))

  return (
    <Chrome className="w-48 overflow-hidden">
      <div className="flex h-9 items-center gap-2 border-b px-3 text-sm">
        <Search aria-hidden="true" />
        <input
          aria-label="콤보박스 검색 예시"
          className="min-w-0 flex-1 bg-transparent outline-none"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      <div className="flex flex-col p-1 text-xs">
        {(filteredOptions.length ? filteredOptions : options).map((option) => (
          <button
            key={option}
            type="button"
            className={cn(
              "rounded px-2 py-1 text-left",
              selected === option ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            )}
            onClick={() => setSelected(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </Chrome>
  )
}

function CheckboxVisual() {
  const [checked, setChecked] = useState(true)

  return (
    <div className="flex items-center gap-3 text-sm">
      <Checkbox checked={checked} onCheckedChange={(value) => setChecked(value === true)} />
      <button type="button" className="text-left" onClick={() => setChecked((value) => !value)}>
        {checked ? "선택됨" : "선택 안 됨"}
      </button>
    </div>
  )
}

function RadioGroupVisual() {
  const [selected, setSelected] = useState("옵션 A")

  return (
    <div className="flex flex-col gap-2 text-sm">
      {["옵션 A", "옵션 B"].map((item) => (
        <button key={item} type="button" className="flex items-center gap-2 text-left" onClick={() => setSelected(item)}>
          <span className="flex size-4 items-center justify-center rounded-full border">
            {selected === item && <span className="size-2 rounded-full bg-primary" />}
          </span>
          {item}
        </button>
      ))}
    </div>
  )
}

function SwitchVisual() {
  const [checked, setChecked] = useState(true)

  return (
    <div className="flex items-center gap-3 text-sm">
      <Switch checked={checked} onCheckedChange={setChecked} />
      <span className="w-7 text-muted-foreground">{checked ? "ON" : "OFF"}</span>
    </div>
  )
}

function SliderVisual() {
  const [value, setValue] = useState([64])

  return (
    <div className="flex w-48 items-center gap-3">
      <Slider value={value} onValueChange={setValue} max={100} step={1} />
      <span className="w-8 text-right text-xs text-muted-foreground">{value[0]}</span>
    </div>
  )
}

function DatePicker() {
  const [selectedDay, setSelectedDay] = useState(11)

  return (
    <Chrome className="w-48 overflow-hidden">
      <div className="flex h-9 items-center justify-between border-b px-3 text-sm">
        <span>2026-05-{String(selectedDay).padStart(2, "0")}</span>
        <CalendarDays aria-hidden="true" />
      </div>
      <div className="grid grid-cols-7 gap-1 p-2 text-center text-[10px]">
        {Array.from({ length: 14 }).map((_, day) => (
          <button
            key={day}
            type="button"
            className={cn("rounded py-1", day + 1 === selectedDay && "bg-primary text-primary-foreground")}
            onClick={() => setSelectedDay(day + 1)}
          >
            {day + 1}
          </button>
        ))}
      </div>
    </Chrome>
  )
}

function FileUpload() {
  const [fileName, setFileName] = useState("파일 선택")

  return (
    <button
      type="button"
      className="flex w-48 items-center gap-2 rounded-md border border-dashed bg-card px-3 py-3 text-left text-sm shadow-sm"
      onClick={() => setFileName((current) => current === "파일 선택" ? "profile.png" : "파일 선택")}
    >
      <FileUp aria-hidden="true" />
      <span className="truncate">{fileName}</span>
    </button>
  )
}

function TabsVisual() {
  const [tab, setTab] = useState("one")

  return (
    <Chrome className="w-48 p-2">
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="grid w-full grid-cols-3 text-xs">
          <TabsTrigger value="one">탭 1</TabsTrigger>
          <TabsTrigger value="two">탭 2</TabsTrigger>
          <TabsTrigger value="three">탭 3</TabsTrigger>
        </TabsList>
        <TabsContent value="one"><Line className="mt-2 w-24" /></TabsContent>
        <TabsContent value="two"><Line className="mt-2 w-32" /></TabsContent>
        <TabsContent value="three"><Line className="mt-2 w-16" /></TabsContent>
      </Tabs>
    </Chrome>
  )
}

function SegmentedControl() {
  const [selected, setSelected] = useState("옵션2")

  return (
    <div className="grid w-48 grid-cols-3 rounded-md border bg-muted p-1 text-center text-xs">
      {["옵션1", "옵션2", "옵션3"].map((option) => (
        <button
          key={option}
          type="button"
          className={cn("rounded py-1", selected === option ? "bg-card shadow-sm" : "text-muted-foreground")}
          onClick={() => setSelected(option)}
        >
          {option}
        </button>
      ))}
    </div>
  )
}

function DropdownMenuVisual() {
  const [open, setOpen] = useState(true)
  const [selected, setSelected] = useState("최신순")

  return (
    <Chrome className="w-44 overflow-hidden">
      <button
        type="button"
        className="flex h-9 w-full items-center justify-between border-b px-3 text-sm"
        onClick={() => setOpen((value) => !value)}
      >
        <span>{selected}</span>
        <ChevronDown aria-hidden="true" />
      </button>
      {open && (
        <div className="flex flex-col p-1 text-xs">
          {["최신순", "인기순"].map((option) => (
            <button
              key={option}
              type="button"
              className={cn("rounded px-2 py-1 text-left", option === selected && "bg-muted")}
              onClick={() => setSelected(option)}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </Chrome>
  )
}

function CommandPalette() {
  const commands = ["새 문서 만들기", "설정 열기", "테마 변경"]
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState(commands[0])
  const visibleCommands = commands.filter((command) => command.includes(query))

  return (
    <Chrome className="w-52 p-2">
      <div className="flex h-8 items-center gap-2 rounded border px-2 text-xs">
        <Search aria-hidden="true" />
        <input
          aria-label="명령 검색 예시"
          className="min-w-0 flex-1 bg-transparent outline-none"
          placeholder="명령 검색..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      <div className="mt-2 flex flex-col gap-1 text-xs">
        {(visibleCommands.length ? visibleCommands : commands).map((command) => (
          <button
            key={command}
            type="button"
            className={cn(
              "rounded px-2 py-1 text-left",
              selected === command ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            )}
            onClick={() => setSelected(command)}
          >
            {command}
          </button>
        ))}
      </div>
    </Chrome>
  )
}

function BreadcrumbVisual() {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Home aria-hidden="true" />
      <span>홈</span>
      <ChevronRight aria-hidden="true" />
      <span>대시보드</span>
      <ChevronRight aria-hidden="true" />
      <span className="text-foreground">설정</span>
    </div>
  )
}

function PaginationVisual() {
  const [page, setPage] = useState(2)

  return (
    <div className="flex items-center gap-1">
      <SmallIcon onClick={() => setPage((current) => Math.max(1, current - 1))}><ChevronLeft aria-hidden="true" /></SmallIcon>
      {[1, 2, 3].map((item) => (
        <SmallBox key={item} active={page === item} onClick={() => setPage(item)}>{item}</SmallBox>
      ))}
      <SmallIcon onClick={() => setPage((current) => Math.min(3, current + 1))}><ChevronRight aria-hidden="true" /></SmallIcon>
    </div>
  )
}

function SmallBox({ children, active, onClick }: { children: React.ReactNode; active?: boolean; onClick?: () => void }) {
  return <button type="button" className={cn("flex size-7 items-center justify-center rounded border text-xs", active && "bg-primary text-primary-foreground")} onClick={onClick}>{children}</button>
}

function SmallIcon({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return <button type="button" className="flex size-7 items-center justify-center rounded border bg-card" onClick={onClick}>{children}</button>
}

function StepperVisual() {
  const [currentStep, setCurrentStep] = useState(2)

  return (
    <div className="flex items-center">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <button
            type="button"
            className={cn("flex size-7 items-center justify-center rounded-full border text-xs", step <= currentStep && "bg-primary text-primary-foreground")}
            onClick={() => setCurrentStep(step)}
          >
            {step}
          </button>
          {step < 3 && <span className="h-px w-10 bg-border" />}
        </div>
      ))}
    </div>
  )
}

function NavigationRail() {
  const [active, setActive] = useState("검색")
  const items = [
    { label: "홈", icon: <Home aria-hidden="true" /> },
    { label: "검색", icon: <Search aria-hidden="true" /> },
    { label: "설정", icon: <Settings aria-hidden="true" /> },
  ]

  return (
    <Chrome className="flex h-28 w-14 flex-col items-center justify-around py-2">
      {items.map((item) => (
        <button
          key={item.label}
          type="button"
          aria-label={item.label}
          className={cn("rounded p-1", active === item.label && "bg-primary text-primary-foreground")}
          onClick={() => setActive(item.label)}
        >
          {item.icon}
        </button>
      ))}
    </Chrome>
  )
}

function SidebarNav() {
  const [active, setActive] = useState("용어")

  return (
    <Chrome className="w-44 p-2 text-sm">
      <Row active={active === "홈"} icon={<Home aria-hidden="true" />} text="홈" onClick={() => setActive("홈")} />
      <Row active={active === "용어"} icon={<Search aria-hidden="true" />} text="용어" onClick={() => setActive("용어")} />
      <Row active={active === "설정"} icon={<Settings aria-hidden="true" />} text="설정" onClick={() => setActive("설정")} />
    </Chrome>
  )
}

function Row({ icon, text, active, onClick }: { icon: React.ReactNode; text: string; active?: boolean; onClick?: () => void }) {
  return <button type="button" className={cn("flex w-full items-center gap-2 rounded px-2 py-1.5 text-left", active && "bg-primary text-primary-foreground")} onClick={onClick}>{icon}<span>{text}</span></button>
}

function ChipVisual() {
  const [selected, setSelected] = useState(true)

  return (
    <button
      type="button"
      className={cn("rounded-full border px-3 py-1 text-sm", selected ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground")}
      onClick={() => setSelected((value) => !value)}
    >
      {selected ? "선택됨" : "해제됨"}
    </button>
  )
}

function ButtonVisual({ label, emphasis = "default" }: { label: string; emphasis?: "default" | "primary" | "secondary" | "destructive" }) {
  const [pressed, setPressed] = useState(false)

  return (
    <button
      type="button"
      className={cn("rounded-md px-4 py-2 text-sm font-medium shadow-sm", emphasis === "primary" && "bg-primary text-primary-foreground", emphasis === "secondary" && "border bg-card", emphasis === "destructive" && "bg-destructive text-white", emphasis === "default" && "border bg-card", pressed && "ring-2 ring-ring")}
      onClick={() => setPressed((value) => !value)}
    >
      {pressed ? "실행됨" : label}
    </button>
  )
}

function IconButtonVisual() {
  const [liked, setLiked] = useState(false)

  return (
    <button type="button" aria-label="좋아요" className={cn("flex size-10 items-center justify-center rounded-md border bg-card", liked && "bg-primary text-primary-foreground")} onClick={() => setLiked((value) => !value)}>
      <Heart aria-hidden="true" />
    </button>
  )
}

function FabVisual() {
  const [count, setCount] = useState(0)

  return (
    <button type="button" aria-label="추가" className="relative flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md" onClick={() => setCount((value) => value + 1)}>
      <Plus aria-hidden="true" />
      {count > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-destructive px-1.5 py-0.5 text-[10px] text-white">{count}</span>}
    </button>
  )
}

function LinkVisual() {
  const [visited, setVisited] = useState(false)

  return (
    <button type="button" className="inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-4" onClick={() => setVisited(true)}>
      {visited ? "방문함" : "자세히 보기"} <ChevronRight aria-hidden="true" />
    </button>
  )
}

function ToolbarVisual() {
  const [active, setActive] = useState("Search")
  const items = [Search, Settings, Heart, MoreHorizontal]

  return (
    <Chrome className="flex items-center gap-1 p-1">
      {items.map((Icon) => {
        const key = Icon.displayName ?? Icon.name
        return (
          <button
            key={key}
            type="button"
            className={cn("flex size-8 items-center justify-center rounded hover:bg-muted", active === key && "bg-primary text-primary-foreground")}
            onClick={() => setActive(key)}
          >
            <Icon aria-hidden="true" />
          </button>
        )
      })}
    </Chrome>
  )
}

function SplitButton() {
  const [open, setOpen] = useState(false)
  const [label, setLabel] = useState("내보내기")

  return (
    <div className="relative">
      <div className="inline-flex overflow-hidden rounded-md border bg-primary text-primary-foreground shadow-sm">
        <button type="button" className="px-3 py-2 text-sm" onClick={() => setLabel("PDF 저장")}>{label}</button>
        <button type="button" className="border-l border-primary-foreground/30 px-2 py-2" aria-label="옵션 열기" onClick={() => setOpen((value) => !value)}><ChevronDown aria-hidden="true" /></button>
      </div>
      {open && (
        <div className="absolute right-0 top-10 z-10 w-24 rounded-md border bg-popover p-1 text-xs shadow-md">
          {["PDF", "PNG"].map((item) => (
            <button key={item} type="button" className="w-full rounded px-2 py-1 text-left hover:bg-muted" onClick={() => { setLabel(`${item} 저장`); setOpen(false) }}>{item}</button>
          ))}
        </div>
      )}
    </div>
  )
}

function MenuItemVisual() {
  const [deleted, setDeleted] = useState(false)

  return (
    <Chrome className="flex w-44 items-center justify-between px-3 py-2 text-sm">
      <button type="button" className="flex items-center gap-2" onClick={() => setDeleted((value) => !value)}>
        <Trash2 aria-hidden="true" />{deleted ? "복원" : "삭제"}
      </button>
      <span className="text-xs text-muted-foreground">{deleted ? "done" : "⌘⌫"}</span>
    </Chrome>
  )
}

function CardVisual() {
  return (
    <Chrome className="w-48 p-3">
      <div className="mb-3 h-12 rounded bg-muted" />
      <Line className="w-28" />
      <Line className="mt-2 w-40" />
    </Chrome>
  )
}

function DialogVisual() {
  const [open, setOpen] = useState(true)

  return (
    <div className="relative h-28 w-52 rounded-md bg-foreground/10 p-4">
      <button type="button" className="rounded-md border bg-card px-3 py-1 text-sm" onClick={() => setOpen(true)}>
        열기
      </button>
      {open && (
        <Chrome className="absolute left-1/2 top-1/2 w-40 -translate-x-1/2 -translate-y-1/2 p-3">
          <div className="flex items-center justify-between">
            <Line className="w-20" />
            <button type="button" aria-label="닫기" onClick={() => setOpen(false)}>
              <X aria-hidden="true" />
            </button>
          </div>
          <Line className="mt-3 w-32" />
        </Chrome>
      )}
    </div>
  )
}

function DrawerVisual() {
  const [open, setOpen] = useState(true)

  return (
    <div className="relative h-28 w-52 rounded-md border bg-card">
      <button type="button" className="m-3 rounded border px-2 py-1 text-xs" onClick={() => setOpen((value) => !value)}>
        {open ? "닫기" : "열기"}
      </button>
      {open && (
        <div className="absolute bottom-0 right-0 top-0 w-24 border-l bg-background p-2">
          <Line className="w-16" />
          <Line className="mt-2 w-12" />
        </div>
      )}
    </div>
  )
}

function PopoverVisual() {
  const [open, setOpen] = useState(true)

  return (
    <div className="relative h-24 w-44">
      <button type="button" className="rounded-md border bg-card px-3 py-1 text-sm" onClick={() => setOpen((value) => !value)}>열기</button>
      {open && <Chrome className="absolute bottom-0 right-0 w-32 p-2"><Line className="w-20" /><Line className="mt-2 w-24" /></Chrome>}
    </div>
  )
}

function HeaderVisual() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="relative">
      <Chrome className="flex h-12 w-52 items-center justify-between px-3">
        <button type="button" aria-label="메뉴" onClick={() => setMenuOpen((value) => !value)}><Menu aria-hidden="true" /></button>
        <Line className="w-24" />
        <Circle aria-hidden="true" />
      </Chrome>
      {menuOpen && <Chrome className="absolute left-0 top-14 w-28 p-2 text-xs"><Line className="w-20" /><Line className="mt-2 w-16" /></Chrome>}
    </div>
  )
}

function FooterVisual() {
  const [active, setActive] = useState(0)

  return <Chrome className="flex h-12 w-52 items-center justify-around px-3">{[0, 1].map((item) => <button key={item} type="button" onClick={() => setActive(item)}><Line className={cn("w-12", active === item && "bg-primary")} /></button>)}<MoreHorizontal aria-hidden="true" /></Chrome>
}

function GridVisual() {
  const [selected, setSelected] = useState(0)

  return <div className="grid w-48 grid-cols-4 gap-2">{Array.from({ length: 8 }).map((_, item) => <button key={item} type="button" className={cn("h-8 rounded border bg-card", selected === item && "bg-primary")} onClick={() => setSelected(item)} />)}</div>
}

function ListVisual() {
  const [selected, setSelected] = useState(0)

  return <Chrome className="w-48 p-2">{[0, 1, 2].map((item) => <button key={item} type="button" className={cn("flex w-full items-center gap-2 border-b py-2 last:border-b-0", selected === item && "text-primary")} onClick={() => setSelected(item)}><span className="size-2 rounded-full bg-primary" /><Line className="w-32" /></button>)}</Chrome>
}

function AccordionVisual() {
  const [openItem, setOpenItem] = useState("첫 항목")
  const items = ["첫 항목", "둘째 항목", "셋째 항목"]

  return (
    <Chrome className="w-48 divide-y">
      {items.map((item) => (
        <AccRow
          key={item}
          open={openItem === item}
          text={item}
          onToggle={() => setOpenItem((current) => (current === item ? "" : item))}
        />
      ))}
    </Chrome>
  )
}

function AccRow({ text, open, onToggle }: { text: string; open?: boolean; onToggle: () => void }) {
  return (
    <div className="p-2 text-xs">
      <button type="button" className="flex w-full justify-between text-left" onClick={onToggle}>
        <span>{text}</span>
        <ChevronDown aria-hidden="true" className={cn("transition-transform", open && "rotate-180")} />
      </button>
      {open && <Line className="mt-2 w-28" />}
    </div>
  )
}

function CarouselVisual() {
  const [active, setActive] = useState(1)

  return (
    <div className="flex items-center gap-2">
      <button type="button" aria-label="이전" onClick={() => setActive((current) => Math.max(0, current - 1))}><ChevronLeft aria-hidden="true" /></button>
      <div className="flex gap-2">
        {[0, 1, 2].map((item) => <button key={item} type="button" className={cn("h-16 w-12 rounded border bg-card", active === item && "border-primary bg-primary/15")} onClick={() => setActive(item)} />)}
      </div>
      <button type="button" aria-label="다음" onClick={() => setActive((current) => Math.min(2, current + 1))}><ChevronRight aria-hidden="true" /></button>
    </div>
  )
}

function TooltipVisual() {
  const [open, setOpen] = useState(true)

  return (
    <div className="relative h-20 w-36">
      <button type="button" className="absolute bottom-0 left-6 rounded border bg-card px-3 py-1 text-sm" onClick={() => setOpen((value) => !value)}>도움</button>
      {open && <span className="absolute left-0 top-0 rounded-md border bg-popover px-2 py-1 text-xs shadow">도움말 내용</span>}
    </div>
  )
}

function ToastVisual() {
  const [visible, setVisible] = useState(true)

  if (!visible) {
    return (
      <button type="button" className="rounded-md border bg-card px-3 py-2 text-sm shadow-sm" onClick={() => setVisible(true)}>
        토스트 보기
      </button>
    )
  }

  return (
    <Chrome className="flex w-48 items-center justify-between px-3 py-2 text-sm">
      <span className="flex items-center gap-2"><Check aria-hidden="true" />저장되었습니다!</span>
      <button type="button" aria-label="토스트 닫기" onClick={() => setVisible(false)}>
        <X aria-hidden="true" />
      </button>
    </Chrome>
  )
}

function AlertVisual() {
  const [visible, setVisible] = useState(true)

  if (!visible) {
    return <button type="button" className="rounded-md border bg-card px-3 py-2 text-sm" onClick={() => setVisible(true)}>알림 다시 보기</button>
  }

  return <div className="flex w-52 items-start justify-between gap-2 rounded-md border bg-card p-3 text-sm"><span className="flex gap-2"><AlertTriangle aria-hidden="true" />확인이 필요합니다.</span><button type="button" aria-label="알림 닫기" onClick={() => setVisible(false)}><X aria-hidden="true" /></button></div>
}

function BadgeVisual() {
  const [count, setCount] = useState(3)

  return <button type="button" className="relative" aria-label="알림 수 증가" onClick={() => setCount((value) => value + 1)}><Bell aria-hidden="true" />{count > 0 && <span className="absolute -right-3 -top-3 rounded-full bg-destructive px-1.5 py-0.5 text-xs text-white">{count}</span>}</button>
}

function ProgressBarVisual() {
  const [value, setValue] = useState(65)

  return (
    <button type="button" className="flex w-52 items-center gap-3" onClick={() => setValue((current) => (current >= 100 ? 0 : current + 10))}>
      <span className="h-3 flex-1 rounded-full bg-muted"><span className="block h-full rounded-full bg-primary" style={{ width: `${value}%` }} /></span>
      <span className="w-8 text-xs text-muted-foreground">{value}%</span>
    </button>
  )
}

function SpinnerVisual() {
  return <LoaderCircle className="animate-spin text-primary" aria-hidden="true" />
}

function SkeletonVisual() {
  return <Chrome className="w-48 p-3"><div className="mb-3 h-12 rounded bg-muted" /><Line className="w-36" /><Line className="mt-2 w-24" /></Chrome>
}

function EmptyStateVisual() {
  const [hasData, setHasData] = useState(false)

  return (
    <div className="flex flex-col items-center gap-2 text-center text-sm text-muted-foreground">
      <Folder aria-hidden="true" />
      <span>{hasData ? "새 항목 1개" : "데이터가 없습니다."}</span>
      <button type="button" className="rounded border bg-card px-2 py-1 text-xs text-foreground" onClick={() => setHasData((value) => !value)}>
        {hasData ? "비우기" : "추가"}
      </button>
    </div>
  )
}

function ValidationMessage() {
  return <div className="w-48"><Chrome className="h-9 border-destructive px-3 py-2 text-sm">email@</Chrome><p className="mt-1 text-xs text-destructive">이메일 형식을 확인하세요.</p></div>
}

function StatusIndicator() {
  return <span className="flex items-center gap-2 text-sm"><span className="size-3 rounded-full bg-primary" />온라인</span>
}

function TableVisual() {
  const [selected, setSelected] = useState(4)

  return <div className="grid w-48 grid-cols-3 overflow-hidden rounded-md border bg-card text-xs">{Array.from({ length: 9 }).map((_, cell) => <button key={cell} type="button" className={cn("h-7 border-b border-r p-1", selected === cell && "bg-primary/20")} onClick={() => setSelected(cell)}><Line className="w-full" /></button>)}</div>
}

function AvatarVisual() {
  const [online, setOnline] = useState(true)

  return <button type="button" className="relative flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground" onClick={() => setOnline((value) => !value)}><User aria-hidden="true" /><span className={cn("absolute bottom-0 right-0 size-3 rounded-full border-2 border-background", online ? "bg-primary" : "bg-muted-foreground")} /></button>
}

function MetricCardVisual() {
  const [metric, setMetric] = useState(12.4)

  return <button type="button" onClick={() => setMetric((value) => Number((value + 0.3).toFixed(1)))}><Chrome className="w-44 p-3 text-left"><p className="text-xs text-muted-foreground">방문자</p><p className="text-2xl font-semibold">{metric}K</p><p className="text-xs text-primary">+8.2%</p></Chrome></button>
}

function ChartVisual() {
  const [selected, setSelected] = useState(3)
  const bars = [32, 54, 42, 72, 58]

  return <div className="flex h-24 w-44 items-end gap-2 rounded-md border bg-card p-3">{bars.map((height, index) => <button key={height} type="button" className={cn("w-5 rounded-t bg-primary", selected === index && "bg-destructive")} style={{ height }} onClick={() => setSelected(index)} />)}</div>
}

function TimelineVisual() {
  const [active, setActive] = useState(1)

  return <div className="flex flex-col gap-0">{[0, 1, 2].map((item) => <button key={item} type="button" className="flex gap-2 text-left text-xs" onClick={() => setActive(item)}><span className="flex flex-col items-center"><span className={cn("size-3 rounded-full", item <= active ? "bg-primary" : "bg-muted-foreground/30")} /><span className="h-6 w-px bg-border" /></span><span className={cn(active === item && "font-medium text-primary")}>이벤트 {item + 1}</span></button>)}</div>
}

function KanbanVisual() {
  const columns = ["할 일", "진행", "완료"]
  const [activeColumn, setActiveColumn] = useState("진행")

  return <div className="grid w-52 grid-cols-3 gap-2">{columns.map((column) => <button key={column} type="button" onClick={() => setActiveColumn(column)}><Chrome className="p-2 text-left"><p className="mb-2 text-[10px] text-muted-foreground">{column}</p><div className={cn("h-8 rounded bg-muted", activeColumn === column && "bg-primary/30")} /></Chrome></button>)}</div>
}

function CalendarView() {
  const [selectedDay, setSelectedDay] = useState(15)

  return <div className="grid w-48 grid-cols-7 gap-1 rounded-md border bg-card p-2 text-center text-[10px]">{Array.from({ length: 21 }).map((_, day) => <button key={day} type="button" className={cn("rounded py-1", day + 1 === selectedDay && "bg-primary text-primary-foreground")} onClick={() => setSelectedDay(day + 1)}>{day + 1}</button>)}</div>
}

function TreeView() {
  const [open, setOpen] = useState(true)

  return (
    <Chrome className="w-48 p-2 text-xs">
      <button type="button" className="w-full text-left" onClick={() => setOpen((value) => !value)}>
        <TreeRow icon={<ChevronDown aria-hidden="true" className={cn("transition-transform", !open && "-rotate-90")} />} text="components" />
      </button>
      {open && (
        <>
          <TreeRow indent icon={<Folder aria-hidden="true" />} text="button.tsx" />
          <TreeRow indent icon={<Folder aria-hidden="true" />} text="card.tsx" />
        </>
      )}
    </Chrome>
  )
}

function TreeRow({ icon, text, indent }: { icon: React.ReactNode; text: string; indent?: boolean }) {
  return <div className={cn("flex items-center gap-1 py-1", indent && "pl-5")}>{icon}<span>{text}</span></div>
}

function DescriptionList() {
  const [active, setActive] = useState(true)

  return <button type="button" onClick={() => setActive((value) => !value)}><Chrome className="grid w-48 grid-cols-[64px_1fr] gap-y-2 p-3 text-left text-xs"><span className="text-muted-foreground">상태</span><span>{active ? "활성" : "비활성"}</span><span className="text-muted-foreground">역할</span><span>관리자</span><span className="text-muted-foreground">지역</span><span>서울</span></Chrome></button>
}

function IconVisual() {
  const [active, setActive] = useState(false)

  return <button type="button" className={cn("flex size-14 items-center justify-center rounded-lg border bg-card text-primary shadow-sm", active && "bg-primary text-primary-foreground")} onClick={() => setActive((value) => !value)}><Home aria-hidden="true" /></button>
}

function LabelVisual() {
  return <div className="w-48"><p className="mb-1 text-xs font-medium">이름</p><TextField /></div>
}

function DividerVisual() {
  const [vertical, setVertical] = useState(false)

  if (vertical) {
    return <button type="button" className="flex h-24 w-48 items-center justify-center gap-4" onClick={() => setVertical(false)}><Line className="w-12" /><div className="h-full w-px bg-border" /><Line className="w-12" /></button>
  }

  return <button type="button" className="flex w-48 flex-col gap-3 text-left" onClick={() => setVertical(true)}><Line className="w-32" /><div className="h-px w-full bg-border" /><Line className="w-40" /></button>
}

function SpacerVisual() {
  const [wide, setWide] = useState(false)

  return <button type="button" className={cn("flex w-48 items-center transition-all", wide ? "gap-8" : "gap-4")} onClick={() => setWide((value) => !value)}><span className="h-16 w-14 rounded border bg-card" /><span className="flex h-16 flex-1 items-center justify-center rounded border border-dashed text-xs text-muted-foreground">{wide ? "wide" : "gap"}</span><span className="h-16 w-14 rounded border bg-card" /></button>
}

function TypographyVisual() {
  const [large, setLarge] = useState(false)

  return <button type="button" className="w-48 text-left" onClick={() => setLarge((value) => !value)}><p className={cn("font-semibold", large ? "text-3xl" : "text-2xl")}>Heading</p><p className={cn(large ? "text-base" : "text-sm")}>Body text line</p><p className="text-xs text-muted-foreground">Caption</p></button>
}

function ImageVisual() {
  const [loaded, setLoaded] = useState(false)

  return <button type="button" className={cn("flex h-24 w-44 items-center justify-center rounded-md border bg-card text-muted-foreground", loaded && "bg-primary/20 text-primary")} onClick={() => setLoaded((value) => !value)}>{loaded ? "Loaded" : <ImageIcon aria-hidden="true" />}</button>
}

function LogoVisual() {
  const [compact, setCompact] = useState(false)

  return <button type="button" className="flex items-center gap-2" onClick={() => setCompact((value) => !value)}><span className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground"><BookOpen aria-hidden="true" /></span>{!compact && <span className="text-lg font-semibold">Brand</span>}</button>
}

function ThumbnailVisual() {
  const [playing, setPlaying] = useState(false)

  return <button type="button" className={cn("relative flex h-20 w-36 items-center justify-center rounded-md border bg-card text-muted-foreground", playing && "bg-primary/20")} onClick={() => setPlaying((value) => !value)}><ImageIcon aria-hidden="true" /><span className="absolute bottom-2 right-2 flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground">{playing ? <Check aria-hidden="true" /> : <Play aria-hidden="true" />}</span></button>
}

function PasswordField() {
  const [visible, setVisible] = useState(false)

  return <Chrome className="flex h-10 w-48 items-center justify-between px-3 text-sm"><span>{visible ? "password" : "••••••••"}</span><button type="button" aria-label="비밀번호 표시 전환" onClick={() => setVisible((value) => !value)}><EyeOff aria-hidden="true" /></button></Chrome>
}

function NumberInput() {
  const [value, setValue] = useState(3)

  return (
    <Chrome className="flex h-10 w-36 items-center justify-between overflow-hidden text-sm">
      <button type="button" className="h-full border-r px-3" onClick={() => setValue((current) => Math.max(0, current - 1))}>-</button>
      <span>{value}</span>
      <button type="button" className="h-full border-l px-3" onClick={() => setValue((current) => current + 1)}>+</button>
    </Chrome>
  )
}

function OtpInput() {
  const [digits, setDigits] = useState(["4", "2", "8", "", "", ""])

  return <div className="flex gap-1">{digits.map((item, index) => <button key={index} type="button" className={cn("flex size-8 items-center justify-center rounded border bg-card text-sm", index === 3 && "border-primary")} onClick={() => setDigits((current) => current.map((digit, digitIndex) => digitIndex === index ? String((Number(digit || 0) + 1) % 10) : digit))}>{item}</button>)}</div>
}

function AutocompleteVisual() {
  const [query, setQuery] = useState("sea")
  const [selected, setSelected] = useState("Search field")
  const options = ["Search field", "Search view", "Search suggestions"].filter((option) => option.toLowerCase().includes(query.toLowerCase()))

  return <Chrome className="w-48 overflow-hidden"><div className="flex h-9 items-center gap-2 border-b px-3 text-sm"><Search aria-hidden="true" /><input aria-label="자동완성 입력 예시" className="min-w-0 flex-1 bg-transparent outline-none" value={query} onChange={(event) => setQuery(event.target.value)} /></div><div className="p-1 text-xs">{(options.length ? options : ["Search field"]).map((option) => <button key={option} type="button" className={cn("w-full rounded px-2 py-1 text-left", selected === option ? "bg-primary text-primary-foreground" : "text-muted-foreground")} onClick={() => setSelected(option)}>{option}</button>)}</div></Chrome>
}

function SearchSuggestions() {
  const [selected, setSelected] = useState("검색 제안")

  return <Chrome className="w-52 overflow-hidden"><SearchField /><div className="border-t p-1 text-xs"><Row active={selected === "검색 제안"} icon={<Search aria-hidden="true" />} text="검색 제안" onClick={() => setSelected("검색 제안")} /><Row active={selected === "최근 검색어"} icon={<Search aria-hidden="true" />} text="최근 검색어" onClick={() => setSelected("최근 검색어")} /></div></Chrome>
}

function InlineEditVisual() {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState("문서 제목")

  return <Chrome className="flex h-10 w-48 items-center justify-between px-3 text-sm">{editing ? <input aria-label="인라인 편집 예시" className="min-w-0 flex-1 border-b border-primary bg-transparent outline-none" value={title} onChange={(event) => setTitle(event.target.value)} onBlur={() => setEditing(false)} autoFocus /> : <button type="button" className="border-b border-primary" onClick={() => setEditing(true)}>{title}</button>}<Type aria-hidden="true" /></Chrome>
}

function RichTextEditor() {
  const [bold, setBold] = useState(true)
  const [linked, setLinked] = useState(false)

  return <Chrome className="w-52 overflow-hidden"><div className="flex gap-1 border-b p-1"><SmallIcon onClick={() => setBold((value) => !value)}><Bold aria-hidden="true" /></SmallIcon><SmallIcon onClick={() => setLinked((value) => !value)}><LinkIcon aria-hidden="true" /></SmallIcon></div><div className="p-3"><Line className={cn("w-36", bold && "h-3 bg-foreground/50")} /><Line className={cn("mt-2 w-28", linked && "bg-primary")} /></div></Chrome>
}

function ColorPicker() {
  const colors = [
    { className: "bg-primary", value: "#primary" },
    { className: "bg-destructive", value: "#destructive" },
    { className: "bg-accent", value: "#accent" },
    { className: "bg-muted-foreground", value: "#muted" },
    { className: "bg-card", value: "#card" },
    { className: "bg-foreground", value: "#foreground" },
  ]
  const [selected, setSelected] = useState(colors[0])

  return <Chrome className="w-44 p-3"><div className="mb-3 flex items-center gap-2 text-sm"><Palette aria-hidden="true" /><span>{selected.value}</span></div><div className="grid grid-cols-6 gap-1">{colors.map((color) => <button key={color.value} type="button" className={cn("size-5 rounded border", color.className, selected.value === color.value && "ring-2 ring-ring")} onClick={() => setSelected(color)} />)}</div></Chrome>
}

function ListboxVisual() {
  const [selected, setSelected] = useState("옵션 A")

  return <Chrome className="w-44 p-1 text-sm">{["옵션 A", "옵션 B", "옵션 C"].map((option) => <button key={option} type="button" className={cn("w-full rounded px-2 py-1 text-left", selected === option ? "bg-primary text-primary-foreground" : "text-muted-foreground")} onClick={() => setSelected(option)}>{option}</button>)}</Chrome>
}

function MenuBarVisual() {
  const [menu, setMenu] = useState("파일")

  return <Chrome className="w-52 overflow-hidden text-xs"><div className="flex border-b">{["파일", "편집", "보기"].map((item) => <button key={item} type="button" className={cn("px-3 py-2", menu === item && "bg-muted")} onClick={() => setMenu(item)}>{item}</button>)}</div><div className="w-24 p-1"><p className="rounded bg-primary px-2 py-1 text-primary-foreground">{menu === "파일" ? "새로 만들기" : `${menu} 옵션`}</p><p className="px-2 py-1">열기</p></div></Chrome>
}

function BottomNavigation() {
  const [active, setActive] = useState("홈")

  return <Chrome className="flex h-14 w-52 items-center justify-around px-2 text-[10px]">{[
    { text: "홈", icon: <Home aria-hidden="true" /> },
    { text: "검색", icon: <Search aria-hidden="true" /> },
    { text: "내 정보", icon: <User aria-hidden="true" /> },
  ].map((item) => <button key={item.text} type="button" onClick={() => setActive(item.text)}><NavItem active={active === item.text} icon={item.icon} text={item.text} /></button>)}</Chrome>
}

function NavItem({ icon, text, active }: { icon: React.ReactNode; text: string; active?: boolean }) {
  return <span className={cn("flex flex-col items-center gap-0.5", active && "text-primary")}>{icon}<span>{text}</span></span>
}

function FilterChip() {
  const [selected, setSelected] = useState(true)

  return <button type="button" className={cn("inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm", selected ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground")} onClick={() => setSelected((value) => !value)}>{selected && <Check aria-hidden="true" />}{selected ? "진행 중" : "전체"}</button>
}

function ToggleButtonVisual() {
  const [pressed, setPressed] = useState(true)

  return <button type="button" className={cn("flex items-center gap-2 rounded-md border px-3 py-2 text-sm", pressed ? "bg-primary text-primary-foreground" : "bg-card")} onClick={() => setPressed((value) => !value)}><Bold aria-hidden="true" />굵게</button>
}

function DisclosureVisual() {
  const [open, setOpen] = useState(true)

  return <Chrome className="w-48 p-2 text-sm"><button type="button" className="flex w-full items-center justify-between text-left" onClick={() => setOpen((value) => !value)}><span>상세 옵션</span><ChevronDown aria-hidden="true" className={cn("transition-transform", open && "rotate-180")} /></button>{open && <Line className="mt-3 w-32" />}</Chrome>
}

function AnchorNav() {
  const [active, setActive] = useState("컴포넌트")

  return <Chrome className="w-44 p-2 text-sm">{["개요", "컴포넌트", "예시"].map((item) => <button key={item} type="button" className={cn("block w-full border-l-2 px-2 py-1 text-left", active === item ? "border-primary font-medium" : "border-transparent text-muted-foreground")} onClick={() => setActive(item)}>{item}</button>)}</Chrome>
}

function BackButtonVisual() {
  const [label, setLabel] = useState("이전")

  return <button type="button" className="inline-flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm" onClick={() => setLabel("돌아감")}><ChevronLeft aria-hidden="true" />{label}</button>
}

function NavigationBarVisual() {
  const [active, setActive] = useState("홈")

  return <Chrome className="flex h-12 w-64 items-center justify-between px-3 text-xs"><LogoVisual /><span className="flex gap-3">{["홈", "문서", "설정"].map((item) => <button key={item} type="button" className={cn(active === item && "font-bold text-primary")} onClick={() => setActive(item)}>{item}</button>)}</span></Chrome>
}

function ButtonGroupVisual() {
  return <div className="flex gap-2"><ButtonVisual label="취소" emphasis="secondary" /><ButtonVisual label="저장" emphasis="primary" /></div>
}

function ActionIconButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  const [done, setDone] = useState(false)

  return <button type="button" className={cn("inline-flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm shadow-sm", done && "border-primary text-primary")} onClick={() => setDone((value) => !value)}>{icon}{done ? "완료" : label}</button>
}

function TopAppBar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return <div className="relative"><Chrome className="flex h-12 w-60 items-center justify-between px-3"><BackButtonVisual /><span className="text-sm font-semibold">화면 제목</span><span className="flex gap-2"><Search aria-hidden="true" /><button type="button" aria-label="더보기" onClick={() => setMenuOpen((value) => !value)}><MoreHorizontal aria-hidden="true" /></button></span></Chrome>{menuOpen && <Chrome className="absolute right-0 top-14 w-24 p-1 text-xs"><button type="button" className="w-full rounded px-2 py-1 text-left hover:bg-muted">공유</button><button type="button" className="w-full rounded px-2 py-1 text-left hover:bg-muted">삭제</button></Chrome>}</div>
}

function SectionVisual() {
  const [expanded, setExpanded] = useState(true)

  return <div className="flex w-52 flex-col gap-3"><button type="button" className="text-left" onClick={() => setExpanded((value) => !value)}><p className="text-sm font-semibold">섹션 제목</p><Line className="mt-1 w-32" /></button>{expanded && <Chrome className="h-14" />}</div>
}

function ContainerVisual() {
  const [wide, setWide] = useState(false)

  return <button type="button" className="w-60 rounded-md border border-dashed p-3" onClick={() => setWide((value) => !value)}><Chrome className={cn("mx-auto h-20 transition-all", wide ? "w-52" : "w-40")} /></button>
}

function HeroVisual() {
  const [started, setStarted] = useState(false)

  return <Chrome className="grid w-60 grid-cols-[1fr_72px] gap-3 p-3"><div><p className="text-lg font-semibold">{started ? "Started" : "Hero title"}</p><Line className="mt-2 w-24" /><button type="button" className="mt-3 rounded bg-primary px-2 py-1 text-xs text-primary-foreground" onClick={() => setStarted(true)}>시작</button></div><div className={cn("rounded bg-muted", started && "bg-primary/30")} /></Chrome>
}

function FilterBarVisual() {
  const [status, setStatus] = useState(false)

  return <Chrome className="flex w-64 items-center gap-2 p-2"><div className="min-w-0 flex-1"><SearchField /></div><button type="button" className={cn("rounded-full border px-2 py-1 text-xs", status && "bg-primary text-primary-foreground")} onClick={() => setStatus((value) => !value)}>상태</button><SortControl /></Chrome>
}

function SortControl() {
  const [latest, setLatest] = useState(true)

  return <button type="button" className="flex h-8 items-center justify-between rounded border bg-card px-2 text-xs" onClick={() => setLatest((value) => !value)}><span>{latest ? "최신순" : "이름순"}</span><ChevronDown aria-hidden="true" /></button>
}

function DataGridVisual() {
  const [selected, setSelected] = useState(9)

  return <div className="grid w-52 grid-cols-4 overflow-hidden rounded-md border bg-card text-xs">{Array.from({ length: 16 }).map((_, cell) => <button key={cell} type="button" className={cn("h-7 border-b border-r p-1", selected === cell && "bg-primary text-primary-foreground")} onClick={() => setSelected(cell)}><Line className="w-full" /></button>)}</div>
}

function LegendVisual() {
  const [hidden, setHidden] = useState("비용")

  return <Chrome className="flex w-44 flex-col gap-2 p-3 text-xs"><LegendRow color="bg-primary" text="매출" hidden={hidden === "매출"} onClick={() => setHidden("매출")} /><LegendRow color="bg-destructive" text="비용" hidden={hidden === "비용"} onClick={() => setHidden("비용")} /><LegendRow color="bg-muted-foreground" text="이익" hidden={hidden === "이익"} onClick={() => setHidden("이익")} /></Chrome>
}

function LegendRow({ color, text, hidden, onClick }: { color: string; text: string; hidden?: boolean; onClick?: () => void }) {
  return <button type="button" className={cn("flex items-center gap-2 text-left", hidden && "opacity-40 line-through")} onClick={onClick}><span className={cn("size-3 rounded-sm", color)} />{text}</button>
}

function ChartAxisVisual() {
  const [selected, setSelected] = useState(1)
  const bars = [24, 48, 36, 64]

  return <div className="relative h-28 w-44 border-b border-l bg-card p-2"><div className="absolute bottom-2 left-4 right-2 flex items-end gap-2">{bars.map((height, index) => <button key={height} type="button" className={cn("w-5 rounded-t bg-primary", selected === index && "bg-destructive")} style={{ height }} onClick={() => setSelected(index)} />)}</div><span className="absolute bottom-0 right-0 text-[10px] text-muted-foreground">x</span><span className="absolute left-1 top-0 text-[10px] text-muted-foreground">y</span></div>
}

function TextareaAutosizeVisual() {
  const [value, setValue] = useState("메모")
  const rows = Math.min(5, Math.max(2, value.split("\n").length))

  return <Chrome className="w-48 p-2"><textarea aria-label="자동 높이 텍스트영역 예시" className="w-full resize-none bg-transparent text-sm outline-none" rows={rows} value={value} onChange={(event) => setValue(event.target.value)} /></Chrome>
}

function InputGroupVisual() {
  const [value, setValue] = useState("12000")

  return <Chrome className="flex h-10 w-52 items-center overflow-hidden text-sm"><span className="border-r bg-muted px-3 py-2">₩</span><input aria-label="입력 그룹 예시" className="min-w-0 flex-1 bg-transparent px-2 outline-none" value={value} onChange={(event) => setValue(event.target.value)} /><span className="border-l px-2 text-xs text-muted-foreground">KRW</span></Chrome>
}

function DateRangePickerVisual() {
  const [start, setStart] = useState(5)
  const [end, setEnd] = useState(10)

  const chooseDay = (day: number) => {
    if (day < start || day > end) {
      setStart(Math.min(day, start))
      setEnd(Math.max(day, end))
      return
    }
    setEnd(day)
  }

  return <Chrome className="w-52 p-2 text-[10px]"><p className="mb-2 text-sm">5월 {start}일 - {end}일</p><div className="grid grid-cols-7 gap-1">{Array.from({ length: 14 }).map((_, index) => { const day = index + 1; return <button key={day} type="button" className={cn("rounded py-1", day >= start && day <= end && "bg-primary/20", (day === start || day === end) && "bg-primary text-primary-foreground")} onClick={() => chooseDay(day)}>{day}</button> })}</div></Chrome>
}

function TimePickerVisual() {
  const [hour, setHour] = useState(9)
  const [minute, setMinute] = useState(30)

  return <Chrome className="flex w-44 items-center justify-center gap-2 p-3 text-sm"><Clock aria-hidden="true" /><button type="button" className="rounded border px-2 py-1" onClick={() => setHour((value) => (value + 1) % 24)}>{String(hour).padStart(2, "0")}</button><span>:</span><button type="button" className="rounded border px-2 py-1" onClick={() => setMinute((value) => (value + 30) % 60)}>{String(minute).padStart(2, "0")}</button></Chrome>
}

function RatingInputVisual() {
  const [rating, setRating] = useState(3)

  return <div className="flex gap-1">{[1, 2, 3, 4, 5].map((item) => <button key={item} type="button" className={cn("text-muted-foreground", item <= rating && "text-primary")} aria-label={`${item}점`} onClick={() => setRating(item)}><Star aria-hidden="true" /></button>)}</div>
}

function TagInputVisual() {
  const [tags, setTags] = useState(["React", "UI"])

  return <Chrome className="flex w-56 flex-wrap items-center gap-1 p-2 text-xs">{tags.map((tag) => <button key={tag} type="button" className="rounded-full bg-primary px-2 py-1 text-primary-foreground" onClick={() => setTags((current) => current.filter((item) => item !== tag))}>{tag} ×</button>)}<button type="button" className="rounded-full border px-2 py-1" onClick={() => setTags((current) => [...current, `Tag${current.length + 1}`])}>+ 추가</button></Chrome>
}

function MaskedInputVisual() {
  const [digits, setDigits] = useState("01012345678")
  const formatted = digits.replace(/(\d{3})(\d{4})(\d{0,4})/, (_, a, b, c) => `${a}-${b}${c ? `-${c}` : ""}`)

  return <Chrome className="flex h-10 w-48 items-center px-3 text-sm"><input aria-label="마스크 입력 예시" className="w-full bg-transparent outline-none" value={formatted} onChange={(event) => setDigits(event.target.value.replace(/\D/g, "").slice(0, 11))} /></Chrome>
}

function ToggleGroupVisual() {
  const [active, setActive] = useState(["B"])
  const options = ["B", "I", "U"]

  return <div className="inline-flex rounded-md border bg-card p-1">{options.map((option) => <button key={option} type="button" className={cn("rounded px-3 py-1 text-sm", active.includes(option) && "bg-primary text-primary-foreground")} onClick={() => setActive((current) => current.includes(option) ? current.filter((item) => item !== option) : [...current, option])}>{option}</button>)}</div>
}

function NavigationDrawerVisual() {
  const [open, setOpen] = useState(true)
  const [active, setActive] = useState("홈")

  return <div className="relative h-28 w-56 rounded-md border bg-card p-2"><button type="button" className="rounded border px-2 py-1 text-xs" onClick={() => setOpen((value) => !value)}><Menu aria-hidden="true" /></button>{open && <div className="absolute bottom-0 left-0 top-0 w-28 border-r bg-background p-2 text-xs">{["홈", "문서", "설정"].map((item) => <button key={item} type="button" className={cn("block w-full rounded px-2 py-1 text-left", active === item && "bg-primary text-primary-foreground")} onClick={() => setActive(item)}>{item}</button>)}</div>}</div>
}

function MegaMenuVisual() {
  const [open, setOpen] = useState(true)

  return <div className="relative w-60"><button type="button" className="rounded border bg-card px-3 py-1 text-sm" onClick={() => setOpen((value) => !value)}>제품</button>{open && <Chrome className="mt-2 grid grid-cols-3 gap-2 p-2 text-xs">{["Build", "Design", "Docs"].map((column) => <div key={column}><p className="mb-1 font-medium">{column}</p><Line className="w-12" /><Line className="mt-1 w-10" /></div>)}</Chrome>}</div>
}

function ContextMenuVisual() {
  const [open, setOpen] = useState(true)
  const [action, setAction] = useState("카드")

  return <div className="relative h-28 w-48"><button type="button" className="rounded border bg-card px-3 py-2 text-sm" onClick={() => setOpen((value) => !value)}>{action}</button>{open && <Chrome className="absolute bottom-0 right-0 w-28 p-1 text-xs">{["복사", "이름 변경", "삭제"].map((item) => <button key={item} type="button" className="block w-full rounded px-2 py-1 text-left hover:bg-muted" onClick={() => setAction(item)}>{item}</button>)}</Chrome>}</div>
}

function LoadingButtonVisual() {
  const [loading, setLoading] = useState(false)

  return <button type="button" className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground" onClick={() => setLoading((value) => !value)}>{loading && <LoaderCircle className="animate-spin" aria-hidden="true" />}{loading ? "저장 중" : "저장"}</button>
}

function CopyFieldVisual() {
  const [copied, setCopied] = useState(false)

  return <Chrome className="flex h-10 w-56 items-center overflow-hidden text-sm"><span className="min-w-0 flex-1 truncate px-3">invite.link/abc</span><button type="button" className={cn("border-l px-3", copied && "text-primary")} onClick={() => setCopied(true)}>{copied ? "완료" : "복사"}</button></Chrome>
}

function BulkActionBarVisual() {
  const [selected, setSelected] = useState(3)

  return <Chrome className="flex w-56 items-center justify-between px-3 py-2 text-xs"><button type="button" onClick={() => setSelected((value) => value + 1)}>{selected}개 선택</button><span className="flex gap-1"><button type="button" className="rounded bg-primary px-2 py-1 text-primary-foreground">이동</button><button type="button" className="rounded border px-2 py-1" onClick={() => setSelected(0)}>해제</button></span></Chrome>
}

function SpeedDialVisual() {
  const [open, setOpen] = useState(true)
  const actions = [
    { id: "copy", Icon: Copy },
    { id: "share", Icon: Share2 },
    { id: "trash", Icon: Trash2 },
  ]

  return <div className="flex flex-col items-end gap-2">{open && actions.map(({ id, Icon }) => <button key={id} type="button" className="flex size-8 items-center justify-center rounded-full border bg-card shadow-sm"><Icon aria-hidden="true" /></button>)}<button type="button" className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md" onClick={() => setOpen((value) => !value)}><Plus aria-hidden="true" /></button></div>
}

function AppShellVisual() {
  const [collapsed, setCollapsed] = useState(false)

  return <button type="button" className="grid h-28 w-60 grid-rows-[32px_1fr] overflow-hidden rounded-md border bg-card text-left" onClick={() => setCollapsed((value) => !value)}><div className="border-b bg-muted px-3 py-2 text-xs">App</div><div className={cn("grid", collapsed ? "grid-cols-[32px_1fr]" : "grid-cols-[72px_1fr]")}><div className="border-r p-2"><Line className="w-full" /><Line className="mt-2 w-full" /></div><div className="p-2"><Line className="w-28" /><Line className="mt-2 w-36" /></div></div></button>
}

function SplitPaneVisual() {
  const [wide, setWide] = useState(false)

  return <button type="button" className={cn("grid h-28 w-60 overflow-hidden rounded-md border bg-card text-left", wide ? "grid-cols-[2fr_1px_1fr]" : "grid-cols-[1fr_1px_1fr]")} onClick={() => setWide((value) => !value)}><div className="p-2"><Line className="w-20" /><Line className="mt-2 w-16" /></div><div className="bg-border" /><div className="p-2"><Line className="w-24" /><Line className="mt-2 w-20" /></div></button>
}

function SnackbarVisual() {
  const [visible, setVisible] = useState(true)

  if (!visible) return <button type="button" className="rounded border bg-card px-3 py-2 text-sm" onClick={() => setVisible(true)}>스낵바 보기</button>
  return <Chrome className="flex w-60 items-center justify-between bg-foreground px-3 py-2 text-sm text-background"><span>저장되었습니다</span><button type="button" className="font-medium" onClick={() => setVisible(false)}>확인</button></Chrome>
}

function UndoToastVisual() {
  const [deleted, setDeleted] = useState(true)

  return <Chrome className="flex w-56 items-center justify-between px-3 py-2 text-sm"><span>{deleted ? "삭제됨" : "복구됨"}</span><button type="button" className="text-primary" onClick={() => setDeleted(false)}>실행 취소</button></Chrome>
}

function RowSelectionVisual() {
  const [selected, setSelected] = useState([0, 2])

  return <Chrome className="w-52 p-2 text-xs">{[0, 1, 2].map((row) => <button key={row} type="button" className={cn("flex w-full items-center gap-2 border-b py-1 last:border-b-0", selected.includes(row) && "bg-primary/10")} onClick={() => setSelected((current) => current.includes(row) ? current.filter((item) => item !== row) : [...current, row])}><span className={cn("flex size-4 items-center justify-center rounded border", selected.includes(row) && "bg-primary text-primary-foreground")}>{selected.includes(row) && <Check aria-hidden="true" />}</span><Line className="w-32" /></button>)}</Chrome>
}

function SearchViewVisual() {
  const [query, setQuery] = useState("modal")
  const results = query ? ["Modal", "Dialog", "Drawer"] : ["최근 검색어", "Toast"]

  return <Chrome className="w-56 overflow-hidden p-2 text-xs"><div className="flex h-8 items-center gap-2 rounded border px-2"><Search aria-hidden="true" /><input aria-label="검색 뷰 예시" className="min-w-0 flex-1 bg-transparent outline-none" value={query} onChange={(event) => setQuery(event.target.value)} /></div><div className="mt-2 flex flex-col gap-1">{results.map((item) => <button key={item} type="button" className="rounded px-2 py-1 text-left hover:bg-muted">{item}</button>)}</div></Chrome>
}

function TreeNavigationVisual() {
  const [open, setOpen] = useState(true)
  const [active, setActive] = useState("Button")

  return <Chrome className="w-52 p-2 text-xs"><button type="button" className="flex w-full items-center gap-1" onClick={() => setOpen((value) => !value)}><ChevronDown aria-hidden="true" className={cn(!open && "-rotate-90")} />Components</button>{open && ["Button", "Input", "Dialog"].map((item) => <button key={item} type="button" className={cn("ml-5 block rounded px-2 py-1 text-left", active === item && "bg-primary text-primary-foreground")} onClick={() => setActive(item)}>{item}</button>)}</Chrome>
}

function SideSheetVisual() {
  const [open, setOpen] = useState(true)

  return <div className="relative h-28 w-56 rounded-md border bg-card"><button type="button" className="m-3 rounded border px-2 py-1 text-xs" onClick={() => setOpen((value) => !value)}>{open ? "닫기" : "상세"}</button>{open && <div className="absolute bottom-0 right-0 top-0 w-28 border-l bg-background p-3"><Line className="w-16" /><Line className="mt-2 w-20" /><button type="button" className="mt-3 rounded bg-primary px-2 py-1 text-xs text-primary-foreground">저장</button></div>}</div>
}

function BreadcrumbsMenuVisual() {
  const [open, setOpen] = useState(true)
  const [current, setCurrent] = useState("대시보드")

  return <div className="relative flex h-20 w-56 items-start gap-1 text-sm"><span>홈</span><ChevronRight aria-hidden="true" /><button type="button" className="font-medium text-primary" onClick={() => setOpen((value) => !value)}>{current}</button>{open && <Chrome className="absolute left-12 top-7 w-28 p-1 text-xs">{["대시보드", "문서", "설정"].map((item) => <button key={item} type="button" className="block w-full rounded px-2 py-1 text-left hover:bg-muted" onClick={() => { setCurrent(item); setOpen(false) }}>{item}</button>)}</Chrome>}</div>
}

function IconToggleButtonVisual() {
  const [pressed, setPressed] = useState(true)

  return <button type="button" aria-label="즐겨찾기" className={cn("flex size-11 items-center justify-center rounded-md border bg-card", pressed && "bg-primary text-primary-foreground")} onClick={() => setPressed((value) => !value)}><Heart aria-hidden="true" /></button>
}

function ResizablePanelVisual() {
  const [wide, setWide] = useState(false)

  return <button type="button" className={cn("grid h-28 w-60 overflow-hidden rounded-md border bg-card", wide ? "grid-cols-[2fr_8px_1fr]" : "grid-cols-[1fr_8px_1fr]")} onClick={() => setWide((value) => !value)}><div className="p-2"><Line className="w-20" /></div><div className="bg-muted"><div className="mx-auto mt-10 h-8 w-1 rounded bg-muted-foreground/40" /></div><div className="p-2"><Line className="w-16" /></div></button>
}

function MasterDetailVisual() {
  const [active, setActive] = useState(1)

  return <Chrome className="grid h-28 w-60 grid-cols-[88px_1fr] overflow-hidden text-xs"><div className="border-r p-1">{[0, 1, 2].map((item) => <button key={item} type="button" className={cn("mb-1 block w-full rounded px-2 py-1 text-left", active === item && "bg-primary text-primary-foreground")} onClick={() => setActive(item)}>항목 {item + 1}</button>)}</div><div className="p-3"><p className="font-medium">상세 {active + 1}</p><Line className="mt-2 w-28" /><Line className="mt-2 w-20" /></div></Chrome>
}

function StickyHeaderVisual() {
  const [scrolled, setScrolled] = useState(false)

  return <button type="button" className="h-28 w-56 overflow-hidden rounded-md border bg-card text-left" onClick={() => setScrolled((value) => !value)}><div className={cn("border-b px-3 py-2 text-xs font-medium", scrolled && "shadow-sm")}>Sticky header</div><div className={cn("p-3 transition-transform", scrolled && "-translate-y-3")}><Line className="w-36" /><Line className="mt-2 w-28" /><Line className="mt-2 w-32" /></div></button>
}

function StickyFooterBarVisual() {
  const [saved, setSaved] = useState(false)

  return <div className="relative h-28 w-56 overflow-hidden rounded-md border bg-card p-3"><Line className="w-32" /><Line className="mt-2 w-36" /><div className="absolute bottom-0 left-0 right-0 flex items-center justify-between border-t bg-background px-3 py-2"><span className="text-xs">{saved ? "저장됨" : "변경사항"}</span><button type="button" className="rounded bg-primary px-2 py-1 text-xs text-primary-foreground" onClick={() => setSaved(true)}>저장</button></div></div>
}

function SidebarSectionVisual() {
  const [active, setActive] = useState("사용자")

  return <Chrome className="w-48 p-2 text-xs">{["관리", "설정"].map((group) => <div key={group} className="mb-2"><p className="px-2 py-1 text-muted-foreground">{group}</p>{["사용자", "권한"].map((item) => <button key={`${group}-${item}`} type="button" className={cn("block w-full rounded px-2 py-1 text-left", active === item && "bg-primary text-primary-foreground")} onClick={() => setActive(item)}>{item}</button>)}</div>)}</Chrome>
}

function InlineAlertVisual() {
  const [visible, setVisible] = useState(true)

  if (!visible) return <button type="button" className="rounded border px-3 py-2 text-sm" onClick={() => setVisible(true)}>다시 보기</button>
  return <div className="flex w-56 items-start justify-between gap-2 rounded-md border bg-card p-3 text-sm"><span className="flex gap-2"><AlertTriangle aria-hidden="true" />카드 정보를 확인하세요.</span><button type="button" aria-label="닫기" onClick={() => setVisible(false)}><X aria-hidden="true" /></button></div>
}

function ErrorBoundaryVisual() {
  const [failed, setFailed] = useState(true)

  return <Chrome className="flex w-52 flex-col items-center gap-2 p-3 text-center text-sm">{failed ? <><AlertTriangle className="text-destructive" aria-hidden="true" /><span>위젯 오류</span><button type="button" className="rounded border px-2 py-1 text-xs" onClick={() => setFailed(false)}>다시 시도</button></> : <><CheckCircle2 className="text-primary" aria-hidden="true" /><span>복구됨</span></>}</Chrome>
}

function ConfirmationDialogVisual() {
  const [open, setOpen] = useState(true)
  const [deleted, setDeleted] = useState(false)

  if (!open) return <button type="button" className="rounded border px-3 py-2 text-sm" onClick={() => setOpen(true)}>{deleted ? "삭제됨" : "확인 열기"}</button>
  return <div className="relative h-28 w-56 rounded-md bg-foreground/10 p-3"><Chrome className="absolute left-1/2 top-1/2 w-44 -translate-x-1/2 -translate-y-1/2 p-3 text-xs"><p className="font-medium">정말 삭제할까요?</p><div className="mt-3 flex justify-end gap-1"><button type="button" className="rounded border px-2 py-1" onClick={() => setOpen(false)}>취소</button><button type="button" className="rounded bg-destructive px-2 py-1 text-white" onClick={() => { setDeleted(true); setOpen(false) }}>삭제</button></div></Chrome></div>
}

function RateLimitStateVisual() {
  const [seconds, setSeconds] = useState(30)

  return <Chrome className="w-52 p-3 text-sm"><p className="font-medium">잠시 후 다시 시도</p><p className="mt-1 text-xs text-muted-foreground">{seconds}초 남음</p><button type="button" className="mt-3 rounded border px-2 py-1 text-xs" onClick={() => setSeconds((value) => Math.max(0, value - 5))}>시간 줄이기</button></Chrome>
}

function DataTableToolbarVisual() {
  const [filtered, setFiltered] = useState(false)

  return <Chrome className="flex w-64 items-center gap-2 p-2 text-xs"><div className="flex flex-1 items-center gap-1 rounded border px-2 py-1"><Search aria-hidden="true" />검색</div><button type="button" className={cn("rounded border px-2 py-1", filtered && "bg-primary text-primary-foreground")} onClick={() => setFiltered((value) => !value)}>필터</button><button type="button" className="rounded border px-2 py-1">내보내기</button></Chrome>
}

function ColumnHeaderMenuVisual() {
  const [open, setOpen] = useState(true)
  const [label, setLabel] = useState("이름")

  return <div className="relative w-48"><Chrome className="flex h-9 items-center justify-between px-3 text-sm"><span>{label}</span><button type="button" onClick={() => setOpen((value) => !value)}><MoreHorizontal aria-hidden="true" /></button></Chrome>{open && <Chrome className="absolute right-0 top-10 z-10 w-28 p-1 text-xs">{["오름차순", "필터", "숨기기"].map((item) => <button key={item} type="button" className="block w-full rounded px-2 py-1 text-left hover:bg-muted" onClick={() => setLabel(item)}>{item}</button>)}</Chrome>}</div>
}

function FacetedFilterVisual() {
  const [selected, setSelected] = useState(["활성"])

  return <Chrome className="w-52 p-2 text-xs">{["상태", "유형"].map((group) => <div key={group} className="mb-2"><p className="text-muted-foreground">{group}</p>{["활성", "보류"].map((item) => <button key={`${group}-${item}`} type="button" className="mt-1 flex items-center gap-2" onClick={() => setSelected((current) => current.includes(item) ? current.filter((value) => value !== item) : [...current, item])}><span className={cn("size-3 rounded border", selected.includes(item) && "bg-primary")} />{item}</button>)}</div>)}</Chrome>
}

function StatListVisual() {
  const [highlight, setHighlight] = useState("매출")

  return <Chrome className="w-48 p-2 text-xs">{[["방문자", "12K"], ["전환", "8.1%"], ["매출", "3.2M"]].map(([label, value]) => <button key={label} type="button" className={cn("flex w-full items-center justify-between rounded px-2 py-1", highlight === label && "bg-primary text-primary-foreground")} onClick={() => setHighlight(label)}><span>{label}</span><b>{value}</b></button>)}</Chrome>
}

function ActivityFeedVisual() {
  const [active, setActive] = useState(0)

  return <Chrome className="w-56 p-2 text-xs">{["김님이 수정", "박님이 댓글", "시스템 동기화"].map((item, index) => <button key={item} type="button" className={cn("flex w-full gap-2 rounded p-1 text-left", active === index && "bg-primary/10")} onClick={() => setActive(index)}><span className="mt-1 size-2 rounded-full bg-primary" /><span>{item}<br /><span className="text-muted-foreground">{index + 1}분 전</span></span></button>)}</Chrome>
}

function MapMarkerVisual() {
  const [selected, setSelected] = useState(true)

  return <button type="button" className="relative h-28 w-48 rounded-md border bg-card" onClick={() => setSelected((value) => !value)}><div className="absolute inset-3 grid grid-cols-3 gap-2 opacity-30">{Array.from({ length: 9 }).map((_, item) => <span key={item} className="rounded bg-muted" />)}</div><MapPin className={cn("absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2", selected ? "text-primary" : "text-muted-foreground")} aria-hidden="true" /></button>
}

function ScrubberVisual() {
  const [value, setValue] = useState([42])

  return <div className="flex w-56 flex-col gap-2 text-xs"><Slider value={value} max={100} step={1} onValueChange={setValue} /><div className="flex justify-between text-muted-foreground"><span>0:00</span><span>{value[0]}%</span><span>3:20</span></div></div>
}

function RangeSliderVisual() {
  const [value, setValue] = useState([25, 75])

  return <div className="flex w-56 flex-col gap-2 text-xs"><Slider value={value} max={100} step={1} onValueChange={setValue} /><span className="text-muted-foreground">{value[0]} - {value[1]}</span></div>
}

function MultiSelectVisual() {
  const [selected, setSelected] = useState(["디자인", "개발"])
  const options = ["디자인", "개발", "기획"]

  return <Chrome className="w-56 p-2 text-xs"><div className="mb-2 flex flex-wrap gap-1">{selected.map((item) => <span key={item} className="rounded-full bg-primary px-2 py-1 text-primary-foreground">{item}</span>)}</div>{options.map((item) => <button key={item} type="button" className="flex w-full items-center gap-2 rounded px-2 py-1 text-left hover:bg-muted" onClick={() => setSelected((current) => current.includes(item) ? current.filter((value) => value !== item) : [...current, item])}><span className={cn("size-3 rounded border", selected.includes(item) && "bg-primary")} />{item}</button>)}</Chrome>
}

function TransferListVisual() {
  const [right, setRight] = useState(["B"])

  return <div className="grid w-60 grid-cols-[1fr_auto_1fr] items-center gap-2 text-xs"><Chrome className="p-1">{["A", "B", "C"].filter((item) => !right.includes(item)).map((item) => <button key={item} type="button" className="block w-full rounded px-2 py-1 text-left hover:bg-muted" onClick={() => setRight((current) => [...current, item])}>{item}</button>)}</Chrome><ChevronRight aria-hidden="true" /><Chrome className="p-1">{right.map((item) => <button key={item} type="button" className="block w-full rounded px-2 py-1 text-left hover:bg-muted" onClick={() => setRight((current) => current.filter((value) => value !== item))}>{item}</button>)}</Chrome></div>
}

function VirtualizedListVisual() {
  const [offset, setOffset] = useState(120)

  return <button type="button" className="relative h-28 w-52 overflow-hidden rounded-md border bg-card p-2 text-left text-xs" onClick={() => setOffset((value) => value + 20)}><p className="mb-2 text-muted-foreground">rows {offset}-{offset + 4}</p>{Array.from({ length: 5 }).map((_, item) => <Line key={item} className="mb-2 w-36" />)}<span className="absolute right-1 top-6 h-12 w-1 rounded bg-primary" /></button>
}

function InfiniteScrollVisual() {
  const [count, setCount] = useState(3)

  return <Chrome className="w-52 p-2 text-xs">{Array.from({ length: count }).map((_, item) => <Line key={item} className="mb-2 w-36" />)}<button type="button" className="flex items-center gap-1 text-primary" onClick={() => setCount((value) => value + 1)}><LoaderCircle className="animate-spin" aria-hidden="true" />더 불러오기</button></Chrome>
}

function PullToRefreshVisual() {
  const [refreshing, setRefreshing] = useState(false)

  return <button type="button" className="flex h-28 w-48 flex-col items-center gap-2 rounded-md border bg-card p-3 text-xs" onClick={() => setRefreshing((value) => !value)}><LoaderCircle className={cn(refreshing && "animate-spin text-primary")} aria-hidden="true" /><span>{refreshing ? "새로고침 중" : "아래로 당김"}</span><Line className="w-28" /><Line className="w-32" /></button>
}

function SwipeActionVisual() {
  const [swiped, setSwiped] = useState(true)

  return <button type="button" className="relative h-14 w-56 overflow-hidden rounded-md border bg-destructive text-left text-sm text-white" onClick={() => setSwiped((value) => !value)}><span className="absolute right-3 top-4">삭제</span><div className={cn("absolute inset-y-0 left-0 flex w-full items-center bg-card px-3 text-foreground transition-transform", swiped && "-translate-x-16")}><Line className="w-32" /></div></button>
}

function WizardVisual() {
  const [step, setStep] = useState(2)

  return <Chrome className="w-56 p-3 text-xs"><div className="mb-3 flex items-center">{[1, 2, 3].map((item) => <button key={item} type="button" className={cn("flex size-6 items-center justify-center rounded-full border", item <= step && "bg-primary text-primary-foreground")} onClick={() => setStep(item)}>{item}</button>)}</div><p className="font-medium">Step {step}</p><Line className="mt-2 w-32" /></Chrome>
}

function ToastStackVisual() {
  const [count, setCount] = useState(3)

  return <button type="button" className="relative h-24 w-52" onClick={() => setCount((value) => Math.max(1, value - 1))}>{Array.from({ length: count }).map((_, item) => <Chrome key={item} className="absolute right-0 flex w-40 items-center justify-between px-3 py-2 text-xs" style={{ top: item * 12 }}><span>알림 {item + 1}</span><X aria-hidden="true" /></Chrome>)}</button>
}

function SkeletonTableVisual() {
  return <div className="grid w-56 grid-cols-3 overflow-hidden rounded-md border bg-card text-xs">{Array.from({ length: 12 }).map((_, cell) => <div key={cell} className="h-7 border-b border-r p-1"><Line className="w-full animate-pulse" /></div>)}</div>
}

function EmptyTableVisual() {
  const [hasRow, setHasRow] = useState(false)

  return <Chrome className="w-56 overflow-hidden text-xs"><div className="grid grid-cols-3 border-b bg-muted p-1"><span>이름</span><span>상태</span><span>액션</span></div><div className="flex h-20 flex-col items-center justify-center gap-2 p-2">{hasRow ? <Line className="w-40" /> : <><span>데이터가 없습니다</span><button type="button" className="rounded border px-2 py-1" onClick={() => setHasRow(true)}>추가</button></>}</div></Chrome>
}

function TableDensityControlVisual() {
  const [compact, setCompact] = useState(true)

  return <Chrome className="w-56 p-2 text-xs"><div className="mb-2 flex gap-1"><button type="button" className={cn("rounded border px-2 py-1", compact && "bg-primary text-primary-foreground")} onClick={() => setCompact(true)}>Compact</button><button type="button" className={cn("rounded border px-2 py-1", !compact && "bg-primary text-primary-foreground")} onClick={() => setCompact(false)}>Comfort</button></div>{[0, 1, 2].map((item) => <Line key={item} className={cn("mb-1 w-40", compact ? "h-2" : "h-4")} />)}</Chrome>
}

function ColumnVisibilityMenuVisual() {
  const [visible, setVisible] = useState(["이름", "상태"])
  const cols = ["이름", "상태", "역할"]

  return <Chrome className="w-52 p-2 text-xs">{cols.map((col) => <button key={col} type="button" className="flex w-full items-center gap-2 rounded px-2 py-1 hover:bg-muted" onClick={() => setVisible((current) => current.includes(col) ? current.filter((item) => item !== col) : [...current, col])}><span className={cn("size-3 rounded border", visible.includes(col) && "bg-primary")} />{col}</button>)}<p className="mt-2 text-muted-foreground">{visible.length} columns</p></Chrome>
}

function SavedViewTabsVisual() {
  const [active, setActive] = useState("내 작업")

  return <Chrome className="w-56 p-2 text-xs"><div className="flex gap-1">{["전체", "내 작업", "보관됨"].map((tab) => <button key={tab} type="button" className={cn("rounded px-2 py-1", active === tab ? "bg-primary text-primary-foreground" : "bg-muted")} onClick={() => setActive(tab)}>{tab}</button>)}</div><Line className="mt-3 w-36" /></Chrome>
}

function FilterPanelVisual() {
  const [open, setOpen] = useState(true)

  return <div className="relative h-28 w-56 rounded-md border bg-card p-2"><button type="button" className="rounded border px-2 py-1 text-xs" onClick={() => setOpen((value) => !value)}>필터</button>{open && <div className="absolute bottom-0 right-0 top-0 w-32 border-l bg-background p-2 text-xs"><p className="font-medium">상태</p><Line className="mt-2 w-20" /><button type="button" className="mt-3 rounded bg-primary px-2 py-1 text-primary-foreground">적용</button></div>}</div>
}

function AdvancedFilterBuilderVisual() {
  const [conditions, setConditions] = useState(2)

  return <Chrome className="w-60 p-2 text-xs">{Array.from({ length: conditions }).map((_, item) => <div key={item} className="mb-1 grid grid-cols-3 gap-1"><span className="rounded border px-1 py-1">상태</span><span className="rounded border px-1 py-1">=</span><span className="rounded border px-1 py-1">활성</span></div>)}<button type="button" className="mt-1 rounded border px-2 py-1" onClick={() => setConditions((value) => value + 1)}>조건 추가</button></Chrome>
}

function QueryBuilderVisual() {
  const [mode, setMode] = useState("AND")

  return <Chrome className="w-60 p-2 text-xs"><button type="button" className="mb-2 rounded bg-primary px-2 py-1 text-primary-foreground" onClick={() => setMode((value) => value === "AND" ? "OR" : "AND")}>{mode}</button><div className="ml-3 border-l pl-2"><Line className="mb-2 w-32" /><Line className="w-24" /></div></Chrome>
}

function GroupedListVisual() {
  const [active, setActive] = useState("오늘")

  return <Chrome className="w-52 p-2 text-xs">{["오늘", "어제"].map((group) => <div key={group}><button type="button" className={cn("mb-1 font-medium", active === group && "text-primary")} onClick={() => setActive(group)}>{group}</button><Line className="mb-2 ml-2 w-32" /></div>)}</Chrome>
}

function NestedListVisual() {
  const [open, setOpen] = useState(true)

  return <Chrome className="w-52 p-2 text-xs"><button type="button" className="font-medium" onClick={() => setOpen((value) => !value)}>작업</button>{open && <><Line className="ml-4 mt-2 w-32" /><Line className="ml-4 mt-2 w-24" /></>}</Chrome>
}

function DraggableListVisual() {
  const [moved, setMoved] = useState(false)
  const rows = moved ? ["B", "A", "C"] : ["A", "B", "C"]

  return <Chrome className="w-48 p-2 text-xs">{rows.map((row) => <button key={row} type="button" className="mb-1 flex w-full items-center gap-2 rounded border px-2 py-1" onClick={() => setMoved((value) => !value)}><ReorderDots />항목 {row}</button>)}</Chrome>
}

function ReorderHandleVisual() {
  const [dragging, setDragging] = useState(false)

  return <button type="button" className={cn("flex items-center gap-3 rounded-md border bg-card px-3 py-2 text-sm", dragging && "ring-2 ring-ring")} onClick={() => setDragging((value) => !value)}><ReorderDots />드래그</button>
}

function ReorderDots() {
  return <span className="grid grid-cols-2 gap-0.5">{Array.from({ length: 6 }).map((_, dot) => <span key={dot} className="size-1 rounded-full bg-muted-foreground" />)}</span>
}

function SelectionSummaryVisual() {
  const [count, setCount] = useState(3)

  return <Chrome className="flex w-56 items-center justify-between px-3 py-2 text-xs"><button type="button" onClick={() => setCount((value) => value + 1)}>{count}개 선택됨</button><button type="button" className="text-primary" onClick={() => setCount(0)}>해제</button></Chrome>
}

function ComparisonTableVisual() {
  const [selected, setSelected] = useState(1)

  return <div className="grid w-60 grid-cols-3 overflow-hidden rounded-md border text-xs">{["Basic", "Pro", "Team"].map((plan, index) => <button key={plan} type="button" className={cn("border-r p-2 text-left last:border-r-0", selected === index && "bg-primary/10")} onClick={() => setSelected(index)}><b>{plan}</b><Line className="mt-2 w-12" /><Check className="mt-2 text-primary" aria-hidden="true" /></button>)}</div>
}

function PivotTableVisual() {
  const [highlight, setHighlight] = useState(4)

  return <div className="grid w-56 grid-cols-4 overflow-hidden rounded-md border text-xs">{Array.from({ length: 12 }).map((_, cell) => <button key={cell} type="button" className={cn("h-7 border-b border-r p-1", cell === highlight && "bg-primary text-primary-foreground")} onClick={() => setHighlight(cell)}>{cell % 4 === 0 ? "합계" : ""}</button>)}</div>
}

function TreeTableVisual() {
  const [open, setOpen] = useState(true)

  return <Chrome className="w-56 p-2 text-xs"><button type="button" className="flex w-full items-center gap-1" onClick={() => setOpen((value) => !value)}><ChevronDown aria-hidden="true" />components <Line className="ml-auto w-16" /></button>{open && <div className="ml-4"><Line className="mt-2 w-36" /><Line className="mt-2 w-32" /></div>}</Chrome>
}

function ExpandableRowVisual() {
  const [open, setOpen] = useState(true)

  return <Chrome className="w-56 p-2 text-xs"><button type="button" className="flex w-full items-center gap-2" onClick={() => setOpen((value) => !value)}><ChevronDown aria-hidden="true" />주문 #42</button>{open && <div className="mt-2 rounded bg-muted p-2"><Line className="w-32" /></div>}</Chrome>
}

function DetailRowVisual() {
  const [open, setOpen] = useState(true)

  return <Chrome className="w-56 p-2 text-xs"><button type="button" className="w-full text-left" onClick={() => setOpen((value) => !value)}>사용자 행</button>{open && <div className="mt-2 grid grid-cols-2 gap-1 rounded bg-muted p-2"><span>역할</span><span>관리자</span><span>지역</span><span>서울</span></div>}</Chrome>
}

function AuditLogVisual() {
  const [active, setActive] = useState(0)

  return <Chrome className="w-56 p-2 text-xs">{["권한 변경", "로그인", "설정 수정"].map((item, index) => <button key={item} type="button" className={cn("mb-1 block w-full rounded px-2 py-1 text-left", active === index && "bg-primary/10")} onClick={() => setActive(index)}>{item} · {index + 1}:00</button>)}</Chrome>
}

function WorkspaceSwitcherVisual() {
  const [workspace, setWorkspace] = useState("Team A")

  return <Chrome className="w-48 p-2 text-xs"><div className="mb-2 flex w-full items-center gap-2 rounded border px-2 py-1"><span className="flex size-6 items-center justify-center rounded bg-primary text-primary-foreground"><BookOpen aria-hidden="true" /></span>{workspace}</div>{["Team A", "Team B"].map((item) => <button key={item} type="button" className="block w-full rounded px-2 py-1 text-left hover:bg-muted" onClick={() => setWorkspace(item)}>{item}</button>)}</Chrome>
}

function AccountSwitcherVisual() {
  const [account, setAccount] = useState("yusun")

  return <Chrome className="w-48 p-2 text-xs"><div className="mb-2 flex items-center gap-2"><span className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground"><User aria-hidden="true" /></span><span>{account}</span></div>{["yusun", "work"].map((item) => <button key={item} type="button" className="block w-full rounded px-2 py-1 text-left hover:bg-muted" onClick={() => setAccount(item)}>{item}@mail</button>)}</Chrome>
}

function GlobalHeaderVisual() {
  const [active, setActive] = useState("문서")

  return <Chrome className="flex h-12 w-64 items-center gap-3 px-3 text-xs"><span className="flex size-7 items-center justify-center rounded bg-primary text-primary-foreground"><BookOpen aria-hidden="true" /></span><div className="flex gap-1">{["홈", "문서", "팀"].map((item) => <button key={item} type="button" className={cn("rounded px-2 py-1", active === item && "bg-primary/10 text-primary")} onClick={() => setActive(item)}>{item}</button>)}</div><div className="ml-auto flex items-center gap-2"><Search aria-hidden="true" /><Bell aria-hidden="true" /><User aria-hidden="true" /></div></Chrome>
}

function UtilityBarVisual() {
  const [view, setView] = useState("표")

  return <Chrome className="flex w-60 items-center gap-2 px-2 py-1 text-xs"><button type="button" className="rounded border px-2 py-1" onClick={() => setView(view === "표" ? "카드" : "표")}>{view}</button><button type="button" className="rounded border px-2 py-1">필터</button><span className="ml-auto flex items-center gap-1 text-muted-foreground"><CheckCircle2 aria-hidden="true" />동기화됨</span></Chrome>
}

function CommandBarVisual() {
  const [saved, setSaved] = useState(false)

  return <Chrome className="flex w-60 items-center gap-1 px-2 py-1 text-xs"><button type="button" className={cn("rounded px-2 py-1", saved ? "bg-primary text-primary-foreground" : "border")} onClick={() => setSaved(true)}>저장</button><button type="button" className="rounded border px-2 py-1"><Share2 aria-hidden="true" /></button><button type="button" className="rounded border px-2 py-1"><Copy aria-hidden="true" /></button><button type="button" className="rounded border px-2 py-1 text-destructive"><Trash2 aria-hidden="true" /></button><button type="button" className="ml-auto rounded border px-2 py-1"><MoreHorizontal aria-hidden="true" /></button></Chrome>
}

function StatusBarVisual() {
  const [online, setOnline] = useState(true)

  return <Chrome className="flex w-64 items-center gap-3 px-3 py-1 text-xs"><button type="button" className="flex items-center gap-1" onClick={() => setOnline((value) => !value)}><span className={cn("size-2 rounded-full", online ? "bg-primary" : "bg-muted-foreground")} />{online ? "Online" : "Offline"}</button><span>저장됨</span><span className="ml-auto">3 selected</span></Chrome>
}

function BreadcrumbHeaderVisual() {
  const [section, setSection] = useState("설정")

  return <Chrome className="w-60 p-3 text-xs"><div className="mb-2 flex items-center gap-1 text-muted-foreground"><span>홈</span><ChevronRight aria-hidden="true" /><button type="button" className="text-primary" onClick={() => setSection(section === "설정" ? "권한" : "설정")}>{section}</button></div><p className="text-sm font-medium">{section} 관리</p><Line className="mt-2 w-36" /></Chrome>
}

function PageTitleBarVisual() {
  const [created, setCreated] = useState(false)

  return <Chrome className="flex w-64 items-center justify-between p-3 text-xs"><div><p className="text-sm font-medium">프로젝트</p><Line className="mt-2 w-28" /></div><button type="button" className={cn("rounded px-3 py-1", created ? "border" : "bg-primary text-primary-foreground")} onClick={() => setCreated(true)}>{created ? "생성됨" : "새로 만들기"}</button></Chrome>
}

function ContentTabsVisual() {
  const [active, setActive] = useState("활동")

  return <Chrome className="w-56 p-2 text-xs"><div className="mb-3 flex border-b">{["개요", "활동", "설정"].map((tab) => <button key={tab} type="button" className={cn("px-2 py-1", active === tab && "border-b-2 border-primary text-primary")} onClick={() => setActive(tab)}>{tab}</button>)}</div><p className="font-medium">{active}</p><Line className="mt-2 w-32" /></Chrome>
}

function RightRailVisual() {
  const [hidden, setHidden] = useState(false)

  return <div className="grid h-28 w-60 grid-cols-[1fr_auto] overflow-hidden rounded-md border bg-card text-xs"><div className="p-3"><Line className="w-28" /><Line className="mt-2 w-36" /></div>{!hidden && <aside className="w-20 border-l bg-muted/40 p-2"><button type="button" className="mb-2 rounded border bg-background px-2 py-1" onClick={() => setHidden(true)}>숨김</button><Line className="w-12" /><Line className="mt-2 w-10" /></aside>}</div>
}

function InspectorPanelVisual() {
  const [selected, setSelected] = useState("카드")

  return <Chrome className="grid h-28 w-60 grid-cols-[1fr_92px] overflow-hidden text-xs"><div className="flex items-center justify-center bg-muted/30"><button type="button" className="rounded border bg-background px-3 py-2" onClick={() => setSelected(selected === "카드" ? "이미지" : "카드")}>{selected}</button></div><aside className="border-l p-2"><p className="font-medium">{selected}</p><Line className="mt-2 w-14" /><Line className="mt-2 w-10" /></aside></Chrome>
}

function PropertiesPanelVisual() {
  const [visible, setVisible] = useState(true)

  return <Chrome className="w-52 p-2 text-xs"><p className="font-medium">속성</p><label className="mt-2 flex items-center justify-between gap-3">공개<Switch checked={visible} onCheckedChange={setVisible} /></label><div className="mt-2 rounded border px-2 py-1">색상 · Primary</div><div className="mt-1 rounded border px-2 py-1">크기 · 24</div></Chrome>
}

function PreviewPaneVisual() {
  const [item, setItem] = useState(1)

  return <Chrome className="grid h-28 w-60 grid-cols-[82px_1fr] overflow-hidden text-xs"><div className="border-r p-1">{[1, 2, 3].map((row) => <button key={row} type="button" className={cn("mb-1 block w-full rounded px-2 py-1 text-left", item === row && "bg-primary text-primary-foreground")} onClick={() => setItem(row)}>파일 {row}</button>)}</div><div className="p-3"><p className="font-medium">Preview {item}</p><Line className="mt-2 w-28" /><Line className="mt-2 w-20" /></div></Chrome>
}

function CanvasToolbarVisual() {
  const [tool, setTool] = useState("선택")

  return <div className="relative h-28 w-56 rounded-md border bg-card p-2"><div className="absolute left-2 top-2 flex flex-col gap-1 rounded border bg-background p-1">{["선택", "펜", "도형"].map((item) => <button key={item} type="button" className={cn("rounded px-2 py-1 text-xs", tool === item && "bg-primary text-primary-foreground")} onClick={() => setTool(item)}>{item.slice(0, 1)}</button>)}</div><div className="ml-14 mt-2 h-20 rounded bg-muted/60 p-3 text-xs">{tool} 도구</div></div>
}

function FloatingPanelVisual() {
  const [moved, setMoved] = useState(false)

  return <div className="relative h-28 w-56 rounded-md border bg-muted/40"><Chrome className={cn("absolute w-36 p-2 text-xs transition-all", moved ? "right-3 top-8" : "left-3 top-3")}><button type="button" className="mb-2 flex items-center gap-2" onClick={() => setMoved((value) => !value)}><ReorderDots />이동</button><Line className="w-24" /></Chrome></div>
}

function DockablePanelVisual() {
  const [docked, setDocked] = useState(true)

  return <div className="relative h-28 w-56 rounded-md border bg-card p-2 text-xs"><button type="button" className="rounded border px-2 py-1" onClick={() => setDocked((value) => !value)}>{docked ? "Undock" : "Dock"}</button><Chrome className={cn("p-2", docked ? "absolute bottom-0 right-0 top-0 w-20 rounded-none border-y-0 border-r-0" : "absolute left-14 top-8 w-28")}><Line className="w-12" /><Line className="mt-2 w-10" /></Chrome></div>
}

function CollapsibleSidebarVisual() {
  const [collapsed, setCollapsed] = useState(false)

  return <Chrome className={cn("grid h-28 overflow-hidden text-xs transition-all", collapsed ? "w-36 grid-cols-[38px_1fr]" : "w-60 grid-cols-[96px_1fr]")}><aside className="border-r p-2"><button type="button" className="mb-2 rounded border px-2 py-1" onClick={() => setCollapsed((value) => !value)}><Menu aria-hidden="true" /></button>{[Home, Search, Settings].map((Icon, index) => <div key={index} className="mb-2 flex items-center gap-2"><Icon aria-hidden="true" />{!collapsed && <Line className="w-10" />}</div>)}</aside><main className="p-3"><Line className="w-24" /></main></Chrome>
}

function MiniSidebarVisual() {
  const [active, setActive] = useState(1)

  return <Chrome className="grid h-28 w-40 grid-cols-[40px_1fr] overflow-hidden text-xs"><aside className="flex flex-col items-center gap-2 border-r p-2">{[Home, Search, Settings].map((Icon, index) => <button key={index} type="button" className={cn("rounded p-1", active === index && "bg-primary text-primary-foreground")} onClick={() => setActive(index)}><Icon aria-hidden="true" /></button>)}</aside><main className="p-3"><Line className="w-16" /><Line className="mt-2 w-12" /></main></Chrome>
}

function ResponsiveStackVisual() {
  const [stacked, setStacked] = useState(false)

  return <button type="button" className={cn("grid w-56 gap-2 rounded-md border bg-card p-2 transition-all", stacked ? "grid-cols-1" : "grid-cols-3")} onClick={() => setStacked((value) => !value)}>{[0, 1, 2].map((item) => <div key={item} className="h-10 rounded bg-muted" />)}<span className="sr-only">responsive stack toggle</span></button>
}

function PhoneFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("relative h-36 w-20 overflow-hidden rounded-[1.25rem] border-2 bg-card p-1 shadow-sm", className)}>
      <div className="absolute left-1/2 top-1 h-1 w-7 -translate-x-1/2 rounded-full bg-foreground/20" />
      <div className="h-full overflow-hidden rounded-[1rem] bg-background pt-2 text-[8px]">{children}</div>
      <div className="absolute bottom-1 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-foreground/20" />
    </div>
  )
}

function MobileScreenLines() {
  return (
    <div className="flex flex-col gap-1 p-2">
      <Line className="w-12" />
      <Line className="w-10" />
      <div className="h-8 rounded bg-muted/70" />
      <Line className="w-11" />
    </div>
  )
}

function SafeAreaVisual() {
  const [highlight, setHighlight] = useState(true)

  return (
    <button type="button" onClick={() => setHighlight((value) => !value)}>
      <PhoneFrame>
        <div className={cn("h-3 border-b", highlight && "bg-primary/20")} />
        <MobileScreenLines />
        <div className={cn("absolute inset-x-2 bottom-2 h-3 rounded-full border", highlight && "bg-primary/20")} />
      </PhoneFrame>
    </button>
  )
}

function MobileStatusBarVisual() {
  const [battery, setBattery] = useState(72)

  return (
    <button type="button" onClick={() => setBattery((value) => value === 72 ? 24 : 72)}>
      <PhoneFrame>
        <div className="flex h-4 items-center justify-between px-2 text-[7px] font-medium">
          <span>9:41</span>
          <span className="flex items-center gap-0.5">
            <span className="h-1.5 w-2 rounded-sm bg-foreground/70" />
            {battery}%
          </span>
        </div>
        <MobileScreenLines />
      </PhoneFrame>
    </button>
  )
}

function MobileAppBarVisual() {
  const [title, setTitle] = useState("홈")

  return (
    <PhoneFrame>
      <div className="flex h-6 items-center gap-1 border-b px-2">
        <button type="button" onClick={() => setTitle(title === "홈" ? "검색" : "홈")}><Menu aria-hidden="true" /></button>
        <span className="font-medium">{title}</span>
        <MoreHorizontal className="ml-auto" aria-hidden="true" />
      </div>
      <MobileScreenLines />
    </PhoneFrame>
  )
}

function LargeTitleHeaderVisual() {
  const [compact, setCompact] = useState(false)

  return (
    <button type="button" onClick={() => setCompact((value) => !value)}>
      <PhoneFrame>
        <div className={cn("border-b px-2 transition-all", compact ? "h-6 py-1" : "h-12 py-4")}>
          <p className={cn("font-semibold", compact ? "text-[8px]" : "text-[12px]")}>Today</p>
        </div>
        <MobileScreenLines />
      </PhoneFrame>
    </button>
  )
}

function BottomAppBarVisual() {
  const [active, setActive] = useState(false)

  return (
    <PhoneFrame>
      <MobileScreenLines />
      <div className="absolute inset-x-1 bottom-1 flex h-7 items-center justify-between rounded-b-[1rem] border-t bg-background px-2">
        <Menu aria-hidden="true" />
        <button type="button" className={cn("flex size-5 items-center justify-center rounded-full", active ? "bg-primary text-primary-foreground" : "bg-muted")} onClick={() => setActive((value) => !value)}>
          <Plus aria-hidden="true" />
        </button>
      </div>
    </PhoneFrame>
  )
}

function MobileSearchHeaderVisual() {
  const [query, setQuery] = useState("")

  return (
    <PhoneFrame>
      <div className="flex h-7 items-center gap-1 border-b px-1">
        <Search aria-hidden="true" />
        <input
          aria-label="mobile search"
          className="min-w-0 flex-1 bg-transparent text-[8px] outline-none"
          value={query}
          placeholder="검색"
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      <div className="p-2">{query ? <Line className="w-11 bg-primary/40" /> : <MobileScreenLines />}</div>
    </PhoneFrame>
  )
}

function MobileSegmentedTabsVisual() {
  const [active, setActive] = useState("전체")

  return (
    <PhoneFrame>
      <div className="p-2">
        <div className="grid grid-cols-3 rounded-full bg-muted p-0.5">
          {["전체", "인기", "내 글"].map((item) => (
            <button key={item} type="button" className={cn("rounded-full py-0.5", active === item && "bg-background shadow-sm")} onClick={() => setActive(item)}>
              {item}
            </button>
          ))}
        </div>
        <p className="mt-2 font-medium">{active}</p>
        <Line className="mt-1 w-12" />
      </div>
    </PhoneFrame>
  )
}

function StandardBottomSheetVisual() {
  const [open, setOpen] = useState(true)

  return (
    <PhoneFrame>
      <MobileScreenLines />
      <button type="button" className="absolute left-2 top-7 rounded border bg-background px-1 py-0.5" onClick={() => setOpen((value) => !value)}>
        필터
      </button>
      {open && (
        <div className="absolute inset-x-1 bottom-1 rounded-t-xl border bg-background p-2 shadow-sm">
          <div className="mx-auto mb-2 h-0.5 w-6 rounded bg-muted-foreground/40" />
          <Line className="w-12" />
          <Line className="mt-1 w-10" />
        </div>
      )}
    </PhoneFrame>
  )
}

function ModalBottomSheetVisual() {
  const [open, setOpen] = useState(true)

  return (
    <PhoneFrame>
      <MobileScreenLines />
      <button type="button" className="absolute left-2 top-7 rounded border bg-background px-1 py-0.5" onClick={() => setOpen((value) => !value)}>
        열기
      </button>
      {open && (
        <>
          <div className="absolute inset-1 rounded-[1rem] bg-foreground/25" />
          <div className="absolute inset-x-1 bottom-1 rounded-t-xl border bg-background p-2 shadow-sm">
            <div className="mx-auto mb-2 h-0.5 w-6 rounded bg-muted-foreground/40" />
            <p className="font-medium">선택</p>
            <button type="button" className="mt-2 rounded bg-primary px-2 py-1 text-primary-foreground" onClick={() => setOpen(false)}>확인</button>
          </div>
        </>
      )}
    </PhoneFrame>
  )
}

function ActionSheetVisual() {
  const [picked, setPicked] = useState("공유")

  return (
    <PhoneFrame>
      <MobileScreenLines />
      <div className="absolute inset-x-1 bottom-1 rounded-xl border bg-background p-1.5 shadow-sm">
        {["복사", "공유", "삭제"].map((item) => (
          <button key={item} type="button" className={cn("block w-full rounded px-2 py-1 text-left", picked === item && "bg-primary/10 text-primary")} onClick={() => setPicked(item)}>
            {item}
          </button>
        ))}
      </div>
    </PhoneFrame>
  )
}

function ShareSheetVisual() {
  const [target, setTarget] = useState("메시지")

  return (
    <PhoneFrame>
      <MobileScreenLines />
      <div className="absolute inset-x-1 bottom-1 rounded-xl border bg-background p-1.5 shadow-sm">
        <div className="mb-1 flex items-center gap-1 font-medium"><Share2 aria-hidden="true" />공유</div>
        <div className="grid grid-cols-3 gap-1">
          {["메시지", "메일", "링크"].map((item) => (
            <button key={item} type="button" className={cn("rounded border px-1 py-1", target === item && "bg-primary text-primary-foreground")} onClick={() => setTarget(item)}>
              {item.slice(0, 1)}
            </button>
          ))}
        </div>
      </div>
    </PhoneFrame>
  )
}

function FullScreenDialogVisual() {
  const [done, setDone] = useState(false)

  return (
    <PhoneFrame>
      <div className="flex h-6 items-center gap-1 border-b px-2">
        <X aria-hidden="true" />
        <span className="font-medium">{done ? "완료" : "편집"}</span>
        <button type="button" className="ml-auto text-primary" onClick={() => setDone(true)}>저장</button>
      </div>
      <div className="p-2">
        <Line className="w-12" />
        <Line className="mt-2 w-10" />
        <div className="mt-2 h-10 rounded border bg-muted/40" />
      </div>
    </PhoneFrame>
  )
}

function PermissionPromptMobileVisual() {
  const [allowed, setAllowed] = useState(false)

  return (
    <PhoneFrame>
      <div className="absolute inset-1 rounded-[1rem] bg-foreground/20" />
      <div className="absolute left-2 right-2 top-10 rounded-lg border bg-background p-2 text-center shadow-sm">
        <Bell aria-hidden="true" className="mx-auto mb-1" />
        <p className="font-medium">{allowed ? "허용됨" : "알림 허용?"}</p>
        <button type="button" className="mt-2 rounded bg-primary px-2 py-1 text-primary-foreground" onClick={() => setAllowed(true)}>허용</button>
      </div>
    </PhoneFrame>
  )
}

function PermissionEducationScreenVisual() {
  const [ready, setReady] = useState(false)

  return (
    <PhoneFrame>
      <div className="flex h-full flex-col items-center justify-center gap-2 p-2 text-center">
        <Bell aria-hidden="true" className="text-primary" />
        <p className="font-medium">{ready ? "요청 준비" : "알림을 받아보세요"}</p>
        <Line className="w-12" />
        <button type="button" className="rounded bg-primary px-2 py-1 text-primary-foreground" onClick={() => setReady(true)}>계속</button>
      </div>
    </PhoneFrame>
  )
}

function MobileSnackbarVisual() {
  const [visible, setVisible] = useState(true)

  return (
    <PhoneFrame>
      <MobileScreenLines />
      {visible ? (
        <div className="absolute inset-x-2 bottom-4 flex items-center justify-between rounded bg-foreground px-2 py-1 text-background shadow-sm">
          <span>저장됨</span>
          <button type="button" onClick={() => setVisible(false)}>닫기</button>
        </div>
      ) : (
        <button type="button" className="absolute bottom-4 left-3 rounded border bg-background px-2 py-1" onClick={() => setVisible(true)}>보기</button>
      )}
    </PhoneFrame>
  )
}

function MobileToastVisual() {
  const [visible, setVisible] = useState(true)

  return (
    <PhoneFrame>
      <MobileScreenLines />
      {visible ? (
        <button type="button" className="absolute left-1/2 top-12 -translate-x-1/2 rounded-full bg-foreground px-2 py-1 text-background shadow-sm" onClick={() => setVisible(false)}>
          복사됨
        </button>
      ) : (
        <button type="button" className="absolute left-3 top-12 rounded border bg-background px-2 py-1" onClick={() => setVisible(true)}>토스트</button>
      )}
    </PhoneFrame>
  )
}

function MobileAlertDialogVisual() {
  const [open, setOpen] = useState(true)

  return (
    <PhoneFrame>
      <MobileScreenLines />
      {open ? (
        <>
          <div className="absolute inset-1 rounded-[1rem] bg-foreground/20" />
          <div className="absolute left-2 right-2 top-10 rounded-lg border bg-background p-2 shadow-sm">
            <p className="font-medium">삭제할까요?</p>
            <div className="mt-2 flex justify-end gap-1">
              <button type="button" className="rounded border px-1 py-0.5" onClick={() => setOpen(false)}>취소</button>
              <button type="button" className="rounded bg-destructive px-1 py-0.5 text-white" onClick={() => setOpen(false)}>삭제</button>
            </div>
          </div>
        </>
      ) : (
        <button type="button" className="absolute left-3 top-10 rounded border bg-background px-2 py-1" onClick={() => setOpen(true)}>알림</button>
      )}
    </PhoneFrame>
  )
}

function MobilePopoverMenuVisual() {
  const [open, setOpen] = useState(true)

  return (
    <PhoneFrame>
      <div className="flex h-6 items-center border-b px-2">
        <span className="font-medium">상세</span>
        <button type="button" className="ml-auto" onClick={() => setOpen((value) => !value)}><MoreHorizontal aria-hidden="true" /></button>
      </div>
      <MobileScreenLines />
      {open && (
        <div className="absolute right-2 top-7 rounded-md border bg-background p-1 shadow-sm">
          {["수정", "공유", "삭제"].map((item) => <div key={item} className="px-2 py-1">{item}</div>)}
        </div>
      )}
    </PhoneFrame>
  )
}

function SheetDragHandleVisual() {
  const [expanded, setExpanded] = useState(false)

  return (
    <PhoneFrame>
      <MobileScreenLines />
      <button type="button" className={cn("absolute inset-x-1 bottom-1 rounded-t-xl border bg-background p-2 shadow-sm transition-all", expanded ? "h-24" : "h-12")} onClick={() => setExpanded((value) => !value)}>
        <span className="mx-auto mb-2 block h-0.5 w-7 rounded bg-muted-foreground/50" />
        <Line className="w-12" />
        {expanded && <Line className="mt-2 w-10" />}
      </button>
    </PhoneFrame>
  )
}

function PullToRefreshIndicatorVisual() {
  const [pulled, setPulled] = useState(true)

  return (
    <button type="button" onClick={() => setPulled((value) => !value)}>
      <PhoneFrame>
        <div className={cn("flex justify-center transition-all", pulled ? "h-7 pt-3" : "h-3 pt-1")}>
          <LoaderCircle className={cn(pulled && "animate-spin text-primary")} aria-hidden="true" />
        </div>
        <MobileScreenLines />
      </PhoneFrame>
    </button>
  )
}

function SwipeToDeleteVisual() {
  const [revealed, setRevealed] = useState(true)

  return (
    <PhoneFrame>
      <div className="p-2">
        {[0, 1, 2].map((row) => (
          <button key={row} type="button" className="relative mb-1 block h-6 w-full overflow-hidden rounded border bg-muted/40" onClick={() => setRevealed((value) => !value)}>
            {row === 1 && revealed && <span className="absolute inset-y-0 right-0 flex w-7 items-center justify-center bg-destructive text-white"><Trash2 aria-hidden="true" /></span>}
            <span className={cn("absolute inset-y-0 left-0 right-0 flex items-center bg-background px-2 transition-transform", row === 1 && revealed && "-translate-x-6")}>
              항목
            </span>
          </button>
        ))}
      </div>
    </PhoneFrame>
  )
}

function SwipeActionRowVisual() {
  const [side, setSide] = useState<"left" | "right">("right")

  return (
    <PhoneFrame>
      <div className="p-2">
        <button type="button" className="relative h-8 w-full overflow-hidden rounded border bg-muted/40" onClick={() => setSide((value) => value === "right" ? "left" : "right")}>
          {side === "left" && <span className="absolute inset-y-0 left-0 flex w-7 items-center justify-center bg-primary text-primary-foreground"><Check aria-hidden="true" /></span>}
          {side === "right" && <span className="absolute inset-y-0 right-0 flex w-7 items-center justify-center bg-destructive text-white"><Trash2 aria-hidden="true" /></span>}
          <span className={cn("absolute inset-y-0 left-0 right-0 flex items-center bg-background px-2 transition-transform", side === "left" ? "translate-x-6" : "-translate-x-6")}>메시지</span>
        </button>
        <Line className="mt-2 w-12" />
      </div>
    </PhoneFrame>
  )
}

function LongPressMenuVisual() {
  const [open, setOpen] = useState(true)

  return (
    <PhoneFrame>
      <div className="p-2">
        <button type="button" className="rounded border bg-muted/50 px-2 py-2" onClick={() => setOpen((value) => !value)}>
          길게 누름
        </button>
        {open && <div className="mt-1 rounded-md border bg-background p-1 shadow-sm">{["복사", "공유", "삭제"].map((item) => <div key={item} className="px-2 py-1">{item}</div>)}</div>}
      </div>
    </PhoneFrame>
  )
}

function DragToReorderListVisual() {
  const [moved, setMoved] = useState(false)
  const rows = moved ? ["B", "A", "C"] : ["A", "B", "C"]

  return (
    <PhoneFrame>
      <div className="p-2">
        {rows.map((row, index) => (
          <button key={row} type="button" className={cn("mb-1 flex h-6 w-full items-center gap-1 rounded border bg-background px-1 transition-transform", moved && index === 0 && "bg-primary/10")} onClick={() => setMoved((value) => !value)}>
            <ReorderDots />
            <span>항목 {row}</span>
          </button>
        ))}
      </div>
    </PhoneFrame>
  )
}

function GrabHandleVisual() {
  const [active, setActive] = useState(false)

  return (
    <button type="button" className={cn("flex h-20 w-36 items-center justify-center gap-2 rounded-md border bg-card text-xs", active && "border-primary bg-primary/10")} onClick={() => setActive((value) => !value)}>
      <ReorderDots />
      <span>{active ? "드래그 중" : "잡는 핸들"}</span>
    </button>
  )
}

function PageControlVisual() {
  const [page, setPage] = useState(1)

  return (
    <PhoneFrame>
      <div className="flex h-full flex-col justify-end p-2">
        <div className="mb-4 h-16 rounded bg-muted/70" />
        <div className="flex justify-center gap-1">
          {[0, 1, 2, 3].map((item) => (
            <button key={item} type="button" className={cn("h-1.5 rounded-full transition-all", page === item ? "w-4 bg-primary" : "w-1.5 bg-muted-foreground/40")} onClick={() => setPage(item)}>
              <span className="sr-only">page {item + 1}</span>
            </button>
          ))}
        </div>
      </div>
    </PhoneFrame>
  )
}

function CarouselPeekVisual() {
  const [active, setActive] = useState(0)

  return (
    <PhoneFrame>
      <div className="flex h-full items-center gap-2 overflow-hidden pl-2">
        {[0, 1, 2].map((item) => (
          <button key={item} type="button" className={cn("h-20 w-14 shrink-0 rounded-lg border bg-muted/60", active === item && "bg-primary/20")} onClick={() => setActive(item)}>
            <span className="sr-only">card {item + 1}</span>
          </button>
        ))}
      </div>
    </PhoneFrame>
  )
}

function EdgeSwipeBackVisual() {
  const [offset, setOffset] = useState(false)

  return (
    <PhoneFrame>
      <button type="button" className="relative h-full w-full overflow-hidden" onClick={() => setOffset((value) => !value)}>
        <div className="absolute inset-y-0 left-0 flex w-4 items-center justify-center bg-primary/10"><ChevronLeft aria-hidden="true" /></div>
        <div className={cn("h-full bg-background transition-transform", offset && "translate-x-5")}>
          <MobileScreenLines />
        </div>
      </button>
    </PhoneFrame>
  )
}

function PinchZoomViewerVisual() {
  const [zoomed, setZoomed] = useState(false)

  return (
    <PhoneFrame>
      <button type="button" className="relative flex h-full items-center justify-center overflow-hidden bg-muted/40" onClick={() => setZoomed((value) => !value)}>
        <div className={cn("rounded border bg-background transition-all", zoomed ? "h-28 w-28" : "h-16 w-14")}>
          <ImageIcon className="m-auto mt-5 text-muted-foreground" aria-hidden="true" />
        </div>
        <span className="absolute bottom-3 rounded-full bg-background/90 px-2 py-0.5">{zoomed ? "200%" : "100%"}</span>
      </button>
    </PhoneFrame>
  )
}

function ScrimVisual() {
  const [visible, setVisible] = useState(true)

  return (
    <PhoneFrame>
      <button type="button" className="relative h-full w-full" onClick={() => setVisible((value) => !value)}>
        <MobileScreenLines />
        {visible && <div className="absolute inset-1 rounded-[1rem] bg-foreground/30" />}
        {visible && <div className="absolute left-4 right-4 top-12 rounded-lg bg-background p-2 shadow-sm"><Line className="w-9" /></div>}
      </button>
    </PhoneFrame>
  )
}

function TouchRippleVisual() {
  const [pressed, setPressed] = useState(false)

  return (
    <PhoneFrame>
      <div className="flex h-full items-center justify-center">
        <button type="button" className="relative flex size-12 items-center justify-center overflow-hidden rounded-full border bg-background" onClick={() => setPressed((value) => !value)}>
          <Bell aria-hidden="true" />
          {pressed && <span className="absolute size-12 rounded-full bg-primary/20" />}
        </button>
      </div>
    </PhoneFrame>
  )
}

function OtpCodeInputVisual() {
  const [digits, setDigits] = useState(["4", "2", "", "", "", ""])

  return (
    <PhoneFrame>
      <div className="flex h-full flex-col items-center justify-center gap-2 p-2">
        <p className="font-medium">코드 입력</p>
        <div className="grid grid-cols-6 gap-0.5">
          {digits.map((digit, index) => (
            <button key={index} type="button" className={cn("flex size-5 items-center justify-center rounded border bg-background", index === 2 && "border-primary")} onClick={() => setDigits((current) => current.map((item, itemIndex) => itemIndex === index ? String((Number(item || 0) + 1) % 10) : item))}>
              {digit}
            </button>
          ))}
        </div>
      </div>
    </PhoneFrame>
  )
}

function PasscodeKeypadVisual() {
  const [count, setCount] = useState(2)

  return (
    <PhoneFrame>
      <div className="flex h-full flex-col items-center justify-center gap-2 p-2">
        <div className="flex gap-1">{[0, 1, 2, 3].map((item) => <span key={item} className={cn("size-1.5 rounded-full border", item < count && "bg-primary")} />)}</div>
        <div className="grid grid-cols-3 gap-1">
          {Array.from({ length: 9 }).map((_, index) => (
            <button key={index} type="button" className="flex size-5 items-center justify-center rounded-full border" onClick={() => setCount((value) => Math.min(4, value + 1))}>{index + 1}</button>
          ))}
        </div>
      </div>
    </PhoneFrame>
  )
}

function BiometricPromptVisual() {
  const [approved, setApproved] = useState(false)

  return (
    <PhoneFrame>
      <div className="absolute inset-1 rounded-[1rem] bg-foreground/20" />
      <div className="absolute left-2 right-2 top-9 rounded-lg border bg-background p-2 text-center shadow-sm">
        <User aria-hidden="true" className="mx-auto mb-1 text-primary" />
        <p className="font-medium">{approved ? "인증됨" : "Face ID"}</p>
        <button type="button" className="mt-2 rounded bg-primary px-2 py-1 text-primary-foreground" onClick={() => setApproved(true)}>확인</button>
      </div>
    </PhoneFrame>
  )
}

function MobileDatePickerVisual() {
  const [day, setDay] = useState(18)

  return (
    <PhoneFrame>
      <div className="p-2">
        <div className="mb-2 flex items-center justify-between"><span className="font-medium">6월</span><CalendarDays aria-hidden="true" /></div>
        <div className="grid grid-cols-7 gap-0.5 text-center">
          {Array.from({ length: 21 }).map((_, index) => (
            <button key={index} type="button" className={cn("rounded py-0.5", index + 1 === day && "bg-primary text-primary-foreground")} onClick={() => setDay(index + 1)}>
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </PhoneFrame>
  )
}

function WheelPickerVisual() {
  const [selected, setSelected] = useState("M")
  const values = ["S", "M", "L"]

  return (
    <PhoneFrame>
      <div className="flex h-full items-center justify-center p-2">
        <div className="relative w-full rounded-lg border bg-muted/30 py-2 text-center">
          <div className="absolute inset-x-1 top-1/2 h-5 -translate-y-1/2 rounded border bg-background" />
          {values.map((value) => (
            <button key={value} type="button" className={cn("relative z-10 block w-full py-1", selected === value && "font-semibold text-primary")} onClick={() => setSelected(value)}>
              {value}
            </button>
          ))}
        </div>
      </div>
    </PhoneFrame>
  )
}

function TimeWheelPickerVisual() {
  const [hour, setHour] = useState(9)
  const [minute, setMinute] = useState(30)

  return (
    <PhoneFrame>
      <div className="flex h-full items-center justify-center gap-1 p-2">
        <button type="button" className="rounded border px-2 py-3 text-center" onClick={() => setHour((value) => value === 9 ? 10 : 9)}>
          <span className="block text-muted-foreground">08</span>
          <span className="block font-semibold text-primary">{hour}</span>
          <span className="block text-muted-foreground">10</span>
        </button>
        <span>:</span>
        <button type="button" className="rounded border px-2 py-3 text-center" onClick={() => setMinute((value) => value === 30 ? 45 : 30)}>
          <span className="block text-muted-foreground">15</span>
          <span className="block font-semibold text-primary">{minute}</span>
          <span className="block text-muted-foreground">45</span>
        </button>
      </div>
    </PhoneFrame>
  )
}

function MobileSearchSheetVisual() {
  const [query, setQuery] = useState("pizza")

  return (
    <PhoneFrame>
      <div className="absolute inset-1 rounded-[1rem] bg-background">
        <div className="flex h-7 items-center gap-1 border-b px-2">
          <Search aria-hidden="true" />
          <input aria-label="sheet search" className="min-w-0 flex-1 bg-transparent outline-none" value={query} onChange={(event) => setQuery(event.target.value)} />
          <X aria-hidden="true" />
        </div>
        <div className="p-2">
          {(query ? ["최근 검색", "추천 결과", "주변 장소"] : ["최근 검색"]).map((item) => <Line key={item} className="mb-2 w-12" />)}
        </div>
      </div>
    </PhoneFrame>
  )
}

function ChipInputMobileVisual() {
  const [chips, setChips] = useState(["UX", "앱"])

  return (
    <PhoneFrame>
      <div className="p-2">
        <div className="flex flex-wrap gap-1 rounded border p-1">
          {chips.map((chip) => <button key={chip} type="button" className="rounded-full bg-primary px-1.5 py-0.5 text-primary-foreground" onClick={() => setChips((current) => current.filter((item) => item !== chip))}>{chip}</button>)}
          <button type="button" className="rounded-full border px-1.5 py-0.5" onClick={() => setChips((current) => [...current, `Tag${current.length}`])}>+</button>
        </div>
      </div>
    </PhoneFrame>
  )
}

function ContactPickerVisual() {
  const [selected, setSelected] = useState("민지")

  return (
    <PhoneFrame>
      <div className="p-2">
        {["민지", "준호", "서연"].map((name) => (
          <button key={name} type="button" className={cn("mb-1 flex w-full items-center gap-1 rounded px-1 py-1 text-left", selected === name && "bg-primary/10 text-primary")} onClick={() => setSelected(name)}>
            <span className="flex size-4 items-center justify-center rounded-full bg-muted"><User aria-hidden="true" /></span>{name}
          </button>
        ))}
      </div>
    </PhoneFrame>
  )
}

function AddressAutocompleteVisual() {
  const [query, setQuery] = useState("명륜")

  return (
    <PhoneFrame>
      <div className="p-2">
        <div className="mb-2 flex items-center gap-1 rounded border px-1 py-1">
          <MapPin aria-hidden="true" />
          <input aria-label="address" className="min-w-0 flex-1 bg-transparent outline-none" value={query} onChange={(event) => setQuery(event.target.value)} />
        </div>
        {["명륜동", "성균관대", "혜화역"].map((item) => <button key={item} type="button" className="mb-1 block w-full rounded px-1 py-1 text-left hover:bg-muted">{item}</button>)}
      </div>
    </PhoneFrame>
  )
}

function VoiceInputButtonVisual() {
  const [listening, setListening] = useState(false)

  return (
    <PhoneFrame>
      <div className="flex h-full items-center justify-center">
        <button type="button" className={cn("flex size-12 items-center justify-center rounded-full border", listening && "bg-primary text-primary-foreground")} onClick={() => setListening((value) => !value)}>
          <Mic aria-hidden="true" />
        </button>
      </div>
    </PhoneFrame>
  )
}

function ClearTextButtonVisual() {
  const [text, setText] = useState("검색어")

  return (
    <PhoneFrame>
      <div className="p-2">
        <div className="flex items-center gap-1 rounded border px-1 py-1">
          <input aria-label="clearable text" className="min-w-0 flex-1 bg-transparent outline-none" value={text} onChange={(event) => setText(event.target.value)} />
          {text && <button type="button" className="rounded-full bg-muted p-0.5" onClick={() => setText("")}><X aria-hidden="true" /></button>}
        </div>
      </div>
    </PhoneFrame>
  )
}

function FeedCardMobileVisual() {
  const [liked, setLiked] = useState(false)

  return (
    <PhoneFrame>
      <div className="p-2">
        <button type="button" className="w-full rounded-lg border bg-background p-1 text-left" onClick={() => setLiked((value) => !value)}>
          <div className="mb-1 h-10 rounded bg-muted" />
          <Line className="w-12" />
          <div className="mt-1 flex items-center gap-2"><Heart className={cn(liked && "fill-primary text-primary")} aria-hidden="true" /><Line className="w-8" /></div>
        </button>
      </div>
    </PhoneFrame>
  )
}

function StoryRailVisual() {
  const [active, setActive] = useState(0)

  return (
    <PhoneFrame>
      <div className="flex gap-1 overflow-hidden p-2">
        {[0, 1, 2, 3].map((item) => (
          <button key={item} type="button" className={cn("flex size-7 shrink-0 items-center justify-center rounded-full border", active === item && "border-primary bg-primary/10")} onClick={() => setActive(item)}>
            <User aria-hidden="true" />
          </button>
        ))}
      </div>
      <MobileScreenLines />
    </PhoneFrame>
  )
}

function StoryViewerVisual() {
  const [page, setPage] = useState(0)

  return (
    <PhoneFrame>
      <button type="button" className="relative h-full w-full bg-muted/70 p-2 text-left" onClick={() => setPage((value) => (value + 1) % 3)}>
        <div className="absolute inset-x-2 top-3 flex gap-0.5">
          {[0, 1, 2].map((item) => <span key={item} className={cn("h-0.5 flex-1 rounded", item <= page ? "bg-primary" : "bg-background/70")} />)}
        </div>
        <div className="mt-5 flex items-center gap-1"><User aria-hidden="true" /><span>Story</span></div>
      </button>
    </PhoneFrame>
  )
}

function MediaLightboxMobileVisual() {
  const [chrome, setChrome] = useState(true)

  return (
    <PhoneFrame>
      <button type="button" className="relative flex h-full w-full items-center justify-center bg-foreground text-background" onClick={() => setChrome((value) => !value)}>
        <ImageIcon aria-hidden="true" />
        {chrome && <div className="absolute inset-x-2 top-3 flex items-center justify-between"><X aria-hidden="true" /><span>1/4</span></div>}
      </button>
    </PhoneFrame>
  )
}

function CommentComposerVisual() {
  const [text, setText] = useState("")

  return (
    <PhoneFrame>
      <MobileScreenLines />
      <div className="absolute inset-x-1 bottom-1 flex items-center gap-1 rounded-b-[1rem] border-t bg-background p-1">
        <input aria-label="comment" className="min-w-0 flex-1 rounded-full border px-1 py-0.5 outline-none" placeholder="댓글" value={text} onChange={(event) => setText(event.target.value)} />
        <button type="button" className={cn("rounded-full px-1 py-0.5", text ? "bg-primary text-primary-foreground" : "bg-muted")} onClick={() => setText("")}>전송</button>
      </div>
    </PhoneFrame>
  )
}

function BottomCtaBarVisual() {
  const [done, setDone] = useState(false)

  return (
    <PhoneFrame>
      <MobileScreenLines />
      <div className="absolute inset-x-1 bottom-1 rounded-b-[1rem] border-t bg-background p-1.5">
        <button type="button" className={cn("w-full rounded-full px-2 py-1", done ? "border" : "bg-primary text-primary-foreground")} onClick={() => setDone(true)}>{done ? "완료" : "계속하기"}</button>
      </div>
    </PhoneFrame>
  )
}

function ProductOptionSheetVisual() {
  const [size, setSize] = useState("M")

  return (
    <PhoneFrame>
      <MobileScreenLines />
      <div className="absolute inset-x-1 bottom-1 rounded-t-xl border bg-background p-2 shadow-sm">
        <div className="mx-auto mb-1 h-0.5 w-6 rounded bg-muted-foreground/40" />
        <div className="flex gap-1">
          {["S", "M", "L"].map((item) => <button key={item} type="button" className={cn("rounded border px-1 py-0.5", size === item && "bg-primary text-primary-foreground")} onClick={() => setSize(item)}>{item}</button>)}
        </div>
      </div>
    </PhoneFrame>
  )
}

function CartSummaryBarVisual() {
  const [count, setCount] = useState(2)

  return (
    <PhoneFrame>
      <MobileScreenLines />
      <div className="absolute inset-x-1 bottom-1 flex items-center justify-between rounded-b-[1rem] border-t bg-background p-1.5">
        <button type="button" onClick={() => setCount((value) => value + 1)}>{count}개 · ₩18k</button>
        <span className="rounded-full bg-primary px-2 py-1 text-primary-foreground">주문</span>
      </div>
    </PhoneFrame>
  )
}

function CheckoutProgressHeaderVisual() {
  const [step, setStep] = useState(1)

  return (
    <PhoneFrame>
      <div className="border-b p-2">
        <button type="button" className="mb-1 font-medium" onClick={() => setStep((value) => (value + 1) % 3)}>결제 {step + 1}/3</button>
        <div className="flex gap-1">{[0, 1, 2].map((item) => <span key={item} className={cn("h-1 flex-1 rounded", item <= step ? "bg-primary" : "bg-muted")} />)}</div>
      </div>
      <MobileScreenLines />
    </PhoneFrame>
  )
}

function DeliveryTrackerVisual() {
  const [step, setStep] = useState(1)

  return (
    <PhoneFrame>
      <div className="p-2">
        {["주문", "조리", "배달"].map((item, index) => (
          <button key={item} type="button" className="mb-2 flex items-center gap-2" onClick={() => setStep(index)}>
            <span className={cn("size-3 rounded-full border", index <= step && "bg-primary")} />
            <span>{item}</span>
          </button>
        ))}
      </div>
    </PhoneFrame>
  )
}

function MapBottomPanelVisual() {
  const [expanded, setExpanded] = useState(false)

  return (
    <PhoneFrame>
      <div className="relative h-full bg-muted/70">
        <MapPin className="absolute left-8 top-9 text-primary" aria-hidden="true" />
        <button type="button" className={cn("absolute inset-x-1 bottom-1 rounded-t-xl border bg-background p-2 text-left shadow-sm transition-all", expanded ? "h-24" : "h-12")} onClick={() => setExpanded((value) => !value)}>
          <span className="mx-auto mb-1 block h-0.5 w-6 rounded bg-muted-foreground/40" />
          <Line className="w-12" />
          {expanded && <Line className="mt-2 w-10" />}
        </button>
      </div>
    </PhoneFrame>
  )
}

function LocationPermissionEmptyVisual() {
  const [asked, setAsked] = useState(false)

  return (
    <PhoneFrame>
      <div className="flex h-full flex-col items-center justify-center gap-2 p-2 text-center">
        <MapPin aria-hidden="true" className="text-primary" />
        <p className="font-medium">{asked ? "요청됨" : "위치 필요"}</p>
        <button type="button" className="rounded bg-primary px-2 py-1 text-primary-foreground" onClick={() => setAsked(true)}>허용</button>
      </div>
    </PhoneFrame>
  )
}

function OnboardingPagerVisual() {
  const [page, setPage] = useState(0)

  return (
    <PhoneFrame>
      <div className="flex h-full flex-col items-center justify-end gap-3 p-2 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-primary/10"><Star className="text-primary" aria-hidden="true" /></div>
        <p className="font-medium">시작하기</p>
        <div className="flex gap-1">{[0, 1, 2].map((item) => <button key={item} type="button" className={cn("size-1.5 rounded-full", page === item ? "bg-primary" : "bg-muted")} onClick={() => setPage(item)}><span className="sr-only">page</span></button>)}</div>
      </div>
    </PhoneFrame>
  )
}

function CoachMarkVisual() {
  const [visible, setVisible] = useState(true)

  return (
    <PhoneFrame>
      <div className="relative h-full p-2">
        <button type="button" className="absolute right-3 top-8 rounded-full border bg-background p-1" onClick={() => setVisible((value) => !value)}><Plus aria-hidden="true" /></button>
        {visible && <div className="absolute left-2 right-2 top-14 rounded-lg bg-foreground p-2 text-background shadow-sm">여기를 눌러 추가</div>}
      </div>
    </PhoneFrame>
  )
}

function MobileEmptyFeedVisual() {
  const [created, setCreated] = useState(false)

  return (
    <PhoneFrame>
      <div className="flex h-full flex-col items-center justify-center gap-2 p-2 text-center">
        {created ? <CheckCircle2 className="text-primary" aria-hidden="true" /> : <ImageIcon className="text-muted-foreground" aria-hidden="true" />}
        <p className="font-medium">{created ? "첫 글 생성" : "아직 글 없음"}</p>
        <button type="button" className="rounded border px-2 py-1" onClick={() => setCreated(true)}>작성</button>
      </div>
    </PhoneFrame>
  )
}

function MobileBottomSheetVisual() {
  const [open, setOpen] = useState(true)

  return <div className="relative h-32 w-28 overflow-hidden rounded-xl border bg-card p-2 text-xs"><button type="button" className="rounded border px-2 py-1" onClick={() => setOpen((value) => !value)}>필터</button>{open && <div className="absolute inset-x-0 bottom-0 rounded-t-xl border-t bg-background p-2 shadow-sm"><div className="mx-auto mb-2 h-1 w-8 rounded bg-muted-foreground/40" /><Line className="w-20" /><Line className="mt-2 w-16" /></div>}</div>
}

function MobileFilterBottomSheetVisual() {
  const [applied, setApplied] = useState(false)

  return (
    <PhoneFrame>
      <MobileScreenLines />
      <div className="absolute inset-x-1 bottom-1 rounded-t-xl border bg-background p-2 shadow-sm">
        <div className="mx-auto mb-2 h-0.5 w-7 rounded bg-muted-foreground/50" />
        <div className="mb-2 flex items-center justify-between">
          <span className="font-medium">필터</span>
          <button type="button" className="text-primary" onClick={() => setApplied(false)}>초기화</button>
        </div>
        {["가격", "상태"].map((item) => <button key={item} type="button" className="mb-1 flex w-full items-center gap-2" onClick={() => setApplied(true)}><span className={cn("size-3 rounded border", applied && "bg-primary")} />{item}</button>)}
        <button type="button" className="mt-1 w-full rounded bg-primary py-1 text-primary-foreground" onClick={() => setApplied(true)}>적용</button>
      </div>
    </PhoneFrame>
  )
}

function InlineDateRangeChipVisual() {
  const [range, setRange] = useState("지난 7일")

  return <button type="button" className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-2 text-xs shadow-sm" onClick={() => setRange((value) => value === "지난 7일" ? "이번 달" : "지난 7일")}><CalendarDays aria-hidden="true" className="size-4 text-primary" /><span>{range}</span><X aria-hidden="true" className="size-3 text-muted-foreground" /></button>
}

function FloatingSearchButtonVisual() {
  const [open, setOpen] = useState(false)

  return <div className="relative h-28 w-48 rounded-md border bg-card p-2 text-xs"><MobileScreenLines />{open && <div className="absolute left-2 right-2 top-3 flex items-center gap-1 rounded-full border bg-background px-2 py-1 shadow-sm"><Search aria-hidden="true" /><span>검색</span></div>}<button type="button" className="absolute bottom-3 right-3 flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md" onClick={() => setOpen((value) => !value)}><Search aria-hidden="true" /></button></div>
}

function AvatarGroupVisual() {
  const [count, setCount] = useState(4)

  return <button type="button" className="flex items-center rounded-md border bg-card px-3 py-3 text-xs" onClick={() => setCount((value) => value === 4 ? 6 : 4)}>{["A", "B", "C"].map((item, index) => <span key={item} className="flex size-8 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground" style={{ marginLeft: index === 0 ? 0 : -8 }}>{item}</span>)}<span className="ml-1 rounded-full bg-muted px-2 py-1">+{count - 3}</span></button>
}

function InfoLabelVisual() {
  const [open, setOpen] = useState(true)

  return <div className="relative w-52 text-xs"><button type="button" className="flex items-center gap-1 font-medium" onClick={() => setOpen((value) => !value)}>API rate limit<Info aria-hidden="true" className="size-4 text-primary" /></button>{open && <div className="mt-2 rounded-md border bg-card p-2 shadow-sm">분당 요청 가능한 횟수</div>}<Line className="mt-3 w-36" /></div>
}

function MessageBarVisual() {
  const [visible, setVisible] = useState(true)

  if (!visible) return <button type="button" className="rounded border px-3 py-2 text-xs" onClick={() => setVisible(true)}>메시지 보기</button>
  return <div className="flex w-60 items-center gap-2 rounded-md border bg-card px-3 py-2 text-xs shadow-sm"><AlertTriangle aria-hidden="true" className="size-4 text-primary" /><span className="min-w-0 flex-1">동기화가 지연되고 있습니다.</span><button type="button" onClick={() => setVisible(false)}><X aria-hidden="true" /></button></div>
}

function SpinButtonVisual() {
  const [value, setValue] = useState(3)

  return <div className="inline-flex items-center overflow-hidden rounded-md border bg-card text-sm"><button type="button" className="px-3 py-2" onClick={() => setValue((current) => Math.max(0, current - 1))}>-</button><input aria-label="스핀 버튼 예시" className="w-12 border-x bg-background py-2 text-center outline-none" value={value} readOnly /><button type="button" className="px-3 py-2" onClick={() => setValue((current) => current + 1)}>+</button></div>
}

function ScopeBarVisual() {
  const [active, setActive] = useState("전체")

  return <div className="flex rounded-md border bg-card p-1 text-xs">{["전체", "파일", "사람"].map((item) => <button key={item} type="button" className={cn("rounded px-3 py-1", active === item ? "bg-primary text-primary-foreground" : "text-muted-foreground")} onClick={() => setActive(item)}>{item}</button>)}</div>
}

function StructuredListVisual() {
  const [active, setActive] = useState("Owner")

  return <Chrome className="w-60 overflow-hidden p-0 text-xs">{["Owner", "Status", "Updated"].map((item) => <button key={item} type="button" className={cn("grid w-full grid-cols-[70px_1fr] gap-2 border-b px-3 py-2 text-left last:border-b-0", active === item && "bg-primary/10")} onClick={() => setActive(item)}><span className="font-medium">{item}</span><Line className="w-24" /></button>)}</Chrome>
}

function InlineLoadingVisual() {
  const [done, setDone] = useState(false)

  return <button type="button" className="inline-flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-xs" onClick={() => setDone((value) => !value)}>{done ? <CheckCircle2 aria-hidden="true" className="size-4 text-primary" /> : <LoaderCircle aria-hidden="true" className="size-4 animate-spin text-primary" />}<span>{done ? "저장됨" : "저장 중"}</span></button>
}

function TagPickerVisual() {
  const [tags, setTags] = useState(["React", "UI"])

  return <Chrome className="w-56 p-2 text-xs"><div className="mb-2 flex flex-wrap gap-1">{tags.map((tag) => <button key={tag} type="button" className="rounded-full bg-primary px-2 py-1 text-primary-foreground" onClick={() => setTags((current) => current.filter((item) => item !== tag))}>{tag} ×</button>)}</div><div className="flex items-center gap-1 rounded border px-2 py-1"><Search aria-hidden="true" className="size-3" /><button type="button" className="text-muted-foreground" onClick={() => setTags((current) => [...current, `Tag${current.length + 1}`])}>태그 추가</button></div></Chrome>
}

function DisclosureGroupVisual() {
  const [open, setOpen] = useState(true)

  return <Chrome className="w-56 p-2 text-xs"><button type="button" className="flex w-full items-center justify-between rounded px-2 py-1 text-left font-medium" onClick={() => setOpen((value) => !value)}>고급 설정<ChevronDown aria-hidden="true" className={cn(!open && "-rotate-90")} /></button>{open && <div className="mt-1 rounded bg-muted p-2"><Line className="w-32" /><Line className="mt-2 w-24" /></div>}</Chrome>
}

function ContainedListVisual() {
  const [selected, setSelected] = useState(0)

  return <Chrome className="w-56 overflow-hidden p-0 text-xs">{["알림", "보안", "결제"].map((item, index) => <button key={item} type="button" className={cn("flex w-full items-center justify-between border-b px-3 py-2 text-left last:border-b-0", selected === index && "bg-primary/10")} onClick={() => setSelected(index)}><span>{item}</span><ChevronRight aria-hidden="true" className="size-3" /></button>)}</Chrome>
}

function PageLayoutVisual() {
  return <div className="grid h-28 w-60 grid-cols-[52px_1fr_54px] grid-rows-[28px_1fr] overflow-hidden rounded-md border bg-card text-xs"><header className="col-span-3 border-b bg-muted/50 p-2">Header</header><aside className="border-r p-2"><Line className="w-7" /></aside><main className="p-2"><Line className="w-24" /><Line className="mt-2 w-28" /></main><aside className="border-l p-2"><Line className="w-7" /></aside></div>
}

function DashboardGridVisual() {
  const [wide, setWide] = useState(0)

  return <div className="grid w-60 grid-cols-4 gap-2 rounded-md border bg-card p-2">{[0, 1, 2, 3, 4].map((item) => <button key={item} type="button" className={cn("h-9 rounded bg-muted", wide === item && "col-span-2 bg-primary/20")} onClick={() => setWide(item)}><span className="sr-only">widget {item + 1}</span></button>)}</div>
}

function PermissionStateVisual() {
  const [requested, setRequested] = useState(false)

  return <Chrome className="flex w-52 flex-col items-center gap-2 p-3 text-center text-xs"><EyeOff aria-hidden="true" className="text-muted-foreground" /><p className="font-medium">{requested ? "요청됨" : "권한 필요"}</p><button type="button" className="rounded border px-2 py-1" onClick={() => setRequested(true)}>권한 요청</button></Chrome>
}

function LockedStateVisual() {
  const [locked, setLocked] = useState(true)

  return <button type="button" className={cn("flex h-24 w-48 flex-col items-center justify-center gap-2 rounded-md border bg-card text-xs", locked && "opacity-70")} onClick={() => setLocked((value) => !value)}><EyeOff aria-hidden="true" /><span>{locked ? "잠김" : "잠금 해제"}</span><Line className="w-24" /></button>
}

function OfflineStateVisual() {
  const [online, setOnline] = useState(false)

  return <Chrome className="flex w-56 items-center justify-between gap-2 p-3 text-xs"><span className="flex items-center gap-2"><span className={cn("size-2 rounded-full", online ? "bg-primary" : "bg-destructive")} />{online ? "온라인" : "오프라인"}</span><button type="button" className="rounded border px-2 py-1" onClick={() => setOnline(true)}>재연결</button></Chrome>
}

function MaintenanceStateVisual() {
  const [eta, setEta] = useState("10:30")

  return <Chrome className="w-52 p-3 text-xs"><p className="font-medium">서비스 점검</p><p className="mt-1 text-muted-foreground">예상 종료 {eta}</p><button type="button" className="mt-3 rounded border px-2 py-1" onClick={() => setEta("10:45")}>업데이트</button></Chrome>
}

function SyncingStateVisual() {
  const [done, setDone] = useState(false)

  return <button type="button" className="flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-xs" onClick={() => setDone((value) => !value)}>{done ? <CheckCircle2 className="text-primary" aria-hidden="true" /> : <LoaderCircle className="animate-spin text-primary" aria-hidden="true" />}<span>{done ? "동기화됨" : "동기화 중"}</span></button>
}

function SavingIndicatorVisual() {
  const [saved, setSaved] = useState(false)

  return <button type="button" className="flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs" onClick={() => setSaved((value) => !value)}>{saved ? <Check aria-hidden="true" className="text-primary" /> : <LoaderCircle aria-hidden="true" className="animate-spin" />}{saved ? "저장됨" : "저장 중"}</button>
}

function UnsavedChangesBannerVisual() {
  const [dirty, setDirty] = useState(true)

  if (!dirty) return <button type="button" className="rounded border px-3 py-2 text-xs" onClick={() => setDirty(true)}>변경 만들기</button>
  return <Chrome className="flex w-60 items-center justify-between px-3 py-2 text-xs"><span>저장 안 된 변경</span><div className="flex gap-1"><button type="button" className="rounded border px-2 py-1" onClick={() => setDirty(false)}>취소</button><button type="button" className="rounded bg-primary px-2 py-1 text-primary-foreground" onClick={() => setDirty(false)}>저장</button></div></Chrome>
}

function SessionExpiredDialogVisual() {
  const [open, setOpen] = useState(true)

  if (!open) return <button type="button" className="rounded border px-3 py-2 text-xs" onClick={() => setOpen(true)}>세션 만료 보기</button>
  return <div className="relative h-28 w-56 rounded-md bg-foreground/10"><Chrome className="absolute left-1/2 top-1/2 w-44 -translate-x-1/2 -translate-y-1/2 p-3 text-xs"><p className="font-medium">세션 만료</p><p className="mt-1 text-muted-foreground">다시 로그인하세요.</p><button type="button" className="mt-3 rounded bg-primary px-2 py-1 text-primary-foreground" onClick={() => setOpen(false)}>로그인</button></Chrome></div>
}

function UpgradePromptVisual() {
  const [upgraded, setUpgraded] = useState(false)

  return <Chrome className="w-52 p-3 text-xs"><p className="font-medium">{upgraded ? "Pro 활성" : "Pro 기능"}</p><Line className="mt-2 w-28" /><button type="button" className="mt-3 rounded bg-primary px-2 py-1 text-primary-foreground" onClick={() => setUpgraded(true)}>업그레이드</button></Chrome>
}

function QuotaWarningVisual() {
  const [value, setValue] = useState(80)

  return <Chrome className="w-52 p-3 text-xs"><div className="mb-2 flex justify-between"><span>사용량</span><span>{value}%</span></div><div className="h-2 overflow-hidden rounded bg-muted"><div className="h-full bg-destructive" style={{ width: `${value}%` }} /></div><button type="button" className="mt-3 rounded border px-2 py-1" onClick={() => setValue(Math.max(45, value - 10))}>정리</button></Chrome>
}

function TrialBannerVisual() {
  const [days, setDays] = useState(5)

  return <Chrome className="flex w-60 items-center justify-between px-3 py-2 text-xs"><span>체험 {days}일 남음</span><button type="button" className="rounded border px-2 py-1" onClick={() => setDays(Math.max(0, days - 1))}>하루 지남</button></Chrome>
}

function DestructiveConfirmationVisual() {
  const [deleted, setDeleted] = useState(false)

  return <Chrome className="w-52 p-3 text-xs"><p className="font-medium">{deleted ? "삭제됨" : "삭제할까요?"}</p><p className="mt-1 text-muted-foreground">되돌릴 수 없습니다.</p><div className="mt-3 flex justify-end gap-1"><button type="button" className="rounded border px-2 py-1" onClick={() => setDeleted(false)}>취소</button><button type="button" className="rounded bg-destructive px-2 py-1 text-white" onClick={() => setDeleted(true)}>삭제</button></div></Chrome>
}

function SuccessToastVisual() {
  const [visible, setVisible] = useState(true)

  if (!visible) return <button type="button" className="rounded border px-3 py-2 text-xs" onClick={() => setVisible(true)}>토스트 보기</button>
  return <Chrome className="flex w-52 items-center justify-between px-3 py-2 text-xs"><span className="flex items-center gap-2"><CheckCircle2 className="text-primary" aria-hidden="true" />저장됨</span><button type="button" onClick={() => setVisible(false)}><X aria-hidden="true" /></button></Chrome>
}

function ErrorToastVisual() {
  const [retrying, setRetrying] = useState(false)

  return <Chrome className="flex w-56 items-center justify-between gap-2 px-3 py-2 text-xs"><span className="flex items-center gap-2"><AlertTriangle className="text-destructive" aria-hidden="true" />업로드 실패</span><button type="button" className="rounded border px-2 py-1" onClick={() => setRetrying(true)}>{retrying ? "재시도중" : "재시도"}</button></Chrome>
}

function NotificationCenterVisual() {
  const [open, setOpen] = useState(true)

  return <div className="relative h-28 w-52"><button type="button" className="relative rounded-full border bg-card p-2" onClick={() => setOpen((value) => !value)}><Bell aria-hidden="true" /><span className="absolute -right-1 -top-1 rounded-full bg-destructive px-1 text-[10px] text-white">3</span></button>{open && <Chrome className="absolute right-0 top-10 w-44 p-2 text-xs"><p className="font-medium">알림</p><Line className="mt-2 w-32" /><Line className="mt-2 w-24" /></Chrome>}</div>
}

function NotificationListVisual() {
  const [read, setRead] = useState(false)

  return <Chrome className="w-56 p-2 text-xs">{["댓글", "승인", "배포"].map((item, index) => <button key={item} type="button" className="mb-1 flex w-full items-center gap-2 rounded px-2 py-1 text-left hover:bg-muted" onClick={() => setRead(true)}><span className={cn("size-2 rounded-full", !read && index === 0 ? "bg-primary" : "bg-muted-foreground/30")} />{item}<span className="ml-auto text-muted-foreground">{index + 1}m</span></button>)}</Chrome>
}

function StatusChipVisual() {
  const [state, setState] = useState("승인됨")

  return <div className="flex gap-2">{["승인됨", "보류", "실패"].map((item) => <button key={item} type="button" className={cn("rounded-full border px-2 py-1 text-xs", state === item && "bg-primary text-primary-foreground")} onClick={() => setState(item)}>{item}</button>)}</div>
}

function HealthIndicatorVisual() {
  const states = ["정상", "경고", "장애"]
  const [index, setIndex] = useState(1)
  const tone = index === 0 ? "bg-primary" : index === 1 ? "bg-amber-500" : "bg-destructive"

  return <button type="button" className="flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-xs" onClick={() => setIndex((value) => (value + 1) % states.length)}><span className={cn("size-3 rounded-full", tone)} />API {states[index]}</button>
}

function ConnectionStatusVisual() {
  const states = ["연결됨", "재연결중", "끊김"]
  const [index, setIndex] = useState(1)

  return <button type="button" className="flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-xs" onClick={() => setIndex((value) => (value + 1) % states.length)}>{index === 1 ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : <span className={cn("size-2 rounded-full", index === 0 ? "bg-primary" : "bg-destructive")} />}{states[index]}</button>
}

function RetryPanelVisual() {
  const [loaded, setLoaded] = useState(false)

  return <Chrome className="flex w-52 flex-col items-center gap-2 p-3 text-center text-xs">{loaded ? <CheckCircle2 className="text-primary" aria-hidden="true" /> : <AlertTriangle className="text-destructive" aria-hidden="true" />}<p className="font-medium">{loaded ? "불러옴" : "로드 실패"}</p><button type="button" className="rounded border px-2 py-1" onClick={() => setLoaded(true)}>다시 시도</button></Chrome>
}

function MediaCardVisual() {
  const [liked, setLiked] = useState(false)

  return <Chrome className="w-44 overflow-hidden text-xs"><div className="flex h-20 items-center justify-center bg-muted"><ImageIcon aria-hidden="true" /></div><div className="p-2"><p className="font-medium">콘텐츠 제목</p><div className="mt-2 flex justify-between"><span>1.2K views</span><button type="button" onClick={() => setLiked((value) => !value)}><Heart className={cn(liked && "fill-primary text-primary")} aria-hidden="true" /></button></div></div></Chrome>
}

function VideoPlayerControlsVisual() {
  const [playing, setPlaying] = useState(false)

  return <Chrome className="w-56 overflow-hidden text-xs"><div className="flex h-20 items-center justify-center bg-foreground/10"><button type="button" className="rounded-full bg-background p-2" onClick={() => setPlaying((value) => !value)}><Play aria-hidden="true" className={cn(playing && "text-primary")} /></button></div><div className="flex items-center gap-2 p-2"><span>{playing ? "0:24" : "0:00"}</span><div className="h-1 flex-1 rounded bg-muted"><div className={cn("h-full rounded bg-primary", playing ? "w-1/2" : "w-1/5")} /></div><span>1:20</span></div></Chrome>
}

function AudioPlayerControlsVisual() {
  const [playing, setPlaying] = useState(false)

  return <Chrome className="flex w-56 items-center gap-3 p-3 text-xs"><button type="button" className="rounded-full border p-2" onClick={() => setPlaying((value) => !value)}><Play aria-hidden="true" className={cn(playing && "text-primary")} /></button><div className="flex flex-1 items-end gap-1">{[12, 20, 14, 24, 18, 28, 16].map((height, index) => <span key={index} className={cn("w-2 rounded bg-primary/50", playing && index < 4 && "bg-primary")} style={{ height }} />)}</div><span>0:32</span></Chrome>
}

function ImageGalleryVisual() {
  const [selected, setSelected] = useState(1)

  return <Chrome className="grid w-56 grid-cols-[1fr_72px] gap-2 p-2"><div className="flex items-center justify-center rounded bg-muted"><ImageIcon aria-hidden="true" /><span className="text-xs">{selected + 1}</span></div><div className="grid grid-cols-2 gap-1">{[0, 1, 2, 3].map((item) => <button key={item} type="button" className={cn("h-8 rounded bg-muted", selected === item && "ring-2 ring-primary")} onClick={() => setSelected(item)}><span className="sr-only">image {item + 1}</span></button>)}</div></Chrome>
}

function LightboxVisual() {
  const [open, setOpen] = useState(true)

  if (!open) return <button type="button" className="rounded border px-3 py-2 text-xs" onClick={() => setOpen(true)}>이미지 열기</button>
  return <div className="relative h-28 w-56 rounded-md bg-foreground/80 p-3 text-white"><button type="button" className="absolute right-2 top-2" onClick={() => setOpen(false)}><X aria-hidden="true" /></button><div className="mx-auto flex h-20 w-36 items-center justify-center rounded bg-white/20"><ImageIcon aria-hidden="true" /></div></div>
}

function CropperVisual() {
  const [wide, setWide] = useState(false)

  return <button type="button" className="relative h-28 w-48 rounded-md border bg-muted" onClick={() => setWide((value) => !value)}><div className={cn("absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-primary bg-background/40", wide ? "h-14 w-28" : "size-20")}><span className="absolute -right-1 -top-1 size-2 rounded-full bg-primary" /><span className="absolute -bottom-1 -left-1 size-2 rounded-full bg-primary" /></div></button>
}

function UploadDropzoneVisual() {
  const [dragging, setDragging] = useState(true)

  return <button type="button" className={cn("flex h-28 w-52 flex-col items-center justify-center gap-2 rounded-md border border-dashed bg-card text-xs", dragging && "border-primary bg-primary/5")} onClick={() => setDragging((value) => !value)}><FileUp aria-hidden="true" /><span>{dragging ? "놓아서 업로드" : "파일 드롭"}</span><span className="text-muted-foreground">PDF, PNG</span></button>
}

function AttachmentListVisual() {
  const [count, setCount] = useState(2)

  return <Chrome className="w-56 p-2 text-xs">{Array.from({ length: count }).map((_, item) => <div key={item} className="mb-1 flex items-center gap-2 rounded border px-2 py-1"><FileUp aria-hidden="true" /><span>file-{item + 1}.pdf</span><button type="button" className="ml-auto" onClick={() => setCount((value) => Math.max(0, value - 1))}><X aria-hidden="true" /></button></div>)}</Chrome>
}

function FileCardVisual() {
  const [menu, setMenu] = useState(false)

  return <Chrome className="relative w-40 p-3 text-xs"><FileUp aria-hidden="true" /><p className="mt-2 font-medium">Report.pdf</p><p className="text-muted-foreground">2.4 MB</p><button type="button" className="absolute right-2 top-2" onClick={() => setMenu((value) => !value)}><MoreHorizontal aria-hidden="true" /></button>{menu && <div className="absolute right-2 top-8 rounded border bg-background px-2 py-1">다운로드</div>}</Chrome>
}

function ProductCardVisual() {
  const [added, setAdded] = useState(false)

  return <Chrome className="w-44 overflow-hidden text-xs"><div className="h-16 bg-muted" /><div className="p-2"><p className="font-medium">Product</p><p className="text-primary">₩29,000</p><button type="button" className={cn("mt-2 rounded px-2 py-1", added ? "border" : "bg-primary text-primary-foreground")} onClick={() => setAdded(true)}>{added ? "담김" : "담기"}</button></div></Chrome>
}

function PriceCardVisual() {
  const [selected, setSelected] = useState(false)

  return <button type="button" className={cn("w-44 rounded-md border bg-card p-3 text-left text-xs", selected && "ring-2 ring-primary")} onClick={() => setSelected((value) => !value)}><p className="font-medium">Pro</p><p className="mt-1 text-lg font-semibold">₩12K</p><Line className="mt-2 w-24" /><span className="mt-3 inline-block rounded bg-primary px-2 py-1 text-primary-foreground">선택</span></button>
}

function PlanCardVisual() {
  const [current, setCurrent] = useState(true)

  return <Chrome className="w-48 p-3 text-xs"><div className="flex justify-between"><b>Team</b>{current && <span className="rounded-full bg-primary px-2 py-0.5 text-primary-foreground">현재</span>}</div><Line className="mt-3 w-28" /><button type="button" className="mt-3 rounded border px-2 py-1" onClick={() => setCurrent((value) => !value)}>전환</button></Chrome>
}

function FeatureComparisonVisual() {
  const [highlight, setHighlight] = useState(1)

  return <div className="grid w-60 grid-cols-3 overflow-hidden rounded-md border text-xs">{["Basic", "Pro", "Team"].map((plan, index) => <button key={plan} type="button" className={cn("border-r p-2 last:border-r-0", highlight === index && "bg-primary/10")} onClick={() => setHighlight(index)}><b>{plan}</b><Check className="mx-auto mt-2 text-primary" aria-hidden="true" /><Line className="mt-2 w-12" /></button>)}</div>
}

function CouponFieldVisual() {
  const [applied, setApplied] = useState(false)

  return <Chrome className="flex w-56 items-center gap-2 p-2 text-xs"><input className="min-w-0 flex-1 rounded border bg-background px-2 py-1 outline-none" value={applied ? "SAVE10" : ""} placeholder="쿠폰 코드" readOnly /><button type="button" className="rounded bg-primary px-2 py-1 text-primary-foreground" onClick={() => setApplied(true)}>{applied ? "적용됨" : "적용"}</button></Chrome>
}

function QuantityStepperVisual() {
  const [quantity, setQuantity] = useState(1)

  return <div className="flex items-center rounded-md border bg-card text-sm"><button type="button" className="px-3 py-2" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>-</button><span className="border-x px-4 py-2">{quantity}</span><button type="button" className="px-3 py-2" onClick={() => setQuantity((value) => value + 1)}>+</button></div>
}

function CartSummaryVisual() {
  return <Chrome className="w-52 p-3 text-xs"><div className="flex justify-between"><span>소계</span><span>₩29K</span></div><div className="mt-1 flex justify-between"><span>배송</span><span>₩3K</span></div><div className="mt-2 border-t pt-2 flex justify-between font-medium"><span>총액</span><span>₩32K</span></div><button type="button" className="mt-3 w-full rounded bg-primary py-1 text-primary-foreground">결제</button></Chrome>
}

function CheckoutStepVisual() {
  const [step, setStep] = useState(2)

  return <Chrome className="w-56 p-3 text-xs"><div className="flex items-center justify-between">{["배송", "결제", "확인"].map((label, index) => <button key={label} type="button" className={cn("flex size-8 items-center justify-center rounded-full border", index + 1 <= step && "bg-primary text-primary-foreground")} onClick={() => setStep(index + 1)}>{index + 1}</button>)}</div><p className="mt-3 font-medium">{["배송", "결제", "확인"][step - 1]}</p></Chrome>
}

function PaymentMethodCardVisual() {
  const [selected, setSelected] = useState(true)

  return <button type="button" className={cn("w-52 rounded-md border bg-card p-3 text-left text-xs", selected && "ring-2 ring-primary")} onClick={() => setSelected((value) => !value)}><p className="font-medium">Visa **** 4242</p><p className="mt-1 text-muted-foreground">만료 12/28</p><span className="mt-2 inline-block rounded-full bg-muted px-2 py-0.5">기본</span></button>
}

function AddressCardVisual() {
  const [selected, setSelected] = useState(true)

  return <button type="button" className={cn("w-52 rounded-md border bg-card p-3 text-left text-xs", selected && "ring-2 ring-primary")} onClick={() => setSelected((value) => !value)}><div className="flex justify-between"><b>유성</b><span className="rounded-full bg-primary px-2 py-0.5 text-primary-foreground">기본</span></div><p className="mt-2 text-muted-foreground">서울 종로구 명륜3길 27</p></button>
}

function OrderStatusVisual() {
  const [step, setStep] = useState(2)

  return <Chrome className="w-56 p-3 text-xs"><div className="mb-3 flex items-center">{[1, 2, 3].map((item) => <button key={item} type="button" className={cn("mr-1 h-2 flex-1 rounded", item <= step ? "bg-primary" : "bg-muted")} onClick={() => setStep(item)}><span className="sr-only">step {item}</span></button>)}</div><p className="font-medium">{["주문 접수", "배송 중", "완료"][step - 1]}</p><p className="text-muted-foreground">예상 도착 내일</p></Chrome>
}

function CalendarEventCardVisual() {
  const [selected, setSelected] = useState(true)

  return <button type="button" className={cn("w-52 rounded-md border bg-card p-3 text-left text-xs", selected && "ring-2 ring-primary")} onClick={() => setSelected((value) => !value)}><p className="font-medium">디자인 리뷰</p><p className="mt-1 text-muted-foreground">10:00 - 11:00 · 회의실 A</p><span className="mt-2 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-primary">참석</span></button>
}

function KanbanCardVisual() {
  const [done, setDone] = useState(false)

  return <Chrome className="w-44 p-3 text-xs"><button type="button" className="text-left font-medium" onClick={() => setDone((value) => !value)}>{done ? "완료된 작업" : "UI 용어 추가"}</button><div className="mt-2 flex gap-1"><span className="rounded bg-primary/10 px-2 py-0.5 text-primary">design</span><span className="rounded bg-muted px-2 py-0.5">docs</span></div><div className="mt-3 flex justify-between"><span>2 comments</span><User aria-hidden="true" /></div></Chrome>
}

function BoardColumnVisual() {
  const [count, setCount] = useState(2)

  return <Chrome className="w-48 p-2 text-xs"><div className="mb-2 flex justify-between font-medium"><span>진행 중</span><span>{count}</span></div>{Array.from({ length: count }).map((_, item) => <div key={item} className="mb-2 rounded border bg-background p-2"><Line className="w-24" /></div>)}<button type="button" className="rounded border px-2 py-1" onClick={() => setCount((value) => value + 1)}>카드 추가</button></Chrome>
}

function EmptySearchResultVisual() {
  const [cleared, setCleared] = useState(false)

  return <Chrome className="flex w-52 flex-col items-center gap-2 p-3 text-center text-xs"><Search aria-hidden="true" /><p className="font-medium">{cleared ? "전체 결과" : "결과 없음"}</p><button type="button" className="rounded border px-2 py-1" onClick={() => setCleared(true)}>필터 초기화</button></Chrome>
}

function OnboardingChecklistVisual() {
  const [done, setDone] = useState(2)

  return <Chrome className="w-56 p-2 text-xs"><p className="mb-2 font-medium">{done}/3 완료</p>{["프로필", "팀 초대", "첫 프로젝트"].map((item, index) => <button key={item} type="button" className="mb-1 flex w-full items-center gap-2 rounded px-2 py-1 text-left hover:bg-muted" onClick={() => setDone(Math.max(done, index + 1))}><span className={cn("size-4 rounded border", index < done && "bg-primary")} />{item}</button>)}</Chrome>
}

function SetupProgressVisual() {
  const [value, setValue] = useState(60)

  return <Chrome className="w-52 p-3 text-xs"><div className="mb-2 flex justify-between"><span>설정</span><span>{value}%</span></div><div className="h-2 rounded bg-muted"><div className="h-full rounded bg-primary" style={{ width: `${value}%` }} /></div><button type="button" className="mt-3 rounded border px-2 py-1" onClick={() => setValue(Math.min(100, value + 20))}>계속</button></Chrome>
}

function HelpCenterCardVisual() {
  return <Chrome className="w-48 p-3 text-xs"><BookOpen aria-hidden="true" className="text-primary" /><p className="mt-2 font-medium">결제 도움말</p><Line className="mt-2 w-28" /><button type="button" className="mt-3 text-primary">문서 보기</button></Chrome>
}

function FaqListVisual() {
  const [open, setOpen] = useState(true)

  return <Chrome className="w-56 p-2 text-xs"><button type="button" className="flex w-full items-center justify-between rounded px-2 py-1 text-left font-medium" onClick={() => setOpen((value) => !value)}>환불이 되나요?<ChevronDown aria-hidden="true" /></button>{open && <div className="rounded bg-muted p-2"><Line className="w-36" /></div>}<button type="button" className="mt-1 flex w-full items-center justify-between rounded px-2 py-1 text-left">플랜 변경<ChevronRight aria-hidden="true" /></button></Chrome>
}

function AnnouncementBannerVisual() {
  const [visible, setVisible] = useState(true)

  if (!visible) return <button type="button" className="rounded border px-3 py-2 text-xs" onClick={() => setVisible(true)}>공지 보기</button>
  return <Chrome className="flex w-60 items-center justify-between gap-2 px-3 py-2 text-xs"><span className="flex items-center gap-2"><Info aria-hidden="true" />새 기능 출시</span><button type="button" onClick={() => setVisible(false)}><X aria-hidden="true" /></button></Chrome>
}

function ReleaseNoteCardVisual() {
  return <Chrome className="w-52 p-3 text-xs"><div className="flex justify-between"><b>v1.4.0</b><span>Jun 26</span></div><Line className="mt-3 w-32" /><div className="mt-3 flex gap-1"><span className="rounded bg-primary/10 px-2 py-0.5 text-primary">New</span><span className="rounded bg-muted px-2 py-0.5">Fix</span></div></Chrome>
}

function ProfileCardVisual() {
  return <Chrome className="flex w-52 items-center gap-3 p-3 text-xs"><span className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground"><User aria-hidden="true" /></span><div><p className="font-medium">Yusun</p><p className="text-muted-foreground">Designer</p><button type="button" className="mt-1 text-primary">메시지</button></div></Chrome>
}

function TeamMemberRowVisual() {
  const [role, setRole] = useState("Editor")

  return <Chrome className="flex w-64 items-center gap-2 p-2 text-xs"><span className="flex size-7 items-center justify-center rounded-full bg-muted"><User aria-hidden="true" /></span><div className="min-w-0 flex-1"><p className="font-medium">member@mail</p><p className="text-muted-foreground">초대됨</p></div><button type="button" className="rounded border px-2 py-1" onClick={() => setRole(role === "Editor" ? "Admin" : "Editor")}>{role}</button></Chrome>
}

function RoleBadgeVisual() {
  const [role, setRole] = useState("Admin")

  return <button type="button" className="rounded-full border bg-primary px-3 py-1 text-xs text-primary-foreground" onClick={() => setRole(role === "Admin" ? "Viewer" : "Admin")}>{role}</button>
}

function ApiKeyFieldVisual() {
  const [shown, setShown] = useState(false)

  return <Chrome className="flex w-60 items-center gap-2 p-2 text-xs"><code className="min-w-0 flex-1 rounded bg-muted px-2 py-1">{shown ? "sk_live_1234" : "sk_live_••••"}</code><button type="button" onClick={() => setShown((value) => !value)}><EyeOff aria-hidden="true" /></button><button type="button"><Copy aria-hidden="true" /></button></Chrome>
}

function WebhookEndpointRowVisual() {
  const [active, setActive] = useState(true)

  return <Chrome className="flex w-64 items-center gap-2 p-2 text-xs"><LinkIcon aria-hidden="true" /><span className="min-w-0 flex-1 truncate">https://api.site/hook</span><button type="button" className={cn("rounded-full px-2 py-0.5", active ? "bg-primary text-primary-foreground" : "bg-muted")} onClick={() => setActive((value) => !value)}>{active ? "active" : "off"}</button></Chrome>
}

function IntegrationCardVisual() {
  const [connected, setConnected] = useState(false)

  return <Chrome className="w-48 p-3 text-xs"><div className="flex items-center gap-2"><span className="flex size-8 items-center justify-center rounded bg-muted"><Settings aria-hidden="true" /></span><b>Slack</b></div><Line className="mt-3 w-28" /><button type="button" className={cn("mt-3 rounded px-2 py-1", connected ? "border" : "bg-primary text-primary-foreground")} onClick={() => setConnected(true)}>{connected ? "연결됨" : "연결"}</button></Chrome>
}

function ConnectionCardVisual() {
  const [connected, setConnected] = useState(true)

  return <Chrome className="w-52 p-3 text-xs"><div className="flex items-center justify-between"><b>GitHub</b><span className={cn("size-2 rounded-full", connected ? "bg-primary" : "bg-muted-foreground")} /></div><p className="mt-2 text-muted-foreground">yusun/design</p><button type="button" className="mt-3 rounded border px-2 py-1" onClick={() => setConnected((value) => !value)}>{connected ? "해제" : "연결"}</button></Chrome>
}

function BillingSummaryVisual() {
  return <Chrome className="w-56 p-3 text-xs"><div className="flex justify-between"><span>현재 플랜</span><b>Pro</b></div><div className="mt-2 flex justify-between"><span>다음 청구</span><span>Jul 26</span></div><div className="mt-2 flex justify-between"><span>금액</span><b>₩12K</b></div></Chrome>
}

function InvoiceRowVisual() {
  const [downloaded, setDownloaded] = useState(false)

  return <Chrome className="flex w-64 items-center gap-2 p-2 text-xs"><span>2026-06</span><span className="ml-auto">₩12K</span><span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary">paid</span><button type="button" className="rounded border px-2 py-1" onClick={() => setDownloaded(true)}>{downloaded ? "완료" : "PDF"}</button></Chrome>
}

function VersionHistoryListVisual() {
  const [restored, setRestored] = useState(false)

  return <Chrome className="w-56 p-2 text-xs">{["오늘 10:00", "어제 19:20"].map((item, index) => <div key={item} className="mb-1 flex items-center gap-2 rounded px-2 py-1"><Clock aria-hidden="true" /><span className="flex-1">{item}</span><button type="button" className="text-primary" onClick={() => setRestored(true)}>{restored && index === 0 ? "복원됨" : "복원"}</button></div>)}</Chrome>
}

type AccountFlowKind =
  | "email-banner"
  | "verify-gate"
  | "magic-link"
  | "passkey-enroll"
  | "passkey-sheet"
  | "mfa-card"
  | "recovery-codes"
  | "recovery-warning"
  | "trusted-device"
  | "device-approval"
  | "access-request"
  | "access-pending"
  | "invite-accept"
  | "invite-expired"
  | "workspace-join"
  | "welcome-choice"
  | "import-choice"
  | "setup-blocker"
  | "reconnect"
  | "consent-review"

function AccountFlowVisual({ kind }: { kind: AccountFlowKind }) {
  const [active, setActive] = useState(false)
  const done = active

  if (kind === "email-banner") {
    return <Chrome className="flex w-64 items-center gap-2 px-3 py-2 text-xs"><Info aria-hidden="true" className="text-primary" /><span className="flex-1">이메일 인증 필요</span><button type="button" className="rounded border px-2 py-1" onClick={() => setActive(true)}>{done ? "전송됨" : "재전송"}</button></Chrome>
  }
  if (kind === "verify-gate") {
    return <Chrome className="flex w-52 flex-col items-center gap-2 p-3 text-center text-xs"><CheckCircle2 aria-hidden="true" className="text-primary" /><b>인증 필요</b><Line className="w-28" /><button type="button" className="rounded bg-primary px-2 py-1 text-primary-foreground" onClick={() => setActive(true)}>{done ? "확인 중" : "인증하기"}</button></Chrome>
  }
  if (kind === "magic-link") {
    return <Chrome className="w-56 p-3 text-xs"><div className="flex items-center gap-2"><LinkIcon aria-hidden="true" className="text-primary" /><b>로그인 링크 전송</b></div><p className="mt-2 text-muted-foreground">mail@example.com</p><button type="button" className="mt-3 rounded border px-2 py-1" onClick={() => setActive(true)}>{done ? "30초 후 가능" : "다시 보내기"}</button></Chrome>
  }
  if (kind === "passkey-enroll") {
    return <Chrome className="w-52 p-3 text-xs"><div className="flex items-center gap-2"><Settings aria-hidden="true" /><b>패스키 설정</b></div><Line className="mt-3 w-32" /><div className="mt-3 flex gap-2"><button type="button" className="rounded bg-primary px-2 py-1 text-primary-foreground" onClick={() => setActive(true)}>{done ? "설정됨" : "등록"}</button><button type="button" className="rounded border px-2 py-1">나중에</button></div></Chrome>
  }
  if (kind === "passkey-sheet") {
    return <div className="w-56 rounded-t-2xl border bg-card p-3 text-xs shadow-sm"><div className="mx-auto mb-3 h-1 w-10 rounded-full bg-muted-foreground/30" /><b>패스키로 로그인</b><p className="mt-2 text-muted-foreground">yusun@example.com</p><button type="button" className="mt-3 w-full rounded bg-primary py-1 text-primary-foreground" onClick={() => setActive(true)}>{done ? "인증됨" : "계속"}</button><button type="button" className="mt-2 w-full text-primary">다른 방법</button></div>
  }
  if (kind === "mfa-card") {
    return <Chrome className="w-52 p-3 text-xs"><div className="flex justify-between"><b>2단계 인증</b><span className="rounded-full bg-muted px-2 py-0.5">꺼짐</span></div><Line className="mt-3 w-32" /><button type="button" className="mt-3 rounded bg-primary px-2 py-1 text-primary-foreground" onClick={() => setActive(true)}>{done ? "진행 중" : "설정"}</button></Chrome>
  }
  if (kind === "recovery-codes") {
    return <Chrome className="w-56 p-3 text-xs"><div className="grid grid-cols-2 gap-1 font-mono">{["AB12", "CD34", "EF56", "GH78"].map((code) => <span key={code} className="rounded bg-muted px-2 py-1">{code}</span>)}</div><div className="mt-3 flex gap-2"><button type="button" className="rounded border px-2 py-1"><Copy aria-hidden="true" /></button><button type="button" className="rounded border px-2 py-1"><Download aria-hidden="true" /></button></div></Chrome>
  }
  if (kind === "recovery-warning") {
    return <Chrome className="w-56 p-3 text-xs"><div className="flex gap-2"><AlertTriangle aria-hidden="true" className="text-destructive" /><b>코드 저장 필요</b></div><Line className="mt-3 w-32" /><label className="mt-3 flex items-center gap-2"><span className={cn("size-4 rounded border", done && "bg-primary")} onClick={() => setActive((value) => !value)} />확인했습니다</label></Chrome>
  }
  if (kind === "trusted-device") {
    return <Chrome className="w-56 p-3 text-xs"><div className="flex items-center gap-2"><Home aria-hidden="true" /><b>이 기기 기억</b></div><p className="mt-2 text-muted-foreground">개인 기기에서만 사용</p><div className="mt-3 flex gap-2"><button type="button" className="rounded bg-primary px-2 py-1 text-primary-foreground">신뢰</button><button type="button" className="rounded border px-2 py-1">아니오</button></div></Chrome>
  }
  if (kind === "device-approval") {
    return <Chrome className="flex w-56 flex-col items-center gap-2 p-3 text-center text-xs"><Clock aria-hidden="true" className="text-primary" /><b>새 기기 승인 대기</b><p className="text-muted-foreground">남은 시간 04:59</p><button type="button" className="rounded border px-2 py-1">취소</button></Chrome>
  }
  if (kind === "access-request") {
    return <Chrome className="w-56 p-3 text-xs"><div className="flex items-center gap-2"><Folder aria-hidden="true" /><b>접근 권한 없음</b></div><textarea className="mt-3 h-12 w-full resize-none rounded border bg-background p-2" readOnly value="요청 사유" /><button type="button" className="mt-2 rounded bg-primary px-2 py-1 text-primary-foreground">접근 요청</button></Chrome>
  }
  if (kind === "access-pending") {
    return <Chrome className="w-52 p-3 text-xs"><div className="flex items-center gap-2"><Clock aria-hidden="true" className="text-primary" /><b>승인 대기</b></div><p className="mt-2 text-muted-foreground">관리자에게 요청됨</p><button type="button" className="mt-3 rounded border px-2 py-1">요청 취소</button></Chrome>
  }
  if (kind === "invite-accept") {
    return <Chrome className="w-56 p-3 text-xs"><b>Askewly 팀 초대</b><p className="mt-2 text-muted-foreground">Editor 역할</p><div className="mt-3 flex gap-2"><button type="button" className="rounded bg-primary px-2 py-1 text-primary-foreground">수락</button><button type="button" className="rounded border px-2 py-1">거절</button></div></Chrome>
  }
  if (kind === "invite-expired") {
    return <Chrome className="flex w-52 flex-col items-center gap-2 p-3 text-center text-xs"><X aria-hidden="true" className="text-destructive" /><b>초대 만료</b><Line className="w-28" /><button type="button" className="rounded border px-2 py-1">새 초대 요청</button></Chrome>
  }
  if (kind === "workspace-join") {
    return <Chrome className="w-56 p-3 text-xs"><div className="flex items-center gap-2"><User aria-hidden="true" /><b>Team Workspace</b></div><p className="mt-2 text-muted-foreground">승인 후 참여 가능</p><button type="button" className="mt-3 rounded bg-primary px-2 py-1 text-primary-foreground">참여 요청</button></Chrome>
  }
  if (kind === "welcome-choice") {
    return <Chrome className="w-60 p-3 text-xs"><b>어떻게 시작할까요?</b><div className="mt-3 grid grid-cols-3 gap-1">{["새로", "가져오기", "템플릿"].map((item) => <button key={item} type="button" className="rounded border p-2">{item}</button>)}</div></Chrome>
  }
  if (kind === "import-choice") {
    return <Chrome className="w-60 p-3 text-xs"><b>데이터 가져오기</b><div className="mt-3 grid grid-cols-3 gap-1">{["CSV", "직접", "연동"].map((item) => <button key={item} type="button" className="rounded border p-2">{item}</button>)}</div></Chrome>
  }
  if (kind === "setup-blocker") {
    return <Chrome className="flex w-56 flex-col items-center gap-2 p-3 text-center text-xs"><Settings aria-hidden="true" /><b>설정 필요</b><p className="text-muted-foreground">연동을 완료해야 합니다</p><button type="button" className="rounded bg-primary px-2 py-1 text-primary-foreground">설정으로</button></Chrome>
  }
  if (kind === "reconnect") {
    return <Chrome className="w-56 p-3 text-xs"><div className="flex items-center justify-between"><b>Google</b><span className="rounded-full bg-destructive/10 px-2 py-0.5 text-destructive">끊김</span></div><p className="mt-2 text-muted-foreground">마지막 동기화 실패</p><button type="button" className="mt-3 rounded bg-primary px-2 py-1 text-primary-foreground">다시 연결</button></Chrome>
  }

  return <Chrome className="w-56 p-3 text-xs"><b>접근 범위 검토</b>{["프로필", "이메일", "파일 목록"].map((item) => <div key={item} className="mt-2 flex items-center gap-2"><Check aria-hidden="true" className="text-primary" /><span>{item}</span></div>)}<button type="button" className="mt-3 rounded bg-primary px-2 py-1 text-primary-foreground">동의</button></Chrome>
}

type ShadcnGapKind =
  | "aspect-ratio"
  | "hover-card"
  | "scroll-area"
  | "native-select"
  | "kbd"
  | "navigation-menu"
  | "field-group"
  | "item-row"
  | "sonner"
  | "direction-provider"

function ShadcnGapVisual({ kind }: { kind: ShadcnGapKind }) {
  if (kind === "aspect-ratio") {
    return <Chrome className="w-56 p-2 text-xs"><div className="flex aspect-video items-center justify-center rounded bg-muted"><ImageIcon aria-hidden="true" /><span className="ml-2">16:9</span></div></Chrome>
  }
  if (kind === "hover-card") {
    return <div className="relative w-56 p-2 text-xs"><button type="button" className="rounded border bg-card px-2 py-1">@yusun</button><div className="absolute left-10 top-10 w-44 rounded-md border bg-card p-3 shadow-sm"><b>Yusun</b><p className="mt-1 text-muted-foreground">AI builder</p><Line className="mt-2 w-24" /></div></div>
  }
  if (kind === "scroll-area") {
    return <Chrome className="relative h-28 w-52 overflow-hidden p-2 text-xs">{["알림", "초대", "댓글", "빌드", "결제", "권한"].map((item) => <div key={item} className="mb-1 rounded border px-2 py-1">{item}</div>)}<span className="absolute right-1 top-3 h-16 w-1 rounded bg-primary" /></Chrome>
  }
  if (kind === "native-select") {
    return <Chrome className="w-52 p-3 text-xs"><label className="mb-1 block text-muted-foreground">언어</label><select className="w-full rounded border bg-background px-2 py-1"><option>한국어</option><option>English</option></select></Chrome>
  }
  if (kind === "kbd") {
    return <Chrome className="flex w-44 items-center justify-center gap-1 p-4 text-xs">{["Cmd", "K"].map((key) => <kbd key={key} className="rounded border bg-muted px-2 py-1 font-mono shadow-sm">{key}</kbd>)}</Chrome>
  }
  if (kind === "navigation-menu") {
    return <Chrome className="relative w-60 p-2 text-xs"><div className="flex gap-3"><button type="button" className="font-medium text-primary">제품</button><button type="button">리소스</button><button type="button">가격</button></div><div className="mt-2 grid grid-cols-2 gap-2 rounded border bg-background p-2"><span>대시보드</span><span>자동화</span><span>템플릿</span><span>API</span></div></Chrome>
  }
  if (kind === "field-group") {
    return <Chrome className="w-56 p-3 text-xs"><label className="font-medium">이메일</label><p className="text-muted-foreground">로그인 주소</p><input className="mt-2 w-full rounded border bg-background px-2 py-1" value="bad-email" readOnly /><p className="mt-1 text-destructive">이메일 형식이 아닙니다</p></Chrome>
  }
  if (kind === "item-row") {
    return <Chrome className="flex w-60 items-center gap-3 p-3 text-xs"><span className="flex size-8 items-center justify-center rounded bg-muted"><Settings aria-hidden="true" /></span><div className="min-w-0 flex-1"><b>알림 설정</b><p className="text-muted-foreground">이메일과 푸시</p></div><ChevronRight aria-hidden="true" /></Chrome>
  }
  if (kind === "sonner") {
    return <Chrome className="flex w-56 items-center gap-2 p-3 text-xs shadow-sm"><CheckCircle2 aria-hidden="true" className="text-primary" /><span className="flex-1">저장 완료</span><button type="button" className="text-primary">취소</button></Chrome>
  }

  return <Chrome className="w-56 p-3 text-xs"><div className="flex items-center justify-between"><span>LTR</span><span className="rounded bg-primary px-2 py-0.5 text-primary-foreground">RTL</span></div><div className="mt-3 flex justify-end gap-2 rounded border p-2"><Line className="w-16" /><ChevronLeft aria-hidden="true" /></div></Chrome>
}

type AuthPatternKind =
  | "login-form"
  | "signup-form"
  | "forgot-password-form"
  | "reset-password-form"
  | "change-password-form"
  | "magic-link-login-form"
  | "sso-login-form"
  | "social-login-button-group"
  | "otp-challenge-form"
  | "mfa-challenge-form"
  | "passkey-login-form"
  | "invite-signup-form"
  | "account-creation-form"
  | "email-change-form"
  | "reauthentication-form"
  | "auth-method-choice"
  | "auth-card"
  | "login-page"
  | "split-auth-layout"
  | "login-dialog"

function AuthPatternVisual({ kind }: { kind: AuthPatternKind }) {
  const [active, setActive] = useState(false)

  if (kind === "login-page") {
    return <div className="flex h-32 w-64 overflow-hidden rounded-md border bg-card text-xs"><div className="flex flex-1 flex-col justify-between bg-muted p-3"><b>Askewly</b><Line className="w-20" /><Line className="w-28" /></div><AuthMiniForm title="로그인" cta="계속" active={active} onClick={() => setActive(true)} /></div>
  }
  if (kind === "split-auth-layout") {
    return <div className="grid h-32 w-64 grid-cols-[1fr_88px] overflow-hidden rounded-md border bg-card text-xs"><AuthMiniForm title="계정 만들기" cta="시작" active={active} onClick={() => setActive(true)} /><div className="bg-primary/15 p-3"><Star aria-hidden="true" className="text-primary" /><Line className="mt-4 w-14" /><Line className="mt-2 w-10" /></div></div>
  }
  if (kind === "login-dialog") {
    return <div className="relative h-32 w-64 rounded-md border bg-muted/60 p-4 text-xs"><div className="absolute inset-x-8 top-5 rounded-md border bg-card p-3 shadow-sm"><div className="mb-2 flex items-center justify-between"><b>다시 로그인</b><X aria-hidden="true" /></div><Line className="w-32" /><button type="button" className="mt-3 rounded bg-primary px-2 py-1 text-primary-foreground" onClick={() => setActive(true)}>{active ? "확인됨" : "로그인"}</button></div></div>
  }
  if (kind === "auth-card") {
    return <Chrome className="w-56 p-3 text-xs"><div className="mb-3 flex items-center gap-2"><span className="flex size-7 items-center justify-center rounded bg-primary text-primary-foreground"><User aria-hidden="true" /></span><b>계정 접근</b></div><Line className="w-36" /><Line className="mt-2 w-28" /><button type="button" className="mt-3 w-full rounded bg-primary py-1 text-primary-foreground" onClick={() => setActive(true)}>{active ? "진행 중" : "계속"}</button></Chrome>
  }
  if (kind === "social-login-button-group") {
    return <Chrome className="grid w-56 grid-cols-3 gap-2 p-3 text-xs">{["G", "A", "S"].map((item) => <button key={item} type="button" className={cn("rounded border py-2 font-semibold", active && item === "G" && "border-primary bg-primary/10 text-primary")} onClick={() => setActive(true)}>{item}</button>)}</Chrome>
  }
  if (kind === "auth-method-choice") {
    return <Chrome className="w-56 p-3 text-xs"><b>로그인 방법 선택</b>{["이메일", "SSO", "패스키"].map((item, index) => <button key={item} type="button" className={cn("mt-2 flex w-full items-center justify-between rounded border px-2 py-1", active && index === 2 && "border-primary text-primary")} onClick={() => setActive(true)}><span>{item}</span><ChevronRight aria-hidden="true" /></button>)}</Chrome>
  }
  if (kind === "sso-login-form") {
    return <Chrome className="w-56 p-3 text-xs"><label className="text-muted-foreground">회사 도메인</label><input className="mt-1 w-full rounded border bg-background px-2 py-1" readOnly value="askewly.com" /><button type="button" className="mt-3 w-full rounded bg-primary py-1 text-primary-foreground" onClick={() => setActive(true)}>{active ? "리디렉션" : "SSO로 계속"}</button></Chrome>
  }
  if (kind === "passkey-login-form") {
    return <Chrome className="flex w-56 flex-col items-center gap-2 p-3 text-center text-xs"><Settings aria-hidden="true" className="text-primary" /><b>패스키로 로그인</b><Line className="w-28" /><button type="button" className="rounded bg-primary px-3 py-1 text-primary-foreground" onClick={() => setActive(true)}>{active ? "인증됨" : "패스키 사용"}</button></Chrome>
  }
  if (kind === "otp-challenge-form" || kind === "mfa-challenge-form") {
    const title = kind === "otp-challenge-form" ? "인증 코드" : "2단계 인증"
    return <Chrome className="w-56 p-3 text-xs"><b>{title}</b><div className="mt-3 flex gap-1">{["4", "2", "8", active ? "1" : ""].map((digit, index) => <button key={index} type="button" className={cn("flex size-7 items-center justify-center rounded border", index === 3 && "border-primary")} onClick={() => setActive(true)}>{digit}</button>)}</div><button type="button" className="mt-3 rounded bg-primary px-2 py-1 text-primary-foreground" onClick={() => setActive(true)}>{active ? "확인됨" : "확인"}</button></Chrome>
  }
  if (kind === "magic-link-login-form" || kind === "forgot-password-form") {
    const title = kind === "magic-link-login-form" ? "매직 링크" : "비밀번호 찾기"
    const cta = kind === "magic-link-login-form" ? "링크 보내기" : "재설정 메일"
    return <Chrome className="w-56 p-3 text-xs"><b>{title}</b><input className="mt-3 w-full rounded border bg-background px-2 py-1" readOnly value="mail@example.com" /><button type="button" className="mt-3 w-full rounded bg-primary py-1 text-primary-foreground" onClick={() => setActive(true)}>{active ? "전송됨" : cta}</button></Chrome>
  }
  if (kind === "reset-password-form" || kind === "change-password-form") {
    const title = kind === "reset-password-form" ? "새 비밀번호" : "비밀번호 변경"
    return <Chrome className="w-56 p-3 text-xs"><b>{title}</b><div className="mt-3 space-y-2"><PasswordLine /><PasswordLine /></div><div className="mt-3 h-1.5 rounded bg-muted"><span className="block h-full w-2/3 rounded bg-primary" /></div><button type="button" className="mt-3 rounded bg-primary px-2 py-1 text-primary-foreground" onClick={() => setActive(true)}>{active ? "저장됨" : "저장"}</button></Chrome>
  }
  if (kind === "invite-signup-form" || kind === "account-creation-form" || kind === "signup-form") {
    const title = kind === "invite-signup-form" ? "초대 수락" : kind === "account-creation-form" ? "계정 생성" : "회원가입"
    return <Chrome className="w-56 p-3 text-xs"><b>{title}</b><div className="mt-3 space-y-2"><Line className="h-7 w-full rounded border bg-background" /><Line className="h-7 w-full rounded border bg-background" /></div><label className="mt-3 flex items-center gap-2"><span className={cn("size-4 rounded border", active && "bg-primary")} />약관 동의</label><button type="button" className="mt-2 rounded bg-primary px-2 py-1 text-primary-foreground" onClick={() => setActive(true)}>{active ? "준비됨" : "만들기"}</button></Chrome>
  }
  if (kind === "email-change-form") {
    return <Chrome className="w-56 p-3 text-xs"><b>이메일 변경</b><p className="mt-2 text-muted-foreground">current@example.com</p><input className="mt-2 w-full rounded border bg-background px-2 py-1" readOnly value="new@example.com" /><button type="button" className="mt-3 rounded bg-primary px-2 py-1 text-primary-foreground" onClick={() => setActive(true)}>{active ? "확인 메일 전송" : "변경 요청"}</button></Chrome>
  }
  if (kind === "reauthentication-form") {
    return <Chrome className="w-56 p-3 text-xs"><div className="flex items-center gap-2"><AlertTriangle aria-hidden="true" className="text-destructive" /><b>본인 확인</b></div><PasswordLine className="mt-3" /><button type="button" className="mt-3 rounded bg-primary px-2 py-1 text-primary-foreground" onClick={() => setActive(true)}>{active ? "확인됨" : "계속"}</button></Chrome>
  }

  return <Chrome className="w-56 p-3 text-xs"><AuthMiniForm title="로그인" cta="로그인" active={active} onClick={() => setActive(true)} /></Chrome>
}

function AuthMiniForm({ title, cta, active, onClick }: { title: string; cta: string; active: boolean; onClick: () => void }) {
  return <div className="flex min-w-0 flex-1 flex-col justify-center p-3 text-xs"><b>{title}</b><div className="mt-3 space-y-2"><Line className="h-6 w-full rounded border bg-background" /><Line className="h-6 w-full rounded border bg-background" /></div><button type="button" className="mt-3 w-full rounded bg-primary py-1 text-primary-foreground" onClick={onClick}>{active ? "진행 중" : cta}</button></div>
}

function PasswordLine({ className }: { className?: string }) {
  return <div className={cn("flex h-7 items-center justify-between rounded border bg-background px-2", className)}><span>••••••••</span><EyeOff aria-hidden="true" className="size-3 text-muted-foreground" /></div>
}

type ShadcnBlockKind =
  | "dashboard-overview-page"
  | "sidebar-dashboard-layout"
  | "collapsible-sidebar-layout"
  | "icon-sidebar-layout"
  | "inset-sidebar-layout"
  | "right-sidebar-layout"
  | "dual-sidebar-layout"
  | "file-tree-sidebar-layout"
  | "calendar-sidebar-layout"
  | "sidebar-dialog-layout"
  | "area-chart-card"
  | "bar-chart-card"
  | "line-chart-card"
  | "pie-chart-card"
  | "radar-chart-card"
  | "radial-chart-card"
  | "interactive-chart-card"
  | "stacked-chart-card"
  | "chart-tooltip-pattern"
  | "chart-kpi-card"

function ShadcnBlockVisual({ kind }: { kind: ShadcnBlockKind }) {
  const [active, setActive] = useState(false)

  if (kind.includes("sidebar") || kind === "dashboard-overview-page") {
    return <SidebarBlockFrame kind={kind} active={active} onToggle={() => setActive((value) => !value)} />
  }

  return <ChartBlockFrame kind={kind} active={active} />
}

function SidebarBlockFrame({ kind, active, onToggle }: { kind: ShadcnBlockKind; active: boolean; onToggle: () => void }) {
  const isIcon = kind === "icon-sidebar-layout"
  const isRight = kind === "right-sidebar-layout"
  const isDual = kind === "dual-sidebar-layout"
  const isDialog = kind === "sidebar-dialog-layout"
  const isInset = kind === "inset-sidebar-layout"
  const isDashboard = kind === "dashboard-overview-page"
  const isFileTree = kind === "file-tree-sidebar-layout"
  const isCalendar = kind === "calendar-sidebar-layout"
  const isCollapsible = kind === "collapsible-sidebar-layout"

  const sidebar = (
    <div className={cn("flex h-full flex-col gap-2 border-r bg-muted/60 p-2", isIcon ? "w-10" : "w-20", isRight && "border-l border-r-0")}>
      <div className="flex items-center gap-1">
        <span className="flex size-5 items-center justify-center rounded bg-primary text-primary-foreground"><Home aria-hidden="true" className="size-3" /></span>
        {!isIcon && <Line className="w-10" />}
      </div>
      {isCalendar ? (
        <div className="grid grid-cols-3 gap-1">{Array.from({ length: 9 }).map((_, index) => <span key={index} className={cn("h-3 rounded bg-background", index === 4 && "bg-primary/60")} />)}</div>
      ) : isFileTree ? (
        <div className="flex flex-col gap-1">{["src", "app", "ui"].map((item, index) => <button key={item} type="button" className={cn("flex items-center gap-1 rounded px-1 py-0.5 text-left", active && index === 1 && "bg-primary/15")} onClick={onToggle}><Folder aria-hidden="true" className="size-3" />{!isIcon && <span>{item}</span>}</button>)}</div>
      ) : (
        <div className="flex flex-col gap-1">{[0, 1, 2, 3].map((item) => <button key={item} type="button" className={cn("flex items-center gap-1 rounded px-1 py-0.5", (active ? item === 2 : item === 0) && "bg-primary/15 text-primary")} onClick={onToggle}><Circle aria-hidden="true" className="size-2" />{!isIcon && <Line className={cn(item === 0 ? "w-10" : "w-8")} />}</button>)}</div>
      )}
      {isCollapsible && <div className="mt-auto rounded border bg-background p-1"><ChevronDown aria-hidden="true" className={cn("size-3", active && "rotate-180")} /></div>}
    </div>
  )

  const main = (
    <div className="flex min-w-0 flex-1 flex-col gap-2 p-2">
      <div className="flex items-center justify-between"><Line className="w-20" /><MoreHorizontal aria-hidden="true" className="size-4" /></div>
      {isDashboard ? (
        <>
          <div className="grid grid-cols-3 gap-1">{[0, 1, 2].map((item) => <div key={item} className="rounded border bg-background p-1"><Line className="w-8" /><Line className="mt-1 w-5" /></div>)}</div>
          <div className="flex h-12 items-end gap-1 rounded border bg-background p-2">{[18, 28, 20, 34, 26].map((height) => <span key={height} className="w-4 rounded-t bg-primary/60" style={{ height }} />)}</div>
        </>
      ) : (
        <div className={cn("rounded border bg-background p-2", isInset && "rounded-xl shadow-sm")}>
          <Line className="w-24" /><Line className="mt-2 w-16" /><Line className="mt-2 w-20" />
        </div>
      )}
    </div>
  )

  const rightRail = <div className="w-16 border-l bg-muted/50 p-2"><Line className="w-10" /><Line className="mt-2 w-8" /><Line className="mt-2 w-10" /></div>

  if (isDialog) {
    return <div className="relative h-32 w-64 rounded-md border bg-muted/60 p-4 text-xs"><div className="absolute inset-x-6 top-5 flex h-24 overflow-hidden rounded-md border bg-card shadow-sm">{sidebar}{main}</div></div>
  }

  return (
    <div className={cn("flex h-32 w-64 overflow-hidden rounded-md border bg-card text-left text-xs", isInset && "bg-muted p-2")}>
      <div className={cn("flex min-h-0 flex-1 overflow-hidden", isInset && "rounded-lg border bg-card")}>
        {!isRight && sidebar}
        {main}
        {(isRight || isDual) && rightRail}
      </div>
    </div>
  )
}

function ChartBlockFrame({ kind, active }: { kind: ShadcnBlockKind; active: boolean }) {
  const bars = [20, 34, 26, 42, 30]
  const line = "M8 52 C24 28, 36 42, 52 22 S84 38, 96 18"
  const isArea = kind === "area-chart-card"
  const isBar = kind === "bar-chart-card"
  const isLine = kind === "line-chart-card"
  const isPie = kind === "pie-chart-card"
  const isRadar = kind === "radar-chart-card"
  const isRadial = kind === "radial-chart-card"
  const isInteractive = kind === "interactive-chart-card"
  const isStacked = kind === "stacked-chart-card"
  const isTooltip = kind === "chart-tooltip-pattern"
  const isKpi = kind === "chart-kpi-card"

  return (
    <div className="w-56 rounded-md border bg-card p-3 text-left text-xs shadow-sm">
      <div className="mb-2 flex items-center justify-between"><Line className="w-20" />{isInteractive && <span className="rounded bg-primary px-2 py-0.5 text-primary-foreground">{active ? "30D" : "7D"}</span>}{isKpi && <span className="text-primary">+12%</span>}</div>
      {isKpi && <p className="mb-1 text-lg font-semibold">12.4K</p>}
      <div className="relative flex h-20 items-end justify-center rounded border bg-background p-2">
        {(isArea || isLine || isInteractive || isKpi) && (
          <svg aria-hidden="true" className="h-full w-full" viewBox="0 0 104 64">
            {isArea && <path d={`${line} L96 60 L8 60 Z`} fill="currentColor" className="text-primary/20" />}
            <path d={line} fill="none" stroke="currentColor" strokeWidth="4" className="text-primary" />
            {(isTooltip || active) && <g><circle cx="52" cy="22" r="4" className="fill-primary" /><rect x="46" y="2" width="42" height="16" rx="3" className="fill-card stroke-border" /></g>}
          </svg>
        )}
        {(isBar || isStacked) && (
          <div className="flex h-full items-end gap-2">{bars.map((height, index) => <span key={height} className="flex w-5 flex-col justify-end overflow-hidden rounded-t bg-primary/30">{isStacked && <span className="block bg-primary/70" style={{ height: Math.max(8, height - 14) }} />}{!isStacked && <span className={cn("block bg-primary", active && index === 2 && "bg-destructive")} style={{ height }} />}</span>)}</div>
        )}
        {isPie && <div className="relative size-16 rounded-full border-[12px] border-primary"><span className="absolute inset-2 rounded-full border-[8px] border-muted" /></div>}
        {isRadar && <div className="relative flex size-16 items-center justify-center"><div className="absolute size-16 rotate-45 border" /><div className="absolute size-11 rotate-45 border" /><div className="size-10 rotate-45 bg-primary/30" /></div>}
        {isRadial && <div className="flex size-16 items-center justify-center rounded-full border-[10px] border-primary border-r-muted border-t-primary/50"><span className="text-sm font-semibold">72%</span></div>}
        {isTooltip && <div className="absolute right-3 top-3 rounded border bg-card px-2 py-1 shadow-sm">Jun · 42</div>}
      </div>
    </div>
  )
}

type ShadcnEcosystemKind =
  | "chat-message"
  | "chat-bubble"
  | "chat-attachment"
  | "conversation-marker"
  | "message-scroller"
  | "react-hook-form-pattern"
  | "tanstack-form-pattern"
  | "formisch-form-pattern"
  | "scroll-fade"
  | "shimmer-effect"

function ShadcnEcosystemVisual({ kind }: { kind: ShadcnEcosystemKind }) {
  const [active, setActive] = useState(false)

  if (kind === "chat-message") {
    return (
      <Chrome className="w-60 p-3 text-left text-xs">
        <div className="flex gap-2">
          <span className="flex size-7 items-center justify-center rounded-full bg-primary/15 text-primary"><User aria-hidden="true" className="size-4" /></span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between"><b>Yusung</b><span className="text-muted-foreground">09:41</span></div>
            <div className="mt-1 rounded-lg rounded-tl-sm border bg-background p-2">토큰 사용량 차트를 보여줘</div>
            <div className="mt-1 flex items-center gap-2 text-muted-foreground"><CheckCircle2 aria-hidden="true" className="size-3" />전송됨</div>
          </div>
        </div>
      </Chrome>
    )
  }

  if (kind === "chat-bubble") {
    return (
      <div className="w-60 space-y-2 text-xs">
        <div className="mr-10 rounded-lg rounded-tl-sm border bg-card p-2 shadow-sm">오늘 배포 범위 확인했어?</div>
        <div className="ml-10 rounded-lg rounded-tr-sm bg-primary p-2 text-primary-foreground">검증 끝나면 올릴게.</div>
      </div>
    )
  }

  if (kind === "chat-attachment") {
    return (
      <button type="button" className="text-left" onClick={() => setActive((value) => !value)}>
        <Chrome className="w-60 p-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-primary/10 p-2 text-primary"><FileUp aria-hidden="true" className="size-4" /></span>
            <div className="min-w-0 flex-1"><b>workflow.md</b><p className="text-muted-foreground">124 KB</p></div>
            {active ? <CheckCircle2 aria-hidden="true" className="size-4 text-primary" /> : <Download aria-hidden="true" className="size-4" />}
          </div>
          <div className="mt-3 h-1.5 rounded bg-muted"><span className={cn("block h-full rounded bg-primary", active ? "w-full" : "w-2/3")} /></div>
        </Chrome>
      </button>
    )
  }

  if (kind === "conversation-marker") {
    return (
      <button type="button" className="w-60" onClick={() => setActive((value) => !value)}>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          <span className="flex items-center gap-1 rounded-full border bg-card px-2 py-1">
            {active ? <CheckCircle2 aria-hidden="true" className="size-3 text-primary" /> : <LoaderCircle aria-hidden="true" className="size-3 animate-spin text-primary" />}
            {active ? "완료" : "도구 실행"}
          </span>
          <span className="h-px flex-1 bg-border" />
        </div>
      </button>
    )
  }

  if (kind === "message-scroller") {
    return (
      <button type="button" className="text-left" onClick={() => setActive((value) => !value)}>
        <Chrome className="relative h-32 w-60 overflow-hidden p-2 text-xs">
          <div className="space-y-2">
            <div className="w-36 rounded-lg border bg-background p-2">초안 만들기</div>
            <div className="ml-auto w-40 rounded-lg bg-primary p-2 text-primary-foreground">중복 검사 먼저</div>
            <div className="w-44 rounded-lg border bg-background p-2">검증 명령 실행 중...</div>
            {active && <div className="ml-auto w-32 rounded-lg bg-primary p-2 text-primary-foreground">좋아</div>}
          </div>
          <span className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full border bg-card px-2 py-1 shadow-sm">새 메시지</span>
        </Chrome>
      </button>
    )
  }

  if (kind === "react-hook-form-pattern" || kind === "tanstack-form-pattern" || kind === "formisch-form-pattern") {
    const config = {
      "react-hook-form-pattern": { title: "React Hook Form", meta: "Controller + Zod", badge: "useForm" },
      "tanstack-form-pattern": { title: "TanStack Form", meta: "Field render prop", badge: "form.Field" },
      "formisch-form-pattern": { title: "Formisch", meta: "Valibot schema", badge: "store" },
    }[kind]

    return (
      <button type="button" className="text-left" onClick={() => setActive((value) => !value)}>
        <Chrome className="w-60 p-3 text-xs">
          <div className="flex items-center justify-between"><b>{config.title}</b><span className="rounded bg-primary/10 px-2 py-0.5 text-primary">{config.badge}</span></div>
          <label className="mt-3 block text-muted-foreground">Email</label>
          <div className={cn("mt-1 flex h-7 items-center rounded border bg-background px-2", active && "border-destructive")}>name@example.com</div>
          <div className="mt-2 flex items-center gap-2 text-muted-foreground"><Check aria-hidden="true" className="size-3 text-primary" />{config.meta}</div>
          {active ? <p className="mt-2 text-destructive">이메일 형식을 확인하세요</p> : <Line className="mt-2 w-32" />}
        </Chrome>
      </button>
    )
  }

  if (kind === "scroll-fade") {
    return (
      <Chrome className="relative w-60 overflow-hidden p-3 text-xs">
        <div className="flex gap-2">
          {["Alpha", "Beta", "Gamma", "Delta"].map((item) => <span key={item} className="shrink-0 rounded-full border bg-background px-3 py-1">{item}</span>)}
        </div>
        <span className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-card to-transparent" />
        <span className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-card to-transparent" />
      </Chrome>
    )
  }

  return (
    <Chrome className="w-60 p-3 text-xs">
      <div className="space-y-2">
        <div className="h-4 w-40 animate-pulse rounded bg-primary/20" />
        <div className="h-4 w-52 animate-pulse rounded bg-muted" />
        <div className="h-4 w-32 animate-pulse rounded bg-primary/10" />
      </div>
      <div className="mt-3 rounded border bg-background p-2 text-muted-foreground">loading response</div>
    </Chrome>
  )
}

type OriginCossKind =
  | "floating-label-field"
  | "clearable-input"
  | "inline-submit-field"
  | "character-count-field"
  | "password-strength-meter"
  | "fieldset"
  | "checkbox-card"
  | "date-preset-picker"
  | "navbar-menu"
  | "nav-user-menu"
  | "breadcrumb-overflow"
  | "popover-form"
  | "disclosure-card"
  | "pagination-jump"
  | "avatar-stack"
  | "status-avatar"
  | "badge-group"
  | "meter"
  | "table-row-actions"
  | "empty-filter-state"
  | "notification-inbox-row"
  | "progress-stepper"

function OriginCossVisual({ kind }: { kind: OriginCossKind }) {
  const [active, setActive] = useState(false)

  if (kind === "floating-label-field") {
    return <Chrome className="relative w-56 p-3 text-xs"><span className="absolute left-5 top-1.5 bg-card px-1 text-[10px] text-primary">Email</span><div className="h-9 rounded border bg-background px-3 pt-3">name@example.com</div></Chrome>
  }
  if (kind === "clearable-input") {
    return <Chrome className="flex h-10 w-56 items-center gap-2 px-3 text-xs"><Search aria-hidden="true" className="size-4 text-muted-foreground" /><span className="flex-1">dashboard</span><button type="button" aria-label="입력 지우기" className="rounded-full border p-0.5" onClick={() => setActive(true)}><X aria-hidden="true" className="size-3" /></button></Chrome>
  }
  if (kind === "inline-submit-field") {
    return <Chrome className="flex w-60 overflow-hidden p-1 text-xs"><div className="flex-1 px-3 py-2">mail@example.com</div><button type="button" className="rounded bg-primary px-3 text-primary-foreground" onClick={() => setActive(true)}>{active ? "전송됨" : "구독"}</button></Chrome>
  }
  if (kind === "character-count-field") {
    return <Chrome className="w-56 p-3 text-xs"><div className="h-14 rounded border bg-background p-2">간단한 소개글</div><div className="mt-1 text-right text-muted-foreground">42 / 120</div></Chrome>
  }
  if (kind === "password-strength-meter") {
    return <Chrome className="w-56 p-3 text-xs"><PasswordLine /><div className="mt-3 grid grid-cols-4 gap-1">{[0, 1, 2, 3].map((item) => <span key={item} className={cn("h-1.5 rounded", item < 3 ? "bg-primary" : "bg-muted")} />)}</div><p className="mt-2 text-primary">강함</p></Chrome>
  }
  if (kind === "fieldset") {
    return <Chrome className="w-60 p-3 text-xs"><fieldset className="rounded border p-2"><legend className="px-1 font-medium">배송 주소</legend><Line className="mt-1 w-40" /><Line className="mt-2 w-32" /><Line className="mt-2 w-44" /></fieldset></Chrome>
  }
  if (kind === "checkbox-card") {
    return <button type="button" className="text-left" onClick={() => setActive((value) => !value)}><Chrome className={cn("w-56 p-3 text-xs", active && "border-primary")}><div className="flex items-start gap-2"><span className={cn("mt-0.5 size-4 rounded border", active && "bg-primary")} /><div><b>이메일 알림</b><Line className="mt-2 w-32" /></div></div></Chrome></button>
  }
  if (kind === "date-preset-picker") {
    return <Chrome className="w-60 p-3 text-xs"><div className="flex gap-1">{["7일", "30일", "이번 달"].map((item, index) => <span key={item} className={cn("rounded border px-2 py-1", index === 1 && "bg-primary text-primary-foreground")}>{item}</span>)}</div><div className="mt-3 grid grid-cols-7 gap-1">{Array.from({ length: 14 }).map((_, index) => <span key={index} className={cn("h-4 rounded bg-muted", index > 6 && index < 12 && "bg-primary/40")} />)}</div></Chrome>
  }
  if (kind === "navbar-menu") {
    return <Chrome className="flex w-64 items-center justify-between p-3 text-xs"><b>Askewly</b><div className="flex gap-3"><span>제품</span><span className="text-primary">문서</span><span>가격</span></div><Menu aria-hidden="true" className="size-4" /></Chrome>
  }
  if (kind === "nav-user-menu") {
    return <Chrome className="w-56 p-3 text-xs"><div className="flex items-center justify-between"><div className="flex items-center gap-2"><span className="flex size-7 items-center justify-center rounded-full bg-primary/15 text-primary">Y</span><b>Yusung</b></div><ChevronDown aria-hidden="true" className="size-4" /></div><div className="mt-3 rounded border bg-background p-2"><Line className="w-24" /><Line className="mt-2 w-20" /><Line className="mt-2 w-16" /></div></Chrome>
  }
  if (kind === "breadcrumb-overflow") {
    return <Chrome className="flex w-60 items-center gap-2 p-3 text-xs"><Home aria-hidden="true" className="size-4" /><ChevronRight aria-hidden="true" className="size-3" /><span className="rounded border px-2">...</span><ChevronRight aria-hidden="true" className="size-3" /><b>Settings</b></Chrome>
  }
  if (kind === "popover-form") {
    return <Chrome className="relative w-60 p-3 text-xs"><button type="button" className="rounded bg-primary px-2 py-1 text-primary-foreground" onClick={() => setActive(true)}>저장</button><div className="absolute right-3 top-9 w-40 rounded border bg-card p-2 shadow-sm"><b>뷰 이름</b><Line className="mt-2 h-6 w-full rounded border bg-background" /><div className="mt-2 text-right text-primary">{active ? "저장됨" : "확인"}</div></div></Chrome>
  }
  if (kind === "disclosure-card") {
    return <button type="button" className="text-left" onClick={() => setActive((value) => !value)}><Chrome className="w-56 p-3 text-xs"><div className="flex items-center justify-between"><b>고급 설정</b><ChevronDown aria-hidden="true" className={cn("size-4", active && "rotate-180")} /></div><Line className="mt-2 w-32" />{active && <Line className="mt-2 w-44" />}</Chrome></button>
  }
  if (kind === "pagination-jump") {
    return <Chrome className="flex w-60 items-center gap-2 p-3 text-xs"><ChevronLeft aria-hidden="true" className="size-4" /><span className="rounded border px-2 py-1">12</span><span className="text-muted-foreground">/ 80</span><button type="button" className="rounded bg-primary px-2 py-1 text-primary-foreground" onClick={() => setActive(true)}>이동</button><ChevronRight aria-hidden="true" className="size-4" /></Chrome>
  }
  if (kind === "avatar-stack") {
    return <div className="flex -space-x-2">{["Y", "A", "S", "+4"].map((item) => <span key={item} className="flex size-9 items-center justify-center rounded-full border-2 border-background bg-primary/15 text-xs font-semibold text-primary">{item}</span>)}</div>
  }
  if (kind === "status-avatar") {
    return <div className="relative"><span className="flex size-12 items-center justify-center rounded-full bg-primary/15 text-primary"><User aria-hidden="true" /></span><span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-background bg-primary" /></div>
  }
  if (kind === "badge-group") {
    return <Chrome className="flex w-56 flex-wrap gap-2 p-3 text-xs">{["New", "Beta", "Admin", "+2"].map((item, index) => <span key={item} className={cn("rounded-full border px-2 py-1", index === 0 && "bg-primary text-primary-foreground")}>{item}</span>)}</Chrome>
  }
  if (kind === "meter") {
    return <Chrome className="w-56 p-3 text-xs"><div className="flex justify-between"><b>Storage</b><span>72%</span></div><div className="mt-2 h-2 rounded bg-muted"><span className="block h-full w-[72%] rounded bg-primary" /></div><p className="mt-2 text-muted-foreground">72GB / 100GB</p></Chrome>
  }
  if (kind === "table-row-actions") {
    return <Chrome className="w-60 p-2 text-xs"><div className="grid grid-cols-[1fr_48px] items-center gap-2 rounded border bg-background p-2"><div><Line className="w-28" /><Line className="mt-2 w-20" /></div><button type="button" className="rounded border p-1" onClick={() => setActive(true)}><MoreHorizontal aria-hidden="true" className="mx-auto size-4" /></button></div>{active && <div className="ml-auto mt-1 w-24 rounded border bg-card p-1 shadow-sm"><Line className="w-16" /><Line className="mt-2 w-12" /></div>}</Chrome>
  }
  if (kind === "empty-filter-state") {
    return <Chrome className="flex w-56 flex-col items-center gap-2 p-3 text-center text-xs"><Search aria-hidden="true" className="text-muted-foreground" /><b>결과 없음</b><Line className="w-32" /><button type="button" className="rounded border px-2 py-1" onClick={() => setActive(true)}>{active ? "초기화됨" : "필터 지우기"}</button></Chrome>
  }
  if (kind === "notification-inbox-row") {
    return <Chrome className="w-60 p-3 text-xs"><div className="flex gap-2"><span className="mt-1 size-2 rounded-full bg-primary" /><Bell aria-hidden="true" className="size-4" /><div className="min-w-0 flex-1"><b>새 댓글</b><Line className="mt-2 w-32" /></div><span className="text-muted-foreground">2m</span></div></Chrome>
  }
  return <Chrome className="w-60 p-3 text-xs"><div className="flex items-center justify-between">{["계정", "결제", "완료"].map((item, index) => <span key={item} className="flex flex-col items-center gap-1"><span className={cn("flex size-6 items-center justify-center rounded-full border", index < 2 && "bg-primary text-primary-foreground")}>{index < 1 ? <Check aria-hidden="true" className="size-3" /> : index + 1}</span><span>{item}</span></span>)}</div><div className="mx-8 -mt-7 h-px bg-border" /></Chrome>
}

const EXTERNAL_ECOSYSTEM_VARIANTS = new Set([
  "pricing-section",
  "testimonial-section",
  "feature-grid-section",
  "integration-grid-section",
  "settings-page-layout",
  "profile-settings-form",
  "billing-settings-page",
  "onboarding-flow-page",
  "newsletter-section",
  "cta-section",
  "animated-gradient-background",
  "marquee-row",
  "border-beam",
  "orbiting-icons",
  "spotlight-card",
  "grid-pattern-background",
  "typing-text-effect",
  "number-ticker",
  "blur-fade-in",
  "animated-shiny-text",
  "dot-pattern-background",
  "bento-grid",
  "sticky-scroll-section",
  "floating-navbar",
  "three-d-card",
  "hover-card-stack",
  "background-beams",
  "aurora-background",
  "spotlight-hero",
  "infinite-moving-cards",
  "canvas-reveal-card",
  "tracing-beam-section",
])

type ExternalEcosystemKind = typeof EXTERNAL_ECOSYSTEM_VARIANTS extends Set<infer T> ? T & string : never

function ExternalEcosystemVisual({ kind }: { kind: ExternalEcosystemKind }) {
  const [active, setActive] = useState(false)

  if (kind === "pricing-section") {
    return <Chrome className="grid w-64 grid-cols-3 gap-2 p-3 text-xs">{["Free", "Pro", "Team"].map((plan, index) => <div key={plan} className={cn("rounded border bg-background p-2", index === 1 && "border-primary shadow-sm")}><b>{plan}</b><p className="mt-1 text-lg">${index ? index * 19 : 0}</p><Line className="mt-2 w-10" /></div>)}</Chrome>
  }
  if (kind === "testimonial-section" || kind === "infinite-moving-cards") {
    return <Chrome className="w-64 overflow-hidden p-3 text-xs"><div className="flex gap-2">{[0, 1, 2].map((item) => <div key={item} className="min-w-20 rounded border bg-background p-2"><Star aria-hidden="true" className="size-3 text-primary" /><Line className="mt-2 w-12" /><Line className="mt-1 w-10" /></div>)}</div></Chrome>
  }
  if (kind === "feature-grid-section" || kind === "integration-grid-section") {
    return <Chrome className="grid w-64 grid-cols-3 gap-2 p-3 text-xs">{[Search, Bell, Settings, Folder, LinkIcon, Palette].map((Icon, index) => <div key={index} className="rounded border bg-background p-2"><Icon aria-hidden="true" className="size-4 text-primary" /><Line className="mt-2 w-10" /></div>)}</Chrome>
  }
  if (kind === "settings-page-layout" || kind === "billing-settings-page") {
    return <Chrome className="flex h-32 w-64 overflow-hidden text-xs"><aside className="w-20 border-r bg-muted/50 p-2"><Line className="w-12" /><Line className="mt-2 w-10" /><Line className="mt-2 w-14" /></aside><main className="flex-1 p-3"><div className="rounded border bg-background p-2"><Line className="w-24" /><Line className="mt-2 w-32" /></div><div className="mt-2 rounded border bg-background p-2"><Line className="w-20" /></div></main></Chrome>
  }
  if (kind === "profile-settings-form") {
    return <Chrome className="w-60 p-3 text-xs"><div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-full bg-primary/15 text-primary"><User aria-hidden="true" /></span><Line className="w-28" /></div><Line className="mt-3 h-7 w-full rounded border bg-background" /><Line className="mt-2 h-7 w-full rounded border bg-background" /></Chrome>
  }
  if (kind === "onboarding-flow-page") {
    return <Chrome className="w-64 p-3 text-xs"><div className="mb-3 flex justify-between">{[1, 2, 3].map((step) => <span key={step} className={cn("flex size-6 items-center justify-center rounded-full border", step < 3 && "bg-primary text-primary-foreground")}>{step}</span>)}</div><div className="grid grid-cols-2 gap-2"><div className="rounded border bg-background p-2"><Line className="w-16" /></div><div className="rounded border bg-background p-2"><Line className="w-14" /></div></div></Chrome>
  }
  if (kind === "newsletter-section" || kind === "cta-section") {
    return <Chrome className="w-64 p-3 text-center text-xs"><b>{kind === "cta-section" ? "지금 시작하세요" : "업데이트 받기"}</b><Line className="mx-auto mt-2 w-32" /><div className="mt-3 flex justify-center gap-1"><span className="rounded border bg-background px-3 py-1">email</span><span className="rounded bg-primary px-3 py-1 text-primary-foreground">시작</span></div></Chrome>
  }
  if (kind === "marquee-row") {
    return <Chrome className="w-64 overflow-hidden p-3 text-xs"><div className="flex gap-2">{["A", "B", "C", "D", "E"].map((item) => <span key={item} className="shrink-0 rounded-full border bg-background px-3 py-1">{item}</span>)}</div></Chrome>
  }
  if (kind === "orbiting-icons") {
    return <div className="relative flex size-28 items-center justify-center rounded-full border border-dashed"><span className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground"><Settings aria-hidden="true" className="size-4" /></span>{[Search, Bell, LinkIcon, Folder].map((Icon, index) => <span key={index} className={cn("absolute flex size-7 items-center justify-center rounded-full border bg-card", index === 0 && "top-0", index === 1 && "right-0", index === 2 && "bottom-0", index === 3 && "left-0")}><Icon aria-hidden="true" className="size-3" /></span>)}</div>
  }
  if (kind === "typing-text-effect") {
    return <Chrome className="w-56 p-3 font-mono text-xs">AI가 초안을 작성 중<span className="animate-pulse">|</span></Chrome>
  }
  if (kind === "number-ticker") {
    return <Chrome className="w-48 p-3 text-center"><p className="text-2xl font-semibold">12,840</p><p className="text-xs text-muted-foreground">active users</p></Chrome>
  }
  if (kind === "bento-grid") {
    return <Chrome className="grid h-32 w-64 grid-cols-3 grid-rows-2 gap-2 p-3 text-xs"><div className="col-span-2 rounded border bg-background p-2"><Line className="w-24" /></div><div className="rounded border bg-background p-2"><Line className="w-10" /></div><div className="rounded border bg-background p-2"><Line className="w-12" /></div><div className="col-span-2 rounded border bg-background p-2"><Line className="w-20" /></div></Chrome>
  }
  if (kind === "sticky-scroll-section" || kind === "tracing-beam-section") {
    return <Chrome className="flex h-32 w-64 gap-3 p-3 text-xs"><div className="relative w-8"><span className="absolute left-3 top-0 h-full w-0.5 bg-primary/40" /><span className="absolute left-1.5 top-6 size-4 rounded-full bg-primary" /></div><div className="flex-1 space-y-2"><Line className="w-28" /><Line className="w-36" /><Line className="w-24" /></div><div className="w-20 rounded border bg-background" /></Chrome>
  }
  if (kind === "floating-navbar") {
    return <div className="rounded-full border bg-card px-4 py-2 text-xs shadow-sm"><span className="mr-3 font-medium">Home</span><span className="mr-3">Work</span><span>Contact</span></div>
  }
  if (kind === "three-d-card" || kind === "hover-card-stack" || kind === "canvas-reveal-card" || kind === "spotlight-card") {
    return <button type="button" className="relative h-28 w-48 text-left" onClick={() => setActive((value) => !value)}><div className={cn("absolute inset-3 rounded border bg-card p-3 shadow-sm transition-transform", active && "rotate-2 scale-105")}><Line className="w-24" /><Line className="mt-2 w-16" /></div><div className="absolute inset-x-8 bottom-0 h-4 rounded bg-primary/20 blur-sm" /></button>
  }
  if (kind === "spotlight-hero") {
    return <div className="relative h-32 w-64 overflow-hidden rounded border bg-foreground p-4 text-center text-background"><span className="absolute left-1/2 top-0 h-24 w-32 -translate-x-1/2 rounded-full bg-primary/40 blur-xl" /><b className="relative">Askewly AI</b><p className="relative mt-2 text-xs">Design faster</p></div>
  }

  return <Chrome className="relative h-28 w-56 overflow-hidden p-3 text-xs"><div className={cn("absolute inset-0", (kind.includes("grid") || kind.includes("dot")) && "bg-[radial-gradient(circle,rgba(0,0,0,.18)_1px,transparent_1px)] [background-size:12px_12px]", kind.includes("gradient") || kind.includes("aurora") ? "bg-gradient-to-br from-primary/30 via-muted to-destructive/20" : "bg-muted/40")} /><div className="relative rounded border bg-card/80 p-3"><b>{kind.includes("shiny") ? "New feature" : kind.includes("beam") ? "Beam effect" : "Visual effect"}</b><Line className="mt-2 w-24" /></div></Chrome>
}

function StateVisual({ tone }: { tone: "error" | "success" | "warning" | "info" }) {
  const [dismissed, setDismissed] = useState(false)
  const config = {
    error: { icon: <AlertTriangle aria-hidden="true" />, title: "문제가 발생했습니다" },
    success: { icon: <CheckCircle2 aria-hidden="true" />, title: "완료되었습니다" },
    warning: { icon: <AlertTriangle aria-hidden="true" />, title: "확인이 필요합니다" },
    info: { icon: <Info aria-hidden="true" />, title: "안내" },
  }[tone]

  if (dismissed) return <button type="button" className="rounded border bg-card px-3 py-2 text-sm" onClick={() => setDismissed(false)}>상태 다시 보기</button>

  return <Chrome className="flex w-52 items-start justify-between gap-2 p-3 text-sm"><span className={cn(tone === "success" && "text-primary", tone === "error" && "text-destructive")}>{config.icon}</span><div><p className="font-medium">{config.title}</p><Line className="mt-2 w-28" /></div><button type="button" aria-label="상태 닫기" onClick={() => setDismissed(true)}><X aria-hidden="true" /></button></Chrome>
}

function LoadingStateVisual() {
  const [done, setDone] = useState(false)

  return <button type="button" onClick={() => setDone((value) => !value)}><Chrome className="w-48 p-3 text-left"><div className="flex items-center gap-2 text-sm">{done ? <CheckCircle2 className="text-primary" aria-hidden="true" /> : <LoaderCircle className="animate-spin text-primary" aria-hidden="true" />}{done ? "완료됨" : "불러오는 중"}</div>{!done && <SkeletonVisual />}</Chrome></button>
}

function FallbackVisual({ label }: { label: string }) {
  return <div className="flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm"><Settings aria-hidden="true" /><span>{label}</span></div>
}
