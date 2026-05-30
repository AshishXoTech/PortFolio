import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "green" | "purple" | "red" | "muted";
  className?: string;
}

const variantStyles: Record<NonNullable<BadgeProps["variant"]>, string> = {
  green: "border-green/30 bg-green/10 text-green",
  purple: "border-purple/30 bg-purple/10 text-purple",
  red: "border-red/30 bg-red/10 text-red",
  muted: "border-glass bg-glass text-muted",
};

export function Badge({
  children,
  variant = "green",
  className,
}: BadgeProps): JSX.Element {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded border px-2 py-0.5 font-mono text-xs",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
