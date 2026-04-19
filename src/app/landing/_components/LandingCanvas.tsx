'use client'
import { useRef, Suspense, useCallback, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import SignMesh from './SignMesh'
import FrogModel from './FrogModel'

// ─── Types ────────────────────────────────────────────────────────────────────

export type Phase = 'hero' | 'explore' | 'quiz'

// ─── Sign IDs ─────────────────────────────────────────────────────────────────

const SIGN_IDS_FULL = [1, 2, 3, 4, 5, 6, 7, 8]
const SIGN_IDS_MOBILE = [1, 2, 3, 4]

// ─── Tarot fan spread — hero phase ────────────────────────────────────────────
// Cards arranged like a hand of tarot cards, fanning left to right with Z depth

const HERO_POSITIONS_FULL: [number, number, number][] = [
  [-3.8, -0.6, -2.0],
  [-2.7,  0.7, -1.4],
  [-1.6,  1.7, -0.8],
  [-0.6,  2.3, -0.3],
  [ 0.6,  2.3, -0.3],
  [ 1.6,  1.7, -0.8],
  [ 2.7,  0.7, -1.4],
  [ 3.8, -0.6, -2.0],
]

// Each card is rotated to "fan" outward, giving tarot spread perspective
const HERO_ROTATIONS_FULL: [number, number, number][] = [
  [ 0.12, -0.40, -0.28],
  [ 0.08, -0.25, -0.18],
  [ 0.04, -0.13, -0.10],
  [ 0.01, -0.04, -0.04],
  [ 0.01,  0.04,  0.04],
  [ 0.04,  0.13,  0.10],
  [ 0.08,  0.25,  0.18],
  [ 0.12,  0.40,  0.28],
]

// ─── Arc positions — explore phase ────────────────────────────────────────────

const ARC_POSITIONS_FULL: [number, number, number][] = Array.from({ length: 8 }, (_, i) => {
  const t = i / 7
  const angle = (t - 0.5) * Math.PI * 0.8
  return [Math.sin(angle) * 6.5, 0, Math.cos(angle) * -2 - 2] as [number, number, number]
})

// Each card in the arc faces toward the camera (roughly rotation.y = -arc angle)
const ARC_ROTATIONS_FULL: [number, number, number][] = ARC_POSITIONS_FULL.map(([x, , z]) => {
  const angle = Math.atan2(x, 10 - z)
  return [0, -angle, 0] as [number, number, number]
})

const QUIZ_SIGN_POSITION: [number, number, number] = [0, 0.3, 2]
const QUIZ_SIGN_ROTATION: [number, number, number] = [0, 0, 0]

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}
function lerpN(a: number, b: number, t: number) {
  return a + (b - a) * t
}

// ─── Inner Scene ──────────────────────────────────────────────────────────────

type SceneProps = {
  scrollProgressRef: React.RefObject<{ progress: number }>
  onSignSelect: (id: number | null) => void
  isMobile: boolean
  quizSignId: number
  phase: Phase
}

