import {
  AlertTriangle,
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Circle,
  FileUp,
  Folder,
  Heart,
  Home,
  LoaderCircle,
  Menu,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Trash2,
  User,
  X,
} from "lucide-react"
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
    <div className={canvasClass}>
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
  return <FallbackVisual label={label} />
}

function Chrome({ children, className }: { children: React.ReactNode; className?: string }) {
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
  return (
    <Chrome className="flex h-10 w-48 items-center justify-between px-3 text-sm">
      <span>옵션 선택</span>
      <ChevronDown aria-hidden="true" />
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
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="flex size-5 items-center justify-center rounded border bg-primary text-primary-foreground">
        <Check aria-hidden="true" />
      </span>
      <span>여러 개 선택</span>
    </div>
  )
}

function RadioGroupVisual() {
  return (
    <div className="flex flex-col gap-2 text-sm">
      {["옵션 A", "옵션 B"].map((item, index) => (
        <span key={item} className="flex items-center gap-2">
          <span className="flex size-4 items-center justify-center rounded-full border">
            {index === 0 && <span className="size-2 rounded-full bg-primary" />}
          </span>
          {item}
        </span>
      ))}
    </div>
  )
}

function SwitchVisual() {
  return (
    <div className="flex h-7 w-12 items-center justify-end rounded-full bg-primary p-1">
      <div className="size-5 rounded-full bg-primary-foreground" />
    </div>
  )
}

function SliderVisual() {
  return (
    <div className="relative h-6 w-48">
      <div className="absolute left-0 top-3 h-1 w-full rounded bg-muted" />
      <div className="absolute left-0 top-3 h-1 w-2/3 rounded bg-primary" />
      <div className="absolute left-[62%] top-1.5 size-4 rounded-full border bg-card shadow" />
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
  return (
    <Chrome className="w-48 p-2">
      <div className="grid grid-cols-3 gap-1 rounded bg-muted p-1 text-center text-xs">
        <span className="rounded bg-card py-1 shadow-sm">탭 1</span>
        <span className="py-1 text-muted-foreground">탭 2</span>
        <span className="py-1 text-muted-foreground">탭 3</span>
      </div>
      <Line className="mt-3 w-28" />
    </Chrome>
  )
}

function SegmentedControl() {
  return (
    <div className="grid w-48 grid-cols-3 rounded-md border bg-muted p-1 text-center text-xs">
      <span className="py-1 text-muted-foreground">옵션1</span>
      <span className="rounded bg-card py-1 shadow-sm">옵션2</span>
      <span className="py-1 text-muted-foreground">옵션3</span>
    </div>
  )
}

function DropdownMenuVisual() {
  return (
    <Chrome className="w-44 overflow-hidden">
      <div className="flex h-9 items-center justify-between border-b px-3 text-sm">
        <span>정렬</span>
        <ChevronDown aria-hidden="true" />
      </div>
      <div className="flex flex-col p-1 text-xs">
        <span className="rounded bg-muted px-2 py-1">최신순</span>
        <span className="px-2 py-1">인기순</span>
      </div>
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
  return (
    <div className="relative h-28 w-52 rounded-md bg-foreground/10 p-4">
      <Chrome className="absolute left-1/2 top-1/2 w-40 -translate-x-1/2 -translate-y-1/2 p-3">
        <div className="flex items-center justify-between"><Line className="w-20" /><X aria-hidden="true" /></div>
        <Line className="mt-3 w-32" />
      </Chrome>
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
  return <Chrome className="w-48 divide-y"><AccRow open text="첫 항목" /><AccRow text="둘째 항목" /><AccRow text="셋째 항목" /></Chrome>
}

function AccRow({ text, open }: { text: string; open?: boolean }) {
  return <div className="p-2 text-xs"><div className="flex justify-between"><span>{text}</span><ChevronDown aria-hidden="true" /></div>{open && <Line className="mt-2 w-28" />}</div>
}

function CarouselVisual() {
  return <div className="flex items-center gap-2"><ChevronLeft aria-hidden="true" /><div className="flex gap-2">{[0, 1, 2].map((item) => <span key={item} className="h-16 w-12 rounded border bg-card" />)}</div><ChevronRight aria-hidden="true" /></div>
}

function TooltipVisual() {
  return <div className="relative h-20 w-36"><button className="absolute bottom-0 left-6 rounded border bg-card px-3 py-1 text-sm">도움</button><span className="absolute left-0 top-0 rounded-md border bg-popover px-2 py-1 text-xs shadow">도움말 내용</span></div>
}

function ToastVisual() {
  return <Chrome className="flex w-48 items-center justify-between px-3 py-2 text-sm"><span className="flex items-center gap-2"><Check aria-hidden="true" />저장되었습니다!</span><X aria-hidden="true" /></Chrome>
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

function FallbackVisual({ label }: { label: string }) {
  return <div className="flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm"><Settings aria-hidden="true" /><span>{label}</span></div>
}
