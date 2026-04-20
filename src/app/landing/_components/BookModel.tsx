"use client";
import { forwardRef, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const COVER   = "#6B1C1C"; // dark burgundy
const SPINE   = "#4A1010"; // deeper maroon for spine
const GOLD    = "#D4A017"; // antique gold accents
const PAGES   = "#F2E6C9"; // aged cream

const BookModel = forwardRef<THREE.Group>((_, forwardedRef) => {
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!forwardedRef) return;
    if (typeof forwardedRef === "function") forwardedRef(groupRef.current);
    else (forwardedRef as React.RefObject<THREE.Group | null>).current = groupRef.current;
  }, [forwardedRef]);

  useFrame(({ clock }) => {
    if (!groupRef.current || groupRef.current.scale.x < 0.05) return;
    const t = clock.elapsedTime;
    groupRef.current.position.y = Math.sin(t * 0.7) * 0.15;
    groupRef.current.rotation.y = Math.sin(t * 0.35) * 0.18 + 0.2;
  });

  return (
    <group ref={groupRef} position={[0, 0.3, 1]} scale={[0, 0, 0]} rotation={[0.06, 0, 0]}>
      {/* ── Main cover ── */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.9, 2.7, 0.44]} />
        <meshStandardMaterial color={COVER} roughness={0.65} metalness={0.12} />
      </mesh>

      {/* ── Pages block (cream, slightly inset from spine side) ── */}
      <mesh position={[0.08, 0, 0.005]}>
        <boxGeometry args={[1.7, 2.58, 0.37]} />
        <meshStandardMaterial color={PAGES} roughness={0.95} metalness={0} />
      </mesh>

      {/* ── Spine cap ── */}
      <mesh position={[-0.915, 0, 0]}>
        <boxGeometry args={[0.075, 2.7, 0.44]} />
        <meshStandardMaterial color={SPINE} roughness={0.5} metalness={0.1} />
      </mesh>

      {/* ── Gold spine bands ── */}
      {[-1.2, -0.9, 0.9, 1.2].map((yOff, i) => (
        <mesh key={i} position={[-0.915, yOff, 0]}>
          <boxGeometry args={[0.078, 0.045, 0.445]} />
          <meshStandardMaterial color={GOLD} metalness={0.85} roughness={0.15} />
        </mesh>
      ))}

      {/* ── Front cover border (gold frame) ── */}
      {/* top */}
      <mesh position={[0.13, 1.22, 0.225]}>
        <boxGeometry args={[1.38, 0.045, 0.01]} />
        <meshStandardMaterial color={GOLD} metalness={0.75} roughness={0.25} />
      </mesh>
      {/* bottom */}
      <mesh position={[0.13, -1.22, 0.225]}>
        <boxGeometry args={[1.38, 0.045, 0.01]} />
        <meshStandardMaterial color={GOLD} metalness={0.75} roughness={0.25} />
      </mesh>
      {/* left */}
      <mesh position={[-0.505, 0, 0.225]}>
        <boxGeometry args={[0.045, 2.44, 0.01]} />
        <meshStandardMaterial color={GOLD} metalness={0.75} roughness={0.25} />
      </mesh>
      {/* right */}
      <mesh position={[0.765, 0, 0.225]}>
        <boxGeometry args={[0.045, 2.44, 0.01]} />
        <meshStandardMaterial color={GOLD} metalness={0.75} roughness={0.25} />
      </mesh>

      {/* ── Center emblem (gold circle) ── */}
      <mesh position={[0.13, 0.25, 0.226]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.32, 0.32, 0.01, 48]} />
        <meshStandardMaterial color={GOLD} metalness={0.85} roughness={0.2} />
      </mesh>
      {/* inner circle */}
      <mesh position={[0.13, 0.25, 0.228]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.01, 48]} />
        <meshStandardMaterial color={COVER} metalness={0.3} roughness={0.6} />
      </mesh>

      {/* ── Title bar (gold strip below top frame) ── */}
      <mesh position={[0.13, 0.95, 0.225]}>
        <boxGeometry args={[1.29, 0.28, 0.008]} />
        <meshStandardMaterial color={GOLD} metalness={0.6} roughness={0.4} />
      </mesh>
    </group>
  );
});

BookModel.displayName = "BookModel";
export default BookModel;
