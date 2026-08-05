import React, { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Preload } from "@react-three/drei";
import * as THREE from "three";

/* Builds the black/gold diagonal-stripe texture for the clapper top,
   entirely in-code with a 2D canvas — no image files needed. */
function useStripeTexture() {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#0D0C0A";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#F3EFE6";
    const stripeWidth = 46;
    for (let x = -canvas.height; x < canvas.width + canvas.height; x += stripeWidth * 2) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + canvas.height, canvas.height);
      ctx.lineTo(x + canvas.height + stripeWidth, canvas.height);
      ctx.lineTo(x + stripeWidth, 0);
      ctx.closePath();
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);
}

const Slate = () => {
  const clapRef = useRef();
  const groupRef = useRef();
  const stripeTexture = useStripeTexture();

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = -0.12 + Math.sin(clock.getElapsedTime() * 0.3) * 0.03;
    }

    const t = clock.getElapsedTime() % 3.6;
    let angle;
    if (t < 1.5) {
      angle = 0.62;
    } else if (t < 1.65) {
      angle = THREE.MathUtils.lerp(0.62, 0, (t - 1.5) / 0.15);
    } else if (t < 3.2) {
      angle = 0;
    } else {
      angle = THREE.MathUtils.lerp(0, 0.62, (t - 3.2) / 0.4);
    }
    if (clapRef.current) clapRef.current.rotation.z = angle;
  });

  return (
    <group ref={groupRef} rotation={[0.08, -0.12, 0]} position={[0, -0.2, 0]}>
      {/* base board */}
      <mesh position={[0, -0.6, 0]}>
        <boxGeometry args={[3.2, 2, 0.15]} />
        <meshStandardMaterial color="#1C1A14" roughness={0.7} metalness={0.1} />
      </mesh>

      {/* gold trim edge on the base board */}
      <mesh position={[0, -0.6, 0.076]}>
        <ringGeometry args={[0, 0.02, 4]} />
        <meshBasicMaterial visible={false} />
      </mesh>
      <lineSegments position={[0, -0.6, 0.076]}>
        <edgesGeometry args={[new THREE.BoxGeometry(3.2, 2, 0.001)]} />
        <lineBasicMaterial color="#C89B3C" linewidth={2} />
      </lineSegments>

      {/* hinged clapper top — pivot at top-LEFT corner, matching a real
          clapperboard's hinge pin. Swings up-and-right around the pin. */}
      <group ref={clapRef} position={[-1.6, 0.4, 0.02]}>
        <mesh position={[1.6, 0, 0]}>
          <boxGeometry args={[3.2, 0.55, 0.15]} />
          <meshStandardMaterial map={stripeTexture} roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
};

const ClapperCanvas = () => {
  return (
    <Canvas
      frameloop="always"
      dpr={[1, 1]}
      camera={{ position: [0.4, 0.4, 9.5], fov: 26 }}
      gl={{ powerPreference: "high-performance", antialias: true }}
    >
      <Suspense fallback={null}>
        <hemisphereLight intensity={0.4} groundColor="black" />
        <directionalLight position={[-5, 8, 5]} intensity={1.1} />
        <pointLight intensity={0.5} position={[3, 2, 3]} color="#C89B3C" />

        <Slate />
      </Suspense>
      <Preload all />
    </Canvas>
  );
};

export default ClapperCanvas;
