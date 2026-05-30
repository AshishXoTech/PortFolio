"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { Mesh } from "three";

const PLANE_COUNT = 50;

const CODE_SNIPPETS = [
  "const x = await fetch()",
  "npm run build",
  'git commit -m "feat"',
  "docker compose up",
  "SELECT * FROM users",
  "useState<boolean>(false)",
  ".map(x => x * 2)",
  "interface User {}",
  "type Props = {}",
  "prisma.user.create()",
] as const;

interface FloatingPlaneConfig {
  snippet: string;
  position: [number, number, number];
  rotation: [number, number, number];
  rotationSpeed: number;
  bobOffset: number;
}

function createCodeTexture(snippet: string): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 64;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not acquire 2D canvas context");
  }

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#00ff41";
  ctx.font = '11px "JetBrains Mono", monospace';
  ctx.textBaseline = "middle";
  ctx.fillText(snippet, 10, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function randomInRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function buildPlaneConfigs(): FloatingPlaneConfig[] {
  return Array.from({ length: PLANE_COUNT }, (_, index) => ({
    snippet: CODE_SNIPPETS[index % CODE_SNIPPETS.length],
    position: [
      randomInRange(-4, 4),
      randomInRange(-2, 2),
      randomInRange(-3, 1),
    ],
    rotation: [
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI,
    ],
    rotationSpeed: 0.08 + Math.random() * 0.14,
    bobOffset: Math.random() * Math.PI * 2,
  }));
}

interface FloatingCodePlaneProps {
  config: FloatingPlaneConfig;
  geometry: THREE.PlaneGeometry;
  material: THREE.MeshBasicMaterial;
}

function FloatingCodePlane({
  config,
  geometry,
  material,
}: FloatingCodePlaneProps): JSX.Element {
  const meshRef = useRef<Mesh>(null);
  const baseY = config.position[1];

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    mesh.rotation.y += config.rotationSpeed * 0.01;
    mesh.rotation.z = Math.sin(clock.elapsedTime * 0.35 + config.bobOffset) * 0.08;
    mesh.position.y =
      baseY + Math.sin(clock.elapsedTime * 0.9 + config.bobOffset) * 0.12;
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      position={config.position}
      rotation={config.rotation}
    />
  );
}

export function FloatingCode(): JSX.Element {
  const planeConfigs = useMemo(() => buildPlaneConfigs(), []);

  const resources = useMemo(() => {
    const sharedGeometry = new THREE.PlaneGeometry(0.6, 0.25);
    const planes = planeConfigs.map((config) => {
      const texture = createCodeTexture(config.snippet);
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.12,
        depthWrite: false,
      });

      return { config, material, texture };
    });

    return { sharedGeometry, planes };
  }, [planeConfigs]);

  useEffect(
    () => () => {
      resources.sharedGeometry.dispose();
      resources.planes.forEach((plane) => {
        plane.material.dispose();
        plane.texture.dispose();
      });
    },
    [resources]
  );

  return (
    <group>
      {resources.planes.map((plane, index) => (
        <FloatingCodePlane
          key={`floating-code-${index}`}
          config={plane.config}
          geometry={resources.sharedGeometry}
          material={plane.material}
        />
      ))}
    </group>
  );
}
