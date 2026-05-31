"use client";

import Image from "next/image";
import { LockKeyhole } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface LoginScreenProps {
  onLogin: () => void;
}

interface CodeColumn {
  alpha: number;
  char: string;
  size: number;
  speed: number;
  x: number;
  y: number;
}

interface TechWord {
  alpha: number;
  rotation: number;
  rotationSpeed: number;
  size: number;
  text: string;
  vx: number;
  vy: number;
  x: number;
  y: number;
}

interface GlowDot {
  color: string;
  drift: boolean;
  offset: number;
  size: number;
  vx: number;
  vy: number;
  x: number;
  y: number;
}

const CODE_CHARS = [
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
  "&&",
  "=>",
  "++",
  "--",
  "[]",
];

const TECH_WORDS = [
  "React",
  "Node.js",
  "TypeScript",
  "Docker",
  "FastAPI",
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "Prisma",
  "JWT",
  "RBAC",
  "OpenAI",
  "Next.js",
  "Python",
  "Express",
  "GraphQL",
  "REST",
  "MERN",
  "DevOps",
  "CI/CD",
];

const ROLE_STATES = ["Full Stack Developer", "Bug Debugger"];
const HUD_LINES = [
  "SYSTEM: ASHISHOS v1.0.0",
  "STATUS: AUTHENTICATED",
  "UPTIME: 47d 12h 08m",
];

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function createParticles(width: number, height: number, isMobile: boolean) {
  const scale = isMobile ? 0.6 : 1;
  const codeColumns: CodeColumn[] = Array.from(
    { length: Math.round(100 * scale) },
    (_, index) => ({
      alpha: randomBetween(0.08, 0.25),
      char: CODE_CHARS[index % CODE_CHARS.length],
      size: randomBetween(11, 13),
      speed: randomBetween(0.5, 2),
      x: randomBetween(0, width),
      y: randomBetween(-height, height),
    })
  );

  const words: TechWord[] = Array.from(
    { length: Math.round(40 * scale) },
    (_, index) => ({
      alpha: randomBetween(0.12, 0.25),
      rotation: randomBetween(-0.2, 0.2),
      rotationSpeed: randomBetween(-0.001, 0.001),
      size: randomBetween(10, 14),
      text: TECH_WORDS[index % TECH_WORDS.length],
      vx: randomBetween(0.1, 0.3) * (Math.random() > 0.5 ? 1 : -1),
      vy: randomBetween(0.1, 0.3) * (Math.random() > 0.5 ? 1 : -1),
      x: randomBetween(0, width),
      y: randomBetween(0, height),
    })
  );

  const dots: GlowDot[] = Array.from({ length: Math.round(80 * scale) }, (_, index) => ({
    color:
      index % 3 === 0
        ? "0,255,65"
        : index % 3 === 1
          ? "124,58,237"
          : "255,255,255",
    drift: index % 4 === 0,
    offset: randomBetween(0, Math.PI * 2),
    size: randomBetween(1, 3),
    vx: randomBetween(-0.08, 0.08),
    vy: randomBetween(-0.08, 0.08),
    x: randomBetween(0, width),
    y: randomBetween(0, height),
  }));

  return { codeColumns, dots, words };
}

