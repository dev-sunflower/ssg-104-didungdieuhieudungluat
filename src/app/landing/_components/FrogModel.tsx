'use client'
import { forwardRef, useRef, useEffect } from 'react'
import { useLoader, useFrame } from '@react-three/fiber'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js'
import * as THREE from 'three'

const FrogModel = forwardRef<THREE.Group>((_, forwardedRef) => {
  const groupRef = useRef<THREE.Group>(null)

  // Sync internal ref to forwarded ref so parent can control position/scale
  useEffect(() => {
    if (!forwardedRef) return
    if (typeof forwardedRef === 'function') {
      forwardedRef(groupRef.current)
    } else {
      ;(forwardedRef as React.MutableRefObject<THREE.Group | null>).current = groupRef.current
    }
  }, [forwardedRef])

  const materials = useLoader(MTLLoader, '/3dassets/FROG_NO_VEST/FROG.mtl')
  const obj = useLoader(OBJLoader, '/3dassets/FROG_NO_VEST/FROG.obj', (loader) => {
    materials.preload()
    loader.setMaterials(materials)
  })

  useEffect(() => {
    obj.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true
      }
    })
  }, [obj])

  useFrame(({ clock }) => {
    if (!groupRef.current || groupRef.current.scale.x < 0.05) return
    // Gentle idle bob
    groupRef.current.position.y = Math.sin(clock.elapsedTime * 1.5) * 0.05
  })

  return (
    <group ref={groupRef} position={[-10, 0, 0]} scale={[0, 0, 0]}>
      <primitive object={obj} />
    </group>
  )
})
FrogModel.displayName = 'FrogModel'
export default FrogModel
