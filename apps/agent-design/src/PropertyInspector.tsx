import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from 'react'
import {
  propertyFieldsForNode,
  COLOR_BINDING_KEYS,
  validateLiteralColor,
  validateNodePropertyEdit,
  validateTokenMode,
  type CanvasDocument,
  type CanvasOperation,
  type NodePropertyEdit,
  type PropValue,
  type CanvasNode,
  type PropertyField,
} from '@askewly/canvas-core'
import { documentTokens, isKnownTokenSet, listDocumentTokenSets, type TokenEntry } from './documentTokens'

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

/**
 * 토큰 바인딩 키 → 사용자 언어. `Token · fill`은 내부 용어였다.
 *
 * EU5 관측에서 사용자가 색을 못 찾은 이유 중 하나가 이것이다 — 화면 어디에도
 * "색"이라는 단어가 없었다(계측 0건). 목록에 없는 키는 키 이름을 그대로 쓴다.
 */
const COLOR_BINDING_LABELS: Record<string, string> = {
  fill: '채움 색',
  background: '배경 색',
  color: '글자 색',
}

/*
 * 라벨 목록이 정본(`COLOR_BINDING_KEYS`)과 어긋나면 **개발 중에 즉시 드러난다.**
 * 정본에 색 키가 늘었는데 라벨을 안 붙이면 사용자에게 내부 키 이름이 그대로 나간다 —
 * `Token · fill`이 EU5에서 정확히 그 형태였다.
 */
if (import.meta.env?.DEV) {
  const 라벨없는키 = COLOR_BINDING_KEYS.filter((key) => !(key in COLOR_BINDING_LABELS))
  if (라벨없는키.length) {
    throw new Error(`색 키에 사용자 언어 라벨이 없다: ${라벨없는키.join(', ')} (COLOR_BINDING_LABELS에 추가)`)
  }
}

/**
 * 이 필드가 색인가.
 *
 * 토큰이 해석되면 그 토큰의 `kind`가 답한다(ECT1 step-2가 두 어휘에 심은 값).
 * 해석되지 않는 죽은 바인딩은 kind를 물을 대상이 없으므로 **키 계약**으로 판정한다 —
 * `fill`·`background`·`color`는 렌더러가 색으로 칠하는 키다. 죽었다고 색 컨트롤에서
 * 빼버리면 사용자가 그걸 고칠 방법이 사라진다.
 */
function isColorBinding(tokenSetId: string, field: PropertyField): boolean {
  if (field.scope !== 'token') return false
  const binding = String(field.value ?? '')
  const entry = documentTokens(tokenSetId).listTokens().find((token) => token.name === binding)
  if (entry) return entry.kind === 'color'
  return field.key in COLOR_BINDING_LABELS
}

/**
 * 점표기 이름을 그룹으로 접는다 — `surface.canvas` → 그룹 `surface`.
 *
 * 그룹 목록을 손으로 적지 않는다. 리서치가 확인한 Penpot(점표기)·Webflow(슬래시) 방식이
 * "이름 규칙 자체가 정보구조"라는 것이고, 우리 토큰은 이미 점표기다.
 */
function groupTokens(tokens: TokenEntry[]): Array<[string, TokenEntry[]]> {
  const groups = new Map<string, TokenEntry[]>()
  for (const token of tokens) {
    const group = token.name.includes('.') ? token.name.slice(0, token.name.indexOf('.')) : '기타'
    const bucket = groups.get(group)
    if (bucket) bucket.push(token)
    else groups.set(group, [token])
  }
  return [...groups]
}