export default function LoginScreen({ onLogin }: LoginScreenProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isHudVisible, setIsHudVisible] = useState(false);
  const [isCardVisible, setIsCardVisible] = useState(false);
  const [ringsActive, setRingsActive] = useState(false);
  const [typedHud, setTypedHud] = useState("");
  const [role, setRole] = useState(ROLE_STATES[0]);
  const [time, setTime] = useState("00:00:00");
  const [useBlur, setUseBlur] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const context = canvas.getContext("2d");
    if (!context) return undefined;

    let width = 0;
    let height = 0;
    let codeColumns: CodeColumn[] = [];
    let words: TechWord[] = [];
    let dots: GlowDot[] = [];

    const resize = () => {
      const pixelRatio = Math.min(2, window.devicePixelRatio || 1);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * pixelRatio);
      canvas.height = Math.floor(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      const particles = createParticles(width, height, width < 768);
      codeColumns = particles.codeColumns;
      words = particles.words;
      dots = particles.dots;
    };

    const draw = (timeValue: number) => {
      context.fillStyle = "rgba(5,5,16,0.08)";
      context.fillRect(0, 0, width, height);
      context.font = "12px JetBrains Mono, monospace";

      codeColumns.forEach((column, columnIndex) => {
        column.y += column.speed;
        if (column.y > height + 180) {
          column.y = randomBetween(-300, -20);
          column.x = randomBetween(0, width);
          column.char = CODE_CHARS[(columnIndex + Math.floor(timeValue / 900)) % CODE_CHARS.length];
        }

        for (let trail = 0; trail < 12; trail += 1) {
          const alpha = Math.max(0, column.alpha - trail * 0.015);
          context.fillStyle = `rgba(0,255,65,${alpha})`;
          context.font = `${column.size}px JetBrains Mono, monospace`;
          context.fillText(column.char, column.x, column.y - trail * 18);
        }
      });

      words.forEach((word) => {
        word.x += word.vx;
        word.y += word.vy;
        word.rotation += word.rotationSpeed;
        if (word.x < -80 || word.x > width + 80) word.vx *= -1;
        if (word.y < -40 || word.y > height + 40) word.vy *= -1;

        context.save();
        context.translate(word.x, word.y);
        context.rotate(word.rotation);
        context.font = `${word.size}px JetBrains Mono, monospace`;
        context.fillStyle = `rgba(124,58,237,${word.alpha})`;
        context.fillText(word.text, 0, 0);
        context.restore();
      });

      dots.forEach((dot) => {
        if (dot.drift) {
          dot.x += dot.vx;
          dot.y += dot.vy;
          if (dot.x < 0 || dot.x > width) dot.vx *= -1;
          if (dot.y < 0 || dot.y > height) dot.vy *= -1;
        }

        const alpha = 0.15 + Math.abs(Math.sin(timeValue * 0.0015 + dot.offset)) * 0.45;
        context.beginPath();
        context.fillStyle = `rgba(${dot.color},${alpha})`;
        context.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
        context.fill();
      });

      animationRef.current = requestAnimationFrame(draw);
    };

    resize();
    animationRef.current = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    setUseBlur(navigator.hardwareConcurrency > 2);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  useEffect(() => {
    const formatTime = () =>
      new Intl.DateTimeFormat("en-IN", {
        hour: "2-digit",
        hour12: false,
        minute: "2-digit",
        second: "2-digit",
        timeZone: "Asia/Kolkata",
      }).format(new Date());

    setTime(formatTime());
    const intervalId = setInterval(() => setTime(formatTime()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const timeouts: number[] = [];
    timeouts.push(window.setTimeout(() => setIsHudVisible(true), 200));
    timeouts.push(window.setTimeout(() => setIsCardVisible(true), 600));
    timeouts.push(window.setTimeout(() => setRingsActive(true), 800));

    let index = 0;
    const hudText = HUD_LINES.join("\n");
    const typingId = window.setInterval(() => {
      index += 1;
      setTypedHud(hudText.slice(0, index));
      if (index >= hudText.length) window.clearInterval(typingId);
    }, 18);

    return () => {
      timeouts.forEach((timeoutId) => window.clearTimeout(timeoutId));
      window.clearInterval(typingId);
    };
  }, []);

  useEffect(() => {
    let intervalId: number | undefined;
    const timeoutId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        setRole((currentRole) =>
          currentRole === ROLE_STATES[0] ? ROLE_STATES[1] : ROLE_STATES[0]
        );
      }, 3600);
    }, 1000);

    return () => {
      window.clearTimeout(timeoutId);
      if (intervalId !== undefined) window.clearInterval(intervalId);
    };
  }, []);

  const handleLogin = useCallback(() => {
    if (isLoading) return;

    setIsLoading(true);
    setTimeout(() => {
      onLogin();
    }, 1000);
  }, [isLoading, onLogin]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050510]">
      <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(15,10,35,1)_0%,rgba(5,5,16,1)_50%,rgba(2,2,8,1)_100%)]" />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-[1] pointer-events-none"
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-0 z-[2]" aria-hidden="true">
        <div className={["login-orb login-orb-1", useBlur ? "" : "opacity-40"].join(" ")} />
        <div className={["login-orb login-orb-2", useBlur ? "" : "opacity-40"].join(" ")} />
        <div className={["login-orb login-orb-3", useBlur ? "" : "opacity-40"].join(" ")} />
        <div className={["login-orb login-orb-4", useBlur ? "" : "opacity-40"].join(" ")} />
        <div className={["login-orb login-orb-5", useBlur ? "" : "opacity-40"].join(" ")} />
      </div>
      <div className="login-grid-texture absolute inset-0 z-[3] pointer-events-none" />
      <div className="login-scanline fixed inset-0 z-[4] pointer-events-none" />

      <div
        className={[
          "pointer-events-none absolute inset-0 z-10 transition-opacity duration-700",
          isHudVisible ? "opacity-100" : "opacity-0",
        ].join(" ")}
      >
        <HudCorner position="top-left" />
        <HudCorner position="top-right" />
        <HudCorner position="bottom-left" />
        <HudCorner position="bottom-right" />

        <pre className="absolute left-7 top-7 whitespace-pre-line font-mono text-[9px] leading-[1.8] text-green/20">
          {typedHud}
        </pre>
        <div className="absolute right-7 top-7 text-right font-mono text-[9px] leading-[1.8] text-purple/20">
          <p>NODE v18.2.0</p>
          <p>NEXT.JS v14.0</p>
          <p>REACT v18.3</p>
        </div>
        <div className="absolute bottom-7 left-7 font-mono text-[9px] text-green/15">
          LAT 26.9124 N&nbsp;&nbsp; LON 75.7873 E
        </div>
        <div className="absolute bottom-7 right-7 text-right font-mono text-[9px] leading-[1.8] text-purple/20">
          <p>{time}</p>
          <p>AshishOS Terminal</p>
        </div>
      </div>

      <div
        className={[
          "absolute left-1/2 top-1/2 z-20 w-[min(380px,calc(100vw-32px))] -translate-x-1/2 rounded-[24px] bg-[rgba(5,5,16,0.75)] px-9 py-10 shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_32px_80px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.04),0_0_80px_rgba(124,58,237,0.08)] transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
          useBlur ? "backdrop-blur-[32px] backdrop-saturate-[180%]" : "",
          isCardVisible
            ? "-translate-y-1/2 scale-100 opacity-100"
            : "translate-y-[calc(-50%+20px)] scale-90 opacity-0",
        ].join(" ")}
      >
        <div className="pointer-events-none absolute -left-[92px] top-24 hidden whitespace-pre-line font-mono text-[9px] leading-[1.9] text-green/15 min-[1100px]:block">
          PORT: 3000{"\n"}ENV: PROD{"\n"}BUILD: #247
        </div>
        <div className="pointer-events-none absolute -right-[92px] top-24 hidden whitespace-pre-line text-right font-mono text-[9px] leading-[1.9] text-purple/20 min-[1100px]:block">
          MEM: 847MB{"\n"}CPU: 12%{"\n"}NET: STABLE
        </div>

        <div className="relative mb-5 flex justify-center">
          <div className={["login-avatar-ring-outer", ringsActive ? "animate" : ""].join(" ")}>
            <span aria-hidden="true" />
          </div>
          <div className={["login-avatar-ring-inner", ringsActive ? "animate" : ""].join(" ")} />
          <div className="login-avatar-glow" />
          <div className="login-avatar-frame relative h-[100px] w-[100px] overflow-hidden rounded-full">
            <Image
              src="/images/avatar.jpg"
              alt="Ashish Kumar Jha"
              width={100}
              height={100}
              className="h-full w-full object-cover object-top"
              priority
              unoptimized
            />
          </div>
        </div>

        <div className="text-center">
          <h1 className="font-display text-[22px] font-extrabold tracking-[-0.01em] text-[#e8e8f0]">
            Ashish Kumar Jha
          </h1>
          <p key={role} className="login-role mt-1 font-mono text-xs text-green/60">
            {role}
            <span className="ml-1 text-green">█</span>
          </p>
        </div>

        <div className="my-4 h-px bg-white/[0.05]" />

        <div className="flex justify-center gap-4">
          <StatusPill color="#00ff41" label="Systems Online" />
          <StatusPill color="#7c3aed" label="UEM Jaipur" />
        </div>

        <div className="login-auth-divider my-5">
          <span>Authenticate</span>
        </div>

        <div className="relative">
          <LockKeyhole
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#444]"
            aria-hidden="true"
          />
          <input
            id="login-password"
            type="password"
            value="••••••••"
            readOnly
            aria-label="Authentication password"
            className="w-full rounded-[10px] border border-white/[0.06] bg-white/[0.02] py-3 pl-11 pr-4 font-mono text-sm tracking-[0.2em] text-[#e0e0e0] outline-none transition focus:border-green/25 focus:shadow-[0_0_0_3px_rgba(0,255,65,0.06)]"
          />
        </div>

        <button
          type="button"
          onClick={handleLogin}
          disabled={isLoading}
          className={[
            "mt-3 flex w-full cursor-pointer items-center justify-center rounded-[10px] px-4 py-[13px] font-mono text-[13px] font-bold uppercase tracking-[0.08em] transition duration-200 disabled:cursor-not-allowed",
            isLoading
              ? "border border-green/20 bg-green/10 text-green"
              : "border-0 bg-[linear-gradient(135deg,rgba(0,255,65,0.9),rgba(0,200,50,0.9))] text-[#050510] hover:-translate-y-px hover:bg-[linear-gradient(135deg,#00ff41,#00cc35)] hover:shadow-[0_8px_32px_rgba(0,255,65,0.3),0_0_0_1px_rgba(0,255,65,0.4)]",
          ].join(" ")}
        >
          {isLoading ? "Authenticating..." : "Initialize Session →"}
        </button>

        <p className="mt-5 text-center font-mono text-[10px] text-[#2a2a2a]">
          AshishOS 1.0.0&nbsp; · &nbsp;kernel 18.2
        </p>
      </div>
    </div>
  );
}

function StatusPill({ color, label }: { color: string; label: string }): JSX.Element {
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-[#555]">
      <span
        className="h-1.5 w-1.5 animate-pulse rounded-full"
        style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
        aria-hidden="true"
      />
      {label}
    </span>
  );
}

function HudCorner({
  position,
}: {
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}): JSX.Element {
  const classes: Record<typeof position, string> = {
    "top-left": "left-5 top-5 border-l border-t",
    "top-right": "right-5 top-5 border-r border-t",
    "bottom-left": "bottom-5 left-5 border-b border-l",
    "bottom-right": "bottom-5 right-5 border-b border-r",
  };

  return (
    <span
      className={[
        "absolute h-[30px] w-[30px] border-green/25",
        classes[position],
      ].join(" ")}
      aria-hidden="true"
    />
  );
}
