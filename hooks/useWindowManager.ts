"use client";

import { useCallback } from "react";
import { useOS } from "@/hooks/useOS";
import type { WindowState } from "@/types/os";

interface UseWindowManagerReturn {
  windows: WindowState[];
  activeWindowId: string | null;
  visibleWindows: WindowState[];
  openWindow: ReturnType<typeof useOS>["openApp"];
  closeWindow: ReturnType<typeof useOS>["closeApp"];
  focusWindow: ReturnType<typeof useOS>["focusApp"];
  minimizeWindow: ReturnType<typeof useOS>["minimizeApp"];
}

export function useWindowManager(): UseWindowManagerReturn {
  const { windows, activeWindowId, openApp, closeApp, focusApp, minimizeApp } =
    useOS();

  const visibleWindows = windows.filter((window) => !window.isMinimized);

  const openWindow = useCallback(
    (appId: Parameters<typeof openApp>[0]) => {
      openApp(appId);
    },
    [openApp]
  );

  const closeWindow = useCallback(
    (windowId: string) => {
      closeApp(windowId);
    },
    [closeApp]
  );

  const focusWindow = useCallback(
    (windowId: string) => {
      focusApp(windowId);
    },
    [focusApp]
  );

  const minimizeWindow = useCallback(
    (windowId: string) => {
      minimizeApp(windowId);
    },
    [minimizeApp]
  );

  return {
    windows,
    activeWindowId,
    visibleWindows,
    openWindow,
    closeWindow,
    focusWindow,
    minimizeWindow,
  };
}
