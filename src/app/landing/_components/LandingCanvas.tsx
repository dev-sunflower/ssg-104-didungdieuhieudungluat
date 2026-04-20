"use client";
import { useRef, Suspense, useCallback, useMemo, memo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";
import SignMesh from "./SignMesh";
import FrogModel from "./FrogModel";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Phase = "hero" | "explore" | "quiz";

// ─── Sign IDs ─────────────────────────────────────────────────────────────────

const SIGN_IDS_FULL = [1, 2, 3, 4, 5, 6, 7, 8];
const SIGN_IDS_MOBILE = [1, 2, 3, 4];

// ─── Tarot fan spread — hero phase ────────────────────────────────────────────
// Tăng X_SPREAD → biển cách nhau nhiều hơn theo chiều ngang
// Tăng Y_ARC    → vòng cung cao hơn (biển giữa cao hơn biển 2 bên)
// Tăng Z_DEPTH  → biển 2 bên lùi sâu hơn (tạo chiều sâu 3D)
const X_SPREAD = 6; // x của biển ngoài cùng (cũ: 3.8)
const Y_ARC = 2; // độ cao đỉnh vòng cung (cũ: 2.3)
const Z_DEPTH = 2.8; // độ sâu biển ngoài cùng (cũ: 2.0)

const FROG_POSITION_X_EXPLORE_SECTION = -6;

// 8 signs evenly distributed across the fan arc
const HERO_POSITIONS_FULL: [number, number, number][] = Array.from(
  { length: 8 },
  (_, i) => {
    const t = i / 7; // 0 → 1
    const angle = (t - 0.5) * Math.PI * 0.72; // ±64.8° total spread
    const x = Math.sin(angle) * X_SPREAD;
    const y = Math.cos(angle) * Y_ARC - Y_ARC * 0.05; // slight arc droop
    const z = -Math.abs(Math.sin(angle)) * Z_DEPTH; // depth at edges
    return [x, y, z] as [number, number, number];
  },
);

// Each sign fans outward matching its x position
const HERO_ROTATIONS_FULL: [number, number, number][] = Array.from(
  { length: 8 },
  (_, i) => {
    const t = i / 7;
    const angle = (t - 0.5) * Math.PI * 0.72;
    const rotZ = Math.sin(angle) * 0.32; // tilt outward
    const rotY = Math.sin(angle) * 0.38; // face outward slightly
    return [0.02, rotY, rotZ] as [number, number, number];
  },
);

// ─── Arc positions — explore phase ────────────────────────────────────────────

const ARC_POSITIONS_FULL: [number, number, number][] = Array.from(
  { length: 8 },
  (_, i) => {
    const t = i / 7;
    const angle = (t - 0.5) * Math.PI * 0.9;
    return [Math.sin(angle) * 9, 0, Math.cos(angle) * -2 - 2] as [
      number,
      number,
      number,
    ];
  },
);

// Each card in the arc faces toward the camera (roughly rotation.y = -arc angle)
const ARC_ROTATIONS_FULL: [number, number, number][] = ARC_POSITIONS_FULL.map(
  ([x, , z]) => {
    const angle = Math.atan2(x, 10 - z);
    return [0, -angle, 0] as [number, number, number];
  },
);

const QUIZ_SIGN_POSITION: [number, number, number] = [-2.75, 0, 2];
const QUIZ_SIGN_ROTATION: [number, number, number] = [0, 0, 0];

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}
function lerpN(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

// ─── Inner Scene ──────────────────────────────────────────────────────────────

type SceneProps = {
  scrollProgressRef: React.RefObject<{ progress: number }>;
  onSignSelect: (id: number | null) => void;
  isMobile: boolean;
  quizSignId: number;
};

function Scene({
  scrollProgressRef,
  onSignSelect,
  isMobile,
  quizSignId,
}: SceneProps) {
  const { camera, clock } = useThree();

  const signIds = isMobile ? SIGN_IDS_MOBILE : SIGN_IDS_FULL;
  const heroPositions = useMemo(
    () => (isMobile ? HERO_POSITIONS_FULL.slice(0, 4) : HERO_POSITIONS_FULL),
    [isMobile],
  );
  const heroRotations = useMemo(
    () => (isMobile ? HERO_ROTATIONS_FULL.slice(0, 4) : HERO_ROTATIONS_FULL),
    [isMobile],
  );
  const arcPositions = useMemo(
    () => (isMobile ? ARC_POSITIONS_FULL.slice(0, 4) : ARC_POSITIONS_FULL),
    [isMobile],
  );
  const arcRotations = useMemo(
    () => (isMobile ? ARC_ROTATIONS_FULL.slice(0, 4) : ARC_ROTATIONS_FULL),
    [isMobile],
  );

  const quizIdx = useMemo(() => {
    const idx = signIds.indexOf(quizSignId);
    return idx >= 0 ? idx : 0;
  }, [signIds, quizSignId]);

  const signRefs = useRef<(THREE.Group | null)[]>(
    Array(signIds.length).fill(null),
  );
  const frogRef = useRef<THREE.Group>(null);
  const interactiveRef = useRef(false);
  const hoveredIdx = useRef<number | null>(null);

  // Per-sign stable random scatter offset around the mouse target
  const mouseRandomFactors = useMemo(
    () =>
      signIds.map(() => ({
        x: (Math.random() - 0.5) * 5, // ±2.5 world units scatter
        y: (Math.random() - 0.5) * 3, // ±1.5 world units scatter
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [signIds.length],
  );

  // Mouse tracking for hero parallax
  const mouseRef = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX - window.innerWidth / 2;
      mouseRef.current.y = e.clientY - window.innerHeight / 2;
    };
    const onLeave = () => {
      mouseRef.current = { x: 0, y: 0 };
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // Animation targets — mutated each frame from scroll progress, consumed below
  const targets = useRef({
    cameraZ: 9,
    cameraY: 1.2,
    signPositions: heroPositions.map((p) => [...p] as [number, number, number]),
    signRotations: heroRotations.map((r) => [...r] as [number, number, number]),
    signScales: Array(signIds.length).fill(1) as number[],
    frogX: 0,
    frogY: 0,
    frogScale: 0.5,
  });

  // ─── useFrame: update targets from scroll, then lerp everything ─────────────

  useFrame((_, delta) => {
    const p = scrollProgressRef.current?.progress ?? 0;
    const t = targets.current;
    const signCount = signIds.length;
    const LERP = 0.06;

    // ── Compute targets from scroll progress ──────────────────────────────────

    if (p < 0.2) {
      // Hero
      t.cameraZ = 9;
      t.cameraY = 1.2;

      const { x: mx, y: my } = mouseRef.current;
      const mdist = Math.sqrt(mx * mx + my * my);
      const DEAD_ZONE = 200;

      if (mdist > DEAD_ZONE) {
        // Unproject mouse to 3D world coords at z=0
        const cam = camera as THREE.PerspectiveCamera;
        const halfH = Math.tan((cam.fov * Math.PI) / 180 / 2) * cam.position.z;
        const halfW = halfH * (window.innerWidth / window.innerHeight);
        const mouseWorldX = (mx / (window.innerWidth / 2)) * halfW;
        const mouseWorldY =
          -(my / (window.innerHeight / 2)) * halfH + cam.position.y;
        const blend = Math.min((mdist - DEAD_ZONE) / 300, 1);

        t.signPositions = heroPositions.map(
          (pos, i) =>
            [
              lerpN(pos[0], mouseWorldX + mouseRandomFactors[i].x, blend),
              lerpN(pos[1], mouseWorldY + mouseRandomFactors[i].y, blend),
              pos[2],
            ] as [number, number, number],
        );
      } else {
        t.signPositions = heroPositions.map(
          (pos) => [...pos] as [number, number, number],
        );
      }
      t.signRotations = heroRotations.map(
        (rot) => [...rot] as [number, number, number],
      );
      t.signScales = Array(signCount).fill(1);
      t.frogX = 0;
      t.frogY = 0;
      t.frogScale = 0.5;
      interactiveRef.current = false;
    } else if (p < 0.4) {
      // Transition hero → explore
      const raw = (p - 0.2) / 0.2;
      const eased = easeInOut(raw);
      t.cameraZ = lerpN(9, 11, eased);
      t.cameraY = lerpN(1.2, 0, eased);
      t.signPositions = heroPositions.map(
        (h, i) =>
          [
            lerpN(h[0], arcPositions[i][0], eased),
            lerpN(h[1], arcPositions[i][1], eased),
            lerpN(h[2], arcPositions[i][2], eased),
          ] as [number, number, number],
      );
      t.signRotations = heroRotations.map(
        (hr, i) =>
          [
            lerpN(hr[0], arcRotations[i][0], eased),
            lerpN(hr[1], arcRotations[i][1], eased),
            lerpN(hr[2], arcRotations[i][2], eased),
          ] as [number, number, number],
      );
      t.signScales = Array(signCount).fill(1);
      t.frogX = lerpN(0, FROG_POSITION_X_EXPLORE_SECTION, eased);
      t.frogY = lerpN(0, -1, eased); // Move frog down
      t.frogScale = lerpN(0.5, 0.5, eased);
      interactiveRef.current = false;
    } else if (p < 0.7) {
      // Explore
      t.cameraZ = 7;
      t.cameraY = 1;
      t.signPositions = arcPositions.map(
        (pos) => [...pos] as [number, number, number],
      );
      t.signRotations = arcRotations.map(
        (rot) => [...rot] as [number, number, number],
      );
      t.signScales = Array(signCount).fill(1);
      t.frogX = FROG_POSITION_X_EXPLORE_SECTION;
      t.frogY = -1; // Move frog lower
      t.frogScale = 0.5;

      interactiveRef.current = true;
    } else if (p < 0.8) {
      // Transition explore → quiz
      const raw = (p - 0.7) / 0.1;
      const eased = easeInOut(raw);
      t.cameraZ = lerpN(11, 7, eased);
      t.cameraY = lerpN(0, 0.5, eased);
      t.signPositions = arcPositions.map((pos, i) =>
        i === quizIdx
          ? ([
              lerpN(pos[0], QUIZ_SIGN_POSITION[0], eased),
              lerpN(pos[1], QUIZ_SIGN_POSITION[1], eased),
              lerpN(pos[2], QUIZ_SIGN_POSITION[2], eased),
            ] as [number, number, number])
          : ([...pos] as [number, number, number]),
      );
      t.signRotations = arcRotations.map((rot, i) =>
        i === quizIdx
          ? ([
              lerpN(rot[0], QUIZ_SIGN_ROTATION[0], eased),
              lerpN(rot[1], QUIZ_SIGN_ROTATION[1], eased),
              lerpN(rot[2], QUIZ_SIGN_ROTATION[2], eased),
            ] as [number, number, number])
          : ([...rot] as [number, number, number]),
      );
      t.signScales = arcPositions.map((_, i) =>
        i === quizIdx ? 1 : Math.max(1 - eased * 2, 0),
      );
      t.frogX = lerpN(-4, 2, eased);
      t.frogY = lerpN(-1, 0, eased);
      t.frogScale = 1;

      interactiveRef.current = false;
    } else {
      // Quiz
      t.cameraZ = 6;
      t.cameraY = 0.5;
      t.signPositions = arcPositions.map((pos, i) =>
        i === quizIdx
          ? QUIZ_SIGN_POSITION
          : ([...pos] as [number, number, number]),
      );
      t.signRotations = arcRotations.map((rot, i) =>
        i === quizIdx
          ? QUIZ_SIGN_ROTATION
          : ([...rot] as [number, number, number]),
      );
      t.signScales = Array(signCount)
        .fill(0)
        .map((_, i) => (i === quizIdx ? 1 : 0));
      t.frogX = 2;
      t.frogY = 0;
      t.frogScale = 1;

      interactiveRef.current = false;
    }

    // ── Apply lerped transforms ────────────────────────────────────────────────

    camera.position.z = THREE.MathUtils.lerp(
      camera.position.z,
      t.cameraZ,
      LERP,
    );
    camera.position.y = THREE.MathUtils.lerp(
      camera.position.y,
      t.cameraY,
      LERP,
    );

    if (frogRef.current) {
      frogRef.current.position.x = THREE.MathUtils.lerp(
        frogRef.current.position.x,
        t.frogX,
        LERP,
      );
      frogRef.current.position.y = THREE.MathUtils.lerp(
        frogRef.current.position.y,
        t.frogY,
        LERP,
      );
      frogRef.current.scale.setScalar(
        THREE.MathUtils.lerp(frogRef.current.scale.x, t.frogScale, LERP * 1.5),
      );
    }

    signRefs.current.forEach((ref, i) => {
      if (!ref) return;
      const [tx, ty, tz] = t.signPositions[i] ?? heroPositions[i];
      const [rx, ry, rz] = t.signRotations[i] ?? heroRotations[i];

      ref.position.x = THREE.MathUtils.lerp(ref.position.x, tx, LERP);
      ref.position.y = THREE.MathUtils.lerp(ref.position.y, ty, LERP);
      ref.position.z = THREE.MathUtils.lerp(ref.position.z, tz, LERP);
      ref.rotation.x = THREE.MathUtils.lerp(ref.rotation.x, rx, LERP);
      ref.rotation.y = THREE.MathUtils.lerp(ref.rotation.y, ry, LERP);
      ref.rotation.z = THREE.MathUtils.lerp(ref.rotation.z, rz, LERP);
      const baseScale = t.signScales[i] ?? 1;
      const hoverScale =
        baseScale > 0.01 && hoveredIdx.current === i
          ? baseScale * 1.12
          : baseScale;
      ref.scale.setScalar(THREE.MathUtils.lerp(ref.scale.x, hoverScale, LERP));

      // Gentle float in hero phase
      if (p < 0.2) {
        ref.position.y += Math.sin(clock.elapsedTime * 0.7 + i * 0.6) * 0.025;
        ref.rotation.z += Math.sin(clock.elapsedTime * 0.5 + i * 0.4) * 0.003;
      }
    });
  });

  const handleSignClick = useCallback(
    (id: number) => {
      if (!interactiveRef.current) return;
      onSignSelect(id);
    },
    [onSignSelect],
  );

  const handlePointerOver = useCallback((idx: number) => {
    hoveredIdx.current = idx;
    if (interactiveRef.current) document.body.style.cursor = "pointer";
  }, []);

  const handlePointerOut = useCallback(() => {
    hoveredIdx.current = null;
    document.body.style.cursor = "auto";
  }, []);

  // Animated point lights refs
  const warmLightRef = useRef<THREE.PointLight>(null);
  const coolLightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (warmLightRef.current) {
      warmLightRef.current.position.x = Math.sin(t * 0.4) * 7;
      warmLightRef.current.position.z = Math.cos(t * 0.4) * 4 + 2;
    }
    if (coolLightRef.current) {
      coolLightRef.current.position.x = Math.sin(t * 0.4 + Math.PI) * 7;
      coolLightRef.current.position.z = Math.cos(t * 0.4 + Math.PI) * 4 + 2;
    }
  });

  return (
    <>
      {/* IBL — environment map for subtle reflections on materials */}
      <Environment preset="sunset" />

      {/* Low ambient so shadows stay dramatic */}
      <ambientLight intensity={0.18} />

      {/* Key light — warm white from above, casts shadows */}
      <directionalLight
        position={[5, 10, 6]}
        intensity={2.2}
        color="#ffe8c0"
        castShadow={!isMobile}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Rim light — cool blue from behind-left for depth separation */}
      <directionalLight
        position={[-6, 3, -8]}
        intensity={0.9}
        color="#6090ff"
      />

      {/* Animated warm point light — orbits the sign spread */}
      <pointLight
        ref={warmLightRef}
        position={[7, 3, 2]}
        intensity={40}
        distance={18}
        color="#ff9040"
      />

      {/* Animated cool point light — orbits opposite side */}
      <pointLight
        ref={coolLightRef}
        position={[-7, 1, 2]}
        intensity={30}
        distance={18}
        color="#4070ff"
      />

      <Suspense fallback={null}>
        {signIds.map((id, i) => (
          <SignMesh
            key={id}
            id={id}
            signIdx={i}
            hoveredIdxRef={hoveredIdx}
            ref={(el: THREE.Group | null) => {
              signRefs.current[i] = el;
            }}
            interactive
            onClick={() => handleSignClick(id)}
            onPointerOver={() => handlePointerOver(i)}
            onPointerOut={handlePointerOut}
          />
        ))}
        <FrogModel ref={frogRef} />
      </Suspense>
    </>
  );
}

// ─── Canvas wrapper ───────────────────────────────────────────────────────────

type Props = {
  scrollProgressRef: React.RefObject<{ progress: number }>;
  onSignSelect: (id: number | null) => void;
  quizSignId: number;
};

const CAMERA_CONFIG = {
  position: [0, 1.2, 9] as [number, number, number],
  fov: 58,
};
const GL_CONFIG = { antialias: true };
const CANVAS_STYLE = { width: "100%", height: "100%" };
const IS_MOBILE = typeof window !== "undefined" && window.innerWidth < 768;

export default memo(function LandingCanvas(props: Props) {
  return (
    <Canvas
      camera={CAMERA_CONFIG}
      shadows={!IS_MOBILE}
      style={CANVAS_STYLE}
      gl={GL_CONFIG}
    >
      <Scene {...props} isMobile={IS_MOBILE} />
    </Canvas>
  );
});
