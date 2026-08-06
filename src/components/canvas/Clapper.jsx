import React, { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Preload } from "@react-three/drei";
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
    // Viewing angle is now controlled by OrbitControls (drag to rotate
    // the board 360°), so we no longer auto-tilt the whole group here —
    // only the clap motion below still runs automatically, unchanged.
    const t = clock.getElapsedTime() % 3.6; // 3.6-second loop
    let angle;
    if (t < 1.5) {
      angle = 0.62; // held open — ~35°, matching a real clapperboard's ready position
    } else if (t < 1.65) {
      angle = THREE.MathUtils.lerp(0.62, 0, (t - 1.5) / 0.15); // sharp clap shut
    } else if (t < 3.2) {
      angle = 0; // held closed — flush against the base
    } else {
      angle = THREE.MathUtils.lerp(0, 0.62, (t - 3.2) / 0.4); // lift back open
    }
    if (clapRef.current) clapRef.current.rotation.z = angle;
  });

  return (
    <group ref={groupRef} rotation={[0.08, -0.12, 0]} position={[0, 0.25, 0]}>
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

      {/* hinged clapper top — pivot sits at the top-LEFT corner of the
          base, matching a real clapperboard's hinge pin. The arm's own
          left edge lines up with that pivot (mesh is offset to the
          right by half its width) so rotating the group swings the
          whole bar up-and-right around the pin, exactly like the
          reference images — not a front/back tilt. */}
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

        {/* Drag to spin the board around 360° in any direction.
            Only viewing angle changes here — the clap animation inside
            Slate keeps running exactly as before, untouched. */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          rotateSpeed={0.6}
          autoRotate={false}
        />
      </Suspense>
      <Preload all />
    </Canvas>
  );
};

export default ClapperCanvas;
