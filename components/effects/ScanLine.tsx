"use client";

import { cn } from "@/lib/utils";

interface ScanLineProps {
  className?: string;
}

export function ScanLine({ className }: ScanLineProps): JSX.Element {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,255,65,0.03)_50%)] bg-[length:100%_4px]" />
      <div className="animate-scan absolute left-0 h-px w-full bg-green/20" />
    </div>
  );
}
