import { useEffect, useState } from 'react'
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
  const [name, setName] = useState(node?.name ?? '')
  useEffect(() => { setName(node?.name ?? ''); setError('') }, [node?.id, node?.name])

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
          if (!validateTokenMode(event.target.value)) { setError('invalid token mode'); return }
          onOperation({ ...operationId('mode'), type: 'set-token-mode', tokenSetId: event.target.value })
        }}
      >
        <option value="askewly.default">Default</option>
        <option value="askewly.dark">Dark</option>
      </select>
    </label>
    {!node ? <p className="inspector-empty">Select one node to edit its properties.</p> : <div className="property-list">
      <div className="selection-summary"><span>{node.kind}</span><code>{node.id}</code></div>
      {canMaterialize && <button type="button" data-testid="materialize-node" onClick={() => onMaterialize(node.id)}>Materialize</button>}
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
      {propertyFieldsForNode(node).map((field) => <label className="property-field" key={`${field.scope}.${field.key}`}>{field.label}
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
    </div>}
    <p className="property-error" role="alert" data-testid="property-error">{error}</p>
    <dl className="document-meta">
      <div><dt>Revision</dt><dd data-testid="document-revision">{document.revision}</dd></div>
      <div><dt>Nodes</dt><dd>{Object.keys(document.nodes).length.toLocaleString()}</dd></div>
      <div><dt>Selection</dt><dd data-testid="selection-count">{document.selection.length}</dd></div>
    </dl>
  </aside>
}
