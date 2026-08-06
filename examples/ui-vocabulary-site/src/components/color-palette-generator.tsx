import {
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { flushSync } from "react-dom"
import { Copy, Download, FileCode2, List, Lock, MoveHorizontal, PanelsTopLeft, Pipette, Plus, Shuffle, Unlock, X } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  type GeneratorColor,
  type PaletteColor,
  buildPaletteQuality,
  createGeneratorPalette,
  generatePaletteFromSeed,
  getNextPaletteCandidate,
  getPaletteSeed,
} from "@/components/palette-generator-core"

/**
 * Color palette generator: a five-swatch production tool — generate/lock
 * cycles, drag reorder with spring-back preview, per-color shade panel, HSV
 * picker, copy-to-clipboard toast, and PNG/SVG palette export. All palette
 * math (seed library, quality scoring, candidate rotation) lives in
 * palette-generator-core; this file owns the interaction surface. Swatch
 * colors are user content by definition — the chrome around them stays on
 * semantic tokens, while overlays sitting on top of user-picked colors
 * (swatch action pills, shade rings, picker handles) intentionally use
 * fixed white/current so they stay readable on arbitrary hues.
 * Entry/exit keyframes are scoped to this component.
 */

const cpgKeyframes = `
@keyframes cpg-enter {
  0% { opacity: 0; transform: translateY(8px) scale(0.98); }
  42%, 100% { opacity: 1; transform: translateY(0) scale(1); }
}
.cpg-enter { animation: cpg-enter 520ms cubic-bezier(0.33, 1, 0.68, 1) both; }
@keyframes cpg-shades-enter {
  from { opacity: 0; transform: translateY(6px) scaleY(0.86); }
  to { opacity: 1; transform: translateY(0) scaleY(1); }
}
@keyframes cpg-shades-exit {
  from { opacity: 1; transform: translateY(0) scaleY(1); }
  to { opacity: 0; transform: translateY(4px) scaleY(0.9); }
}
.cpg-shades-panel { transform-origin: center; animation: cpg-shades-enter 180ms cubic-bezier(0.33, 1, 0.68, 1) both; }
.cpg-shades-panel-exit { animation: cpg-shades-exit 180ms cubic-bezier(0.65, 0, 0.35, 1) both; }
`

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false,
  )

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return undefined
    }
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const handleChange = () => setReduced(mediaQuery.matches)
    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  return reduced
}

type DragPreview = GeneratorColor & {
  height: number
  left: number
  offsetX: number
  offsetY: number
  top: number
  width: number
}

export function getReadableTextColor(hex: string) {
  const value = hex.replace("#", "")
  const red = parseInt(value.slice(0, 2), 16)
  const green = parseInt(value.slice(2, 4), 16)
  const blue = parseInt(value.slice(4, 6), 16)
  const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255
  return luminance > 0.62 ? "var(--foreground)" : "var(--background)"
}

function shiftHex(hex: string, amount: number) {
  const value = hex.replace("#", "")
  const channels = [value.slice(0, 2), value.slice(2, 4), value.slice(4, 6)].map((channel) => {
    const next = Math.min(255, Math.max(0, parseInt(channel, 16) + amount))
    return next.toString(16).padStart(2, "0")
  })
  return `#${channels.join("")}`.toUpperCase()
}

function clampNumber(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function hexToRgb(hex: string) {
  const value = hex.replace("#", "")
  return {
    red: parseInt(value.slice(0, 2), 16),
    green: parseInt(value.slice(2, 4), 16),
    blue: parseInt(value.slice(4, 6), 16),
  }
}

function formatRgb(hex: string) {
  const { red, green, blue } = hexToRgb(hex)
  return `${red}, ${green}, ${blue}`
}

function hexToHsl(hex: string) {
  const { red, green, blue } = hexToRgb(hex)
  const r = red / 255
  const g = green / 255
  const b = blue / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const lightness = (max + min) / 2
  let hue = 0
  let saturation = 0

  if (max !== min) {
    const delta = max - min
    saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min)
    if (max === r) hue = (g - b) / delta + (g < b ? 6 : 0)
    if (max === g) hue = (b - r) / delta + 2
    if (max === b) hue = (r - g) / delta + 4
    hue /= 6
  }

  return `${Math.round(hue * 360)}, ${Math.round(saturation * 100)}%, ${Math.round(lightness * 100)}%`
}

function rgbToHex(red: number, green: number, blue: number) {
  return `#${[red, green, blue].map((channel) => clampNumber(Math.round(channel), 0, 255).toString(16).padStart(2, "0")).join("")}`.toUpperCase()
}

