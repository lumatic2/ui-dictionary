// watercolor-pointer-field — 포인터를 따라 물감이 번지는 화면 전역 효과.
//
// ⚠ 이 파일의 최초 판정("사전 밖 개념")은 틀렸다 — VL8 관측에서 적발됐다.
// 사전 `장식·배경 효과` 그룹에 `aurora-background`·`canvas-reveal-card`·`spotlight-card` 가 있었고,
// 후보로 제시했어야 한다. 원인은 N-1 조회가 규정된 category 축 절차 대신 키워드 grep 으로 돌아간 것.
// 경위·후속: `evidence/vocabulary-in-use/vl8-observation.md` §6.
//
// 아래 티어 판정은 그 오류와 무관하게 유지된다 — `aurora-background` 도 커서를 따라오지는 않으므로
// "커서 추종"이 얹히면 결론은 같다. 판정은 `knowledge/expressive-stack.md` 티어 표로 했다:
//
//   "수백 개 파티클·커서 트레일" → ③ Canvas 2D + rAF
//
// 왜 하위 티어가 아닌가 (판정 절차 2 — 티어 상승 근거를 남긴다):
//   ① CSS  — `:hover` 는 커서 좌표를 모르고, 지나온 궤적을 누적할 방법이 없다.
//   ② DOM  — 번짐은 수백 개의 겹친 반투명 층이다. 노드마다 layout/paint 를 내면 비용이 폭발한다.
// 왜 ④ 가 아닌가 (판정 절차 1 — 하위 티어 우선):
//   진짜 유체(Navier-Stokes)는 ④ 지만, 수채화의 "번지고 스며든다"는 인상은
//   누적 버퍼 + 부드러운 radial gradient + 곱하기 합성으로 ③ 에서 난다. GPU 를 부를 근거가 없다.
//
// 절차 3 (③ 티어 의무): reduced-motion 이면 렌더 루프를 아예 돌리지 않는다.
// 절차 5 (시그니처): 실험적 표현이므로 기본 제품 UI 의 기본값이 아니다 — 명시 요청 시에만 쓴다.

import { useEffect, useRef } from "react"

type Stroke = {
  x: number
  y: number
  /** 번짐 반경. 시간이 갈수록 커지며 옅어진다 */
  r: number
  /** 남은 수명 0~1 */
  life: number
  hue: number
}

type WatercolorPointerFieldProps = {
  /** 동시에 살아 있는 얼룩 상한 — 넘으면 오래된 것부터 버린다 */
  maxStrokes?: number
  /** 포인터가 이만큼(px) 움직여야 새 얼룩을 찍는다. 작을수록 촘촘하고 무겁다 */
  spacing?: number
  className?: string
}

