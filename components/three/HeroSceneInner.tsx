"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import * as THREE from "three";
import { BugSwarm } from "@/components/three/BugSwarm";
import { CodeSphere } from "@/components/three/CodeSphere";

function CameraRig(): null {
  const { camera, pointer } = useThree();

  useFrame(() => {
    const targetPosition = new THREE.Vector3(pointer.x * 0.35, pointer.y * 0.22, 5);
    camera.position.lerp(targetPosition, 0.04);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

export default function HeroSceneInner(): JSX.Element {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleVisibilityChange = (): void => {
      setIsVisible(!document.hidden);
    };

    handleVisibilityChange();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 65 }}
      dpr={[1, 1.5]}
      frameloop={isVisible ? "always" : "never"}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
      }}
    >
      <ambientLight intensity={0.15} />
      <pointLight position={[3, 3, 3]} color="#7c3aed" intensity={3} />
      <pointLight position={[-3, -2, 2]} color="#00ff41" intensity={2} />
      <Suspense fallback={null}>
        <CameraRig />
        <CodeSphere />
        <BugSwarm />
      </Suspense>
    </Canvas>
  );
}
