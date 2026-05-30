"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { FloatingCode } from "@/components/three/FloatingCode";
import { ParticleGalaxy } from "@/components/three/ParticleGalaxy";

export default function SceneInner(): JSX.Element {
  return (
    <Canvas
      camera={{ position: [0, 0.8, 3.5], fov: 60 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
      className="absolute inset-0 z-0 h-full w-full"
      style={{ position: "absolute", inset: 0, zIndex: 0 }}
    >
      <color attach="background" args={["#0a0a0a"]} />
      <ambientLight intensity={0.35} />
      <pointLight position={[2, 3, 2]} intensity={0.4} color="#7c3aed" />
      <pointLight position={[-2, -1, 1]} intensity={0.25} color="#00ff41" />
      <Suspense fallback={null}>
        <ParticleGalaxy />
        <FloatingCode />
      </Suspense>
    </Canvas>
  );
}
