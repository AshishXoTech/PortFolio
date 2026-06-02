"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface BootScreenProps {
  onBootComplete: () => void;
}

type BootStage = "bios" | "matrix" | "kernel" | "reveal" | "done";
type BootTag = "BOOT" | "INFO" | "OK" | "WARN" | ">>";

interface BootLine {
  delay: number;
  description: string;
  tag: BootTag;
}

interface MatrixDrop {
  alpha: number;
  char: string;
  layer: "front" | "mid" | "back";
  speed: number;
  x: number;
  y: number;
}

const BIOS_LINES = [
  "AshishOS UEFI BIOS v2.4.1",
  "Copyright (C) 2024 AshishXoTech. All Rights Reserved.",
  "",
  "CPU: BrainProcessor @ 3.60GHz",
  "Memory Test: 8192MB OK",
  "Drive: /dev/portfolio 500GB SSD",
  "",
  "Press DEL to enter Setup | Press F12 for Boot Menu",
];

const BOOT_LINES: BootLine[] = [
  { delay: 0, tag: "BOOT", description: "AshishOS Linux 6.1.0 (tty1)" },
  { delay: 0, tag: "INFO", description: "Kernel: 6.1.0-ashish-amd64 #1 SMP" },
  { delay: 200, tag: "OK", description: "Started systemd-journald.service - Journal Service" },
  { delay: 200, tag: "OK", description: "Mounted /proc - Kernel Virtual File System" },
  { delay: 200, tag: "OK", description: "Mounted /sys - Kernel System Information" },
  { delay: 400, tag: "OK", description: "Started udev - Device Manager" },
  { delay: 400, tag: "OK", description: "Reached target Local File Systems (Pre)" },
  { delay: 400, tag: "OK", description: "Started Dispatch Password Requests" },
  { delay: 600, tag: "INFO", description: "Detected hardware: BrainProcessor 3.6GHz (chai-cooled)" },
  { delay: 600, tag: "OK", description: "Memory: 8192MB DDR4 - All channels operational" },
  { delay: 600, tag: "OK", description: "Storage: /dev/portfolio 500GB NVMe SSD" },
  { delay: 900, tag: "OK", description: "Started Network Manager" },
  { delay: 900, tag: "OK", description: "Connected to: github.com" },
  { delay: 900, tag: "OK", description: "Connected to: ashish863863@gmail.com" },
  { delay: 1100, tag: "INFO", description: "Loading development environment..." },
  { delay: 1100, tag: ">>", description: "Mounting /usr/stack/frontend - React 18, Next.js 14" },
  { delay: 1100, tag: ">>", description: "Mounting /usr/stack/backend  - Node.js 18, FastAPI" },
  { delay: 1100, tag: ">>", description: "Mounting /usr/stack/database - MongoDB, PostgreSQL, Redis" },
  { delay: 1100, tag: ">>", description: "Mounting /usr/stack/devops   - Docker, Git, Postman" },
  { delay: 1100, tag: ">>", description: "Mounting /usr/stack/ai       - OpenAI API, LLM pipeline" },
  { delay: 1500, tag: "OK", description: "All stack modules loaded" },
  { delay: 1500, tag: "WARN", description: "/learning/java       45% compiled - still building" },
  { delay: 1500, tag: "WARN", description: "/learning/dsa        50% compiled - still building" },
  { delay: 1500, tag: "WARN", description: "/learning/sysdesign  40% compiled - in progress" },
  { delay: 1800, tag: "INFO", description: "Loading portfolio data..." },
  { delay: 1800, tag: "OK", description: "Projects: HackFlow AI, Rakshak, AI Credit Advisor" },
  { delay: 1800, tag: "OK", description: "Achievements: 3x Wins, 2x National, 1x International" },
  { delay: 1800, tag: "OK", description: "CGPA: 8.0/10 - acceptable" },
  { delay: 2200, tag: "OK", description: "Started AshishOS Portfolio Service" },
  { delay: 2200, tag: "OK", description: "All services operational" },
  { delay: 2200, tag: "INFO", description: "System ready. Launching display manager..." },
  { delay: 2200, tag: ">>", description: "Starting AshishOS Desktop Environment..." },
];

