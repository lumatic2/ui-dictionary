import { useEffect, useState, type ReactNode } from 'react'
import {
  propertyFieldsForNode,
  validateNodePropertyEdit,
  validateTokenMode,
  type CanvasDocument,
  type CanvasOperation,
  type NodePropertyEdit,
  type PropValue,
  type PropertyField,
} from '@askewly/canvas-core'
import { isKnownTokenSet, listDocumentTokenSets } from './documentTokens'

/**
 * 기하 필드 — 위치·크기·각도.
 *
 * `propertyFieldsForNode`에 섞지 않는다. 그쪽은 `set-node-property` 계약(prop/override/variant/
 * token/layout)을 따르는데, 기하는 캔버스 드래그와 **같은 연산**(`transform-nodes`·`rotate-nodes`)
 * 으로 커밋돼야 한다 — 인스펙터 전용 경로를 따로 만들면 undo 이력이 갈라진다.
 */
/**
 * 인스펙터 섹션 순서 — **우리가 지어낸 순서가 아니다.**
 * 리서치가 Figma·Penpot 공통으로 확인한 순서다(기하 → 구조 → 시각 → 내보내기).
 * 근거: research/2026-07-20-editor-ui-horizon-canvas-interaction.md §1.4·§3.4
 */
export const INSPECTOR_SECTIONS = ['geometry', 'structure', 'visual', 'export'] as const
export type InspectorSection = (typeof INSPECTOR_SECTIONS)[number]

const SECTION_LABELS: Record<InspectorSection, string> = {
  geometry: '기하',
  structure: '구조',
  visual: '시각',
  export: '내보내기',
}

/** 필드가 어느 섹션에 속하는가. token 은 시각, 나머지(layout·prop·variant·override)는 구조다. */
function sectionForScope(scope: PropertyField['scope']): InspectorSection {
  return scope === 'token' ? 'visual' : 'structure'
}

const GEOMETRY_FIELDS = [
  { key: 'x', label: 'X' },
  { key: 'y', label: 'Y' },
  { key: 'width', label: '너비' },
  { key: 'height', label: '높이' },
  { key: 'rotation', label: '각도' },
] as const

type GeometryKey = (typeof GEOMETRY_FIELDS)[number]['key']

/** 크기는 0 이하가 될 수 없다. 각도는 임의 실수를 받아 [0,360)으로 접는다. */
function geometryError(key: GeometryKey, value: number): string | null {
  if (!Number.isFinite(value)) return `${key}: 숫자가 필요합니다.`
  if ((key === 'width' || key === 'height') && value <= 0) return `${key}: 0보다 커야 합니다.`
  return null
}

/** 빈 칸은 0이 아니다 — `Number('')`이 0이라 그냥 넘기면 빈 입력이 좌표를 0으로 만든다. */
function parseGeometry(draft: string): number {
  return draft.trim() === '' ? Number.NaN : Number(draft)
}

function Section({ id, children }: { id: InspectorSection; children: ReactNode }) {
  return <div className="inspector-section" data-inspector-section={id}>
    <h3>{SECTION_LABELS[id]}</h3>
    {children}
  </div>
}

function GeometryInput({ id, label, value, commit }: { id: string; label: string; value: number; commit: (next: number) => void }) {
  const [draft, setDraft] = useState(String(value))
  // 문서가 바뀌면(캔버스에서 끌었을 때) 표시가 따라와야 한다 — 로컬 상태만 보면 안 따라온다.
  useEffect(() => setDraft(String(value)), [value])
  return <label className="property-field">{label}
    <input
      data-testid={`geometry-${id}`}
      type="number"
      value={draft}
      onChange={(event) => setDraft(event.target.value)}
      onBlur={() => commit(parseGeometry(draft))}
      onKeyDown={(event) => { if (event.key === 'Enter') commit(parseGeometry(draft)) }}
    />
  </label>
}

