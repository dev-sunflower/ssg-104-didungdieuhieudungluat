"use client";
import { forwardRef, useRef, useEffect, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const GLB_PATH = "/3dassets/FROG_GLB/FROG.glb";
const FROG_SCALE = 3;

type Props = {
  interactive?: boolean;
  onClick?: () => void;
};

const FrogModel = forwardRef<THREE.Group, Props>(({ interactive = false, onClick }, forwardedRef) => {
  const groupRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Group>(null);
  
  const [hovered, setHovered] = useState(false);
  const isDragging = useRef(false);
  const previousMouse = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 });
  const targetZoom = useRef(1);

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
  const { gl } = useThree();

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
      }
    });
  }, [scene]);

  useEffect(() => {
    if (!interactive) return;

    const canvas = gl.domElement;

    const handleWheel = (e: WheelEvent) => {
      if (!hovered) return;
      e.preventDefault(); // Stop page scroll while zooming frog
      targetZoom.current = Math.max(0.5, Math.min(2.5, targetZoom.current - e.deltaY * 0.001));
    };

    const handlePointerMoveGlobal = (e: PointerEvent) => {
      if (isDragging.current) {
        const deltaX = e.clientX - previousMouse.current.x;
        const deltaY = e.clientY - previousMouse.current.y;
        targetRotation.current.x += deltaX * 0.01;
        targetRotation.current.y += deltaY * 0.01;
        
        // Clamp vertical rotation
        targetRotation.current.y = Math.max(-Math.PI/4, Math.min(Math.PI/4, targetRotation.current.y));
        
        previousMouse.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handlePointerUpGlobal = () => {
      isDragging.current = false;
    };

    canvas.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("pointermove", handlePointerMoveGlobal);
    window.addEventListener("pointerup", handlePointerUpGlobal);

    return () => {
      canvas.removeEventListener("wheel", handleWheel);
      window.removeEventListener("pointermove", handlePointerMoveGlobal);
      window.removeEventListener("pointerup", handlePointerUpGlobal);
    };
  }, [interactive, hovered, gl]);

  useFrame((_, delta) => {
    if (!innerRef.current) return;
    
    if (interactive) {
      // Lerp to target local zoom and rotation
      innerRef.current.scale.setScalar(
        THREE.MathUtils.lerp(innerRef.current.scale.x, targetZoom.current * FROG_SCALE, 0.1)
      );
      innerRef.current.rotation.y = THREE.MathUtils.lerp(
        innerRef.current.rotation.y,
        targetRotation.current.x,
        0.1
      );
      innerRef.current.rotation.x = THREE.MathUtils.lerp(
        innerRef.current.rotation.x,
        targetRotation.current.y,
        0.1
      );
    } else {
      // Reset smoothly when not interactive
      innerRef.current.scale.setScalar(
        THREE.MathUtils.lerp(innerRef.current.scale.x, FROG_SCALE, 0.1)
      );
      innerRef.current.rotation.y = THREE.MathUtils.lerp(innerRef.current.rotation.y, 0, 0.1);
      innerRef.current.rotation.x = THREE.MathUtils.lerp(innerRef.current.rotation.x, 0, 0.1);
    }
  });

  const handlePointerDown = (e: any) => {
    if (!interactive) return;
    e.stopPropagation();
    isDragging.current = true;
    previousMouse.current = { x: e.clientX, y: e.clientY };
  };

  return (
    <group 
      ref={groupRef} 
      position={[0, 0, 0]} 
      scale={[0, 0, 0]}
      rotation={[0, 0, 0]}
    >
      <group 
        ref={innerRef}
        scale={[FROG_SCALE, FROG_SCALE, FROG_SCALE]}
        onPointerDown={handlePointerDown}
        onPointerOut={() => setHovered(false)}
        onPointerOver={(e) => {
          if (interactive) {
            e.stopPropagation();
            setHovered(true);
          }
        }}
        onClick={(e) => {
          if (onClick && interactive && !isDragging.current) {
            e.stopPropagation();
            onClick();
          }
        }}
      >
        <primitive object={scene} />
      </group>
    </group>
  );
});
FrogModel.displayName = "FrogModel";

useGLTF.preload(GLB_PATH);

export default FrogModel;
