"use client";

import { AnimatePresence } from "framer-motion";
import { Suspense, useCallback, useRef } from "react";
import Window from "@/components/os/Window";
import { AboutApp } from "@/components/apps/AboutApp";
import { ProjectsApp } from "@/components/apps/ProjectsApp";
import { SkillsApp } from "@/components/apps/SkillsApp";
import TerminalApp from "@/components/apps/TerminalApp";
import { AchievementsApp } from "@/components/apps/AchievementsApp";
import { BlogApp } from "@/components/apps/BlogApp";
import { ContactApp } from "@/components/apps/ContactApp";
import { useOS } from "@/hooks/useOS";
import { useIsMobile } from "@/hooks/useMediaQuery";
import type { AppId } from "@/types/os";

interface WindowManagerProps {
  mobileAppId?: AppId;
}

function AppContent({ appId }: { appId: AppId }): JSX.Element {
  switch (appId) {
    case "about":
      return <AboutApp />;
    case "projects":
      return <ProjectsApp />;
    case "skills":
      return <SkillsApp />;
    case "terminal":
      return <TerminalApp />;
    case "achievements":
      return <AchievementsApp />;
    case "blog":
      return <BlogApp />;
    case "contact":
      return <ContactApp />;
    default: {
      const _exhaustive: never = appId;
      return (
        <p className="font-mono text-sm text-muted">Unknown app: {_exhaustive}</p>
      );
    }
  }
}

function AppLoading(): JSX.Element {
  return (
    <div className="flex h-full items-center justify-center">
      <p className="font-mono text-sm text-muted">Loading...</p>
    </div>
  );
}

export function WindowManager({ mobileAppId }: WindowManagerProps): JSX.Element | null {
  const { windows, activeWindowId, closeApp, focusApp, minimizeApp } = useOS();
  const isMobile = useIsMobile();
  const desktopBoundsRef = useRef<HTMLDivElement>(null);

  const visibleWindows = windows.filter((window) => !window.isMinimized);

  const handleClose = useCallback(
    (windowId: string) => () => {
      closeApp(windowId);
    },
    [closeApp]
  );

  const handleFocus = useCallback(
    (windowId: string) => () => {
      focusApp(windowId);
    },
    [focusApp]
  );

  const handleMinimize = useCallback(
    (windowId: string) => () => {
      minimizeApp(windowId);
    },
    [minimizeApp]
  );

  if (isMobile && mobileAppId) {
    return (
      <Suspense fallback={<AppLoading />}>
        <AppContent appId={mobileAppId} />
      </Suspense>
    );
  }

  if (isMobile) return null;

  return (
    <div
      ref={desktopBoundsRef}
      className="pointer-events-none fixed inset-0 bottom-12 z-[100]"
      aria-hidden={visibleWindows.length === 0}
    >
      <AnimatePresence>
        {visibleWindows.map((window) => (
          <Window
            key={window.id}
            id={window.id}
            title={window.title}
            defaultPosition={window.position}
            defaultSize={window.size}
            isActive={activeWindowId === window.id}
            isMinimized={window.isMinimized}
            zIndex={window.zIndex}
            dragConstraintsRef={desktopBoundsRef}
            onFocus={handleFocus(window.id)}
            onClose={handleClose(window.id)}
            onMinimize={handleMinimize(window.id)}
          >
            <Suspense fallback={<AppLoading />}>
              <AppContent appId={window.appId} />
            </Suspense>
          </Window>
        ))}
      </AnimatePresence>
    </div>
  );
}
