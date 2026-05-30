"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { InstancedMesh } from "three";

const BUG_COUNT = 20;

interface BugOrbitData {
  angle: number;
  radius: number;
  speed: number;
  wobble: number;
  yOffset: number;
}

function buildBugData(): BugOrbitData[] {
  return Array.from({ length: BUG_COUNT }, (_, index) => ({
    radius: 2.8 + Math.random() * 1.4,
    speed: 0.003 + Math.random() * 0.005,
    angle: (index / BUG_COUNT) * Math.PI * 2,
    yOffset: (Math.random() - 0.5) * 2.8,
    wobble: Math.random() * Math.PI * 2,
  }));
}

export function BugSwarm(): JSX.Element {
  const meshRef = useRef<InstancedMesh>(null);

  const bugData = useMemo(() => buildBugData(), []);
  const geometry = useMemo(() => new THREE.BoxGeometry(0.07, 0.025, 0.045), []);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#ff003c",
        emissive: "#ff003c",
        emissiveIntensity: 0.4,
        roughness: 0.42,
        metalness: 0.08,
      }),
    []
  );
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    bugData.forEach((orbit, index) => {
      orbit.angle += orbit.speed;

      dummy.position.x = Math.cos(orbit.angle) * orbit.radius;
      dummy.position.z = Math.sin(orbit.angle) * orbit.radius;
      dummy.position.y =
        orbit.yOffset +
        Math.sin(clock.elapsedTime * 0.6 + orbit.wobble) * 0.25;
      dummy.rotation.y = orbit.angle + Math.PI / 2;
      dummy.updateMatrix();

      mesh.setMatrixAt(index, dummy.matrix);
    });

    mesh.instanceMatrix.needsUpdate = true;
  });

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, BUG_COUNT]}
      frustumCulled={false}
    />
  );
}
