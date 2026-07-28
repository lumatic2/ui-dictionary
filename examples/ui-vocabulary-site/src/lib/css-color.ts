/**
 * Token color normalization for surfaces that cannot read CSS directly
 * (canvas 2D, WebGL shader uniforms). Tokens are authored in oklch(), but
 * those runtimes only parse hex/rgb — normalize through a 1x1 canvas
 * (fillStyle accepts any CSS color the browser resolves, pixels read back
 * as sRGB). Extracted from shader-gradient-surface (VI8 finding).
 */
export function cssColorToHex(color: string): string | null {
  const canvas = document.createElement("canvas")
  canvas.width = canvas.height = 1
  const ctx = canvas.getContext("2d")
  if (!ctx) return null
  ctx.fillStyle = color
  ctx.fillRect(0, 0, 1, 1)
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
  return `#${[r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("")}`
}

/** Resolve token custom properties on an element to sRGB hex; unresolvable vars are dropped. */
export function readCssVarsAsHex(el: Element, vars: string[]): string[] {
  const styles = getComputedStyle(el)
  return vars
    .map((v) => styles.getPropertyValue(v).trim())
    .filter(Boolean)
    .map((c) => cssColorToHex(c))
    .filter((c): c is string => Boolean(c))
}
