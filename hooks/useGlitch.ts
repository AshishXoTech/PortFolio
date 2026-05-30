"use client";

import { useCallback, useEffect, useState } from "react";

interface UseGlitchReturn {
  isGlitching: boolean;
  triggerGlitch: () => void;
}

export function useGlitch(duration = 300): UseGlitchReturn {
  const [isGlitching, setIsGlitching] = useState(false);

  const triggerGlitch = useCallback(() => {
    setIsGlitching(true);
  }, []);

  useEffect(() => {
    if (!isGlitching) return undefined;

    const timer = setTimeout(() => setIsGlitching(false), duration);
    return () => clearTimeout(timer);
  }, [isGlitching, duration]);

  return { isGlitching, triggerGlitch };
}
