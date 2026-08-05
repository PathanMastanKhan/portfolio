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
    // Gentle constant tilt on the whole slate so it reads as a 3D object,
    // no spinning — the motion should come from the clapper arm only.
    if (groupRef.current) {
      groupRef.current.rotation.y = -0.12 + Math.sin(clock.getElapsedTime() * 0.3) * 0.03;
    }

    const t = clock.getElapsedTime() % 3.6; // 3.6-second loop
    let angle;
    if (t < 1.5) {
      angle = 1.0; // held open — wide, unmistakable gap (~57°)
    } else if (t < 1.65) {
      angle = THREE.MathUtils.lerp(1.0, 0, (t - 1.5) / 0.15); // sharp clap shut
    } else if (t < 3.2) {
      angle = 0; // held closed — flush against the base
    } else {
      angle = THREE.MathUtils.lerp(0, 1.0, (t - 3.2) / 0.4); // lift back open
    }
    if (clapRef.current) clapRef.current.rotation.x = angle;
  });

  return (
    <group ref={groupRef} rotation={[0.08, -0.12, 0]} position={[0, -0.2, 0]}>
      {/* base board */}
      <mesh position={[0, -0.6, 0]} castShadow receiveShadow>
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

      {/* hinged clapper top — the hinge GROUP sits exactly at the arm's
          back-top edge (not its middle), so the whole bar swings as one
          rigid door: lifts UP and back to open, slaps DOWN and flush to
          close — instead of wobbling toward/away from camera. */}
      <group ref={clapRef} position={[0, 0.42, 0.02]}>
        <mesh position={[0, -0.28, 0]} castShadow>
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
      shadows
      dpr={[1, 2]}
      camera={{ position: [0.4, 0.4, 9.5], fov: 26 }}
      gl={{ preserveDrawingBuffer: true }}
    >
      <Suspense fallback={null}>
        <hemisphereLight intensity={0.35} groundColor="black" />
        <spotLight
          position={[-5, 8, 5]}
          angle={0.3}
          penumbra={1}
          intensity={1.4}
          castShadow
          shadow-mapSize={1024}
        />
        <pointLight intensity={0.5} position={[3, 2, 3]} color="#C89B3C" />

        <Slate />
      </Suspense>
      <Preload all />
    </Canvas>
  );
};

export default ClapperCanvas;
