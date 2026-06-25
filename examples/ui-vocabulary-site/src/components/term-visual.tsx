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
  return <Chrome className="flex h-10 w-48 items-center px-3 text-sm text-muted-foreground">입력값</Chrome>
}

function SearchField() {
  return (
    <Chrome className="flex h-10 w-48 items-center gap-2 px-3 text-sm text-muted-foreground">
      <Search aria-hidden="true" />
      <span>검색어</span>
    </Chrome>
  )
}

function TextareaVisual() {
  return (
    <Chrome className="flex h-20 w-48 flex-col gap-2 p-3">
      <Line className="w-32" />
      <Line className="w-40" />
      <Line className="w-24" />
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
  return (
    <Chrome className="w-48 overflow-hidden">
      <div className="flex h-9 items-center gap-2 border-b px-3 text-sm">
        <Search aria-hidden="true" />
        <span>co</span>
      </div>
      <div className="flex flex-col p-1 text-xs">
        <span className="rounded bg-primary px-2 py-1 text-primary-foreground">Combobox</span>
        <span className="px-2 py-1 text-muted-foreground">Command</span>
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
  return (
    <Chrome className="w-48 overflow-hidden">
      <div className="flex h-9 items-center justify-between border-b px-3 text-sm">
        <span>2026-05-20</span>
        <CalendarDays aria-hidden="true" />
      </div>
      <div className="grid grid-cols-7 gap-1 p-2 text-center text-[10px]">
        {Array.from({ length: 14 }).map((_, day) => (
          <span key={day} className={cn("rounded py-1", day === 10 && "bg-primary text-primary-foreground")}>
            {day + 1}
          </span>
        ))}
      </div>
    </Chrome>
  )
}

function FileUpload() {
  return (
    <Chrome className="flex w-48 items-center gap-2 border-dashed px-3 py-3 text-sm">
      <FileUp aria-hidden="true" />
      <span>파일 선택</span>
    </Chrome>
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
  return (
    <Chrome className="w-52 p-2">
      <div className="flex h-8 items-center gap-2 rounded border px-2 text-xs">
        <Search aria-hidden="true" />
        <span>명령 검색...</span>
      </div>
      <div className="mt-2 flex flex-col gap-1 text-xs">
        <span className="rounded bg-primary px-2 py-1 text-primary-foreground">새 문서 만들기</span>
        <span className="px-2 py-1 text-muted-foreground">설정 열기</span>
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
  return (
    <div className="flex items-center gap-1">
      <SmallIcon><ChevronLeft aria-hidden="true" /></SmallIcon>
      <SmallBox>1</SmallBox>
      <SmallBox active>2</SmallBox>
      <SmallBox>3</SmallBox>
      <SmallIcon><ChevronRight aria-hidden="true" /></SmallIcon>
    </div>
  )
}

function SmallBox({ children, active }: { children: React.ReactNode; active?: boolean }) {
  return <span className={cn("flex size-7 items-center justify-center rounded border text-xs", active && "bg-primary text-primary-foreground")}>{children}</span>
}

function SmallIcon({ children }: { children: React.ReactNode }) {
  return <span className="flex size-7 items-center justify-center rounded border bg-card">{children}</span>
}

function StepperVisual() {
  return (
    <div className="flex items-center">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <span className={cn("flex size-7 items-center justify-center rounded-full border text-xs", step <= 2 && "bg-primary text-primary-foreground")}>{step}</span>
          {step < 3 && <span className="h-px w-10 bg-border" />}
        </div>
      ))}
    </div>
  )
}

function NavigationRail() {
  return (
    <Chrome className="flex h-28 w-14 flex-col items-center justify-around py-2">
      <Home aria-hidden="true" />
      <span className="rounded bg-primary p-1 text-primary-foreground"><Search aria-hidden="true" /></span>
      <Settings aria-hidden="true" />
    </Chrome>
  )
}

function SidebarNav() {
  return (
    <Chrome className="w-44 p-2 text-sm">
      <Row icon={<Home aria-hidden="true" />} text="홈" />
      <Row active icon={<Search aria-hidden="true" />} text="용어" />
      <Row icon={<Settings aria-hidden="true" />} text="설정" />
    </Chrome>
  )
}

function Row({ icon, text, active }: { icon: React.ReactNode; text: string; active?: boolean }) {
  return <div className={cn("flex items-center gap-2 rounded px-2 py-1.5", active && "bg-primary text-primary-foreground")}>{icon}<span>{text}</span></div>
}

function ChipVisual() {
  return <span className="rounded-full border bg-primary px-3 py-1 text-sm text-primary-foreground">선택됨</span>
}

function ButtonVisual({ label, emphasis = "default" }: { label: string; emphasis?: "default" | "primary" | "secondary" | "destructive" }) {
  return (
    <button className={cn("rounded-md px-4 py-2 text-sm font-medium shadow-sm", emphasis === "primary" && "bg-primary text-primary-foreground", emphasis === "secondary" && "border bg-card", emphasis === "destructive" && "bg-destructive text-white", emphasis === "default" && "border bg-card")}>
      {label}
    </button>
  )
}

function IconButtonVisual() {
  return <span className="flex size-10 items-center justify-center rounded-md border bg-card"><Heart aria-hidden="true" /></span>
}

function FabVisual() {
  return <span className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md"><Plus aria-hidden="true" /></span>
}

function LinkVisual() {
  return <span className="inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-4">자세히 보기 <ChevronRight aria-hidden="true" /></span>
}

function ToolbarVisual() {
  return (
    <Chrome className="flex items-center gap-1 p-1">
      {[Search, Settings, Heart, MoreHorizontal].map((Icon) => <span key={Icon.displayName ?? Icon.name} className="flex size-8 items-center justify-center rounded hover:bg-muted"><Icon aria-hidden="true" /></span>)}
    </Chrome>
  )
}

function SplitButton() {
  return (
    <div className="inline-flex overflow-hidden rounded-md border bg-primary text-primary-foreground shadow-sm">
      <span className="px-3 py-2 text-sm">내보내기</span>
      <span className="border-l border-primary-foreground/30 px-2 py-2"><ChevronDown aria-hidden="true" /></span>
    </div>
  )
}

function MenuItemVisual() {
  return <Chrome className="flex w-44 items-center justify-between px-3 py-2 text-sm"><span className="flex items-center gap-2"><Trash2 aria-hidden="true" />삭제</span><span className="text-xs text-muted-foreground">⌘⌫</span></Chrome>
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
  return (
    <div className="relative h-28 w-52 rounded-md border bg-card">
      <div className="absolute bottom-0 right-0 top-0 w-24 border-l bg-background p-2">
        <Line className="w-16" />
        <Line className="mt-2 w-12" />
      </div>
    </div>
  )
}

function PopoverVisual() {
  return (
    <div className="relative h-24 w-44">
      <button className="rounded-md border bg-card px-3 py-1 text-sm">열기</button>
      <Chrome className="absolute bottom-0 right-0 w-32 p-2"><Line className="w-20" /><Line className="mt-2 w-24" /></Chrome>
    </div>
  )
}

function HeaderVisual() {
  return <Chrome className="flex h-12 w-52 items-center justify-between px-3"><Menu aria-hidden="true" /><Line className="w-24" /><Circle aria-hidden="true" /></Chrome>
}

function FooterVisual() {
  return <Chrome className="flex h-12 w-52 items-center justify-around px-3"><Line className="w-12" /><Line className="w-12" /><MoreHorizontal aria-hidden="true" /></Chrome>
}

function GridVisual() {
  return <div className="grid w-48 grid-cols-4 gap-2">{Array.from({ length: 8 }).map((_, item) => <span key={item} className="h-8 rounded border bg-card" />)}</div>
}

function ListVisual() {
  return <Chrome className="w-48 p-2">{[0, 1, 2].map((item) => <div key={item} className="flex items-center gap-2 border-b py-2 last:border-b-0"><span className="size-2 rounded-full bg-primary" /><Line className="w-32" /></div>)}</Chrome>
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
  return <div className="flex items-center gap-2"><ChevronLeft aria-hidden="true" /><div className="flex gap-2">{[0, 1, 2].map((item) => <span key={item} className="h-16 w-12 rounded border bg-card" />)}</div><ChevronRight aria-hidden="true" /></div>
}

function TooltipVisual() {
  return <div className="relative h-20 w-36"><button className="absolute bottom-0 left-6 rounded border bg-card px-3 py-1 text-sm">도움</button><span className="absolute left-0 top-0 rounded-md border bg-popover px-2 py-1 text-xs shadow">도움말 내용</span></div>
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
  return <div className="flex w-52 items-start gap-2 rounded-md border bg-card p-3 text-sm"><AlertTriangle aria-hidden="true" /><span>확인이 필요합니다.</span></div>
}

function BadgeVisual() {
  return <div className="relative"><Bell aria-hidden="true" /><span className="absolute -right-3 -top-3 rounded-full bg-destructive px-1.5 py-0.5 text-xs text-white">3</span></div>
}

function ProgressBarVisual() {
  return <div className="h-3 w-48 rounded-full bg-muted"><div className="h-full w-2/3 rounded-full bg-primary" /></div>
}

function SpinnerVisual() {
  return <LoaderCircle className="animate-spin text-primary" aria-hidden="true" />
}

function SkeletonVisual() {
  return <Chrome className="w-48 p-3"><div className="mb-3 h-12 rounded bg-muted" /><Line className="w-36" /><Line className="mt-2 w-24" /></Chrome>
}

function EmptyStateVisual() {
  return <div className="flex flex-col items-center gap-2 text-center text-sm text-muted-foreground"><Folder aria-hidden="true" /><span>데이터가 없습니다.</span><button className="rounded border bg-card px-2 py-1 text-xs text-foreground">추가</button></div>
}

function ValidationMessage() {
  return <div className="w-48"><Chrome className="h-9 border-destructive px-3 py-2 text-sm">email@</Chrome><p className="mt-1 text-xs text-destructive">이메일 형식을 확인하세요.</p></div>
}

function StatusIndicator() {
  return <span className="flex items-center gap-2 text-sm"><span className="size-3 rounded-full bg-primary" />온라인</span>
}

function TableVisual() {
  return <div className="grid w-48 grid-cols-3 overflow-hidden rounded-md border bg-card text-xs">{Array.from({ length: 9 }).map((_, cell) => <div key={cell} className="h-7 border-b border-r p-1"><Line className="w-full" /></div>)}</div>
}

function AvatarVisual() {
  return <div className="relative flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground"><User aria-hidden="true" /><span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-background bg-primary" /></div>
}

function MetricCardVisual() {
  return <Chrome className="w-44 p-3"><p className="text-xs text-muted-foreground">방문자</p><p className="text-2xl font-semibold">12.4K</p><p className="text-xs text-primary">+8.2%</p></Chrome>
}

function ChartVisual() {
  return <div className="flex h-24 w-44 items-end gap-2 rounded-md border bg-card p-3">{[32, 54, 42, 72, 58].map((height) => <span key={height} className="w-5 rounded-t bg-primary" style={{ height }} />)}</div>
}

function TimelineVisual() {
  return <div className="flex flex-col gap-0">{[0, 1, 2].map((item) => <div key={item} className="flex gap-2 text-xs"><span className="flex flex-col items-center"><span className="size-3 rounded-full bg-primary" /><span className="h-6 w-px bg-border" /></span><span>이벤트 {item + 1}</span></div>)}</div>
}

function KanbanVisual() {
  return <div className="grid w-52 grid-cols-3 gap-2">{["할 일", "진행", "완료"].map((column) => <Chrome key={column} className="p-2"><p className="mb-2 text-[10px] text-muted-foreground">{column}</p><div className="h-8 rounded bg-muted" /></Chrome>)}</div>
}

function CalendarView() {
  return <div className="grid w-48 grid-cols-7 gap-1 rounded-md border bg-card p-2 text-center text-[10px]">{Array.from({ length: 21 }).map((_, day) => <span key={day} className={cn("rounded py-1", day === 14 && "bg-primary text-primary-foreground")}>{day + 1}</span>)}</div>
}

function TreeView() {
  return <Chrome className="w-48 p-2 text-xs"><TreeRow icon={<ChevronDown aria-hidden="true" />} text="components" /><TreeRow indent icon={<Folder aria-hidden="true" />} text="button.tsx" /><TreeRow indent icon={<Folder aria-hidden="true" />} text="card.tsx" /></Chrome>
}

function TreeRow({ icon, text, indent }: { icon: React.ReactNode; text: string; indent?: boolean }) {
  return <div className={cn("flex items-center gap-1 py-1", indent && "pl-5")}>{icon}<span>{text}</span></div>
}

function DescriptionList() {
  return <Chrome className="grid w-48 grid-cols-[64px_1fr] gap-y-2 p-3 text-xs"><span className="text-muted-foreground">상태</span><span>활성</span><span className="text-muted-foreground">역할</span><span>관리자</span><span className="text-muted-foreground">지역</span><span>서울</span></Chrome>
}

function IconVisual() {
  return <span className="flex size-14 items-center justify-center rounded-lg border bg-card text-primary shadow-sm"><Home aria-hidden="true" /></span>
}

function LabelVisual() {
  return <div className="w-48"><p className="mb-1 text-xs font-medium">이름</p><TextField /></div>
}

function DividerVisual() {
  return <div className="w-48 space-y-3"><Line className="w-32" /><div className="h-px w-full bg-border" /><Line className="w-40" /></div>
}

function SpacerVisual() {
  return <div className="flex w-48 items-center gap-4"><span className="h-16 w-14 rounded border bg-card" /><span className="flex h-16 flex-1 items-center justify-center rounded border border-dashed text-xs text-muted-foreground">gap</span><span className="h-16 w-14 rounded border bg-card" /></div>
}

function TypographyVisual() {
  return <div className="w-48 space-y-2"><p className="text-2xl font-semibold">Heading</p><p className="text-sm">Body text line</p><p className="text-xs text-muted-foreground">Caption</p></div>
}

function ImageVisual() {
  return <div className="flex h-24 w-44 items-center justify-center rounded-md border bg-card text-muted-foreground"><ImageIcon aria-hidden="true" /></div>
}

function LogoVisual() {
  return <div className="flex items-center gap-2"><span className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground"><BookOpen aria-hidden="true" /></span><span className="text-lg font-semibold">Brand</span></div>
}

function ThumbnailVisual() {
  return <div className="relative flex h-20 w-36 items-center justify-center rounded-md border bg-card text-muted-foreground"><ImageIcon aria-hidden="true" /><span className="absolute bottom-2 right-2 flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground"><Play aria-hidden="true" /></span></div>
}

function PasswordField() {
  return <Chrome className="flex h-10 w-48 items-center justify-between px-3 text-sm"><span>••••••••</span><EyeOff aria-hidden="true" /></Chrome>
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
  return <div className="flex gap-1">{["4", "2", "8", "", "", ""].map((item, index) => <span key={index} className={cn("flex size-8 items-center justify-center rounded border bg-card text-sm", index === 3 && "border-primary")}>{item}</span>)}</div>
}

function AutocompleteVisual() {
  return <Chrome className="w-48 overflow-hidden"><div className="flex h-9 items-center gap-2 border-b px-3 text-sm"><Search aria-hidden="true" /><span>sea</span></div><div className="p-1 text-xs"><p className="rounded bg-primary px-2 py-1 text-primary-foreground">Search field</p><p className="px-2 py-1 text-muted-foreground">Search view</p></div></Chrome>
}

function SearchSuggestions() {
  return <Chrome className="w-52 overflow-hidden"><SearchField /><div className="border-t p-1 text-xs"><Row icon={<Search aria-hidden="true" />} text="검색 제안" /><Row icon={<Search aria-hidden="true" />} text="최근 검색어" /></div></Chrome>
}

function InlineEditVisual() {
  return <Chrome className="flex h-10 w-48 items-center justify-between px-3 text-sm"><span className="border-b border-primary">문서 제목</span><Type aria-hidden="true" /></Chrome>
}

function RichTextEditor() {
  return <Chrome className="w-52 overflow-hidden"><div className="flex gap-1 border-b p-1"><SmallIcon><Bold aria-hidden="true" /></SmallIcon><SmallIcon><LinkIcon aria-hidden="true" /></SmallIcon></div><div className="space-y-2 p-3"><Line className="w-36" /><Line className="w-28" /></div></Chrome>
}

function ColorPicker() {
  return <Chrome className="w-44 p-3"><div className="mb-3 flex items-center gap-2 text-sm"><Palette aria-hidden="true" /><span>#6D5DF6</span></div><div className="grid grid-cols-6 gap-1">{["bg-primary", "bg-destructive", "bg-accent", "bg-muted-foreground", "bg-card", "bg-foreground"].map((color) => <span key={color} className={cn("size-5 rounded border", color)} />)}</div></Chrome>
}

function ListboxVisual() {
  return <Chrome className="w-44 p-1 text-sm"><p className="rounded bg-primary px-2 py-1 text-primary-foreground">옵션 A</p><p className="px-2 py-1">옵션 B</p><p className="px-2 py-1 text-muted-foreground">옵션 C</p></Chrome>
}

function MenuBarVisual() {
  return <Chrome className="w-52 overflow-hidden text-xs"><div className="flex border-b"><span className="bg-muted px-3 py-2">파일</span><span className="px-3 py-2">편집</span><span className="px-3 py-2">보기</span></div><div className="w-24 p-1"><p className="rounded bg-primary px-2 py-1 text-primary-foreground">새로 만들기</p><p className="px-2 py-1">열기</p></div></Chrome>
}

function BottomNavigation() {
  return <Chrome className="flex h-14 w-52 items-center justify-around px-2 text-[10px]"><NavItem active icon={<Home aria-hidden="true" />} text="홈" /><NavItem icon={<Search aria-hidden="true" />} text="검색" /><NavItem icon={<User aria-hidden="true" />} text="내 정보" /></Chrome>
}

function NavItem({ icon, text, active }: { icon: React.ReactNode; text: string; active?: boolean }) {
  return <span className={cn("flex flex-col items-center gap-0.5", active && "text-primary")}>{icon}<span>{text}</span></span>
}

function FilterChip() {
  return <span className="inline-flex items-center gap-1 rounded-full border bg-primary px-3 py-1 text-sm text-primary-foreground"><Check aria-hidden="true" />진행 중</span>
}

function ToggleButtonVisual() {
  return <button className="flex items-center gap-2 rounded-md border bg-primary px-3 py-2 text-sm text-primary-foreground"><Bold aria-hidden="true" />굵게</button>
}

function DisclosureVisual() {
  return <Chrome className="w-48 p-2 text-sm"><div className="flex items-center justify-between"><span>상세 옵션</span><ChevronDown aria-hidden="true" /></div><Line className="mt-3 w-32" /></Chrome>
}

function AnchorNav() {
  return <Chrome className="w-44 p-2 text-sm"><p className="border-l-2 border-transparent px-2 py-1 text-muted-foreground">개요</p><p className="border-l-2 border-primary px-2 py-1 font-medium">컴포넌트</p><p className="border-l-2 border-transparent px-2 py-1 text-muted-foreground">예시</p></Chrome>
}

function BackButtonVisual() {
  return <button className="inline-flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm"><ChevronLeft aria-hidden="true" />이전</button>
}

function NavigationBarVisual() {
  return <Chrome className="flex h-12 w-64 items-center justify-between px-3 text-xs"><LogoVisual /><span className="flex gap-3"><b>홈</b><span>문서</span><span>설정</span></span></Chrome>
}

function ButtonGroupVisual() {
  return <div className="flex gap-2"><ButtonVisual label="취소" emphasis="secondary" /><ButtonVisual label="저장" emphasis="primary" /></div>
}

function ActionIconButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return <button className="inline-flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm shadow-sm">{icon}{label}</button>
}

