"use client";
import { forwardRef, useRef, useEffect } from "react";
import { useLoader, useFrame } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import * as THREE from "three";

const FROG_SCALE = 3; // model is ~0.5 units, scale up to ~3 units tall

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

  const materials = useLoader(
    MTLLoader,
    "/3dassets/FROG_NO_VEST/FROG.mtl",
    (loader) => {
      loader.setResourcePath("/3dassets/FROG_NO_VEST/");
    },
  );

  const obj = useLoader(
    OBJLoader,
    "/3dassets/FROG_NO_VEST/FROG.obj",
    (loader) => {
      materials.preload();
      loader.setMaterials(materials);
    },
  );

  useEffect(() => {
    obj.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
      }
    });
  }, [obj]);

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
      <primitive object={obj} scale={[FROG_SCALE, FROG_SCALE, FROG_SCALE]} />
    </group>
  );
});
FrogModel.displayName = "FrogModel";
export default FrogModel;
