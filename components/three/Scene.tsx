"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { cn } from "@/lib/utils";

const SceneInner = dynamic(() => import("./SceneInner"), {
  ssr: false,
  loading: () => null,
});

interface SceneProps {
  className?: string;
}

export function Scene({ className }: SceneProps): JSX.Element {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0 z-0", className)}
      aria-hidden="true"
    >
      <Suspense fallback={null}>
        <SceneInner />
      </Suspense>
    </div>
  );
}
