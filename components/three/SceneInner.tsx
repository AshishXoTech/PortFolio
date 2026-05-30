"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { EngineerUniverseObjects } from "@/components/three/EngineerUniverseObjects";

export default function SceneInner(): JSX.Element {
  return (
    <Canvas
      camera={{ position: [0, 0.6, 4.2], fov: 58 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
      className="absolute inset-0 z-0 h-full w-full"
      style={{ position: "absolute", inset: 0, zIndex: 0 }}
    >
      <color attach="background" args={["#050510"]} />
      <ambientLight intensity={0.35} />
      <pointLight position={[2, 3, 2]} intensity={0.8} color="#7c3aed" />
      <pointLight position={[-2, -1, 1]} intensity={0.45} color="#00ff41" />
      <Suspense fallback={null}>
        <EngineerUniverseObjects />
      </Suspense>
    </Canvas>
  );
}
