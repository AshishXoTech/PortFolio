"use client";

import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  FolderKanban,
  Mail,
  Terminal,
  Trophy,
  User,
  Wrench,
} from "lucide-react";
import { EngineerUniverse } from "@/components/os/EngineerUniverse";
import { Taskbar } from "@/components/os/Taskbar";
import { WindowManager } from "@/components/os/WindowManager";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { useOS } from "@/hooks/useOS";
import type { AppId } from "@/types/os";

interface DesktopApp {
  id: AppId;
  label: string;
  icon: LucideIcon;
}

const DESKTOP_APPS: DesktopApp[] = [
  { id: "about", label: "About", icon: User },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "skills", label: "Skills", icon: Wrench },
  { id: "terminal", label: "Terminal", icon: Terminal },
  { id: "achievements", label: "Achievements", icon: Trophy },
  { id: "blog", label: "Blog", icon: BookOpen },
  { id: "contact", label: "Contact", icon: Mail },
];

export function Desktop(): JSX.Element {
  const isMobile = useIsMobile();
  const { activeWindowId, openApp, windows } = useOS();
  const activeAppId =
    windows.find((window) => window.id === activeWindowId)?.appId ?? null;

  if (isMobile) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <EngineerUniverse onOpenApp={openApp} windowActionsEnabled={false} />
        <main className="relative z-10 space-y-4 p-4">
          {DESKTOP_APPS.map((app) => (
            <section
              key={app.id}
              id={app.id}
              className="rounded-lg border border-glass bg-glass p-4 backdrop-blur-glass"
            >
              <div className="mb-3 flex items-center gap-2">
                <app.icon className="h-5 w-5 text-green" />
                <h2 className="font-mono text-sm text-text">{app.label}</h2>
              </div>
              <WindowManager mobileAppId={app.id} />
            </section>
          ))}
        </main>
        <Taskbar />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background">
      <nav
        className="fixed left-1/2 top-5 z-40 flex max-w-[calc(100vw-24px)] -translate-x-1/2 gap-1 overflow-x-auto rounded-full border border-[rgba(255,255,255,0.06)] bg-[rgba(5,5,16,0.8)] px-2 py-1.5 backdrop-blur-[20px]"
        aria-label="AshishOS apps"
      >
        {DESKTOP_APPS.map((app) => (
          <button
            key={app.id}
            type="button"
            onClick={() => openApp(app.id)}
            className={[
              "shrink-0 rounded-full px-4 py-[7px] font-mono text-[11px] transition-colors",
              activeAppId === app.id
                ? "bg-green/10 text-green"
                : "text-[#555] hover:text-[#999]",
            ].join(" ")}
          >
            {app.label}
          </button>
        ))}
      </nav>

      <EngineerUniverse onOpenApp={openApp} />
      <Taskbar />
    </div>
  );
}
