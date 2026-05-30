import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export function GlassCard({ children, className }: GlassCardProps): JSX.Element {
  return (
    <div
      className={cn(
        "rounded-lg border border-glass bg-glass backdrop-blur-glass",
        className
      )}
    >
      {children}
    </div>
  );
}
