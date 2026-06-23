"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import * as THREE from "three";
import { EarthGlobe } from "@/components/three/EarthGlobe";

function CameraRig(): null {
  const { camera, pointer } = useThree();

  useFrame(() => {
    const targetPosition = new THREE.Vector3(
      pointer.x * 0.15,
      pointer.y * 0.1,
      6
    );
    camera.position.lerp(targetPosition, 0.03);
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
      camera={{ position: [0, 0, 6], fov: 60 }}
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
      <ambientLight color="#111133" intensity={0.4} />
      <directionalLight position={[5, 3, 5]} color="#ffffff" intensity={1.4} />
      <directionalLight position={[-5, 0, -5]} color="#0044ff" intensity={0.2} />
      <Suspense fallback={null}>
        <CameraRig />
        <EarthGlobe />
      </Suspense>
    </Canvas>
  );
}