function TopAppBar() {
  return <Chrome className="flex h-12 w-60 items-center justify-between px-3"><ChevronLeft aria-hidden="true" /><span className="text-sm font-semibold">화면 제목</span><span className="flex gap-2"><Search aria-hidden="true" /><MoreHorizontal aria-hidden="true" /></span></Chrome>
}

function SectionVisual() {
  return <div className="w-52 space-y-3"><div><p className="text-sm font-semibold">섹션 제목</p><Line className="mt-1 w-32" /></div><Chrome className="h-14" /></div>
}

function ContainerVisual() {
  return <div className="w-60 rounded-md border border-dashed p-3"><Chrome className="mx-auto h-20 w-40" /></div>
}

function HeroVisual() {
  return <Chrome className="grid w-60 grid-cols-[1fr_72px] gap-3 p-3"><div><p className="text-lg font-semibold">Hero title</p><Line className="mt-2 w-24" /><button className="mt-3 rounded bg-primary px-2 py-1 text-xs text-primary-foreground">시작</button></div><div className="rounded bg-muted" /></Chrome>
}

function FilterBarVisual() {
  return <Chrome className="flex w-64 items-center gap-2 p-2"><div className="min-w-0 flex-1"><SearchField /></div><span className="rounded-full border px-2 py-1 text-xs">상태</span><span className="rounded-full border px-2 py-1 text-xs">정렬</span></Chrome>
}