function hexToHsv(hex: string) {
  const { red, green, blue } = hexToRgb(hex)
  const r = red / 255
  const g = green / 255
  const b = blue / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min
  const hue =
    delta === 0 ? 0 :
    max === r ? 60 * (((g - b) / delta) % 6) :
    max === g ? 60 * ((b - r) / delta + 2) :
    60 * ((r - g) / delta + 4)

  return {
    h: (hue + 360) % 360,
    s: max === 0 ? 0 : (delta / max) * 100,
    v: max * 100,
  }
}

function hsvToHex(hue: number, saturation: number, value: number) {
  const h = ((hue % 360) + 360) % 360
  const s = clampNumber(saturation, 0, 100) / 100
  const v = clampNumber(value, 0, 100) / 100
  const c = v * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = v - c
  const [r, g, b] =
    h < 60 ? [c, x, 0] :
    h < 120 ? [x, c, 0] :
    h < 180 ? [0, c, x] :
    h < 240 ? [0, x, c] :
    h < 300 ? [x, 0, c] :
    [c, 0, x]

  return rgbToHex((r + m) * 255, (g + m) * 255, (b + m) * 255)
}

function buildShadeSet(color: PaletteColor) {
  return [82, 64, 46, 28, 10, 0, -10, -28, -48, -68].map((amount) => ({
    hex: shiftHex(color.hex, amount),
    name: amount === 0 ? color.name : `${color.name} ${amount < 0 ? "Shade" : "Tint"} ${Math.abs(amount)}`,
  }))
}

export function downloadPalettePng(palette: PaletteColor[]) {
  const width = palette.length * 240
  const height = 320
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext("2d")
  if (!context) return

  palette.forEach((color, index) => {
    const x = index * 240
    context.fillStyle = color.hex
    context.fillRect(x, 0, 240, height)
    context.fillStyle = getReadableTextColor(color.hex)
    context.font = "700 28px Arial, sans-serif"
    context.fillText(color.hex.replace("#", ""), x + 30, height - 70)
    context.font = "600 18px Arial, sans-serif"
    context.fillText(color.name, x + 30, height - 36)
  })

  const link = document.createElement("a")
  canvas.toBlob((blob) => {
    if (!blob) return
    const url = URL.createObjectURL(blob)
    link.href = url
    link.download = "askewly-palette.png"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, "image/png")
}

export function buildPaletteSvg(palette: PaletteColor[]) {
  const width = palette.length * 160
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} 220">${palette.map((color, index) => `<rect x="${index * 160}" y="0" width="160" height="220" fill="${color.hex}"/><text x="${index * 160 + 22}" y="178" font-family="Arial, sans-serif" font-size="18" font-weight="700" fill="${getReadableTextColor(color.hex)}">${color.hex.replace("#", "")}</text><text x="${index * 160 + 22}" y="202" font-family="Arial, sans-serif" font-size="13" font-weight="600" fill="${getReadableTextColor(color.hex)}">${color.name}</text>`).join("")}</svg>`
}

