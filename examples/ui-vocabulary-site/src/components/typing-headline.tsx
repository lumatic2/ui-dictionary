import { useEffect, useState } from "react"

// Harvested from upstage-sixsense hero typing counter (sixsense.askewly.com),
// 2026-08-04 (docs/design-system/harvest-contract.md §4).

type TypingHeadlineProps = {
  /** Text before the typed slot. */
  prefix?: string
  /** Values typed into the slot, cycling. */
  values: string[]
  /** Text after the typed slot. */
  suffix?: string
  typeMs?: number
  holdMs?: number
  /** Slot width in ch — sized to the longest value to prevent layout shift. */
  widthCh?: number
}

/**
 * Typing headline: one slot inside a headline types its value character by
 * character with a caret, holds, then retypes the next value. The slot has a
 * fixed `ch` width and right alignment so short values never shift the words
 * around them — the sentence stays still while only the number changes.
 * Screen readers get the full sentence via a live mirror; reduced-motion
 * shows values with no typing.
 */
export function TypingHeadline({ prefix, values, suffix, typeMs = 90, holdMs = 1600, widthCh }: TypingHeadlineProps) {
  const [valueIndex, setValueIndex] = useState(0)
  const [typedCount, setTypedCount] = useState(0)
  const [reduced, setReduced] = useState(false)
  const value = values[valueIndex % values.length] ?? ""
  const slotWidth = widthCh ?? Math.max(...values.map((v) => v.length), 1) + 0.5

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)")
    const apply = () => setReduced(query.matches)
    apply()
    query.addEventListener("change", apply)
    return () => query.removeEventListener("change", apply)
  }, [])

  useEffect(() => {
    if (values.length === 0) return
    const timers: ReturnType<typeof setTimeout>[] = []
    if (reduced) {
      setTypedCount(value.length)
      timers.push(setTimeout(() => setValueIndex((i) => (i + 1) % values.length), holdMs + 1200))
    } else {
      setTypedCount(0)
      for (let i = 1; i <= value.length; i++) timers.push(setTimeout(() => setTypedCount(i), typeMs * i))
      timers.push(setTimeout(() => setValueIndex((i) => (i + 1) % values.length), typeMs * value.length + holdMs))
    }
    return () => timers.forEach(clearTimeout)
  }, [valueIndex, reduced, values.length]) // eslint-disable-line react-hooks/exhaustive-deps

  if (values.length === 0) return null
  return (
    <h1 className="break-keep text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
      <span aria-hidden="true">
        {prefix}
        <span className="inline-block text-right tabular-nums text-primary" style={{ width: `${slotWidth}ch` }}>
          {value.slice(0, typedCount)}
          <span className="animate-pulse font-normal motion-reduce:hidden">|</span>
        </span>
        {suffix}
      </span>
      <span className="sr-only" aria-live="polite">
        {prefix}
        {value}
        {suffix}
      </span>
    </h1>
  )
}
