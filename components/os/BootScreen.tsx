"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { useBootSequence } from "@/hooks/useBootSequence";

interface BootScreenProps {
  onBootComplete: () => void;
}

const BOOT_LOG_LINES = [
  "Booting AshishOS...",
  "",
  "Full Stack Engineer building systems, products, and developer-first experiences.",
  "",
  "Currently compiling: Java + DSA + System Design",
  "",
  "Target output: Software Engineer",
] as const;

const MATRIX_CHARS = "アイウエオカキクケ0123456789<>{}[]";
const COLUMN_COUNT = 30;
const FONT_SIZE = 14;
const FRAME_INTERVAL = 33;

interface MatrixColumn {
  x: number;
  y: number;
  speed: number;
}

function LogLine({ line }: { line: string }): JSX.Element {
  const okMarker = "[ OK ]";
  const okIndex = line.indexOf(okMarker);

  if (okIndex === -1) {
    return <span className="text-[#e8e8f0]">{line || "\u00A0"}</span>;
  }

  return (
    <>
      <span className="text-[#e8e8f0]">{line.slice(0, okIndex)}</span>
      <span className="font-bold text-[#00ff41]">{okMarker}</span>
    </>
  );
}

function MatrixCanvas(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    const resize = (): void => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const columns: MatrixColumn[] = Array.from({ length: COLUMN_COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      speed: 2 + Math.random() * 3,
    }));

    const draw = (): void => {
      ctx.fillStyle = "rgba(5, 5, 16, 0.12)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${FONT_SIZE}px "JetBrains Mono", monospace`;
      ctx.textBaseline = "top";

      columns.forEach((column) => {
        const char =
          MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];

        ctx.fillStyle = "#00ff41";
        ctx.fillText(char, column.x, column.y);

        column.y += column.speed;

        if (column.y > canvas.height + FONT_SIZE) {
          column.y = -FONT_SIZE;
          column.x = Math.random() * canvas.width;
          column.speed = 2 + Math.random() * 3;
        }
      });
    };

    const interval = window.setInterval(draw, FRAME_INTERVAL);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}

export default function BootScreen({
  onBootComplete,
}: BootScreenProps): JSX.Element {
  const { stage, skipBoot } = useBootSequence(onBootComplete);
  const [visibleLogCount, setVisibleLogCount] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);

  const handleSkip = useCallback(() => {
    skipBoot();
  }, [skipBoot]);

  useEffect(() => {
    const onKeyDown = (): void => {
      handleSkip();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleSkip]);

  useEffect(() => {
    if (stage !== "logs") {
      setVisibleLogCount(0);
      return undefined;
    }

    let count = 0;
    const interval = window.setInterval(() => {
      count += 1;
      setVisibleLogCount(count);

      if (count >= BOOT_LOG_LINES.length) {
        window.clearInterval(interval);
      }
    }, 160);

    return () => window.clearInterval(interval);
  }, [stage]);

  useEffect(() => {
    if (stage !== "progress") {
      setProgressPercent(0);
      return undefined;
    }

    const start = performance.now();
    const duration = 1000;

    let frameId = 0;
    const tick = (now: number): void => {
      const elapsed = now - start;
      const next = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgressPercent(next);

      if (elapsed < duration) {
        frameId = window.requestAnimationFrame(tick);
      }
    };

    frameId = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(frameId);
  }, [stage]);

  return (
    <div
      className="fixed inset-0 z-50 cursor-default bg-[#050510]"
      onClick={handleSkip}
      role="presentation"
    >
      {(stage === "matrix" || stage === "logs") && (
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 1 }}
          animate={{ opacity: stage === "matrix" ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        >
          <MatrixCanvas />
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {stage === "logs" && (
          <motion.div
            key="logs"
            className="absolute inset-0 flex items-center bg-[#050510] px-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-full max-w-3xl font-mono text-[13px] leading-relaxed">
              {BOOT_LOG_LINES.slice(0, visibleLogCount).map((line, index) => (
                <motion.p
                  key={`${line}-${index}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.1 }}
                >
                  <LogLine line={line} />
                </motion.p>
              ))}
            </div>
          </motion.div>
        )}

        {stage === "progress" && (
          <motion.div
            key="progress"
            className="absolute inset-0 flex flex-col items-center justify-center bg-[#050510]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <p className="mb-3 font-sans text-[11px] tracking-[0.35em] text-[#4a4a6a]">
              AshishOS
            </p>
            <p className="mb-2 font-mono text-[11px] text-[#00ff41]">
              {progressPercent}%
            </p>
            <div className="h-[3px] w-full max-w-[400px] overflow-hidden rounded-[2px] bg-[#1a1a1a]">
              <motion.div
                className="h-full rounded-[2px] bg-[#00ff41]"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{
                  duration: 1,
                  type: "spring",
                  stiffness: 60,
                  damping: 15,
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {stage === "flash" && (
        <motion.div
          className="pointer-events-none absolute inset-0 bg-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.18, times: [0, 0.5, 1], ease: "linear" }}
          aria-hidden="true"
        />
      )}

      {stage !== "flash" && (
        <p className="pointer-events-none fixed bottom-4 right-4 font-sans text-[11px] text-[#4a4a6a]">
          Press any key to skip
        </p>
      )}
    </div>
  );
}
