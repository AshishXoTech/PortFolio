"use client";

import { cn } from "@/lib/utils";

interface GlitchTextProps {
  children: string;
  isGlitching?: boolean;
  className?: string;
}

export function GlitchText({
  children,
  isGlitching = false,
  className,
}: GlitchTextProps): JSX.Element {
  return (
    <span
      className={cn(
        "relative inline-block font-mono",
        isGlitching && "animate-pulse text-red",
        className
      )}
      data-text={children}
    >
      {children}
      {isGlitching && (
        <>
          <span
            className="absolute left-0 top-0 -translate-x-[2px] text-purple opacity-70"
            aria-hidden="true"
          >
            {children}
          </span>
          <span
            className="absolute left-0 top-0 translate-x-[2px] text-green opacity-70"
            aria-hidden="true"
          >
            {children}
          </span>
        </>
      )}
    </span>
  );
}