export function ColorPaletteGeneratorDemo() {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [paletteIndex, setPaletteIndex] = useState(0)
  const [palette, setPalette] = useState<GeneratorColor[]>(() => createGeneratorPalette(0))
  const [paletteSeed, setPaletteSeed] = useState(() => getPaletteSeed(0))
  const [exportOpen, setExportOpen] = useState(false)
  const [pickerOpenIndex, setPickerOpenIndex] = useState<number | null>(null)
  const [shadeState, setShadeState] = useState<{ index: number; base: PaletteColor } | null>(null)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragTargetIndex, setDragTargetIndex] = useState<number | null>(null)
  const [dragPreview, setDragPreview] = useState<DragPreview | null>(null)
  const [removingIndex, setRemovingIndex] = useState<number | null>(null)
  const [copyToast, setCopyToast] = useState<string | null>(null)
  const [infoColorId, setInfoColorId] = useState(() => createGeneratorPalette(0)[0].id)
  const [paletteEntryAnimation, setPaletteEntryAnimation] = useState(false)
  const [shadePanelClosing, setShadePanelClosing] = useState(false)
  const paletteBoardRef = useRef<HTMLDivElement | null>(null)
  const paletteRootRef = useRef<HTMLDivElement | null>(null)
  const addedColorIdRef = useRef(0)
  const shadeCloseTimerRef = useRef<number | null>(null)
  const dragStateRef = useRef<{ sourceIndex: number; targetIndex: number; width: number; boardLeft: number } | null>(null)
  const isDraggingPalette = draggedIndex !== null
  const pickerColor = pickerOpenIndex === null ? null : palette[pickerOpenIndex]
  const infoColor = palette.find((color) => color.id === infoColorId) ?? palette[0]
  const pickerHsv = pickerColor ? hexToHsv(pickerColor.hex) : null
  const pickerHueHex = pickerHsv ? hsvToHex(pickerHsv.h, 100, 100) : hsvToHex(0, 100, 100)
  const shadeSet = shadeState ? buildShadeSet(shadeState.base) : []
  const paletteQuality = useMemo(() => buildPaletteQuality(palette), [palette])

  const closeShadePanel = useCallback((animated = true) => {
    if (!shadeState) {
      setShadePanelClosing(false)
      return
    }
    if (shadeCloseTimerRef.current !== null) {
      window.clearTimeout(shadeCloseTimerRef.current)
      shadeCloseTimerRef.current = null
    }
    if (!animated || prefersReducedMotion) {
      setShadePanelClosing(false)
      setShadeState(null)
      return
    }
    setShadePanelClosing(true)
    shadeCloseTimerRef.current = window.setTimeout(() => {
      setShadeState(null)
      setShadePanelClosing(false)
      shadeCloseTimerRef.current = null
    }, 180)
  }, [prefersReducedMotion, shadeState])

  const openShadePanel = (index: number, color: GeneratorColor) => {
    if (shadeCloseTimerRef.current !== null) {
      window.clearTimeout(shadeCloseTimerRef.current)
      shadeCloseTimerRef.current = null
    }
    setShadePanelClosing(false)
    setShadeState({ index, base: { hex: color.hex, name: color.name } })
  }

  const blurPaletteAction = (event: ReactMouseEvent<HTMLElement>) => {
    event.currentTarget.blur()
  }

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement
      if (target.closest("[data-palette-popover]") || target.closest("[data-palette-trigger]") || target.closest("[data-palette-column-shades]")) return
      setPickerOpenIndex(null)
      closeShadePanel()
      setExportOpen(false)
    }
    window.addEventListener("pointerdown", onPointerDown)
    return () => window.removeEventListener("pointerdown", onPointerDown)
  }, [closeShadePanel])

  useEffect(() => {
    if (!copyToast) return
    const timer = window.setTimeout(() => setCopyToast(null), 2600)
    return () => window.clearTimeout(timer)
  }, [copyToast])

  useEffect(() => {
    if (!paletteEntryAnimation) return
    const timer = window.setTimeout(() => setPaletteEntryAnimation(false), 560)
    return () => window.clearTimeout(timer)
  }, [paletteEntryAnimation])

  useEffect(() => {
    return () => {
      if (shadeCloseTimerRef.current !== null) {
        window.clearTimeout(shadeCloseTimerRef.current)
      }
    }
  }, [])

  const writeClipboard = async (value: string) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value)
      } else {
        const textarea = document.createElement("textarea")
        textarea.value = value
        textarea.setAttribute("readonly", "")
        textarea.style.position = "fixed"
        textarea.style.left = "-9999px"
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand("copy")
        document.body.removeChild(textarea)
      }
      setCopyToast("Color copied to clipboard")
    } catch {
      const textarea = document.createElement("textarea")
      textarea.value = value
      textarea.setAttribute("readonly", "")
      textarea.style.position = "fixed"
      textarea.style.left = "-9999px"
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
      setCopyToast("Color copied to clipboard")
    }
  }

  const pickWithEyeDropper = async (index: number) => {
    const EyeDropperCtor = (window as unknown as { EyeDropper?: new () => { open: () => Promise<{ sRGBHex: string }> } }).EyeDropper
    if (!EyeDropperCtor) {
      setCopyToast("Eyedropper unavailable")
      return
    }
    try {
      const result = await new EyeDropperCtor().open()
      replaceColor(index, result.sRGBHex.toUpperCase())
    } catch {
      // User cancelled the eyedropper.
    }
  }

  const generatePalette = () => {
    const nextIndex = paletteIndex + 1
    setPalette((current) => {
      const result = generatePaletteFromSeed({ current, seedIndex: nextIndex })
      setPaletteSeed(result.seed)
      return result.colors
    })
    setPaletteIndex(nextIndex)
    setPickerOpenIndex(null)
    closeShadePanel()
    setPaletteEntryAnimation(true)
  }

  const toggleLock = (index: number) => {
    setPalette((current) => current.map((color, colorIndex) => (colorIndex === index ? { ...color, locked: !color.locked } : color)))
    if (palette[index]) setInfoColorId(palette[index].id)
  }

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.code === "Space") {
      event.preventDefault()
      generatePalette()
    }
  }

  const removeColor = (index: number) => {
    if (palette.length <= 3) {
      return
    }
    const removingId = palette[index]?.id
    setRemovingIndex(index)
    window.setTimeout(() => {
      setPalette((current) => {
        const next = current.filter((_, colorIndex) => colorIndex !== index)
        if (removingId === infoColorId) {
          setInfoColorId(next[Math.min(index, next.length - 1)]?.id ?? next[0]?.id ?? "")
        }
        return next
      })
      setRemovingIndex(null)
    }, prefersReducedMotion ? 0 : 180)
    setPickerOpenIndex(null)
    closeShadePanel()
  }

  const applyShade = (shade: PaletteColor) => {
    if (!shadeState) return
    setPalette((current) => current.map((color, colorIndex) => (colorIndex === shadeState.index ? { ...color, ...shade } : color)))
    if (palette[shadeState.index]) setInfoColorId(palette[shadeState.index].id)
    closeShadePanel()
  }

  const replaceColor = (index: number, hex: string) => {
    setPalette((current) => current.map((color, colorIndex) => (colorIndex === index ? { ...color, hex } : color)))
  }

  const updatePickerField = (index: number, clientX: number, clientY: number, rect: DOMRect) => {
    const current = palette[index]
    if (!current) return
    const hsv = hexToHsv(current.hex)
    const saturation = clampNumber(((clientX - rect.left) / rect.width) * 100, 0, 100)
    const value = clampNumber(100 - ((clientY - rect.top) / rect.height) * 100, 0, 100)
    replaceColor(index, hsvToHex(hsv.h, saturation, value))
  }

  const updatePickerHue = (index: number, clientX: number, rect: DOMRect) => {
    const current = palette[index]
    if (!current) return
    const hsv = hexToHsv(current.hex)
    const hue = clampNumber(((clientX - rect.left) / rect.width) * 360, 0, 360)
    replaceColor(index, hsvToHex(hue, hsv.s, hsv.v))
  }

  const startPickerDrag = (event: ReactPointerEvent<HTMLElement>, index: number, mode: "field" | "hue") => {
    event.preventDefault()
    event.stopPropagation()
    const target = event.currentTarget
    const rect = target.getBoundingClientRect()
    const update = (pointerEvent: PointerEvent | ReactPointerEvent<HTMLElement>) => {
      if (mode === "field") {
        updatePickerField(index, pointerEvent.clientX, pointerEvent.clientY, rect)
      } else {
        updatePickerHue(index, pointerEvent.clientX, rect)
      }
    }
    update(event)

    const movePicker = (pointerEvent: PointerEvent) => update(pointerEvent)
    const finishPicker = () => {
      window.removeEventListener("pointermove", movePicker)
      window.removeEventListener("pointerup", finishPicker)
      window.removeEventListener("pointercancel", finishPicker)
    }
    window.addEventListener("pointermove", movePicker)
    window.addEventListener("pointerup", finishPicker, { once: true })
    window.addEventListener("pointercancel", finishPicker, { once: true })
  }

  const reorderColor = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return
    setPalette((current) => {
      const boundedToIndex = clampNumber(toIndex, 0, current.length - 1)
      const next = [...current]
      const [moved] = next.splice(fromIndex, 1)
      next.splice(boundedToIndex, 0, moved)
      return next
    })
  }

  const addColor = (side: "start" | "end") => {
    const candidate = getNextPaletteCandidate(paletteIndex + 1, palette.map((item) => item.hex))
    const color = { ...candidate, id: `added-${addedColorIdRef.current++}-${candidate.hex}`, locked: false }
    setPalette((current) => side === "start" ? [color, ...current] : [...current, color])
    setInfoColorId(color.id)
    setPaletteEntryAnimation(true)
  }

  const startPaletteDrag = (event: ReactPointerEvent<HTMLSpanElement>, index: number) => {
    event.preventDefault()
    event.stopPropagation()
    if (palette[index]?.locked) return
    const board = paletteBoardRef.current
    if (!board) return
    const rect = board.getBoundingClientRect()
    const cardRect = board.parentElement?.getBoundingClientRect()
    const columnWidth = rect.width / palette.length
    const color = palette[index]
    const colorElement = event.currentTarget.closest("[data-palette-color]") as HTMLElement | null
    const colorRect = colorElement?.getBoundingClientRect()
    if (!color || !colorRect || !cardRect) return
    setDraggedIndex(index)
    setDragTargetIndex(index)
    setDragPreview({
      ...color,
      height: colorRect.height,
      left: colorRect.left - cardRect.left,
      offsetX: event.clientX - colorRect.left,
      offsetY: event.clientY - colorRect.top,
      top: colorRect.top - cardRect.top,
      width: colorRect.width,
    })
    setPickerOpenIndex(null)
    closeShadePanel(false)
    dragStateRef.current = { sourceIndex: index, targetIndex: index, width: columnWidth, boardLeft: rect.left }

    const moveDrag = (pointerEvent: PointerEvent) => {
      const state = dragStateRef.current
      if (!state) return
      setDragPreview((current) => current ? {
        ...current,
        left: pointerEvent.clientX - cardRect.left - current.offsetX,
      } : current)
      const targetIndex = clampNumber(Math.floor((pointerEvent.clientX - state.boardLeft) / state.width), 0, palette.length - 1)
      if (targetIndex !== state.targetIndex) {
        dragStateRef.current = { ...state, targetIndex }
        flushSync(() => setDragTargetIndex(targetIndex))
      }
    }
    const finishDrag = () => {
      const state = dragStateRef.current
      if (state) {
        flushSync(() => reorderColor(state.sourceIndex, state.targetIndex))
      }
      setDraggedIndex(null)
      setDragTargetIndex(null)
      setDragPreview(null)
      dragStateRef.current = null
      window.removeEventListener("pointermove", moveDrag)
      window.removeEventListener("pointerup", finishDrag)
      window.removeEventListener("pointercancel", cancelDrag)
    }
    const cancelDrag = () => {
      setDraggedIndex(null)
      setDragTargetIndex(null)
      setDragPreview(null)
      dragStateRef.current = null
      window.removeEventListener("pointermove", moveDrag)
      window.removeEventListener("pointerup", finishDrag)
      window.removeEventListener("pointercancel", cancelDrag)
    }
    window.addEventListener("pointermove", moveDrag)
    window.addEventListener("pointerup", finishDrag, { once: true })
    window.addEventListener("pointercancel", cancelDrag, { once: true })
  }

  const exportPalette = (format: "image" | "code" | "svg") => {
    const hexes = palette.map((color) => color.hex)
    const svg = buildPaletteSvg(palette)
    if (format === "image") {
      downloadPalettePng(palette)
    }
    if (format === "svg") {
      void writeClipboard(svg)
    }
    if (format === "code") {
      void writeClipboard(`const palette = ${JSON.stringify(hexes, null, 2)}\n`)
    }
    setExportOpen(false)
  }

  // Overlay on the user-picked swatch color — fixed white/current on purpose.
  const actionClass = "grid size-5 place-items-center rounded-full border border-current/25 bg-white/18 text-current backdrop-blur-sm transition hover:scale-105 hover:bg-white/34 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
  // Hue-axis spectrum, generated instead of authored — these are the picker's
  // physical hue stops, not themable design colors.
  const hueBackground = `linear-gradient(90deg,${[[7, 100], [58, 100], [133, 100], [191, 100], [235, 89], [284, 100], [330, 100], [7, 100]]
    .map(([h, s]) => hsvToHex(h, s, 100))
    .join(",")})`
  const pickerGradient = pickerColor
    ? `linear-gradient(180deg, color-mix(in srgb, white 0%, transparent), black), linear-gradient(90deg, white, ${pickerHueHex})`
    : undefined

  return (
    <div ref={paletteRootRef} className="relative min-h-[18.6rem]" onKeyDown={handleKeyDown}>
      <style>{cpgKeyframes}</style>
      <div className="absolute right-0 top-[-3.35rem] z-30 flex items-center gap-2" data-palette-header-actions="true">
        <button
          className="inline-flex h-8 items-center gap-2 rounded-md border border-border bg-card px-3 text-xs font-semibold text-muted-foreground shadow-sm transition hover:border-muted-foreground/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          type="button"
          onClick={generatePalette}
        >
          <Shuffle aria-hidden="true" className="size-3.5" />
          Generate
        </button>
        <button
          className={cn(
            "inline-flex size-8 items-center justify-center rounded-md border text-muted-foreground transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            exportOpen ? "border-foreground bg-foreground text-background" : "border-border bg-card hover:border-muted-foreground/40 hover:text-foreground",
          )}
          type="button"
          aria-label="Export palette"
          onClick={() => {
            setExportOpen(true)
            setPickerOpenIndex(null)
            closeShadePanel()
          }}
        >
          <Download aria-hidden="true" className="size-3.5" />
        </button>
      </div>

      <div
        className="group/palette relative overflow-visible rounded-md border border-border bg-card shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        tabIndex={0}
        aria-label="Interactive color palette generator"
      >
        <div ref={paletteBoardRef} className="swatch-preserve relative flex h-[21.5rem] overflow-visible" data-palette-board="true">
          <span className="group/add-start absolute inset-y-0 left-2 z-30 flex w-10 items-center justify-start" data-palette-add-start="true">
            <button
              className="grid size-9 place-items-center rounded-full border border-border bg-card text-card-foreground opacity-0 shadow-md transition hover:scale-105 hover:bg-muted focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring group-hover/add-start:opacity-100"
              type="button"
              aria-label="Add color to start"
              onClick={() => addColor("start")}
            >
              <Plus aria-hidden="true" className="size-5" />
            </button>
          </span>
          <span className="group/add-end absolute inset-y-0 right-2 z-30 flex w-10 items-center justify-end" data-palette-add-end="true">
            <button
              className="grid size-9 place-items-center rounded-full border border-border bg-card text-card-foreground opacity-0 shadow-md transition hover:scale-105 hover:bg-muted focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring group-hover/add-end:opacity-100"
              type="button"
              aria-label="Add color to end"
              onClick={() => addColor("end")}
            >
              <Plus aria-hidden="true" className="size-5" />
            </button>
          </span>
          {palette.map((color, index) => {
            const textColor = getReadableTextColor(color.hex)
            const isShadeColumn = shadeState?.index === index
            const selectedShadeHex = color.hex.toUpperCase()
            const dragShift =
              draggedIndex === null || dragTargetIndex === null ? undefined :
              draggedIndex < dragTargetIndex && index > draggedIndex && index <= dragTargetIndex ? "translateX(-100%)" :
              draggedIndex > dragTargetIndex && index >= dragTargetIndex && index < draggedIndex ? "translateX(100%)" :
              undefined
            return (
              <div
                key={color.id}
                data-palette-color="true"
                className={cn(
                  "group/swatch relative flex min-w-0 flex-1 cursor-pointer flex-col justify-between overflow-visible p-3 text-left transition-all duration-200 focus-within:z-20",
                  !prefersReducedMotion && paletteEntryAnimation && "cpg-enter",
                  removingIndex === index && "scale-x-0 opacity-0",
                  draggedIndex === index && "opacity-0",
                )}
                style={{ backgroundColor: color.hex, color: textColor, flex: removingIndex === index ? "0 0 0%" : "1 1 0%", transform: dragShift }}
                role="button"
                tabIndex={0}
                onPointerDown={(event) => {
                  if ((event.target as HTMLElement).closest("button,[data-palette-popover],[data-palette-trigger]")) return
                  setPickerOpenIndex(null)
                  closeShadePanel()
                  setInfoColorId(color.id)
                }}
                onPointerEnter={() => setInfoColorId(color.id)}
                onClick={() => {
                  setPickerOpenIndex(null)
                  closeShadePanel()
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault()
                    setPickerOpenIndex(null)
                    closeShadePanel()
                  }
                }}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] opacity-80">0{index + 1}</span>
                  {color.locked && <Lock aria-hidden="true" className="size-3.5" />}
                </span>
                <span className={cn("min-w-0", isShadeColumn && "opacity-0")}>
                  <button
                    className="block max-w-full truncate rounded px-0.5 text-left font-mono text-[11px] font-semibold uppercase tracking-normal transition hover:bg-white/22 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
                    type="button"
                    data-palette-trigger="true"
                    onClick={(event) => {
                      event.stopPropagation()
                      setInfoColorId(color.id)
                      setPickerOpenIndex((current) => (current === index ? null : index))
                      closeShadePanel()
                    }}
                  >
                    {color.hex.replace("#", "")}
                  </button>
                  <span className="mt-1 block truncate text-xs font-semibold">{color.name}</span>
                </span>
                {isShadeColumn && (
                  <div className={cn("cpg-shades-panel absolute inset-0 z-10 grid grid-rows-10 overflow-hidden", shadePanelClosing && "cpg-shades-panel-exit")} data-palette-column-shades="true">
                    {shadeSet.map((shade) => {
                      const isSelectedShade = shade.hex.toUpperCase() === selectedShadeHex
                      const shadeTextColor = getReadableTextColor(shade.hex)
                      return (
                      <button
                        key={shade.hex}
                        className="group/shade relative transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
                        type="button"
                        aria-label={`Apply shade ${shade.hex}`}
                        style={{ backgroundColor: shade.hex }}
                        onClick={(event) => {
                          event.stopPropagation()
                          applyShade(shade)
                        }}
                      >
                        {isSelectedShade && (
                          <span
                            className="absolute left-1/2 top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-white/80 shadow"
                            style={{ backgroundColor: shadeTextColor }}
                            data-palette-shade-dot="true"
                            aria-hidden="true"
                          />
                        )}
                        <span
                          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full px-2 py-1 font-mono text-[11px] font-semibold uppercase tracking-normal opacity-0 shadow-sm transition group-hover/shade:opacity-100 group-focus-visible/shade:opacity-100"
                          style={{ backgroundColor: `${shadeTextColor}D9`, color: getReadableTextColor(shadeTextColor) }}
                          data-palette-shade-code="true"
                          aria-hidden="true"
                        >
                          {shade.hex.replace("#", "")}
                        </span>
                        <span className="sr-only">{shade.hex}</span>
                      </button>
                      )
                    })}
                  </div>
                )}
                <span
                  className={cn(
                    "absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col gap-1 opacity-0 transition",
                    isDraggingPalette || isShadeColumn ? "pointer-events-none" : "group-hover/swatch:opacity-100",
                  )}
                  data-palette-actions="true"
                >
                  <button className={cn(actionClass, "group/action relative")} type="button" aria-label={`Remove ${color.hex}`} onClick={(event) => { event.stopPropagation(); blurPaletteAction(event); setInfoColorId(color.id); removeColor(index) }}>
                    <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-foreground px-2 py-1 text-xs font-semibold text-background shadow-lg group-hover/action:block">Remove color</span>
                    <X aria-hidden="true" className="size-3" />
                  </button>
                  <button className={cn(actionClass, "group/action relative")} type="button" data-palette-trigger="true" aria-label={`Show shades for ${color.hex}`} onClick={(event) => { event.stopPropagation(); blurPaletteAction(event); setInfoColorId(color.id); if (shadeState?.index === index && !shadePanelClosing) { closeShadePanel() } else { openShadePanel(index, color) } setPickerOpenIndex(null) }}>
                    <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-foreground px-2 py-1 text-xs font-semibold text-background shadow-lg group-hover/action:block">View shades</span>
                    <List aria-hidden="true" className="size-3" />
                  </button>
                  <span className={cn(actionClass, "group/action relative", color.locked ? "cursor-not-allowed opacity-45" : "cursor-grab touch-none active:cursor-grabbing")} aria-label={`Drag ${color.hex}`} role="img" onPointerDown={(event) => startPaletteDrag(event, index)}>
                    <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-foreground px-2 py-1 text-xs font-semibold text-background shadow-lg group-hover/action:block">Drag color</span>
                    <MoveHorizontal aria-hidden="true" className="size-3" />
                  </span>
                  <button className={cn(actionClass, "group/action relative")} type="button" aria-label={`Copy ${color.hex}`} onClick={(event) => { event.stopPropagation(); blurPaletteAction(event); setInfoColorId(color.id); void writeClipboard(color.hex) }}>
                    <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-foreground px-2 py-1 text-xs font-semibold text-background shadow-lg group-hover/action:block">Copy HEX</span>
                    <Copy aria-hidden="true" className="size-3" />
                  </button>
                  <button className={cn(actionClass, "group/action relative")} type="button" aria-label={color.locked ? `Unlock ${color.hex}` : `Lock ${color.hex}`} onClick={(event) => { event.stopPropagation(); blurPaletteAction(event); setInfoColorId(color.id); toggleLock(index) }}>
                    <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-foreground px-2 py-1 text-xs font-semibold text-background shadow-lg group-hover/action:block">{color.locked ? "Unlock color" : "Lock color"}</span>
                    {color.locked ? <Lock aria-hidden="true" className="size-3" /> : <Unlock aria-hidden="true" className="size-3" />}
                  </button>
                </span>
                {pickerOpenIndex === index && pickerColor && (
                  <div className={cn("absolute bottom-14 z-40 w-[16rem] rounded-2xl border border-border bg-popover p-3 text-popover-foreground shadow-2xl sm:w-[18rem]", index === 0 ? "left-0" : index >= palette.length - 2 ? "right-0" : "left-1/2 -translate-x-1/2")} data-palette-popover="true" onClick={(event) => event.stopPropagation()}>
                    <div
                      className="relative h-28 cursor-crosshair overflow-hidden rounded-lg border border-border"
                      style={{ background: pickerGradient }}
                      role="button"
                      tabIndex={0}
                      aria-label="Adjust saturation and brightness"
                      onPointerDown={(event) => startPickerDrag(event, index, "field")}
                    >
                      <span
                        className="pointer-events-none absolute size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-white shadow"
                        style={{ left: `${pickerHsv?.s ?? 0}%`, top: `${100 - (pickerHsv?.v ?? 100)}%` }}
                      />
                    </div>
                    <div
                      className="relative mt-3 h-3 cursor-ew-resize rounded-full"
                      style={{ background: hueBackground }}
                      role="button"
                      tabIndex={0}
                      aria-label="Adjust hue"
                      onPointerDown={(event) => startPickerDrag(event, index, "hue")}
                    >
                      <span
                        className="pointer-events-none absolute top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white shadow"
                        style={{ backgroundColor: pickerColor.hex, left: `${((pickerHsv?.h ?? 0) / 360) * 100}%` }}
                      />
                    </div>
                    <div className="mt-4 flex items-center gap-2 rounded-lg border border-ring px-2 py-1.5">
                      <button className="min-w-0 flex-1 text-left font-mono text-base font-semibold" type="button" onClick={() => void writeClipboard(pickerColor.hex)}>
                        {pickerColor.hex}
                      </button>
                      <input
                        className="size-8 shrink-0 rounded border border-input bg-transparent"
                        type="color"
                        aria-label={`Pick replacement for ${pickerColor.hex}`}
                        value={pickerColor.hex}
                        onChange={(event) => replaceColor(index, event.target.value.toUpperCase())}
                      />
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                      <span className="text-sm font-semibold text-popover-foreground">Picker</span>
                      <div className="flex gap-3">
                        <button className="text-popover-foreground" type="button" aria-label="Pick color from screen" onClick={() => void pickWithEyeDropper(index)}>
                          <Pipette aria-hidden="true" className="size-5" />
                        </button>
                        <button className="text-popover-foreground" type="button" aria-label="Copy picked color" onClick={() => void writeClipboard(pickerColor.hex)}>
                          <Copy aria-hidden="true" className="size-5" />
                        </button>
                        <button className="text-popover-foreground" type="button" aria-label="Close picker" onClick={() => setPickerOpenIndex(null)}>
                          <X aria-hidden="true" className="size-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {dragPreview && (
          <div
            data-palette-drag-preview="true"
            className="pointer-events-none absolute z-[70] flex flex-col justify-between rounded-sm p-3 text-left shadow-2xl"
            style={{
              backgroundColor: dragPreview.hex,
              color: getReadableTextColor(dragPreview.hex),
              height: dragPreview.height,
              left: dragPreview.left,
              top: dragPreview.top,
              width: dragPreview.width,
            }}
          >
            <span className="flex items-center justify-between gap-2">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] opacity-80">DRAG</span>
              {dragPreview.locked && <Lock aria-hidden="true" className="size-3.5" />}
            </span>
            <span className="min-w-0">
              <span className="block max-w-full truncate font-mono text-[11px] font-semibold uppercase tracking-normal">{dragPreview.hex.replace("#", "")}</span>
              <span className="mt-1 block truncate text-xs font-semibold">{dragPreview.name}</span>
            </span>
          </div>
        )}

        {copyToast && (
          <div className="absolute left-1/2 top-3 z-40 -translate-x-1/2 rounded-full bg-foreground px-3 py-1.5 text-xs font-semibold text-background shadow-lg">
            {copyToast}
          </div>
        )}

        <div className="border-t border-border bg-card p-3" data-palette-bottom-rail="true" data-palette-popover="true">
          <div className="grid min-h-[4.5rem] gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(13rem,16rem)] sm:items-center">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-card-foreground">{infoColor?.name ?? "Palette color"}</p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-normal text-muted-foreground">
                {infoColor ? `${infoColor.hex} / RGB ${formatRgb(infoColor.hex)} / HSL ${hexToHsl(infoColor.hex)}` : "Select a color"}
              </p>
              <p className="mt-2 text-[11px] leading-4 text-muted-foreground">
                Generated from {paletteSeed.name}: {paletteSeed.note}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-semibold uppercase tracking-normal text-muted-foreground">
              <span className="rounded border border-border bg-muted px-2 py-1.5">{paletteQuality.duplicateCount === 0 ? "Unique" : `${paletteQuality.duplicateCount} dupes`}</span>
              <span className="rounded border border-border bg-muted px-2 py-1.5">{paletteQuality.lowContrastCount === 0 ? "Readable" : "Check text"}</span>
              <span className="rounded border border-border bg-muted px-2 py-1.5">{paletteQuality.exportStable ? "Export OK" : "Fix hex"}</span>
            </div>
          </div>
        </div>

        {exportOpen && (
          <div className="absolute inset-0 z-50 grid place-items-center bg-scrim/72 p-4" data-palette-popover="true">
            <div className="w-full max-w-md rounded-2xl bg-card text-card-foreground shadow-2xl">
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <p className="text-lg font-semibold">Export Palette</p>
                <button className="rounded p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground" type="button" aria-label="Close export palette" onClick={() => setExportOpen(false)}>
                  <X aria-hidden="true" className="size-5" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-3 p-5">
                {[
                  ["image", "Image", Download],
                  ["code", "Code", FileCode2],
                  ["svg", "SVG", PanelsTopLeft],
                ].map(([format, label, Icon]) => (
                  <button
                    key={String(format)}
                    className="grid aspect-square place-items-center rounded-xl bg-muted p-3 text-center transition hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    type="button"
                    aria-label={`Export palette as ${String(label)}`}
                    onClick={() => exportPalette(format as "image" | "code" | "svg")}
                  >
                    <Icon aria-hidden="true" className="size-7" />
                    <span className="text-sm font-semibold">{String(label)}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Brand primitives for the shader uniform (normalized to hex at mount);
// the dark base is read from the container's own background so the
// composition stays identical without a color literal.