export function WatercolorPointerField({
  maxStrokes = 220,
  spacing = 14,
  className,
}: WatercolorPointerFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext("2d", { alpha: true })
    if (!context) return

    const parent = canvas.parentElement ?? canvas
    let width = parent.clientWidth
    let height = parent.clientHeight

    const dpr = window.devicePixelRatio || 1
    const resize = () => {
      width = parent.clientWidth
      height = parent.clientHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(1, 0, 0, 1, 0, 0)
      context.scale(dpr, dpr)
    }
    resize()

    // 색은 토큰에서 읽는다 — 그리기 루프에 색값을 박지 않는다.
    // 수채화는 한 색이 아니라 인접한 색이 섞이는 것이므로, 기준 색조에서 좌우로 벌린다.
    const styles = getComputedStyle(canvas)
    const baseHue = Number.parseFloat(styles.getPropertyValue("--watercolor-base-hue")) || 265

    const strokes: Stroke[] = []
    let lastX: number | null = null
    let lastY: number | null = null
    let drift = 0

    const addStroke = (x: number, y: number) => {
      // 색조가 조금씩 흘러 한 획 안에서도 색이 갈린다 — 단색 번짐은 수채화로 안 읽힌다.
      drift += 7
      strokes.push({
        x,
        y,
        r: 18 + Math.abs(Math.sin(drift / 40)) * 26,
        life: 1,
        hue: (baseHue + Math.sin(drift / 60) * 46 + 360) % 360,
      })
      if (strokes.length > maxStrokes) strokes.splice(0, strokes.length - maxStrokes)
    }

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      if (lastX === null || lastY === null) {
        lastX = x
        lastY = y
        addStroke(x, y)
        return
      }
      const dx = x - lastX
      const dy = y - lastY
      const dist = Math.hypot(dx, dy)
      if (dist < spacing) return
      // 프레임 사이를 건너뛴 구간에도 얼룩을 채운다 — 빠르게 움직이면 궤적이 끊긴다.
      const steps = Math.min(Math.floor(dist / spacing), 12)
      for (let i = 1; i <= steps; i += 1) {
        addStroke(lastX + (dx * i) / steps, lastY + (dy * i) / steps)
      }
      lastX = x
      lastY = y
    }

    const paint = () => {
      context.clearRect(0, 0, width, height)
      // 곱하기 합성 — 겹친 물감이 어두워지며 섞인다. 더하기(lighter)면 물감이 아니라 빛이 된다.
      context.globalCompositeOperation = "multiply"
      for (const s of strokes) {
        const radius = s.r * (1 + (1 - s.life) * 1.6)
        const gradient = context.createRadialGradient(s.x, s.y, 0, s.x, s.y, radius)
        // 가장자리로 갈수록 급히 옅어져야 종이에 스민 것처럼 보인다 — 선형 감쇠는 스티커처럼 보인다.
        gradient.addColorStop(0, `hsl(${s.hue} 85% 62% / ${0.26 * s.life})`)
        gradient.addColorStop(0.45, `hsl(${s.hue} 80% 66% / ${0.12 * s.life})`)
        gradient.addColorStop(1, `hsl(${s.hue} 75% 70% / 0)`)
        context.fillStyle = gradient
        context.beginPath()
        context.arc(s.x, s.y, radius, 0, Math.PI * 2)
        context.fill()
      }
      context.globalCompositeOperation = "source-over"
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")

    let frame = 0
    const tick = () => {
      for (const s of strokes) s.life -= 0.006
      for (let i = strokes.length - 1; i >= 0; i -= 1) {
        if (strokes[i].life <= 0) strokes.splice(i, 1)
      }
      paint()
      frame = requestAnimationFrame(tick)
    }

    const start = () => {
      if (reduced.matches) return
      window.addEventListener("pointermove", onPointerMove, { passive: true })
      frame = requestAnimationFrame(tick)
    }
    const stop = () => {
      window.removeEventListener("pointermove", onPointerMove)
      cancelAnimationFrame(frame)
      strokes.length = 0
      context.clearRect(0, 0, width, height)
    }

    // reduced-motion 은 마운트 시점만이 아니라 도중에 켜질 수도 있다.
    const onPreferenceChange = () => {
      stop()
      start()
    }
    reduced.addEventListener("change", onPreferenceChange)

    const observer = new ResizeObserver(() => {
      resize()
      paint()
    })
    observer.observe(parent)

    start()

    return () => {
      stop()
      reduced.removeEventListener("change", onPreferenceChange)
      observer.disconnect()
    }
  }, [maxStrokes, spacing])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none ${className ?? ""}`}
      style={{ ["--watercolor-base-hue" as string]: "265" }}
    />
  )
}

/** Colocated demo: 읽을 수 있는 전경 아래에서 물감이 번진다. */
export function WatercolorPointerFieldDemo() {
  return (
    <div className="relative h-72 w-full max-w-2xl overflow-hidden rounded-lg border bg-background">
      <WatercolorPointerField className="absolute inset-0 h-full w-full" />
      <div className="relative flex h-full items-center justify-center px-8 text-center">
        <div>
          <p className="text-sm font-medium text-foreground">Watercolor pointer field</p>
          <p className="mt-1 break-keep text-sm text-muted-foreground">
            포인터를 움직이면 물감이 번집니다. 겹칠수록 어두워지고 천천히 마릅니다. reduced-motion에서는 아무것도 그리지 않습니다.
          </p>
        </div>
      </div>
    </div>
  )
}
