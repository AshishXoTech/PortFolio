"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

interface EarthTextures {
  bump: THREE.Texture | null;
  clouds: THREE.Texture | null;
  day: THREE.Texture | null;
  night: THREE.Texture | null;
  spec: THREE.Texture | null;
}

interface Location {
  color: string;
  label: string;
  lat: number;
  lon: number;
  pulseOffset: number;
  size: number;
}

const EARTH_RADIUS = 2.5;
const RING_RADIUS = 3.1;
const SUN_DIRECTION = new THREE.Vector3(5, 3, 5).normalize();

const LOCATIONS: Location[] = [
  { label: "Jaipur", lat: 26.9124, lon: 75.7873, color: "#00ff41", size: 0.06, pulseOffset: 0 },
  { label: "San Francisco", lat: 37.7749, lon: -122.4194, color: "#7c3aed", size: 0.028, pulseOffset: 0.7 },
  { label: "London", lat: 51.5074, lon: -0.1278, color: "#7c3aed", size: 0.028, pulseOffset: 1.4 },
  { label: "Tokyo", lat: 35.6762, lon: 139.6503, color: "#7c3aed", size: 0.028, pulseOffset: 2.1 },
  { label: "Bangalore", lat: 12.9716, lon: 77.5946, color: "#00ff41", size: 0.04, pulseOffset: 2.8 },
  { label: "New York", lat: 40.7128, lon: -74.006, color: "#7c3aed", size: 0.028, pulseOffset: 3.5 },
];

function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

function loadEarthTextures(gl: THREE.WebGLRenderer): Promise<EarthTextures> {
  const loader = new THREE.TextureLoader();
  const load = (url: string, color = true): Promise<THREE.Texture | null> =>
    new Promise((resolve) => {
      loader.load(
        url,
        (texture) => {
          texture.colorSpace = color ? THREE.SRGBColorSpace : THREE.NoColorSpace;
          texture.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
          resolve(texture);
        },
        undefined,
        () => resolve(null),
      );
    });

  return Promise.all([
    load("/textures/earth-day.jpg"),
    load("/textures/earth-bump.jpg", false),
    load("/textures/earth-spec.jpg", false),
    load("/textures/earth-night.jpg"),
    load("/textures/earth-clouds.png"),
  ]).then(([day, bump, spec, night, clouds]) => ({ bump, clouds, day, night, spec }));
}

function StarField(): JSX.Element {
  const materialRef = useRef<THREE.PointsMaterial>(null);
  const geometry = useMemo(() => {
    const positions = new Float32Array(2000 * 3);
    const colors = new Float32Array(2000 * 3);
    const color = new THREE.Color();

    for (let index = 0; index < 2000; index += 1) {
      positions[index * 3] = THREE.MathUtils.randFloatSpread(200);
      positions[index * 3 + 1] = THREE.MathUtils.randFloatSpread(200);
      positions[index * 3 + 2] = THREE.MathUtils.randFloatSpread(200);
      color.setScalar(THREE.MathUtils.randFloat(0.35, 0.85));
      colors[index * 3] = color.r;
      colors[index * 3 + 1] = color.g;
      colors[index * 3 + 2] = color.b;
    }

    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    starGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return starGeometry;
  }, []);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.opacity = 0.45 + Math.sin(clock.elapsedTime * 0.8) * 0.16;
    }
  });

  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <points geometry={geometry}>
      <pointsMaterial
        ref={materialRef}
        size={0.3}
        sizeAttenuation
        transparent
        opacity={0.55}
        vertexColors
        depthWrite={false}
      />
    </points>
  );
}

function LocationPin({ location, position }: { location: Location; position: THREE.Vector3 }): JSX.Element {
  const glowRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(({ clock }) => {
    if (glowRef.current) {
      glowRef.current.opacity = 0.1 + 0.4 * Math.max(0, Math.sin(clock.elapsedTime * 3 + location.pulseOffset));
    }
  });

  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[location.size, 16, 16]} />
        <meshBasicMaterial color={location.color} />
      </mesh>
      <mesh>
        <sphereGeometry args={[location.size * 2.3, 18, 18]} />
        <meshBasicMaterial ref={glowRef} color={location.color} transparent opacity={0.25} depthWrite={false} />
      </mesh>
      {location.label === "Jaipur" ? <JaipurPulse color={location.color} /> : null}
    </group>
  );
}

