import { useEffect, useState } from "react"

/**
 * Cursor-reactive glyph field: a fixed grid of monospace glyph cells that
 * light up around the pointer and decay on a timer. Pointer position is
 * normalized to percent coordinates, each cell's influence falls off with
 * distance, and the glyph itself changes by influence band (o / > / _) so the
 * trail reads as texture, not a uniform stamp. A ~85ms interval decrements
 * per-cell life for the fade tail — no rAF, no canvas, plain spans.
 *
 * The field face is fixed-light showcase content (white ground, dark glyphs)
 * on any theme, matching its role as a demo surface.
 */

type CursorFieldCell = {
  id: number
  x: number
  y: number
  glyph: string
  opacity: number
  life: number
}

function buildCells(): CursorFieldCell[] {
  const cells: CursorFieldCell[] = []
  const columns = 24
  const rows = 18

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      cells.push({
        id: row * columns + column,
        x: 4.5 + column * 4,
        y: 7 + row * 4.9,
        glyph: "-",
        opacity: 0,
        life: 0,
      })
    }
  }

  return cells
}

export function CursorReactiveField() {
  const [cells, setCells] = useState<CursorFieldCell[]>(buildCells)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCells((current) => current.map((cell) => {
        const life = Math.max(0, cell.life - 1)

        return {
          ...cell,
          life,
          opacity: life > 0 ? 1 : 0,
        }
      }))
    }, 85)

    return () => window.clearInterval(timer)
  }, [])

  return (
    <div
      className="relative h-[22.5rem] overflow-hidden rounded-md border border-slate-200 bg-white text-slate-950"
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect()
        const x = ((event.clientX - rect.left) / rect.width) * 100
        const y = ((event.clientY - rect.top) / rect.height) * 100

        setCells((current) => current.map((cell) => {
          const distance = Math.hypot(cell.x - x, cell.y - y)
          const influence = Math.max(0, 1 - distance / 7)

          if (influence <= 0) {
            return cell
          }

          const cluster = Math.floor(cell.x / 18) + Math.floor(cell.y / 15) + Math.floor(x / 22) + Math.floor(y / 20)
          const glyph = influence > 0.76 ? "o" : cluster % 5 === 0 ? "_" : ">"
          const life = Math.max(cell.life, Math.round(2 + influence * 13))

          return {
            ...cell,
            glyph,
            life,
            opacity: 1,
          }
        }))
      }}
    >
      <div className="absolute inset-0 opacity-45 [background-image:linear-gradient(90deg,color-mix(in_srgb,var(--color-slate-900)_4.2%,transparent)_1px,transparent_1px),linear-gradient(color-mix(in_srgb,var(--color-slate-900)_4.2%,transparent)_1px,transparent_1px)] [background-size:34px_34px]" />
      {cells.map((cell) => (
        <span
          key={cell.id}
          className="absolute font-mono text-[13px] font-medium leading-none text-black"
          style={{
            left: `${cell.x}%`,
            top: `${cell.y}%`,
            opacity: cell.opacity,
            transform: "translate(-50%, -50%)",
          }}
        >
          {cell.glyph}
        </span>
      ))}
    </div>
  )
}