function Scene({ scrollProgressRef, onSignSelect, isMobile, quizSignId, phase }: SceneProps) {
  const { camera, clock } = useThree()

  const signIds = isMobile ? SIGN_IDS_MOBILE : SIGN_IDS_FULL
  const heroPositions = useMemo(
    () => (isMobile ? HERO_POSITIONS_FULL.slice(0, 4) : HERO_POSITIONS_FULL),
    [isMobile],
  )
  const heroRotations = useMemo(
    () => (isMobile ? HERO_ROTATIONS_FULL.slice(0, 4) : HERO_ROTATIONS_FULL),
    [isMobile],
  )
  const arcPositions = useMemo(
    () => (isMobile ? ARC_POSITIONS_FULL.slice(0, 4) : ARC_POSITIONS_FULL),
    [isMobile],
  )
  const arcRotations = useMemo(
    () => (isMobile ? ARC_ROTATIONS_FULL.slice(0, 4) : ARC_ROTATIONS_FULL),
    [isMobile],
  )

  const quizIdx = useMemo(() => {
    const idx = signIds.indexOf(quizSignId)
    return idx >= 0 ? idx : 0
  }, [signIds, quizSignId])

  const signRefs = useRef<(THREE.Group | null)[]>(Array(signIds.length).fill(null))
  const frogRef = useRef<THREE.Group>(null)
  const interactiveRef = useRef(false)

  // Animation targets — mutated each frame from scroll progress, consumed below
  const targets = useRef({
    cameraZ: 9,
    cameraY: 1.2,
    signPositions: heroPositions.map((p) => [...p] as [number, number, number]),
    signRotations: heroRotations.map((r) => [...r] as [number, number, number]),
    signScales: Array(signIds.length).fill(1) as number[],
    frogX: -12,
    frogScale: 0,
  })

  // ─── useFrame: update targets from scroll, then lerp everything ─────────────

  useFrame((_, delta) => {
    const p = scrollProgressRef.current?.progress ?? 0
    const t = targets.current
    const signCount = signIds.length
    const LERP = 0.06

    // ── Compute targets from scroll progress ──────────────────────────────────

    if (p < 0.2) {
      // Hero
      t.cameraZ = 9
      t.cameraY = 1.2
      t.signPositions = heroPositions.map((pos) => [...pos] as [number, number, number])
      t.signRotations = heroRotations.map((rot) => [...rot] as [number, number, number])
      t.signScales = Array(signCount).fill(1)
      t.frogX = -12
      t.frogScale = 0
      interactiveRef.current = false
    } else if (p < 0.4) {
      // Transition hero → explore
      const raw = (p - 0.2) / 0.2
      const eased = easeInOut(raw)
      t.cameraZ = lerpN(9, 11, eased)
      t.cameraY = lerpN(1.2, 0, eased)
      t.signPositions = heroPositions.map((h, i) => [
        lerpN(h[0], arcPositions[i][0], eased),
        lerpN(h[1], arcPositions[i][1], eased),
        lerpN(h[2], arcPositions[i][2], eased),
      ] as [number, number, number])
      t.signRotations = heroRotations.map((hr, i) => [
        lerpN(hr[0], arcRotations[i][0], eased),
        lerpN(hr[1], arcRotations[i][1], eased),
        lerpN(hr[2], arcRotations[i][2], eased),
      ] as [number, number, number])
      t.signScales = Array(signCount).fill(1)
      t.frogX = lerpN(-12, -4, Math.min(raw * 2, 1))
      t.frogScale = Math.min(raw * 2, 1)
      interactiveRef.current = false
    } else if (p < 0.7) {
      // Explore
      t.cameraZ = 11
      t.cameraY = 0
      t.signPositions = arcPositions.map((pos) => [...pos] as [number, number, number])
      t.signRotations = arcRotations.map((rot) => [...rot] as [number, number, number])
      t.signScales = Array(signCount).fill(1)
      t.frogX = -4
      t.frogScale = 1
      interactiveRef.current = true
    } else if (p < 0.8) {
      // Transition explore → quiz
      const raw = (p - 0.7) / 0.1
      const eased = easeInOut(raw)
      t.cameraZ = lerpN(11, 7, eased)
      t.cameraY = lerpN(0, 0.5, eased)
      t.signPositions = arcPositions.map((pos, i) =>
        i === quizIdx
          ? ([
              lerpN(pos[0], QUIZ_SIGN_POSITION[0], eased),
              lerpN(pos[1], QUIZ_SIGN_POSITION[1], eased),
              lerpN(pos[2], QUIZ_SIGN_POSITION[2], eased),
            ] as [number, number, number])
          : ([...pos] as [number, number, number]),
      )
      t.signRotations = arcRotations.map((rot, i) =>
        i === quizIdx
          ? ([
              lerpN(rot[0], QUIZ_SIGN_ROTATION[0], eased),
              lerpN(rot[1], QUIZ_SIGN_ROTATION[1], eased),
              lerpN(rot[2], QUIZ_SIGN_ROTATION[2], eased),
            ] as [number, number, number])
          : ([...rot] as [number, number, number]),
      )
      t.signScales = arcPositions.map((_, i) => (i === quizIdx ? 1 : Math.max(1 - eased * 2, 0)))
      t.frogX = lerpN(-4, 2, eased)
      t.frogScale = 1
      interactiveRef.current = false
    } else {
      // Quiz
      t.cameraZ = 7
      t.cameraY = 0.5
      t.signPositions = arcPositions.map((pos, i) =>
        i === quizIdx ? QUIZ_SIGN_POSITION : ([...pos] as [number, number, number]),
      )
      t.signRotations = arcRotations.map((rot, i) =>
        i === quizIdx ? QUIZ_SIGN_ROTATION : ([...rot] as [number, number, number]),
      )
      t.signScales = Array(signCount).fill(0).map((_, i) => (i === quizIdx ? 1 : 0))
      t.frogX = 2
      t.frogScale = 1
      interactiveRef.current = false
    }

    // ── Apply lerped transforms ────────────────────────────────────────────────

    camera.position.z = THREE.MathUtils.lerp(camera.position.z, t.cameraZ, LERP)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, t.cameraY, LERP)

    if (frogRef.current) {
      frogRef.current.position.x = THREE.MathUtils.lerp(frogRef.current.position.x, t.frogX, LERP)
      frogRef.current.scale.setScalar(
        THREE.MathUtils.lerp(frogRef.current.scale.x, t.frogScale, LERP * 1.5),
      )
    }

    signRefs.current.forEach((ref, i) => {
      if (!ref) return
      const [tx, ty, tz] = t.signPositions[i] ?? heroPositions[i]
      const [rx, ry, rz] = t.signRotations[i] ?? heroRotations[i]

      ref.position.x = THREE.MathUtils.lerp(ref.position.x, tx, LERP)
      ref.position.y = THREE.MathUtils.lerp(ref.position.y, ty, LERP)
      ref.position.z = THREE.MathUtils.lerp(ref.position.z, tz, LERP)
      ref.rotation.x = THREE.MathUtils.lerp(ref.rotation.x, rx, LERP)
      ref.rotation.y = THREE.MathUtils.lerp(ref.rotation.y, ry, LERP)
      ref.rotation.z = THREE.MathUtils.lerp(ref.rotation.z, rz, LERP)
      ref.scale.setScalar(THREE.MathUtils.lerp(ref.scale.x, t.signScales[i] ?? 1, LERP))

      // Gentle float in hero phase
      if (p < 0.2) {
        ref.position.y += Math.sin(clock.elapsedTime * 0.7 + i * 0.6) * 0.025
        ref.rotation.z += Math.sin(clock.elapsedTime * 0.5 + i * 0.4) * 0.003
      }
    })
  })

  const handleSignClick = useCallback(
    (id: number) => {
      if (!interactiveRef.current) return
      onSignSelect(id)
    },
    [onSignSelect],
  )

  const handlePointerOver = useCallback(() => {
    if (interactiveRef.current) document.body.style.cursor = 'pointer'
  }, [])

  const handlePointerOut = useCallback(() => {
    document.body.style.cursor = 'auto'
  }, [])

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 8, 6]} intensity={1.4} castShadow={!isMobile} />
      <directionalLight position={[-4, 2, -2]} intensity={0.35} />

      <Suspense fallback={null}>
        {signIds.map((id, i) => (
          <SignMesh
            key={id}
            id={id}
            ref={(el: THREE.Group | null) => {
              signRefs.current[i] = el
            }}
            interactive
            onClick={() => handleSignClick(id)}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
          />
        ))}
        <FrogModel ref={frogRef} />
      </Suspense>
    </>
  )
}

// ─── Canvas wrapper ───────────────────────────────────────────────────────────

type Props = {
  scrollProgressRef: React.RefObject<{ progress: number }>
  onSignSelect: (id: number | null) => void
  quizSignId: number
  phase: Phase
}

export default function LandingCanvas(props: Props) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  return (
    <Canvas
      camera={{ position: [0, 1.2, 9], fov: 58 }}
      shadows={!isMobile}
      style={{ width: '100%', height: '100%' }}
      gl={{ antialias: true }}
    >
      <Scene {...props} isMobile={isMobile} />
    </Canvas>
  )
}
