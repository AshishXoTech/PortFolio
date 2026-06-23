"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type EntryStage = "auth" | "breach" | "tunnel" | "systems" | "welcome";

interface EntrySequenceProps {
  onComplete: () => void;
}

// ----------------------------------------------------
// Core configuration
// ----------------------------------------------------
const STAGE_TIMELINE = {
  auth: 0,
  breach: 2000,
  tunnel: 4500,
  systems: 7000,
  welcome: 9500,
  complete: 11500,
};

const CODE_CHARS = [
  "0", "1", "{", "}", "[", "]", "<", ">", "/", "=", "fn", "if", "&&", "||", "=>", 
  "class", "const", "let", "return", "import", "export", "await", "async"
];

// Helper to get random item
const randomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export function EntrySequence({ onComplete }: EntrySequenceProps): JSX.Element {
  const [stage, setStage] = useState<EntryStage>("auth");
  const [initPercent, setInitPercent] = useState(0);
  const [sysPercent, setSysPercent] = useState(47);
  const [warningText, setWarningText] = useState<string | null>(null);
  const [warningType, setWarningType] = useState<"warn" | "ok" | null>(null);
  const [heartbeatJagged, setHeartbeatJagged] = useState(false);
  const [welcomeActive, setWelcomeActive] = useState(false);
  const [centerPhaseText, setCenterPhaseText] = useState("ENTERING SYSTEM...");
  const [tunnelTypedText, setTunnelTypedText] = useState("");
  const [isSkipped, setIsSkipped] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const stageStartTimes = useRef<Record<string, number>>({});
  
  // Refs for tracking timeouts to clean them up on unmount
  const timelineTimeouts = useRef<number[]>([]);

  useEffect(() => {
    stageStartTimes.current[stage] = performance.now();
  }, [stage]);

  // ----------------------------------------------------
  // Skip functionality
  // ----------------------------------------------------
  const handleSkip = useCallback(() => {
    if (isSkipped) return;
    setIsSkipped(true);
    setStage("welcome");
    setWelcomeActive(true);
    
    // Clear all existing stage timeouts!
    timelineTimeouts.current.forEach((t) => window.clearTimeout(t));
    
    // Set a single timeout to complete the sequence in 600ms
    const skipCompleteTimeout = window.setTimeout(() => {
      onComplete();
    }, 600);
    timelineTimeouts.current = [skipCompleteTimeout];
  }, [isSkipped, onComplete]);

  useEffect(() => {
    const handleKeyDown = () => {
      handleSkip();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleSkip]);

  // ----------------------------------------------------
  // Stage state machine timeline
  // ----------------------------------------------------
  useEffect(() => {
    if (isSkipped) return;

    // Setup timeline timeouts
    const timeouts = [
      window.setTimeout(() => setStage("breach"), STAGE_TIMELINE.breach),
      window.setTimeout(() => setStage("tunnel"), STAGE_TIMELINE.tunnel),
      window.setTimeout(() => setStage("systems"), STAGE_TIMELINE.systems),
      window.setTimeout(() => setStage("welcome"), STAGE_TIMELINE.welcome),
      window.setTimeout(() => onComplete(), STAGE_TIMELINE.complete),
    ];
    timelineTimeouts.current = timeouts;

    // Default text phases in Stage 2 (breach)
    const phaseTimeout1 = window.setTimeout(() => {
      setCenterPhaseText("ENTE??NG SY5TEM...");
    }, STAGE_TIMELINE.breach + 800); // 2800ms

    const phaseTimeout2 = window.setTimeout(() => {
      setCenterPhaseText("LOADING UNIVERSE");
    }, STAGE_TIMELINE.breach + 800 + 400 + 600); // 3800ms

    // Warning / confirmation flashes in Stage 2 (breach)
    const warnTimeout1 = window.setTimeout(() => {
      setWarningText("[WARN] Unauthorized access detected");
      setWarningType("warn");
    }, STAGE_TIMELINE.breach + 100); // 2100ms

    const warnTimeout2 = window.setTimeout(() => {
      setWarningText("[OK] Identity confirmed: ashish@portfolio");
      setWarningType("ok");
    }, STAGE_TIMELINE.breach + 100 + 1200 + 400); // 3700ms

    const warnTimeout3 = window.setTimeout(() => {
      setWarningText(null);
      setWarningType(null);
    }, STAGE_TIMELINE.breach + 100 + 1200 + 400 + 1000); // 4700ms

    // Heartbeat state (glitchy during breach)
    const heartbeatTimeout1 = window.setTimeout(() => {
      setHeartbeatJagged(true);
    }, STAGE_TIMELINE.breach);

    const heartbeatTimeout2 = window.setTimeout(() => {
      setHeartbeatJagged(false);
    }, STAGE_TIMELINE.tunnel);

    timelineTimeouts.current.push(
      phaseTimeout1,
      phaseTimeout2,
      warnTimeout1,
      warnTimeout2,
      warnTimeout3,
      heartbeatTimeout1,
      heartbeatTimeout2
    );

    // Welcome logo state
    const welcomeTimeout = window.setTimeout(() => {
      setWelcomeActive(true);
    }, STAGE_TIMELINE.welcome + 1300); // 10800ms
    timelineTimeouts.current.push(welcomeTimeout);

    return () => {
      timelineTimeouts.current.forEach((t) => window.clearTimeout(t));
    };
  }, [onComplete, isSkipped]);

  // Typing effect for Stage 3 - Tunnel
  useEffect(() => {
    if (stage === "tunnel") {
      setTunnelTypedText("");
      const text = "INITIALIZING ASHISHOS";
      let idx = 0;
      const interval = window.setInterval(() => {
        idx++;
        setTunnelTypedText(text.slice(0, idx));
        if (idx >= text.length) {
          window.clearInterval(interval);
        }
      }, 80); // 80ms per letter
      return () => window.clearInterval(interval);
    }
  }, [stage]);

  // ----------------------------------------------------
  // Counters and UI updates
  // ----------------------------------------------------
  useEffect(() => {
    // Left counter (INIT: 0% -> 100% over Stage 1)
    const leftInterval = window.setInterval(() => {
      setInitPercent((prev) => {
        if (prev >= 100) {
          window.clearInterval(leftInterval);
          return 100;
        }
        return prev + 5;
      });
    }, 100); // 100ms * 20 steps = 2000ms

    // Right counter (SYS: random fluctuating number)
    const rightInterval = window.setInterval(() => {
      setSysPercent(() => Math.floor(40 + Math.random() * 20));
    }, 400); // Fluctuate every 400ms

    return () => {
      window.clearInterval(leftInterval);
      window.clearInterval(rightInterval);
    };
  }, []);

  // ----------------------------------------------------
  // Canvas rendering system
  // ----------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const resize = () => {
      if (!canvas) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    // --------------------------------------------------
    // Particle / Matrix / Tunnel states
    // --------------------------------------------------
    
    // Matrix initialization
    const columnsCount = Math.min(width < 768 ? 100 : 200, 200);
    const matrixY = Array(columnsCount).fill(0).map(() => Math.random() * -800);
    const matrixLayers = Array(columnsCount).fill(0).map(() => Math.floor(Math.random() * 3));
    
    const getSpeedForLayer = (layer: number) => {
      if (layer === 0) return 1.5;
      if (layer === 1) return 3;
      return 5;
    };
    const matrixSpeeds = Array(columnsCount).fill(0).map((_, i) => getSpeedForLayer(matrixLayers[i]));
    
    // Glitch lines variables
    let lastGlitchTime = 0;
    const glitchLines: Array<{ y: number; h: number; opacity: number }> = [];

    // Tunnel rings
    let tunnelZoom = 0;

    // Tunnel particles
    const particleCount = width < 768 ? 150 : 500;
    const tunnelParticles = Array.from({ length: particleCount }, () => ({
      x: (Math.random() - 0.5) * 800,
      y: (Math.random() - 0.5) * 800,
      z: Math.random() * 1000,
      color: Math.random() > 0.45 ? "#00ff41" : Math.random() > 0.5 ? "#7c3aed" : "#ffffff",
      speed: 4, // slowed down to 4 for cinematic depth
    }));

    // --------------------------------------------------
    // Animation frame tick
    // --------------------------------------------------
    const render = (time: number) => {
      // Get current stage at render time (via ref or direct closure variable)
      // We will access stage variable from state. Since the render closure keeps the initial stage,
      // we need to query the current stage. A neat trick is reading the data attribute of the container.
      const currentStage = (canvas.parentElement?.dataset.stage as EntryStage) || "auth";

      // 1. Auth Granted Stage: Black background
      if (currentStage === "auth") {
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, width, height);
      }
      
      // 2. Matrix Breach Stage: Heavy code rain & glitch effects
      else if (currentStage === "breach") {
        ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
        ctx.fillRect(0, 0, width, height);

        // Code rain columns
        ctx.font = "bold 13px JetBrains Mono, monospace";
        for (let i = 0; i < columnsCount; i++) {
          const x = (width / columnsCount) * i;
          matrixY[i] += matrixSpeeds[i];

          if (matrixY[i] > height + 200) {
            matrixY[i] = -20;
            matrixSpeeds[i] = getSpeedForLayer(matrixLayers[i]);
          }

          // Render layers
          const layer = matrixLayers[i];
          let alpha = 0.9;
          let fontSize = 14;

          if (layer === 0) { // Back
            alpha = 0.25;
            fontSize = 9;
          } else if (layer === 1) { // Mid
            alpha = 0.55;
            fontSize = 11;
          }

          ctx.font = `bold ${fontSize}px JetBrains Mono, monospace`;
          ctx.fillStyle = `rgba(0, 255, 65, ${alpha})`;
          
          const char = randomItem(CODE_CHARS);
          ctx.fillText(char, x, matrixY[i]);

          // Tiny glowing head
          if (Math.random() > 0.6) {
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.fillText(char, x, matrixY[i]);
          }
        }

        // Glitch Storm (horizontal bars)
        if (time - lastGlitchTime > 200) {
          lastGlitchTime = time;
          glitchLines.length = 0;
          if (Math.random() > 0.3) {
            const count = 1 + Math.floor(Math.random() * 3);
            for (let g = 0; g < count; g++) {
              glitchLines.push({
                y: Math.random() * height,
                h: 3 + Math.random() * 5,
                opacity: 0.15 + Math.random() * 0.4,
              });
            }
          }
        }

        if (time - lastGlitchTime <= 150) {
          glitchLines.forEach((line) => {
            ctx.fillStyle = `rgba(0, 255, 65, ${line.opacity})`;
            ctx.fillRect(0, line.y, width, line.h);
          });
        }

        // Scan lines sweeping downward (time-based)
        const elapsedBreach = time - (stageStartTimes.current["breach"] || 0);
        ctx.fillStyle = "rgba(0, 255, 65, 0.5)";
        for (let i = 0; i < 3; i++) {
          const sweepStart = i * 1100;
          const sweepEnd = sweepStart + 600;
          if (elapsedBreach >= sweepStart && elapsedBreach <= sweepEnd) {
            const progress = (elapsedBreach - sweepStart) / 600;
            const y = progress * height;
            ctx.fillRect(0, y, width, 2);
            // Glow
            const gradient = ctx.createLinearGradient(0, y - 15, 0, y + 15);
            gradient.addColorStop(0, "rgba(0, 255, 65, 0)");
            gradient.addColorStop(0.5, "rgba(0, 255, 65, 0.25)");
            gradient.addColorStop(1, "rgba(0, 255, 65, 0)");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, y - 15, width, 30);
          }
        }
      }
      
      // 3. Tunnel / Wormhole Stage
      else if (currentStage === "tunnel") {
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, width, height);

        const centerX = width / 2;
        const centerY = height / 2;
        const maxRadius = Math.max(width, height) * 0.8;

        // Skip tunnel animation on mobile for performance
        const isMobile = width < 768;

        if (!isMobile) {
          // Draw Concentric Rings Zooming In
          tunnelZoom += 0.008;
          const ringCount = 25;
          ctx.lineWidth = 1.5;

          for (let r = 0; r < ringCount; r++) {
            const progress = ((r / ringCount) + tunnelZoom) % 1;
            const radius = maxRadius * progress;
            
            // Outer fade, inner bright
            let ringAlpha = 0.05;
            if (progress < 0.2) {
              ringAlpha = progress * 4.5; // Fades in near center
            } else if (progress < 0.8) {
              ringAlpha = 0.15 + (1 - progress) * 0.3;
            } else {
              ringAlpha = (1 - progress) * 0.2;
            }

            ctx.strokeStyle = `rgba(0, 255, 65, ${ringAlpha})`;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.stroke();

            // Draw code characters along the rings
            if (r % 3 === 0 && radius > 40) {
              ctx.font = "9px JetBrains Mono, monospace";
              ctx.fillStyle = `rgba(0, 255, 65, ${ringAlpha * 0.75})`;
              const char = CODE_CHARS[r % CODE_CHARS.length];
              const charAngle = (time * 0.0003 + r * 1.5) % (Math.PI * 2);
              const cx = centerX + Math.cos(charAngle) * radius;
              const cy = centerY + Math.sin(charAngle) * radius;
              ctx.save();
              ctx.translate(cx, cy);
              ctx.rotate(charAngle + Math.PI / 2);
              ctx.fillText(char, 0, 0);
              ctx.restore();
            }
          }
        }

        // Draw Tunnel Particles flying towards viewer (in 3D space)
        tunnelParticles.forEach((p) => {
          p.z -= p.speed;
          if (p.z <= 1) {
            p.z = 1000;
            p.x = (Math.random() - 0.5) * width * 0.8;
            p.y = (Math.random() - 0.5) * height * 0.8;
          }

          // Projection to 2D
          const px = centerX + (p.x / p.z) * 500;
          const py = centerY + (p.y / p.z) * 500;

          if (px > 0 && px < width && py > 0 && py < height) {
            // Close particles are larger and brighter
            const scale = (1 - p.z / 1000);
            const size = Math.max(0.5, scale * 3.5);
            const alpha = Math.max(0.1, scale * 0.95);

            ctx.beginPath();
            ctx.fillStyle = p.color === "#ffffff" ? `rgba(255,255,255,${alpha})` : p.color === "#7c3aed" ? `rgba(124,58,237,${alpha})` : `rgba(0,255,65,${alpha})`;
            ctx.arc(px, py, size, 0, Math.PI * 2);
            ctx.fill();

            // Focal dot glow for close particles
            if (p.z < 150) {
              ctx.beginPath();
              ctx.fillStyle = "rgba(0, 255, 65, 0.05)";
              ctx.arc(px, py, size * 4, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        });

        // Center focal point breathing glow
        const glowSize = 40 + Math.sin(time * 0.01) * 8;
        ctx.beginPath();
        const centerGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, glowSize);
        centerGradient.addColorStop(0, "#ffffff");
        centerGradient.addColorStop(0.15, "rgba(0, 255, 65, 0.8)");
        centerGradient.addColorStop(0.5, "rgba(0, 255, 65, 0.25)");
        centerGradient.addColorStop(1, "rgba(0, 255, 65, 0)");
        ctx.fillStyle = centerGradient;
        ctx.arc(centerX, centerY, glowSize, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // 4. Systems Loading Stage: faint matrix rain
      else if (currentStage === "systems") {
        ctx.fillStyle = "rgba(5, 5, 16, 0.15)";
        ctx.fillRect(0, 0, width, height);

        ctx.font = "9px JetBrains Mono, monospace";
        ctx.fillStyle = "rgba(0, 255, 65, 0.04)";
        for (let i = 0; i < columnsCount; i += 2) {
          const x = (width / columnsCount) * i;
          matrixY[i] += matrixSpeeds[i] * 0.4;

          if (matrixY[i] > height) {
            matrixY[i] = -20;
          }

          const char = randomItem(CODE_CHARS);
          ctx.fillText(char, x, matrixY[i]);
        }
      }
      
      // 5. Welcome Reveal Stage: fully dark, waiting for reveal
      else if (currentStage === "welcome") {
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, width, height);
      }

      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div
      data-stage={stage}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-black font-mono text-[#e8e8f0]"
    >
      {/* Self-contained CSS for high performance GPU transitions */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes collapse-inward {
          0% { transform: scale(1); opacity: 1; filter: blur(0); }
          100% { transform: scale(0.25); opacity: 0; filter: blur(12px); }
        }

        @keyframes green-flash-anim {
          0% { opacity: 0; background-color: #00ff41; }
          22.2% { opacity: 1; background-color: #00ff41; }
          55.6% { opacity: 1; background-color: #00ff41; }
          100% { opacity: 0; background-color: transparent; }
        }

        @keyframes access-granted-anim {
          0% { transform: scale(0.85); opacity: 0; letter-spacing: 0.1em; }
          13.3% { transform: scale(1); opacity: 1; letter-spacing: 0.3em; }
          80% { transform: scale(1.02); opacity: 1; letter-spacing: 0.32em; }
          100% { transform: scale(1.05); opacity: 0; letter-spacing: 0.35em; filter: blur(4px); }
        }

        @keyframes white-flash-anim {
          0% { opacity: 0; }
          30% { opacity: 1; }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }

        @keyframes skip-progress-fill {
          0% { width: 0%; }
          100% { width: 100%; }
        }

        @keyframes slide-in-left {
          0% { transform: translateX(-300px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }

        @keyframes slide-in-right {
          0% { transform: translateX(300px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }

        @keyframes read-out-type {
          from { width: 0; }
          to { width: 100%; }
        }

        @keyframes red-mesh-scatter {
          0% { transform: translate(0, 0) scale(1) rotate(0deg); opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) scale(0) rotate(var(--rot)); opacity: 0; }
        }

        @keyframes text-glitch {
          0%, 100% { clip-path: inset(0 0 0 0); transform: translate(0); }
          10% { clip-path: inset(10% 0 80% 0); transform: translate(-3px, -2px); }
          20% { clip-path: inset(40% 0 20% 0); transform: translate(3px, 2px); }
          30% { clip-path: inset(80% 0 5% 0); transform: translate(-2px, 3px); }
          40% { clip-path: inset(5% 0 90% 0); transform: translate(2px, -3px); }
          50% { clip-path: inset(60% 0 10% 0); transform: translate(-3px, 2px); }
        }

        @keyframes hud-circle-rotate-inner {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }

        @keyframes hud-circle-rotate-mid {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(-360deg); }
        }

        @keyframes hud-circle-rotate-outer {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }

        @keyframes amber-flash {
          0%, 100% { background: transparent; }
          50% { background: rgba(245, 158, 11, 0.08); }
        }

        @keyframes ecg-dash {
          to { stroke-dashoffset: -100; }
        }

        @keyframes panel-stagger-in {
          0% { transform: scale(0.85); opacity: 0; filter: blur(8px); }
          100% { transform: scale(1); opacity: 1; filter: blur(0); }
        }

        @keyframes line-draw {
          to { stroke-dashoffset: 0; }
        }

        @keyframes welcome-letter-assemble {
          0% { transform: translate(var(--lx), var(--ly)) scale(2); opacity: 0; filter: blur(10px); }
          100% { transform: translate(0, 0) scale(1); opacity: 1; filter: blur(0); }
        }

        @keyframes welcome-pulse {
          0% { text-shadow: 0 0 10px rgba(0, 255, 65, 0.4); }
          30% { text-shadow: 0 0 35px rgba(0, 255, 65, 1), 0 0 70px rgba(0, 255, 65, 0.6); transform: scale(1.03); }
          70% { text-shadow: 0 0 35px rgba(0, 255, 65, 1), 0 0 70px rgba(0, 255, 65, 0.6); transform: scale(1.03); }
          100% { text-shadow: 0 0 15px rgba(0, 255, 65, 0.4); }
        }

        @keyframes sweep-horizontal {
          0% { left: -100%; }
          100% { left: 200%; }
        }

        @keyframes panel-flash-collapse {
          0% { transform: scale(1); opacity: 1; filter: brightness(1); }
          40% { transform: scale(1.05); opacity: 1; filter: brightness(3); }
          100% { transform: scale(0.1); opacity: 0; filter: brightness(5) blur(10px); }
        }

        @keyframes final-welcome-fadeout {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }

        .welcome-letter {
          display: inline-block;
          animation: welcome-letter-assemble 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }

        .welcome-pulse-active {
          animation: welcome-pulse 1s ease-in-out forwards;
        }

        .welcome-pulse-active-skipped {
          animation: welcome-pulse 0.3s ease-in-out forwards;
        }

        .ecg-line {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: line-draw 3s linear infinite;
        }

        /* Arc reactor HUD cuts */
        .hud-circle-arc {
          position: absolute;
          top: 50%;
          left: 50%;
          border: 1px solid rgba(0, 255, 65, 0.12);
          border-radius: 50%;
          pointer-events: none;
        }

        .hud-circle-arc-1 {
          width: 200px;
          height: 200px;
          border-top-color: transparent;
          border-bottom-color: transparent;
          animation: hud-circle-rotate-inner 8s linear infinite;
        }

        .hud-circle-arc-2 {
          width: 400px;
          height: 400px;
          border-left-color: transparent;
          border-right-color: transparent;
          animation: hud-circle-rotate-mid 14s linear infinite;
        }

        .hud-circle-arc-3 {
          width: 700px;
          height: 700px;
          border-top-color: transparent;
          border-left-color: transparent;
          animation: hud-circle-rotate-outer 24s linear infinite;
        }
      ` }} />

      {/* Main Canvas Background */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 h-full w-full pointer-events-none" />

      {/* Circular HUD Arc Reactor Rings (Stage 2 and 3) */}
      {(stage === "breach" || stage === "tunnel") && (
        <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
          <div className="hud-circle-arc hud-circle-arc-1" />
          <div className="hud-circle-arc hud-circle-arc-2" />
          <div className="hud-circle-arc hud-circle-arc-3" />
        </div>
      )}

      {/* -------------------------------------------------- */}
      {/* STAGE 1: AUTH GRANTED (0ms - 2000ms) */}
      {/* -------------------------------------------------- */}
      {stage === "auth" && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          {/* Card collapsing shell */}
          <div 
            className="w-[min(380px,calc(100vw-32px))] rounded-[24px] border border-white/[0.05] bg-[rgba(5,5,16,0.85)] p-9 shadow-[0_0_80px_rgba(124,58,237,0.05)]"
            style={{
              animation: "collapse-inward 0.8s cubic-bezier(0.4, 0, 1, 1) forwards",
            }}
          >
            <div className="mb-5 flex justify-center">
              <div className="h-[100px] w-[100px] rounded-full bg-white/[0.02] border border-green/20" />
            </div>
            <div className="h-6 w-32 mx-auto bg-white/[0.03] rounded mb-2" />
            <div className="h-4 w-48 mx-auto bg-white/[0.02] rounded mb-8" />
            <div className="h-10 w-full bg-green/10 rounded" />
          </div>

          {/* Green flash overlay */}
          <div 
            className="absolute inset-0 z-30 opacity-0"
            style={{
              animation: "green-flash-anim 0.9s linear 0.8s forwards",
            }}
          />

          {/* ACCESS GRANTED overlay */}
          <div 
            className="absolute z-40 font-mono text-[28px] md:text-[48px] font-black uppercase tracking-[0.3em] text-[#050510]"
            style={{
              animation: "access-granted-anim 1.5s cubic-bezier(0.19, 1, 0.22, 1) 0.8s forwards",
              color: "#00ff41",
            }}
          >
            ACCESS GRANTED
          </div>
        </div>
      )}

      {/* Side Readout Panels (Stage 1 & 2) */}
      {(stage === "auth" || stage === "breach") && (
        <>
          {/* Left panel */}
          <aside 
            className="absolute left-0 top-0 bottom-0 z-20 hidden w-[300px] border-r border-green/20 bg-green/[0.015] p-6 backdrop-blur-[6px] md:flex flex-col justify-center"
            style={{
              animation: "slide-in-left 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.8s forwards",
            }}
          >
            <h3 className="font-mono text-xs text-green mb-6 border-b border-green/10 pb-2 uppercase tracking-[0.16em]">
              User Diagnostics
            </h3>
            <div className="flex flex-col gap-4 font-mono text-[10px] text-green/60 uppercase">
              <p className="overflow-hidden whitespace-nowrap border-r border-green animate-caret" style={{ animation: "read-out-type 0.3s steps(30, end) 1.0s forwards", width: 0 }}>
                &gt; USER: ashish@portfolio
              </p>
              <p className="overflow-hidden whitespace-nowrap border-r border-green animate-caret" style={{ animation: "read-out-type 0.3s steps(30, end) 1.12s forwards", width: 0 }}>
                &gt; ROLE: Full Stack Dev
              </p>
              <p className="overflow-hidden whitespace-nowrap border-r border-green animate-caret" style={{ animation: "read-out-type 0.3s steps(30, end) 1.24s forwards", width: 0 }}>
                &gt; CLEARANCE: LEVEL_MAX
              </p>
              <p className="overflow-hidden whitespace-nowrap border-r border-green animate-caret" style={{ animation: "read-out-type 0.3s steps(30, end) 1.36s forwards", width: 0 }}>
                &gt; LOCATION: Jaipur, IN
              </p>
              <p className="overflow-hidden whitespace-nowrap border-r border-green animate-caret" style={{ animation: "read-out-type 0.3s steps(30, end) 1.48s forwards", width: 0 }}>
                &gt; STATUS: AUTHENTICATED
              </p>
            </div>
          </aside>

          {/* Right panel */}
          <aside 
            className="absolute right-0 top-0 bottom-0 z-20 hidden w-[300px] border-l border-green/20 bg-green/[0.015] p-6 backdrop-blur-[6px] md:flex flex-col justify-center"
            style={{
              animation: "slide-in-right 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.8s forwards",
            }}
          >
            <h3 className="font-mono text-xs text-green mb-6 border-b border-green/10 pb-2 uppercase tracking-[0.16em]">
              Kernel Terminal
            </h3>
            <div className="flex flex-col gap-4 font-mono text-[10px] text-green/60 uppercase">
              <p className="overflow-hidden whitespace-nowrap border-r border-green animate-caret" style={{ animation: "read-out-type 0.3s steps(30, end) 1.0s forwards", width: 0 }}>
                &gt; SESSION: #a3f2b1c
              </p>
              <p className="overflow-hidden whitespace-nowrap border-r border-green animate-caret" style={{ animation: "read-out-type 0.3s steps(30, end) 1.12s forwards", width: 0 }}>
                &gt; KERNEL: Next.js 14.2
              </p>
              <p className="overflow-hidden whitespace-nowrap border-r border-green animate-caret" style={{ animation: "read-out-type 0.3s steps(30, end) 1.24s forwards", width: 0 }}>
                &gt; BUILD: COMPILING_#247
              </p>
              <p className="overflow-hidden whitespace-nowrap border-r border-green animate-caret" style={{ animation: "read-out-type 0.3s steps(30, end) 1.36s forwards", width: 0 }}>
                &gt; UPTIME: 47d 12h 08m
              </p>
              <p className="overflow-hidden whitespace-nowrap border-r border-green animate-caret" style={{ animation: "read-out-type 0.3s steps(30, end) 1.48s forwards", width: 0 }}>
                &gt; SECURE_SHELL: ACTIVE
              </p>
            </div>
          </aside>
        </>
      )}

      {/* -------------------------------------------------- */}
      {/* STAGE 2: BREACH / MATRIX EXPLOSION (2000ms - 4500ms) */}
      {/* -------------------------------------------------- */}
      {stage === "breach" && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
          {/* Warning Full-Screen Flickering Amber Overlay */}
          {warningType === "warn" && (
            <div 
              className="absolute inset-0 z-10 pointer-events-none"
              style={{ animation: "amber-flash 0.2s infinite" }}
            />
          )}

          {/* Red Bug Scatter Mesh (Explosion) */}
          <div className="absolute inset-0 z-15 overflow-hidden">
            {Array.from({ length: 20 }).map((_, idx) => {
              const angle = Math.random() * Math.PI * 2;
              const distance = 150 + Math.random() * 450;
              const tx = `${Math.cos(angle) * distance}px`;
              const ty = `${Math.sin(angle) * distance}px`;
              const rot = `${Math.random() * 360}deg`;
              return (
                <span
                  key={`red-bug-${idx}`}
                  className="absolute left-1/2 top-1/2 block h-[4px] w-[9px] rounded-sm bg-red shadow-[0_0_8px_#ff003c]"
                  style={{
                    "--tx": tx,
                    "--ty": ty,
                    "--rot": rot,
                    animation: "red-mesh-scatter 1.2s cubic-bezier(0.1, 0.8, 0.3, 1) forwards",
                    animationDelay: `${idx * 80}ms`,
                  } as React.CSSProperties}
                />
              );
            })}
          </div>

          {/* Glitch center text */}
          <h2 
            className="text-center font-display text-[32px] md:text-[64px] font-black text-[#e8e8f0]"
            style={{
              animation: "text-glitch 0.5s linear infinite",
              textShadow: "0 0 15px rgba(255,255,255,0.25)",
            }}
          >
            {warningText ? (
              <span className={warningType === "warn" ? "text-amber-500" : "text-green"}>
                {warningText}
              </span>
            ) : (
              centerPhaseText
            )}
          </h2>

          {/* Equalizer / Sound visualizer bars at the bottom */}
          <div className="absolute bottom-16 left-1/2 z-30 flex -translate-x-1/2 items-end gap-[3px] h-[80px] px-6">
            {Array.from({ length: 40 }).map((_, idx) => {
              // React state triggers re-renders or CSS transitions.
              // For highest performance, we let CSS animations drive random height oscillations.
              const duration = `${0.3 + Math.random() * 0.4}s`;
              const delay = `${Math.random() * -0.5}s`;
              return (
                <div
                  key={`eq-bar-${idx}`}
                  className="w-[3px] rounded-t-sm bg-gradient-to-t from-green to-green/20"
                  style={{
                    animation: `eq-height 0.8s ease-in-out ${delay} infinite alternate`,
                    height: "16px",
                  }}
                />
              );
            })}
            <style dangerouslySetInnerHTML={{ __html: `
              @keyframes eq-height {
                0% { height: 10px; }
                100% { height: 75px; opacity: 0.8; }
              }
            ` }} />
          </div>
        </div>
      )}

      {/* -------------------------------------------------- */}
      {/* STAGE 3: TUNNEL / WORMHOLE (4500ms - 7000ms) */}
      {/* -------------------------------------------------- */}
      {stage === "tunnel" && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-end pb-24 pointer-events-none">
          <p 
            className="font-mono text-xs md:text-sm tracking-[0.3em] text-green/60 uppercase"
            style={{
              textShadow: "0 0 10px rgba(0,255,65,0.3)",
            }}
          >
            {/* Typing reveal or simple text layout */}
            {tunnelTypedText}
          </p>
        </div>
      )}

      {/* -------------------------------------------------- */}
      {/* STAGE 4: SYSTEMS LOADING (7000ms - 9500ms) */}
      {/* -------------------------------------------------- */}
      {stage === "systems" && (
        <div 
          className="absolute inset-0 z-30 flex items-center justify-center p-6 md:p-12 pointer-events-none"
          style={{
            animation: "panel-flash-collapse 0.5s cubic-bezier(0.755, 0.05, 0.855, 0.06) 2000ms forwards",
          }}
        >
          {/* SVG data flow streams connecting panels */}
          <svg className="absolute inset-0 h-full w-full pointer-events-none z-0 hidden md:block">
            {/* Simple geometric lines that animate dash-offset */}
            <path d="M 150 150 L 850 150 M 150 150 L 150 450 M 850 150 L 850 450 M 150 450 L 850 450" fill="none" stroke="rgba(0, 255, 65, 0.1)" strokeWidth="1" />
            <path 
              d="M 150 150 L 850 150 M 150 150 L 150 450 M 850 150 L 850 450 M 150 450 L 850 450" 
              fill="none" 
              stroke="rgba(0, 255, 65, 0.45)" 
              strokeWidth="1.5" 
              strokeDasharray="20 40" 
              strokeDashoffset="100"
              style={{ animation: "ecg-dash 1.5s linear infinite" }}
            />
          </svg>

          <div className="relative z-10 grid w-full max-w-[900px] gap-4 grid-cols-2 md:grid-cols-3">
            {/* Panel 1 */}
            <div 
              className="rounded-xl border border-green/15 bg-green/[0.02] p-4 backdrop-blur-md flex flex-col justify-between"
              style={{
                animation: "panel-stagger-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0ms forwards",
                opacity: 0,
              }}
            >
              <div>
                <p className="font-mono text-[9px] text-[#444] uppercase tracking-[0.1em]">Engine</p>
                <h4 className="font-mono text-[11px] text-green font-bold uppercase mt-1">RENDERING ENGINE</h4>
              </div>
              <div className="mt-4">
                <div className="relative h-1 w-full bg-white/[0.05] rounded overflow-hidden">
                  <div className="h-full bg-green rounded" style={{ width: "100%", transition: "width 1.2s ease-out 0.1s" }} />
                </div>
                <p className="font-mono text-[9px] text-green/50 mt-2">Three.js v155 · WebGL 2.0</p>
              </div>
            </div>

            {/* Panel 2 */}
            <div 
              className="rounded-xl border border-green/15 bg-green/[0.02] p-4 backdrop-blur-md flex flex-col justify-between"
              style={{
                animation: "panel-stagger-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) 280ms forwards",
                opacity: 0,
              }}
            >
              <div>
                <p className="font-mono text-[9px] text-[#444] uppercase tracking-[0.1em]">Data Core</p>
                <h4 className="font-mono text-[11px] text-green font-bold uppercase mt-1">PORTFOLIO DATA</h4>
              </div>
              <div className="mt-2 font-mono text-[9px] text-green/60 leading-relaxed">
                <p style={{ opacity: 0, animation: "panel-stagger-in 0.2s 200ms forwards" }}>✓ Projects: 3 loaded</p>
                <p style={{ opacity: 0, animation: "panel-stagger-in 0.2s 400ms forwards" }}>✓ Skills: 24 modules</p>
                <p style={{ opacity: 0, animation: "panel-stagger-in 0.2s 600ms forwards" }}>✓ Wins: 6 records</p>
              </div>
            </div>

            {/* Panel 3 */}
            <div 
              className="rounded-xl border border-green/15 bg-green/[0.02] p-4 backdrop-blur-md flex flex-col justify-between"
              style={{
                animation: "panel-stagger-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) 560ms forwards",
                opacity: 0,
              }}
            >
              <div>
                <p className="font-mono text-[9px] text-[#444] uppercase tracking-[0.1em]">Shell</p>
                <h4 className="font-mono text-[11px] text-green font-bold uppercase mt-1">TERMINAL SHELL</h4>
              </div>
              <div className="mt-2 font-mono text-[9px] text-green/40 leading-normal">
                <p style={{ opacity: 0, animation: "panel-stagger-in 0.2s 180ms forwards" }}>&gt; bash --init</p>
                <p style={{ opacity: 0, animation: "panel-stagger-in 0.2s 360ms forwards" }}>&gt; source ~/.bashrc</p>
                <p className="text-green/80" style={{ opacity: 0, animation: "panel-stagger-in 0.2s 540ms forwards" }}>&gt; export ENV=prod</p>
              </div>
            </div>

            {/* Panel 4 */}
            <div 
              className="rounded-xl border border-green/15 bg-green/[0.02] p-4 backdrop-blur-md flex flex-col justify-between"
              style={{
                animation: "panel-stagger-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) 840ms forwards",
                opacity: 0,
              }}
            >
              <div>
                <p className="font-mono text-[9px] text-[#444] uppercase tracking-[0.1em]">Physics</p>
                <h4 className="font-mono text-[11px] text-green font-bold uppercase mt-1">3D UNIVERSE</h4>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <div className="h-6 w-6 border border-green/30 rounded flex items-center justify-center animate-spin" style={{ animationDuration: "3s" }}>
                  <span className="h-2 w-2 bg-green/60 rounded-full" />
                </div>
                <div className="font-mono text-[9px] text-green/50 text-right">
                  <p>Particles: 2800</p>
                  <p>Bugs: 20</p>
                </div>
              </div>
            </div>

            {/* Panel 5 */}
            <div 
              className="rounded-xl border border-green/15 bg-green/[0.02] p-4 backdrop-blur-md flex flex-col justify-between"
              style={{
                animation: "panel-stagger-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) 1120ms forwards",
                opacity: 0,
              }}
            >
              <div>
                <p className="font-mono text-[9px] text-[#444] uppercase tracking-[0.1em]">API</p>
                <h4 className="font-mono text-[11px] text-green font-bold uppercase mt-1">CONNECTIONS</h4>
              </div>
              <div className="mt-2 font-mono text-[9px] text-green/60 leading-relaxed">
                <p style={{ opacity: 0, animation: "panel-stagger-in 0.2s 200ms forwards" }}>✓ GitHub connected</p>
                <p style={{ opacity: 0, animation: "panel-stagger-in 0.2s 400ms forwards" }}>✓ LinkedIn active</p>
                <p style={{ opacity: 0, animation: "panel-stagger-in 0.2s 600ms forwards" }}>✓ Email ready</p>
              </div>
            </div>

            {/* Panel 6 */}
            <div 
              className="rounded-xl border border-green/15 bg-green/[0.02] p-4 backdrop-blur-md flex flex-col justify-between"
              style={{
                animation: "panel-stagger-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) 1400ms forwards",
                opacity: 0,
              }}
            >
              <div>
                <p className="font-mono text-[9px] text-[#444] uppercase tracking-[0.1em]">Hardware</p>
                <h4 className="font-mono text-[11px] text-green font-bold uppercase mt-1">SYSTEM STATUS</h4>
              </div>
              <div className="mt-2 font-mono text-[9px] text-green/70 leading-normal">
                <p>● CPU: Optimal</p>
                <p>● Memory: 8.0/10</p>
                <p>● Network: Stable</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------- */}
      {/* STAGE 5: WELCOME REVEAL (9500ms - 11500ms) */}
      {/* -------------------------------------------------- */}
      {stage === "welcome" && (
        <div 
          className="absolute inset-0 z-40 flex flex-col items-center justify-center p-6 text-center pointer-events-none"
          style={{
            animation: isSkipped
              ? "final-welcome-fadeout 0.2s ease-out 400ms forwards"
              : "final-welcome-fadeout 0.6s ease-out 1400ms forwards",
          }}
        >
          {/* White flash overlay */}
          <div 
            className="absolute inset-0 z-50 bg-white pointer-events-none opacity-0"
            style={{
              animation: isSkipped 
                ? "white-flash-anim 0.3s linear forwards" 
                : "white-flash-anim 1s linear forwards",
            }}
          />

          {/* Logo assembly with scatter physics simulation */}
          <h1 className="font-display text-[54px] md:text-[120px] font-black uppercase tracking-[-0.02em] text-green select-none">
            {"ASHISHOS".split("").map((letter, idx) => {
              // Generate random dx / dy for scatter effect
              const angles = [45, 120, -60, 210, -135, 300, -20, 80];
              const dist = isSkipped ? 60 : (180 + Math.random() * 120);
              const angleRad = (angles[idx % angles.length] * Math.PI) / 180;
              const dx = `${Math.cos(angleRad) * dist}px`;
              const dy = `${Math.sin(angleRad) * dist}px`;

              return (
                <span
                  key={`welcome-letter-${idx}`}
                  className={`welcome-letter ${
                    welcomeActive 
                      ? (isSkipped ? "welcome-pulse-active-skipped" : "welcome-pulse-active") 
                      : ""
                  }`}
                  style={{
                    "--lx": dx,
                    "--ly": dy,
                    animationDuration: isSkipped ? "0.25s" : "0.8s",
                    animationDelay: isSkipped ? `${idx * 15}ms` : `${idx * 60}ms`,
                  } as React.CSSProperties}
                >
                  {letter}
                </span>
              );
            })}
          </h1>

          {/* Subtitle */}
          <p 
            className="mt-6 font-mono text-[10px] md:text-[14px] uppercase tracking-[0.25em] text-[#555]"
            style={{
              opacity: 0,
              animation: isSkipped
                ? "panel-stagger-in 0.2s ease-out 200ms forwards"
                : "panel-stagger-in 0.4s ease-out 1300ms forwards",
            }}
          >
            v1.0.0 — SYSTEM READY
          </p>

          {/* Horizontal fast sweeping lines */}
          <div className="absolute inset-x-0 top-[35%] h-[1px] bg-green/45 overflow-hidden z-10 pointer-events-none">
            <div 
              className="absolute h-full w-[250px] bg-gradient-to-r from-transparent via-green to-transparent" 
              style={{ 
                animation: isSkipped 
                  ? "sweep-horizontal 0.15s linear 100ms forwards" 
                  : "sweep-horizontal 0.8s linear 1000ms forwards", 
                left: "-250px" 
              }} 
            />
          </div>
          <div className="absolute inset-x-0 top-[50%] h-[1px] bg-green/45 overflow-hidden z-10 pointer-events-none">
            <div 
              className="absolute h-full w-[250px] bg-gradient-to-r from-transparent via-green to-transparent" 
              style={{ 
                animation: isSkipped 
                  ? "sweep-horizontal 0.15s linear 200ms forwards" 
                  : "sweep-horizontal 0.8s linear 2100ms forwards", 
                left: "-250px" 
              }} 
            />
          </div>
          <div className="absolute inset-x-0 top-[65%] h-[1px] bg-green/45 overflow-hidden z-10 pointer-events-none">
            <div 
              className="absolute h-full w-[250px] bg-gradient-to-r from-transparent via-green to-transparent" 
              style={{ 
                animation: isSkipped 
                  ? "sweep-horizontal 0.15s linear 300ms forwards" 
                  : "sweep-horizontal 0.8s linear 3200ms forwards", 
                left: "-250px" 
              }} 
            />
          </div>
        </div>
      )}

      {/* -------------------------------------------------- */}
      {/* PERSISTENT HUD ELEMENTS */}
      {/* -------------------------------------------------- */}
      {/* ECG Heartbeat Line (Stage 3 & 4) */}
      {(stage === "tunnel" || stage === "systems") && (
        <div className="absolute bottom-6 left-6 z-20 w-[180px] h-[30px] opacity-30 pointer-events-none">
          <svg viewBox="0 0 180 30" className="h-full w-full">
            <path
              d={
                heartbeatJagged
                  ? "M 0 15 L 20 15 L 25 2 L 30 28 L 35 15 L 50 15 L 55 5 L 60 25 L 65 15 L 80 15 L 85 10 L 90 20 L 95 15 L 110 15 L 115 0 L 120 30 L 125 15 L 140 15 L 145 15 L 180 15"
                  : "M 0 15 L 40 15 L 45 3 L 50 27 L 55 15 L 90 15 L 95 3 L 100 27 L 105 15 L 140 15 L 180 15"
              }
              fill="none"
              stroke="#00ff41"
              strokeWidth="1.5"
              className="ecg-line"
            />
          </svg>
        </div>
      )}

      {/* Percentage corner metrics */}
      {(stage === "auth" || stage === "breach") && (
        <div className="absolute bottom-6 left-6 z-20 font-mono text-[9px] text-green/30 pointer-events-none select-none">
          INIT: {initPercent}% → 100%
        </div>
      )}

      {stage !== "welcome" && (
        <div className="absolute bottom-6 right-6 z-20 font-mono text-[9px] text-green/30 pointer-events-none select-none text-right">
          SYS_METRIC: {sysPercent}%
        </div>
      )}

      {/* Skip progress bar and button */}
      {!isSkipped && (
        <>
          {/* Skip progress bar */}
          <div 
            className="absolute bottom-0 left-0 h-[1px] bg-white pointer-events-none z-50"
            style={{
              backgroundColor: "rgba(255,255,255,0.15)",
              animation: "skip-progress-fill 11.5s linear forwards",
            }}
          />

          {/* Skip notification in bottom-right */}
          <button
            onClick={handleSkip}
            type="button"
            className="absolute z-50 rounded border border-white/5 bg-white/[0.02] px-2.5 py-1 font-mono text-[10px] hover:border-white/10 hover:bg-white/[0.05] transition-all cursor-pointer tracking-wider"
            style={{
              bottom: "28px",
              right: "28px",
              color: "rgba(255,255,255,0.2)",
            }}
          >
            PRESS ANY KEY TO SKIP
          </button>
        </>
      )}
    </div>
  );
}
