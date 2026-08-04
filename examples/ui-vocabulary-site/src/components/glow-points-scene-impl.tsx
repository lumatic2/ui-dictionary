import { useEffect, useRef } from "react"
import * as THREE from "three"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js"

/**
 * Implementation module for the glow points scene — static three.js imports
 * live here so the wrapper can keep them out of the main bundle behind a
 * dynamic import (same split as lazy-three-object-scene).
 *
 * The whole node field is ONE THREE.Points draw call with a custom shader:
 * gl_PointCoord carves a round core plus halo, AdditiveBlending makes
 * overlaps glow, per-point seed drives a breathing size wobble, and alpha
 * fades with camera depth. Edges are one LineSegments with a pulse shader.
 * UnrealBloom finishes the luminous look. Reduced motion zeroes the motion
 * uniform and the idle orbit. The dark stage and glow palette are scene
 * content — remap via props, not theme tokens.
 */

export type GlowPoint = {
  x: number
  y: number
  z: number
  /** CSS hex color for the point core. */
  color: string
  /** Point size in shader units (roughly px at rest distance). */
  size?: number
}

export type GlowPointsSceneImplProps = {
  points: GlowPoint[]
  /** Index pairs into `points` to draw as luminous edges. */
  edges?: Array<[number, number]>
  /** Stage color behind the field. Scene content, not a theme token. */
  background?: string
  /** Idle orbit speed in radians/sec (0 disables). Reduced motion forces 0. */
  orbitSpeed?: number
  className?: string
}

const POINT_VERTEX = `
  attribute float aSize;
  attribute float aSeed;
  uniform float uTime;
  uniform float uNear;
  uniform float uFar;
  uniform float uMotion;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    float breath = 1.0 + 0.10 * uMotion * sin(uTime * 0.82 + aSeed);
    gl_PointSize = clamp(aSize * breath, 1.4, 14.0);
    gl_Position = projectionMatrix * mv;
    vColor = color;
    vAlpha = 1.0 - smoothstep(uNear, uFar, -mv.z);
  }
`

const POINT_FRAGMENT = `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - vec2(0.5)) * 2.0;
    if (d > 1.0) discard;
    float core = smoothstep(0.52, 0.0, d);
    float halo = smoothstep(1.0, 0.22, d) * 0.5;
    float alpha = (core + halo) * vAlpha;
    vec3 coreColor = mix(vColor, vec3(1.0), core * 0.35);
    gl_FragColor = vec4(coreColor * mix(0.9, 1.28, core), alpha);
  }
`

const EDGE_VERTEX = `
  attribute float aSeed;
  varying vec3 vColor;
  varying float vSeed;
  void main() {
    vColor = color;
    vSeed = aSeed;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const EDGE_FRAGMENT = `
  uniform float uTime;
  uniform float uOpacity;
  uniform float uMotion;
  varying vec3 vColor;
  varying float vSeed;
  void main() {
    float pulse = 1.0 + uMotion * 0.18 * sin(uTime * 0.72 + vSeed);
    gl_FragColor = vec4(vColor * pulse, uOpacity * pulse);
  }
