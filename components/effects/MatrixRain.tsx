"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface MatrixRainProps {
  className?: string;
}

export function MatrixRain({ className }: MatrixRainProps): JSX.Element {
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

    const chars = "アイウエオカキクケコサシスセソ0123456789ABCDEF";
    const fontSize = 14;
    let columns = Math.floor(canvas.width / fontSize);
    let drops = Array.from({ length: columns }, () => 1);

    const draw = (): void => {
      ctx.fillStyle = "rgba(10, 10, 10, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#00ff41";
      ctx.font = `${fontSize}px JetBrains Mono, monospace`;

      columns = Math.floor(canvas.width / fontSize);
      if (drops.length !== columns) {
        drops = Array.from({ length: columns }, () => 1);
      }

      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        ctx.fillText(char, x, y * fontSize);

        if (y * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i] = y + 1;
      });
    };

    const interval = setInterval(draw, 33);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0 h-full w-full", className)}
      aria-hidden="true"
    />
  );
}
