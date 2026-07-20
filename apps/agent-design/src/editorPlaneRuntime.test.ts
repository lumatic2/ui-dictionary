import { describe, expect, it } from 'vitest'
import { premultiplied, SELECTION_TINT } from './editorPlaneRuntime'

/**
 * ECT2 step-2 후속 — WebGPU 선택 틴트가 **선택한 노드의 색을 바꿔 보이게** 하던 결함.
 *
 * 캔버스가 `alphaMode: 'premultiplied'`인데 셰이더가 색을 알파와 곱하지 않고 넘겼다.
 * 합성식은 `src.rgb + dst.rgb*(1-src.a)`이므로 src가 과하게 밝아져 밑색을 오염시킨다.
 *
 * 픽셀 실측(브라우저):
 *   수정 전 — 빨강 `#DF2225` 노드를 선택하면 `#FF4AF2` 마젠타
 *   수정 후 — 같은 지점이 `#CD2444` (빨강 + 보라 틴트 18%)
 *
 * WebGPU를 유닛테스트에서 돌릴 수 없으므로, **합성에 들어가는 값**을 여기서 고정한다.
 */
describe('WebGPU 선택 틴트 프리멀티플라이 (ECT2 후속)', () => {
  it('RGB에 알파가 곱해진 채로 나간다', () => {
    expect(premultiplied([0.5, 0.4, 0.2], 0.5)).toEqual([0.25, 0.2, 0.1, 0.5])
  })

  it('알파가 1이면 원래 색 그대로다', () => {
    expect(premultiplied([0.49, 0.18, 0.83], 1)).toEqual([0.49, 0.18, 0.83, 1])
  })

  it('알파가 0이면 아무 색도 더하지 않는다', () => {
    expect(premultiplied(SELECTION_TINT, 0)).toEqual([0, 0, 0, 0])
  })

  it('프리멀티플라이드 합성으로 계산한 결과가 실측 픽셀과 같다', () => {
    // 이 계산이 결함을 잡아낸 근거다. 브라우저가 실제로 하는 연산을 그대로 적는다.
    const composite = (src: number[], dst: readonly [number, number, number]) =>
      dst.map((d, i) => Math.min(1, src[i] + d * (1 - src[3])))
    const 빨강: readonly [number, number, number] = [223 / 255, 34 / 255, 37 / 255]
    const toHex = (c: number[]) => c.map((v) => Math.round(v * 255))

    // 곱하지 않고 넘기면 — 마젠타로 오염된다(실측 #FF4AF2 = 255,74,242)
    const 곱하지_않음 = composite([...SELECTION_TINT, 0.18], 빨강)
    expect(toHex(곱하지_않음)).toEqual([255, 74, 242])

    // 곱해서 넘기면 — 빨강이 유지된다(실측 #CD2444 = 205,36,68)
    const 곱함 = composite(premultiplied(SELECTION_TINT, 0.18), 빨강)
    expect(toHex(곱함)).toEqual([205, 36, 68])
  })
})