function SortControl() {
  return <Chrome className="flex h-10 w-40 items-center justify-between px-3 text-sm"><span>최신순</span><ChevronDown aria-hidden="true" /></Chrome>
}

function DataGridVisual() {
  return <div className="grid w-52 grid-cols-4 overflow-hidden rounded-md border bg-card text-xs">{Array.from({ length: 16 }).map((_, cell) => <div key={cell} className={cn("h-7 border-b border-r p-1", cell === 9 && "bg-primary text-primary-foreground")}><Line className="w-full" /></div>)}</div>
}

function LegendVisual() {
  return <Chrome className="w-44 space-y-2 p-3 text-xs"><LegendRow color="bg-primary" text="매출" /><LegendRow color="bg-destructive" text="비용" /><LegendRow color="bg-muted-foreground" text="이익" /></Chrome>
}

function LegendRow({ color, text }: { color: string; text: string }) {
  return <p className="flex items-center gap-2"><span className={cn("size-3 rounded-sm", color)} />{text}</p>
}

function ChartAxisVisual() {
  return <div className="relative h-28 w-44 border-b border-l bg-card p-2"><div className="absolute bottom-2 left-4 right-2 flex items-end gap-2">{[24, 48, 36, 64].map((height) => <span key={height} className="w-5 rounded-t bg-primary" style={{ height }} />)}</div><span className="absolute bottom-0 right-0 text-[10px] text-muted-foreground">x</span><span className="absolute left-1 top-0 text-[10px] text-muted-foreground">y</span></div>
}

function StateVisual({ tone }: { tone: "error" | "success" | "warning" | "info" }) {
  const config = {
    error: { icon: <AlertTriangle aria-hidden="true" />, title: "문제가 발생했습니다" },
    success: { icon: <CheckCircle2 aria-hidden="true" />, title: "완료되었습니다" },
    warning: { icon: <AlertTriangle aria-hidden="true" />, title: "확인이 필요합니다" },
    info: { icon: <Info aria-hidden="true" />, title: "안내" },
  }[tone]
  return <Chrome className="flex w-52 items-start gap-2 p-3 text-sm"><span className={cn(tone === "success" && "text-primary", tone === "error" && "text-destructive")}>{config.icon}</span><div><p className="font-medium">{config.title}</p><Line className="mt-2 w-28" /></div></Chrome>
}

function LoadingStateVisual() {
  return <Chrome className="w-48 p-3"><div className="flex items-center gap-2 text-sm"><LoaderCircle className="animate-spin text-primary" aria-hidden="true" />불러오는 중</div><SkeletonVisual /></Chrome>
}

function FallbackVisual({ label }: { label: string }) {
  return <div className="flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm"><Settings aria-hidden="true" /><span>{label}</span></div>
}