/**
 * 색 바인딩 하나 — **해석된 색 견본 + 토큰 이름**, 누르면 선택 목록이 열린다.
 *
 * 견본에 칠하는 색은 렌더러가 캔버스를 칠할 때 쓰는 그 함수에서 온다
 * (`documentTokens().resolve`). 별도 해석 경로를 만들면 견본과 캔버스가 다른 색을
 * 보여주게 되고, 그건 조용히 틀리는 종류의 결함이다.
 *
 * 색만으로 상태를 말하지 않는다(anti-patterns 4) — 견본 옆에 토큰 이름이 글자로 함께 있고,
 * 해석 실패는 회색 폴백이 아니라 **미해결이라고 적는다**.
 */
/**
 * 색 토큰 선택 목록 — **바인딩이 있든 없든 같은 목록을 쓴다.**
 *
 * 따로 만들면 같은 목록이 두 벌 생기고 한쪽만 어휘 필터를 갖게 된다(ECT3 결정).
 * 열림 상태·포커스 복귀는 부모(트리거 버튼을 가진 쪽)가 소유한다.
 */
function TokenColorPicker({ id, tokenSetId, current, onChoose, onClose }: {
  id: string
  tokenSetId: string
  current: string | null
  onChoose: (name: string) => void
  onClose: (restoreFocus: boolean) => void
}) {
  const [query, setQuery] = useState('')
  const [cursor, setCursor] = useState(0)

  // 목록은 **이 문서 어휘의 색 토큰만**이다. 다른 어휘를 섞으면 템플릿이 편집기 색으로 칠해진다.
  const choices = documentTokens(tokenSetId).listTokens().filter((token) => token.kind === 'color')
  const q = query.trim().toLowerCase()
  const matched = q ? choices.filter((token) => token.name.toLowerCase().includes(q)) : choices
  // 검색으로 목록이 줄면 커서가 목록 밖을 가리킬 수 있다.
  const active = Math.min(cursor, Math.max(0, matched.length - 1))

  /** 열기·이동·선택·닫기가 전부 키보드로 된다(anti-patterns 3). */
  const onKeyDown = (event: ReactKeyboardEvent) => {
    if (event.key === 'Escape') { event.preventDefault(); onClose(true); return }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (!matched.length) return
      const delta = event.key === 'ArrowDown' ? 1 : -1
      setCursor((was) => {
        const from = Math.min(was, matched.length - 1)
        return (from + delta + matched.length) % matched.length
      })
      return
    }
    if (event.key === 'Enter') {
      event.preventDefault()
      if (matched[active]) onChoose(matched[active].name)
    }
  }

  return <div
    className="color-picker"
    data-testid={`color-picker-${id}`}
    onKeyDown={onKeyDown}
    /*
     * 포커스가 목록 밖으로 나가면 닫는다.
     *
     * Tab으로 목록을 다 지나면 포커스는 툴바로 가는데 목록은 화면에 그대로 떠 있었다
     * (독립 검증 refuted, 2026-07-21) — 키보드 사용자에게 유령 UI다. 되돌리지는 않는다:
     * 사용자가 스스로 나간 것이라 붙잡으면 포커스 덫이 된다.
     */
    onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) onClose(false)
    }}
  >
    <input
      className="color-picker-search"
      data-testid={`color-picker-search-${id}`}
      value={query}
      placeholder="색 이름으로 찾기"
      aria-label="색 토큰 검색"
      autoFocus
      onChange={(event) => { setQuery(event.target.value); setCursor(0) }}
    />
    {matched.length === 0
      ? <p className="color-picker-empty">찾는 색이 없다.</p>
      : groupTokens(matched).map(([group, groupTokensList]) => <div className="color-picker-group" key={group}>
        <p className="color-picker-group-name">{group}</p>
        {groupTokensList.map((token) => <button
          type="button"
          key={token.name}
          className="color-picker-option"
          data-testid={`color-option-${token.name}`}
          data-active={matched[active]?.name === token.name || undefined}
          aria-current={token.name === current}
          onClick={() => onChoose(token.name)}
        >
          <span className="color-swatch" style={{ background: token.value }} aria-hidden="true" />
          <span className="color-token-name">{token.name}</span>
        </button>)}
      </div>)}
  </div>
}