function JaipurPulse({ color }: { color: string }): JSX.Element {
  const refs = useRef<Array<THREE.MeshBasicMaterial | null>>([]);

  useFrame(({ clock }) => {
    refs.current.forEach((material, index) => {
      if (!material) return;
      const phase = (clock.elapsedTime * 0.8 + index / 3) % 1;
      material.opacity = (1 - phase) * 0.28;
    });
  });

  return (
    <>
      {[0, 1, 2].map((index) => (
        <mesh
          key={index}
          rotation={[Math.PI / 2, 0, 0]}
          scale={1 + index * 0.4}
        >
          <torusGeometry args={[0.12 + index * 0.055, 0.003, 8, 80]} />
          <meshBasicMaterial
            ref={(material) => {
              refs.current[index] = material;
            }}
            color={color}
            transparent
            opacity={0.2}
            depthWrite={false}
          />
        </mesh>
      ))}
    </>
  );
}

function OrbitRing({
  color,
  inclination,
  opacity,
  speed,
}: {
  color: string;
  inclination: number;
  opacity: number;
  speed: number;
}): JSX.Element {
  const satelliteRefs = useRef<Array<THREE.Group | null>>([]);
  const offsets = useMemo(() => [0, 1.7, 3.4, 5.1], []);

  useFrame(({ clock }) => {
    satelliteRefs.current.forEach((satellite, index) => {
      if (!satellite) return;
      const angle = clock.elapsedTime * speed * (1 + index * 0.12) + offsets[index];
      satellite.position.set(RING_RADIUS * Math.cos(angle), 0, RING_RADIUS * Math.sin(angle));
    });
  });

  return (
    <group rotation={[inclination, 0, 0]}>
      <mesh>
        <torusGeometry args={[RING_RADIUS, 0.004, 16, 200]} />
        <meshBasicMaterial color={color} transparent opacity={opacity} depthWrite={false} />
      </mesh>
      {offsets.map((_, index) => (
        <group
          key={index}
          ref={(group) => {
            satelliteRefs.current[index] = group;
          }}
        >
          <mesh>
            <sphereGeometry args={[0.025, 12, 12]} />
            <meshBasicMaterial color={color} />
          </mesh>
          <pointLight color={color} intensity={0.3} distance={1.2} />
        </group>
      ))}
    </group>
  );
}

function ConnectionLines({ positions }: { positions: THREE.Vector3[] }): JSX.Element {
  const materialRefs = useRef<Array<THREE.MeshBasicMaterial | null>>([]);
  const jaipur = positions[0];
  const curves = useMemo(
    () =>
      positions.slice(1).map((end) => {
        const control = jaipur.clone().add(end).normalize().multiplyScalar(EARTH_RADIUS * 1.5);
        const curve = new THREE.QuadraticBezierCurve3(jaipur, control, end);
        return new THREE.TubeGeometry(curve, 32, 0.004, 8, false);
      }),
    [jaipur, positions],
  );

  useFrame(({ clock }) => {
    materialRefs.current.forEach((material, index) => {
      if (!material) return;
      material.opacity = 0.12 + Math.max(0, Math.sin(clock.elapsedTime * 2.2 - index * 0.7)) * 0.22;
    });
  });

  useEffect(() => () => curves.forEach((curve) => curve.dispose()), [curves]);

  return (
    <>
      {curves.map((geometry, index) => (
        <mesh key={index} geometry={geometry}>
          <meshBasicMaterial
            ref={(material) => {
              materialRefs.current[index] = material;
            }}
            color="#00ff41"
            transparent
            opacity={0.18}
            depthWrite={false}
          />
        </mesh>
      ))}
    </>
  );
}

