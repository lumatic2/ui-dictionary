import { useCallback, useEffect, useRef, useState } from 'react'
import { benchmarkCandidate, createFixture } from './benchmark'
import { CandidateSurface } from './candidates'
import type { BenchmarkResult, CandidateHandle, CandidateId, SceneFixture, SceneSize } from './types'
import './styles.css'

const candidates: CandidateId[] = ['dom', 'dom-webgpu', 'svg', 'webgpu']
const sizes: SceneSize[] = [1000, 5000, 10000]

export default function App() {
  const [candidate, setCandidate] = useState<CandidateId>('dom')
  const [size, setSize] = useState<SceneSize>(1000)
  const [fixture, setFixture] = useState<SceneFixture>(() => createFixture(1000))
  const [result, setResult] = useState<BenchmarkResult | null>(null)
  const [running, setRunning] = useState(false)
  const mountedAtRef = useRef(performance.now())
  const candidateRef = useRef<CandidateHandle>(null)
  const rootRef = useRef<HTMLDivElement>(null)

  const mountCandidate = useCallback(async (nextCandidate: CandidateId, nextSize: SceneSize) => {
    const nextFixture = createFixture(nextSize)
    setCandidate(nextCandidate)
    setSize(nextSize)
    setResult(null)
    mountedAtRef.current = performance.now()
    setFixture(nextFixture)
    await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())))
    return nextFixture
  }, [])

  const run = useCallback(async (nextCandidate = candidate, nextSize = size) => {
    setRunning(true)
    try {
      const nextFixture = nextCandidate === candidate && nextSize === size ? fixture : await mountCandidate(nextCandidate, nextSize)
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
      if (!candidateRef.current || !rootRef.current) throw new Error('candidate surface did not mount')
      const measured = await benchmarkCandidate(nextCandidate, nextSize, nextFixture, candidateRef.current, rootRef.current, mountedAtRef.current)
      setResult(measured)
      return measured
    } finally {
      setRunning(false)
    }
  }, [candidate, fixture, mountCandidate, size])

  useEffect(() => {
    window.__canvasBenchmark = { run, candidates, sizes }
  }, [run])

  return <main>
    <header>
      <div>
        <p className="eyebrow">AUC0 / Shared fixture</p>
        <h1>Canvas Engine Bake-off</h1>
        <p>Same canonical scene, same interaction trace, four renderer candidates.</p>
      </div>
      <div className="controls">
        <label>Candidate<select data-testid="candidate-select" value={candidate} onChange={(event) => void mountCandidate(event.target.value as CandidateId, size)}>{candidates.map((id) => <option key={id}>{id}</option>)}</select></label>
        <label>Layers<select data-testid="size-select" value={size} onChange={(event) => void mountCandidate(candidate, Number(event.target.value) as SceneSize)}>{sizes.map((value) => <option key={value}>{value}</option>)}</select></label>
        <button data-testid="run-benchmark" type="button" disabled={running} onClick={() => void run()}>{running ? 'Running…' : 'Run benchmark'}</button>
      </div>
    </header>
    <section className="workspace">
      <div ref={rootRef} className="viewport"><CandidateSurface key={`${candidate}-${size}`} ref={candidateRef} candidate={candidate} fixture={fixture} /></div>
      <aside>
        <h2>Result</h2>
        <pre data-result>{result ? JSON.stringify(result, null, 2) : 'Run the shared trace.'}</pre>
      </aside>
    </section>
  </main>
}
