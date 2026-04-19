'use client'
import { forwardRef, useMemo } from 'react'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

type Props = {
  id: number
  interactive?: boolean
  onClick?: () => void
  onPointerOver?: () => void
  onPointerOut?: () => void
}

// Card proportions: tarot/portrait style, very thin depth
const W = 1.8
const H = 2.5
const D = 0.04

function CardFace({ id }: { id: number }) {
  const texture = useTexture(`/signs/${id}.png`)

  // BoxGeometry face order: +X, -X, +Y, -Y, +Z (front), -Z (back)
  const materials = useMemo<THREE.Material[]>(
    () => [
      new THREE.MeshStandardMaterial({ color: '#C8860A', roughness: 0.5 }), // right edge
      new THREE.MeshStandardMaterial({ color: '#C8860A', roughness: 0.5 }), // left edge
      new THREE.MeshStandardMaterial({ color: '#C8860A', roughness: 0.5 }), // top edge
      new THREE.MeshStandardMaterial({ color: '#C8860A', roughness: 0.5 }), // bottom edge
      new THREE.MeshStandardMaterial({ map: texture }),                       // front face
      new THREE.MeshStandardMaterial({ color: '#FFF8E7', roughness: 0.8 }), // card back
    ],
    [texture],
  )

  return (
    <mesh material={materials} castShadow receiveShadow>
      <boxGeometry args={[W, H, D]} />
    </mesh>
  )
}

const SignMesh = forwardRef<THREE.Group, Props>(
  ({ id, interactive, onClick, onPointerOver, onPointerOut }, ref) => {
    return (
      <group ref={ref}>
        <CardFace id={id} />
        {/* Invisible hit area slightly larger than card */}
        {interactive && (
          <mesh onClick={onClick} onPointerOver={onPointerOver} onPointerOut={onPointerOut}>
            <boxGeometry args={[W + 0.3, H + 0.3, D + 0.4]} />
            <meshBasicMaterial transparent opacity={0} />
          </mesh>
        )}
      </group>
    )
  },
)
SignMesh.displayName = 'SignMesh'
export default SignMesh
