"use client";
import { forwardRef, useRef, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const GLB_PATH = "/3dassets/FROG_GLB/FROG.glb";
const FROG_SCALE = 3; // scale to match original display size

const FrogModel = forwardRef<THREE.Group>((_, forwardedRef) => {
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!forwardedRef) return;
    if (typeof forwardedRef === "function") {
      forwardedRef(groupRef.current);
    } else {
      (forwardedRef as React.RefObject<THREE.Group | null>).current =
        groupRef.current;
    }
  }, [forwardedRef]);

  const { scene } = useGLTF(GLB_PATH);

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
      }
    });
  }, [scene]);

  useFrame(({ clock }) => {
    if (!groupRef.current || groupRef.current.scale.x < 0.05) return;
    groupRef.current.position.y = Math.sin(clock.elapsedTime * 1.4) * 0.3;
  });

  return (
    <group
      rotation={[0, 4.5, 0]}
      ref={groupRef}
      position={[0, 0, 0]}
      scale={[0, 0, 0]}
    >
      <primitive object={scene} scale={[FROG_SCALE, FROG_SCALE, FROG_SCALE]} />
    </group>
  );
});
FrogModel.displayName = "FrogModel";

// Preload the GLB for faster first render
useGLTF.preload(GLB_PATH);

export default FrogModel;
