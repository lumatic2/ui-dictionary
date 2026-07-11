import { describe, expect, it } from 'vitest'
import { createDocumentFixture } from './fixtures.js'
import { clampZoom, documentContentBounds, fitViewport, MAX_ZOOM, MIN_ZOOM, zoomAroundPoint } from './viewport.js'

describe('viewport math', () => {
  it('clamps zoom to the supported range', () => {
    expect(clampZoom(0.01)).toBe(MIN_ZOOM)
    expect(clampZoom(99)).toBe(MAX_ZOOM)
    expect(clampZoom(1.5)).toBe(1.5)
    expect(clampZoom(Number.NaN)).toBe(1)
  })

  it('zooms around an anchor so the anchored canvas point stays fixed', () => {
    const viewport = { pan: { x: -100, y: -50 }, zoom: 1 }
    const anchor = { x: 200, y: 150 }
    const next = zoomAroundPoint(viewport, 2, anchor)
    const canvasPointBefore = { x: (anchor.x - viewport.pan.x) / viewport.zoom, y: (anchor.y - viewport.pan.y) / viewport.zoom }
    expect(anchor.x).toBeCloseTo(canvasPointBefore.x * next.zoom + next.pan.x)
    expect(anchor.y).toBeCloseTo(canvasPointBefore.y * next.zoom + next.pan.y)
    expect(zoomAroundPoint(viewport, 100, anchor).zoom).toBe(MAX_ZOOM)
  })

  it('computes content bounds and fits them into a viewport with padding', () => {
    const document = createDocumentFixture(1000)
    const bounds = documentContentBounds(document)
    expect(bounds).toBeTruthy()
    expect(bounds!.x).toBe(24)
    const fitted = fitViewport({ x: 0, y: 0, width: 400, height: 200 }, { width: 960, height: 640 })
    expect(fitted.zoom).toBeCloseTo((960 - 96) / 400)
    expect(fitted.pan.x).toBeCloseTo((960 - 400 * fitted.zoom) / 2)
    expect(() => fitViewport({ x: 0, y: 0, width: 0, height: 10 }, { width: 960, height: 640 })).toThrow('positive bounds')
  })
})