interface Props {
  document: CanvasDocument
  onOperation: (operation: CanvasOperation) => void
  bridgeConnected: boolean
  onMaterialize: (nodeId: string) => void
}

function operationId(prefix: string) {
  return { id: `${prefix}-${performance.now()}`, at: new Date().toISOString() }
}

function DraftInput({ field, commit }: { field: PropertyField; commit: (value: PropValue) => void }) {
  const [value, setValue] = useState(String(field.value ?? ''))
  useEffect(() => setValue(String(field.value ?? '')), [field.value])
  return <input
    data-testid={`property-${field.scope}-${field.key}`}
    value={value}
    type={field.valueType === 'number' ? 'number' : 'text'}
    onChange={(event) => setValue(event.target.value)}
    onBlur={() => commit(field.valueType === 'number' ? Number(value) : value)}
  />
}

export function PropertyInspector({ document, onOperation, bridgeConnected, onMaterialize }: Props) {
  const node = document.selection.length === 1 ? document.nodes[document.selection[0]] : null
  const canMaterialize = bridgeConnected && node?.kind === 'code-component' && node.source.file.startsWith('registry://')
  const [error, setError] = useState('')
  const tokenSetChoices = listDocumentTokenSets()
  const [name, setName] = useState(node?.name ?? '')
  useEffect(() => { setName(node?.name ?? ''); setError('') }, [node?.id, node?.name])

  /**
   * 기하 편집을 캔버스 드래그와 **같은 연산**으로 커밋한다.
   * 각도는 `rotate-nodes`, 나머지는 `transform-nodes` — 문서 모델이 이미 갖고 있는 축 그대로다.
   */
  const commitGeometry = (key: GeometryKey, value: number) => {
    if (!node) return
    const nextError = geometryError(key, value)
    if (nextError) { setError(nextError); return }
    setError('')
    if (key === 'rotation') {
      if (value === node.rotation) return
      onOperation({ ...operationId('geometry'), type: 'rotate-nodes', rotationById: { [node.id]: value } })
      return
    }
    if (node.bounds[key] === value) return
    onOperation({ ...operationId('geometry'), type: 'transform-nodes', boundsById: { [node.id]: { ...node.bounds, [key]: value } } })
  }

  // 섹션별로 필드를 가른다 — scope 전부가 어딘가에 속하므로 조용히 사라지는 필드가 없다.
  const emptySections = () => ({ geometry: [], structure: [], visual: [], export: [] } as Record<InspectorSection, PropertyField[]>)
  const fieldsBySection = node
    ? propertyFieldsForNode(node).reduce((acc, field) => { acc[sectionForScope(field.scope)].push(field); return acc }, emptySections())
    : emptySections()

  const commitProperty = (field: PropertyField, value: PropValue) => {
    if (!node) return
    const edit: NodePropertyEdit = { nodeId: node.id, scope: field.scope, key: field.key, value }
    const nextError = validateNodePropertyEdit(document, edit)
    if (nextError) { setError(nextError); return }
    setError('')
    onOperation({ ...operationId('property'), type: 'set-node-property', ...edit })
  }

  return <aside className="inspector">
    <h2>Properties</h2>
    <label className="property-field">Token mode
      <select
        data-testid="token-mode"
        value={document.tokenSetId}
        onChange={(event) => {
          const tokenSetId = event.target.value
          // 모양 검사만으로는 `foo.bar` 같은 없는 세트가 통과한다 — 실재 여부까지 본다.
          if (!validateTokenMode(tokenSetId) || !isKnownTokenSet(tokenSetId)) {
            setError(`토큰 세트 '${tokenSetId}'가 없습니다.`)
            return
          }
          setError('')
          onOperation({ ...operationId('mode'), type: 'set-token-mode', tokenSetId })
        }}
      >
        {/* 옵션은 실재하는 세트에서 생성한다 — 손으로 적으면 목록과 실재가 어긋난다. */}
        {tokenSetChoices.map((choice) => (
          <option key={choice.id} value={choice.id}>{choice.label}</option>
        ))}
        {/* 문서가 모르는 세트를 들고 있으면 그 사실을 숨기지 않고 보여준다. */}
        {!isKnownTokenSet(document.tokenSetId) && (
          <option value={document.tokenSetId}>{document.tokenSetId} (알 수 없음)</option>
        )}
      </select>
    </label>
    {/*
      선택 없음 / 다중 / 단일을 **다른 말로** 구분한다.
      전에는 셋을 하나로 뭉쳐 3개를 골라도 "Select one node"가 떠서, 아무것도 안 골랐다는 뜻으로 읽혔다.
    */}
    {!node && document.selection.length > 1
      ? <p className="inspector-empty" data-testid="inspector-multi">
        {`${document.selection.length}개를 골랐다. 값 편집은 하나만 골랐을 때 한다.`}
      </p>
      : !node ? <p className="inspector-empty" data-testid="inspector-none">아직 아무것도 고르지 않았다. 캔버스나 레이어에서 하나를 고른다.</p> : <div className="property-list">
      <div className="selection-summary"><span>{node.kind}</span><code>{node.id}</code></div>
      {canMaterialize && <button type="button" data-testid="materialize-node" onClick={() => onMaterialize(node.id)}>Materialize</button>}
      <Section id="geometry">
        <div className="geometry-grid">
          {GEOMETRY_FIELDS.map((field) => <GeometryInput
            key={field.key}
            id={field.key}
            label={field.label}
            value={field.key === 'rotation' ? node.rotation : node.bounds[field.key]}
            commit={(next) => commitGeometry(field.key, next)}
          />)}
        </div>
      </Section>
      <Section id="structure">
      <label className="property-field">Name
        <input
          data-testid="property-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          onBlur={() => {
            if (name !== node.name) onOperation({ ...operationId('name'), type: 'update-node', nodeId: node.id, patch: { name } })
          }}
        />
      </label>
      {fieldsBySection.structure.map((field) => <label className="property-field" key={`${field.scope}.${field.key}`}>{field.label}
        {field.valueType === 'select' ? <select
          data-testid={`property-${field.scope}-${field.key}`}
          value={String(field.value)}
          onChange={(event) => commitProperty(field, event.target.value)}
        >{field.options?.map((option) => <option key={option}>{option}</option>)}</select>
          : field.valueType === 'boolean' ? <select
            data-testid={`property-${field.scope}-${field.key}`}
            value={String(field.value)}
            onChange={(event) => commitProperty(field, event.target.value === 'true')}
          ><option value="false">False</option><option value="true">True</option></select>
            : <DraftInput field={field} commit={(value) => commitProperty(field, value)} />}
      </label>)}
      </Section>
      <Section id="visual">
        {fieldsBySection.visual.length === 0
          ? <p className="section-empty">이 노드에 묶인 토큰이 없다.</p>
          : fieldsBySection.visual.map((field) => <label className="property-field" key={`${field.scope}.${field.key}`}>{field.label}
            <DraftInput field={field} commit={(value) => commitProperty(field, value)} />
          </label>)}
      </Section>
      <Section id="export">
        {/* 내보내기 기능 자체는 template-core 소관이다. 빈 자리에 가짜 버튼을 두지 않고 상태만 말한다. */}
        <p className="section-empty" data-testid="export-status">이 노드 단위 내보내기는 아직 없다. 문서 전체 내보내기는 상단 도구모음에서 한다.</p>
      </Section>
    </div>}
    <p className="property-error" role="alert" data-testid="property-error">{error}</p>
    <dl className="document-meta">
      <div><dt>Revision</dt><dd data-testid="document-revision">{document.revision}</dd></div>
      <div><dt>Nodes</dt><dd>{Object.keys(document.nodes).length.toLocaleString()}</dd></div>
      <div><dt>Selection</dt><dd data-testid="selection-count">{document.selection.length}</dd></div>
    </dl>
  </aside>
}
