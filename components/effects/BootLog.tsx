"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const BOOT_LOGS = [
  "[OK] Initializing AshishOS kernel v1.0...",
  "[OK] Loading Next.js 14 App Router module",
  "[OK] Mounting TypeScript strict mode compiler",
  "[OK] Connecting to PostgreSQL driver (simulated)",
  "[OK] Starting Framer Motion animation engine",
  "[OK] Loading Three.js WebGL renderer",
  "[OK] Registering portfolio applications...",
  "[OK] about.app — loaded",
  "[OK] projects.app — loaded",
  "[OK] terminal.app — loaded",
  "[OK] All systems nominal. Welcome, Ashish.",
];

interface BootLogProps {
  className?: string;
  onComplete?: () => void;
}

export function BootLog({ className, onComplete }: BootLogProps): JSX.Element {
  const [visibleLogs, setVisibleLogs] = useState<string[]>([]);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index >= BOOT_LOGS.length) {
        clearInterval(interval);
        onComplete?.();
        return;
      }
      setVisibleLogs((prev) => [...prev, BOOT_LOGS[index]]);
      index += 1;
    }, 350);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className={cn("space-y-1 font-mono text-sm text-green", className)}>
      {visibleLogs.map((log) => (
        <p key={log}>{log}</p>
      ))}
    </div>
  );
}
