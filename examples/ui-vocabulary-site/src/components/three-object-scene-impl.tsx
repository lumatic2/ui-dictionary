import { useMemo, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import type { Mesh } from "three"

/**
 * The heavy half of the lazy pair: this module imports three.js and
 * @react-three/fiber, so it must only ever be reached through a dynamic
 * import (see lazy-three-object-scene.tsx). Colors come from the document's
 * token custom properties at mount — no hardcoded material colors.
 */
function SpinningObject({ color, spin }: { color: string; spin: boolean }) {
  const meshRef = useRef<Mesh>(null)

  useFrame((_, delta) => {
    if (!spin || !meshRef.current) return
    meshRef.current.rotation.x += delta * 0.4
    meshRef.current.rotation.y += delta * 0.6
  })

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.35, 0]} />
      <meshStandardMaterial color={color} flatShading metalness={0.15} roughness={0.5} />
    </mesh>
  )
}

export default function ThreeObjectSceneImpl() {
  const tokens = useMemo(() => {
    const styles = getComputedStyle(document.documentElement)
    return {
      object: styles.getPropertyValue("--primary").trim() || "#888888",
      spin: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    }
  }, [])

  return (
    <Canvas camera={{ position: [0, 0, 4], fov: 45 }} className="h-full w-full">
      <ambientLight intensity={0.7} />
      <directionalLight intensity={1.4} position={[3, 4, 5]} />
      <SpinningObject color={tokens.object} spin={tokens.spin} />
    </Canvas>
  )
}
