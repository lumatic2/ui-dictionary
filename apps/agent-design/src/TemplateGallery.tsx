import { useState } from 'react'
import {
  createTemplateProject,
  formatPackCatalog,
  listTokenSets,
  matchPrintSpec,
  DEFAULT_TOKEN_SET_ID,
  type TemplateProject,
} from '@askewly/template-core'

/**
 * 청사진 갤러리 — 템플릿 6종 중 하나를 골라 캔버스로 연다.
 *
 * 컴파일 결과의 `scene`이 그대로 `CanvasDocument`이므로 변환 계층이 없다.
 * 열기에 실패하면 **기존 캔버스를 건드리지 않고** 이유를 남긴다 —
 * 빈 문서로 덮어쓰면 편집 중이던 작업이 사라지고도 원인이 안 보인다.
 */

interface Props {
  onOpen: (project: TemplateProject) => void
}

const FORMAT_LABELS: Record<string, string> = {
  'business-card': '명함',
  'product-poster': '제품 포스터',
  infographic: '인포그래픽',
}

/** 청사진이 무엇으로 구별되는지 — 좌표가 아니라 구조로 말한다. */
function structureSummary(blueprintId: string): string {
  const blueprint = formatPackCatalog.find((item) => item.id === blueprintId)
  // 카드가 카탈로그에 없는 id를 들고 있으면(청사진 은퇴·오타) 화면을 깨뜨리지 않고 그렇다고 말한다.
  if (!blueprint) return '구조 정보 없음'
  const repeated = (blueprint.repeatGroups ?? []).reduce(
    (total, group) => total + group.unitSlots.length,
    0,
  )
  const parts = [`${blueprint.gridColumns}단`, `슬롯 ${blueprint.slots.length + repeated}`]
  if (blueprint.repeatGroups?.length) parts.push('반복 유닛')
  const spec = matchPrintSpec(blueprint)
  if (spec) parts.push(spec.label)
  return parts.join(' · ')
}

export function TemplateGallery({ onOpen }: Props) {
  const [tokenSetId, setTokenSetId] = useState(DEFAULT_TOKEN_SET_ID)
  const [error, setError] = useState('')

  function open(blueprintId: string) {
    try {
      const project = createTemplateProject({ blueprintId, tokenSetId })
      setError('')
      onOpen(project)
    } catch (cause) {
      // 실패해도 onOpen을 부르지 않는다 — 현재 문서가 그대로 남는다.
      setError(cause instanceof Error ? cause.message : String(cause))
    }
  }

  return (
    <aside className="template-gallery" aria-label="템플릿 갤러리" data-testid="template-gallery">
      <header>
        <h2>템플릿에서 시작</h2>
        <label>
          토큰 세트
          <select
            aria-label="템플릿 토큰 세트"
            data-testid="template-token-set"
            value={tokenSetId}
            onChange={(event) => setTokenSetId(event.target.value)}
          >
            {listTokenSets().map((set) => (
              <option key={set.id} value={set.id}>
                {set.label}
              </option>
            ))}
          </select>
        </label>
      </header>

      {error && (
        <p className="template-gallery-error" role="alert" data-testid="template-gallery-error">
          열기 실패 — {error}
        </p>
      )}

      <ul>
        {formatPackCatalog.map((blueprint) => (
          <li key={blueprint.id}>
            <button
              type="button"
              data-testid={`template-open-${blueprint.id}`}
              onClick={() => open(blueprint.id)}
            >
              <span className="template-format">{FORMAT_LABELS[blueprint.format]}</span>
              <strong>{blueprint.id}</strong>
              <span className="template-structure">{structureSummary(blueprint.id)}</span>
              <span className="template-size">
                {blueprint.width} × {blueprint.height}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  )
}
