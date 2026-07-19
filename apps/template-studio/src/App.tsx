import { useMemo, useState } from 'react'
import {
  listTokenSets,
  resolveProjectTokens,
  templateSignature,
  validateTemplateProject,
  type TemplateFormat,
  type TemplateProject,
} from '@askewly/template-core'
import { studioProjects } from './fixtures.js'
import { exportHtml, exportJson, exportSvg } from './exporters.js'
import './style.css'

const labels: Record<TemplateFormat, string> = {
  'business-card': '명함',
  'product-poster': '제품 포스터',
  infographic: '인포그래픽',
}

const EXPORT_KINDS = ['json', 'html', 'svg'] as const
type ExportKind = (typeof EXPORT_KINDS)[number]

function download(name: string, text: string, type: string) {
  const url = URL.createObjectURL(new Blob([text], { type }))
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = name
  anchor.click()
  URL.revokeObjectURL(url)
}

function serialize(project: TemplateProject, kind: ExportKind) {
  if (kind === 'json') return exportJson(project)
  if (kind === 'html') return exportHtml(project)
  return exportSvg(project)
}

export default function App() {
  const [format, setFormat] = useState<TemplateFormat>('business-card')
  const [project, setProject] = useState<TemplateProject>(() =>
    structuredClone(studioProjects['business-card']),
  )
  const [selected, setSelected] = useState('')
  const [jsonDraft, setJsonDraft] = useState('')
  const [diagnostic, setDiagnostic] = useState('')

  const scale = Math.min(1, 760 / project.request.width)
  const nodes = Object.values(project.scene.nodes).filter((node) => node.parentId)
  const selectedNode = project.scene.nodes[selected]
  const signature = useMemo(() => templateSignature(project), [project])

  // 색·타이포의 정본은 토큰 세트다. 렌더러는 리터럴을 갖지 않는다 — 조회 실패는 진단으로 드러낸다.
  const tokens = useMemo(() => resolveProjectTokens(project), [project])
  const canvasBackground = tokens.values['surface.canvas']

  function choose(next: TemplateFormat) {
    const base = structuredClone(studioProjects[next])
    // 형식을 바꿔도 보고 있던 토큰 세트는 유지한다 — 세트 비교 중 형식을 바꾸면 값이 되돌아가면 안 된다.
    base.request.tokenSetId = project.request.tokenSetId
    setFormat(next)
    setProject(base)
    setSelected('')
    setDiagnostic('')
  }

  function chooseTokenSet(tokenSetId: string) {
    const next = structuredClone(project)
    next.request.tokenSetId = tokenSetId
    next.scene.revision += 1
    setProject(next)
  }

  function updateText(value: string) {
    if (selectedNode?.kind !== 'text') return
    const next = structuredClone(project)
    const node = next.scene.nodes[selected]
    if (node.kind === 'text') node.text = value
    next.scene.revision += 1
    setProject(next)
  }

  function importJson() {
    try {
      const next = JSON.parse(jsonDraft) as TemplateProject
      const result = validateTemplateProject(next)
      if (!result.valid) throw new Error(result.errors.map((error) => error.code).join(', '))
      setProject(next)
      setFormat(next.request.format)
      setDiagnostic('가져오기 완료')
    } catch (error) {
      setDiagnostic(`가져오기 차단: ${String(error)}`)
    }
  }

  return (
    <div className="app">
      <header>
        <div>
          <small>ASKewly DESIGN · TEMPLATE PRODUCTION</small>
          <h1>편집 가능한 템플릿 스튜디오</h1>
        </div>
        <span className="signature">{signature}</span>
      </header>

      <div className="toolbar">
        <label>
          형식
          <select
            aria-label="형식"
            value={format}
            onChange={(event) => choose(event.target.value as TemplateFormat)}
          >
            {Object.entries(labels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label>
          토큰 세트
          <select
            aria-label="토큰 세트"
            value={project.request.tokenSetId}
            onChange={(event) => chooseTokenSet(event.target.value)}
          >
            {listTokenSets().map((set) => (
              <option key={set.id} value={set.id}>
                {set.label}
              </option>
            ))}
            {!tokens.set && (
              <option value={project.request.tokenSetId}>{project.request.tokenSetId} (없음)</option>
            )}
          </select>
        </label>
        {EXPORT_KINDS.map((kind) => (
          <button
            key={kind}
            onClick={() =>
              download(
                `askewly.${kind}`,
                serialize(project, kind),
                kind === 'svg' ? 'image/svg+xml' : 'text/plain',
              )
            }
          >
            {kind.toUpperCase()} 내보내기
          </button>
        ))}
      </div>

      <main>
        <aside>
          <h2>레이어</h2>
          {nodes.map((node) => (
            <button
              className={selected === node.id ? 'active' : ''}
              key={node.id}
              onClick={() => setSelected(node.id)}
            >
              <span>{node.kind}</span>
              {node.name}
            </button>
          ))}
        </aside>

        <section className="stage">
          {tokens.issues.length > 0 && (
            <div className="token-diagnostic" role="alert" data-testid="token-diagnostic">
              <h2>토큰 조회 실패 {tokens.issues.length}건</h2>
              <p>
                해석되지 않은 값은 기본색으로 대체하지 않습니다. 아래 항목을 고치기 전까지 캔버스는
                미해결 상태로 표시됩니다.
              </p>
              <ul>
                {tokens.issues.map((issue, index) => (
                  <li key={`${issue.code}-${index}`}>
                    <code>{issue.code}</code> {issue.message}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div
            className={canvasBackground ? 'canvas' : 'canvas canvas--unresolved'}
            data-testid="canvas"
            style={{
              width: project.request.width,
              height: project.request.height,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              ...(canvasBackground ? { background: canvasBackground } : {}),
            }}
          >
            {nodes.map((node) => {
              const common = {
                position: 'absolute' as const,
                left: node.bounds.x,
                top: node.bounds.y,
                width: node.bounds.width,
                height: node.bounds.height,
              }

              if (node.kind === 'text') {
                const color = tokens.values[node.tokenBindings.color ?? '']
                const fontFamily = tokens.values[node.tokenBindings.fontFamily ?? '']
                return (
                  <div
                    key={node.id}
                    data-node-id={node.id}
                    data-unresolved={color ? undefined : ''}
                    className={color ? undefined : 'unresolved'}
                    onClick={() => setSelected(node.id)}
                    style={{
                      ...common,
                      ...(color ? { color } : {}),
                      ...(fontFamily ? { fontFamily } : {}),
                      fontSize: node.textStyle.fontSize,
                      fontWeight: node.textStyle.fontWeight,
                      lineHeight: `${node.textStyle.lineHeight}px`,
                    }}
                  >
                    {node.text}
                  </div>
                )
              }

              if (node.kind === 'shape') {
                const fill = tokens.values[node.tokenBindings.fill ?? '']
                return (
                  <div
                    key={node.id}
                    data-node-id={node.id}
                    data-unresolved={fill ? undefined : ''}
                    className={fill ? undefined : 'unresolved'}
                    style={{ ...common, ...(fill ? { background: fill } : {}) }}
                  />
                )
              }

              if (node.kind === 'image') {
                const asset = project.assets.find((candidate) => candidate.id === node.assetId)
                return (
                  <img
                    key={node.id}
                    data-node-id={node.id}
                    alt={node.alt}
                    src={asset?.uri}
                    style={{ ...common, objectFit: node.fit }}
                  />
                )
              }

              return null
            })}
          </div>
        </section>

        <aside className="inspector">
          <h2>속성</h2>
          {selectedNode?.kind === 'text' ? (
            <label>
              텍스트
              <textarea
                aria-label="텍스트"
                value={selectedNode.text}
                onChange={(event) => updateText(event.target.value)}
              />
            </label>
          ) : (
            <p>텍스트 레이어를 선택하세요.</p>
          )}

          <label>
            JSON 왕복
            <textarea
              aria-label="JSON 가져오기"
              value={jsonDraft}
              onChange={(event) => setJsonDraft(event.target.value)}
              placeholder="내보낸 JSON 붙여넣기"
            />
          </label>
          <button onClick={importJson}>JSON 가져오기</button>
          {diagnostic && <p role="status">{diagnostic}</p>}
        </aside>
      </main>
    </div>
  )
}
