"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface CustomCursorProps {
  className?: string;
}

export function CustomCursor({ className }: CustomCursorProps): JSX.Element | null {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleMove = (event: MouseEvent): void => {
      setPosition({ x: event.clientX, y: event.clientY });
      setVisible(true);
    };

    const handleLeave = (): void => setVisible(false);

    window.addEventListener("mousemove", handleMove);
    document.body.addEventListener("mouseleave", handleLeave);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.body.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={cn(
        "pointer-events-none fixed z-[9999] h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-green mix-blend-difference",
        className
      )}
      style={{ left: position.x, top: position.y }}
      aria-hidden="true"
    />
  );
}