/**
 * 목록을 여는 트리거의 공통 살림 — 열림 상태와 **리렌더 후 포커스 복귀**.
 *
 * 여기서 바로 `focus()`를 부르면 브라우저에서 안 먹는다. 색을 고르면 문서가 바뀌고,
 * 그 리렌더에서 캔버스가 선택 노드에 포커스를 준다 — 우리 호출이 먼저 나가고
 * 캔버스가 나중에 가져간다(ECT2 step-3 브라우저 실측). 인스펙터만 렌더하는 단위 테스트는
 * 이 경합을 못 본다.
 */
function usePickerTrigger() {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const pendingFocus = useRef(false)
  useEffect(() => {
    if (!pendingFocus.current) return
    pendingFocus.current = false
    triggerRef.current?.focus()
  })
  /**
   * @param restoreFocus Esc·선택으로 닫을 때는 되돌린다 — 안 그러면 키보드 사용자가 튕긴다.
   *   **Tab으로 나갈 때는 되돌리지 않는다** — 붙잡으면 포커스 덫이 된다.
   */
  const close = (restoreFocus = true) => {
    setOpen(false)
    pendingFocus.current = restoreFocus
  }
  return { open, setOpen, close, triggerRef }
}

/**
 * 색 바인딩 하나 — **해석된 색 견본 + 토큰 이름**, 누르면 선택 목록이 열린다.
 *
 * 견본에 칠하는 색은 렌더러가 캔버스를 칠할 때 쓰는 그 함수에서 온다
 * (`documentTokens().resolve`). 별도 해석 경로를 만들면 견본과 캔버스가 다른 색을
 * 보여주게 되고, 그건 조용히 틀리는 종류의 결함이다.
 *
 * 색만으로 상태를 말하지 않는다(anti-patterns 4) — 견본 옆에 토큰 이름이 글자로 함께 있고,
 * 해석 실패는 회색 폴백이 아니라 **미해결이라고 적는다**.
 */
function ColorBindingField({ field, tokenSetId, commit, onDetach }: {
  field: PropertyField
  tokenSetId: string
  commit: (value: PropValue) => void
  onDetach?: (literal: string) => void
}) {
  const binding = String(field.value ?? '')
  const resolved = documentTokens(tokenSetId).resolve(binding)
  const label = COLOR_BINDING_LABELS[field.key] ?? field.key
  const { open, setOpen, close, triggerRef } = usePickerTrigger()

  const choose = (name: string) => {
    close()
    if (name !== binding) commit(name)
  }

  return <div className="color-field" data-testid={`color-field-${field.key}`}>
    <span className="color-field-label">{label}</span>
    <span className="color-field-value">
      <button
        ref={triggerRef}
        type="button"
        className={`color-swatch${resolved ? '' : ' color-swatch-unresolved'}`}
        data-testid={`color-swatch-${field.key}`}
        data-resolved={resolved ?? undefined}
        style={resolved ? { background: resolved } : undefined}
        aria-label={`${label}: ${resolved ? binding : '해석되지 않음'} — 눌러서 바꾸기`}
        aria-expanded={open}
        onClick={() => setOpen((was) => !was)}
      />
      <span className="color-token-name">{binding}</span>
    </span>
    {!resolved && <span className="color-field-note">이 토큰은 지금 문서의 토큰 세트에서 해석되지 않는다.</span>}
    {/*
      * 토큰에서 벗어나는 문. 해석되는 색일 때만 낸다 — 안 풀리는 토큰은 벗어날 색이 없다.
      * 사용자 결정(2026-07-21): 탈출구 있음(Figma식). 벗어난 상태는 화면에 표시한다.
      */}
    {onDetach && resolved && <button
      type="button"
      className="color-detach-button"
      data-testid={`detach-color-${field.key}`}
      onClick={() => onDetach(resolved)}
    >토큰에서 풀기</button>}
    {open && <TokenColorPicker id={field.key} tokenSetId={tokenSetId} current={binding} onChoose={choose} onClose={close} />}
  </div>
}