export function EarthGlobe(): JSX.Element {
  const groupRef = useRef<THREE.Group>(null);
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const [textures, setTextures] = useState<EarthTextures>({ bump: null, clouds: null, day: null, night: null, spec: null });
  const { gl, pointer, size } = useThree();
  const segments = size.width < 768 ? 32 : 64;
  const positions = useMemo(() => LOCATIONS.map((location) => latLonToVector3(location.lat, location.lon, EARTH_RADIUS + 0.025)), []);

  useEffect(() => {
    let cancelled = false;
    let loadedTextures: EarthTextures | null = null;

    loadEarthTextures(gl).then((nextTextures) => {
      loadedTextures = nextTextures;
      if (!cancelled) setTextures(nextTextures);
    });

    return () => {
      cancelled = true;
      Object.values(loadedTextures ?? {}).forEach((texture) => texture?.dispose());
    };
  }, [gl]);

  useFrame(() => {
    if (earthRef.current) earthRef.current.rotation.y += 0.0006;
    if (cloudsRef.current) cloudsRef.current.rotation.y += 0.0009;

    if (groupRef.current) {
      const targetX = pointer.y * 0.04;
      const targetY = pointer.x * 0.04;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetX, 0.03);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetY, 0.03);
    }
  });

  return (
    <>
      <StarField />
      <group ref={groupRef} scale={0.92} rotation={[0.12, -0.5, 0]}>
        <mesh ref={earthRef}>
          <sphereGeometry args={[EARTH_RADIUS, segments, segments]} />
          <meshPhongMaterial
            map={textures.day ?? null}
            bumpMap={textures.bump ?? null}
            bumpScale={0.05}
            specularMap={textures.spec ?? null}
            specular={new THREE.Color(0x333333)}
            shininess={18}
            color={textures.day ? "#ffffff" : "#1a4a8a"}
          />
        </mesh>

        {textures.night ? (
          <mesh>
            <sphereGeometry args={[2.001, segments, segments]} />
            <shaderMaterial
              transparent
              depthWrite={false}
              blending={THREE.AdditiveBlending}
              uniforms={{
                nightMap: { value: textures.night },
                sunDirection: { value: SUN_DIRECTION },
              }}
              vertexShader={`
                varying vec2 vUv;
                varying vec3 vNormal;
                void main() {
                  vUv = uv;
                  vNormal = normalize(normalMatrix * normal);
                  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
              `}
              fragmentShader={`
                uniform sampler2D nightMap;
                uniform vec3 sunDirection;
                varying vec2 vUv;
                varying vec3 vNormal;
                void main() {
                  float nightFactor = smoothstep(0.1, -0.25, dot(normalize(vNormal), normalize(sunDirection)));
                  vec4 cityLights = texture2D(nightMap, vUv);
                  gl_FragColor = vec4(cityLights.rgb, cityLights.a * nightFactor * 0.72);
                }
              `}
            />
          </mesh>
        ) : null}

        {textures.clouds ? (
          <mesh ref={cloudsRef}>
            <sphereGeometry args={[2.02, segments, segments]} />
            <meshPhongMaterial map={textures.clouds} transparent opacity={0.35} depthWrite={false} />
          </mesh>
        ) : null}

        <mesh scale={1.02}>
          <sphereGeometry args={[2.15, segments, segments]} />
          <shaderMaterial
            side={THREE.BackSide}
            transparent
            blending={THREE.AdditiveBlending}
            vertexShader={`
              varying vec3 vNormal;
              void main() {
                vNormal = normalize(normalMatrix * normal);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              }
            `}
            fragmentShader={`
              varying vec3 vNormal;
              void main() {
                float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0) * 1.8;
                gl_FragColor = vec4(0.1, 0.5, 1.0, 1.0) * intensity;
              }
            `}
          />
        </mesh>

        {LOCATIONS.map((location, index) => (
          <LocationPin key={location.label} location={location} position={positions[index]} />
        ))}
        <ConnectionLines positions={positions} />
        <OrbitRing color="#00ff41" inclination={0} opacity={0.15} speed={0.55} />
        <OrbitRing color="#7c3aed" inclination={Math.PI * 0.17} opacity={0.12} speed={0.42} />
        <OrbitRing color="#00bfff" inclination={-Math.PI * 0.25} opacity={0.1} speed={0.68} />
      </group>
    </>
  );
}