const TAG_COLORS: Record<BootTag, string> = {
  ">>": "#888",
  BOOT: "#00bfff",
  INFO: "#7c3aed",
  OK: "#00ff41",
  WARN: "#f59e0b",
};

const MATRIX_CHARS = [
  "01001000",
  "01101001",
  "ア",
  "イ",
  "ウ",
  "エ",
  "オ",
  "カ",
  "キ",
  "ク",
  "ケ",
  "コ",
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
  "||",
  "=>",
  "++",
  "--",
];

const GLITCH_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$%&";

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function isMobileViewport(): boolean {
  return typeof window !== "undefined" && window.innerWidth < 768;
}

export default function BootScreen({ onBootComplete }: BootScreenProps): JSX.Element {
  const [stage, setStage] = useState<BootStage>("bios");
  const [visibleLines, setVisibleLines] = useState(0);
  const [matrixOpacity, setMatrixOpacity] = useState(1);
  const [revealText, setRevealText] = useState("########");
  const [flash, setFlash] = useState(false);
  const [showSkipHint, setShowSkipHint] = useState(false);
  const [timestamp, setTimestamp] = useState("");
  const [accentPulse, setAccentPulse] = useState<"green" | "amber" | null>(null);
  const completedRef = useRef(false);
  const timeoutsRef = useRef<number[]>([]);
  const intervalsRef = useRef<number[]>([]);

  const clearAllTimers = useCallback(() => {
    timeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    intervalsRef.current.forEach((intervalId) => window.clearInterval(intervalId));
    timeoutsRef.current = [];
    intervalsRef.current = [];
  }, []);

  const completeBoot = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    clearAllTimers();
    setStage("done");
    onBootComplete();
  }, [clearAllTimers, onBootComplete]);

  const schedule = useCallback((callback: () => void, delay: number) => {
    const timeoutId = window.setTimeout(callback, delay);
    timeoutsRef.current.push(timeoutId);
    return timeoutId;
  }, []);

  useEffect(() => {
    const updateTimestamp = () => {
      const date = new Date();
      const formattedDate = new Intl.DateTimeFormat("en-CA", {
        day: "2-digit",
        month: "2-digit",
        timeZone: "Asia/Kolkata",
        year: "numeric",
      }).format(date);
      const formattedTime = new Intl.DateTimeFormat("en-IN", {
        hour: "2-digit",
        hour12: false,
        minute: "2-digit",
        second: "2-digit",
        timeZone: "Asia/Kolkata",
      }).format(date);
      setTimestamp(`${formattedDate} ${formattedTime}`);
    };

    updateTimestamp();
    const intervalId = window.setInterval(updateTimestamp, 1000);
    intervalsRef.current.push(intervalId);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const mobile = isMobileViewport();
    if (mobile) setStage("matrix");

    schedule(() => setShowSkipHint(true), 1000);

    if (!mobile) {
      schedule(() => setFlash(true), 600);
      schedule(() => {
        setFlash(false);
        setStage("matrix");
      }, 650);
      schedule(() => setMatrixOpacity(0), 1800);
      schedule(() => setStage("kernel"), 2400);
      schedule(() => setStage("reveal"), 5200);
      schedule(completeBoot, 6800);
    } else {
      schedule(() => setMatrixOpacity(0), 1200);
      schedule(() => setStage("kernel"), 1400);
      schedule(() => setStage("reveal"), 3200);
      schedule(completeBoot, 4300);
    }

    return clearAllTimers;
  }, [clearAllTimers, completeBoot, schedule]);

  useEffect(() => {
    const handleSkip = () => completeBoot();
    window.addEventListener("click", handleSkip);
    window.addEventListener("keydown", handleSkip);

    return () => {
      window.removeEventListener("click", handleSkip);
      window.removeEventListener("keydown", handleSkip);
    };
  }, [completeBoot]);

  useEffect(() => {
    if (stage !== "kernel") {
      if (stage !== "reveal") setVisibleLines(0);
      return;
    }

    BOOT_LINES.forEach((line, index) => {
      schedule(() => {
        setVisibleLines(index + 1);
        setAccentPulse(line.tag === "WARN" ? "amber" : "green");
        schedule(() => setAccentPulse(null), 120);
      }, line.delay);
    });
  }, [schedule, stage]);

  useEffect(() => {
    if (stage !== "reveal") return undefined;

    setVisibleLines(BOOT_LINES.length);
    setFlash(true);
    schedule(() => setFlash(false), 300);

    let ticks = 0;
    const intervalId = window.setInterval(() => {
      ticks += 1;
      if (ticks < 7) {
        setRevealText(
          Array.from({ length: 8 }, () =>
            GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)] ?? "#"
          ).join("")
        );
      } else {
        setRevealText("ASHISHOS");
        window.clearInterval(intervalId);
      }
    }, 38);

    intervalsRef.current.push(intervalId);
    return () => window.clearInterval(intervalId);
  }, [schedule, stage]);

  const progress = Math.round((visibleLines / BOOT_LINES.length) * 100);
  const showHud = stage === "kernel" || stage === "reveal";

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden bg-black font-mono text-[#c8c8c8]">
      {(stage === "matrix" || stage === "kernel") && (
        <MatrixCanvas opacity={stage === "kernel" ? 0.04 : matrixOpacity} />
      )}

      {stage === "bios" && (
        <div className="absolute inset-0 bg-black p-6 text-xs leading-relaxed text-[#c8c8c8]">
          {BIOS_LINES.map((line, index) => (
            <p key={`${line}-${index}`}>{line || "\u00A0"}</p>
          ))}
        </div>
      )}

      {stage === "matrix" && <MatrixGlitchBars />}

      {showHud && <BootHud timestamp={timestamp} />}

      {stage === "kernel" && (
        <div className="absolute inset-0 flex items-center justify-center px-4 py-10">
          <div className="boot-kernel-panel relative w-full max-w-[700px] px-6 py-8 md:px-10">
            <div
              className={[
                "absolute bottom-8 left-0 top-8 w-[3px] bg-[#00ff41]/30",
                accentPulse === "green" ? "boot-accent-pulse-green" : "",
                accentPulse === "amber" ? "boot-accent-pulse-amber" : "",
              ].join(" ")}
              aria-hidden="true"
            />
            <span className="absolute right-6 top-4 font-mono text-[9px] text-[#00ff41]/20">
              [{String(visibleLines).padStart(2, "0")}/{BOOT_LINES.length}]
            </span>
            <div className="relative z-10 space-y-1 text-[11px] leading-relaxed md:text-xs">
              {BOOT_LINES.slice(0, visibleLines).map((line, index) => (
                <BootLineView key={`${line.description}-${index}`} line={line} />
              ))}
            </div>
          </div>
        </div>
      )}

      {stage === "reveal" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black text-center">
          <div className="boot-scan-sweep" aria-hidden="true" />
          <h1 className="boot-ready-title font-mono text-[clamp(56px,10vw,80px)] font-black leading-none tracking-[-0.02em] text-[#00ff41]">
            {revealText}
          </h1>
          <p className="mt-4 font-mono text-sm text-[#555]">v1.0.0 - SYSTEM READY</p>
        </div>
      )}

      {flash && <div className="boot-flash absolute inset-0 bg-[#00ff41]/[0.08]" />}

      <div className="boot-crt-overlay pointer-events-none fixed inset-0" aria-hidden="true" />
      <div className="boot-vignette pointer-events-none fixed inset-0" aria-hidden="true" />

      <div
        className={[
          "fixed bottom-5 right-5 font-mono text-[9px] text-white/10 transition-opacity duration-500",
          showSkipHint ? "opacity-100" : "opacity-0",
        ].join(" ")}
      >
        click anywhere to skip
      </div>

      {stage === "kernel" && (
        <div className="fixed bottom-0 left-0 right-0 h-0.5 bg-white/[0.03]">
          <div
            className="h-full bg-[#00ff41] transition-[width] duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}

function BootLineView({ line }: { line: BootLine }): JSX.Element {
  return (
    <p className="boot-line whitespace-pre-wrap">
      <span style={{ color: TAG_COLORS[line.tag] }}>
        [{line.tag.padStart(4, " ")}]
      </span>
      <span className="boot-line-description ml-2">{line.description}</span>
    </p>
  );
}

function BootHud({ timestamp }: { timestamp: string }): JSX.Element {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 font-mono text-[9px] text-[#00ff41]/15">
      <div className="absolute left-5 top-5">ASHISHOS BOOT SEQUENCE</div>
      <div className="absolute right-5 top-5 text-right text-[#00ff41]/[0.12]">
        {timestamp}
      </div>
      <div className="absolute bottom-5 left-5 text-[#00ff41]/[0.12]">
        kernel: 6.1.0-ashish-amd64
      </div>
      <div className="absolute bottom-5 right-5 text-right text-[#00ff41]/[0.12]">
        tty1 - 1920x1080 - 60Hz
      </div>
    </div>
  );
}

function MatrixCanvas({ opacity }: { opacity: number }): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const dropsRef = useRef<MatrixDrop[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    const createDrops = (width: number, height: number) => {
      const mobile = width < 768;
      const count = mobile ? 60 : 120;
      dropsRef.current = Array.from({ length: count }, (_, index) => {
        const depth = index % 10;
        const layer = depth === 0 ? "front" : depth < 4 ? "mid" : "back";
        return {
          alpha: layer === "front" ? 1 : layer === "mid" ? 0.5 : 0.15,
          char: MATRIX_CHARS[index % MATRIX_CHARS.length] ?? "0",
          layer,
          speed:
            layer === "front"
              ? randomBetween(4, 6)
              : layer === "mid"
                ? randomBetween(2, 3.5)
                : randomBetween(1, 2),
          x: randomBetween(0, width),
          y: randomBetween(-height, height),
        };
      });
    };

    const resize = () => {
      const pixelRatio = Math.min(2, window.devicePixelRatio || 1);
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = Math.floor(width * pixelRatio);
      canvas.height = Math.floor(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      createDrops(width, height);
    };

    const draw = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      ctx.fillStyle = "rgba(0,0,0,0.06)";
      ctx.fillRect(0, 0, width, height);
      ctx.font = '12px "JetBrains Mono", monospace';
      ctx.textBaseline = "top";

      dropsRef.current.forEach((drop, index) => {
        const color =
          drop.layer === "front"
            ? `rgba(0,255,65,${drop.alpha})`
            : drop.layer === "mid"
              ? `rgba(0,255,65,${drop.alpha})`
              : `rgba(0,200,50,${drop.alpha})`;
        ctx.fillStyle = color;
        ctx.fillText(drop.char, drop.x, drop.y);
        drop.y += drop.speed;

        if (drop.y > height + 20) {
          drop.y = randomBetween(-200, -20);
          drop.x = randomBetween(0, width);
          drop.char = MATRIX_CHARS[(index + Math.floor(Math.random() * MATRIX_CHARS.length)) % MATRIX_CHARS.length] ?? "0";
        }
      });

      animationRef.current = window.requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    animationRef.current = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 transition-opacity duration-700"
      style={{ opacity }}
      aria-hidden="true"
    />
  );
}

function MatrixGlitchBars(): JSX.Element {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      {Array.from({ length: 5 }, (_, index) => (
        <span
          key={`glitch-${index}`}
          className="boot-glitch-bar"
          style={{
            animationDelay: `${1.2 + index * 0.06}s`,
            top: `${18 + ((index * 17) % 58)}%`,
          }}
        />
      ))}
    </div>
  );
}