`

export default function GlowPointsSceneImpl({
  points,
  edges = [],
  background = "#0a0a0a",
  orbitSpeed = 0.05,
  className,
}: GlowPointsSceneImplProps) {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host || points.length === 0) return

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const motion = reducedMotion ? 0 : 1

    const rect = host.getBoundingClientRect()
    const width = Math.max(1, rect.width)
    const height = Math.max(1, rect.height)

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(background)

    const radius = points.reduce((max, p) => Math.max(max, Math.hypot(p.x, p.y, p.z)), 1)
    const camera = new THREE.PerspectiveCamera(54, width / height, 1, radius * 40)
    camera.position.set(0, -radius * 0.6, radius * 2.4)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" })
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1))
    renderer.setSize(width, height)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 0.96
    host.appendChild(renderer.domElement)

    const composer = new EffectComposer(renderer)
    composer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1))
    composer.setSize(width, height)
    composer.addPass(new RenderPass(scene, camera))
    composer.addPass(new UnrealBloomPass(new THREE.Vector2(width, height), 0.72, 0.62, 0.08))

    const group = new THREE.Group()
    scene.add(group)

    // Node field — one Points object, one draw call.
    const positions = new Float32Array(points.length * 3)
    const colors = new Float32Array(points.length * 3)
    const sizes = new Float32Array(points.length)
    const seeds = new Float32Array(points.length)
    points.forEach((p, i) => {
      positions.set([p.x, p.y, p.z], i * 3)
      const c = new THREE.Color(p.color)
      colors.set([c.r, c.g, c.b], i * 3)
      sizes[i] = p.size ?? 6
      seeds[i] = (i * 0.61803398875) % 1 * Math.PI * 2
    })
    const pointGeometry = new THREE.BufferGeometry()
    pointGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    pointGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))
    pointGeometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1))
    pointGeometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1))
    const pointMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uNear: { value: radius * 0.62 },
        uFar: { value: radius * 3.6 },
        uMotion: { value: motion },
      },
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: POINT_VERTEX,
      fragmentShader: POINT_FRAGMENT,
    })
    const pointField = new THREE.Points(pointGeometry, pointMaterial)
    pointField.frustumCulled = false
    group.add(pointField)

    // Edge field — one LineSegments, colors lerped toward a neutral haze.
    let edgeGeometry: THREE.BufferGeometry | null = null
    let edgeMaterial: THREE.ShaderMaterial | null = null
    if (edges.length > 0) {
      const neutral = new THREE.Color("#b8b3aa")
      const edgePositions = new Float32Array(edges.length * 6)
      const edgeColors = new Float32Array(edges.length * 6)
      const edgeSeeds = new Float32Array(edges.length * 2)
      edges.forEach(([a, b], i) => {
        const pa = points[a]
        const pb = points[b]
        edgePositions.set([pa.x, pa.y, pa.z, pb.x, pb.y, pb.z], i * 6)
        const ca = neutral.clone().lerp(new THREE.Color(pa.color), 0.22)
        const cb = neutral.clone().lerp(new THREE.Color(pb.color), 0.22)
        edgeColors.set([ca.r, ca.g, ca.b, cb.r, cb.g, cb.b], i * 6)
        const seed = (i * 0.7548776662) % 1 * Math.PI * 2
        edgeSeeds.set([seed, seed], i * 2)
      })
      edgeGeometry = new THREE.BufferGeometry()
      edgeGeometry.setAttribute("position", new THREE.BufferAttribute(edgePositions, 3))
      edgeGeometry.setAttribute("color", new THREE.BufferAttribute(edgeColors, 3))
      edgeGeometry.setAttribute("aSeed", new THREE.BufferAttribute(edgeSeeds, 1))
      edgeMaterial = new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 }, uOpacity: { value: 0.4 }, uMotion: { value: motion } },
        vertexColors: true,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexShader: EDGE_VERTEX,
        fragmentShader: EDGE_FRAGMENT,
      })
      const edgeField = new THREE.LineSegments(edgeGeometry, edgeMaterial)
      edgeField.frustumCulled = false
      group.add(edgeField)
    }

    const observer = new ResizeObserver(() => {
      const next = host.getBoundingClientRect()
      const w = Math.max(1, next.width)
      const h = Math.max(1, next.height)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
      composer.setSize(w, h)
    })
    observer.observe(host)

    let frame = 0
    const clock = new THREE.Clock()
    const renderFrame = () => {
      const elapsed = clock.getElapsedTime()
      pointMaterial.uniforms.uTime.value = elapsed
      if (edgeMaterial) edgeMaterial.uniforms.uTime.value = elapsed
      if (!reducedMotion && orbitSpeed !== 0) {
        group.rotation.y = elapsed * orbitSpeed
      }
      composer.render()
      frame = window.requestAnimationFrame(renderFrame)
    }
    frame = window.requestAnimationFrame(renderFrame)

    return () => {
      window.cancelAnimationFrame(frame)
      observer.disconnect()
      pointGeometry.dispose()
      pointMaterial.dispose()
      edgeGeometry?.dispose()
      edgeMaterial?.dispose()
      composer.dispose()
      renderer.dispose()
      host.removeChild(renderer.domElement)
    }
  }, [points, edges, background, orbitSpeed])

  return <div ref={hostRef} className={className} data-slot="glow-points-scene" />
}