/**
 * 이 노드에 **새로 묶을 수 있는** 색 키.
 *
 * 렌더러가 실제로 칠하는 키만 낸다(`CanvasSurface.nodeStyle`) — 안 칠해지는 키를 묶게 하면
 * "묶이긴 하는데 안 칠해지는" 상태가 된다. 이미지 노드는 렌더러가 `tokenBindings`를 아예
 * 참조하지 않으므로 여기서 제외한다(ECT4가 렌더러를 확장한 뒤 열린다).
 */
function bindableColorKeys(node: CanvasNode): string[] {
  if (node.kind === 'image') return []
  // 종류별로 고르는 것이지 새로 만드는 게 아니다 — 후보는 정본에서만 온다.
  const 후보 = (keys: string[]) => keys.filter((key) => COLOR_BINDING_KEYS.includes(key as never))
  if (node.kind === 'shape') return 후보(['fill', 'background'])
  if (node.kind === 'text') return 후보(['color', 'background'])
  return 후보(['background'])
}

/**
 * 아직 색이 안 묶인 속성 — **묶는 경로**.
 *
 * 리서치가 본 5개 시스템(Figma·Penpot·Framer·Webflow·Tokens Studio)이 **전부** 미바인딩
 * 상태에서 새로 묶는 명시적 어포던스를 갖는다. 우리는 0이었다 — EU5에서 사용자가 막힌
 * 이미지 노드가 "이 노드에 묶인 토큰이 없다"는 막다른 길만 보여줬다.
 */
function UnboundColorField({ bindingKey, tokenSetId, commit }: {
  bindingKey: string
  tokenSetId: string
  commit: (value: PropValue) => void
}) {
  const label = COLOR_BINDING_LABELS[bindingKey] ?? bindingKey
  const { open, setOpen, close, triggerRef } = usePickerTrigger()

  return <div className="color-field" data-testid={`unbound-color-field-${bindingKey}`}>
    <span className="color-field-label">{label}</span>
    <button
      ref={triggerRef}
      type="button"
      className="color-bind-button"
      data-testid={`bind-color-${bindingKey}`}
      aria-expanded={open}
      onClick={() => setOpen((was) => !was)}
    >{label} 묶기</button>
    {open && <TokenColorPicker
      id={bindingKey}
      tokenSetId={tokenSetId}
      current={null}
      onChoose={(name) => { close(); commit(name) }}
      onClose={close}
    />}
  </div>
}

/**
 * 토큰에서 **벗어난** 색. 벗어났다는 사실을 화면에 적는다.
 *
 * horizon 프리모템 2가 이 결정의 리스크를 맡는다 — 원시 색이 편한 기본 습관이 되면
 * 토큰 SSOT라는 논지가 안에서부터 무너진다. 표시 없는 detach는 만들지 않는다.
 */
