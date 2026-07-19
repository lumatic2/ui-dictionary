import { useMemo, useState } from 'react'
import {
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

// TODO(TH3): 이 팔레트는 하드코딩이라 tokenSetId를 무시한다. 토큰 세트 조회로 대체한다.
const palette: Record<string, string> = {
  'surface.canvas': '#f7f2e8',
  'brand.primary': '#2f7d4f',
  'text.primary': '#2b241b',
  'text.secondary': '#685d50',
  'text.muted': '#8d8172',
}

const EXPORT_KINDS = ['json', 'html', 'svg'] as const
type ExportKind = (typeof EXPORT_KINDS)[number]

function nodeColor(binding?: string) {
  return binding ? palette[binding] : '#d8d0c2'
}

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

  function choose(next: TemplateFormat) {
    setFormat(next)
    setProject(structuredClone(studioProjects[next]))
    setSelected('')
    setDiagnostic('')
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
          <div
            className="canvas"
            style={{
              width: project.request.width,
              height: project.request.height,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              background: nodeColor('surface.canvas'),
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
                return (
                  <div
                    key={node.id}
                    onClick={() => setSelected(node.id)}
                    style={{
                      ...common,
                      color: nodeColor(node.tokenBindings.color),
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
                return (
                  <div
                    key={node.id}
                    style={{ ...common, background: nodeColor(node.tokenBindings.fill) }}
                  />
                )
              }

              if (node.kind === 'image') {
                const asset = project.assets.find((candidate) => candidate.id === node.assetId)
                return (
                  <img
                    key={node.id}
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
