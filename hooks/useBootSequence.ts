"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type BootSequenceStage = "matrix" | "logs" | "progress" | "flash";

const STAGE_DURATIONS: Record<BootSequenceStage, number> = {
  matrix: 2200,
  logs: 2800,
  progress: 1200,
  flash: 180,
};

interface UseBootSequenceReturn {
  stage: BootSequenceStage;
  skipBoot: () => void;
}

export function useBootSequence(
  onBootComplete: () => void
): UseBootSequenceReturn {
  const [stage, setStage] = useState<BootSequenceStage>("matrix");
  const completedRef = useRef(false);

  const complete = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    onBootComplete();
  }, [onBootComplete]);

  const skipBoot = useCallback(() => {
    complete();
  }, [complete]);

  useEffect(() => {
    if (completedRef.current) return undefined;

    const duration = STAGE_DURATIONS[stage];
    const timer = window.setTimeout(() => {
      if (completedRef.current) return;

      if (stage === "matrix") {
        setStage("logs");
      } else if (stage === "logs") {
        setStage("progress");
      } else if (stage === "progress") {
        setStage("flash");
      } else {
        complete();
      }
    }, duration);

    return () => window.clearTimeout(timer);
  }, [stage, complete]);

  return { stage, skipBoot };
}
