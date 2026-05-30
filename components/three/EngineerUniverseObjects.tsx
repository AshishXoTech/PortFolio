"use client";

import { Float, Icosahedron, Sphere } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { Group, Points } from "three";

const CODE_POINT_COUNT = 1200;
const BUG_COUNT = 14;

const GREEN = new THREE.Color("#00ff41");
const PURPLE = new THREE.Color("#7c3aed");
const RED = new THREE.Color("#ff003c");
const GOLD = new THREE.Color("#f59e0b");

interface BugConfig {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  speed: number;
}

function buildCodeSphereGeometry(): THREE.BufferGeometry {
  const positions = new Float32Array(CODE_POINT_COUNT * 3);
  const colors = new Float32Array(CODE_POINT_COUNT * 3);

  for (let index = 0; index < CODE_POINT_COUNT; index += 1) {
    const phi = Math.acos(1 - (2 * index) / CODE_POINT_COUNT);
    const theta = Math.PI * (1 + Math.sqrt(5)) * index;
    const radius = 1.28 + (index % 7) * 0.012;
    const i3 = index * 3;

    positions[i3] = Math.cos(theta) * Math.sin(phi) * radius;
    positions[i3 + 1] = Math.sin(theta) * Math.sin(phi) * radius;
    positions[i3 + 2] = Math.cos(phi) * radius;

    const color = index % 11 === 0 ? GOLD : index % 5 === 0 ? PURPLE : GREEN;
    colors[i3] = color.r;
    colors[i3 + 1] = color.g;
    colors[i3 + 2] = color.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return geometry;
}

function buildBugConfigs(): BugConfig[] {
  return Array.from({ length: BUG_COUNT }, (_, index) => {
    const angle = (index / BUG_COUNT) * Math.PI * 2;
    const radius = 2.2 + (index % 4) * 0.38;

    return {
      position: [
        Math.cos(angle) * radius,
        Math.sin(index * 1.7) * 1.15,
        Math.sin(angle) * radius - 0.8,
      ],
      rotation: [
        Math.sin(index) * 0.8,
        angle,
        Math.cos(index) * 0.6,
      ],
      scale: 0.08 + (index % 3) * 0.018,
      speed: 0.2 + (index % 5) * 0.04,
    };
  });
}

function CodeSphere(): JSX.Element {
  const pointsRef = useRef<Points>(null);
  const geometry = useMemo(() => buildCodeSphereGeometry(), []);
  const material = useMemo(
    () =>
      new THREE.PointsMaterial({
        size: 0.025,
        vertexColors: true,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    []
  );

  useFrame(({ clock, pointer }) => {
    const points = pointsRef.current;
    if (!points) return;

    points.rotation.y = clock.elapsedTime * 0.12 + pointer.x * 0.14;
    points.rotation.x = Math.sin(clock.elapsedTime * 0.18) * 0.12 + pointer.y * 0.08;
  });

  return (
    <points
      ref={pointsRef}
      geometry={geometry}
      material={material}
      position={[0.9, 0.15, 0]}
    />
  );
}

function BugMesh({ config }: { config: BugConfig }): JSX.Element {
  const groupRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    const group = groupRef.current;
    if (!group) return;

    group.rotation.y += config.speed * 0.01;
    group.position.y =
      config.position[1] + Math.sin(clock.elapsedTime * 0.8 + config.speed * 12) * 0.08;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.5} floatIntensity={0.35}>
      <group
        ref={groupRef}
        position={config.position}
        rotation={config.rotation}
        scale={config.scale}
      >
        <Icosahedron args={[1, 1]}>
          <meshStandardMaterial color={RED} emissive={RED} emissiveIntensity={0.45} roughness={0.35} />
        </Icosahedron>
        <Sphere args={[0.28, 12, 12]} position={[0.82, 0, 0]}>
          <meshStandardMaterial color={PURPLE} emissive={PURPLE} emissiveIntensity={0.28} />
        </Sphere>
        <Sphere args={[0.28, 12, 12]} position={[-0.82, 0, 0]}>
          <meshStandardMaterial color={PURPLE} emissive={PURPLE} emissiveIntensity={0.28} />
        </Sphere>
      </group>
    </Float>
  );
}

export function EngineerUniverseObjects(): JSX.Element {
  const bugs = useMemo(() => buildBugConfigs(), []);

  return (
    <group>
      <CodeSphere />
      {bugs.map((bug, index) => (
        <BugMesh key={`bug-${index}`} config={bug} />
      ))}
    </group>
  );
}
