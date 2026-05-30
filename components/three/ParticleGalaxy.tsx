"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { Points } from "three";

const PARTICLE_COUNT = 2800;
const ARMS = 3;

const COLOR_GREEN: [number, number, number] = [0, 1, 0.255];
const COLOR_PURPLE: [number, number, number] = [124 / 255, 58 / 255, 237 / 255];
const COLOR_WHITE: [number, number, number] = [1, 1, 1];

function pickParticleColor(rand: number): [number, number, number] {
  if (rand < 0.65) return COLOR_GREEN;
  if (rand < 0.9) return COLOR_PURPLE;
  return COLOR_WHITE;
}

function buildGalaxyGeometry(): {
  geometry: THREE.BufferGeometry;
  dispose: () => void;
} {
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const colors = new Float32Array(PARTICLE_COUNT * 3);

  for (let i = 0; i < PARTICLE_COUNT; i += 1) {
    const progress = i / PARTICLE_COUNT;
    const armIndex = i % ARMS;

    const angle = progress * Math.PI * 8 + (armIndex * Math.PI * 2) / ARMS;
    const radius = progress * 3.5;
    const spread = (1 - progress) * 0.6;

    const x =
      Math.cos(angle) * radius + (Math.random() - 0.5) * spread;
    const y = (Math.random() - 0.5) * 0.3 * (1 - progress);
    const z =
      Math.sin(angle) * radius + (Math.random() - 0.5) * spread;

    const i3 = i * 3;
    positions[i3] = x;
    positions[i3 + 1] = y;
    positions[i3 + 2] = z;

    const [r, g, b] = pickParticleColor(Math.random());
    colors[i3] = r;
    colors[i3 + 1] = g;
    colors[i3 + 2] = b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  return {
    geometry,
    dispose: () => geometry.dispose(),
  };
}

export function ParticleGalaxy(): JSX.Element {
  const pointsRef = useRef<Points>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const tiltXRef = useRef(0);
  const tiltZRef = useRef(0);

  const { geometry, dispose } = useMemo(() => buildGalaxyGeometry(), []);

  const material = useMemo(
    () =>
      new THREE.PointsMaterial({
        size: 0.018,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    []
  );

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent): void => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(
    () => () => {
      dispose();
      material.dispose();
    },
    [dispose, material]
  );

  useFrame(() => {
    const points = pointsRef.current;
    if (!points) return;

    const targetTiltX = mouseRef.current.y * 0.08;
    const targetTiltZ = mouseRef.current.x * 0.06;

    tiltXRef.current += (targetTiltX - tiltXRef.current) * 0.03;
    tiltZRef.current += (targetTiltZ - tiltZRef.current) * 0.03;

    points.rotation.y += 0.00025;
    points.rotation.x = tiltXRef.current;
    points.rotation.z = tiltZRef.current;
  });

  return <points ref={pointsRef} geometry={geometry} material={material} />;
}
