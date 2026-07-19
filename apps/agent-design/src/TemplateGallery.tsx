import { useState } from 'react'
import type { CanvasDocument } from '@askewly/canvas-core'
import {
  createTemplateProject,
  exportHtml,
  exportJson,
  exportSvg,
  formatPackCatalog,
  listTokenSets,
  matchPrintSpec,
  templateSignature,
  validateTemplateProject,
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
  /** 현재 열려 있는 템플릿(소재 목록 보유). 템플릿에서 시작하지 않았으면 `null`. */
  project: TemplateProject | null
  /** 캔버스의 현재 장면 — 내보내기는 열었을 때가 아니라 **지금 상태**를 낸다. */
  document: CanvasDocument
}

const EXPORT_KINDS = ['json', 'html', 'svg'] as const
type ExportKind = (typeof EXPORT_KINDS)[number]

function serialize(project: TemplateProject, kind: ExportKind): string {
  if (kind === 'json') return exportJson(project)
  if (kind === 'html') return exportHtml(project)
  return exportSvg(project)
}

function download(name: string, text: string, type: string) {
  const url = URL.createObjectURL(new Blob([text], { type }))
  const anchor = window.document.createElement('a')
  anchor.href = url
  anchor.download = name
  anchor.click()
  URL.revokeObjectURL(url)
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

export function TemplateGallery({ onOpen, project, document }: Props) {
  const [tokenSetId, setTokenSetId] = useState(DEFAULT_TOKEN_SET_ID)
  const [error, setError] = useState('')
  const [draft, setDraft] = useState('')
  const [notice, setNotice] = useState('')

  /** 내보내기 대상 = 열었던 프로젝트 + **현재** 장면. */
  const current = project ? { ...project, scene: document } : null

  function open(blueprintId: string) {
    try {
      const next = createTemplateProject({ blueprintId, tokenSetId })
      setError('')
      setNotice('')
      onOpen(next)
    } catch (cause) {
      // 실패해도 onOpen을 부르지 않는다 — 현재 문서가 그대로 남는다.
      setError(`열기 실패 — ${cause instanceof Error ? cause.message : String(cause)}`)
    }
  }

  function importJson() {
    try {
      const parsed = JSON.parse(draft) as TemplateProject
      const result = validateTemplateProject(parsed)
      if (!result.valid) throw new Error(result.errors.map((item) => item.code).join(', '))
      setError('')
      setNotice(`가져오기 완료 · ${templateSignature(parsed)}`)
      onOpen(parsed)
    } catch (cause) {
      // 부분 적용 금지 — 실패하면 현재 문서를 그대로 둔다.
      setNotice('')
      setError(`가져오기 차단 — ${cause instanceof Error ? cause.message : String(cause)}`)
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
          {error}
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

      <section className="template-roundtrip">
        <h3>내보내기 · 가져오기</h3>
        {current ? (
          <div className="template-export-actions">
            {EXPORT_KINDS.map((kind) => (
              <button
                key={kind}
                type="button"
                data-testid={`template-export-${kind}`}
                onClick={() =>
                  download(
                    `${current.request.id}.${kind}`,
                    serialize(current, kind),
                    kind === 'svg' ? 'image/svg+xml' : 'text/plain',
                  )
                }
              >
                {kind.toUpperCase()}
              </button>
            ))}
          </div>
        ) : (
          <p className="template-hint">템플릿에서 시작하면 내보낼 수 있습니다.</p>
        )}

        <label>
          JSON 가져오기
          <textarea
            aria-label="템플릿 JSON 가져오기"
            data-testid="template-import-draft"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="내보낸 JSON 붙여넣기"
          />
        </label>
        <button type="button" data-testid="template-import" onClick={importJson}>
          가져오기
        </button>
        {notice && (
          <p className="template-notice" role="status" data-testid="template-notice">
            {notice}
          </p>
        )}
      </section>
    </aside>
  )
}
