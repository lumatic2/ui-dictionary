import { useState } from "react"
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
  Menu,
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
  size?: "card" | "detail"
}

export function TermVisual({ variant, label, size = "card" }: TermVisualProps) {
  const canvasClass = cn(
    "flex w-full items-center justify-center rounded-md border bg-muted/40 p-3",
    size === "detail" ? "min-h-56" : "min-h-28"
  )
  const visualClass = size === "detail" ? "scale-125" : ""

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
  if (variant === "error-state") return <StateVisual tone="error" />
  if (variant === "success-state") return <StateVisual tone="success" />
  if (variant === "warning-state") return <StateVisual tone="warning" />
  if (variant === "info-state") return <StateVisual tone="info" />
  if (variant === "loading-state") return <LoadingStateVisual />
  return <FallbackVisual label={label} />
}

function Chrome({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <div className={cn("rounded-md border bg-card shadow-sm", className)}>{children}</div>
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

  return <div className="flex flex-col items-end gap-2">{open && [Copy, Share2, Trash2].map((Icon) => <button key={Icon.name} type="button" className="flex size-8 items-center justify-center rounded-full border bg-card shadow-sm"><Icon aria-hidden="true" /></button>)}<button type="button" className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md" onClick={() => setOpen((value) => !value)}><Plus aria-hidden="true" /></button></div>
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
