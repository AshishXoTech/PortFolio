"use client";

import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { Group } from "three";

const CHARS = [
  "0",
  "1",
  "{",
  "}",
  "<",
  ">",
  "/",
  "=",
  ";",
  "fn",
  "if",
  "||",
  "&&",
  "=>",
  "++",
] as const;

interface CodeSprite {
  char: (typeof CHARS)[number];
  color: "#7c3aed" | "#00ff41";
  opacity: number;
  position: [number, number, number];
}

function buildCodeSprites(): CodeSprite[] {
  const geometry = new THREE.IcosahedronGeometry(2.1, 4);
  const position = geometry.getAttribute("position");
  const sprites: CodeSprite[] = [];

  for (let index = 0; index < position.count; index += 1) {
    sprites.push({
      char: CHARS[index % CHARS.length],
      color: Math.random() > 0.75 ? "#7c3aed" : "#00ff41",
      opacity: 0.45 + Math.random() * 0.4,
      position: [
        position.getX(index),
        position.getY(index),
        position.getZ(index),
      ],
    });
  }

  geometry.dispose();
  return sprites;
}

export function CodeSphere(): JSX.Element {
  const groupRef = useRef<Group>(null);
  const codeSprites = useMemo(() => buildCodeSprites(), []);

  useFrame(({ clock }) => {
    const group = groupRef.current;
    if (!group) return;

    group.rotation.y += 0.0014;
    group.rotation.x += 0.0003;

    const scale = 1 + Math.sin(clock.elapsedTime * 0.5) * 0.02;
    group.scale.setScalar(scale);
  });

  useEffect(() => {
    const group = groupRef.current;

    return () => {
      group?.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();

          if (Array.isArray(child.material)) {
            child.material.forEach((material) => material.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
    };
  }, []);

  return (
    <group ref={groupRef}>
      <mesh>
        <icosahedronGeometry args={[2, 4]} />
        <meshBasicMaterial
          color="#00ff41"
          opacity={0.05}
          transparent
          wireframe
        />
      </mesh>

      {codeSprites.map((sprite, index) => (
        <Text
          key={`code-sprite-${index}`}
          color={sprite.color}
          fontSize={0.07}
          material-transparent
          material-opacity={sprite.opacity}
          position={sprite.position}
        >
          {sprite.char}
        </Text>
      ))}
    </group>
  );
}
