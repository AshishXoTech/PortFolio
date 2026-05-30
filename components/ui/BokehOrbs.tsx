"use client";

interface BokehOrbsProps {
  offsetX?: number;
  offsetY?: number;
}

interface OrbConfig {
  background: string;
  blur: number;
  duration: number;
  height: number;
  left?: string;
  right?: string;
  top?: string;
  bottom?: string;
  width: number;
}

const ORBS: OrbConfig[] = [
  {
    width: 600,
    height: 600,
    top: "-100px",
    left: "-100px",
    background: "rgba(0,255,65,0.032)",
    blur: 120,
    duration: 20,
  },
  {
    width: 500,
    height: 500,
    top: "35%",
    right: "-150px",
    background: "rgba(124,58,237,0.04)",
    blur: 100,
    duration: 26,
  },
  {
    width: 400,
    height: 400,
    bottom: "-60px",
    left: "20%",
    background: "rgba(0,191,255,0.022)",
    blur: 90,
    duration: 31,
  },
  {
    width: 700,
    height: 700,
    top: "50%",
    right: "-200px",
    background: "rgba(124,58,237,0.022)",
    blur: 140,
    duration: 35,
  },
  {
    width: 300,
    height: 300,
    top: "60%",
    left: "40%",
    background: "rgba(245,158,11,0.018)",
    blur: 80,
    duration: 23,
  },
];

export function BokehOrbs({
  offsetX = 0,
  offsetY = 0,
}: BokehOrbsProps): JSX.Element {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ transform: `translate3d(${offsetX}px, ${offsetY}px, 0)` }}
      aria-hidden="true"
    >
      {ORBS.map((orb, index) => (
        <div
          key={`bokeh-orb-${index}`}
          className="absolute rounded-full"
          style={{
            animation: `hero-bokeh-drift ${orb.duration}s ease-in-out infinite`,
            animationDelay: `${index * -4}s`,
            background: orb.background,
            bottom: orb.bottom,
            filter: `blur(${orb.blur}px)`,
            height: `${orb.height}px`,
            left: orb.left,
            right: orb.right,
            top: orb.top,
            width: `${orb.width}px`,
          }}
        />
      ))}
    </div>
  );
}
