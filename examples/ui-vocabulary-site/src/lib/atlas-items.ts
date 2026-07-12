import {
  Command,
  FileCode2,
  Magnet,
  MousePointerClick,
  Palette,
  PanelsTopLeft,
  ScrollText,
  ShoppingBag,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  WandSparkles,
  type LucideIcon,
} from "lucide-react"

export const atlasItems = [
  { id: "agent", title: "Agent-Ready Design System", copy: "Talk to an agent docked to your canvas: humanize, fix, and animate the UI in place, then hand the build off to Codex or Claude.", layout: "md:col-span-2 xl:col-span-4" },
  { id: "pointer", title: "Cursor-Reactive Field", copy: "Surfaces that respond to cursor movement with spatial feedback and temporary visual traces.", layout: "md:col-span-2 xl:col-span-2" },
  { id: "physics", title: "Physics-Based Interaction", copy: "UI primitives fall, collide, and settle in a real rigid-body field.", layout: "md:col-span-1 xl:col-span-2" },
  { id: "scroll", title: "Product Surface Coverflow", copy: "Distinct product surfaces glide past in a self-playing 3D coverflow.", layout: "md:col-span-1 xl:col-span-2" },
  { id: "motion", title: "Motion Choreography", copy: "Sequencing multiple motion cues into one coherent, readable rhythm.", layout: "md:col-span-1 xl:col-span-2" },
  { id: "color", title: "Color Palette Generator", copy: "Generate, lock, inspect, and export five-color palettes from one compact design surface.", layout: "md:col-span-2 xl:col-span-6" },
  { id: "shader", title: "Shader Gradient System", copy: "Tokenized color palettes rendered as a continuously animated gradient shader.", layout: "md:col-span-1 xl:col-span-3" },
  { id: "filters", title: "Image Treatment", copy: "Predefined color and grain recipes applied consistently across a set of photos.", layout: "md:col-span-1 xl:col-span-3" },
  { id: "landing", title: "Hero Composition", copy: "First-viewport structure balancing headline, proof surface, calls to action, media, and visual rhythm.", layout: "md:col-span-1 xl:col-span-3" },
  { id: "command", title: "Command Center Interface", copy: "Keyboard-first product control with search, review queues, agent actions, and system status in one place.", layout: "md:col-span-1 xl:col-span-3" },
  { id: "commerce", title: "Commerce Flow", copy: "Product discovery, purchase confidence, cart states, pricing, and checkout signals arranged as one buying path.", layout: "md:col-span-1 xl:col-span-3" },
  { id: "mobile", title: "Mobile App Patterns", copy: "Compact app states for account, billing, alerts, navigation, density, and thumb-friendly actions.", layout: "md:col-span-1 xl:col-span-3" },
] as const

export type AtlasItemId = (typeof atlasItems)[number]["id"]

/** Atlas cards gated from production until they pass the site-blueprint.md completion criteria. Empty since CF2: all twelve cards ship real interactive demos. */
export const placeholderAtlasItemIds: readonly AtlasItemId[] = []

export const atlasIconMap = {
  pointer: MousePointerClick,
  physics: Magnet,
  scroll: ScrollText,
  motion: Sparkles,
  shader: WandSparkles,
  filters: SlidersHorizontal,
  color: Palette,
  landing: PanelsTopLeft,
  command: Command,
  commerce: ShoppingBag,
  mobile: Smartphone,
  agent: FileCode2,
} satisfies Record<AtlasItemId, LucideIcon>