function LiteralColorField({ bindingKey, value, tokenSetId, onRebind, onEdit, onError }: {
  bindingKey: string
  value: string
  tokenSetId: string
  onRebind: (name: string) => void
  onEdit: (literal: string) => void
  onError: (message: string) => void
}) {
  const label = COLOR_BINDING_LABELS[bindingKey] ?? bindingKey
  const { open, setOpen, close, triggerRef } = usePickerTrigger()

  /*
   * 타이핑 중에는 커밋하지 않는다. 글자마다 연산을 내면 undo가 한 글자씩 되감기고,
   * 중간 상태(`#12`)가 문서에 실제로 저장된다. 다른 입력들과 같은 규약(blur·Enter)을 쓴다.
   */
  const [draft, setDraft] = useState(value)
  useEffect(() => setDraft(value), [value])
  const commitDraft = () => {
    const next = draft.trim()
    if (!next || next === value) { setDraft(value); return }
    /*
     * 쓸 수 없는 색은 커밋 전에 막고 **사유를 화면에 낸다.**
     * 검증만 통과시키면 문서에는 저장되고 화면은 옛 색 그대로 남는다 —
     * 문서와 화면이 어긋난 채 undo 이력에까지 들어간다(독립 검증 refuted, 2026-07-21).
     */
    const error = validateLiteralColor(next)
    if (error) { onError(error); setDraft(value); return }
    onError('')
    onEdit(next)
  }

  return <div className="color-field" data-testid={`literal-color-field-${bindingKey}`}>
    <span className="color-field-label">{label}</span>
    <span className="color-field-value">
      <button
        ref={triggerRef}
        type="button"
        className="color-swatch color-swatch-literal"
        data-testid={`color-swatch-${bindingKey}`}
        data-resolved={value}
        style={{ background: value }}
        aria-label={`${label}: ${value} — 토큰에서 벗어남, 눌러서 다시 묶기`}
        aria-expanded={open}
        onClick={() => setOpen((was) => !was)}
      />
      <input
        className="color-literal-input"
        data-testid={`literal-input-${bindingKey}`}
        value={draft}
        aria-label={`${label} 원시 값`}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={() => commitDraft()}
        onKeyDown={(event) => { if (event.key === 'Enter') commitDraft() }}
      />
    </span>
    <span className="color-field-note" data-testid={`detached-note-${bindingKey}`}>토큰에서 벗어난 색이다. 견본을 눌러 다시 묶을 수 있다.</span>
    {open && <TokenColorPicker
      id={bindingKey}
      tokenSetId={tokenSetId}
      current={null}
      onChoose={(name) => { close(); onRebind(name) }}
      onClose={close}
    />}
  </div>
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
        {/*
          * 아직 안 묶인 색은 **묶는 경로**를 보여준다. 막다른 안내문만 두면 사용자가
          * 그 노드에서 색을 바꿀 방법이 없다(EU5에서 실제로 막힌 지점).
          */}
        {node && bindableColorKeys(node)
          .filter((key) => !(key in node.tokenBindings))
          .map((key) => node.literalColors?.[key]
            // 벗어난 색은 묶기 버튼이 아니라 리터럴 필드로 나온다 — 지금 색이 무엇인지 보여야 한다.
            ? <LiteralColorField
              key={`literal-${key}`}
              bindingKey={key}
              value={node.literalColors[key]}
              tokenSetId={document.tokenSetId}
              onRebind={(name) => onOperation({ ...operationId('attach'), type: 'attach-token-binding', nodeId: node.id, key, name })}
              onEdit={(literal) => onOperation({ ...operationId('literal'), type: 'detach-token-binding', nodeId: node.id, key, literal })}
              onError={setError}
            />
            : <UnboundColorField
              key={`unbound-${key}`}
              bindingKey={key}
              tokenSetId={document.tokenSetId}
              commit={(value) => commitProperty({ scope: 'token', key, label: key, value: null, valueType: 'string' }, value)}
            />)}
        {fieldsBySection.visual.length === 0 && node && bindableColorKeys(node).length === 0
          ? <p className="section-empty">이 노드에는 색 속성이 없다.</p>
          : fieldsBySection.visual.map((field) => isColorBinding(document.tokenSetId, field)
            // 색은 색으로 보여준다. 색이 아닌 토큰(글꼴 등)은 기존 텍스트 입력 그대로 둔다.
            ? <ColorBindingField
              key={`${field.scope}.${field.key}`}
              field={field}
              tokenSetId={document.tokenSetId}
              commit={(value) => commitProperty(field, value)}
              onDetach={node ? (literal) => onOperation({ ...operationId('detach'), type: 'detach-token-binding', nodeId: node.id, key: field.key, literal }) : undefined}
            />
            : <label className="property-field" key={`${field.scope}.${field.key}`}>{field.label}
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
