import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { createTemplateProject, formatPackCatalog, validateTemplateProject } from '@askewly/template-core'
import { TemplateGallery } from './TemplateGallery'

afterEach(cleanup)

const seed = createTemplateProject({ blueprintId: 'business-card-minimal' })

/** 갤러리는 현재 문서를 알아야 지금 상태를 내보낼 수 있다. */
function renderGallery(onOpen: (project: unknown) => void = () => {}) {
  return render(
    <TemplateGallery onOpen={onOpen as never} project={seed} document={seed.scene} />,
  )
}

describe('템플릿 갤러리', () => {
  it('청사진 6종을 전부 카드로 내놓는다', () => {
    renderGallery()
    for (const blueprint of formatPackCatalog) {
      expect(screen.getByTestId(`template-open-${blueprint.id}`)).toBeTruthy()
    }
  })

  it('카드는 좌표가 아니라 구조로 구별을 말한다', () => {
    renderGallery()
    // 명함 두 종은 단 수가 다르다 — TH2에서 기계 검증한 구별 축이 화면에도 드러난다.
    expect(screen.getByTestId('template-open-business-card-minimal').textContent).toContain('3단')
    expect(screen.getByTestId('template-open-business-card-vertical').textContent).toContain('2단')
    // 비교형만 반복 유닛을 갖는다.
    expect(screen.getByTestId('template-open-infographic-comparison').textContent).toContain(
      '반복 유닛',
    )
  })

  it('카드를 누르면 유효한 템플릿 프로젝트가 나온다', () => {
    const onOpen = vi.fn()
    renderGallery(onOpen)

    fireEvent.click(screen.getByTestId('template-open-product-poster-editorial'))

    expect(onOpen).toHaveBeenCalledTimes(1)
    const project = onOpen.mock.calls[0][0]
    expect(project.request.format).toBe('product-poster')
    expect(validateTemplateProject(project).valid).toBe(true)
  })

  it('토큰 세트를 바꾸면 그 세트로 열린다', () => {
    const onOpen = vi.fn()
    renderGallery(onOpen)

    fireEvent.change(screen.getByTestId('template-token-set'), {
      target: { value: 'askewly.ink' },
    })
    fireEvent.click(screen.getByTestId('template-open-business-card-minimal'))

    expect(onOpen.mock.calls[0][0].request.tokenSetId).toBe('askewly.ink')
  })

  it('여는 데 실패하면 onOpen을 부르지 않고 이유를 남긴다', () => {
    const onOpen = vi.fn()
    renderGallery(onOpen)

    // 카탈로그에 없는 id를 카드가 들고 있는 상황을 재현한다(청사진 은퇴·오타 시 실제로 생긴다).
    const button = screen.getByTestId('template-open-infographic-stats')
    button.setAttribute('data-testid', 'template-open-ghost')
    const spy = vi.spyOn(formatPackCatalog, 'find').mockReturnValue(undefined)

    fireEvent.click(button)

    expect(onOpen).not.toHaveBeenCalled()
    expect(screen.getByTestId('template-gallery-error').textContent).toContain('열기 실패')
    spy.mockRestore()
  })
})
