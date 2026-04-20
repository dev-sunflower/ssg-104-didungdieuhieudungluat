"use client";
import { forwardRef, useRef } from "react";
import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Props = {
  id: number;
  signIdx: number;
  hoveredIdxRef: React.RefObject<number | null>;
  interactive?: boolean;
  onClick?: () => void;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
};

// ─── Knobs bạn có thể tự chỉnh ────────────────────────────────────────────────
const SIGN_SIZE = 1.2; // kích thước mỗi biển (width = height)
const ALPHA_TEST = 0.1; // ngưỡng cắt nền PNG (0 = giữ tất cả)
const GLOW_INTENSITY = 18; // cường độ point light khi hover (tăng = sáng hơn)
const GLOW_DISTANCE = 5; // bán kính ánh sáng lan ra (Three units)
const GLOW_SPEED = 0.05; // tốc độ fade in/out (0.05 = chậm, 0.2 = nhanh)
// ──────────────────────────────────────────────────────────────────────────────

function SignFace({ id }: { id: number }) {
  const texture = useTexture(`/signs/${id}.png`);
  return (
    <mesh castShadow>
      <planeGeometry args={[SIGN_SIZE, SIGN_SIZE]} />
      <meshStandardMaterial
        map={texture}
        transparent
        alphaTest={ALPHA_TEST}
        depthWrite={false}
        roughness={0.3}
        metalness={0.05}
        envMapIntensity={0.6}
      />
    </mesh>
  );
}

const SignMesh = forwardRef<THREE.Group, Props>(
  (
    {
      id,
      signIdx,
      hoveredIdxRef,
      interactive,
      onClick,
      onPointerOver,
      onPointerOut,
    },
    ref,
  ) => {
    const lightRef = useRef<THREE.PointLight>(null);

    useFrame(() => {
      if (!lightRef.current) return;
      const isHovered = hoveredIdxRef.current === signIdx;
      lightRef.current.intensity = THREE.MathUtils.lerp(
        lightRef.current.intensity,
        isHovered ? GLOW_INTENSITY : 0,
        GLOW_SPEED,
      );
    });

    return (
      <group ref={ref}>
        {/* Point light sits slightly in front — illuminates THIS sign only, no geometry overlap */}
        <pointLight
          ref={lightRef}
          position={[0, 0, 1.2]}
          color="#F4A616"
          intensity={0}
          distance={GLOW_DISTANCE}
          decay={2}
        />

        <SignFace id={id} />

        {/* Hit area vô hình để nhận click/hover */}
        {interactive && (
          <mesh
            onClick={onClick}
            onPointerOver={onPointerOver}
            onPointerOut={onPointerOut}
          >
            <planeGeometry args={[SIGN_SIZE + 0.3, SIGN_SIZE + 0.3]} />
            <meshBasicMaterial transparent opacity={0} />
          </mesh>
        )}
      </group>
    );
  },
);
SignMesh.displayName = "SignMesh";
export default SignMesh;
