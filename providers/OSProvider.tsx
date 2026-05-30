"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  AppId,
  BootStage,
  OSContextType,
  WindowState,
} from "@/types/os";

const INITIAL_Z_INDEX = 100;

const APP_META: Record<
  AppId,
  {
    title: string;
    defaultSize: { width: number; height: number };
  }
> = {
  about: {
    title: "about.exe",
    defaultSize: { width: 780, height: 560 },
  },
  projects: {
    title: "projects.app",
    defaultSize: { width: 900, height: 600 },
  },
  skills: {
    title: "skills.sys",
    defaultSize: { width: 720, height: 500 },
  },
  terminal: {
    title: "terminal.sh",
    defaultSize: { width: 720, height: 460 },
  },
  achievements: {
    title: "achievements.log",
    defaultSize: { width: 680, height: 520 },
  },
  blog: {
    title: "blog.md",
    defaultSize: { width: 760, height: 560 },
  },
  contact: {
    title: "contact.cfg",
    defaultSize: { width: 640, height: 480 },
  },
};

function getMaxZIndex(windows: WindowState[]): number {
  if (windows.length === 0) return INITIAL_Z_INDEX;
  return windows.reduce((max, window) => Math.max(max, window.zIndex), INITIAL_Z_INDEX);
}

function getTopWindowId(windows: WindowState[]): string | null {
  const visible = windows.filter((window) => !window.isMinimized);
  if (visible.length === 0) return null;

  return visible.reduce((top, window) =>
    window.zIndex > top.zIndex ? window : top
  ).id;
}

export const OSContext = createContext<OSContextType | null>(null);

export function useOS(): OSContextType {
  const context = useContext(OSContext);

  if (!context) {
    throw new Error("useOS must be used within an OSProvider");
  }

  return context;
}

interface OSProviderProps {
  children: ReactNode;
}

function OSProvider({ children }: OSProviderProps): JSX.Element {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [bootStage, setBootStage] = useState<BootStage>("matrix");

  const focusApp = useCallback((id: string) => {
    setWindows((prev) => {
      const nextZIndex = getMaxZIndex(prev) + 1;
      return prev.map((window) =>
        window.id === id
          ? { ...window, zIndex: nextZIndex, isMinimized: false }
          : window
      );
    });
    setActiveWindowId(id);
  }, []);

  const openApp = useCallback(
    (appId: AppId) => {
      setWindows((prev) => {
        const existingOpen = prev.find(
          (window) => window.appId === appId && !window.isMinimized
        );

        if (existingOpen) {
          queueMicrotask(() => focusApp(existingOpen.id));
          return prev;
        }

        const existingMinimized = prev.find(
          (window) => window.appId === appId && window.isMinimized
        );

        if (existingMinimized) {
          queueMicrotask(() => focusApp(existingMinimized.id));
          return prev;
        }

        const meta = APP_META[appId];
        const newId = `${appId}-${Date.now()}`;
        const newWindow: WindowState = {
          id: newId,
          appId,
          title: meta.title,
          isMinimized: false,
          zIndex: getMaxZIndex(prev) + 1,
          position: {
            x: 80 + prev.length * 28,
            y: 60 + prev.length * 28,
          },
          size: { ...meta.defaultSize },
        };

        queueMicrotask(() => setActiveWindowId(newId));
        return [...prev, newWindow];
      });
    },
    [focusApp]
  );

  const closeApp = useCallback((id: string) => {
    setWindows((prev) => prev.filter((window) => window.id !== id));
    setActiveWindowId((current) => (current === id ? null : current));
  }, []);

  const minimizeApp = useCallback((id: string) => {
    setWindows((prev) => {
      const updated = prev.map((window) =>
        window.id === id ? { ...window, isMinimized: true } : window
      );
      setActiveWindowId(getTopWindowId(updated));
      return updated;
    });
  }, []);

  const value = useMemo<OSContextType>(
    () => ({
      windows,
      activeWindowId,
      bootStage,
      openApp,
      closeApp,
      focusApp,
      minimizeApp,
      setBootStage,
    }),
    [
      windows,
      activeWindowId,
      bootStage,
      openApp,
      closeApp,
      focusApp,
      minimizeApp,
    ]
  );

  return <OSContext.Provider value={value}>{children}</OSContext.Provider>;
}

export default OSProvider;
